import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../services/productService";

function SalesManage({ users, setUsers }) {
const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleAdd = async () => {
    await addProduct({ name: "신규 메뉴", price: 5000, stock: 10 });
    await loadProducts();
  };

  const handleUpdate = async (id) => {
    await updateProduct(id, { price: 6000 });
    await loadProducts();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    await loadProducts();
  };

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  }
  ;

  return(
    <div className="admin-board">
      <div className="admin-left">
        <Sidebar />
      </div>
      <div className="admin-right">
        <div className="admin-header">
          <AdminHeader />
        </div>

        <div className="admin-title">
          <h3>판매 현황</h3>
          <p>카페 메뉴를 추가, 편집, 삭제할 수 있습니다.</p>
        </div>


        <div className='admin-menu-list'>

          <div className="admin-service">

          </div>
        </div>

      </div>
    </div>
  )
}

export default SalesManage;