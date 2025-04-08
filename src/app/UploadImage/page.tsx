"use client";
import React, { useState } from "react";

// ฟังก์ชันอัปโหลดรูปไปที่ Uploadcare
async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("UPLOADCARE_PUB_KEY", "493f914e6f4148830347"); // ใส่ Public Key ของคุณ

  const res = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return `https://ucarecdn.com/${data.file}/`; // คืน URL ของรูปที่อัปโหลด
}

const UploadImage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedUrl = await uploadImage(event.target.files[0]);
      setImageUrl(uploadedUrl); // อัปเดต URL รูป
    }
  };

  return (
    <div>
      <h2>อัปโหลดรูป</h2>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && (
        <div>
          <p>อัปโหลดสำเร็จ!</p>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ width: "200px", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
