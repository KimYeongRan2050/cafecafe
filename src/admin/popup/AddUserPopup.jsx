import React, { useState, useEffect } from "react";
import { addUser, updateUser, registerUser } from "../../services/userService";

function AddUserPopup({ onClose, onAdd, user = null, isEdit = false }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    phone: "",
    salary: "",
    joined_at: "",
    status: "근무",
    profile_img: ""
  });

  // user가 있으면 초기값으로 설정 (수정 모드)
  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        password: "" // 수정 시 비밀번호는 입력받도록 초기화
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let savedUser;
      if (isEdit) {
        const { password, ...updates } = form; // password 제거
        savedUser = await updateUser(user.id, updates);
      } else {
        const cleanedEmail = form.email.trim();
        savedUser = await registerUser(cleanedEmail, form.password, form);
      }
      onAdd(savedUser);
      onClose();
    } catch (err) {
      alert((isEdit ? "수정" : "등록") + " 실패: " + err.message);
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
        <h3>{isEdit ? "직원 정보 수정" : "직원 추가"}</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
          
          {!isEdit && (
            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
          )}

          <input name="role" placeholder="직무" value={form.role} onChange={handleChange} required />
          <input name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} />
          <input name="salary" placeholder="시급" value={form.salary} onChange={handleChange} />
          <input name="joined_at" type="date" placeholder="입사일" value={form.joined_at} onChange={handleChange} />
          <input name="profile_img" placeholder="프로필 이미지 URL" value={form.profile_img} onChange={handleChange} />
          <button type="submit">{isEdit ? "수정" : "추가"}</button>
        </form>
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default AddUserPopup;