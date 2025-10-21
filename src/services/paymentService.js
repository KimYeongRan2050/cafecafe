// src/services/paymentService.js
import axios from "axios";

export const paymentService = async (orderInfo) => {
  try {
    // 백엔드와 경로 일치시킴
    const response = await axios.post("http://localhost:4000/api/pay", orderInfo);

    const redirectUrl = response?.data?.redirectUrl;
    if (!redirectUrl) {
      throw new Error("결제 URL이 없습니다.");
    }

    return { redirectUrl };
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw new Error(error.response?.data?.error || "결제 요청 실패");
  }
};
