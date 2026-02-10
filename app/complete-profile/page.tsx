"use client";

import { useState, useEffect, Suspense } from "react"; // เพิ่ม Suspense
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Loader2, User, LogOut } from "lucide-react";

// 1. แยกเนื้อหา Form ออกมาเป็น Component ย่อย
function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ ดึงค่า 'next' จาก URL ถ้าไม่มีให้ไปหน้า dashboard
  const nextRoute = searchParams.get("next") || "/dashboard";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [userData, setUserData] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", user.id)
        .single();

      // ✅ ถ้ามีเบอร์โทรอยู่แล้ว ให้ส่งไปที่ nextRoute เลย
      if (profile?.phone) {
        router.push(nextRoute);
      } else {
        setUserData({
          name: profile?.full_name || user.user_metadata.full_name || "คุณ",
          email: profile?.email || user.email,
        });
        setLoading(false);
      }
    };

    checkUser();
  }, [router, nextRoute]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          phone: phone,
          updated_at: new Date().toISOString() 
        })
        .eq("id", user.id);

      if (!error) {
        router.push(nextRoute);
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาด: " + error.message);
        setSubmitting(false);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-orange-500/10 rounded-2xl mb-4">
            <User className="text-orange-500" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            ยินดีต้อนรับคุณ, <br/> 
            <span className="text-orange-500">{userData.name}</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">อีกขั้นตอนเดียวเพื่อเริ่มใช้งานระบบตามหาของ</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block ml-1">
              เบอร์โทรศัพท์ติดต่อ (Phone Number)
            </label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08X-XXX-XXXX"
                className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl py-4.5 pl-14 pr-4 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-white placeholder:text-zinc-700"
                required
              />
            </div>
            <p className="text-[10px] text-zinc-600 mt-2 ml-1">* เบอร์นี้จะใช้สำหรับให้ผู้ที่พบของติดต่อหาคุณ</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !phone}
            className="w-full bg-white text-black font-black h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all active:scale-[0.97] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : "บันทึกข้อมูลและไปต่อ"}
            {!submitting && <ArrowRight size={20} />}
          </button>
        </form>

        <button 
          onClick={handleSignOut}
          className="w-full mt-6 flex items-center justify-center gap-2 text-zinc-600 hover:text-red-400 text-xs font-bold transition-colors"
        >
          <LogOut size={14} />
          ออกจากระบบ
        </button>
      </motion.div>
    </div>
  );
}

// 2. Component หลักที่ Export ออกไป (หุ้มด้วย Suspense เพื่อแก้ Error)
export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
      </div>
    }>
      <CompleteProfileForm />
    </Suspense>
  );
}