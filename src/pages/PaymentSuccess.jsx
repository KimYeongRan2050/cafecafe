import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const approvePayment = async () => {
      const tid = localStorage.getItem("kakao_tid"); // 결제 준비 시 저장한 tid
      const pg_token = searchParams.get("pg_token");
      const user_id = localStorage.getItem("user_id"); // 로그인 시 저장
      const product_id = localStorage.getItem("product_id");
      const quantity = localStorage.getItem("quantity");

      try {
        const response = await fetch("/api/kakao-approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tid, pg_token, user_id, product_id, quantity })
        });

        const result = await response.json();
        if (result.success) {
          alert("결제가 완료되었습니다!");
          navigate("/order/complete");
        } else {
          alert("결제 승인 실패: " + result.error);
        }
      } catch (err) {
        console.error("결제 승인 오류:", err.message);
        alert("결제 승인 중 오류 발생");
      }
    };

    approvePayment();
  }, [searchParams, navigate]);

  return (
    <div className="payment-success">
      <h2>결제 승인 중입니다...</h2>
    </div>
  );
}

export default PaymentSuccess;
