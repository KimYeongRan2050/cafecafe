import { supabase } from "./supabaseClient";

export async function requestKakaoPay(orderInfo) {
  try {
    const response = await fetch("/api/kakao-pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderInfo)
    });

    if (!response.ok) {
      throw new Error("카카오페이 요청 실패");
    }

    const data = await response.json();

    // 예: { redirectUrl: "https://...", tid: "T1234567890" }
    return data;
  } catch (error) {
    console.error("카카오페이 요청 중 오류 발생:", error.message);
    throw error;
  }
}


// 주문 저장 및 재고 차감
export const processOrder = async (productId, quantity) => {
  // 1. 상품 정보 가져오기
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (productError || !product) throw new Error("상품 정보를 불러올 수 없습니다.");

  // 2. 총 가격 계산
  const totalPrice = product.price * quantity;

  // 3. 주문 저장
  const { error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        product_id: productId,
        quantity,
        total_price: totalPrice,
        created_at: new Date().toISOString()
      }
    ]);

  if (orderError) throw new Error("주문 저장 실패");

  // 4. 재고 차감
  const newStock = product.stock - quantity;
  const { error: stockError } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId);

  if (stockError) throw new Error("재고 업데이트 실패");

  return { success: true, totalPrice };
};
