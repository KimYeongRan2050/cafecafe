import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../services/userService";

function TestUserFlow() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser(email, password, "admin");
      setStatus("직원 등록 완료");
    } catch (err) {
      console.error(err);
      setStatus("등록 실패: " + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      setStatus(`로그인 성공: ${user.role}`);
      navigate("/admin/dashboard"); // 페이지 이동
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

      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" type="password" />
      
      <p style={{ marginTop: "20px", color: "#333", textAlign: "center" }}>{status}</p>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleRegister}>직원 등록</button>
        <button onClick={handleLogin}>로그인</button>
      </div>

      </div>
    </div>
  );
}

export default TestUserFlow;
