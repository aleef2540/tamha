import Link from "next/link";
import Image from "next/image";

export default function PostCard({ title, location, reward, type, findtype, id, image }: any) {
  // Logic สำหรับเช็คสีของประเภทประกาศ
  const isLost = findtype === "ตามหาของหาย";

  return (
    <Link href={`/Post/${id}`}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 hover:border-orange-500/50 transition-colors cursor-pointer group">
        
        {/* ส่วนแสดงรูปภาพ */}
        <div className="w-24 h-24 bg-zinc-800 rounded-xl flex-shrink-0 overflow-hidden relative">
          {image ? (
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
              No Img
            </div>
          )}
        </div>
        
        {/* รายละเอียด */}
        <div className="flex flex-col justify-between py-1 flex-1">
          <div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border border-zinc-700 whitespace-nowrap">
                {type}
              </span>
              
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider whitespace-nowrap ${
                isLost 
                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                  : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              }`}>
                {findtype}
              </span>
            </div>
            <h3 className="text-white font-medium mt-1 group-hover:text-orange-500 transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-zinc-500 text-[11px] mt-1 line-clamp-1">📍 {location}</p>
          </div>
          <div className="text-orange-500 font-bold text-lg leading-none">
            ฿ {reward?.toLocaleString() || 0}
          </div>
        </div>
      </div>
    </Link>
  );
}