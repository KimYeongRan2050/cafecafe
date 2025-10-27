// frontend/src/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const approvePayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order_id");
      const pgToken = params.get("pg_token");

      if (!orderId || !pgToken) {
        alert("필수 결제 정보가 누락되었습니다.");
        return;
      }

      try {
        console.log("결제 승인 요청:", orderId, pgToken);

        const response = await axios.get(
          `http://localhost:4000/api/pay/success?order_id=${orderId}&pg_token=${pgToken}`
        );

        if (response.data.success) {
          alert("결제가 정상적으로 완료되었습니다! 감사합니다.");
          navigate("/order-complete"); // 주문 완료 페이지로 이동
        } else {
          alert("결제 승인에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("결제 승인 실패:", error);
        alert("결제 승인에 실패했습니다. 다시 시도해주세요.");
      }
    };

    approvePayment();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>결제 승인 중입니다...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}

export default PaymentSuccess;
