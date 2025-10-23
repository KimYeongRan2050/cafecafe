import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

function Signup({ onClose }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Supabase Auth 계정 생성
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      
      const user = data.user;
      if (!user) throw new Error("회원 정보가 없습니다.");

      // members 테이블에 회원 정보 추가
      const { error: insertError } = await supabase.from("members").insert([
        {
          uuid: user.id, // auth.users.id 참조
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          created_at: new Date().toISOString(),
        },
      ]);
      if (insertError) throw insertError;

      alert("회원가입이 완료되었습니다. 로그인해주세요!");
      onClose?.();
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;
    return () => {
      document.body.style.cssText = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="popup-overlay member-popup">
      <div className="popup-content">
        <h3>회원가입</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="Inbutton"
            type="text"
            name="id"
            placeholder="아이디 (로그인용)"
            value={form.id}
            onChange={handleChange}
            required
          />
          <input
            className="Inbutton"
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="Inbutton"
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="Inbutton"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="Inbutton"
            type="text"
            name="phone"
            placeholder="휴대전화"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            className="Inbutton"
            type="text"
            name="address"
            placeholder="주소"
            value={form.address}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "등록 중..." : "회원가입"}
          </button>
        </form>

        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default Signup;
