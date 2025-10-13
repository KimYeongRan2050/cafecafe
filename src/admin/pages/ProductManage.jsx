import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getBaristaProducts 
} from "../../services/productService";
import AddProductPopup from "../popup/AddProductPopup";
import { getProductImageUrl } from "../../services/productImage";

function ProductManage() {
  const [products, setProducts] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const productList = await getProducts(); // coffee, latte
    
    const combined = [...productList];
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
    await deleteProduct(id);
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
          <h3>메뉴 관리</h3>
          <p>카페 메뉴를 추가, 편집, 삭제할 수 있습니다.</p>
          <button onClick={handleAddClick}>
            <i className="bi bi-bag-plus"></i>메뉴 추가
          </button>
        </div>

        <div className='admin-menu-list'>
          <div className="admin-service admin-coffee-product">
            {products.map(p => {
              const imageSrc =
                p.image && typeof p.image === "string" && p.image.trim() !== "" && p.image !== "null" && p.image !== "undefined"
                  ? getProductImageUrl(p.image)
                  : getProductImageUrl("default.png");

              const baseTags = Array.isArray(p.tags)
                ? p.tags.filter(tag => tag.trim() !== "")
                : typeof p.tags === "string"
                  ? p.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
                  : [];

              const booleanTags = [
                p.is_best ? "best" : null,
                p.is_sale ? "sale" : null,
                p.is_new ? "new" : null,
              ].filter(Boolean);

              const tags = [...baseTags, ...booleanTags];

              return (
                <div className='main_coffee main_stars' key={p.id}>

                  <div className="main_img"> 
                    <img 
                      className="product-image" 
                      src={imageSrc} 
                      alt={p.name} /> 
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
                      <li className={`stock ${p.stock < 10 ? 'out' : ''}`}>
                        {p.stock ?? 0}
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

                    <h4>{p.name}</h4>
                    <p>{p.description}</p>
                    <div className='price'>{p.price}원</div>

                    <div className="btn">
                      <button onClick={() => handleEditClick(p)}>수정</button>
                      <button onClick={() => handleDelete(p.id)}>삭제</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showAddPopup && (
            <AddProductPopup
              onClose={() => setShowAddPopup(false)}
              onSaved={handleProductSaved}
            />
          )}

          {showEditPopup && editProduct && (
            <AddProductPopup
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

export default ProductManage;