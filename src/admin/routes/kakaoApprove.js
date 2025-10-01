import express from "express";
import fetch from "node-fetch";
import { supabase } from "../supabaseClient.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/api/kakao-approve", async (req, res) => {
  const { tid, pg_token, user_id, product_id, quantity } = req.body;

  try {
    // 1. 결제 승인 요청
    const response = await fetch("https://kapi.kakao.com/v1/payment/approve", {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      body: new URLSearchParams({
        cid: "TC0ONETIME",
        tid,
        partner_order_id: `order-${Date.now()}`,
        partner_user_id: user_id,
        pg_token
      })
    });

    const data = await response.json();

    // 2. 상품 정보 조회
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single();

    if (productError || !product) throw new Error("상품 정보 오류");

    const total_price = product.price * quantity;

    // 3. 주문 저장
    await supabase.from("orders").insert([
      {
        product_id,
        quantity,
        total_price,
        user_id,
        created_at: new Date().toISOString()
      }
    ]);

    // 4. 재고 차감
    const newStock = product.stock - quantity;
    await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", product_id);

    res.json({ success: true, message: "결제 승인 및 주문 처리 완료" });
  } catch (error) {
    console.error("결제 승인 오류:", error.message);
    res.status(500).json({ error: "결제 승인 실패" });
  }
});

export default router;
