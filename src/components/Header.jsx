import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Cart from "../pages/Cart"; // Assuming Cart is a component in the same directory
import LoginPopup from "../pages/LoginPopup";
import Signup from "../pages/Signup";
import AdminLoginPopup from "../admin/popup/AdminLoginPopup";
import { supabase } from "../services/supabaseClient";


function Header({ cart, setCart, showCartPopup, setShowCartPopup, onCartClick, onLogin, userInfo, setUserInfo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showAdminLoginPopup, setShowAdminLoginPopup] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  //메뉴 토글 함수
  const handleMenuClick = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setShowLoginPopup(true);
    closeMenu();
  };

  const handleSignup = (FormData) => {
    setShowSignupPopup(false);
  };

  const handleSubmit = async () => {
    const user = await onLogin(email, password);
    if (user) {
      onLoginSuccess(user);
    } else {
      alert("로그인 실패");
    }
  };

  // 메뉴 외부 클릭 시 닫기
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside); // 이벤트 타입 수정

  return () => {
    document.removeEventListener("mousedown", handleClickOutside); // 정리도 동일하게
  };
}, [isMenuOpen]);

  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return(
    <div className='mainimg'>
      <div className='top_menu'>
        <div className="logo_img">
          <a href="/" className='logo_box'>카페카페</a>
        </div>

        <nav>
          <div><Link to="">상품</Link></div>
          <div><Link to="">카페소개</Link></div>
          <div><Link to="">주문방법</Link></div>
          <div><Link to="">문의</Link></div>
        </nav>

        <div className='top_user'>
          <div className="order"><Link to="">주문문의</Link></div>
          <div className="signup_name">
            {userInfo ? (
              <>
                <h4>{userInfo.name} 님 환영합니다.</h4>
              </>
            ) : (
              <h4>로그인해주세요</h4>
            )}
          </div>
          <div className="icon_cart">
            <span>{totalQuantity}</span>
            <button
              className="cart-btn"
              onClick={() => {
                typeof onCartClick === "function" && onCartClick();
                setShowCartPopup(true);
                setIsMenuOpen(false);
              }}
            >
              <i className="bi bi-cart2"></i>
            </button>
          </div>
          <div className="admin_btn">
            <button onClick={() => {
              setShowAdminLoginPopup(true);
              closeMenu();
            }}>
              <i className="bi bi-gear-fill"></i>
              관리자
            </button>
          </div>
          <div className="login_btn">
            {userInfo ? (
              <button onClick={() => setUserInfo(null)}>로그아웃</button>
            ) : (
              <button onClick={handleLoginClick}>
                <i className="bi bi-person-fill"></i>
                로그인
              </button>
            )}
          </div>
          {/* 모바일 메뉴버튼 */}
          <div className="icon_btn">
            <button className="icon" onClick={handleMenuClick}>
              <i className="fa fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className="mobile_menu">
        {/* 메뉴리스트 */}
        <div className={`mobile_menu_list ${isMenuOpen ? "open" : "close"}`} ref={menuRef}>
          <div className="mobile_menu_product" id="menuLinks">
            <div><Link to="" onClick={closeMenu}>상품</Link></div>
            <div><Link to="" onClick={closeMenu}>카페소개</Link></div>
            <div><Link to="" onClick={closeMenu}>주문방법</Link></div>
            <div><Link to="" onClick={closeMenu}>문의</Link></div>
          </div>

          <div className="mobile_user">
            <div className="login_btn">
              {userInfo ? (
                <>
                  <button onClick={() => setUserInfo(null)}>로그아웃</button>
                </>
              ) : (
                <button onClick={handleLoginClick}>
                  <i className="bi bi-person-fill"></i>
                  로그인
                </button>
              )}
            </div>
            <div><a href="">주문문의</a></div>
            <div className="admin_btn">
              <button onClick={() => {
                setShowAdminLoginPopup(true);
                closeMenu();
              }}>
                <i className="bi bi-gear-fill"></i>
                관리자
              </button>
            </div>
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
      
      {/* 로그인 팝업 */}
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLogin={onLogin}
          onLoginSuccess={(user) => {
            setUserInfo(user);
            setShowLoginPopup(false);
          }}
          onSignupClick={() => {
            setShowLoginPopup(false);
            setShowSignupPopup(true);
          }}
        />
      )}

      {/* 회원가입 팝업 */}
      {showSignupPopup && (
      <div className="popup-overlay" onClick={() => setShowSignupPopup(false)}>
        <div className="popup" onClick={e => e.stopPropagation()}>
          <Signup
            onSignup={handleSignup}
            onClose={() => setShowSignupPopup(false)}
          />
        </div>
      </div>
      )}


      {/* 관리자 로그인 팝업 */}
      {showAdminLoginPopup && (
        <AdminLoginPopup
          onClose={() => setShowAdminLoginPopup(false)}
          onAdminLogin={async (email, pw) => {
            
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password : pw
          });

          if (authError || !authData?.user) {
            alert("로그인 실패: " + authError.message);
            return null;
          }

          // 2. member 테이블에서 관리자 권한 확인
          const { data: memberData, error: memberError } = await supabase
            .from("member")
            .select("name, role, is_verified")
            .eq("id", authData.user.id)
            .single();

          if (memberError || !memberData || !memberData.is_verified) {
            alert("관리자 권한이 없습니다.");
            return null;
          }

          return {
            name: memberData.name,
            role: memberData.role,
            email: authData.user.email
          };

          }}
        />
      )}



    </div>

  );
}

export default Header;