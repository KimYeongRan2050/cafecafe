import React, { useState, useEffect } from "react";
import { addUser, updateUser } from "../../services/userService";

function AddUserPopup({ onClose, onAdd, user, isEdit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    salary: "",
    employment_date: "",
    status: "근무",
    profile_img: ""
  });

  // user가 있으면 초기값으로 설정 (수정 모드)
  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { ...form };

    try {
      let savedUser;
      if (isEdit && user) {
        savedUser = await updateUser(user.id, newUser);
      } else {
        savedUser = await addUser(newUser);
      }
      onAdd(savedUser);
      onClose();
    } catch (error) {
      console.error("저장 오류:", error);
      alert("저장 중 오류 발생: " + (error.message || "알 수 없는 오류"));
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
          <input name="role" placeholder="직무" value={form.role} onChange={handleChange} required />
          <input name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} />
          <input name="salary" placeholder="시급" value={form.salary} onChange={handleChange} />
          <input name="employment_date" type="date" placeholder="입사일" value={form.employment_date} onChange={handleChange} />
          <input name="profile_img" placeholder="프로필 이미지 URL" value={form.profile_img} onChange={handleChange} />
          <button type="submit">{isEdit ? "수정" : "추가"}</button>
        </form>
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default AddUserPopup;