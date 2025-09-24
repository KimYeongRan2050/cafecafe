import { supabase } from '../services/supabaseClient';

// 직원 목록 불러오기
export async function getUsers() {
  const { data, error } = await supabase
    .from('member')
    .select('*');

  if (error) throw error;
  return data;
}

// 직원 추가
export async function addUser(name) {
  const { data, error } = await supabase
    .from('member')
    .insert([name])
    .select();

  if (error) throw error;

  return data[0];
}

// 직원 수정
export async function updateUser(id,  updates) {
  const { data, error } = await supabase
    .from('member')
    .update(updates)
    .eq('id', id)
    .select();

  if(error) throw error;
  return data[0];
}

// 직원 삭제
export async function removeUser(id) {
  const { data, error } = await supabase
    .from('member')
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

  // 1. Supabase Auth 인증
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError || !authData?.user) {
    throw new Error("로그인 실패: " + authError.message);
  }

  // 2. member 테이블에서 사용자 정보 조회
  const { data: memberData, error: memberError } = await supabase
    .from("member")
    .select("name, role, is_verified")
    .eq("user_id", authData.user.id)
    .single();

  if (memberError || !memberData || !memberData.is_verified) {
    throw new Error("권한 없음 또는 검증되지 않은 사용자입니다.");
  }

  return {
    id: userId,
    name: memberData.name,
    role: memberData.role,
    email: authData.user.email
  };
}