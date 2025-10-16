import axios from 'axios';

export const paymentService = async (orderInfo) => {
  try {
    const response = await axios.post('http://localhost:4000/pay', orderInfo);

    // 응답 구조 확인 및 redirectUrl 유효성 검사
    const redirectUrl = response?.data?.redirectUrl;
    if (!redirectUrl) {
      throw new Error("결제 URL이 없습니다.");
    }

    return { redirectUrl };
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw error;
  }
};
