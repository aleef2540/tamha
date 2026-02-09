"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, Phone, Mail, MapPin, Camera, 
  Save, ArrowLeft, Loader2, LogOut, CheckCircle2 
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: "",
    location: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        avatar_url: data.avatar_url || "",
        location: data.location || "",
      });
    }
    setLoading(false);
  };

  // --- Logic รูปภาพ: ใช้ Name เป็น Seed ตามที่คุณต้องการ ---
  const getAvatar = () => {
    const currentImg = profile.avatar_url;
    const isBroken = !currentImg || currentImg.includes("picture/0") || currentImg.includes("default-user");

    if (!isBroken) return currentImg;
    
    // เปลี่ยนจาก email เป็น full_name สำหรับสร้างรูปสำรอง
    const seed = profile.full_name || profile.email || 'guest';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
  };

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatar')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      setMessage({ type: "success", text: "เปลี่ยนรูปโปรไฟล์เรียบร้อย!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    } catch (error: any) {
      setMessage({ type: "error", text: "อัปโหลดรูปไม่สำเร็จ: " + error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (!error) {
        setMessage({ type: "success", text: "อัปเดตข้อมูลสำเร็จแล้ว!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: error.message });
      }
    }
    setUpdating(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleUploadAvatar} 
      />

      <div className="max-w-4xl mx-auto p-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">Profile Setting</h1>
        <button onClick={handleSignOut} className="text-zinc-500 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-orange-500/20 relative flex items-center justify-center bg-zinc-900">
              {uploading && (
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                  <Loader2 className="animate-spin text-orange-500" />
                </div>
              )}
              <img 
                  src={getAvatar()} 
                  alt="profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    const seed = profile.full_name || 'guest';
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`; 
                  }}
                />
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-orange-500 p-2.5 rounded-2xl border-4 border-black group-hover:scale-110 transition-transform cursor-pointer"
            >
              <Camera size={18} className="text-white" />
            </button>
          </div>
          <h2 className="mt-4 text-2xl font-black">{profile.full_name}</h2>
          <p className="text-zinc-500 text-sm font-medium">{profile.email}</p>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
          >
            {message.type === 'success' && <CheckCircle2 size={18} />}
            <span className="text-sm font-bold">{message.text}</span>
          </motion.div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500" size={18} />
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500" size={18} />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className={`w-full bg-zinc-900/50 border rounded-2xl py-4 pl-14 pr-4 outline-none transition-all ${!profile.phone ? 'border-orange-500/40' : 'border-zinc-800 focus:border-orange-500/50'}`}
                  placeholder="ยังไม่ได้ระบุเบอร์โทร"
                />
              </div>
            </div>
          </div>

          <div className="group opacity-60">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">Email (Read Only)</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none"
              />
            </div>
          </div>

          <div className="group">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block ml-1">Location / Zone</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500" size={18} />
              <input
                type="text"
                value={profile.location}
                placeholder="เช่น กรุงเทพฯ, จตุจักร"
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-orange-600 text-white font-black h-16 rounded-[2rem] flex items-center justify-center gap-2 hover:bg-orange-500 transition-all active:scale-[0.98] shadow-2xl shadow-orange-900/20"
          >
            {updating ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {updating ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </form>
      </div>
    </div>
  );
}