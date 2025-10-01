import express from "express";
import cors from "cors";
import kakaoPayRouter from "./routes/kakaoPay";

const app = express();
app.use(cors());
app.use(express.json());

app.use(kakaoPayRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
