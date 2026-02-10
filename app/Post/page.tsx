"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Camera, MapPin, Tag, 
  Info, DollarSign, Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function CreatePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "ทั่วไป",
    type: "lost", // lost หรือ found
    location_name: "",
    reward: 0,
  });

  // --- ส่วนที่เพิ่ม: ตรวจสอบสถานะการ Login ---
  // แก้ไขส่วน useEffect ในหน้า CreatePostPage
useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // ส่ง ?next=/post ไปด้วย
        router.replace("/login?next=/Post"); 
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("กรุณาเข้าสู่ระบบก่อนโพสต์");

      let finalImageUrl = "";

      // 1. อัปโหลดรูปภาพ (ถ้ามี)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('item-images') // อย่าลืมสร้าง Bucket ชื่อ items_images ใน Supabase
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrl;
      }

      // 2. บันทึกข้อมูลลงตาราง items
      const { error } = await supabase.from("items").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        location_name: formData.location_name,
        reward: formData.reward,
        image_url: finalImageUrl,
        status: "searching"
      });

      if (error) throw error;

      alert("ประกาศสำเร็จ!");
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ระหว่างที่เช็ค Auth ให้โชว์ Loading ตัวใหญ่ๆ กลางหน้า
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">Create Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
        
        {/* ประเภทของโพสต์ */}
        <div className="flex p-1 bg-zinc-900 rounded-2xl">
          <button
            type="button"
            onClick={() => setFormData({...formData, type: "lost"})}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === "lost" ? "bg-orange-500 text-white" : "text-zinc-500"}`}
          >
            ฉันทำของหาย
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, type: "found"})}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === "found" ? "bg-cyan-600 text-white" : "text-zinc-500"}`}
          >
            ฉันเจอของ
          </button>
        </div>

        {/* อัปโหลดรูปภาพ */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video w-full bg-zinc-900 rounded-[2rem] border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group"
        >
          {imagePreview ? (
            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <>
              <Camera size={40} className="text-zinc-700 group-hover:text-orange-500 transition-colors" />
              <p className="mt-2 text-sm text-zinc-500 font-bold">เพิ่มรูปภาพสิ่งของ</p>
            </>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="space-y-6">
          {/* ชื่อของ */}
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">สิ่งของคืออะไร?</label>
            <div className="relative">
              <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500" size={18} />
              <input
                required
                type="text"
                placeholder="เช่น กระเป๋าสตางค์, น้องแมวสีส้ม"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
          </div>

          {/* สถานที่ */}
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">สถานที่ (โดยประมาณ)</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500" size={18} />
              <input
                required
                type="text"
                placeholder="เช่น สยามพารากอน ชั้น 2"
                value={formData.location_name}
                onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
          </div>

          {/* รายละเอียด */}
          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">รายละเอียดเพิ่มเติม</label>
            <textarea
              rows={3}
              placeholder="ตำหนิ หรือ ข้อมูลที่ช่วยให้จำได้..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-5 outline-none focus:border-orange-500/50 transition-all"
            />
          </div>

          {/* เงินรางวัล (แสดงเฉพาะตอนเลือก 'lost') */}
          {formData.type === "lost" && (
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">เงินรางวัลนำส่ง (บาท)</label>
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                <input
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: parseInt(e.target.value)})}
                  className="w-full bg-green-500/5 border border-green-500/20 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-green-500/50 text-green-400 font-bold"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-16 rounded-[2rem] font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xl ${formData.type === 'lost' ? 'bg-orange-600 shadow-orange-900/20' : 'bg-cyan-600 shadow-green-900/20'}`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
          {loading ? "กำลังบันทึก..." : "ยืนยันการประกาศ"}
        </button>

      </form>
    </div>
  );
}