import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import {
  getTodaySummary,
  getTopDrinks,
  getLowInventory  
} from "../../services/dashboardService";

import {
  getTotalStaffCount
} from "../../services/userService";


function Dashboard() {
  const [totalStaff, setTotalStaff] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [topDrinks, setTopDrinks] = useState([]);
  const [lowStock, setLowStock] = useState([]);

useEffect(() => {
  async function fetchData() {
    try {
    const staffCount = await getTotalStaffCount();
    setTotalStaff(staffCount);

    const sales = await getTodaySummary();
    setTodaySales(sales);

    const drinks = await getTopDrinks();
    setTopDrinks(drinks);

    const inventory = await getLowInventory();
    setLowStock(inventory);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);


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
          </div>
          <div className="dashboard box three">
            <h4>재직 직원</h4>
            <i className="bi bi-person"></i>
            <div className='num'>{totalStaff}</div>
          </div>
          <div className="dashboard box fore">
            <h4>재고 부족</h4>
            <i className="bi bi-box"></i>
            <div className='num'>{lowStock.length}</div>
          </div>
        </div>

        <div className="dashboard_list">
          <div className="item_list the_best_drink">
            <h4>인기 음료</h4>
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

          <div className="item_list shortage_stock">
            <h4>재고 부족</h4>
            <ul>
              {lowStock.map(item => (
                <li key={item.id}>
                  {item.name}
                  <span className="product-list urgent">긴급</span>
                  <p>{item.stock} 개 남음</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
