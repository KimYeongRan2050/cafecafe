import express from "express";
import { registerFakeMembers } from "../services/authRegisterService.js";

const router = express.Router();

// 회원 100명 자동 생성
router.post("/register-fake-members", async (req, res) => {
  try {
    await registerFakeMembers();
    res.json({ success: true, message: "회원 100명 등록 완료" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
