// frontend/src/services/paymentService.js
import axios from "axios";

export async function requestKakaoPay(orderInfo) {
  try {
    const response = await axios.post("http://localhost:4000/api/pay", orderInfo);
    console.log("카카오페이 결제 준비 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("카카오페이 요청 실패:", error);
    throw error;
  }
}
