"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, ArrowRight, Cat, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const getURL = () => {
        let url =
          process?.env?.NEXT_PUBLIC_SITE_URL ?? // ตั้งค่านี้ใน Vercel Env
          process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel มีให้กุอยู่แล้ว
          'http://localhost:3000/'
        
        // ตรวจสอบว่ามี http หรือยัง
        url = url.includes('http') ? url : `https://${url}`
        return url
      }


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // ถ้าผ่าน ให้ไปหน้า Dashboard
            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setErrorMsg(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${getURL()}/dashboard`,
                // ⚠️ มั่นใจว่าไม่ได้ใส่ flowType: 'implicit' ลงไป
                // ถ้าไม่มีการกำหนด มันจะเป็น PKCE (ส่ง ?code=) โดยอัตโนมัติ
            },
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-0 md:p-6 font-sans">
            {/* Background Decor - แสงฟุ้งๆ ด้านหลัง */}

            {/* --- Back Button --- */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => router.back()} // หรือ router.push('/')
                className="absolute top-6 left-6 z-[100] p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all backdrop-blur-md active:scale-90"
            >
                <ChevronLeft size={24} />
            </motion.button>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-900/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-[1000px] min-h-screen md:min-h-[650px] grid lg:grid-cols-2 bg-zinc-900/40 md:border md:border-zinc-800/50 md:rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl"
            >
                {/* --- Left Panel: Branding (Hidden on Mobile) --- */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-orange-600 to-orange-700 relative overflow-hidden">
                    <Link href="/" className="">
                        <div className="relative z-10 flex items-center gap-3">
                            <div className="bg-white/20 p-1 rounded-2xl backdrop-blur-xl border border-white/20">
                                <Image
                                    src="/logo.svg"       // เปลี่ยนเป็นชื่อไฟล์โลโก้ของคุณในโฟลเดอร์ public
                                    alt="FoundIt Logo"
                                    width={45}            // ปรับขนาดความกว้างตามใจชอบ
                                    height={45}           // ปรับขนาดความสูงตามใจชอบ
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-3xl font-black tracking-tighter uppercase italic">TamHa</span>
                        </div>
                    </Link>
                    <div className="relative z-10">
                        <h2 className="text-6xl font-black leading-[0.9] tracking-tighter mb-8">
                            FIND WHAT<br />YOU LOST.
                        </h2>
                        <p className="text-orange-100 text-lg font-medium max-w-[320px] opacity-90 leading-relaxed">
                            แพลตฟอร์มตามหาของหายและสัตว์เลี้ยงที่ฉลาดและไวที่สุดในไทย
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                        <div className="h-1.5 w-12 bg-white rounded-full" />
                        <div className="h-1.5 w-2 bg-white/30 rounded-full" />
                        <div className="h-1.5 w-2 bg-white/30 rounded-full" />
                    </div>

                    {/* Abstract Shapes Decoration */}
                    <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                </div>

                {/* --- Right Panel: Form Zone --- */}
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-black/20 md:bg-transparent">
                    {/* Mobile Logo */}
                    <Link href="/" className="">
                    <div className="lg:hidden flex items-center gap-2 mb-12">
                        <div className="bg-orange-500 p-2 rounded-xl">
                            <Image
                                src="/logo.svg"       // เปลี่ยนเป็นชื่อไฟล์โลโก้ของคุณในโฟลเดอร์ public
                                alt="FoundIt Logo"
                                width={36}            // ปรับขนาดความกว้างตามใจชอบ
                                height={36}           // ปรับขนาดความสูงตามใจชอบ
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-black italic">Tamha</span>
                    </div>
                    </Link>

                    <div className="mb-10">
                        <h3 className="text-4xl font-black mb-3 tracking-tight">เข้าสู่ระบบ</h3>
                        <p className="text-zinc-500 font-medium">จัดการประกาศตามหาของคุณให้ทันท่วงที</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-bold flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-400 rounded-full" />
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="group">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl py-4.5 pl-14 pr-4 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-white placeholder:text-zinc-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Password</label>
                                <Link href="#" className="text-[10px] font-black uppercase text-orange-500 hover:text-orange-400 transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-800/30 border border-zinc-800 rounded-2xl py-4.5 pl-14 pr-4 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-white placeholder:text-zinc-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-black h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all active:scale-[0.97] mt-8 shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-zinc-500 text-sm font-medium">
                        New here?{" "}
                        <Link href="/register" className="text-orange-500 font-black hover:underline underline-offset-4 decoration-2">Create Account</Link>
                    </p>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 bg-transparent px-4">
                            <span className="bg-black px-4 md:bg-[#0c0c0e]">Or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 hover:border-zinc-700 transition-all active:scale-[0.97]"
                    >
                        <Chrome size={20} />
                        Login with Google
                    </button>


                </div>
            </motion.div>
        </div>
    );
}