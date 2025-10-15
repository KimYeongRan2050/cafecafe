import express from "express";
import cors from "cors";
import kakaoPay from "./routes/kakaoPay.js";

const app = express();
app.use(cors());
app.use(express.json());

//라우터 등록
app.use("/", kakaoPay);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
