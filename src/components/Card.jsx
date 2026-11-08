import React, { useRef } from "react";
import ServiceIcon3D from "./ServiceIcon3D";

const h = React.createElement;

export default function Card({ i, s, isActive, onSelect }) {
  const r = useRef(null);
  const move = e => {
    if (e.pointerType === "touch" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const b = r.current.getBoundingClientRect();
    r.current.style.setProperty("--rx", (-((e.clientY - b.top) / b.height - .5) * 8) + "deg");
    r.current.style.setProperty("--ry", (((e.clientX - b.left) / b.width - .5) * 10) + "deg");
    r.current.style.setProperty("--mx", ((e.clientX - b.left) / b.width * 100) + "%");
    r.current.style.setProperty("--my", ((e.clientY - b.top) / b.height * 100) + "%");
  };
  const leave = () => {
    if (r.current) {
      r.current.style.setProperty("--rx", "0deg");
      r.current.style.setProperty("--ry", "0deg");
      r.current.style.setProperty("--mx", "50%");
      r.current.style.setProperty("--my", "50%");
    }
  };

  const handleClick = () => {
    if (onSelect) onSelect(i);
  };

  const href = s[2] ? "#/service/" + s[2].replace(/\.html$/, "") : "#/services";

  return h("a", {
    className: `service-card service-card-${i + 1}${isActive ? " active" : ""}`,
    href,
    ref: r,
    onPointerMove: move,
    onPointerLeave: leave,
    onClick: handleClick,
    "aria-label": s[0],
    "aria-pressed": isActive ? "true" : "false"
  },
    h("div", { className: "service-card-inner" },
      h("div", { className: "service-card-face service-card-front" },
        h("div", { className: "service-icon-wrap" },
          s[3] ? h("img", { src: s[3], alt: s[0], style: { width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" } }) : h(ServiceIcon3D, { index: i, slug: s[2] ? s[2].replace(/\.html$/, "") : "", title: s[0], size: 48 })
        ),
        h("h3", null, s[0])
      ),
      h("div", { className: "service-card-face service-card-back" },
        h("div", { className: "service-card-content" },
          h("h3", null, s[0]),
          h("p", null, s[1])
        ),
        h("div", { className: "service-card-bottom" },
          h("span", { className: "service-more" }, "Learn more", h("span", { className: "arrow" }, "→"))
        )
      )
    )
  );
}


