// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

// 미들웨어 설정
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// 결제 라우터 등록
app.use("/api", paymentRoutes);

app.listen(4000, () => {
  console.log("카카오페이 서버 실행 중: http://localhost:4000");
});

// server.js 마지막에 추가
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

