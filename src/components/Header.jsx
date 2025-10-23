import React, { useState, useRef, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import Cart from "../pages/Cart";
import AdminLoginPopup from "../admin/popup/AdminLoginPopup";

function Header({
  cart,
  setCart,
  showCartPopup,
  setShowCartPopup,
  onCartClick,
  userInfo,
  onLoginClick,
  onLogout,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLoginPopup, setShowAdminLoginPopup] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleMenuClick = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className="main-header">
      <div className="top_menu">
        <div className="logo_img">
          <a href="/" className="logo_box">카페카페</a>
        </div>

        <nav className="desktop_menu">
          <div><ScrollLink to="beanSection" smooth duration={500} offset={-160}>원두</ScrollLink></div>
          <div><ScrollLink to="cafereumSection" smooth duration={500} offset={-160}>카페리움</ScrollLink></div>
          <div><ScrollLink to="cafereumSection" smooth duration={500} offset={-160}>커피</ScrollLink></div>
          <div><ScrollLink to="cafereumSection" smooth duration={500} offset={-160}>라떼&곡물</ScrollLink></div>
          <div><ScrollLink to="storeSection" smooth duration={500} offset={-160}>스토어</ScrollLink></div>
        </nav>

        <div className="top_user">
          <div className="signup_name">
            {userInfo ? (
              <h4>{userInfo.name} 님 환영합니다.</h4>
            ) : (
              <h4>로그인해주세요</h4>
            )}
          </div>

          <div className="icon_cart">
            <span>{totalQuantity}</span>
            <button
              className="cart-btn" onClick={() => { onCartClick?.(); setShowCartPopup(true); }}>
              <i className="bi bi-cart2"></i>
            </button>
          </div>

          <div className="admin_btn">
            <button onClick={() => { setShowAdminLoginPopup(true); closeMenu(); }}>
              <i className="bi bi-gear-fill"></i>
              관리자
            </button>
          </div>

          <div className="login_btn">
            {userInfo ? (
              <button onClick={onLogout}>로그아웃</button>
            ) : (
              <button onClick={onLoginClick}>
                <i className="bi bi-person-fill"></i> 로그인
              </button>
            )}
          </div>

          <div className="icon_btn">
            <button className="icon" onClick={handleMenuClick} ref={buttonRef}>
              <i className="fa fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile_menu ${isMenuOpen ? "open" : "close"}`} ref={menuRef}>
        <div className="mobile_menu_list">
          <div><ScrollLink to="beanSection" smooth duration={500} offset={-100} onClick={closeMenu}>원두</ScrollLink></div>
          <div><ScrollLink to="cafereumSection" smooth duration={500} offset={-100} onClick={closeMenu}>카페리움</ScrollLink></div>
          <div><ScrollLink to="cafereumSection" smooth duration={500} offset={-100} onClick={closeMenu}>커피</ScrollLink></div>
          <div><ScrollLink to="cafereumSection" smooth duration={500} offset={-100} onClick={closeMenu}>라떼</ScrollLink></div>
          <div><ScrollLink to="storeSection" smooth duration={500} offset={-100} onClick={closeMenu}>스토어</ScrollLink></div>

          <div className="mobile_user">
            {userInfo ? (
              <button onClick={() => { onLogout(); closeMenu(); }}>로그아웃</button>
            ) : (
              <button onClick={() => { onLoginClick(); closeMenu(); }}>
                <i className="bi bi-person-fill"></i> 로그인
              </button>
            )}

            <button className="admin_btn" onClick={() => { setShowAdminLoginPopup(true); closeMenu(); }}>
              <i className="bi bi-gear-fill"></i> 관리자
            </button>
          </div>
        </div>
      </div>

      {showCartPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <Cart cart={cart} setCart={setCart} />
            <button className="close-btn" onClick={() => setShowCartPopup(false)}>닫기</button>
          </div>
        </div>
      )}

      {showAdminLoginPopup && (
        <AdminLoginPopup onClose={() => setShowAdminLoginPopup(false)} />
      )}
    </header>
    </>
  );
}

export default Header;
