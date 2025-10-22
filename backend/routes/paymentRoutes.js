// routes/paymentRoutes.js
import express from "express";
import { preparePayment, approvePayment } from "../services/paymentService.js";

const router = express.Router();

// 결제 준비 (프론트에서 orderInfo 전달)
router.post("/pay", async (req, res) => {
  try {
    console.log("요청 Body:", req.body);
    const result = await preparePayment(req.body);
    res.json(result);
  } catch (error) {
    console.error("결제 준비 실패:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 결제 승인 (카카오페이 success callback)
router.get("/pay/success", async (req, res) => {
  const { pg_token, order_id } = req.query;

  console.log("결제 승인 요청 수신:", order_id, pg_token);

  try {
    const result = await approvePayment(order_id, pg_token);
    console.log("결제 승인 성공:", result);

    // 프론트 메인 페이지로 리디렉션
    res.redirect("http://localhost:5173/?success=1");
  } catch (error) {
    console.error("결제 승인 실패:", error);
    res.status(500).send("결제 승인 실패: " + error.message);
  }
});

export default router;
