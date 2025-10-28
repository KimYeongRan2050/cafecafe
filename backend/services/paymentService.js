// backend/services/paymentService.js
import axios from "axios";

export async function preparePayment(orderInfo) {
  try {
    console.log("카카오페이 결제 요청 중...");

    const response = await axios.post(
      "https://kapi.kakaopay.com/v1/payment/ready",
      new URLSearchParams({
        cid: "TC0ONETIME",
        //partner_order_id: orderInfo.productId,
        partner_user_id: orderInfo.userEmail,
        item_name: orderInfo.productName,
        quantity: orderInfo.quantity,
        total_amount: orderInfo.price * orderInfo.quantity,
        tax_free_amount: 0,
        approval_url: "http://localhost:5173/pay/success",
        cancel_url: "http://localhost:5173/pay/cancel",
        fail_url: "http://localhost:5173/pay/fail",
      }),
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        timeout: 4000,
      }
    );

    console.log("카카오페이 결제 준비 완료:", response.data);
    return response.data;
  } catch (error) {
    console.warn("외부 통신 실패 → Mock 결제 사용:", error.message);

    const mockResponse = {
      mock: true,
      tid: `T_MOCK_${Date.now()}`,
      next_redirect_pc_url: "http://localhost:5173/pay/success?mock=true",
      //partner_order_id: orderInfo.productId,
      partner_user_id: orderInfo.userEmail,
      item_name: orderInfo.productName,
      quantity: orderInfo.quantity,
      total_amount: orderInfo.price * orderInfo.quantity,
      created_at: new Date().toISOString(),
    };

    console.log("Mock 결제 응답 반환:", mockResponse);
    return mockResponse;
  }
}
