// services/paymentService.js
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const CID = 'TC0ONETIME';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

async function preparePayment({ productId, productName, quantity, price, table, customId }) {
  if (!isUuid(productId)) throw new Error('유효하지 않은 상품 ID입니다.');
  if (!customId) throw new Error('로그인 정보가 누락되었습니다.');

  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  // 카카오페이 결제 준비 요청
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

  // 주문 데이터 저장
  const { error: insertError } = await supabase.from('orders').insert([
    {
      order_id: orderId,
      product_id: productId,
      product_name: productName,
      quantity,
      price,
      total_price: price * quantity,
      source_table: table,
      custom_id: customId,
      tid: response.data.tid,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) throw new Error('주문 저장 실패: ' + insertError.message);

  return { redirectUrl: response.data.next_redirect_pc_url };
}

async function approvePayment(orderId, pgToken) {
  console.log('🟢 approvePayment() 시작', orderId, pgToken);

  const { data, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .limit(1);

  if (fetchError) {
    console.error('❌ 주문 조회 에러:', fetchError);
    throw new Error('주문 조회 중 오류 발생');
  }

  const order = data?.[0];
  if (!order) {
    console.error('❌ 주문 데이터 없음:', orderId);
    throw new Error('주문 정보가 유실되었습니다.');
  }

  if (order.status === 'completed') {
    console.log('이미 승인 완료된 주문입니다.');
    return { alreadyApproved: true };
  }

  // 카카오페이 결제 승인 요청
  try {
    await axios.post(
      'https://kapi.kakao.com/v1/payment/approve',
      new URLSearchParams({
        cid: CID,
        tid: order.tid,
        partner_order_id: order.order_id,
        partner_user_id: order.custom_id,
        pg_token: pgToken,
      }),
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );
  } catch (error) {
    console.error('❌ 카카오페이 승인 실패:', error.response?.data || error.message);
    throw new Error('카카오페이 승인 실패');
  }

  // 재고 감소 처리
  const { data: productData, error: stockError } = await supabase
    .from(order.source_table)
    .select('stock')
    .eq('id', order.product_id)
    .single();

  if (stockError || !productData) throw new Error('재고 조회 실패');

  const newStock = productData.stock - order.quantity;

  const { error: updateError } = await supabase
    .from(order.source_table)
    .update({ stock: newStock })
    .eq('id', order.product_id);

  if (updateError) throw new Error('재고 업데이트 실패');

  await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('order_id', order.order_id);

  console.log('✅ 결제 승인 및 재고 업데이트 완료');
  return { success: true };
}

module.exports = {
  preparePayment,
  approvePayment,
};
