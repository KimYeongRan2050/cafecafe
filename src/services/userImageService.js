import { supabase } from "./supabaseClient";

// 직원 이미지 URL 생성 함수
export const getUserImageUrl = (path) => {
  const validPath = path && typeof path === "string" && path.trim() !== "";
  return `https://eiqdlvhymnzyehqnrsau.supabase.co/storage/v1/object/public/staff-images/${
    validPath ? path : "staff-default.png"
  }?t=${Date.now()}`;
};

// 직원 이미지 업로드 함수
export const uploadUserImage = async (file, customName) => {
  if (!file || !file.name) return null;

  const fileName = customName || file.name.trim(); // 원본 이름 사용
  const filePath = fileName;

  const { error } = await supabase.storage
    .from("staff-images")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || "image/png"
      });

  if (error) {
    console.error("직원 이미지 업로드 실패:", error.message);
    return null;
  }

  return filePath;
};

// 직원 테이블에 이미지 경로 저장
export const saveUserImagePath = async (userId, imagePath) => {
  if (!userId || !imagePath) return;

  const { error } = await supabase
    .from("users")
    .update({ profile_img: imagePath })
    .eq("id", userId);

  if (error) {
    console.error("이미지 경로 저장 실패:", error.message);
    throw error;
  }
};