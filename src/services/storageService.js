import { supabase } from '../services/supabaseClient';

export async function uploadImage(file) {
  const { data, error } = await supabase.storage
    .from('images') // 버킷 이름
    .upload(`uploads/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error("업로드 실패:", error.message);
    return null;
  }

  // 업로드한 파일의 공개 URL 가져오기
  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(`uploads/${file.name}`);

  return publicUrlData.publicUrl;
}
