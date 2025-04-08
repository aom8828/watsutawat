"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import Swal from "sweetalert2";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// ดึงรายการรูปจาก Uploadcare
async function fetchUploadedImages() {
  const res = await fetch("https://api.uploadcare.com/files/", {
    method: "GET",
    headers: {
      Authorization:
        "Uploadcare.Simple 493f914e6f4148830347:1f512cd5e64893b61966",
    },
  });

  const data = await res.json();
  return data.results.map((file: any) => ({
    fileUrl: file.original_file_url,
    fileId: file.uuid,
  }));
}

// ฟังก์ชันลบรูป
async function deleteImage(fileId: string) {
  const res = await fetch(`https://api.uploadcare.com/files/${fileId}/`, {
    method: "DELETE",
    headers: {
      Authorization:
        "Uploadcare.Simple 493f914e6f4148830347:1f512cd5e64893b61966",
    },
  });
  return res.ok;
}

// ฟังก์ชันอัปโหลดรูป
async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("UPLOADCARE_PUB_KEY", "493f914e6f4148830347");

  const res = await fetch("https://upload.uploadcare.com/base/", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return `https://ucarecdn.com/${data.file}/`;
}

const ImageGallery = () => {
  const [images, setImages] = useState<{ fileUrl: string; fileId: string }[]>(
    []
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("role");
      setRole(storedRole ? Number(storedRole) : null);
    }

    async function loadImages() {
      const files = await fetchUploadedImages();
      setImages(files.reverse());
    }
    loadImages();
  }, []);

  const handleDelete = async (fileId: string) => {
    const success = await deleteImage(fileId);
    if (success) {
      const files = await fetchUploadedImages();
      setImages(files.reverse());
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = await uploadImage(file);
        setImages((prevImages) => [
          { fileUrl, fileId: fileUrl },
          ...prevImages,
        ]);
        Swal.fire("เพิ่มรูปสำเร็จ!", "", "success");
      }
    }
  };

  if (!isClient) return null; // รอให้ client โหลดก่อนค่อย render

  return (
    <div style={{ margin: "auto", width: "100%", borderRadius: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Swiper
          spaceBetween={15}
          slidesPerView={3}
          autoplay={{ delay: 1000 }}
          loop={true}
          pagination={{
            clickable: true,
            type: "bullets",
          }}
          style={{ flex: 1 }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div style={{ padding: "10px", position: "relative" }}>
                {role !== null && role >= 5 && (
                  <button
                    onClick={() => handleDelete(image.fileId)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    X
                  </button>
                )}
                <img
                  src={image.fileUrl}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: "300px",
                    height: "200px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setLightboxIndex(index)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* ปุ่มเพิ่มรูป */}
        {role !== null && role >= 5 && (
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#4CAF50",
              color: "white",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "30px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              +
            </label>
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleAddImage}
            />
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          open={lightboxIndex !== null}
          close={() => setLightboxIndex(null)}
          slides={images.map((image) => ({ src: image.fileUrl }))}
          index={lightboxIndex}
        />
      )}
    </div>
  );
};

export default ImageGallery;
