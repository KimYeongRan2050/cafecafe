import React from "react";

function OrderComplete() {
  return (
    <div className="order-complete">
      <h2>주문이 완료되었습니다!</h2>
      <p>결제가 성공적으로 처리되었습니다. 감사합니다.</p>
      <a href="/">홈으로 돌아가기</a>
    </div>
  );
}

export default OrderComplete;