import React, { useState, useRef, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import Cart from "../pages/Cart";
import LoginPopup from "../pages/LoginPopup";
import AdminLoginPopup from "../admin/popup/AdminLoginPopup";
import Signup from "../pages/Signup";

function Header({ cart, setCart, showCartPopup, setShowCartPopup, onCartClick, onAdminLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAdminLoginPopup, setShowAdminLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // 로그인한 사용자 정보 저장

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleMenuClick = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // 로그인 팝업 열기
  const openLoginPopup = () => {
    setShowLoginPopup(true);
    setShowSignupPopup(false);
    setShowCartPopup(false);
  };

  // 회원가입 팝업 열기
  const openSignupPopup = () => {
    setShowSignupPopup(true);
    setShowLoginPopup(false);
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("custom_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    setUserInfo(null);
    alert("로그아웃되었습니다.");
  };

  // 로그인 성공 시 사용자 정보 저장
  const handleLoginSuccess = (member) => {
    setUserInfo(member);
    setShowLoginPopup(false);
  };

  // 로그인 상태 유지 (localStorage 기반)
  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const email = localStorage.getItem("user_email");
    if (name && email) {
      setUserInfo({ name, email });
    }
  }, []);

  // 외부 클릭 시 메뉴 닫기
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
            <div><ScrollLink to="storeCoffeeSection" smooth duration={500} offset={-160}>커피</ScrollLink></div>
            <div><ScrollLink to="storeLatteSection" smooth duration={500} offset={-160}>라떼&곡물</ScrollLink></div>
            <div><ScrollLink to="storeSection" smooth duration={500} offset={-160}>스토어</ScrollLink></div>
          </nav>

          <div className="top_user">
            {/* 로그인 상태 표시 */}
            <div className="signup_name">
              {userInfo ? (
                <h4>{userInfo.name} 님 환영합니다.</h4>
              ) : (
                <h4>로그인해주세요</h4>
              )}
            </div>

            {/* 장바구니 */}
            <div className="icon_cart">
              <span>{totalQuantity}</span>
              <button
                className="cart-btn"
                onClick={() => {
                  onCartClick?.();
                  setShowCartPopup(true);
                }}
              >
                <i className="bi bi-cart2"></i>
              </button>
            </div>

            {/* 관리자 로그인 */}
            <div className="admin_btn">
              <button onClick={() => { setShowAdminLoginPopup(true); closeMenu(); }}>
                <i className="bi bi-gear-fill"></i>
                관리자
              </button>
            </div>

            {/* 로그인 / 로그아웃 버튼 */}
            <div className="login_btn">
              {userInfo ? (
                <button onClick={handleLogout}>로그아웃</button>
              ) : (
                <button onClick={() => setShowLoginPopup(true)}>
                  <i className="bi bi-person-fill"></i> 로그인
                </button>
              )}
            </div>

            {/* 모바일 메뉴 아이콘 */}
            <div className="icon_btn">
              <button className="icon" onClick={handleMenuClick} ref={buttonRef}>
                <i className="fa fa-bars"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="mobile_menu" ref={menuRef}>
            <nav>
              <ScrollLink to="beanSection" smooth duration={500} offset={-160} onClick={closeMenu}>원두</ScrollLink>
              <ScrollLink to="cafereumSection" smooth duration={500} offset={-160} onClick={closeMenu}>카페리움</ScrollLink>
              <ScrollLink to="storeCoffeeSection" smooth duration={500} offset={-160} onClick={closeMenu}>커피</ScrollLink>
              <ScrollLink to="storeLatteSection" smooth duration={500} offset={-160} onClick={closeMenu}>라떼&곡물</ScrollLink>
              <ScrollLink to="storeSection" smooth duration={500} offset={-160} onClick={closeMenu}>스토어</ScrollLink>
            </nav>

            <div className="mobile_user">
              {userInfo ? (
                <>
                  <button onClick={() => { handleLogout(); closeMenu(); }}>로그아웃</button>
                </>
              ) : (
                <button onClick={() => { setShowLoginPopup(true); closeMenu(); }}>
                  로그인
                </button>
              )}
            </div>

            <div className="mobile_user admin_btn">
              <button onClick={() => { setShowAdminLoginPopup(true); closeMenu(); }}>
                <i className="bi bi-gear-fill"></i>
                관리자
              </button>
            </div>
          </div>
        )}        


        {/* 장바구니 팝업 */}
        {showCartPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <Cart cart={cart} setCart={setCart} openLoginPopup={openLoginPopup} />
              <button className="close-btn" onClick={() => setShowCartPopup(false)}>닫기</button>
            </div>
          </div>
        )}

        {/* 로그인 팝업 */}
        {showLoginPopup && (
          <LoginPopup
            onClose={() => setShowLoginPopup(false)}
            onLoginSuccess={handleLoginSuccess} // 로그인 성공 시 실행
            onSignupClick={openSignupPopup}
          />
        )}

        {/* 회원가입 팝업 */}
        {showSignupPopup && (
          <Signup
            onClose={() => {
              setShowSignupPopup(false);
              setShowLoginPopup(true);
            }}
          />
        )}

        {/* 관리자 로그인 팝업 */}
        {showAdminLoginPopup && (
          <AdminLoginPopup
            onClose={() => setShowAdminLoginPopup(false)}
            onLoginSuccess={(admin) => {
              onAdminLogin(admin);
              setShowAdminLoginPopup(false);
            }}
          />
        )}
      </header>
    </>
  );
}

export default Header;
