import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { supabase } from "../../services/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

export default function SalesReport() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productSales, setProductSales] = useState([]);
  const [weekdayData, setWeekdayData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  const COLORS = ["#c35930", "#f59e0b", "#22c55e", "#3b82f6", "#9333ea", "#ef4444"];

  // 판매 데이터 불러오기
  const loadOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("orders")
        .select("product_name, total_price, quantity, created_at"); // 존재하는 컬럼만 선택

      if (startDate && endDate) {
        query = query
          .gte("created_at", `${startDate}T00:00:00+09:00`)
          .lte("created_at", `${endDate}T23:59:59+09:00`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data);
      processData(data);
    } catch (err) {
      console.error("판매 분석 데이터 로드 실패:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 데이터 분석 처리
  const processData = (data) => {
    if (!data.length) return;

    // 제품별 매출
    const productMap = {};
    data.forEach((o) => {
      if (o.product_name && o.total_price)
        productMap[o.product_name] = (productMap[o.product_name] || 0) + o.total_price;
    });
    setProductSales(
      Object.entries(productMap)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
    );

    // 요일별 매출
    const dayMap = {};
    data.forEach((o) => {
      const day = new Date(o.created_at).toLocaleDateString("ko-KR", { weekday: "short" });
      dayMap[day] = (dayMap[day] || 0) + o.total_price;
    });
    setWeekdayData(Object.entries(dayMap).map(([day, total]) => ({ day, total })));

    // 시간대별 매출
    const hourMap = {};
    data.forEach((o) => {
      const hour = new Date(o.created_at).getHours();
      hourMap[hour] = (hourMap[hour] || 0) + o.total_price;
    });
    setHourlyData(Object.entries(hourMap).map(([hour, total]) => ({ hour: `${hour}시`, total })));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) return <div className="loading">판매 데이터 불러오는 중...</div>;

  const totalSales = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? totalSales / totalOrders : 0;

  return (
    <div className="admin-board">
      <div className="admin-right">
        <div className="admin-header"><Header /></div>

        <div className="sales-report-page">
          <h2>판매 분석 리포트</h2>

          {/* 기간 선택 */}
          <div className="filter-box">
            <label>기간 선택 :</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span> ~ </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={loadOrders}>조회</button>
          </div>

          {/* 통계 요약 */}
          <div className="sales-summary">
            <div className="card">
              <h4>총 판매액</h4>
              <p>₩{totalSales.toLocaleString()}</p>
            </div>
            <div className="card">
              <h4>총 주문 수</h4>
              <p>{totalOrders}건</p>
            </div>
            <div className="card">
              <h4>평균 주문 금액</h4>
              <p>₩{avgOrder.toLocaleString()}</p>
            </div>
          </div>

          {/* 제품별 매출 TOP10 */}
          <div className="admin-title chart-area">
            <h3>제품별 매출 TOP 10</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => `₩${v.toLocaleString()}`} />
                <Bar dataKey="total" fill="#c35930" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 요일별 매출 */}
          <div className="admin-title chart-area">
            <h3>요일별 매출 추세</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(v) => `₩${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 시간대별 매출 */}
          <div className="admin-title chart-area">
            <h3>시간대별 매출</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(v) => `₩${v.toLocaleString()}`} />
                <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
