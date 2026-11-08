import React from "react";

const h = React.createElement;

const details = {
  "award": {
    title: "Award",
    intro: "Honouring and celebrating exceptional achievements in mathematics, research, teaching and academic leadership.",
    sections: [
      ["Recognising excellence", "SMSR awards celebrate researchers, educators and students who demonstrate outstanding commitment, innovation and impact."],
      ["Annual honours & commendations", "Awards are presented during conferences, seminars and trust celebrations to inspire scholarly leadership."],
      ["Nominations & eligibility", "Open to researchers, faculty members, young scholars and educational institutions committed to academic advancement."]
    ]
  },
  "seminar_webinar": {
    title: "Seminar & Webinar",
    intro: "Interactive in-person and virtual symposiums connecting scholars, researchers and students with global experts.",
    sections: [
      ["Engaging presentations", "Sessions focus on emerging mathematical theories, computational research, pedagogical methods and interdisciplinary studies."],
      ["Global access & collaboration", "Virtual webinars allow students and faculty across regions to participate, ask questions and collaborate freely."],
      ["Certificate of participation", "Attendees receive official recognition and networking opportunities with keynote speakers and academic peers."]
    ]
  },
  "gatepass": {
    title: "GATEpass",
    intro: "A dedicated academic gateway providing access to tests, learning resources, guidance and exam pathways.",
    sections: [
      ["Comprehensive examination access", "GATEpass supports learners preparing for national-level competitive assessments, entrance tests and higher study."],
      ["Study materials & mock evaluation", "Access curated question banks, structured test series and mentor feedback designed to build exam readiness."],
      ["Pathway to scholarship", "Top performers through GATEpass can qualify for merit scholarships, research fellowships and workshop invitations."]
    ]
  },
  "research_collaboration": {
    title: "Research Collaboration",
    intro: "Fostering inter-institutional partnerships, joint research initiatives and interdisciplinary scholarship.",
    sections: [
      ["Cross-institutional partnerships", "Connecting researchers from universities, institutes and industry to tackle complex mathematical and scientific challenges."],
      ["Joint publications & grants", "Facilitating co-authored papers in peer-reviewed journals, collaborative grant applications and book projects."],
      ["Academic exchange network", "Enabling faculty and scholar exchange programmes, shared lab resources and joint conference hosting."]
    ]
  },
  "research-journal": {
    title: "Research Journals",
    intro: "Publish original research and share valuable academic work with a wider learning community.",
    sections: [["A place for scholarship", "Our journal service is designed for researchers who want to present focused, original work with a clear academic structure."], ["What we support", "Manuscript preparation, editorial coordination and a considered route from research idea to publication."], ["Who it is for", "Students, scholars, faculty members and independent researchers preparing a paper for publication."]]
  },
  "book-publication": {
    title: "Book Publication",
    intro: "Take a manuscript from a promising draft to a published book with ISBN support.",
    sections: [["Textbook publication", "We support educators and subject experts with editing, formatting and distribution for books intended for classrooms and wider academic use."], ["Edited and author books", "Articles, novels, memoirs and non-fiction manuscripts can be shaped into a cohesive edited volume or a finished author publication."], ["From manuscript to reader", "The service supports evaluation, editing, cover design and the practical steps needed to bring a book to life."]]
  },
  "conference_workshop": {
    title: "Conferences",
    intro: "Learn with expert speakers, thought leaders and practitioners through collaborative academic events.",
    sections: [["Practical learning", "Workshops cover technology, business, healthcare, education and more through hands-on sessions, discussions and panels."], ["Conferences that connect", "Conferences bring together academia, industry and government through keynote talks, papers, posters, networking and publications."], ["Collaborate with us", "Students, educators, researchers, institutes, colleges and universities are welcome to collaborate on future events."]]
  },
  "faculty_development_programme": {
    title: "Faculty Development Program",
    intro: "Grow teaching, research and leadership skills through flexible professional development for faculty members.",
    sections: [["Teaching and learning", "Explore innovative teaching methods, effective assessment and practical ways to improve student engagement."], ["Research and technology", "Develop research skills, discover funding opportunities and use learning management, digital content and collaboration tools effectively."], ["Professional growth", "Flexible in-person and virtual sessions, mentoring and coaching help faculty members build a confident academic practice."]]
  },
  "research_guidance": {
    title: "Research Guidance",
    intro: "Move your research project forward with structured guidance from idea to final presentation.",
    sections: [["Find direction", "Clarify your research question, scope, objectives and the most useful path through the available literature."], ["Build stronger work", "Receive practical support with planning, methodology, academic writing, analysis and presentation."], ["For learners and scholars", "The service is designed for students, researchers and faculty members who want a clearer, more disciplined research process."]]
  },
  "intelligence_test": {
    title: "Intelligence Test",
    intro: "Use structured assessment to understand learning preferences, strengths and possible next steps.",
    sections: [["What the assessment explores", "The DMIT and brain-fingerprinting material describes multiple intelligence, learning styles, brain dominance, leadership style, thought process and judgement ability."], ["Possible outcomes", "The assessment can support stream selection, detailed career options and extracurricular direction."], ["A wider view of ability", "The service is intended to help families understand a learner’s inborn abilities and preferred channels of learning beyond a single IQ score."]]
  },
  "merit_scholarship": {
    title: "Merit Scholarship",
    intro: "Help talented students continue learning when tuition and study costs stand in the way.",
    sections: [["Opportunity without the barrier", "The scholarship service supports bright, motivated learners who need financial assistance to continue their education."], ["What it can enable", "Support may help students access tuition, learning materials, coaching and the confidence to pursue higher study."], ["A shared responsibility", "Scholarships are part of SMSR’s wider purpose of making education more affordable and congenial for every learner."]]
  },
  "coaching_institute": {
    title: "Coaching Institute",
    intro: "Build academic confidence through structured coaching, personal attention and regular assessment.",
    sections: [["Courses for different goals", "The institute supports students at different educational levels, including CBSE, ICSE, WBCHSE, WBJEE, JEE Main and JEE Advanced preparation."], ["More than lessons", "Experienced teachers, study materials, interactive classes and regular assessments create a supportive learning environment."], ["Competitive examinations", "The programme also includes preparation for NET, SET and GATE, alongside life skills such as problem-solving, communication and leadership."]]
  },
  "career-counseling": {
    title: "Career Counselling",
    intro: "Make informed decisions about education, admission and the career path that fits your strengths.",
    sections: [["Personalised direction", "Experienced counsellors help identify strengths, interests and values through assessments and one-to-one sessions."], ["Practical support", "The service includes career counselling, educational planning and admission assistance."], ["A clear next step", "The aim is to reduce uncertainty and help each learner move toward a fulfilling path with realistic, useful guidance."]]
  },
  "teachers_bureau": {
    title: "Teachers’ Bureau",
    intro: "Connect educators with teaching opportunities and a professional learning network.",
    sections: [["For educators", "The bureau is designed to help teachers find relevant opportunities and make their experience more visible to institutions."], ["A stronger academic network", "It brings educators, colleges and learners into closer contact around teaching, mentoring and development."], ["Keep opportunities moving", "New openings and announcements can be shared through the SMSR notifications channel."]]
  },
  "mock_test": {
    title: "Mock Test",
    intro: "Practise under exam conditions, understand your preparation and approach the real assessment with greater confidence.",
    sections: [["Practice with purpose", "Mock tests help learners become familiar with timing, question formats and the pressure of completing an examination."], ["Learn from the result", "Reviewing performance can reveal strengths, gaps and the topics that deserve focused revision."], ["For every stage", "The service can support school, entrance and competitive exam preparation alongside coaching and research guidance."]]
  },
  "training_placement": {
    title: "Training & Placement",
    intro: "Build practical skills and move from preparation toward meaningful professional opportunities.",
    sections: [["Industry-focused preparation", "Training helps learners strengthen the knowledge, communication and workplace habits needed for their first role."], ["From learning to opportunity", "Placement support connects preparation with possible employers and relevant professional pathways."], ["For emerging professionals", "The service is designed for students, graduates and learners ready to make a confident transition into work."]]
  }
};

