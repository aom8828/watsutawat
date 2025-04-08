"use client";
import Image from "next/image";
import Header from "./components/Header";
import ImageGallery from "./components/ImageGallery";
import { motion } from "framer-motion";
import "swiper/swiper-bundle.css"; // นำเข้า CSS ของ Swiper
import "aos/dist/aos.css"; // นำเข้า CSS ของ AOS
import AOS from "aos";
import { useEffect } from "react";
import CalendarComponent from "../app/components/Calender";
import WatMap from "./components/Map";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // ระยะเวลาในการแอนิเมชั่น
      once: false, // ทำแค่ครั้งเดียว
    });
  }, []);
  return (
    <div className="w-full h-full pb-5">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Background and title with animation */}
        <div className="mt-20 relative shadow-2xs">
          <motion.img
            src="/bg.png"
            alt="bg"
            className="w-full h-[90vh] object-cover pointer-events-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 "></div>
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center "
            initial={{ y: -50, opacity: 0 }} // เริ่มต้นซ่อนข้อความ
            whileInView={{ y: 0, opacity: 1 }} // เมื่อเข้าสู่มุมมอง
            exit={{ y: -50, opacity: 0 }} // เมื่อออกจากมุมมอง
            transition={{ duration: 1 }}
            key="text-animation" // ทำให้เกิดการทำงานใหม่ทุกครั้งที่มีการเข้าและออกจากมุมมอง
          >
            <p
              className="text-white text-6xl font-bold"
              style={{
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)", // เงาที่ข้อความ
              }}
            >
              วัดสุทธาวาส อ.เมือง ฉะเชิงเทรา
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="w-[80%] mt-10 mx-auto">
          <p className="text-black text-2xl font-serif" data-aos="fade-up">
            ข่าวสาร
          </p>
          <div className="mt-3" data-aos="fade-up">
            <ImageGallery />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row mt-10 justify-center">
        <div className="w-[80%]  mt-10">
          <div data-aos="fade-up">
            <CalendarComponent />
          </div>
          <div className="w-[80%] h-[400px] mx-auto " data-aos="fade-up">
            <WatMap />
          </div>
        </div>
      </div>
    </div>
  );
}
