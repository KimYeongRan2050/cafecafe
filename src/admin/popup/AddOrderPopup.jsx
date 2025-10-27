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
    option: "1kg",     // 예: 200g, 1kg, 500ml
    quantity: "1개",   // 예: 1개, 2개입 등
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

  const [optionValue, setOptionValue] = useState("1");
  const [optionUnit, setOptionUnit] = useState("kg"); // g/kg/ml 용량 단위
  const [quantityValue, setQuantityValue] = useState("1");
  const [quantityUnit, setQuantityUnit] = useState("개"); // 개, 세트 등 판매 단위

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name: product.name || "",
        option: product.option || "1kg",
        quantity: product.quantity || "1개",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        imageclass: product.imageclass || "more",
        is_best: product.is_best || false,
        is_sale: product.is_sale || false,
        is_new: product.is_new || false,
        rating: product.rating || 0,
      });

      // 제품 용량 분리
      const match = String(product.option || "").match(/^(\d+)\s*([a-z가-힣]+)/);
      if (match) {
        setOptionValue(match[1]);
        setOptionUnit(match[2]);
      }

      // 판매 단위 분리
      const qMatch = String(product.quantity || "").match(/^(\d+)\s*([가-힣]+)/);
      if (qMatch) {
        setQuantityValue(qMatch[1]);
        setQuantityUnit(qMatch[2]);
      }
    }
  }, [isEdit, product]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      option: `${optionValue}${optionUnit}`,
    }));
  }, [optionValue, optionUnit]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      quantity: `${quantityValue}${quantityUnit}`,
    }));
  }, [quantityValue, quantityUnit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stock" || name === "price") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleBoolean = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageSaved = (fileName) => {
    setForm((prev) => ({ ...prev, image: fileName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // "1개" 같은 입력값을 숫자로 변환
      const numericStock = parseInt(String(form.stock).replace(/[^0-9]/g, ""), 10);
      const numericPrice = parseInt(String(form.price).replace(/[^0-9]/g, ""), 10);

      if (isNaN(numericStock) || isNaN(numericPrice)) {
        alert("가격과 재고는 숫자만 입력해주세요.");
        return;
      }

      // form에서 최종 데이터 구성
      const productData = {
        ...form,
        option: form.option?.trim() || "1kg",
        quantity: form.quantity?.trim() || "1개",
        price: numericPrice,
        stock: numericStock,
        created_at: new Date().toISOString(),
      };

      console.log("📦 Supabase로 전송할 데이터:", productData);

      // 신규 추가 또는 수정
      let savedProduct;

      if (isEdit) {
        savedProduct = await updateBaristaProduct(product.id, productData);
      } else {
        savedProduct = await addBaristaProduct(productData);
        if (savedProduct?.id) {
          setProductId(savedProduct.id);
        }
      }

      // 완료 후 닫기
      alert(isEdit ? "제품이 수정되었습니다." : "제품이 추가되었습니다.");
      onSaved();
      onClose();
    } catch (error) {
      console.error("저장 오류:", error);
      alert("저장 중 오류 발생: " + error.message);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{isEdit ? "바리스타 용품 수정" : "바리스타 용품 추가"}</h3>
        <form onSubmit={handleSubmit}>
          {/* 카테고리 */}
          <div className="popup-product-list">
            <label>카테고리</label>
            <p>카테고리</p>
            <select className="select" name="imageclass" value={form.imageclass} onChange={handleChange}>
              <option value="bean">원두</option>
              <option value="barista">커피머신</option>
              <option value="more">그외 제품</option>
            </select>
          </div>

          {/* 제품명 */}
          <div className="popup-product-list">
            <p>제품명</p>
            <input name="name" placeholder="제품 이름" value={form.name} onChange={handleChange} required />
          </div>

          {/* 제품 용량 */}
          <div className="popup-product-list">
            <p>제품 용량</p>
            <input type="text" placeholder="예: 200" value={optionValue} 
              onChange={(e) => setOptionValue(e.target.value.replace(/[^0-9]/g, ""))} />
          </div>

          <div className="unit-buttons">
            {["g", "kg", "ml"].map((unit) => (
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

          {/* 판매 단위 */}
          <div className="popup-product-list">
            <p>판매 단위</p>
              <input
                type="text"
                placeholder="예: 2"
                value={quantityValue}
                onChange={(e) => setQuantityValue(e.target.value.replace(/[^0-9]/g, ""))}
              />
          </div>

          <div className="unit-buttons">
            {["개", "세트"].map((unit) => (
              <button
                type="button"
                key={unit}
                className={quantityUnit === unit ? "active" : ""}
                onClick={() => setQuantityUnit(unit)}
              >
                {unit}
              </button>
            ))}
          </div>

          {/* 가격 / 재고 */}
          <div className="popup-product-list">
            <p>가격</p>
            <input
              name="price"
              placeholder="가격"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="popup-product-list">
            <p>재고</p>
            <input
              name="stock"
              placeholder="재고"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          {/* 설명 */}
          <div className="popup-product-list">
            <p>설명</p>
            <textarea
              name="description"
              placeholder="설명"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* 별점 */}
          <label>별점</label>
          <div className="rating-select">
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
            {["is_best", "is_sale", "is_new"].map((field) => (
              <button
                key={field}
                type="button"
                className={form[field] ? "active" : ""}
                onClick={() => toggleBoolean(field)}
              >
                {field.replace("is_", "").toUpperCase()}
              </button>
            ))}
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
  );
}

export default AddOrderPopup;
