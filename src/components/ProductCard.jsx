import React, { useState } from "react";
import { getProductImageUrl } from "../services/productImage";

export default function ProductCard({ product, onAddToCart, onCancel }) {
  const imageUrl = getProductImageUrl(product.image);
  const imageClass = product.imageClass || product.imageclass || "coffee"

  const baseTags = Array.isArray(product.tags)
    ? product.tags
    : typeof product.tags === "string"
      ? product.tags.split(',').map(tag => tag.trim())
      : [];

  const booleanTags = [
    product.is_best ? "best" : null,
    product.is_sale ? "sale" : null,
    product.is_new ? "new" : null,
  ].filter(Boolean);

  const tags = [...baseTags, ...booleanTags];
  
  // 옵션&수량 바리스타제품 또는 nore에서만 보이게
  const showOptionAndQuantity = imageClass === "bean" || imageClass === "more";

  return (
    <div className="main_coffee">
      {/* 이미지처리 */}
      <div className="main_img">
        <img
          className="product-image"
          src={imageUrl || getProductImageUrl("default.png")}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = getProductImageUrl("default.png");
          }}
        />
      </div>
      
      
      <div className={product.imageClass || "coffee"}>
        {/* 태그 표시 */}
        <ul className="product_icon">
          {tags.map((tag) => (
            <li key={`${product.id}-${tag}`} className={tag.toLowerCase()}>
              {tag}
            </li>
          ))}
        </ul>

        {/* 재고 표시 */}
        <ul className="product_icon">
          <li className={`stock ${product.stock < 10 ? 'out' : ''}`}>
            {product.stock ?? 0}
          </li>
        </ul>
      </div>

      <div className="main_txt">
        {/* 별점 표시 */}
        <div className="rating-select star-rating">
          {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`fa fa-star ${i < product.rating ? "checked" : ""}`}
          ></span>
        ))}
        </div>

        <h4>{product.name || "상품명 없음"}</h4>

        {/* 원두에 표시 그외는 공간만 확보 */}
        {/* 옵션 + 수량 */}
        {(product.option || product.quantity) && (
          <div className="option-area">
            {product.option && (
              <div className="option-btn">
                {product.option}
              </div>
            )}

            {product.quantity && (
              <div className="option-btn">
                <span>{product.quantity}</span>
              </div>
            )}
          </div>
        )}




        {/* 제품 설명 */}
        <p>{product.description || "설명이 없습니다."}</p>

        {/* 제품 가격 */}
        <div className="price">
          ￦{product.price ? product.price.toLocaleString() : "0"}
        </div>

        <div className="btn">
          <button onClick={() => onAddToCart({ ...product, image: imageUrl })}>장바구니</button>
          <button onClick={() => onCancel(product)}>취소</button>
        </div>

      </div>

    </div>
  );
}
