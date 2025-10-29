import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderComplete.css";

export default function OrderComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 홈("/")으로 이동
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="order-complete-page">
      <div className="order-complete-popup">
        <div className="check-icon">✅</div>
        <h2>결제가 완료되었습니다!</h2>
        <p>주문이 정상적으로 처리되었습니다.</p>
        <p>잠시 후 홈으로 이동합니다...</p>
      </div>
    </div>
  );
}
