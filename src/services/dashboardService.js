import { supabase } from "./supabaseClient";

// 오늘 매출 합계
export async function getTodaySummary() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("orders")
    .select("total_price")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (error) throw error;
  return data.reduce((sum, order) => sum + order.total_price, 0);
}

// 인기 음료 TOP 5
export async function getTopDrinks() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("orders")
    .select("product_id, quantity")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (error) throw error;

  const drinkMap = {};
  data.forEach(order => {
    drinkMap[order.product_id] = (drinkMap[order.product_id] || 0) + order.quantity;
  });

  const productIds = Object.keys(drinkMap);
  const { data: products } = await supabase
    .from("products")
    .select("id, name")
    .in("id", productIds);

  return products
    .map(p => ({ name: p.name, quantity: drinkMap[p.id] }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

// 재고 부족 품목
export async function getLowInventory() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .lt("stock", 10); // 기준: 10개 미만

  if (error) throw error;
  return data;
}
