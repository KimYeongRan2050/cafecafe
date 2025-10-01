import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/api/kakao-pay", async (req, res) => {
  const { item_name, quantity, total_amount, user_id } = req.body;

  try {
    const response = await fetch("https://kapi.kakao.com/v1/payment/ready", {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      body: new URLSearchParams({
        cid: "TC0ONETIME",
        partner_order_id: `order-${Date.now()}`,
        partner_user_id: user_id,
        item_name,
        quantity,
        total_amount,
        tax_free_amount: 0,
        approval_url: "https://yourdomain.com/payment/success",
        cancel_url: "https://yourdomain.com/payment/cancel",
        fail_url: "https://yourdomain.com/payment/fail"
      })
    });

    const data = await response.json();
    res.json({ redirectUrl: data.next_redirect_pc_url, tid: data.tid });
  } catch (error) {
    console.error("카카오페이 오류:", error.message);
    res.status(500).json({ error: "결제 요청 실패" });
  }
});

export default router;
