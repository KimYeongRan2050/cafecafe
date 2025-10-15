import React, { useEffect, useState } from "react";
import { requestKakaoPay } from "../services/paymentService";

function Cart({ cart, setCart }) {
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
    const orderInfo = {
      item_name: cart.map(item => item.name).join(", "),
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      user_id: "user01",
      cart
    };

    try {
      const { redirectUrl } = await requestKakaoPay(orderInfo);
      window.location.href = redirectUrl;
    } catch (err) {
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
                    <button
                      className="qty-btn"
                      onClick={() => {
                        if (isStoreOnly(item)) {
                          handleStoreOnlyItem(item);
                          return; // 팝업 띄운 후 수량 증가 방지
                        }
                        increaseQuantity(index);
                      }}
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
      )}

      <div className="cart-total">
        <strong>총액 :</strong>
        <span>￦{total.toLocaleString()}</span>
      </div>

      <button className="close-btn" onClick={handlePayment}>카카오페이로 결제</button>

    </div>
  );
}

export default Cart;
