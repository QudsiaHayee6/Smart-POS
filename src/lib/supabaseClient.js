import { createClient } from '@supabase/supabase-js'

/*const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);*/

const supabaseUrl = "https://qvefaonywsoqefzhsoij.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2ZWZhb255d3NvcWVmemhzb2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODQ0MTYsImV4cCI6MjA2OTM2MDQxNn0.zFv6Nq9zn4UTNnc8Gs0Uwvfomqfu23_VHffUM2ykeNY"


export const supabase = createClient(supabaseUrl, supabaseKey)
