// backend/routes/paymentRoutes.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/* ---------------------------------------------
 * 결제 요청 (POST /api/pay)
 * --------------------------------------------- */
router.post("/pay", async (req, res) => {
  try {
    const { productId, productName, quantity, price, userName, userEmail, userPhone } = req.body;

    // 🧾 주문 생성 (결제대기) — total_price 제외
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          product_id: productId,
          product_name: productName,
          quantity,
          price,
          user_name: userName,
          user_email: userEmail,
          user_phone: userPhone,
          payment_status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;
    console.log("주문정보 Supabase 저장 완료:", order);

    // ⚙️ 카카오페이 결제 준비 (실패 시 Mock으로 대체)
    try {
      const kakaoResponse = await axios.post(
        "https://kapi.kakaopay.com/v1/payment/ready",
        {
          cid: process.env.KAKAO_CID,
          partner_order_id: order.id,
          partner_user_id: userEmail,
          item_name: productName,
          quantity,
          total_amount: price * quantity, // 💰 결제금액 전달
          tax_free_amount: 0,
          approval_url: `http://localhost:5173/pay/success?order_id=${order.id}`,
          cancel_url: "http://localhost:5173/pay/cancel",
          fail_url: "http://localhost:5173/pay/fail",
        },
        {
          headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      console.log("카카오페이 결제 준비 성공:", kakaoResponse.data);
      return res.json(kakaoResponse.data);
    } catch (error) {
      console.warn("⚠️ 카카오페이 연결 실패 → Mock 결제 사용:", error.message);
      return res.json({
        next_redirect_pc_url: `http://localhost:5173/pay/success?mock=true&order_id=${order.id}`,
        mock: true,
      });
    }
  } catch (error) {
    console.error("결제 요청 실패:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ---------------------------------------------
 * 💰 결제 승인 처리 (GET /api/pay/success)
 * --------------------------------------------- */
router.get("/pay/success", async (req, res) => {
  const { mock, order_id, tid, pg_token } = req.query;
  console.log("💰 결제 승인 요청:", req.query);

  try {
    // 1️⃣ 주문 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) throw new Error("해당 주문을 찾을 수 없습니다.");

    // 2️⃣ Mock 결제 처리 (테스트용)
    if (mock === "true") {
      console.log("🧩 Mock 결제 승인 중...");

      // 주문 상태만 업데이트 (total_price는 DB가 자동 계산)
      const { error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: "completed" })
        .eq("id", order.id);

      if (updateError) throw updateError;

      // 3️⃣ 재고 차감 (cafe_supplies)
      const { data: product, error: findError } = await supabase
        .from("cafe_supplies")
        .select("stock")
        .eq("id", order.product_id)
        .single();

      if (findError) throw findError;

      const newStock = Math.max(0, product.stock - order.quantity);

      const { error: stockError } = await supabase
        .from("cafe_supplies")
        .update({ stock: newStock })
        .eq("id", order.product_id);

      if (stockError) throw stockError;

      console.log(`Mock 결제 승인 완료 - ${order.product_name} 재고: ${product.stock} → ${newStock}`);

      return res.json({
        success: true,
        message: "Mock 결제 승인 및 재고 차감 완료",
        redirect_url: "http://localhost:5173/order-complete",
      });
    }

    // 3️⃣ 실제 카카오페이 결제 승인
    const response = await axios.post(
      "https://kapi.kakaopay.com/v1/payment/approve",
      {
        cid: process.env.KAKAO_CID,
        tid,
        partner_order_id: order_id,
        partner_user_id: "user",
        pg_token,
      },
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    console.log("카카오 결제 승인 완료:", response.data);

    // 주문 상태 업데이트
    await supabase.from("orders").update({ payment_status: "completed" }).eq("id", order_id);

    // 재고 차감
    const { data: product, error: prodError } = await supabase
      .from("cafe_supplies")
      .select("stock")
      .eq("id", order.product_id)
      .single();

    if (prodError) throw prodError;

    const newStock = Math.max(0, product.stock - order.quantity);

    await supabase.from("cafe_supplies").update({ stock: newStock }).eq("id", order.product_id);

    console.log(`실제 결제 승인 완료 - ${order.product_name} 재고: ${product.stock} → ${newStock}`);

    return res.json({
      success: true,
      message: "결제 승인 및 재고 차감 완료",
      redirect_url: "http://localhost:5173/order-complete",
    });
  } catch (error) {
    console.error("결제 승인 처리 오류:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
