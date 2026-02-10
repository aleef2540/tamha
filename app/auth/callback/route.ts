import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // ดึงค่าหน้าถัดไปที่ตั้งใจจะไป (ถ้าไม่มีให้ไป dashboard)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // 1. แลก Code เป็น Session
    const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!authError && session) {
      // 2. เช็คข้อมูลในตาราง profiles ว่ากรอกข้อมูลครบหรือยัง (เช่น มีเบอร์โทรหรือยัง)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', session.user.id)
        .single()

      // 3. Logic การส่งตัว (Redirect)
      // ถ้าไม่มีชื่อ หรือ ไม่มีเบอร์โทร ให้บังคับไปหน้า complete-profile พร้อมส่งค่า next ไปด้วย
      if (!profile?.full_name || !profile?.phone) {
        return NextResponse.redirect(`${origin}/complete-profile?next=${next}`)
      }

      // ถ้าโปรไฟล์โอเคแล้ว ก็ส่งไปหน้า next ที่ตั้งใจไว้ได้เลย!
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Auth-Failed`)
}