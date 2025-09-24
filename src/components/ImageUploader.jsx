import React, { useState } from 'react';
import {uploadProductImage, saveProductImagePath, getProductImageUrl, } from '../services/productImage';

function ImageUploader({ productId, onImageSaved }) {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !productId) {
      alert("제품 등록 후 이미지를 업로드할 수 있습니다.");
      return;
    }

    setUploading(true);

    const fileName = await uploadProductImage(file, productId);
    if (fileName) {
      await saveProductImagePath(productId, fileName);
      setImageUrl(getProductImageUrl(fileName));
      if (onImageSaved) onImageSaved(fileName);
    }

    setUploading(false);
  };

  return (
    <div className="image-uploader">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploading && <p>업로드 중...</p>}
      {imageUrl && (
        <div className="preview">
          <img src={imageUrl} alt="미리보기" style={{ width: '120px', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
