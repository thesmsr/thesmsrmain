import React from "react";

const h = React.createElement;

export default function JoinSection({ sections, session }) {
  const hasCmsSections = Array.isArray(sections);
  const intro = sections?.find(section => section.section_key === "join-intro");
  let cards = hasCmsSections ? sections.filter(section => ["join-student", "join-faculty"].includes(section.section_key)) : [
    { title: "Join as a student", body: "Find guidance, scholarships, coaching, mock tests and career support built around your next step.", link_label: "Student registration", link_url: "https://forms.gle/UDkECPGySTJweLL46" },
    { title: "Join as a faculty member", body: "Contribute your experience through research, teaching, workshops, mentoring and our academic network.", link_label: "Faculty registration", link_url: "https://forms.gle/UDkECPGySTJweLL46" }
  ];
  if (session?.user) {
    cards = cards.filter(card => !(card.link_url && (card.link_url.includes("membership") || card.link_url.includes("forms.gle"))));
    if (cards.length === 0) {
      cards = [{ title: "Your membership", body: "You are already signed in. Access your account to view your dashboard and registration status.", link_label: "Go to dashboard", link_url: "#/dashboard" }];
    }
  }
  return h("section", { id: "join", className: "join-section" }, h("div", { className: "wrap" },
    intro ? h("div", { className: "head" }, h("p", { className: "eyebrow" }, intro.eyebrow), h("h2", null, intro.title),
      h("p", null, intro.body)) : !hasCmsSections && h("div", { className: "head" }, h("p", { className: "eyebrow" }, "Join the trust"), h("h2", null, "Choose how you want to take part"),
      h("p", null, "Students, academic staff, graduates and supporters can all find a place in the SMSR community.")),
    h("div", { className: "join-grid" },
      cards.map((card, index) => h("article", { className: "join-card" + (index === 1 ? " featured" : ""), key: card.section_key || index },
        h("span", { className: "join-number" }, "0" + (index + 1)), h("h3", null, card.title),
        h("p", null, card.body), card.link_url && h("a", { className: "btn", href: card.link_url }, card.link_label || "Learn more")))
    )
  ));
}
