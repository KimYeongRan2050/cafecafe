// src/services/dashboardService.js
import { supabase } from "./supabaseClient";

/**
 * 오늘 매출 합계
 */
export async function getTodaySummary() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("orders")
    .select("total_price, created_at")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (error) {
    console.error("getTodaySummary error:", error.message);
    return 0;
  }

  return data.reduce((sum, order) => sum + (order.total_price || 0), 0);
}

/**
 * 어제 매출 합계
 */
export async function getYesterdaySummary() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("orders")
    .select("total_price, created_at")
    .gte("created_at", `${yDate}T00:00:00`)
    .lte("created_at", `${yDate}T23:59:59`);

  if (error) {
    console.error("getYesterdaySummary error:", error.message);
    return 0;
  }

  return data.reduce((sum, order) => sum + (order.total_price || 0), 0);
}

/**
 * 총 주문 수 (전체 orders 행 개수)
 */
export async function getTotalOrders() {
  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("getTotalOrders error:", error.message);
    return 0;
  }

  return count || 0;
}

/**
 * 인기 용품 TOP 5 (오늘 가장 많이 팔린 제품)
 */
export async function getTopDrinks() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("orders")
    .select("product_name, quantity, created_at")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (error) {
    console.error("getTopDrinks error:", error.message);
    return [];
  }

  // 제품별 판매량 합산
  const productMap = {};
  data.forEach((order) => {
    if (order.product_name && order.quantity) {
      productMap[order.product_name] =
        (productMap[order.product_name] || 0) + order.quantity;
    }
  });

  // 정렬 및 상위 5개
  return Object.entries(productMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

/**
 * 오늘 대비 어제 매출 변화율
 */
export async function getSalesChangeRate() {
  const today = await getTodaySummary();
  const yesterday = await getYesterdaySummary();

  if (yesterday === 0) return 100;

  const diff = today - yesterday;
  return Math.round((diff / yesterday) * 100);
}
