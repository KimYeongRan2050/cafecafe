const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(cors());

const paymentRoutes = require('./services/payment');
app.use('/', paymentRoutes);

app.listen(4000, () => {
  console.log('카카오페이 서버 실행 중');
});
