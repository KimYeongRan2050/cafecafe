// server.cjs
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 4000;

// 필수 미들웨어 (req.body 파싱 & CORS 허용)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 연결
app.use("/", paymentRoutes);

app.listen(PORT, () => {
  console.log(`카카오페이 서버 실행 중: http://localhost:${PORT}`);
});
