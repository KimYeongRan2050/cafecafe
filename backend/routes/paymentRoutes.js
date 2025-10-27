import express from "express";
import { preparePayment, approvePayment } from "../services/paymentService.js";

const router = express.Router();

// 결제 준비
router.post("/pay", async (req, res) => {
  try {
    const orderInfo = req.body;
    console.log("카카오페이 결제 요청 수신:", orderInfo);

    const response = await preparePayment(orderInfo);
    res.json(response);
  } catch (error) {
    console.error("결제 준비 실패:", error);
    res.status(500).json({ error: "결제 준비 실패", details: error.message });
  }
});

// 결제 승인
router.get("/pay/success", async (req, res) => {
  const { pg_token, order_id } = req.query;
  console.log("결제 승인 요청 수신:", order_id, pg_token);

  try {
    const result = await approvePayment(order_id, pg_token);
    console.log("결제 승인 성공:", result);

    // redirect 대신 JSON으로 응답 (CORS 문제 방지)
    res.json({ success: true, message: "결제 승인 완료" });
  } catch (error) {
    console.error("결제 승인 실패:", error);
    res.status(500).json({ error: "결제 승인 실패", details: error.message });
  }
});

// 결제 취소
router.get("/pay/cancel", (req, res) => {
  console.log("결제 취소 요청 수신");
  res.json({ success: false, message: "결제가 취소되었습니다." });
});

// 결제 실패
router.get("/pay/fail", (req, res) => {
  console.log("결제 실패 요청 수신");
  res.json({ success: false, message: "결제에 실패했습니다." });
});

export default router;
