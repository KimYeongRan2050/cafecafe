import React, { useEffect, useState } from "react";
import { preparePayment } from "../services/paymentService.js";

function Cart({ cart, setCart, openLoginPopup }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const increaseQuantity = (index) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const item = updated[index];
      if (item.quantity < item.stock) {
        item.quantity += 1;
      } else {
        alert("재고보다 많이 담을 수 없습니다.");
      }
      return updated;
    });
  };

  const decreaseQuantity = (index) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      const item = updated[index];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  // 결제 처리
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    // 로그인 여부 확인
    const userName = localStorage.getItem("user_name");
    const userEmail = localStorage.getItem("user_email");
    const userPhone = localStorage.getItem("user_phone");

    if (!userName || !userEmail) {
      // 로그인 모달 표시
      setShowLoginModal(true);
      return;
    }

    // 결제 데이터 구성
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    const firstProductName =
      cart.length === 1
        ? cart[0].name
        : `${cart[0].name} 외 ${cart.length - 1}건`;

    const orderInfo = {
      productId: cart[0].id,
      productName: firstProductName,
      quantity: cart.reduce((sum, i) => sum + i.quantity, 0),
      price: totalAmount,
      userName,
      userEmail,
      userPhone,
    };

    console.log("결제 요청 전송:", orderInfo);

    try {
      const response = await preparePayment(orderInfo);
      if (response?.next_redirect_pc_url) {
        window.location.href = response.next_redirect_pc_url;
      } else {
        alert("결제 요청 실패: 올바른 응답을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 요청 중 오류가 발생했습니다.");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;
    return () => {
      document.body.style.cssText = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="popup-content">
      <h3>장바구니</h3>

      {cart.length === 0 ? (
        <p className="empty">장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={item.id} className="cart-item">
                <div className="cart-img">
                  <img
                    src={item.image || "/images/default.png"}
                    alt={item.name}
                    className="cart-thumb"
                  />
                </div>
                <div className="cart-txt">
                  <div className="cart-info">
                    <span className="cart-name">{item.name}</span>
                    <button
                      className="cart-remove"
                      onClick={() => removeItem(index)}
                    >
                      <i className="bi bi-trash"></i> 삭제
                    </button>
                  </div>

                  <div className="cart-info">
                    <div className="cart-qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQuantity(index)}
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-price">
                      ￦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <strong>총액 :</strong>
            <span>￦{total.toLocaleString()}</span>
          </div>

          <button className="kakaoBtn" onClick={handlePayment}>
            카카오페이로 결제하기
          </button>
        </>
      )}

      {/* 로그인 안내 모달 */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>로그인 후 결제해주세요.</p>
            <div className="modal-btn">
              <button onClick={() => setShowLoginModal(false)}>취소</button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  if (typeof openLoginPopup === "function") {
                    openLoginPopup(); // Header에서 전달된 로그인 팝업 실행
                  }
                }}
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
