import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import bcrypt from "bcryptjs";

function Signup({ onSignup, onClose }) {
  const [form, setForm] = useState({
    id:"",
    password:"",
    name:"",
    email:"",
    phone:"",
    address: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof onAdminLogin === "function") {
      const result = await onAdminLogin(email, pw);
      if (result) {
        alert("관리자 로그인 성공");
        onClose();
        navigate("/admin/dashboard");
      } else {
        alert("로그인 실패 또는 관리자 권한 없음");
      }
    }
  };



  useEffect(() => {
    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;

    return () => {
      // 스타일 복구 및 스크롤 위치 복원
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return(
    <div className="popup-overlay member-popup">
      <div className="popup-content">
        <div className="popup-content">
          <h3>회원가입</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="id" placeholder="아이디" value={form.id} onChange={handleChange} required />
            <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
            <input type="text" name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="휴대전화" value={form.phone} onChange={handleChange} required />
            <input type="address" name="address" placeholder="주소" value={form.address} onChange={handleChange} required />
            
            <button type="submit">회원가입</button>
          </form>
        </div>
        
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>

    </div>
  )
}

export default Signup;