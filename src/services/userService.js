import { supabase } from "./supabaseClient";

// 직원 목록 불러오기
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw error;
  return data;
}

// 직원 추가
export async function addUser({ id, name, email, role, department, userData }) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ id, name, email, role, department, userData }])
    .select();

  if (error) throw error;

  return data[0];
}

// 직원 수정: password, app_metadata 제거
export async function updateUser(id, updates) {
  const { password, app_metadata, user_metadata, ...cleanedUpdates } = updates;

  const { data, error } = await supabase
    .from("users")
    .update(cleanedUpdates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
}

// 직원 삭제
export async function removeUser(id) {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// 직원 등록: Auth + users 테이블 삽입
export async function registerUser(email, password, userInfo) {
  // 1. Supabase Auth 등록
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error("사용자 ID 생성 실패");

  // 2. users 테이블에 삽입
  const { error: insertError } = await supabase.from("users").insert([
    {
      id: userId,
      email,
      name: userInfo.name,
      role: userInfo.role || "user",
      status: userInfo.status || "active",
      phone: userInfo.phone || null,
      salary: userInfo.salary || null,
      joined_at: userInfo.joined_at || new Date().toISOString(),
      profile_img: userInfo.profile_img || "staff-default.png"
    }
  ]);

  if (insertError) throw insertError;

  return authData.user;
}

// 재직 직원 수
export async function getTotalStaffCount() {
  const { count, error } = await supabase
    .from('users') // 또는 실제 직원 테이블명
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("직원 수 조회 실패:", error.message);
    return 0;
  }

  return count;
}