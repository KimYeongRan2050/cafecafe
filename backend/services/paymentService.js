import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const FRONT_URL = "http://localhost:5173";

export async function preparePayment(orderInfo) {
  const { productId, productName, quantity, price, table, userEmail } = orderInfo;
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
      total_amount: price,
      vat_amount: 0,
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

  console.log("결제 준비 완료:", response.data.next_redirect_pc_url);
  return { redirectUrl: response.data.next_redirect_pc_url };
}

export async function approvePayment(orderId, pgToken) {
  console.log("approvePayment 실행:", orderId, pgToken);

  const response = await axios.post(
    "https://kapi.kakaopay.com/v1/payment/approve",
    new URLSearchParams({
      cid: "TC0ONETIME",
      partner_order_id: orderId,
      partner_user_id: "user1234",
      pg_token: pgToken,
    }),
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  console.log("결제 승인 및 문자발송 완료");
  return response.data;
}
