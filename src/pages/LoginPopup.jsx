import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function LoginPopup({ onClose, onLoginSuccess, onSignupClick }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("로그인 시도 중...");

    try {
      // 1️⃣ Supabase Auth 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });

      if (error) {
        console.error("Auth 오류:", error);
        setMessage("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
        return;
      }

      const user = data.user;
      console.log("Auth 성공:", data);

      // 2️⃣ 직원(users) 테이블 확인
      const { data: staff } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (staff) {
        console.log("🧑‍💼 직원 로그인 성공:", staff);
        localStorage.setItem("role", "staff");
        localStorage.setItem("user_name", staff.name);
        localStorage.setItem("user_email", staff.email);
        setMessage(`${staff.name}님 관리자 로그인 성공!`);
        onLoginSuccess?.(staff);
        onClose?.();
        return;
      }

      // 3️⃣ 회원(members) 테이블 확인
      const { data: member } = await supabase
        .from("members")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (member) {
        console.log("🧍‍♂️ 회원 로그인 성공:", member);
        localStorage.setItem("role", "member");
        localStorage.setItem("user_name", member.name);
        localStorage.setItem("user_email", member.email);
        setMessage(`${member.name}님 환영합니다!`);
        onLoginSuccess?.(member);
        onClose?.();
        return;
      }

      setMessage("⚠️ 로그인은 되었지만 등록된 회원/직원 정보가 없습니다.");
    } catch (err) {
      console.error("로그인 오류:", err);
      setMessage("로그인 중 오류 발생");
    }
  };

  // 스크롤 잠금
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
            <p style={{ marginTop: "10px", color: message.includes(" ") ? "green" : "crimson" }}>
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
