// src/pages/PaySuccess.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function PaySuccess() {
  const location = useLocation();
  const pgToken = new URLSearchParams(location.search).get("pg_token");
  const tid = localStorage.getItem("tid");

  useEffect(() => {
    async function approvePayment() {
      try {
        const response = await axios.post(
          "https://kapi.kakao.com/v1/payment/approve",
          {
            cid: "TC0ONETIME",
            tid,
            partner_order_id: "order1234",
            partner_user_id: "user1234",
            pg_token: pgToken
          },
          {
            headers: {
              Authorization: `KakaoAK YOUR_ADMIN_KEY`,
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
            }
          }
        );
        console.log("결제 승인 성공:", response.data);
      } catch (error) {
        console.error("결제 승인 실패:", error);
      }
    }

    if (pgToken) approvePayment();
  }, [pgToken]);

  return <div>결제가 완료되었습니다!</div>;
}

export default PaySuccess;