export default function ServicePage({ slug, content, sections, cmsAvailable, session }) {
  const fallback = details[slug] || details["research-journal"];
  if (!content && cmsAvailable) {
    return h("div", { className: "page-view service-page" },
      h("div", { className: "page-intro" }, h("p", { className: "eyebrow" }, "SMSR service"), h("h1", null, "Service unavailable"), h("p", null, "This service is not currently published.")),
      h("div", { className: "service-page-actions wrap" }, h("a", { className: "btn", href: "#/services" }, "Back to services"))
    );
  }
  const service = content ? {
    title: content.title,
    intro: content.summary || content.body,
    sections: Array.isArray(sections) && sections.length
      ? sections.map(section => [section.title, section.body])
      : [[content.title, content.body || content.summary]]
  } : fallback;
  return h("div", { className: "page-view service-page" },
    h("div", { className: "page-intro" },
      h("p", { className: "eyebrow" }, "SMSR service"),
      h("h1", null, service.title),
      h("p", null, service.intro)
    ),
    h("section", { className: "page-section" }, h("div", { className: "wrap service-detail-grid" },
      service.sections.filter(section => section[0] || section[1]).map((section, index) => h("article", { className: "service-detail", key: section[0] + index },
        h("span", { className: "service-detail-number" }, "0" + (index + 1)),
        h("h2", null, section[0]),
        h("p", null, section[1])
      ))
    )),
    h("div", { className: "service-page-actions wrap" },
      h("a", { className: "btn", href: session?.user ? "#/dashboard" : "#/membership" }, session?.user ? "Ask about this service" : "Ask about this service"),
      h("a", { className: "btn alt", href: "#/services" }, "Back to services")
    )
  );
}
