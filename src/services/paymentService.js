import axios from "axios";

export async function preparePayment(orderInfo) {
  try {
    console.log("결제 요청 전송:", orderInfo);

    const response = await axios.post("http://localhost:4000/api/pay", orderInfo);

    // 정상 응답 처리
    if (response.data && response.data.next_redirect_pc_url) {
      console.log("결제 요청 성공:", response.data);
      return response.data;
    } else {
      console.warn("⚠️ 서버 응답 형식이 올바르지 않습니다:", response.data);
      alert("결제 요청 처리 중 문제가 발생했습니다.");
      return null;
    }
  } catch (error) {
    // 실제 오류별로 구분 처리
    if (error.response?.status === 400) {
      alert("필수 결제 정보가 누락되었습니다."); // 서버에서 실제로 보낸 400일 때만
    } else if (error.response?.status === 500) {
      alert("서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      alert("네트워크 오류 또는 외부 통신 실패가 발생했습니다.");
    }

    console.error("결제 요청 실패:", error);
    return null;
  }
}
