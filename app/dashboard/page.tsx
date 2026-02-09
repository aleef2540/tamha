"use client";

import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ข้อมูลสำรอง (Fallback Mock Data)
    const fallbackLost = [
        { id: "m1", title: "น้องแมวส้ม ชื่อส้มจี๊ดหลงทาง", findtype: "ตามหาของหาย", location: "ห่างจากคุณ 200 เมตร", reward: 5000, type: "สัตว์เลี้ยง" },
        { id: "m2", title: "กระเป๋าสตางค์สีดำ แบรนด์หนัง", findtype: "ตามหาของหาย", location: "สยามพารากอน", reward: 1000, type: "ของใช้" },
    ];

    const fallbackFound = [
        { id: "f1", title: "พบกุญแจรถยนต์ Toyota", findtype: "ตามหาเจ้าของ", location: "ลานจอดรถเซ็นทรัล", reward: 0, type: "ของใช้" },
        { id: "f2", title: "เจอพาสปอร์ต ชื่อคุณวิชัย", findtype: "ตามหาเจ้าของ", location: "สนามบินสุวรรณภูมิ", reward: 0, type: "เอกสาร" },
    ];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from("items")
                .select("*")
                .order("created_at", { ascending: false });

            if (data && data.length > 0) {
                setItems(data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const dbLost = items.filter(item => item.type === 'lost');
    const dbFound = items.filter(item => item.type === 'found');

    const displayLost = dbLost.length > 0 ? dbLost : fallbackLost;
    const displayFound = dbFound.length > 0 ? dbFound : fallbackFound;

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="text-orange-500 animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24 pt-14 md:pt-14">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-6 ">
                {/* Header ส่วนค้นหา */}
                <div className="flex flex-col gap-4 mb-8">
                    <h1 className="text-2xl font-bold">ประกาศรอบตัวคุณ</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="ค้นหาของหาย..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {["ทั้งหมด", "ตามหาของหาย", "ตามหาเจ้าของ", "สัตว์เลี้ยง", "เอกสาร", "คนหาย"].map((cat) => (
                            <button 
                                key={cat} 
                                className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm hover:bg-orange-500 hover:border-orange-500 transition-all active:scale-95"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section 1: ตามหาของหาย (สีแดงจะถูกคุมจาก PostCard) */}
                <section className="mb-10">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            ตามหาของหาย
                        </h2>
                        <button className="text-orange-500 text-sm font-bold hover:opacity-80">ดูทั้งหมด</button>
                    </div>

                    <div className="max-h-[310px] overflow-y-auto pr-2 no-scrollbar md:max-h-[310px] md:overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                            {displayLost.map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    // ส่งค่าให้ตรงกับเงื่อนไขสีใน PostCard
                                    findtype={post.type === 'lost' || post.findtype === 'ตามหาของหาย' ? "ตามหาของหาย" : post.findtype}
                                    location={post.location_name || post.location}
                                    reward={post.reward || 0}
                                    type={post.category || post.type}
                                    image={post.image_url || null}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <hr className="border-zinc-800 mb-8" />

                {/* Section 2: ตามหาเจ้าของ (สีฟ้าจะถูกคุมจาก PostCard) */}
                <section className="mb-10">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            ตามหาเจ้าของ
                        </h2>
                        <button className="text-orange-500 text-sm font-bold hover:opacity-80">ดูทั้งหมด</button>
                    </div>

                    <div className="max-h-[310px] overflow-y-auto pr-2 no-scrollbar md:max-h-[310px] md:overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                            {displayFound.map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    // ส่งค่าให้ตรงกับเงื่อนไขสีใน PostCard
                                    findtype={post.type === 'found' || post.findtype === 'ตามหาเจ้าของ' ? "ตามหาเจ้าของ" : post.findtype}
                                    location={post.location_name || post.location}
                                    reward={post.reward || 0}
                                    type={post.category || post.type}
                                    image={post.image_url || null}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}