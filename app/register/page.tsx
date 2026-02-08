"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight, Cat, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      // เมื่อสมัครสำเร็จ (ปกติ Supabase จะส่ง Email ยืนยัน)
      alert("สมัครสมาชิกสำเร็จ! กรุณาเช็คอีเมลของคุณเพื่อยืนยันตัวตน");
      router.push("/login");
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-0 md:p-6 font-sans relative">
      
      {/* --- Back Button --- */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-[100] p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all backdrop-blur-md active:scale-90"
      >
        <ChevronLeft size={24} />
      </motion.button>

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-900/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[1100px] min-h-screen md:min-h-[750px] grid lg:grid-cols-2 bg-zinc-900/40 md:border md:border-zinc-800/50 md:rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl"
      >
        {/* --- Left Panel (Branding) --- */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-zinc-800 to-black relative overflow-hidden border-r border-zinc-800">
          <div className="relative z-10 flex items-center gap-3">
             <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
             </div>
            <span className="text-3xl font-black tracking-tighter uppercase italic text-orange-500">TamHa</span>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-6xl font-black leading-[0.9] tracking-tighter mb-8 text-white">
              JOIN THE<br /><span className="text-orange-500">COMMUNITY.</span>
            </h2>
            <p className="text-zinc-400 text-lg font-medium max-w-[350px] leading-relaxed">
              ร่วมเป็นส่วนหนึ่งของเครือข่ายจิตอาสา ช่วยพาของรักและสัตว์เลี้ยงกลับบ้านได้อย่างปลอดภัย
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <div className="h-1.5 w-2 bg-orange-500/30 rounded-full" />
            <div className="h-1.5 w-12 bg-orange-500 rounded-full" />
            <div className="h-1.5 w-2 bg-orange-500/30 rounded-full" />
          </div>
        </div>

        {/* --- Right Panel (Form) --- */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 mt-12">
            <div className="bg-orange-500 p-2 rounded-xl">
               <Image src="/logo.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="text-xl font-black italic">FoundIt</span>
          </div>

          <div className="mb-8">
            <h3 className="text-4xl font-black mb-3 tracking-tight text-white">สร้างบัญชีใหม่</h3>
            <p className="text-zinc-500 font-medium text-sm">เริ่มต้นช่วยตามหาของหายตั้งแต่วันนี้</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="group md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ชื่อ-นามสกุล ของคุณ"
                  className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-white placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="group md:col-span-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-white placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="group md:col-span-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="tel" 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-white placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                  className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-white placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full bg-orange-500 text-white font-black h-16 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-[0.97] shadow-xl shadow-orange-500/20 disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-black hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}