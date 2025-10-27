import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const FRONT_URL = "http://localhost:5173";

/**
 * ✅ 카카오페이 결제 준비
 */
export async function preparePayment(orderInfo) {
  try {
    const { productId, productName, quantity, price, userEmail, userName } = orderInfo;
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    console.log("🟢 결제 요청 수신:", orderInfo);

    const response = await axios.post(
      "https://kapi.kakaopay.com/v1/payment/ready",
      new URLSearchParams({
        cid: "TC0ONETIME",
        partner_order_id: orderId,
        partner_user_id: userEmail,
        item_name: productName,
        quantity,
        total_amount: Number(price) * Number(quantity),
        tax_free_amount: 0,
        approval_url: `${FRONT_URL}/pay/success?order_id=${orderId}`,
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

    console.log("✅ 카카오페이 결제 준비 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 결제 준비 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || error.message);
  }
}

/**
 * ✅ 카카오페이 결제 승인 (프론트의 PaymentSuccess.jsx에서 호출)
 */
export async function approvePayment(orderId, pgToken) {
  try {
    const response = await axios.post(
      "https://kapi.kakaopay.com/v1/payment/approve",
      new URLSearchParams({
        cid: "TC0ONETIME",
        partner_order_id: orderId,
        partner_user_id: "user_temp",
        pg_token: pgToken,
      }),
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    console.log("✅ 결제 승인 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 결제 승인 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || error.message);
  }
}
