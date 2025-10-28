import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const router = express.Router();

// ✅ Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ 카카오페이 설정
const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const KAKAO_PAY_URL = "https://kapi.kakaopay.com/v1/payment/ready";

// ✅ 결제 요청
router.post("/pay", async (req, res) => {
  try {
    const { productId, productName, quantity, price, userName, userEmail, userPhone } = req.body;
    console.log("🟢 결제 요청 수신:", req.body);

    // ✅ 필수값 검증
    if (!productId || !productName || !price || !userEmail) {
      console.error("❌ 필수 결제 정보 누락");
      return res.status(400).json({ error: "필수 결제 정보가 누락되었습니다." });
    }

    // ✅ 카카오페이 결제 준비 요청
    let response;
    try {
      response = await axios.post(
        KAKAO_PAY_URL,
        {
          cid: "TC0ONETIME",
          partner_order_id: productId,
          partner_user_id: userEmail,
          item_name: productName,
          quantity,
          total_amount: price,
          vat_amount: 0,
          tax_free_amount: 0,
          approval_url: "http://localhost:5173/pay/success",
          cancel_url: "http://localhost:5173/pay/cancel",
          fail_url: "http://localhost:5173/pay/fail",
        },
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
          timeout: 4000,
        }
      );
      console.log("✅ 카카오페이 결제 준비 완료:", response.data);
    } catch (error) {
      console.warn("⚠️ 외부 통신 실패 → Mock 결제 사용:", error.message);
      response = {
        data: {
          tid: `T_MOCK_${Date.now()}`,
          next_redirect_pc_url: "http://localhost:5173/pay/success?mock=true",
        },
        mock: true,
      };
    }

    // ✅ Supabase에 주문 저장
    const { error: insertError } = await supabase.from("orders").insert([
      {
        product_id: productId,
        product_name: productName,
        quantity,
        price,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        tid: response.data.tid,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("❌ Supabase 저장 실패:", insertError);
      return res.status(500).json({ error: "주문정보 저장 실패" });
    }

    console.log("✅ 주문정보 Supabase 저장 완료");
    res.json({
      next_redirect_pc_url: response.data.next_redirect_pc_url,
      tid: response.data.tid,
      mock: response.mock || false,
    });
  } catch (err) {
    console.error("❌ 서버 오류:", err.message);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

export default router;
