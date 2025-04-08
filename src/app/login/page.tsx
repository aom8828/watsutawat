"use client";
import React, { useState } from "react";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase_config";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ฟังก์ชันการเข้ารหัส AES-256
const encryptPassword = (password: string | CryptoJS.lib.WordArray) => {
  const encrypted = CryptoJS.AES.encrypt(password, "secret-key-123").toString();
  return encrypted;
};

// ฟังก์ชันการถอดรหัส AES-256
const decryptPassword = (encryptedPassword: string | CryptoJS.lib.CipherParams) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, "secret-key-123");
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const dbRef = ref(database);
    get(child(dbRef, `members/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setError("ชื่อผู้ใช้นี้มีอยู่แล้ว");
      } else {
        // เข้ารหัสรหัสผ่านก่อนเก็บ
        const encryptedPassword = encryptPassword(password);
        set(ref(database, `members/${username}`), {
          username: username,
          password: encryptedPassword, // เก็บรหัสผ่านที่ถูกเข้ารหัส
          role: 1,
        })
          .then(() => {
            setMode("login");
            Swal.fire({
              title: "สำเร็จ",
              text: "สมัครสมาชิกเสร็จสิ้น! กรุณาล็อกอิน",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
          })
          .catch((error) => {
            setError("เกิดข้อผิดพลาด: " + error.message);
          });
      }
    });
  };

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const dbRef = ref(database);
    get(child(dbRef, `members/${username}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const decryptedPassword = decryptPassword(userData.password); // ถอดรหัสจากฐานข้อมูล

          if (decryptedPassword === password) {
            setError("");
            // เก็บข้อมูลผู้ใช้และ role ใน sessionStorage
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("role", userData.role);

            Swal.fire({
              title: "เข้าสู่ระบบสำเร็จ",
              text: "ยินดีต้อนรับ!",
              icon: "success",
              confirmButtonText: "ตกลง",
            });

            // คุณสามารถนำทางไปหน้าหลักหรือหน้าอื่นๆ ได้ที่นี่ เช่น:
            window.location.href = "/";
          } else {
            setError("รหัสผ่านไม่ถูกต้อง");
          }
        } else {
          setError("ชื่อผู้ใช้ไม่ถูกต้อง");
        }
      })
      .catch((error) => {
        setError("เกิดข้อผิดพลาด: " + error.message);
      });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src="/bg.png"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10" />

      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-8 w-[90%] max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">เข้าสู่ระบบ</h1>

          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-full border border-[#DFC900] text-sm font-medium transition ${
                mode === "login"
                  ? "bg-[#DFC900] text-white"
                  : "bg-white text-[#DFC900]"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-r-full border border-[#DFC900] text-sm font-medium transition ${
                mode === "signin"
                  ? "bg-[#DFC900] text-white"
                  : "bg-white text-[#DFC900]"
              }`}
              onClick={() => setMode("signin")}
            >
              Sign In
            </button>
          </div>

          <form
            className="space-y-4"
            onSubmit={mode === "login" ? handleLogin : handleSignIn}
          >
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DFC900] text-black"
            />
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#DFC900] text-black"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#DFC900] hover:bg-yellow-400 text-white font-semibold py-2 rounded transition"
            >
              {mode === "login"
                ? "เข้าสู่ระบบ (Login)"
                : "สมัครสมาชิก (Sign In)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
