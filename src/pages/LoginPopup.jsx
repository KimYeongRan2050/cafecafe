import React, { useEffect, useState } from "react";

function LoginPopup({ onClose, onLogin, onSignupClick, onLoginSuccess }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof onLogin === "function") {
      const result = await onLogin(id, pw);
      if (result) {
        if (typeof onLoginSuccess === "function") {
          onLoginSuccess(result);
        }
      } else {
        alert("로그인 실패");
      }
    }
  };

  useEffect(() => {
    const scrolly = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;

    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrolly);
    };
  }, []);

  return(
    <div  className="popup-overlay member-popup">
      <div className="popup-content">
        <div className="popup-content">
          <h3>로그인</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={e => setId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
            />
            <div className="login-btn">
              <button type="submit"> 로그인</button>
              <button type="button" onClick={onSignupClick}> 회원가입</button>
            </div>

          </form>

          <button className="close-btn" onClick={onClose}>닫기</button>

        </div>
      </div>
    </div>
  )
};

export default LoginPopup;