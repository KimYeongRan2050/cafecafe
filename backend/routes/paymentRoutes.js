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

  try {
    const result = await approvePayment(order_id, pg_token);
    res.redirect('/order/complete');
  } catch (error) {
    console.error('결제 승인 실패:', error.message);
    res.status(500).send('결제 승인 실패');
  }
});

module.exports = router;
