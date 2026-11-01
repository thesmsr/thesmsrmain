import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const h = React.createElement;

export default function Header({ open, setOpen, activeSection, onSelectSection, session }) {
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    if (!supabase) return;
    const load = async () => {
      const { data } = await supabase.from("menu_items").select("*").eq("active", true).order("sort_order");
      if (data && data.length) setMenuItems(data);
    };
    load();
  }, []);

  const isAdmin = session?.user?.email?.toLowerCase() === "mdsharifmolla354@gmail.com";

  const defaultNavItems = [
    { href: "#/home", label: "Home" },
    { href: "#/about", label: "About" },
    { href: "#/services", label: "Services" },
    { href: "#/notifications", label: "Notifications" },
    { href: "#/reviews", label: "Reviews" },
    { href: "#/gallery", label: "Gallery" },
    { href: "#/donate", label: "Donate" },
    { href: "#/contact", label: "Contact" }
  ];

  let navItems = menuItems.length ? menuItems.map(item => ({ href: item.href, label: item.label })) : [...defaultNavItems];
  if (session?.user) {
    navItems = navItems.filter(item => !(item.label.toLowerCase() === "login" || item.href === "#/membership"));
    if (isAdmin) {
      // For Super Admin: replace or direct any Dashboard link to Admin Dashboard
      navItems = navItems.map(item => (item.href === "#/dashboard" || item.label.toLowerCase() === "dashboard") ? { href: "#/admin", label: "Admin" } : item);
      if (!navItems.find(i => i.href === "#/admin" || i.label.toLowerCase() === "admin")) {
        navItems.push({ href: "#/admin", label: "Admin" });
      }
    } else {
      if (!navItems.find(i => i.href === "#/dashboard" || i.label.toLowerCase() === "dashboard")) {
        navItems.push({ href: "#/dashboard", label: "Dashboard" });
      }
    }
  } else {
    navItems = navItems.filter(item => !(item.label.toLowerCase() === "dashboard" || item.label.toLowerCase() === "admin" || item.href === "#/admin"));
    if (!navItems.find(i => i.href === "#/membership")) {
      navItems.push({ href: "#/membership", label: "Login" });
    }
  }

  const handleClick = (e, item) => {
    setOpen(false);
    if (onSelectSection) {
      onSelectSection(item.href);
    }
  };

  return h("header", null, h("div", { className: "wrap bar" },
    h("a", {
      className: "logo",
      href: "#/home",
      "aria-label": "SMSR home",
      onClick: () => {
        setOpen(false);
        if (onSelectSection) onSelectSection("#home");
      }
    }, h("img", { src: "/logo.png", alt: "The Society of Mathematical Sciences and Research" })),
    h("nav", { className: open ? "open" : "", id: "nav" },
      navItems.map(item => {
        const isActive = activeSection === item.href;
        return h("a", {
          key: item.label,
          className: "nav-pill" + (isActive ? " active" : ""),
          href: item.href,
          "aria-current": isActive ? "page" : undefined,
          onClick: (e) => handleClick(e, item)
        }, h("span", null, item.label));
      })
    ),
    h("button", {
      className: "menu",
      "aria-expanded": open,
      "aria-controls": "nav",
      onClick: () => setOpen(!open)
    }, open ? "Close" : "Menu")
  ));
}
