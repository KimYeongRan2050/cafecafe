import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getTodaySummary,
  getSalesChangeRate,
  getTopDrinks,
  getTotalOrders,
} from "../../services/dashboardService";
import { getTotalStaffCount } from "../../services/userService";
import { getAllLowStockItems } from "../../services/productService";

function Dashboard({ adminInfo, onLogout }) {
  const [totalStaff, setTotalStaff] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topDrinks, setTopDrinks] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 오늘 매출
        const sales = await getTodaySummary();
        setTodaySales(sales);

        // 전일 대비 매출 변화율
        const changeRate = await getSalesChangeRate();
        setSalesChange(changeRate);

        // 총 주문 수
        const orders = await getTotalOrders();
        setTotalOrders(orders);

        // 직원 수
        const staffCount = await getTotalStaffCount();
        setTotalStaff(staffCount);

        // 인기 용품 TOP 5
        const drinks = await getTopDrinks();
        setTopDrinks(drinks);

        // 재고 부족 알림
        const lowStock = await getAllLowStockItems();
        const sortedLowStock = [...lowStock].sort((a, b) => {
          if (a.status === "긴급" && b.status !== "긴급") return -1;
          if (a.status !== "긴급" && b.status === "긴급") return 1;
          return a.stock - b.stock;
        });
        setLowStockItems(sortedLowStock);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="admin-board">
      
      <div className="admin-right">
        <div className="admin-header"><Header /></div>

        {/* 상단 대시보드 카드 */}
        <div className="cafe-dashboard">
          <div className="dashboard box one">
            <h4>오늘 매출</h4>
            <i className="bi bi-graph-up-arrow"></i>
            <div className="num price">₩{todaySales.toLocaleString()}</div>
            <p>
              <span className={ salesChange > 0 ? "plus" : salesChange < 0 ? "minus" : "zero" } >
                {salesChange > 0 ? `+${salesChange}%` : `${salesChange}%`}
              </span>{" "}
              전일 대비
            </p>
          </div>

          <div className="dashboard box two">
            <h4>총 주문</h4>
            <i className="bi bi-cart"></i>
            <div className="num">{totalOrders}</div>
            <p><span className="plus">+3%</span> 전일 대비</p>
          </div>

          <div className="dashboard box three">
            <h4>재직 직원</h4>
            <i className="bi bi-person"></i>
            <div className="num">{totalStaff}</div>
            <p><span className="zero">0</span> 전일 대비</p>
          </div>

          <div className="dashboard box fore">
            <h4>재고 부족</h4>
            <i className="bi bi-box"></i>
            <div className="num">{lowStockItems.length}</div>
            <p><span className="minus">-2%</span> 전일 대비</p>
          </div>
        </div>

        {/* 하단 리스트 */}
        <div className="dashboard_list">
          {/* 인기 용품 */}
          <div className="item_list the_best_drink">
            <h4>인기 용품</h4>
            <p>오늘 가장 많이 판매된 용품 TOP 5</p>
            <div className="drink_list">
              <ul>
                {topDrinks.length > 0 ? (
                  topDrinks.map((drink, idx) => (
                    <li key={idx}>
                      <span>{idx + 1}</span>
                      <div className="list_bar">
                        <p>
                          {drink.name} <span>{drink.quantity} 개</span>
                        </p>
                        <input type="range" min="1" max="50" value={drink.quantity} readOnly />
                      </div>
                    </li>
                  ))
                ) : (
                  <li>오늘 판매된 용품이 없습니다.</li>
                )}
              </ul>
            </div>
          </div>

          {/* 재고 부족 알림 */}
          <div className="item_list shortage_stock">
            <h4>재고 부족 알림</h4>
            <p>메뉴 및 바리스타 용품 중 재고가 부족한 항목</p>
            <div className="stock_list">
              <ul>
                {lowStockItems.map((item) => (
                  <li key={item.id}>
                    {item.name}
                    <span className={`product-list ${ item.status === "긴급" ? "urgent" : "low"}`}>
                      {item.status}
                    </span>
                    <p>{item.stock} 개 남음</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
