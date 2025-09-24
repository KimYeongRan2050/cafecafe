import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

function Dashboard() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return(
    <div className="admin-board">
      <div className="admin-left">
        <Sidebar />
      </div>
      <div className="admin-right">
        <div className="admin-header">
          <AdminHeader />
        </div>

        <div className="cafe-dashboard">
          <div className="dashboard box one">
            <h4>오늘 매출</h4>
            <i className="bi bi-graph-up-arrow"></i>
            <div className='num price'>￦4,500</div>
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
            <div className='num'>8</div>
            <p><span className="zero">0</span> 전일 대비</p>
          </div>
          <div className="dashboard box fore">
            <h4>재고 부족</h4>
            <i className="bi bi-box"></i>
            <div className='num'>3</div>
            <p><span className="minus">-2%</span> 전일 대비</p>
          </div>
        </div>

        <div className="dashboard_list">
          <div className="item_list the_best_drink">
            <h4>인기 음료</h4>
            <p>오늘 가장 많이 판매된 음료 TOP 5</p>
            <div className="drink_list">
              <ul>
                <li>
                  <span>1</span>
                  <div className="list_bar">
                    <p>아메리카노 <span>15 잔</span></p>
                    <input type="range" min="1" max="50" value="15"></input>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div className="list_bar">
                    <p>카페라떼 <span>12 잔</span></p>
                    <input type="range" min="1" max="50" value="12"></input>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div className="list_bar">
                    <p>카푸치노 <span>12 잔</span></p>
                    <input type="range" min="1" max="50" value="8"></input>
                  </div>
                </li>
                <li>
                  <span>4</span>
                  <div className="list_bar">
                    <p>바닐라라떼 <span>12 잔</span></p>
                    <input type="range" min="1" max="50" value="7"></input>
                  </div>
                </li>
                <li>
                  <span>5</span>
                  <div className="list_bar">
                    <p>에스프레소 <span>12 잔</span></p>
                    <input type="range" min="1" max="50" value="5"></input>
                  </div>
                </li>
              </ul>
            </div>

          </div>
          <div className="item_list shortage_stock">
            <h4>인기 음료</h4>
            <p>재주문이 필요한 물품들</p>
            <div className="stock_list">
              <ul>
                <li>
                  에티오피아 원두<span className="product-list urgent">긴급</span>
                  <p>2 kg 남음</p>
                </li>
                <li>
                  바닐라 시럽<span className="product-list urgent">긴급</span>
                  <p>1 병 남음</p>
                </li>
                <li>
                  일회용 컵 (중)<span className="product-list tribe">부족</span>
                  <p>50 개 남음</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Dashboard;