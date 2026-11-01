import React, { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import HomeSection from "./components/HomeSection";
import ServicesSection from "./components/ServicesSection";
import JoinSection from "./components/JoinSection";
import GallerySection from "./components/GallerySection";
import ReviewsSection from "./components/ReviewsSection";
import Footer from "./components/Footer";
import LocalPage, { AdditionalSections } from "./components/LocalPage";
import AdminPage from "./components/AdminPage";
import { loadCms } from "./lib/cms";
import { supabase, isSuperAdminEmail } from "./lib/supabase";

const h = React.createElement;
const AUTH_TARGET_KEY = "smsr_auth_target";
const getAuthTarget = () => new URLSearchParams(window.location.search).get("auth_target") || localStorage.getItem(AUTH_TARGET_KEY);
const routes = ["home", "about", "services", "notifications", "reviews", "gallery", "membership", "account", "dashboard", "donate", "contact", "terms", "privacy", "refund", "admin"];
const getRoute = () => {
  const hash = window.location.hash;
  const search = window.location.search;
  const route = hash.replace(/^#\/?/, "");

  // Handle OAuth callback: redirect to stored target (implicit or PKCE)
  if (route.startsWith("access_token=") || route.startsWith("error_description=") || route.startsWith("error=") || search.includes("code=") || search.includes("error=")) {
    return getAuthTarget() || "membership";
  }
  if (route.startsWith("service/") && route.length > "service/".length) return route;
  return routes.includes(route) ? route : "home";
};

export default function App() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(getRoute);
  const [session, setSession] = useState(null);
  const [cms, setCms] = useState({});
  const homeSections = cms.pageSections?.filter(section => section.page_slug === "home");
  const pageContent = slug => cms.pages?.find(pageItem => pageItem.slug === slug);
  const [activeSection, setActiveSection] = useState(() => "#/" + getRoute());
  const isClickScrolling = useRef(false);
  const clickTimeout = useRef(null);

  const handleSelectSection = (href) => {
    setActiveSection(href);
    if (href.startsWith("#/")) {
      setPage(href.slice(2) || "home");
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    loadCms().then(setCms);
  }, []);

  useEffect(() => {
    // 1. Detect OAuth errors from Google/Supabase in hash or search
    const hash = window.location.hash;
    const search = window.location.search;
    let authError = "";
    if (hash.includes("error_description=")) {
      const match = hash.match(/error_description=([^&]+)/);
      if (match) authError = decodeURIComponent(match[1].replace(/\+/g, " "));
    } else if (search.includes("error_description=")) {
      const params = new URLSearchParams(search);
      authError = params.get("error_description") || "";
    } else if (hash.includes("error=") || search.includes("error=")) {
      authError = "Google authentication failed. Please verify Supabase Google Provider configuration.";
    }

    if (authError) {
      sessionStorage.setItem("smsr_auth_error", authError);
      const target = getAuthTarget() || "membership";
      localStorage.removeItem(AUTH_TARGET_KEY);
      window.history.replaceState(null, "", window.location.pathname + "#/" + target);
      setPage(target);
      setActiveSection("#/" + target);
      return;
    }

    // 2. Manage Supabase session & handle OAuth redirects
    if (!supabase) return;

    const finishAuthRedirect = target => {
      localStorage.removeItem(AUTH_TARGET_KEY);
      const nextHash = "#/" + target;
      if (window.location.hash !== nextHash || window.location.search) {
        window.history.replaceState(null, "", window.location.pathname + nextHash);
      }
      setPage(target);
      setActiveSection(nextHash);
      window.scrollTo(0, 0);
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session) return;
      setSession(data.session);
      const email = data.session.user?.email?.toLowerCase();
      const defaultTarget = isSuperAdminEmail(email) ? "admin" : "dashboard";
      const target = getAuthTarget();
      if (target) {
        finishAuthRedirect(target);
      } else if (window.location.hash.includes("access_token=") || window.location.search.includes("code=")) {
        finishAuthRedirect(defaultTarget);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_IN" && newSession) {
        const email = newSession.user?.email?.toLowerCase();
        const defaultTarget = isSuperAdminEmail(email) ? "admin" : "dashboard";
        finishAuthRedirect(getAuthTarget() || defaultTarget);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // For super admin, route #/dashboard directly to #/admin so the editable sections are always accessible
    if (page === "dashboard" && isSuperAdminEmail(session?.user?.email)) {
      setPage("admin");
      setActiveSection("#/admin");
      window.history.replaceState(null, "", window.location.pathname + "#/admin");
    }
  }, [page, session]);

  useEffect(() => {
    const onHash = () => {
      const nextPage = getRoute();
      setPage(nextPage);
      setActiveSection("#/" + nextPage);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main > section, footer"));
    if (!("IntersectionObserver" in window)) {
      sections.forEach(section => section.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }), { threshold: .15, rootMargin: "0px 0px -8%" });
      sections.forEach(section => {
        section.classList.add("scroll-reveal");
        observer.observe(section);
      });
    }

    const sectionIds = ["home", "services", "join", "gallery", "reviews", "contact"];
    const updateActive = () => {
      if (getRoute() !== "home") return;
      if (isClickScrolling.current) return;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
        setActiveSection("#/contact");
        return;
      }
      const scrollPos = window.scrollY + 130;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop - 60) {
          setActiveSection("#/" + id);
          return;
        }
      }
      setActiveSection("#/home");
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [page]);

  return h(React.Fragment, null,
    h(Header, {
      open,
      setOpen,
      activeSection,
      onSelectSection: handleSelectSection,
      session
    }),
    page === "admin" ? h("main", null, h(AdminPage)) : page === "home" ? h("main", null,
      h(HomeSection, { content: pageContent("home"), sections: homeSections, session }),
      h(ServicesSection, { items: cms.services, section: homeSections?.find(section => section.section_key === "services-intro") }),
      h(JoinSection, { sections: homeSections || undefined, session }),
      h(GallerySection, { items: cms.gallery, section: homeSections?.find(section => section.section_key === "gallery-intro") }),
      h(ReviewsSection, { items: cms.reviews, section: homeSections?.find(section => section.section_key === "reviews-intro") }),
      h(AdditionalSections, { sections: homeSections, excluded: ["hero-primary", "hero-secondary", "services-intro", "join-intro", "join-student", "join-faculty", "gallery-intro", "reviews-intro"] })
    ) : h("main", null, h(LocalPage, { page, cms, session })),
    h(Footer, { settings: cms.settings, session })
  );
}