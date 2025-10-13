import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { 
  getBaristaProducts, 
  addBaristaProduct, 
  updateBaristaProduct, 
  deleteBaristaProduct 
} from "../../services/productService";
import AddOrderPopup from "../popup/AddOrderPopup";
import { getProductImageUrl } from "../../services/productImage";

function OrderManage() {
  const [products, setProducts] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const baristaList = await getBaristaProducts();

    const combined = [...baristaList];
    const sorted = combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setProducts(sorted);
  };

  const handleAddClick = () => {
    setShowAddPopup(true);
  };

  const handleProductSaved = async () => {
    await loadProducts();
    setShowAddPopup(false);
    setShowEditPopup(false);
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowEditPopup(true);
  };

  const handleDelete = async (id) => {
    await deleteBaristaProduct(id);
    await loadProducts();
  };

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

        <div className="admin-title">
          <h3>바리스타 용품</h3>
          <p>카페 메뉴를 추가, 편집, 삭제할 수 있습니다.</p>
          <button onClick={handleAddClick}>
            <i className="bi bi-bag-plus"></i>바리스타 용품 추가
          </button>
        </div>

        <div className='admin-menu-list'>
          <div className="admin-service admin-coffee-product">
            {products.map(product => {
              const imageSrc =
                product.image && typeof product.image === "string" && product.image.trim() !== "" && product.image !== "null" && product.image !== "undefined"
                  ? getProductImageUrl(product.image)
                  : getProductImageUrl("default.png");

              const baseTags = Array.isArray(product.tags)
                ? product.tags.filter(tag => tag.trim() !== "")
                : typeof product.tags === "string"
                  ? product.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
                  : [];

              const booleanTags = [
                product.is_best ? "best" : null,
                product.is_sale ? "sale" : null,
                product.is_new ? "new" : null,
              ].filter(Boolean);

              const tags = [...baseTags, ...booleanTags];

              return (
                <div className='main_coffee main_stars' key={product.id}>

                  <div className="main_img"> 
                    <img 
                      className="product-image" 
                      src={imageSrc} 
                      alt={product.name} /> 
                  </div>

                  <div className="coffee black">
                    <ul className="product_icon">
                      {booleanTags.map(tag => (
                        <li key={tag} className={tag.toLowerCase()}>
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <ul className='product_icon'>
                      <li className={`stock ${product.stock < 10 ? 'out' : ''}`}>
                        {product.stock ?? 0}
                      </li>
                    </ul>
                  </div>

                  <div className='main_txt'>
                    <div className='star four'>
                      <span className="fa fa-star checked"></span>
                      <span className="fa fa-star checked"></span>
                      <span className="fa fa-star checked"></span>
                      <span className="fa fa-star checked"></span>
                      <span className="fa fa-star"></span>
                    </div>

                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <div className='price'>{product.price}원</div>

                    <div className="btn">
                      <button onClick={() => handleEditClick(product)}>수정</button>
                      <button onClick={() => handleDelete(product.id)}>삭제</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {showAddPopup && (
            <AddOrderPopup
              onClose={() => setShowAddPopup(false)}
              onSaved={handleProductSaved}
            />
          )}

          {showEditPopup && editProduct && (
            <AddOrderPopup
              onClose={() => setShowEditPopup(false)}
              onSaved={handleProductSaved}
              isEdit={true}
              product={editProduct}
            />
          )}

        </div>
      </div>
    </div>
  )
};

export default OrderManage;