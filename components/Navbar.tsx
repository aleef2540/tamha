"use client"; // ต้องใช้ Client Component เพราะมีการตรวจจับการ Scroll

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
// Import Icons จาก Lucide
import { Home, Map, PlusCircle, User, Bell  } from "lucide-react";


export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  //ตรวจจับการเคลื่อนไหวหน้าจอ
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // ตรวจสอบขนาดหน้าจอ (Window Width)
    const isMobile = window.innerWidth < 768;

    // เฉพาะในมือถือเท่านั้นที่จะมีการซ่อน/โชว์ตามทิศทาง
    if (isMobile) {
      if (latest > previous && latest > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    } else {
      // ใน Desktop ให้แสดงผลตลอดเวลา (ไม่ซ่อน)
      setHidden(false);
    }
  });

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 z-50"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-orange-500 tracking-tighter">
            HelpFinder
          </Link>
          
          <div className="hidden md:flex gap-8 items-center text-zinc-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">หน้าหลัก</Link>
            <button className="hover:text-white transition-colors">แผนที่</button>
            <button className="hover:text-white transition-colors">แจ้งหาย</button>
            <button className="hover:text-white transition-colors">โปรไฟล์</button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
          </div>
        </div>
      </motion.nav>

      {/* --- BOTTOM NAVBAR (เฉพาะ Mobile) --- */}
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "100%" }, // เลื่อนลงล่างเพื่อซ่อน
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-lg border-t border-zinc-800 px-6 py-3 z-50"
      >
        <div className="flex justify-center gap-8 items-center text-zinc-500">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-orange-500">
          <Home size={22} />
             <span className="text-[10px] font-medium font-sans uppercase">หน้าหลัก</span>
          </Link>
          <button className="flex flex-col items-center gap-1 hover:text-white">
          <Map size={22} />
             <span className="text-[10px] font-medium font-sans uppercase">แผนที่</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white text-orange-500 bg-orange-500/10 px-4 py-1 rounded-full">
          <PlusCircle size={28} strokeWidth={2.5} />
             <span className="text-[10px] font-bold font-sans uppercase">Post</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white">
          <Bell  size={22} />
             <span className="text-[10px] font-medium font-sans uppercase">การแจ้งเตือน</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white">
          <User size={22} />
             <span className="text-[10px] font-medium font-sans uppercase">โปรไฟล์</span>
          </button>
        </div>
      </motion.nav>
    </>
  );
}