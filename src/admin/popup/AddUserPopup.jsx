import React, { useState, useEffect } from "react";
import { addUser, updateUser, registerUser } from "../../services/userService";
import { uploadUserImage, getUserImageUrl } from "../../services/userImageService"

function AddUserPopup({ onClose, user, isEdit }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "staff",
    status: user?.status || "근무중",
    phone: user?.phone || "",
    salary: user?.salary || "",
    joined_at: user?.joined_at?.slice(0, 10) || "",
    profile_img: user?.profile_img || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // user가 있으면 초기값으로 설정 (수정 모드)
  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        password: ""      //수정 시 비밀번호는 입력받도록 초기화
      });
      setImageFile(null);     //수정 시 이미지 초기화
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if(file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imagePath = form.profile_img;

      // 이미지 업로드
      if (imageFile) {
        setUploading(true);
        imagePath = await uploadUserImage(imageFile);
        setUploading(false);
      }

      const finalForm = { ...form, profile_img: imagePath };

      if (isEdit) {
        const { password, ...updates } = finalForm;
        await updateUser(user.id, updates);
      } else {
        const cleanedEmail = finalForm.email.trim();
        await registerUser(cleanedEmail, finalForm.password, finalForm);
      }

      // 새로고침으로 반영
      window.location.reload();
    } catch (err) {
      alert("등록 실패: " + err.message);
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

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : form.profile_img
    ? getUserImageUrl(form.profile_img)
    : null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{isEdit ? "직원 정보 수정" : "직원 추가"}</h3>
        <form onSubmit={handleSubmit}>
          <input className="Inbutton" name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
          <input className="Inbutton" name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
          
          {!isEdit && (
            <input className="Inbutton" name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
          )}

          <input className="Inbutton" name="role" placeholder="직무" value={form.role} onChange={handleChange} required />

          <select className="select Inselect" name="status" value={form.status} onChange={handleChange} required>
            <option value="근무중">근무중</option>
            <option value="휴가중">휴가중</option>
          </select>

          <input className="Inbutton" name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} />
          <input className="Inbutton" name="salary" placeholder="시급" value={form.salary} onChange={handleChange} />
          <input className="Inbutton" name="joined_at" type="date" placeholder="입사일" value={form.joined_at} onChange={handleChange} />
          
          {/* 이미지 파일 선택 */}
          <input className="Inbutton" type="file" accept="image/*" onChange={handleImageChange} />
          {uploading && <p>이미지 업로드 중...</p>}

          {/* 이미지 미리보기 */}
          {previewUrl && (
            <div className="preview">
            <img
              src={previewUrl}
              alt="프로필 미리보기"
              style={{ width: "100px", borderRadius: "8px", objectFit: "cover" }}
            />
            </div>
          )}
          

          <button type="submit">{isEdit ? "수정" : "추가"}</button>
        </form>
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default AddUserPopup;