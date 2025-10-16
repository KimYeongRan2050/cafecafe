const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const router = express.Router();

const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const CID = 'TC0ONETIME';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// UUID 형식 검증 함수
const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

// 결제 준비
router.post('/pay', async (req, res) => {
  const { productId, productName, quantity, price, table, customId } = req.body;

  if (!isUuid(productId)) {
    console.error('유효하지 않은 상품 ID:', productId);
    return res.status(400).json({ error: '유효하지 않은 상품 ID입니다.' });
  }

  if (!customId) {
    console.error('사용자 ID 누락');
    return res.status(400).json({ error: '로그인 정보가 누락되었습니다.' });
  }

  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  try {
    const response = await axios.post(
      'https://kapi.kakao.com/v1/payment/ready',
      new URLSearchParams({
        cid: CID,
        partner_order_id: orderId,
        partner_user_id: customId,
        item_name: productName,
        quantity,
        total_amount: price * quantity,
        vat_amount: 0,
        tax_free_amount: 0,
        approval_url: `http://localhost:5173/pay/success?order_id=${orderId}`,
        cancel_url: `http://localhost:5173/pay/cancel`,
        fail_url: `http://localhost:5173/pay/fail`,
      }),
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );

    const { error: insertError } = await supabase.from('orders').insert([
      {
        order_id: orderId,
        product_id: productId,
        product_name: productName,
        quantity,
        price,
        total_price: price * quantity,
        source_table: table, // 수정된 컬럼명
        custom_id: customId,
        tid: response.data.tid,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('주문 저장 실패:', insertError.message);
      return res.status(500).json({ error: '주문 저장 실패' });
    }

    res.json({ redirectUrl: response.data.next_redirect_pc_url });
  } catch (error) {
    console.error('카카오페이 요청 실패:', error.response?.data || error.message);
    res.status(500).json({ error: '결제 요청 실패' });
  }
});

// 결제 승인
router.get('/pay/success', async (req, res) => {
  const { pg_token, order_id } = req.query;

  try {
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', order_id)
      .limit(1);

    const order = data?.[0];

    if (fetchError || !order) {
      console.error('주문 조회 실패:', fetchError?.message || 'order not found');
      return res.status(400).send('주문 정보가 유실되었습니다.');
    }

    if (order.status === 'completed') {
      console.log('이미 승인된 주문입니다.');
      return res.redirect('/order/complete');
    }

    try {
      await axios.post(
        'https://kapi.kakao.com/v1/payment/approve',
        new URLSearchParams({
          cid: CID,
          tid: order.tid,
          partner_order_id: order.order_id,
          partner_user_id: order.custom_id,
          pg_token,
        }),
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      );
    } catch (error) {
      const errCode = error.response?.data?.code;
      if (errCode === -702) {
        console.warn('이미 승인된 거래입니다.');
        return res.redirect('/order/complete');
      }
      throw error;
    }

    const { data: productData, error: stockError } = await supabase
      .from(order.source_table) // 수정된 컬럼명
      .select('stock')
      .eq('id', order.product_id)
      .single();

    await supabase
      .from(order.source_table)
      .update({ stock: newStock })
      .eq('id', order.product_id);

    if (stockError || !productData) {
      console.error('재고 조회 실패:', stockError?.message);
      return res.status(500).send('재고 조회 실패');
    }

    const newStock = productData.stock - order.quantity;

    const { error: updateError } = await supabase
      .from(order.source_table)
      .update({ stock: newStock })
      .eq('id', order.product_id);

    if (updateError) {
      console.error('재고 업데이트 실패:', updateError.message);
      return res.status(500).send('재고 업데이트 실패');
    }

    await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('order_id', order.order_id);

    res.redirect('/order/complete');
  } catch (error) {
    console.error('결제 승인 실패:', error.response?.data || error.message);
    res.status(500).send('결제 승인 실패');
  }
});

module.exports = router;
