import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../services/userService";

function AdminLoginPopup({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // 직원 등록 후 자동 로그인
  const handleRegister = async () => {
    try {
      const userInfo = {
        name: "관리자",
        role: "admin",
        status: "근무",
        phone: "010-1234-5678",
        salary: 12000,
        joined_at: "2025-09-29",
        profile_img: ""
      };

      await registerUser(email, password, userInfo);
      setStatus("직원 등록 완료");

      //const user = await loginUser(email, password);
      //setStatus(`로그인 성공: ${user.role}`);
      //navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setStatus("등록 실패: " + err.message);
    }
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    try {
      const user = await loginUser(email, password);
      setStatus(`로그인 성공: ${user.role}`);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setStatus("로그인 실패: " + err.message);
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

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>관리자 로그인</h3>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />

          <p style={{ marginTop: "20px", color: "#333", textAlign: "center" }}>{status}</p>

          <div style={{ marginTop: "10px" }}>
            <button type="button" onClick={handleRegister}>직원 등록</button>
            <button type="submit">로그인</button>
          </div>

        </form>
        <button onClick={onClose} className="close-btn">닫기</button>
      </div>
      
    </div>
  );
}

export default AdminLoginPopup;
