import React from "react";

const h = React.createElement;

export default function ServiceIcon3D({ index, slug = "", title = "", size = 32 }) {
  const norm = `${slug} ${title}`.toLowerCase();
  let iconCase = index;
  if (norm.includes("award")) iconCase = 6;
  else if (norm.includes("merit") || norm.includes("scholarship")) iconCase = 3;
  else if (norm.includes("journal")) iconCase = 0;
  else if (norm.includes("book")) iconCase = 1;
  else if (norm.includes("conference")) iconCase = 2;
  else if (norm.includes("faculty")) iconCase = 7;
  else if (norm.includes("seminar") || norm.includes("webinar")) iconCase = 11;
  else if (norm.includes("gate") || norm.includes("pass")) iconCase = 9;
  else if (norm.includes("mock")) iconCase = 10;
  else if (norm.includes("intelligence")) iconCase = 5;
  else if (norm.includes("guidance")) iconCase = 4;
  else if (norm.includes("collab")) iconCase = 8;

  switch (iconCase) {
    case 0:
      // Research journal: 3D open book / journal with ribbon
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic0-cov", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#60A5FA" }),
            h("stop", { offset: "100%", stopColor: "#1D4ED8" })),
          h("linearGradient", { id: "ic0-pgL", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#FFFFFF" }),
            h("stop", { offset: "100%", stopColor: "#CBD5E1" })),
          h("linearGradient", { id: "ic0-pgR", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#F8FAFC" }),
            h("stop", { offset: "100%", stopColor: "#94A3B8" })),
          h("linearGradient", { id: "ic0-rib", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#F87171" }),
            h("stop", { offset: "100%", stopColor: "#B91C1C" })),
          h("filter", { id: "ic0-sh", x: "-20%", y: "-20%", width: "140%", height: "140%" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic0-sh)" },
          // Back cover depth
          h("path", { d: "M5 33L24 38L43 33V35L24 40L5 35Z", fill: "url(#ic0-cov)" }),
          // Left page block
          h("path", { d: "M6 13C12 11 19 12 24 16V36C19 32 12 31 6 33Z", fill: "url(#ic0-pgL)" }),
          // Right page block
          h("path", { d: "M42 13C36 11 29 12 24 16V36C29 32 36 31 42 33Z", fill: "url(#ic0-pgR)" }),
          // Page top edge highlights
          h("path", { d: "M6 13C12 11 19 12 24 16C19 13.5 12 12.5 6 14.5Z", fill: "#FFFFFF", opacity: "0.8" }),
          h("path", { d: "M42 13C36 11 29 12 24 16C29 13.5 36 12.5 42 14.5Z", fill: "#FFFFFF", opacity: "0.8" }),
          // Lines on left page
          h("path", { d: "M10 18H20M10 22H20M10 26H17", stroke: "#94A3B8", strokeWidth: "1.5", strokeLinecap: "round" }),
          // Lines on right page
          h("path", { d: "M28 18H38M28 22H38M28 26H35", stroke: "#64748B", strokeWidth: "1.5", strokeLinecap: "round" }),
          // Bookmark ribbon
          h("path", { d: "M22 14V34L24 32L26 34V14Z", fill: "url(#ic0-rib)" })
        )
      );

    case 1:
      // Book publication: 3D hardcover book in perspective
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic1-cov", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#34D399" }),
            h("stop", { offset: "100%", stopColor: "#059669" })),
          h("linearGradient", { id: "ic1-sp", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
            h("stop", { offset: "0%", stopColor: "#065F46" }),
            h("stop", { offset: "100%", stopColor: "#047857" })),
          h("linearGradient", { id: "ic1-pg", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#F8FAFC" }),
            h("stop", { offset: "100%", stopColor: "#CBD5E1" })),
          h("filter", { id: "ic1-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic1-sh)" },
          // Spine
          h("path", { d: "M10 11C8.5 11 8 12.5 8 14V36C8 37.5 8.5 39 10 39H14V11H10Z", fill: "url(#ic1-sp)" }),
          // Front cover
          h("path", { d: "M14 11L38 6V34L14 39V11Z", fill: "url(#ic1-cov)" }),
          // Pages thickness at bottom
          h("path", { d: "M14 39L38 34L40 35L14 41Z", fill: "url(#ic1-pg)" }),
          // Pages thickness on right edge
          h("path", { d: "M38 6L40 7V35L38 34Z", fill: "url(#ic1-pg)" }),
          // Gold emblem on cover
          h("circle", { cx: "26", cy: "21", r: "5", fill: "#FDE047", opacity: "0.9" }),
          h("path", { d: "M26 18L27 21L30 21L27.5 22.5L28.5 25L26 23.5L23.5 25L24.5 22.5L22 21L25 21Z", fill: "#B45309" }),
          // Cover highlight
          h("path", { d: "M14 11L38 6L37 8L14 13Z", fill: "#FFFFFF", opacity: "0.35" })
        )
      );

    case 2:
      // Conference & workshop: 3D presentation podium with mic
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic2-top", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#F472B6" }),
            h("stop", { offset: "100%", stopColor: "#BE185D" })),
          h("linearGradient", { id: "ic2-pil", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
            h("stop", { offset: "0%", stopColor: "#831843" }),
            h("stop", { offset: "50%", stopColor: "#9D174D" }),
            h("stop", { offset: "100%", stopColor: "#500724" })),
          h("filter", { id: "ic2-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic2-sh)" },
          // Base
          h("path", { d: "M14 39L24 42L34 39L24 37Z", fill: "#500724" }),
          h("path", { d: "M14 39V41L24 44L34 41V39L24 42Z", fill: "#831843" }),
          // Central pillar
          h("path", { d: "M20 22L18 39H30L28 22H20Z", fill: "url(#ic2-pil)" }),
          // Lectern top shelf
          h("path", { d: "M10 18L24 22L38 18L24 14Z", fill: "url(#ic2-top)" }),
          h("path", { d: "M10 18V20L24 24L38 20V18L24 22Z", fill: "#831843" }),
          // Document on shelf
          h("path", { d: "M20 16L28 17.5L27 20.5L19 19Z", fill: "#FFFFFF", opacity: "0.85" }),
          // Microphone
          h("path", { d: "M24 14V9C24 7 28 7 28 9", stroke: "#E2E8F0", strokeWidth: "1.8", strokeLinecap: "round" }),
          h("circle", { cx: "28", cy: "9", r: "2.5", fill: "#CBD5E1" }),
          // Sound wave
          h("path", { d: "M33 7C34.5 8 34.5 10 33 11", stroke: "#FDE047", strokeWidth: "1.5", strokeLinecap: "round" })
        )
      );

    case 3:
      // Faculty development: 3D graduation cap (mortarboard) & scroll
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic3-cap", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#818CF8" }),
            h("stop", { offset: "100%", stopColor: "#4338CA" })),
          h("linearGradient", { id: "ic3-sk", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#3730A3" }),
            h("stop", { offset: "100%", stopColor: "#1E1B4B" })),
          h("filter", { id: "ic3-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic3-sh)" },
          // Under cap skull
          h("path", { d: "M15 21V28C15 32 33 32 33 28V21L24 24Z", fill: "url(#ic3-sk)" }),
          // Diamond mortarboard top
          h("path", { d: "M24 10L42 17L24 24L6 17Z", fill: "url(#ic3-cap)" }),
          // Top highlight
          h("path", { d: "M24 10L37 15L24 19L11 15Z", fill: "#FFFFFF", opacity: "0.2" }),
          // Center gold button
          h("ellipse", { cx: "24", cy: "17", rx: "2.5", ry: "1.8", fill: "#FBBF24" }),
          // Tassel cord
          h("path", { d: "M24 17C29 17 33 21 34 25L35 32", stroke: "#F59E0B", strokeWidth: "1.6", strokeLinecap: "round" }),
          // Tassel brush
          h("polygon", { points: "33,32 37,32 36,36 34,36", fill: "#D97706" }),
          // Small scroll tied at bottom
          h("rect", { x: "12", y: "37", width: "16", height: "4", rx: "2", fill: "#FEF3C7" }),
          h("rect", { x: "19", y: "36.5", width: "2", height: "5", rx: "0.5", fill: "#EF4444" })
        )
      );

    case 4:
      // Research guidance: 3D compass / lens
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic4-rim", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#FDE047" }),
            h("stop", { offset: "50%", stopColor: "#D97706" }),
            h("stop", { offset: "100%", stopColor: "#78350F" })),
          h("radialGradient", { id: "ic4-dial", cx: "50%", cy: "50%", r: "50%" },
            h("stop", { offset: "0%", stopColor: "#1E293B" }),
            h("stop", { offset: "100%", stopColor: "#020617" })),
          h("filter", { id: "ic4-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic4-sh)" },
          // Top loop
          h("circle", { cx: "24", cy: "8", r: "3", stroke: "#F59E0B", strokeWidth: "1.8", fill: "none" }),
          // Outer beveled ring
          h("circle", { cx: "24", cy: "26", r: "16", fill: "url(#ic4-rim)" }),
          // Inner dial face
          h("circle", { cx: "24", cy: "26", r: "13", fill: "url(#ic4-dial)" }),
          // Cardinal marks
          h("path", { d: "M24 15V17M24 35V37M13 26H15M33 26H35", stroke: "#64748B", strokeWidth: "1.5" }),
          // North needle (red 3D)
          h("polygon", { points: "24,16 26.5,26 24,24.5", fill: "#EF4444" }),
          h("polygon", { points: "24,16 21.5,26 24,24.5", fill: "#B91C1C" }),
          // South needle (silver 3D)
          h("polygon", { points: "24,36 26.5,26 24,27.5", fill: "#E2E8F0" }),
          h("polygon", { points: "24,36 21.5,26 24,27.5", fill: "#94A3B8" }),
          // Center pivot
          h("circle", { cx: "24", cy: "26", r: "2.5", fill: "#FDE047" }),
          // Glass shine curve
          h("path", { d: "M14 20C17 15 31 15 34 20", stroke: "#FFFFFF", strokeWidth: "1.5", strokeLinecap: "round", opacity: "0.4" })
        )
      );

    case 5:
      // Intelligence test: 3D glowing cognitive lightbulb
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("radialGradient", { id: "ic5-glow", cx: "45%", cy: "40%", r: "55%" },
            h("stop", { offset: "0%", stopColor: "#FEF08A" }),
            h("stop", { offset: "60%", stopColor: "#F59E0B" }),
            h("stop", { offset: "100%", stopColor: "#D97706" })),
          h("linearGradient", { id: "ic5-base", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
            h("stop", { offset: "0%", stopColor: "#64748B" }),
            h("stop", { offset: "50%", stopColor: "#CBD5E1" }),
            h("stop", { offset: "100%", stopColor: "#475569" })),
          h("filter", { id: "ic5-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic5-sh)" },
          // Bulb glass
          h("path", { d: "M24 7C16.8 7 12 12 12 18C12 23 16 26 18 29V32H30V29C32 26 36 23 36 18C36 12 31.2 7 24 7Z", fill: "url(#ic5-glow)" }),
          // Glass specular highlight
          h("path", { d: "M17 11C20 9 26 9 29 11", stroke: "#FFFFFF", strokeWidth: "2", strokeLinecap: "round", opacity: "0.7" }),
          // Filament
          h("path", { d: "M21 21C21 17 27 17 27 21L24 25Z", stroke: "#FFFFFF", strokeWidth: "1.5", strokeLinejoin: "round", fill: "none" }),
          // Screw base
          h("rect", { x: "18", y: "32", width: "12", height: "3", rx: "1", fill: "url(#ic5-base)" }),
          h("rect", { x: "19", y: "35", width: "10", height: "3", rx: "1", fill: "url(#ic5-base)" }),
          // Terminal contact
          h("path", { d: "M21 38H27L25 41H23Z", fill: "#334155" }),
          // Brain spark rays
          h("path", { d: "M24 2V5M9 10L11.5 12.5M39 10L36.5 12.5M6 18H9M39 18H42", stroke: "#FDE047", strokeWidth: "1.5", strokeLinecap: "round" })
        )
      );

    case 6:
      // Merit scholarship: 3D gold medal with award ribbon
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic6-gld", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#FEF08A" }),
            h("stop", { offset: "50%", stopColor: "#EAB308" }),
            h("stop", { offset: "100%", stopColor: "#A16207" })),
          h("linearGradient", { id: "ic6-ribL", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#3B82F6" }),
            h("stop", { offset: "100%", stopColor: "#1D4ED8" })),
          h("linearGradient", { id: "ic6-ribR", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#EF4444" }),
            h("stop", { offset: "100%", stopColor: "#B91C1C" })),
          h("filter", { id: "ic6-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic6-sh)" },
          // Ribbons
          h("path", { d: "M17 7L24 20L19 22L11 8Z", fill: "url(#ic6-ribL)" }),
          h("path", { d: "M31 7L24 20L29 22L37 8Z", fill: "url(#ic6-ribR)" }),
          // Medal outer rim
          h("circle", { cx: "24", cy: "28", r: "13", fill: "url(#ic6-gld)" }),
          // Medal inner groove
          h("circle", { cx: "24", cy: "28", r: "10.5", stroke: "#78350F", strokeWidth: "1", fill: "none", opacity: "0.5" }),
          // Embossed 3D Star
          h("path", { d: "M24 21L26.2 25.5L31 26.2L27.5 29.5L28.4 34L24 31.7L19.6 34L20.5 29.5L17 26.2L21.8 25.5Z", fill: "#FEF08A" }),
          h("path", { d: "M24 21L26.2 25.5L31 26.2L27.5 29.5L24 31.7Z", fill: "#CA8A04", opacity: "0.5" }),
          // Specular shine
          h("path", { d: "M16 23C19 20 29 20 32 23", stroke: "#FFFFFF", strokeWidth: "1.5", strokeLinecap: "round", opacity: "0.6" })
        )
      );

    case 7:
      // Coaching institute: 3D lecture chalkboard easel
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic7-esl", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
            h("stop", { offset: "0%", stopColor: "#D97706" }),
            h("stop", { offset: "100%", stopColor: "#78350F" })),
          h("linearGradient", { id: "ic7-brd", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#047857" }),
            h("stop", { offset: "100%", stopColor: "#064E3B" })),
          h("filter", { id: "ic7-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic7-sh)" },
          // Back leg
          h("path", { d: "M24 9V41", stroke: "#78350F", strokeWidth: "2.5", strokeLinecap: "round" }),
          // Front legs
          h("path", { d: "M20 9L11 41", stroke: "url(#ic7-esl)", strokeWidth: "2.5", strokeLinecap: "round" }),
          h("path", { d: "M28 9L37 41", stroke: "url(#ic7-esl)", strokeWidth: "2.5", strokeLinecap: "round" }),
          // Board frame
          h("rect", { x: "9", y: "13", width: "30", height: "20", rx: "2", fill: "#92400E" }),
          // Chalkboard surface
          h("rect", { x: "11", y: "15", width: "26", height: "16", rx: "1", fill: "url(#ic7-brd)" }),
          // Performance chart line on board
          h("path", { d: "M14 26L19 22L24 24L31 17", stroke: "#34D399", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
          h("polygon", { points: "31,16 34,17 31,20", fill: "#34D399" }),
          // Chalk ledge and chalk piece
          h("rect", { x: "8", y: "32", width: "32", height: "2.5", rx: "1", fill: "#B45309" }),
          h("rect", { x: "16", y: "30.5", width: "4", height: "1.5", rx: "0.5", fill: "#FFFFFF" })
        )
      );

    case 8:
      // Career counselling: 3D multi-directional arrow signpost
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic8-pol", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
            h("stop", { offset: "0%", stopColor: "#94A3B8" }),
            h("stop", { offset: "50%", stopColor: "#F1F5F9" }),
            h("stop", { offset: "100%", stopColor: "#475569" })),
          h("linearGradient", { id: "ic8-ar1", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#FB923C" }),
            h("stop", { offset: "100%", stopColor: "#C2410C" })),
          h("linearGradient", { id: "ic8-ar2", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#38BDF8" }),
            h("stop", { offset: "100%", stopColor: "#0369A1" })),
          h("filter", { id: "ic8-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic8-sh)" },
          // Base
          h("ellipse", { cx: "24", cy: "42", rx: "7", ry: "2", fill: "#334155" }),
          // Pole
          h("rect", { x: "22", y: "8", width: "4", height: "34", rx: "1.5", fill: "url(#ic8-pol)" }),
          h("circle", { cx: "24", cy: "7.5", r: "2.5", fill: "#CBD5E1" }),
          // Top arrow pointing RIGHT (orange)
          h("path", { d: "M14 11H32L37 15L32 19H14Z", fill: "url(#ic8-ar1)" }),
          h("path", { d: "M14 11H32L37 15H14Z", fill: "#FFFFFF", opacity: "0.2" }),
          h("path", { d: "M18 15H28", stroke: "#FFFFFF", strokeWidth: "1.5", strokeLinecap: "round" }),
          // Bottom arrow pointing LEFT (cyan)
          h("path", { d: "M34 22H16L11 26L16 30H34Z", fill: "url(#ic8-ar2)" }),
          h("path", { d: "M34 22H16L11 26H34Z", fill: "#FFFFFF", opacity: "0.2" }),
          h("path", { d: "M20 26H30", stroke: "#FFFFFF", strokeWidth: "1.5", strokeLinecap: "round" })
        )
      );

    case 9:
      // Teachers’ bureau: 3D professional ID badge card with lanyard
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic9-crd", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#FFFFFF" }),
            h("stop", { offset: "100%", stopColor: "#E2E8F0" })),
          h("linearGradient", { id: "ic9-hdr", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
            h("stop", { offset: "0%", stopColor: "#3B82F6" }),
            h("stop", { offset: "100%", stopColor: "#1D4ED8" })),
          h("filter", { id: "ic9-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic9-sh)" },
          // Lanyard strap
          h("path", { d: "M18 6L24 13L30 6", stroke: "#F59E0B", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }),
          // Metal clip
          h("rect", { x: "22", y: "12", width: "4", height: "4", rx: "1", fill: "#94A3B8" }),
          // Badge card body
          h("rect", { x: "12", y: "15", width: "24", height: "27", rx: "3", fill: "url(#ic9-crd)" }),
          // Card top header bar
          h("path", { d: "M12 18C12 16.3 13.3 15 15 15H33C34.7 15 36 16.3 36 18V21H12V18Z", fill: "url(#ic9-hdr)" }),
          // Avatar photo
          h("circle", { cx: "24", cy: "27", r: "4", fill: "#60A5FA" }),
          h("path", { d: "M18 36C18 33 21 33 24 33C27 33 30 33 30 36Z", fill: "#93C5FD" }),
          // Bio lines
          h("rect", { x: "16", y: "38", width: "16", height: "1.5", rx: "0.75", fill: "#CBD5E1" })
        )
      );

    case 10:
      // Mock test: 3D chrome stopwatch / timer
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic10-crm", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#F8FAFC" }),
            h("stop", { offset: "50%", stopColor: "#94A3B8" }),
            h("stop", { offset: "100%", stopColor: "#475569" })),
          h("radialGradient", { id: "ic10-fc", cx: "50%", cy: "45%", r: "55%" },
            h("stop", { offset: "0%", stopColor: "#FFFFFF" }),
            h("stop", { offset: "100%", stopColor: "#E2E8F0" })),
          h("filter", { id: "ic10-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic10-sh)" },
          // Top push button
          h("rect", { x: "22", y: "6", width: "4", height: "5", rx: "1", fill: "#EF4444" }),
          h("rect", { x: "20", y: "9", width: "8", height: "2.5", rx: "1", fill: "#64748B" }),
          // Side pusher
          h("rect", { x: "32", y: "11", width: "4", height: "3", rx: "1", transform: "rotate(40 32 11)", fill: "#94A3B8" }),
          // Main case
          h("circle", { cx: "24", cy: "27", r: "15", fill: "url(#ic10-crm)" }),
          // Inner face
          h("circle", { cx: "24", cy: "27", r: "12", fill: "url(#ic10-fc)" }),
          // Ticks
          h("path", { d: "M24 17V19M24 35V37M14 27H16M32 27H34", stroke: "#64748B", strokeWidth: "1.5" }),
          // Timer hand (pointing to ~10 o'clock)
          h("path", { d: "M24 27L19 19", stroke: "#DC2626", strokeWidth: "2", strokeLinecap: "round" }),
          h("circle", { cx: "24", cy: "27", r: "2", fill: "#DC2626" }),
          // Glass shine
          h("path", { d: "M15 22C18 17 30 17 33 22", stroke: "#FFFFFF", strokeWidth: "1.5", strokeLinecap: "round", opacity: "0.6" })
        )
      );

    case 11:
    default:
      // Training & placement: 3D rocket launching upward
      return h("svg", { width: size, height: size, viewBox: "0 0 48 48", fill: "none", "aria-hidden": "true" },
        h("defs", null,
          h("linearGradient", { id: "ic11-fus", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#FFFFFF" }),
            h("stop", { offset: "60%", stopColor: "#E2E8F0" }),
            h("stop", { offset: "100%", stopColor: "#94A3B8" })),
          h("linearGradient", { id: "ic11-red", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#F87171" }),
            h("stop", { offset: "100%", stopColor: "#DC2626" })),
          h("linearGradient", { id: "ic11-flm", x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
            h("stop", { offset: "0%", stopColor: "#FDE047" }),
            h("stop", { offset: "50%", stopColor: "#F97316" }),
            h("stop", { offset: "100%", stopColor: "#EF4444" })),
          h("filter", { id: "ic11-sh" },
            h("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.35" }))
        ),
        h("g", { filter: "url(#ic11-sh)" },
          // Rocket exhaust plume
          h("path", { d: "M16 32L12 42L20 36Z", fill: "url(#ic11-flm)" }),
          h("path", { d: "M15 33L13 39L18 36Z", fill: "#FEF08A" }),
          // Left fin
          h("path", { d: "M16 26L11 32L17 33Z", fill: "url(#ic11-red)" }),
          // Right fin
          h("path", { d: "M26 16L32 11L33 17Z", fill: "url(#ic11-red)" }),
          // Main fuselage (slanted 45 deg)
          h("path", { d: "M37 11C31 10 24 14 19 21C16 25 15 29 15 31L17 33C19 33 23 32 27 29C34 24 38 17 37 11Z", fill: "url(#ic11-fus)" }),
          // Nose cone tip
          h("path", { d: "M37 11C34.5 10.5 32 12 30 14L34 18C36 16 37.5 13.5 37 11Z", fill: "url(#ic11-red)" }),
          // Porthole window
          h("circle", { cx: "27", cy: "21", r: "3", fill: "#0284C7" }),
          h("circle", { cx: "27", cy: "21", r: "2.2", fill: "#38BDF8" }),
          h("circle", { cx: "26.5", cy: "20.5", r: "0.8", fill: "#FFFFFF" })
        )
      );
  }
}
