import { supabase } from "./supabaseClient";

//members 테이블에 신규 회원 추가
export async function addMember(memberData) {
  const { name, email, password, phone, role, join_date } = memberData;

  const { data, error } = await supabase.from("members").insert([
    {
      name,
      email,
      password, // 운영 시 bcrypt 등으로 해싱 권장
      phone,
      role,
      join_date,
      status: "활동중",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("회원 추가 실패:", error.message);
    throw new Error(error.message);
  }

  return data?.[0];
}


//members 테이블 전체 조회 (관리용)
export async function getMembers() {
  const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}


const { data: existing } = await supabase
  .from("members")
  .select("email")
  .eq("email", form.email)
  .maybeSingle();

if (existing) {
  alert("이미 가입된 이메일입니다. 로그인해주세요.");
  return;
}
