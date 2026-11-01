import React from "react";

const h = React.createElement;

export default function Footer({ settings = [], session }) {
  const setting = (key, fallback) => settings.find(item => item.key === key)?.value || fallback;
  const explore = [
    ["About SMSR", "#/about"],
    ["Gallery", "#/gallery"],
    ["Donation", "#/donate"],
    session?.user ? ["Dashboard", "#/dashboard"] : ["Membership", "#/membership"]
  ];
  const policies = [["Terms & conditions", "#/terms"], ["Privacy policy", "#/privacy"], ["Refund policy", "#/refund"]];
  return h("footer", { id: "contact" }, h("div", { className: "wrap footer-grid" },
    h("div", { className: "footer-contact" }, h("p", { className: "eyebrow" }, setting("footer_eyebrow", "Contact SMSR")), h("h2", null, setting("footer_title", "Let’s build access to learning together.")),
      h("p", null, setting("footer_phone", "+91 8017555556")), h("p", null, setting("footer_email", "knowledgereview08@gmail.com")), h("p", null, setting("footer_address", "8/1/2 Dr. U.N. Brahmachari Street (Loudon Street), Kolkata 700017"))),
    h("div", null, h("h3", null, "Explore"), h("ul", null, explore.map(link => h("li", { key: link[0] }, h("a", { href: link[1] }, link[0]))))),
    h("div", null, h("h3", null, "Policies"), h("ul", null, policies.map(link => h("li", { key: link[0] }, h("a", { href: link[1] }, link[0]))))),
    h("div", { className: "footer-bottom" }, h("span", null, setting("footer_copyright", "SMSR · Since 2008")), session?.user ? null : h("a", { href: "#/home" }, "Back to top ↑"))
  ));
}
