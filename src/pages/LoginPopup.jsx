import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function LoginPopup({ onClose, onLoginSuccess, onSignupClick }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // pw를 password로 넘기지 말고, 변수명 명확히 지정
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });

      if (error) throw error;

      const user = data.user;
      console.log("Auth 성공:", data);

      // Supabase members 테이블에서 추가 정보 가져오기
      const { data: memberInfo } = await supabase
        .from("members")
        .select("name, email, phone, address")
        .eq("email", user.email)
        .single();

      if (memberInfo) {
        // 로컬스토리지에 회원 정보 저장
        localStorage.setItem("user_name", memberInfo.name);
        localStorage.setItem("user_email", memberInfo.email);
        localStorage.setItem("user_phone", memberInfo.phone || ""); // 전화번호 저장
        localStorage.setItem("user_address", memberInfo.address || "");
      }

      console.log("회원 로그인 성공:", memberInfo);
      alert("로그인 성공!");

      onLoginSuccess?.(memberInfo); // 로그인 성공 콜백
      onClose(); // 로그인 팝업 닫기
    } catch (err) {
      console.error("Auth 오류:", err);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // 스크롤 잠금 처리
  useEffect(() => {
    const scrolly = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrolly}px;
      overflow-y: scroll;
      width: 100%;
    `;
    return () => {
      document.body.style.cssText = "";
      window.scrollTo(0, scrolly);
    };
  }, []);

  return (
    <div className="popup-overlay member-popup">
      <div className="popup-content">
        <div className="popup-content">
          <h3>로그인</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="이메일"
              className="Inbutton"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="Inbutton"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
            <div className="login-btn">
              <button type="submit">로그인</button>
              <button type="button" onClick={onSignupClick}>
                회원가입
              </button>
            </div>
          </form>

          {message && (
            <p style={{ marginTop: "10px", color: message.includes("성공") ? "green" : "crimson" }}>
              {message}
            </p>
          )}
        </div>

        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default LoginPopup;
