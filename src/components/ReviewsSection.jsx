import React, { useEffect, useState } from "react";

const h = React.createElement;

const reviewers = [
  ["Bhaskar Nandi", "Assistant Professor, Department of Basic Science and Humanities", "University of Engineering and Management, New Town, Kolkata", "Journal publication", "Thanks to Knowledge Review's journal publication support, my paper reached the right audience. Their streamlined process and expert assistance made publishing fast and hassle-free.", "121.jpg"],
  ["Dr. Shweta Dwivedi", "Assistant Professor, Department of Computer Application", "Integral University, Lucknow", "Research guidance", "The personalized research guidance I received was exceptional. The expert mentors provided profound insights and a clear roadmap that elevated the quality of my work.", "122.jpg"],
  ["Dr. Partha Sen", "Assistant Professor, Department of Optometry", "Eminent College of Management and Technology, Barasat", "Conference", "The conference hosted by Knowledge Review was a world-class event. It facilitated excellent academic discourse and provided fantastic networking opportunities with international peers.", "123.jpg"],
  ["Dr. Paula Serdeira Azevedo", "Associate Professor", "University of Algarve, Portugal", "Research guidance", "The research guidance from Knowledge Review was pivotal for my work. Their mentors offered consistent support and technical expertise.", "1.jpg"],
  ["Dr. Sunil Kumar Biswas", "Principal", "New Barrackpore Prafulla Chandra Mahabidhyalaya, Kolkata", "Training & placement", "The training and placement program at Knowledge Review was instrumental in securing my position at TCS. The industry-focused curriculum and dedicated placement support were excellent.", "2.jpg"],
  ["Jyoti Shaw", "Management Trainee", "Tata Consultancy Services, Kolkata", "Research guidance", "I am immensely thankful for the research guidance provided by Knowledge Review. The one-on-one mentorship provided clarity and direction that accelerated my research progress.", "3.jpg"],
  ["Soumen Santra", "Assistant Professor, Department of MCA", "Techno International New Town, Kolkata", "Workshop", "The workshop organized by Knowledge Review was exceptionally well-managed and intellectually stimulating. It provided a valuable platform for educators to exchange ideas and foster collaborations.", "4.jpg"],
  ["Dr. Bishnupada Das", "Secretary", "Surendralal Das Teachers’ Training College, Howrah", "Faculty development", "The Faculty Development program by Knowledge Review was highly effective. It offered practical insights and innovative teaching methodologies that significantly enhanced my skills and classroom engagement.", "5.jpg"]
];

const initials = name => name.replace("Dr. ", "").split(" ").map(word => word[0]).slice(0, 2).join("");
const photoSource = photo => photo ? (photo.startsWith("http") ? photo : "https://www.knowledgereview.org/image/gallery/" + photo) : "";

export default function ReviewsSection({ items, section }) {
  const reviewData = Array.isArray(items) ? items.map(item => [item.name, item.role, item.organization, item.service, item.quote, item.photo_url]) : reviewers;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = reviewData.length ? reviewData[index % reviewData.length] : null;

  useEffect(() => {
    if (paused) return undefined;
    if (!reviewData.length) return undefined;
    const timer = setInterval(() => setIndex(current => (current + 1) % reviewData.length), 3000);
    return () => clearInterval(timer);
  }, [paused, items]);

  const previous = () => setIndex(current => (current - 1 + reviewData.length) % reviewData.length);
  const next = () => setIndex(current => (current + 1) % reviewData.length);

  return h("section", { id: "reviews", className: "reviews-section" }, h("div", { className: "wrap" },
    h("div", { className: "head" }, h("p", { className: "eyebrow" }, section?.eyebrow || "Our community"), h("h2", null, section?.title || "People who have worked with us"),
      h("p", null, section?.body || "Educators and professionals from colleges, universities and companies in India and abroad.")),
    active && h("div", { className: "review-carousel", onFocus: () => setPaused(true), onBlur: () => setPaused(false) },
      h("article", { className: "review-slide", key: active[0], "aria-live": "polite" },
        h("div", { className: "review-person" },
          h("div", { className: "review-portrait" },
            h("span", { "aria-hidden": true }, initials(active[0])),
            active[5] && h("img", { src: photoSource(active[5]), alt: active[0], loading: "lazy", decoding: "async", onError: event => { event.currentTarget.style.display = "none"; } })
          ),
          h("div", { className: "review-identity" }, h("h3", null, active[0]), h("p", null, active[1]), h("small", null, active[2]))
        ),
        h("div", { className: "review-copy" },
          h("span", { className: "review-service" }, active[3]),
          h("blockquote", null, "“", active[4], "”")
        )
      ),
      h("div", { className: "review-controls" },
        h("button", { type: "button", className: "review-arrow", onClick: previous, "aria-label": "Previous review" }, "←"),
        h("div", { className: "review-dots", role: "tablist", "aria-label": "Reviews" }, reviewData.map((reviewer, reviewerIndex) => h("button", {
          key: reviewer[0], type: "button", role: "tab", className: reviewerIndex === index ? "active" : "", "aria-label": "Show review from " + reviewer[0], "aria-selected": reviewerIndex === index, onClick: () => setIndex(reviewerIndex)
        }))),
        h("button", { type: "button", className: "review-arrow", onClick: next, "aria-label": "Next review" }, "→")
      )
    )
  ));
}
