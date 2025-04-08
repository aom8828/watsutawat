import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database"; // Realtime Database

export const firebaseConfig = {
  apiKey: "AIzaSyATquLkKb2IVAuqT1N4bzRVhKpZBOv8OMc",
  authDomain: "watsutawas-906b1.firebaseapp.com",
  projectId: "watsutawas-906b1",
  storageBucket: "watsutawas-906b1.appspot.com",
  messagingSenderId: "408820942217",
  appId: "1:408820942217:web:8e7e07c169e1908669cd58",
  databaseURL:
    "https://watsutawas-906b1-default-rtdb.asia-southeast1.firebasedatabase.app/", // เพิ่ม databaseURL
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const addStaff = (id, name, position, image) => {
  const staffRef = ref(database, "staff/" + id);
  set(staffRef, {
    name: name,
    position: position,
    image: image,
  });
};

// ฟังก์ชันในการลบพนักงาน
export const deleteStaff = (id) => {
  const staffRef = ref(database, "staff/" + id);
  remove(staffRef);
};

// ฟังก์ชันในการดึงข้อมูลพนักงานทั้งหมด
export const fetchStaff = () => {
  return new Promise((resolve, reject) => {
    const staffRef = ref(database, "staff");
    onValue(staffRef, (snapshot) => {
      const data = snapshot.val();
      resolve(data);
    });
  });
};
