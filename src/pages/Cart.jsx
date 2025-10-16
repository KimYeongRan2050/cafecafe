import React, { useEffect, useState } from "react";
import { paymentService } from "../services/paymentService";

function Cart({ cart, setCart, openLoginPopup }) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + item.price * quantity;
  }, 0);

  const increaseQuantity = (index) => {
    setCart(prevCart => {
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
    setCart(prevCart => {
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

  const handlePayment = async () => {
    if (cart.length === 0) return;

    const customId = localStorage.getItem('custom_id');
    if (!customId) {
      setShowLoginPrompt(true);
      return;
    }

    const item = cart[0];
    if (!item || !item.id || typeof item.id !== "string" || item.id.length < 36) {
      alert("상품 ID가 유효하지 않습니다.");
      return;
    }

    const orderInfo = {
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      table: "barista_products",
      customId
    };

    console.log("orderInfo:", orderInfo);

    try {
      const { redirectUrl } = await paymentService(orderInfo);
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("결제 요청 실패:", err);
      alert("결제 요청 실패: " + err.message);
    }
  };

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="popup-content">
      <h3>장바구니</h3>
      {cart.length === 0 ? (
        <p className="empty">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item, index) => (
            <li key={item.id} className="cart-item">
              <div className="cart-img">
                <img src={item.image || "/images/default.png"} alt={item.name} className="cart-thumb" />
              </div>
              <div className="cart-txt">
                <div className="cart-info">
                  <span className="cart-name">{item.name}</span>
                  <button className="cart-remove" onClick={() => removeItem(index)}>
                    <i className="bi bi-trash"></i>삭제
                  </button>
                </div>

                <div className="cart-info">
                  <div className="cart-qty-control">
                    <button className="qty-btn" onClick={() => decreaseQuantity(index)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                  <span className="cart-price">
                    ￦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-total">
        <strong>총액 :</strong>
        <span>￦{total.toLocaleString()}</span>
      </div>

      <button className="close-btn kakaoBtn" onClick={handlePayment}>카카오페이로 결제</button>

      {showLoginPrompt && (
        <div className="modal">
          <p>로그인 후 결제해주세요.</p>
          <div className="modal-btn">
            <button onClick={() => setShowLoginPrompt(false)}>취소</button>
            <button onClick={() => {
              setShowLoginPrompt(false);
              if (typeof openLoginPopup === "function") {
                openLoginPopup(); // 로그인 팝업 열기
              }
            }}>
              로그인하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
