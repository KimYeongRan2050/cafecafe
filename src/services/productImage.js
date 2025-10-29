import { supabase } from "./supabaseClient";

export const getProductImageUrl = (path) => {
  const validPath =
    path &&
    typeof path === "string" &&
    path.trim() !== "" &&
    path !== "null" &&
    path !== "undefined";

  return `https://eiqdlvhymnzyehqnrsau.supabase.co/storage/v1/object/public/images/${
    validPath ? path : "default.png"
  }?t=${Date.now()}`;
};
  
// 이미지 업로드 함수 (고유 파일명 생성)
export const uploadProductImage = async (file) => {
  if (!file || !file.name) return null;

  const fileName = file.name;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error("이미지 업로드 실패:", error.message);
    return null;
  }

  return fileName;
};
  
// 제품 테이블에 이미지 경로 저장
export const saveProductImagePath = async (productId, imagePath) => {
  if (!productId || !imagePath) {
    console.warn("productId 또는 imagePath가 유효하지 않습니다.");
    return;
  }

  const { error } = await supabase
    .from("drinks")
    .update({ image: imagePath })
    .eq("id", productId);

  if (error) {
    console.error("이미지 경로 저장 실패:", error.message);
    throw error;
  }
};

