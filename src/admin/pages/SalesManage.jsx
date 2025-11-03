// src/admin/pages/SalesManage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { supabase } from "../../services/supabaseClient";
import "../../admin/styles/admin.css";

function SalesManage() {
  const [orders, setOrders] = useState([]);
  const [sortType, setSortType] = useState("recent");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 검색 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 15;

  useEffect(() => {
    loadOrders();
    const subscription = supabase
      .channel("orders_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, loadOrders)
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (err) {
      console.error("판매 내역 불러오기 실패:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 검색 필터 추가
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.product_name?.toLowerCase().includes(term) ||
      order.name?.toLowerCase().includes(term)
    );
  });

  // 정렬
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortType === "lowPrice") return a.price - b.price;
    if (sortType === "highPrice") return b.price - a.price;
    if (sortType === "name")
      return a.product_name.localeCompare(b.product_name, "ko");
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  };

  const totalSales = filteredOrders.reduce(
    (sum, order) => sum + (order.total_price || 0),
    0
  );

  return (
    <div className="admin-board">
      <div className="admin-right">
        <div className="admin-header"><Header /></div>

        <div className="admin-title">
          <h3>판매 현황</h3>
          <p>결제 완료 주문 내역</p>
          <p>총 판매액: ₩{totalSales.toLocaleString()}</p>

          {/* 정렬 + 검색 나란히 배치 */}
          <div className="sales-toolbar">
            <div className="sales-select">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="recent">최신순</option>
                <option value="lowPrice">낮은순</option>
                <option value="highPrice">높은순</option>
                <option value="name">이름순</option>
              </select>
            </div>

            {/* 검색창 */}
            <div className="sales-search">
              <input
                type="text"
                placeholder="제품명 또는 주문자 검색"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="admin-menu-list">
          <div className="admin-service sales-default">
            <div>
              <table className="admin-list-tb">
                <thead>
                  <tr>
                    <th style={{ width: "2%" }}>No</th>
                    <th style={{ width: "15%" }}>주문번호</th>
                    <th>제품명</th>
                    <th style={{ width: "4%" }}>수량</th>
                    <th>단가</th>
                    <th>총액</th>
                    <th>주문자</th>
                    <th style={{ width: "15%" }}>판매일</th>
                    <th>주문자 ID</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9}>불러오는 중...</td></tr>
                  ) : displayedOrders.length > 0 ? (
                    displayedOrders.map((order, index) => (
                      <tr key={order.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{order.order_number}</td>
                        <td>{order.product_name}</td>
                        <td>{order.quantity}</td>
                        <td>₩{order.price?.toLocaleString()}</td>
                        <td>₩{order.total_price?.toLocaleString()}</td>
                        <td>{order.user_name || "-"}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>{order.user_email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={9}>검색 결과가 없습니다.</td></tr>
                  )}
                </tbody>

                {orders.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={5}></td>
                      <td>총액: ₩ {totalSales.toLocaleString()}</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* 페이지네이션 */}
          <div className="paging">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  backgroundColor: currentPage === i + 1 ? "#007bff" : "white",
                  color: currentPage === i + 1 ? "white" : "#333",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesManage;
