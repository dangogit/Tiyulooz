import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Note: In a real app, you would use your actual Supabase URL and anon key
// For this demo, we're using placeholder values
const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseAnonKey = "your-supabase-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});