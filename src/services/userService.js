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
    .insert([
      { id, name, email, role, department, userData }
    ])
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


export async function loginUser(email, password) {
  // 임시 관리자 계정 허용
  if (email === "admin@mail.com" && password === "123456") {
    return {
      id: "temp-admin",
      name: "관리자",
      role: "admin",
      email
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (authError || !authData?.user) {
    throw new Error("로그인 실패: " + authError.message);
  }

  const userId = authData.user.id;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    throw new Error("직원 정보 없음 또는 권한 없음");
  }

  if (userData.role !== "admin") {
    throw new Error("관리자 권한이 없습니다.");
  }

  return userData;
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
      role: userInfo.role,
      status: userInfo.status,
      phone: userInfo.phone,
      salary: userInfo.salary,
      joined_at: userInfo.joined_at,
      profile_img: userInfo.profile_img || "staff-default.png"
    }
  ]);

  if (insertError) throw insertError;

  return authData.user;
}

// 재직 직원 수
export async function getTotalStaffCount() {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("status", "재직");

  if (error) {
    console.error("직원 수 조회 실패:", error.message);
    return 0;
  }

  return count || 0;
}