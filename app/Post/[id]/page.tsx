"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { MapPin, Calendar, Tag, Wallet, ChevronLeft, Share2, Maximize2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// เรียกใช้ Map แบบ Dynamic เพื่อเลี่ยงปัญหา SSR
const MapDetail = dynamic(() => import("@/components/MapDetail"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-800 animate-pulse" />
});

export default function PostDetail() {
  const [showFullMap, setShowFullMap] = useState(false);

  const data = {
    title: "น้องแมวส้ม ชื่อส้มจี๊ดหลงทาง",
    findtype: "ตามหาของหาย",
    reward: 5000,
    type: "สัตว์เลี้ยง",
    location: "ห่างจากคุณ 200 เมตร",
    date: "7 ก.พ. 2026",
    description: "น้องแมวเพศเมีย มีปลอกคอสีเขียว นิสัยขี้กลัวเล็กน้อย หายไปเมื่อช่วงเย็นวันที่ 7 กุมภาพันธ์ ใครพบเห็น rรบกวนติดต่อด่วนครับ มีเงินรางวัลนำส่ง",
    fullLocation: "ห้างสรรพสินค้าสยามพารากอน ชั้น 2 โซนบันไดเลื่อน",
    lat: 13.7468,
    lng: 100.5352
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-4">
        {/* Navigation Row */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span>กลับหน้าหลัก</span>
          </Link>
          <button className="p-2 bg-zinc-900 rounded-full border border-zinc-800 hover:bg-zinc-800">
            <Share2 size={18} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- ฝั่งซ้าย: Media Zone (Fixed Image + Map Overlay) --- */}
          <div className="w-full lg:w-[45%] space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
              
              {/* 1. รูปภาพหลัก (แสดงเป็นพื้นหลังตลอดเวลา) */}
              <div 
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000')] bg-cover bg-center"
              />

              {/* 2. แผนที่ฉบับเต็ม (ลอยทับเมื่อสั่งเปิด) */}
              <AnimatePresence>
                {showFullMap && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10"
                  >
                    <MapDetail lat={data.lat} lng={data.lng} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ป้ายประเภท (อยู่บนสุดเสมอ) */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  {data.findtype}
                </span>
              </div>

              {/* --- Floating Toggle Button (ปุ่มสลับที่มุมขวา) --- */}
              <button 
                onClick={() => setShowFullMap(!showFullMap)}
                className="absolute bottom-4 right-4 w-32 h-32 md:w-32 md:h-32 rounded-2xl border-4 border-black/50 overflow-hidden shadow-2xl transition-transform hover:scale-105 active:scale-95 z-30 group bg-zinc-900"
              >
                {/* Logic: ถ้าจอใหญ่โชว์รูป ปุ่มเล็กต้องโชว์แมพ | ถ้าจอใหญ่โชว์แมพ ปุ่มเล็กต้องโชว์รูป */}
                <div className="relative w-full h-full">
                  {!showFullMap ? (
                    <div className="w-full h-full pointer-events-none">
                      <MapDetail lat={data.lat} lng={data.lng} />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <Maximize2 className="text-white drop-shadow-lg" size={24} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500')] bg-cover bg-center">
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <ImageIcon className="text-white drop-shadow-lg" size={24} />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer overflow-hidden">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200')] bg-cover bg-center opacity-40 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* --- ฝั่งขวา: Information Zone (คงเดิมทุกอย่าง) --- */}
          <div className="w-full lg:w-[55%] space-y-6">
            <div>
              <div className="flex items-center gap-2 text-orange-500 mb-2 font-bold text-sm">
                <Tag size={16} />
                <span>{data.type}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                {data.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-orange-500" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>หายเมื่อ: {data.date}</span>
                </div>
              </div>
            </div>

            {/* Reward Box */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-400 rounded-3xl p-6 shadow-xl shadow-orange-500/20">
              <div className="relative z-10 flex justify-between items-center text-white">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">เงินรางวัลนำส่ง</p>
                  <p className="text-4xl font-black">฿ {data.reward.toLocaleString()}</p>
                </div>
                <Wallet size={48} className="opacity-40" />
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                รายละเอียด
              </h3>
              <p className="text-zinc-400 leading-relaxed text-lg bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50">
                {data.description}
              </p>
            </div>

            {/* Footer Location */}
            <div className="p-4 bg-zinc-900/50 rounded-2xl border-l-4 border-orange-500">
               <p className="text-sm text-zinc-500 uppercase font-bold mb-1">สถานที่โดยละเอียด</p>
               <p className="text-zinc-300">{data.fullLocation}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 text-lg">
                ติดต่อเจ้าของ
              </button>
              <button className="flex-1 bg-zinc-900 text-white font-bold py-4 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-95 text-lg">
                ส่งข้อความ
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}