// backend/paymentService.js
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const FRONT_URL = "http://localhost:5173";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * 카카오페이 결제 준비
 */
export async function preparePayment(orderInfo) {
  const { productId, productName, quantity, price, userEmail, userName } = orderInfo;
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  console.log("카카오페이 결제 준비:", orderId);

  const response = await axios.post(
    "https://kapi.kakaopay.com/v1/payment/ready",
    new URLSearchParams({
      cid: "TC0ONETIME",
      partner_order_id: orderId,
      partner_user_id: userEmail,
      item_name: productName,
      quantity,
      total_amount: price * quantity,
      vat_amount: 0,
      tax_free_amount: 0,
      approval_url: `${FRONT_URL}/pay/success?order_id=${orderId}&userEmail=${encodeURIComponent(
        userEmail
      )}&userName=${encodeURIComponent(userName)}&productName=${encodeURIComponent(
        productName
      )}&quantity=${quantity}&price=${price}`,
      cancel_url: `${FRONT_URL}/pay/cancel`,
      fail_url: `${FRONT_URL}/pay/fail`,
    }),
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  return { redirectUrl: response.data.next_redirect_pc_url };
}

/**
 * 결제 승인 + Supabase 저장
 */
export async function approvePayment(orderId, pgToken, query = {}) {
  const { userEmail, userName, productName, quantity, price } = query;

  const response = await axios.post(
    "https://kapi.kakaopay.com/v1/payment/approve",
    new URLSearchParams({
      cid: "TC0ONETIME",
      partner_order_id: orderId,
      partner_user_id: userEmail || "guest",
      pg_token: pgToken,
    }),
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  console.log("결제 승인 완료 — Supabase 저장 중...");

  const { error } = await supabase.from("orders").insert([
    {
      order_id: orderId,
      product_id: null,
      product_name: productName,
      quantity: Number(quantity),
      price: Number(price),
      total_price: Number(price) * Number(quantity),
      source_table: "barista_products",
      custom_id: userEmail,
      name: userName, // 주문자 이름 저장
      status: "completed",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) console.error("Supabase 저장 실패:", error.message);
  else console.log("Supabase 저장 성공!");

  return response.data;
}
