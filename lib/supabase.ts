import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ถ้าไม่มีค่า URL หรือ Key ให้แจ้งเตือนใน Console แทนที่จะทำเครื่องค้าง
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL or Anon Key is missing in .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)