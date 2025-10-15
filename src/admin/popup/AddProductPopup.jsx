import React, { useEffect, useState } from "react";
import {
  addProduct,
  updateProduct
} from "../../services/productService";
import ImageUploader from '../../components/ImageUploader';

function AddProductPopup({ onClose, onSaved, isEdit = false, product }) {
  const [productId, setProductId] = useState(isEdit && product ? product.id : null);
  const [form, setForm] = useState({
    name:"",
    price:"",
    stock:"",
    description:"",
    imageclass:"coffee",
    is_best: false,
    is_sale: false,
    is_new: false,
    image: "",
    rating: 0,  //별점추가
  });

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        imageclass: product.imageclass || "other",
        is_best: product.is_best || false,
        is_sale: product.is_sale || false,
        is_new: product.is_new || false,
        image: product.image || "",
        rating : product.rating || 0, //기존 별점 불러오기
      });
    }
  }, [isEdit, product]);


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleBoolean = (field) => {
    setForm(prev => ({...prev, [field]: !prev[field] }));
  };

  // 오류 해결: 이미지 저장 핸들러 정의
  const handleImageSaved = (fileName) => {
    setForm((prev) => ({ ...prev, image: fileName }));
  };

  const handleRatingChange = (value) => {
    setForm((prev) => ({ ...prev, rating: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...form,
      price: parseInt(form.price, 10),
      stock: parseInt(form.stock, 10),
      created_at: new Date().toISOString(),
    };

    try {
      const savedProduct = isEdit
        ? await updateProduct(product.id, productData)
        : await addProduct(productData);

      if (!isEdit && savedProduct?.id) {
        setProductId(savedProduct.id);
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("저장 오류:", error);
      alert("저장 중 오류 발생: " + error.message);
    }
  };


  useEffect(() => {
    // 팝업 열릴 때 스크롤 막기
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return(
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{isEdit ? "메뉴 수정" : "메뉴 추가"}</h3>
        <form onSubmit={handleSubmit}>
          {/* imageclass 선택 */}
          <label>카테고리</label>
          <select className="select" name="imageclass" value={form.imageclass} onChange={handleChange}>
            <option value="coffee">커피</option>
            <option value="latte">라떼</option>
            <option value="grain">곡물라떼</option>
            <option value="other">그외 음료</option>
          </select>

          <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
          <input name="price" placeholder="가격" value={form.price} onChange={handleChange} required />
          <input name="stock" placeholder="재고" value={form.stock} onChange={handleChange} required />
          <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} required />
          
          {/* 별점 선택 */}
          <label>별점</label>
          <div className="rating-select">
            <p>별점표시 : </p>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`fa fa-star ${form.rating >= num ? "checked" : ""}`}
                onClick={() => handleRatingChange(num)}
                style={{ cursor: "pointer" }}
              ></span>
            ))}
          </div>

          {/* 토글 버튼 */}
          <div className="menu-btn toggle-buttons">
            <button
              type="button"
              className={form.is_best ? "active" : ""}
              onClick={() => toggleBoolean("is_best")}
            >
              BEST {form.is_best ? "" : ""}
            </button>

            <button
              type="button"
              className={form.is_sale ? "active" : ""}
              onClick={() => toggleBoolean("is_sale")}
            >
              SALE {form.is_sale ? "" : ""}
            </button>

            <button
              type="button"
              className={form.is_new ? "active" : ""}
              onClick={() => toggleBoolean("is_new")}
            >
              NEW {form.is_new ? "" : ""}
            </button>

          </div>

          {productId ? (
            <ImageUploader
              productId={productId}
              onImageSaved={handleImageSaved}
              initialImage={form.image}
            />
          ) : (
            <p style={{ color: "gray" }}>제품 등록 후 이미지를 업로드할 수 있습니다.</p>
          )}

          <button type="submit">{isEdit ? "수정" : "추가"}</button>
          
        </form>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}

export default AddProductPopup;