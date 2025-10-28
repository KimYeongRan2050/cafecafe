// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

// .env 로드
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

// API 라우트 접두사 설정 (/api)
app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`카카오페이 실행 중: http://localhost:${PORT}`);
});
