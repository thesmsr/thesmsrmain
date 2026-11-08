import React from "react";
import LogoAnimation from "./LogoAnimation";

const h = React.createElement;

export default function HomeSection({ content, sections, session }) {
  const hasCmsSections = Array.isArray(sections);
  const ctas = hasCmsSections ? sections.filter(section => section.section_key.startsWith("hero-")) : [
    { link_label: "Join as a student", link_url: "#/membership" },
    { link_label: "Explore our services", link_url: "#/services" }
  ];
  const filteredCtas = session?.user ? ctas.filter(cta => !(cta.link_url && cta.link_url.includes("membership"))) : ctas;
  const displayCtas = filteredCtas.length ? filteredCtas : (session?.user ? [{ link_label: "Go to dashboard", link_url: "#/dashboard" }, { link_label: "Explore our services", link_url: "#/services" }] : ctas);
  return h("section", { id: "home", className: "home-section" }, h("div", { className: "wrap hero" },
    h("div", { className: "copy" },
      h("p", { className: "eyebrow" }, content?.eyebrow || "A public charitable trust"),
      h("h1", null, content?.title || "Education shouldn’t depend on who can pay for it."),
      h("p", null, content?.body || "Since 2008, SMSR has supported students, teachers and researchers, reaching more than 1,700 students."),
      h("div", { className: "row" }, displayCtas.map((cta, index) => cta.link_url && h("a", { className: "btn alt" + (index === 0 ? " primary" : ""), href: cta.link_url, key: cta.section_key || index }, cta.link_label || "Learn more")))
    ),
    content?.image_url
      ? h("div", { className: "logo-stage" }, h("img", { src: content.image_url, alt: content?.title || "SMSR", style: { maxWidth: "90%", maxHeight: "420px", objectFit: "contain", borderRadius: "16px", filter: "drop-shadow(0 20px 25px rgba(16,34,110,.2))" } }))
      : h(LogoAnimation)
  ));
}
