import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { getProductById } from "../../services/productService"; // 상품 정보 조회 함수

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("처리 중...");

  useEffect(() => {
    async function processOrder() {
      try {
        const productId = searchParams.get("product_id");
        const quantity = Number(searchParams.get("quantity")) || 1;

        if (!productId || quantity <= 0) {
          setStatus("잘못된 요청입니다.");
          return;
        }

        // 1. 상품 정보 조회
        const product = await getProductById(productId);
        if (!product) {
          setStatus("상품 정보를 찾을 수 없습니다.");
          return;
        }

        // 2. 주문 저장
        const { error: orderError } = await supabase.from("orders").insert([{
          product_id: product.id,
          quantity,
          total_price: product.price * quantity,
          created_at: new Date().toISOString()
        }]);

        if (orderError) {
          console.error("주문 저장 실패:", orderError.message);
          setStatus("주문 저장 중 오류 발생");
          return;
        }

        // 3. 재고 차감
        const newStock = product.stock - quantity;
        if (newStock < 0) {
          setStatus("재고가 부족합니다.");
          return;
        }

        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", product.id);

        if (stockError) {
          console.error("재고 차감 실패:", stockError.message);
          setStatus("재고 업데이트 중 오류 발생");
          return;
        }

        setStatus("결제가 완료되었습니다. 주문이 저장되었습니다.");
        setTimeout(() => navigate("/order-success"), 2000);
      } catch (err) {
        console.error("결제 처리 오류:", err);
        setStatus("처리 중 오류가 발생했습니다.");
      }
    }

    processOrder();
  }, [navigate, searchParams]);

  return (
    <div className="payment-success">
      <h2>카카오페이 결제 완료</h2>
      <p>{status}</p>
    </div>
  );
}

export default PaymentSuccess;
