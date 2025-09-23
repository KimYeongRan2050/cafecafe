import React, { useState } from 'react';
import { uploadImage } from '../services/storageService';

function ImageUploader() {
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadImage(file);
    setImageUrl(url);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && (
        <div>
          <p>업로드 성공!</p>
          <img src={imageUrl} alt="Uploaded" width="300" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
