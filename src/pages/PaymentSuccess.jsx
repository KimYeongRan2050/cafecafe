import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const approvePayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const isMock = params.get("mock") === "true";

      // Mock 결제는 바로 완료 처리
      if (isMock) {
        console.log("Mock 결제 승인 요청 중...");
        try {
          await axios.get("http://localhost:4000/api/pay/success?mock=true");
          console.log("Mock 결제 승인 완료");
          setShowPopup(true);

          // 1초 후 주문 완료 페이지로 이동
          setTimeout(() => {
            navigate("/order-complete");
          }, 3000);
        } catch (error) {
          console.error("Mock 결제 승인 오류:", error);
          alert("Mock 결제 승인 중 오류가 발생했습니다.");
          navigate("/");
        }
        return;
      }

      const orderId = params.get("order_id");
      const pgToken = params.get("pg_token");
      const tid = params.get("tid");

      if (!orderId || !pgToken || !tid) {
        alert("결제 승인 정보가 누락되었습니다. 다시 시도해주세요.");
        navigate("/");
        return;
      }

      try {
        console.log("결제 승인 요청:", { orderId, pgToken, tid });
        const res = await axios.get(
          `http://localhost:4000/api/pay/success?order_id=${orderId}&pg_token=${pgToken}&tid=${tid}`
        );

        if (res.data.success) {
          console.log("실제 결제 승인 완료");
          setShowPopup(true);
          setTimeout(() => navigate("/"), 3000);
        } else {
          alert("결제 승인에 실패했습니다.");
          navigate("/");
        }
      } catch (error) {
        console.error("결제 승인 오류:", error);
        alert("결제 승인 중 오류가 발생했습니다.");
        navigate("/");
      }
    };

    approvePayment();
  }, [navigate]);

  return (
    <div className="popup-overlay" style={{ display: showPopup ? "flex" : "none" }}>
      <div className="popup-content">
        <h2>결제가 완료되었습니다!</h2>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          3초 후 메인으로 이동합니다.
        </p>
      </div>
    </div>
  );
}

export default PaymentSuccess;
