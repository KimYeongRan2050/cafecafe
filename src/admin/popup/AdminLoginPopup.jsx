import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";

function AdminLoginPopup({onClose}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    // supabase 인증 시도
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage("로그인 실패", + error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      setMessage("관리자 인증 실패");
      return;
    }

    // 로그인 성공 후 users 테이블에서 role 조회
    const { data: userInfo, error: roleError } = await supabase
      .from("users")
      .select("email, role")
      .eq("email", user.email)
      .single();

    if (roleError || !userInfo) {
      setMessage("등록되지 않은 사용자입니다.");
      await supabase.auth.signOut();
      return;
    }

    // role 확인
    if (!["admin", "staff"].includes(userInfo.role)) {
      setMessage("관리자 권한이 없습니다.");
      await supabase.auth.signOut();
      return;
    }

    setMessage("로그인 성공! 관리자 페이지로 이동합니다.");

    // 관리자 페이지로 이동
    setTimeout(() => {
      window.location.href = "/admin/dashboard";
    }, 1000);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-content">
          <h3>관리자 로그인</h3>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="Inbutton"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="Inbutton"
              required
            />

            {message && (
              <p style={{margin: "20px 0", fontSize: "14ppx", color: message.includes("성공") ? "green" : "#c35930" }}>{message}</p>
            )}
        
            <button type="submit">로그인</button>
          </form>
        </div>


        
        <button className="close-btn" onClick={onClose}>닫기</button>
        
      </div>
    </div>
  );
}

export default AdminLoginPopup;
