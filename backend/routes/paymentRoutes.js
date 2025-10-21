// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { preparePayment, approvePayment } = require('../services/paymentService');

// 결제 준비
router.post('/pay', async (req, res) => {
  try {
    const result = await preparePayment(req.body);
    res.json(result);
  } catch (error) {
    console.error('결제 준비 실패:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 결제 승인
router.get('/pay/success', async (req, res) => {
  const { pg_token, order_id } = req.query;

  console.log('결제 승인 요청 수신');
  console.log('order_id:', order_id);
  console.log('pg_token:', pg_token);

  try {
    const result = await approvePayment(order_id, pg_token);
    console.log('결제 승인 성공:', result);
    res.json(result); // 확인용 JSON 응답 (테스트용)
  } catch (error) {
    console.error('결제 승인 실패:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
