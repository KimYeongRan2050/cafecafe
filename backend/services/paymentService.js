// services/paymentService.js
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const CID = "TC0ONETIME"; // 카카오페이 테스트 CID
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

// 결제 준비
export async function preparePayment({ productId, productName, quantity, price, table, customId }) {
  if (!productId || !productName || !quantity || !price)
    throw new Error("결제 요청 데이터가 누락되었습니다.");
  if (!isUuid(productId)) throw new Error("유효하지 않은 상품 ID입니다.");

  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  const response = await axios.post(
    "https://kapi.kakao.com/v1/payment/ready",
    new URLSearchParams({
      cid: CID,
      partner_order_id: orderId,
      partner_user_id: customId || "guest_user",
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
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  // 주문 정보 저장
  const { error: insertError } = await supabase.from("orders").insert([
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
      status: "pending",
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) throw new Error("주문 저장 실패: " + insertError.message);

  return { redirectUrl: response.data.next_redirect_pc_url };
}

// 결제 승인
export async function approvePayment(orderId, pgToken) {
  console.log("approvePayment() 실행:", orderId, pgToken);

  const { data, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (fetchError) throw new Error("주문 조회 실패");
  if (!data) throw new Error("주문 정보가 없습니다.");

  const order = data;

  // 카카오페이 결제 승인
  await axios.post(
    "https://kapi.kakao.com/v1/payment/approve",
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
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  // 재고 감소
  const { data: product, error: stockError } = await supabase
    .from(order.source_table)
    .select("stock")
    .eq("id", order.product_id)
    .single();

  if (stockError) throw new Error("상품 재고 조회 실패");

  const newStock = (product.stock || 0) - order.quantity;
  await supabase
    .from(order.source_table)
    .update({ stock: newStock })
    .eq("id", order.product_id);

  // 주문 상태 완료로 변경
  await supabase
    .from("orders")
    .update({ status: "completed" })
    .eq("order_id", order.order_id);

  console.log("결제 승인 및 재고 차감 완료");
  return { success: true };
}
