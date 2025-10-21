// server.cjs
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 모든 결제 관련 API는 /api로 시작
app.use('/api', paymentRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`카카오페이 서버 실행 중: http://localhost:${PORT}`);
});
