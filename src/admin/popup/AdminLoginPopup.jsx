import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";
import { supabase } from "../../services/supabaseClient";

function AdminLoginPopup({ onAdminLogin, onClose }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof onAdminLogin === "function") {
      const result = await onAdminLogin(email, pw);
      if (result) {
        alert("관리자 로그인 성공");
        onClose(); // 팝업 닫기
        navigate("/admin/dashboard");
      } else {
        alert("로그인 실패 또는 관리자 권한 없음");
      }
    }

    // Supabase Auth 회원가입
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: form.password,
      options: {
        data: {
          id: form.id
        }
      }
    });

  };

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      setUserInfo(user);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/staff/home");
      }
    } catch (err) {
      alert(err.message);
    }
  };  



  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>관리자 로그인</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일"
            required
          />
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="비밀번호"
            required
          />
          <button type="submit">로그인</button>
        </form>
        <button onClick={onClose} className="close-btn">닫기</button>
      </div>
      
    </div>
  );
}

export default AdminLoginPopup;
