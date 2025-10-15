import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { getProductById } from "../services/productService";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("결제 처리 중...");

  useEffect(() => {
    async function processOrder() {
      try {
        const cart = location.state?.cart;
        if (!cart || cart.length === 0) {
          setStatus("장바구니 정보가 없습니다.");
          return;
        }

        for (const item of cart) {
          const { data: product } = await supabase
            .from("products")
            .select("*")
            .eq("id", item.id)
            .single();

          if (!product || product.stock < item.quantity) {
            setStatus(`${item.name} 재고 부족`);
            return;
          }

          await supabase.from("orders").insert([{
            product_id: item.id,
            quantity: item.quantity,
            total_price: item.price * item.quantity,
            created_at: new Date().toISOString()
          }]);

          await supabase
            .from("products")
            .update({ stock: product.stock - item.quantity })
            .eq("id", item.id);
        }

        setStatus("주문이 완료되었습니다.");
        setTimeout(() => navigate("/order/complete"), 2000);
      } catch (err) {
        console.error("결제 처리 오류:", err);
        setStatus("처리 중 오류 발생");
      }
    }

    processOrder();
  }, [navigate, location]);

  return (
    <div className="payment-success">
      <h2>카카오페이 결제 완료</h2>
      <p>{status}</p>
    </div>
  );
}

export default PaymentSuccess;
