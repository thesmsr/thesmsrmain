import React from "react";

const h = React.createElement;
const moments = [
  ["Research journal", "Ideas published and shared with a wider academic community."],
  ["Conferences & workshops", "Teachers, researchers and learners meeting to exchange knowledge."],
  ["Learning in action", "Practical guidance that turns curiosity into confident next steps."],
  ["Student support", "Scholarships, coaching and resources that help learners keep moving forward."],
  ["Faculty community", "Educators and professionals sharing experience, research and opportunity."],
  ["Training & placement", "Building practical skills and stronger pathways into professional life."]
];

export default function GallerySection({ items, section }) {
  const galleryItems = Array.isArray(items) ? items.map(item => [item.title, item.description, item.image_url]) : moments;
  return h("section", { id: "gallery", className: "gallery-section" }, h("div", { className: "wrap" },
    h("div", { className: "head" }, h("p", { className: "eyebrow" }, section?.eyebrow || "Gallery"), h("h2", null, section?.title || "A record of learning in motion"),
      h("p", null, section?.body || "Explore the work, gatherings and people that make the SMSR community active.")),
    h("div", { className: "gallery-grid" }, galleryItems.map((moment, index) => h("a", { className: "gallery-item gallery-item-" + (index + 1), href: "#/gallery", key: moment[0], style: moment[2] ? { backgroundImage: "linear-gradient(145deg,rgba(13,27,61,.7),rgba(43,98,104,.82)),url(" + moment[2] + ")" } : undefined },
      h("span", { className: "gallery-index" }, "0" + (index + 1)), h("h3", null, moment[0]), h("p", null, moment[1]), h("span", { className: "more" }, "View gallery"))))
  ));
}
