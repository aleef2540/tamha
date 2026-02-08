export default function PostCard({ title, location, reward, type }: any) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 hover:border-orange-500/50 transition-colors cursor-pointer group">
        {/* รูปภาพ (Placeholder) */}
        <div className="w-24 h-24 bg-zinc-800 rounded-xl flex-shrink-0 flex items-center justify-center text-zinc-600">
          Img
        </div>
        
        {/* รายละเอียด */}
        <div className="flex flex-col justify-between py-1 flex-1">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                {type}
              </span>
            </div>
            <h3 className="text-white font-medium mt-1 group-hover:text-orange-500 transition-colors">{title}</h3>
            <p className="text-zinc-500 text-xs mt-1">📍 {location}</p>
          </div>
          <div className="text-orange-500 font-bold text-lg">
            ฿ {reward.toLocaleString()}
          </div>
        </div>
      </div>
    );
  }