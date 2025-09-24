import React, { useEffect } from "react";

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
        // 수량이 1일 때는 제거
        updated.splice(index, 1);
      }
      return updated;
    });
  };





  useEffect(() => {
    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;

    return () => {
      // 스타일 복구 및 스크롤 위치 복원
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
                <img src={item.image} alt={item.name} className="cart-thumb" />
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
                    <span className="qty-value">{item.quantity || 1}</span>
                    <button className="qty-btn" onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                  <span className="cart-price">
                    ￦{(item.price * (item.quantity || 1)).toLocaleString()}
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

      <button className="close-btn">결제</button>
    </div>
  );
}

export default Cart;