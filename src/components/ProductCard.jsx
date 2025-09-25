import React from "react";
import { getProductImageUrl } from "../services/productImage";

export default function ProductCard({ product, onAddToCart, onCancel }) {
  const imageUrl = getProductImageUrl(product.image);

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

  const tags  = [...baseTags, ...booleanTags];
  
  return (
    <div className="main_coffee main_stars">

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

        <ul className="product_icon">
          {tags.map((tag) => (
            <li key={`${product.id}-${tag}`} className={tag.toLowerCase()}>
              {tag}
            </li>
          ))}
        </ul>

        <ul className="product_icon">
          <li className={`stock ${product.stock < 10 ? 'out' : ''}`}>
            {product.stock ?? 0}
          </li>
        </ul>
      </div>
    
      <div className="main_txt">
        <div className="star">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`fa fa-star ${i < (product.stars || 0) ? 'checked' : ''}`}
            ></span>
          ))}
        </div>
        <h4>{product.name || "상품명 없음"}</h4>
        <p>{product.description || "설명이 없습니다."}</p>
        <div className="price">
          ￦{product.price ? product.price.toLocaleString() : "0"}
        </div>
        <div className="btn">
          <button onClick={() => onAddToCart(product)}>장바구니</button>
          <button onClick={() => onCancel(product)}>취소</button>
        </div>
      </div>
    </div>
  );
}
