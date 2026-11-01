import { supabase } from "./supabase";

export async function loadCms() {
  if (!supabase) return {};
  const [services, gallery, reviews, pages, notifications, pageSections, settings] = await Promise.all([
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("gallery_items").select("*").order("sort_order"),
    supabase.from("reviews").select("*").order("sort_order"),
    supabase.from("site_content").select("*"),
    supabase.from("notifications").select("*").order("published_at", { ascending: false }),
    supabase.from("page_sections").select("*").order("sort_order"),
    supabase.from("site_settings").select("*")
  ]);
  return {
    services: services.data || [],
    gallery: gallery.data || [],
    reviews: reviews.data || [],
    pages: pages.data || [],
    notifications: notifications.data || [],
    pageSections: pageSections.error ? undefined : pageSections.data || [],
    settings: settings.error ? undefined : settings.data || []
  };
}
