import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// 라우터 등록
app.use("/api", paymentRoutes);
app.use("/api/auth", authRoutes); // 추가

app.listen(4000, () => {
  console.log("카카오페이 실행 중: http://localhost:4000");
});
