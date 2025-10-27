// backend/services/authRegisterService.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Service Role Key를 사용해야 Auth API 가능
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * 회원 100명 자동 등록
 */
export async function registerFakeMembers() {
  console.log("회원 100명 자동 등록 시작...");

  for (let i = 1; i <= 100; i++) {
    const email = `user${String(i).padStart(3, "0")}@example.com`;
    const password = `test1234`;
    const name = `회원${String(i).padStart(3, "0")}`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: "member",
      },
    });

    if (error) console.error(`❌ ${email} 등록 실패:`, error.message);
    else console.log(`✅ ${email} 등록 성공`);
  }

  console.log("🎉 회원 100명 자동 등록 완료!");
}
