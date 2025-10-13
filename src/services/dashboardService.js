import { supabase } from "./supabaseClient";

export async function getTodaySummary() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("orders")
    .select("total_price")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (error) throw error;
  return data.reduce((sum, order) => sum + (order.total_price || 0), 0);
}

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
    if (order.product_id && order.quantity) {
      drinkMap[order.product_id] = (drinkMap[order.product_id] || 0) + order.quantity;
    }
  });

  const productIds = Object.keys(drinkMap);
  if (productIds.length === 0) return [];

  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, name")
    .in("id", productIds);

  if (productError) throw productError;

  return products
    .map(p => ({
      name: p.name,
      quantity: drinkMap[p.id] || 0
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}
