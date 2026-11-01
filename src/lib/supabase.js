import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;

export const ADMIN_EMAILS = [
  "mdsharifmolla354@gmail.com",
  "87subratajana87@gmail.com"
];

export const isSuperAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(String(email).trim().toLowerCase());
};
