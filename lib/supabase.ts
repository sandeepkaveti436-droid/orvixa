import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qrrhqbtnxhumoopeqeud.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_B_YJLN9j4y6ZSOtgLknwpw_konwOQ7p";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
