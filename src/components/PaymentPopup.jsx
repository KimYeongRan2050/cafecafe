import React from "react";

function PaymentPopup({ status, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px 60px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {status === "processing" ? (
          <>
            <h2 style={{ color: "#c35930", fontSize: "24px", marginBottom: "10px" }}>
              결제 승인 중입니다...
            </h2>
            <p>잠시만 기다려주세요. 주문을 처리하고 있습니다.</p>
          </>
        ) : (
          <>
            <h2 style={{ color: "#c35930", fontSize: "24px", marginBottom: "10px" }}>
              주문이 완료되었습니다!
            </h2>
            <p>감사합니다. 전체 상품 페이지로 이동합니다.</p>
            <button
              onClick={onClose}
              style={{
                marginTop: "20px",
                background: "#c35930",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentPopup;
