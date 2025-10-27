import { supabase } from "./supabaseClient";

/**
 * 오늘 매출 합계 (KST 기준)
 */
export async function getTodaySummary() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC → KST 보정
  const today = koreaTime.toISOString().split("T")[0];

  const todayStart = new Date(`${today}T00:00:00+09:00`).toISOString();
  const todayEnd = new Date(`${today}T23:59:59+09:00`).toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("total_price, created_at")
    .gte("created_at", todayStart)
    .lte("created_at", todayEnd);

  if (error) {
    console.error("getTodaySummary error:", error.message);
    return 0;
  }

  return data.reduce((sum, order) => sum + (order.total_price || 0), 0);
}

/**
 * 어제 매출 합계 (KST 기준)
 */
export async function getYesterdaySummary() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  koreaTime.setDate(koreaTime.getDate() - 1); // 어제 날짜
  const yDate = koreaTime.toISOString().split("T")[0];

  const yStart = new Date(`${yDate}T00:00:00+09:00`).toISOString();
  const yEnd = new Date(`${yDate}T23:59:59+09:00`).toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("total_price, created_at")
    .gte("created_at", yStart)
    .lte("created_at", yEnd);

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
 * 오늘 인기 용품 TOP 5 (KST 기준)
 */
export async function getTopDrinks() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = koreaTime.toISOString().split("T")[0];

  const todayStart = new Date(`${today}T00:00:00+09:00`).toISOString();
  const todayEnd = new Date(`${today}T23:59:59+09:00`).toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("product_name, quantity, created_at")
    .gte("created_at", todayStart)
    .lte("created_at", todayEnd);

  if (error) {
    console.error("getTopDrinks error:", error.message);
    return [];
  }

  // 제품별 수량 합산
  const productMap = {};
  data.forEach((order) => {
    if (order.product_name && order.quantity) {
      productMap[order.product_name] =
        (productMap[order.product_name] || 0) + Number(order.quantity);
    }
  });

  // 수량순 정렬 후 상위 5개만
  return Object.entries(productMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
}

/**
 * 오늘 대비 어제 매출 변화율 (%)
 */
export async function getSalesChangeRate() {
  const today = await getTodaySummary();
  const yesterday = await getYesterdaySummary();

  if (yesterday === 0) return 100;

  const diff = today - yesterday;
  return Math.round((diff / yesterday) * 100);
}
