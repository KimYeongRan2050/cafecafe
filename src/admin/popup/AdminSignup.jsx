import React from "react";
import { supabase } from "../../services/supabaseClient";

export async function AdminSignup({ name, password, email }) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError || !authData?.user) {
    throw new Error("회원가입 실패: " + authError.message);
  }

  const { error: insertError } = await supabase.from("members").insert({ //member ->members변경
    id: authData.user.id,
    email,
    password, // 실제 운영에서는 bcrypt로 해시 처리
    name,
    role: "admin",
    is_verified: true
  });

  if (insertError) {
    throw new Error("member 테이블 삽입 실패: " + insertError.message);
  }

  return authData.user;
}