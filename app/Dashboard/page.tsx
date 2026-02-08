import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";

export default function Dashboard() {
  const mockData = [
    { id: 1, title: "น้องแมวส้ม ชื่อส้มจี๊ดหลงทาง", findtype: "ตามหาของหาย", location: "ห่างจากคุณ 200 เมตร", reward: 5000, type: "สัตว์เลี้ยง" },
    { id: 2, title: "กระเป๋าสตางค์สีดำ แบรนด์หนัง", findtype: "ตามหาเจ้าของ", location: "สยามพารากอน", reward: 1000, type: "ของใช้" },
    { id: 3, title: "พวงกุญแจรถยนต์ Toyota", findtype: "ตามหาเจ้าของ", location: "ลานจอดรถเซ็นทรัล", reward: 500, type: "ของใช้" },
    { id: 4, title: "พาสปอร์ต ชื่อคุณวิชัย", findtype: "ตามหาของหาย", location: "สนามบินสุวรรณภูมิ", reward: 2000, type: "เอกสาร" },
  ];

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
          
          {/* หมวดหมู่ด่วน (Horizontal Scroll บนมือถือ) */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["ทั้งหมด", "ตามหาของหาย", "ตามหาเจ้าของ", "สัตว์เลี้ยง", "เอกสาร", "คนหาย"].map((cat) => (
              <button key={cat} className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm hover:bg-orange-500 transition-colors">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout แบ่ง 2 ฝั่งบน Desktop */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ฝั่งซ้าย: แผนที่ (บนมือถือจะอยู่ด้านบน) */}
          <div className="w-full lg:w-[40%] h-[250px] lg:h-[500px] bg-zinc-900 rounded-3xl border border-zinc-800 sticky top-24 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-zinc-600 italic bg-[url('https://api.placeholder.com/600/400')] bg-cover">
              <span className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Interactive Map</span>
            </div>
          </div>

          {/* ฝั่งขวา: รายการ Feed */}
          <div className="w-full lg:w-[60%] flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-zinc-400 text-sm font-medium">ใกล้คุณที่สุด</h2>
              <button className="text-orange-500 text-sm">ดูทั้งหมด</button>
            </div>
            
            {/* Grid ปรับตามจอ: มือถือแถวเดียว, คอม 2 คอลัมน์ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {mockData.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ปุ่มสร้างโพสต์แบบลอย (Mobile FAB) <button className="fixed bottom-20 right-6 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 text-white text-3xl font-light md:bottom-10 md:right-10 hover:scale-110 transition-transform active:scale-95 z-40">
        +
      </button>*/}
      
    </div>
  );
}