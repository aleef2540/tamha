import Image from "next/image";
import TypewriterEffect from "@/components/TypewriterEffect";
import Link from "next/link";


export default function Home() {
  const typewriterText = "คน สัตว์ ของ";
  const typewriterText1 = "FIND WHAT YOU LOST.";

  return (
    <div className="flex min-h-screen justify-center bg-black font-sans selection:bg-orange-500/30 overflow-hidden">
      <main className="flex w-full max-w-4xl flex-col items-center justify-start gap-12 px-8 pt-20 pb-20 text-center sm:justify-center sm:pt-0">
        
        {/* Logo */}
        <div className="relative">
          <Image
            className="invert w-[150px] md:w-[280px] h-auto transition-all duration-500 hover:scale-105"
            src="/test.svg"
            alt="App Logo"
            width={280}
            height={60}
            priority
          />
        </div>

        {/* Headline Section */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">
            ตามหา{" "}
            <span className="text-orange-500 inline-flex justify-start text-left min-w-[210px] md:min-w-[410px]">
              {/* ตัวที่ 1: เริ่มทันที */}
              <TypewriterEffect text={typewriterText} delay={150} />
            </span>
            <br className="hidden md:block" />
            ง่ายๆ แค่ปักหมุด
            
            {/* ระยะห่างเล็กน้อยก่อนขึ้น Slogan ภาษาอังกฤษ */}
            <div className="mt-4 md:mt-8">
              <span className="text-orange-500/80 inline-flex justify-center text-left min-w-[160px] md:min-w-[340px] text-2xl md:text-4xl italic uppercase tracking-widest font-light">
                {/* ตัวที่ 2: เริ่มหลังจากตัวแรกพิมพ์จบ (ประมาณ 2.5 วินาที) */}
                <TypewriterEffect text={typewriterText1} delay={100} startDelay={2500} />
              </span>
            </div>
          </h1>

          <p className="max-w-md text-lg leading-8 text-zinc-400 md:text-xl md:max-w-xl">
            แพลตฟอร์มศูนย์กลางการช่วยเหลือรอบตัวคุณ หาสิ่งที่คุณตามหา ไม่ว่าจะเป็น คน สัตว์เลี้ยง หรือ สิ่งของ
            ใช้งานง่าย แม่นยำ และปลอดภัย พร้อมรับรางวัลไปเลย
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center sm:w-auto">
          <Link
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-10 text-lg font-bold text-white transition-all hover:bg-orange-600 active:scale-95 sm:w-auto"
            href="/dashboard"
          >
            เข้าสู่เว็บไซต์
          </Link>
          <Link
            className="flex h-14 w-full items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 px-10 text-lg font-bold text-white transition-all hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 sm:w-auto"
            href="/login"
          >
            เข้าสู่ระบบ
          </Link>
        </div>

        {/* Copyright Footer */}
        <div className="absolute bottom-8 text-zinc-600 text-sm hidden sm:block">
          © 2026 HelpFinder Community. ยินดีที่ได้เป็นส่วนหนึ่งในการช่วยเหลือ
        </div>
      </main>
    </div>
  );
}