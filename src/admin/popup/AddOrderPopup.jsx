import React, { useEffect, useState } from "react";
import { addBaristaProduct , updateBaristaProduct, addProduct, updateProduct} from "../../services/productService";

function AddOrderPopup({ onClose, onSaved, isEdit = false, product }) {
  const [form, setForm] = useState({
    name:"",
    price:"",
    stock:"",
    description:"",
    tags: "",
    imageclass:"",
    is_best: false,
    is_sale: false,
    is_new: false
  });

  useEffect(() => {
    if (isEdit && product) {
      let categoryValue = "more";

      switch (product.imageclass){
        case "coffee" :
          categoryValue = "coffee";
          break;
        case "latte" :
          categoryValue = "latte";
          break;
        case "bean" :
          categoryValue = "bean";
          break;
        case "barista" :
          categoryValue = "barista";
          break;
        default:
          categoryValue = "more";
      }

      setForm({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : product.tags || "",
        imageclass: categoryValue,
        is_best: product.is_best || false,
        is_sale: product.is_sale || false,
        is_new: product.is_new || false
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedTags = form.tags?.trim()
      ? form.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
      : [];

    const productData = {
      name: form.name,
      price: parseInt(form.price, 10),
      stock: parseInt(form.stock, 10),
      description: form.description,
      imageclass: form.imageclass,
      is_best: form.is_best,
      is_sale: form.is_sale,
      is_new: form.is_new
    };

    try {
      // coffee, latte → products 테이블
      if (form.imageclass === "coffee" || form.imageclass === "latte") {
        if (isEdit) {
          await updateProduct(product.id, productData);
        } else {
          await addProduct(productData);
        }
      } 
      // 그 외 → barista_products 테이블
      else {
        if (isEdit) {
          await updateBaristaProduct(product.id, productData);
        } else {
          await addBaristaProduct(productData);
        }
      }

      await onSaved();
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
        <h3>용품 추가</h3>
        <form onSubmit={handleSubmit}>
          {/* imageclass 선택 */}
          <label>카테고리</label>
          <select className="select" name="imageclass" value={form.imageclass} onChange={handleChange}>
            <option value="coffee">커피</option>
            <option value="latte">라떼</option>
            <option value="bean">원두</option>
            <option value="barista">바리스타 용품</option>
            <option value="more">기타 메뉴</option>
          </select>

          <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
          <input name="price" placeholder="가격" value={form.price} onChange={handleChange} required />
          <input name="stock" placeholder="재고" value={form.stock} onChange={handleChange} required />
          <input name="description" placeholder="설명" value={form.description} onChange={handleChange} />
          
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

          <button type="submit">{isEdit ? "수정" : "추가"}</button>
        </form>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}

export default AddOrderPopup;