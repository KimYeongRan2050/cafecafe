import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import {
  getTodaySummary,
  getTopDrinks
} from "../../services/dashboardService";

import { getTotalStaffCount } from "../../services/userService";

import { getAllLowStockItems } from "../../services/productService";

function Dashboard() {
  const [totalStaff, setTotalStaff] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [topDrinks, setTopDrinks] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const staffCount = await getTotalStaffCount();
        setTotalStaff(staffCount);

        const sales = await getTodaySummary();
        setTodaySales(sales);

        const drinks = await getTopDrinks();
        setTopDrinks(drinks);

        const lowStock = await getAllLowStockItems();

        // 정렬: 긴급 → 부족, 그리고 재고 수량 오름차순
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
      <div className="admin-left"><Sidebar /></div>
      <div className="admin-right">
        <div className="admin-header"><AdminHeader /></div>

        <div className="cafe-dashboard">
          <div className="dashboard box one">
            <h4>오늘 매출</h4>
            <i className="bi bi-graph-up-arrow"></i>
            <div className='num price'>￦{todaySales.toLocaleString()}</div>
            <p><span className="plus">+12%</span> 전일 대비</p>
          </div>
          <div className="dashboard box two">
            <h4>총 주문</h4>
            <i className="bi bi-cart"></i>
            <div className='num'>47</div>
            <p><span className="plus">+3%</span> 전일 대비</p>
          </div>
          <div className="dashboard box three">
            <h4>재직 직원</h4>
            <i className="bi bi-person"></i>
            <div className='num'>{totalStaff}</div>
            <p><span className="zero">0</span> 전일 대비</p>
          </div>
          <div className="dashboard box fore">
            <h4>재고 부족</h4>
            <i className="bi bi-box"></i>
            <div className='num'>{lowStockItems.length}</div>
            <p><span className="minus">-2%</span> 전일 대비</p>
          </div>
        </div>

        <div className="dashboard_list">
          <div className="item_list the_best_drink">
            <h4>인기 음료</h4>
            <p>오늘 가장 많이 판매된 음료 TOP 5</p>
            <div className="drink_list">
              <ul>
                {topDrinks.map((drink, idx) => (
                  <li key={idx}>
                    <span>{idx + 1}</span>
                    <div className="list_bar">
                      <p>{drink.name} <span>{drink.quantity} 잔</span></p>
                      <input type="range" min="1" max="50" value={drink.quantity} readOnly />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="item_list shortage_stock">
            <h4>재고 부족 알림</h4>
            <p>메뉴 및 바리스타 용품 중 재고가 부족한 항목</p>
            <div className="stock_list">
              <ul>
                {lowStockItems.map(item => (
                  <li key={item.id}>
                    {item.name}
                    <span className={`product-list ${item.status === '긴급' ? 'urgent' : 'low'}`}>
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
