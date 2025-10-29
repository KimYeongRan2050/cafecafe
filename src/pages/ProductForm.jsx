import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { uploadProductImage, saveProductImagePath } from "../services/productImage";

export default function ProductForm() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    tags: "",
    imageFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProductData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: insertedProduct, error: insertError } = await supabase
      .from("drinks")
      .insert([
        {
          name: productData.name,
          description: productData.description,
          price: parseInt(productData.price),
          tags: productData.tags,
        },
      ])
      .select()
      .single();

    if (insertError || !insertedProduct) {
      console.error("상품 등록 실패:", insertError);
      return;
    }

    const productId = insertedProduct.id;

    if (productData.imageFile) {
      const imagePath = await uploadProductImage(productData.imageFile, productId);
      if (imagePath) {
        await saveProductImagePath(productId, imagePath);
      }
    }

    alert("상품 등록 완료!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="상품명" onChange={handleChange} />
      <input name="description" placeholder="설명" onChange={handleChange} />
      <input name="price" type="number" placeholder="가격" onChange={handleChange} />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">상품 등록</button>
    </form>
  );
}
