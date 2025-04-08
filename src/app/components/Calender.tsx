"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
} from "firebase/database";
import { firebaseConfig } from "../../../firebase_config";
import Swal from "sweetalert2";

initializeApp(firebaseConfig);
const database = getDatabase();

export default function CalendarComponent() {
  type Event = {
    id: string;
    title: string;
    date: string;
  };

  const [events, setEvents] = useState<Event[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("role");
      setRole(storedRole ? Number(storedRole) : null);
    }

    const eventsRef = ref(database, "events");
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.entries(data).map(([id, e]: any) => ({
          id,
          title: e.title,
          date: e.date,
        }));
        setEvents(loaded);
      } else {
        setEvents([]);
      }
    });
  }, []);

  const handleDateClick = async (info: any) => {
    if (role && role >= 5) {
      const { value: title } = await Swal.fire({
        title: "เพิ่มกิจกรรม",
        input: "text",
        inputLabel: "ชื่อกิจกรรม",
        inputPlaceholder: "กรุณากรอกชื่อกิจกรรม",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "เพิ่ม",
      });

      if (title) {
        const newRef = push(ref(database, "events"));
        await set(newRef, {
          title,
          date: info.dateStr,
        });
        Swal.fire("สำเร็จ!", "เพิ่มกิจกรรมเรียบร้อยแล้ว", "success");
      }
    } else {
      Swal.fire("ไม่มีสิทธิ์!", "คุณไม่มีสิทธิ์ในการเพิ่มกิจกรรม", "warning");
    }
  };

  const handleEventClick = async (info: any) => {
    const { isConfirmed } = await Swal.fire({
      title: `ยืนยันการลบกิจกรรม "${info.event.title}"?`,
      text: "กิจกรรมนี้จะถูกลบถาวร",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ลบ",
    });

    if (isConfirmed) {
      const eventId = info.event.id;
      await remove(ref(database, `events/${eventId}`));
      Swal.fire("ลบกิจกรรมสำเร็จ!", "", "success");
    }
  };

  if (!isClient) return null; // รอจนกว่าจะเป็นฝั่ง client ค่อย render

  return (
    <div className="max-w-3xl mx-auto py-5">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        📅 ปฏิทินกิจกรรม
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={(info) => {
          if (role && role >= 5) {
            handleDateClick(info);
          }
        }}
        eventClick={(info) => {
          if (role && role >= 5) {
            handleEventClick(info);
          }
        }}
        locale="th"
        buttonText={{
          today: "วันนี้",
          month: "เดือน",
          week: "สัปดาห์",
          day: "วัน",
        }}
        eventColor="#DFC900"
        eventBorderColor="#DFC900"
        eventBackgroundColor="#DFC900"
        dayHeaderFormat={{ weekday: "short" }}
        themeSystem="lux"
        titleFormat={{
          year: "numeric",
          month: "short",
          day: "numeric",
        }}
      />
    </div>
  );
}
