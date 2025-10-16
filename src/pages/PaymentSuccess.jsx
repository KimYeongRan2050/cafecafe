import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const pgToken = searchParams.get('pg_token');

    const confirmPayment = async () => {
      if (!orderId || !pgToken) {
        alert('결제 정보가 유효하지 않습니다.');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4000/pay/success?order_id=${orderId}&pg_token=${pgToken}`
        );

        // 결제 승인 성공 시 주문 완료 페이지로 이동
        navigate('/order/complete');
      } catch (error) {
        console.error('결제 승인 실패:', error.response?.data || error.message);
        alert('결제 승인에 실패했습니다. 다시 시도해주세요.');
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  return (
    <div className="payment-success">
      <h2 style={{ margin: "50px 0", fontSize: "24px", color: "#c35930" }}>
        결제 승인 중입니다...
      </h2>
      <p>잠시만 기다려주세요. 주문을 처리하고 있습니다.</p>
    </div>
  );
}

export default PaymentSuccess;
