import React, { useEffect, useState } from "react";
import {
  addBaristaProduct,
  updateBaristaProduct
} from "../../services/productService";
import ImageUploader from '../../components/ImageUploader';

function AddOrderPopup({ onClose, onSaved, isEdit = false, product }) {
  const [productId, setProductId] = useState(isEdit && product ? product.id : null);
  const [form, setForm] = useState({
    name: "",
    option: "",
    quantity: "",
    price: "",
    stock: "",
    description: "",
    imageclass: "",
    is_best: false,
    is_sale: false,
    is_new: false,
    image: "",
    rating: 0,
  });
  
  const [optionValue, setOptionValue] = useState("");
  //const [optionValueBtn, setOptionValueBtn] = useState("");
  const [optionUnit, setOptionUnit] = useState("");
  const [quantityValue, setQuantityValue] = useState("");

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name || "",
        option: product.option || "",
        quantity: product.quantity || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        imageclass: product.imageclass || "more",
        is_best: product.is_best || false,
        is_sale: product.is_sale || false,
        is_new: product.is_new || false,
        rating: product.rating || 0,
      });

      //옵션 분리
      const match = (product.option || "").match(/^(\d+)([a-z가-힣]+)$/);
      if(match){
        setOptionValue(match[1]);
        setOptionUnit(match[2]);
      }

      if (product.quantity) {
        setQuantityValue(product.quantity);
      }

    }
  }, [isEdit, product]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      option : optionValue && optionUnit ? `${optionValue} ${optionUnit}` : "",
    }));
  }, [optionValue, optionUnit]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      quantity : quantityValue,
    }));
  }, [quantityValue]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleBoolean = (field) => {
    setForm(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageSaved = (fileName) => {
    setForm((prev) => ({ ...prev, image: fileName }));
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
        ? await updateBaristaProduct(product.id, productData)
        : await addBaristaProduct(productData);

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
        <h3>{isEdit ? "바리스타 용품 수정" : "바리스타 용품 추가"}</h3>
        <form onSubmit={handleSubmit}>
          {/* imageclass 선택 */}
          <label>카테고리</label>
          <select className="select" name="imageclass" value={form.imageclass} onChange={handleChange}>
            <option value="bean">원두</option>
            <option value="barista">커피머신</option>
            <option value="more">그외 제품</option>
          </select>

          <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
          
          {/* 옵션 버튼 */}
          <label>옵션 선택</label>
          <div className="option-input-group">
            <input
              type="text"
              placeholder="예: 200"
              value={optionValue}
              onChange={(e) => setOptionValue(e.target.value)}
            />
            <div className="unit-buttons">
              {["g", "kg", "ml", "개"].map((unit) => (
                <button
                  type="button"
                  key={unit}
                  className={optionUnit === unit ? "active" : ""}
                  onClick={() => setOptionUnit(unit)}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          
          {/* 단위 입력 */}
          <label>단위 입력</label>
          <input
            type="text"
            placeholder="예: 2개"
            value={quantityValue}
            onChange={(e) => setQuantityValue(e.target.value)}
          />
            
          {optionUnit === "개" && (
            <div className="quantity-buttons">
              {[...Array(8)].map((_, i) => {
                const label = `${i + 1}개`;
                return (
                  <button
                    type="button"
                    key={label}
                    className={optionValue === label ? "active" : ""}
                    onClick={() => setQuantityValue(label)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <input name="price" placeholder="가격" value={form.price} onChange={handleChange} required />
          <input name="stock" placeholder="재고" value={form.stock} onChange={handleChange} required />
          <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} />
          
          {/* 별점 */}
          <label>별점</label>
          <div className="rating-select">
            <p>별점표시 : </p>
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`fa fa-star ${form.rating >= num ? "checked" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, rating: num }))}
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
          
          {/* 이미지 업로더 */}
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

export default AddOrderPopup;