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
export async function addUser(name) {
  const { data, error } = await supabase
    .from('users')
    .insert([name])
    .select();

  if (error) throw error;

  return data[0];
}

// 직원 수정
export async function updateUser(id,  updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select();

  if(error) throw error;
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

  // 1. Supabase Auth 로그인
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
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

  return {
    id: userId,
    name: userData.name,
    role: userData.role,
    email: userData.email
  };
}

export async function registerUser(email, password, name, role = 'staff') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  });

  if (error) throw error;
  return data;
}