"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Home, Map, PlusCircle, User, Bell, LogIn } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchProfile(user.id);
    };
    checkUser();

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();
      if (data?.avatar_url) setProfileImg(data.avatar_url);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfileImg(null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      if (latest > previous && latest > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    } else {
      setHidden(false);
    }
  });

  // --- ฟังก์ชันจัดการ URL รูปภาพให้ชัวร์ 100% ---
  const getAvatar = () => {
    return (
      profileImg || 
      user?.user_metadata?.avatar_url || 
      user?.user_metadata?.picture || 
      `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'guest'}`
    );
  };

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <motion.nav
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 z-50"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-orange-500 tracking-tighter">
            TamHa
          </Link>

          <div className="hidden md:flex gap-8 items-center text-zinc-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">หน้าหลัก</Link>
            <button className="hover:text-white transition-colors">แผนที่</button>
            <button className="hover:text-white transition-colors">แจ้งหาย</button>

            {user ? (
              <Link href="/profile" className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center">
                <img 
                  src={getAvatar()} 
                  alt="profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`; }}
                />
              </Link>
            ) : (
              <Link href="/login" className="text-orange-500 font-bold hover:text-orange-400 transition-colors">เข้าสู่ระบบ</Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
             {/* แก้ไขส่วน Mobile Top Avatar */}
             {user && (
                <Link href="/profile" className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                    <img 
                      src={getAvatar()} 
                      alt="profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`; }}
                    />
                </Link>
              )}
          </div>
        </div>
      </motion.nav>

      {/* --- BOTTOM NAVBAR (Mobile) --- */}
      <motion.nav
        variants={{ visible: { y: 0 }, hidden: { y: "100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-lg border-t border-zinc-800 px-6 py-3 z-50"
      >
        <div className="flex justify-between gap-2 items-center text-zinc-500">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-orange-500 min-w-[60px]">
            <Home size={22} />
            <span className="text-[10px] font-medium uppercase">หน้าหลัก</span>
          </Link>
          <button className="flex flex-col items-center gap-1 hover:text-white min-w-[60px]">
            <Map size={22} />
            <span className="text-[10px] font-medium uppercase">แผนที่</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white text-orange-500 bg-orange-500/10 px-4 py-1 rounded-full">
            <PlusCircle size={28} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase">Post</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-white min-w-[60px]">
            <Bell size={22} />
            <span className="text-[10px] font-medium uppercase">แจ้งเตือน</span>
          </button>

          {user ? (
            <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-white min-w-[60px]">
              <User size={22} />
              <span className="text-[10px] font-medium uppercase">โปรไฟล์</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 text-orange-500 min-w-[60px]">
              <LogIn size={22} />
              <span className="text-[10px] font-medium uppercase">Login</span>
            </Link>
          )}
        </div>
      </motion.nav>
    </>
  );
}