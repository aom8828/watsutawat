"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null); // เพิ่ม state สำหรับ username
  const [role, setRole] = useState<number | null>(null); // เพิ่ม state สำหรับ role
  const [isClient, setIsClient] = useState(false); // เช็คว่าเป็นฝั่ง client หรือไม่

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    // ตรวจสอบว่าอยู่ในฝั่งไคลเอนต์
    if (typeof window !== "undefined") {
      setIsClient(true);
      const storedUsername = sessionStorage.getItem("username");
      const storedRole = sessionStorage.getItem("role");

      setUsername(storedUsername); // เก็บ username จาก sessionStorage
      setRole(storedRole ? Number(storedRole) : null); // เก็บ role จาก sessionStorage
    }
  }, []);

  if (!isClient) return null; // ถ้ายังไม่ใช่ฝั่งไคลเอนต์ ให้ไม่แสดงอะไร

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b-4 border-[#DFC900] pb-1">
      <div className="w-full flex items-center justify-between px-2 py-3 relative">
        {/* โลโก้ด้านซ้าย */}
        <div className="w-12 h-12">
          <img
            src="/logo_wat.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* ชื่อวัดตรงกลาง */}
        <h1 className="text-xl font-bold text-gray-800 text-center flex-1">
          วัดสุทธาวาส อ.เมือง ฉะเชิงเทรา
        </h1>

        {/* ปุ่มเมนู */}
        <div className="relative  w-8 h-8">
          {!isMenuOpen && (
            <FontAwesomeIcon
              icon={faBars}
              className="text-[#DFC900] w-8 h-8 cursor-pointer"
              onClick={toggleMenu}
            />
          )}
        </div>
      </div>

      {/* เมนูแถบข้าง (Sidebar) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-yellow-100 shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-4 relative h-full z-60">
          {/* ปุ่มปิด */}
          <button
            className="absolute top-4 right-4 text-[#DFC900]"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
          </button>

          <p className="text-xl font-semibold text-[#DFC900] mt-10">เมนู</p>
          <ul className="space-y-3">
            <li>
              <Link
                href={username ? "/" : "/login"} // ใช้ username เพื่อเชื่อมไปหน้า home หรือ login
                onClick={toggleMenu}
                className="text-gray-800 hover:text-[#DFC900]"
              >
                {username ? username : "เข้าสู่ระบบ"}{" "}
                {/* แสดงชื่อผู้ใช้ หรือข้อความเข้าสู่ระบบ */}
              </Link>
            </li>

            {/* เช็คว่า role เป็น 5 หรือมากกว่าก่อนแสดงเมนูอัปโหลดรูป */}
            {/* {role && role >= 5 && (
              <li>
                <Link
                  href="/UploadImage"
                  onClick={toggleMenu}
                  className="text-gray-800 hover:text-[#DFC900]"
                >
                  อัปโหลดภาพ
                </Link>
              </li>
            )} */}
            <li>
              <Link
                href="/staff"
                onClick={toggleMenu}
                className="text-gray-800 hover:text-[#DFC900]"
              >
                บุคลากร
              </Link>
            </li>
            <li>
              <Link
                href="/About"
                onClick={toggleMenu}
                className="text-gray-800 hover:text-[#DFC900]"
              >
                เกี่ยวกับเรา
              </Link>
            </li>
            <li>
              <Link
                href="/Contact"
                onClick={toggleMenu}
                className="text-gray-800 hover:text-[#DFC900]"
              >
                ติดต่อเรา
              </Link>
            </li>
            {/* เช็คว่า role เป็น 1 หรือมากกว่าก่อนแสดงเมนูออกจากระบบ */}
            {role && role >= 1 && (
              <li>
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault(); // ป้องกันการเปลี่ยนหน้าโดย Link
                    sessionStorage.clear(); // เคลียร์ sessionStorage
                    toggleMenu(); // ปิดเมนู
                    window.location.reload(); // รีเฟรชหน้าเว็บ
                  }}
                  className="text-gray-800 hover:text-[#DFC900]"
                >
                  ออกจากระบบ
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
