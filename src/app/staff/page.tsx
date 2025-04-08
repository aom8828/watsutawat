"use client";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import { firebaseConfig } from "../../../firebase_config";
import { initializeApp } from "firebase/app";
import Swal from "sweetalert2";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const addStaffToFirebase = (
  name: string,
  position: string,
  imageUrl: string
) => {
  const staffRef = ref(database, "staff/" + name);
  set(staffRef, { name, position, imageUrl });
};

const fetchStaffFromFirebase = (
  setStaff: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const staffRef = ref(database, "staff/");
  onValue(staffRef, (snapshot) => {
    const data = snapshot.val();
    const staffList = [];
    for (const key in data) {
      staffList.push(data[key]);
    }
    setStaff(staffList);
  });
};

const deleteStaffFromFirebase = (name: string, imageUrl: string) => {
  const staffRef = ref(database, "staff/" + name);
  remove(staffRef)
    .then(() => {
      console.log("ลบข้อมูลจาก Firebase เรียบร้อยแล้ว");
      const fileId = imageUrl.split("/").pop()?.split("/")[0];
      if (fileId) {
        const deleteUrl = `https://upload.uploadcare.com/delete/${fileId}/?UPLOADCARE_PUB_KEY=493f914e6f4148830347`;
        fetch(deleteUrl, { method: "DELETE" })
          .then(() => console.log("ลบรูปจาก Uploadcare เรียบร้อยแล้ว"))
          .catch((error) =>
            console.error("Error deleting from Uploadcare:", error)
          );
      }
    })
    .catch((error) => console.error("Error deleting from Firebase:", error));
};

const StaffList = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<number | null>(null); // 👈 ดึง role จาก sessionStorage

  useEffect(() => {
    fetchStaffFromFirebase(setStaff);

    // 👇 ดึง sessionStorage บน client เท่านั้น
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("role");
      if (storedRole) {
        setRole(Number(storedRole));
      }
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("UPLOADCARE_PUB_KEY", "493f914e6f4148830347");

      try {
        const res = await fetch("https://upload.uploadcare.com/base/", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setImageUrl(`https://ucarecdn.com/${data.file}/`);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleAddStaff = () => {
    if (name && position && imageUrl) {
      Swal.fire({
        title: "คุณแน่ใจไหม?",
        text: "คุณต้องการเพิ่มข้อมูลบุคลากรนี้?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "เพิ่ม",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          addStaffToFirebase(name, position, imageUrl);
          Swal.fire(
            "เพิ่มเรียบร้อย!",
            "ข้อมูลบุคลากรถูกเพิ่มแล้ว",
            "success"
          ).then(() => {
            setName("");
            setPosition("");
            setImageUrl("");
            setFile(null);
          });
        }
      });
    } else {
      alert("กรุณากรอกข้อมูลให้ครบ");
    }
  };

  const groupedStaff = staff.reduce((acc: any, member) => {
    const { position } = member;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(member);
    return acc;
  }, {});

  const sortedPositions = Object.keys(groupedStaff).sort(
    (a, b) => groupedStaff[b].length - groupedStaff[a].length
  );

  const handleDeleteStaff = (name: string, imageUrl: string) => {
    Swal.fire({
      title: "คุณแน่ใจไหม?",
      text: "คุณต้องการลบข้อมูลบุคลากรนี้ออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStaffFromFirebase(name, imageUrl);
        Swal.fire("ลบเรียบร้อย!", "ข้อมูลบุคลากรถูกลบแล้ว", "success");
      }
    });
  };

  return (
    <div className="p-5 text-black">
      <div className="flex items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="hover:bg-gray-300 text-black px-4 py-2 rounded-lg flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>

      <h1 className="text-center text-3xl font-bold mb-4 text-black">
        บุคลากร
      </h1>

      {/* ฟอร์มเพิ่มบุคลากร */}
      {role !== null && role >= 5 && (
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อ"
            className="p-2 border rounded mb-2 w-full"
          />
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="ตำแหน่ง"
            className="p-2 border rounded mb-2 w-full"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border rounded mb-2 w-full"
          />
          <button
            onClick={handleAddStaff}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            เพิ่มบุคลากร
          </button>
        </div>
      )}

      <div className="space-y-6">
        {sortedPositions.map((position) => (
          <div key={position}>
            <h2 className="text-xl font-semibold mb-2 text-center">
              {position}
            </h2>
            <div className="flex flex-row flex-wrap gap-4 justify-center">
              {groupedStaff[position].map(
                (member: { name: string; imageUrl: string }) => (
                  <div
                    key={member.name}
                    className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center justify-between w-50 h-60"
                  >
                    <div className="w-24 h-24 mb-4">
                      <img
                        src={member.imageUrl}
                        alt={`บุคลากร ${member.name}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="text-lg font-semibold">{member.name}</div>
                    {role !== null && role >= 5 && (
                      <button
                        onClick={() =>
                          handleDeleteStaff(member.name, member.imageUrl)
                        }
                        className="mt-2 text-red-500 hover:text-red-700"
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffList;
