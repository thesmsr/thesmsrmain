import React from "react";

const h = React.createElement;

export default function LogoAnimation() {
  return h("div", { className: "logo-stage", role: "img", "aria-label": "The Society of Mathematical Sciences and Research logo" },
    h("img", { className: "logo-crest", src: "/logo.png", alt: "" }),
    h("div", { className: "logo-words", "aria-hidden": true },
      h("span", { className: "logo-line" }, h("span", { className: "logo-word" }, "THE"), h("span", { className: "logo-word" }, "SOCIETY")),
      h("span", { className: "logo-line" }, h("span", { className: "logo-word" }, "OF"), h("span", { className: "logo-word" }, "MATHEMATICAL"), h("span", { className: "logo-word" }, "SCIENCES")),
            h("span", { className: "logo-line" }, h("span", { className: "logo-word" }, "AND"), h("span", { className: "logo-word" }, "RESEARCH"))
    )
  );
}
