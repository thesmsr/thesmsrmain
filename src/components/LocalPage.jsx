import React, { useEffect, useState } from "react";
import ServicesSection from "./ServicesSection";
import JoinSection from "./JoinSection";
import GallerySection from "./GallerySection";
import ReviewsSection from "./ReviewsSection";
import ServicePage from "./ServicePage";
import { supabase, isSuperAdminEmail } from "../lib/supabase";
import { getAuthErrorMessage, verifyEmailOtp } from "../lib/authMessages";

const h = React.createElement;

function PageIntro({ eyebrow, title, children }) {
  return h("div", { className: "page-intro" },
    h("p", { className: "eyebrow" }, eyebrow),
    h("h1", null, title),
    children && h("p", null, children)
  );
}

export function AdditionalSections({ sections, excluded = [] }) {
  if (!Array.isArray(sections)) return null;
  return sections.filter(section => !excluded.includes(section.section_key)).map(section =>
    h("section", { className: "page-section", key: section.id || section.section_key },
      h("div", { className: "wrap" },
        section.eyebrow && h("p", { className: "eyebrow" }, section.eyebrow),
        section.title && h("h2", null, section.title),
        section.image_url && h("img", { src: section.image_url, alt: section.title || "", loading: "lazy", decoding: "async" }),
        section.body && h("p", null, section.body),
        section.secondary_body && h("p", null, section.secondary_body),
        section.link_url && h("a", { className: "btn", href: section.link_url }, section.link_label || "Learn more")
      )
    )
  );
}

function AboutPage({ content, sections }) {
  const hasCmsSections = Array.isArray(sections);
  const findSection = key => sections?.find(section => section.section_key === key);
  const history = findSection("history") || (!hasCmsSections ? { title: "Our history", body: "Many talented students were eager to learn but could not afford tuition. We formed a public charitable trust to help those students continue their educational journey." } : null);
  const impact = findSection("impact") || (!hasCmsSections ? { title: "1,700+", body: "students reached through our educational work" } : null);
  const mission = findSection("mission") || (!hasCmsSections ? { title: "Mission & vision", body: "Our vision is clear: access to quality education should not be limited by caste, creed, age, class, religion or financial circumstance.", secondary_body: "We support scholarships, mock tests, health check-ups, libraries, books, motivational seminars and the publication of talented scholars’ research." } : null);
  return h("div", { className: "page-view" },
    h(PageIntro, { eyebrow: content?.eyebrow || "About SMSR", title: content?.title || "Education is a right worth making accessible." }, content?.body || "Knowledge Review began its journey on 8 August 2008 with the purpose of promoting education at every level in the country."),
    history && h("section", { className: "page-section" }, h("div", { className: "wrap info-layout" },
      h("div", null, h("h2", null, history.title), h("p", null, history.body)),
      impact && h("div", { className: "stat-panel" }, h("strong", null, impact.title), h("span", null, impact.body))
    )),
    mission && h("section", { className: "page-section page-section-tint" }, h("div", { className: "wrap" },
      h("h2", null, mission.title),
      h("div", { className: "content-columns" },
        h("p", null, mission.body),
        h("p", null, mission.secondary_body)
      )
    )),
    h(AdditionalSections, { sections, excluded: ["history", "impact", "mission"] })
  );
}

function NotificationsPage({ items, content, sections }) {
  const notices = items === undefined ? [
    { title: "Membership registration", body: "Applications are open for students, faculty members, graduates and supporters of education." },
    { title: "Academic opportunities", body: "Check this page for new workshops, research guidance, publication and training announcements." },
    { title: "Stay connected", body: "For clarification, contact the SMSR office using the details in the footer." }
  ] : items;
  return h("div", { className: "page-view" },
    h(PageIntro, { eyebrow: content?.eyebrow || "Notifications", title: content?.title || "Updates from the SMSR community" }, content?.body || "Important announcements about programmes, registrations, scholarships, workshops and opportunities will appear here."),
    h("section", { className: "page-section" }, h("div", { className: "wrap notice-list" }, notices.map((item, index) =>
      h("article", { className: "notice-item", key: item.id || item.title }, h("span", null, String(index + 1).padStart(2, "0")), h("div", null, h("h3", null, item.title), h("p", null, item.body)))
    ))),
    h(AdditionalSections, { sections })
  );
}

function DonatePage({ content, sections }) {
  const hasCmsSections = Array.isArray(sections);
  const findSection = key => sections?.find(section => section.section_key === key);
  const cause = findSection("cause") || (!hasCmsSections ? { title: "Become part of the cause", body: "Your contribution helps us provide scholarships, learning materials, coaching, mock tests, research support and educational opportunities.", secondary_body: "We have 80G and 12A registration from the Income Tax Department. Donations may be made up to Rs. 2,000 by cash, cheque, DD or online transfer, and above Rs. 2,000 by cheque, DD or online transfer." } : null);
  const panel = findSection("donation-panel") || (!hasCmsSections ? { eyebrow: "UPI ID", title: "knowledgereview@icici", link_label: "Donate online", link_url: "https://forms.gle/yYs39ANV1ou3M1nR8" } : null);
  const refund = findSection("refund") || (!hasCmsSections ? { title: "Refund policy", body: "Refunds are generally not entertained. Please choose any paid service carefully; if SMSR is unable to provide a service, a refund may be considered under appropriate circumstances." } : null);
  return h("div", { className: "page-view" },
    h(PageIntro, { eyebrow: content?.eyebrow || "Donate", title: content?.title || "Your support can keep a talented student learning." }, content?.body || "Knowledge Review is a non-profit public charitable trust working to help students who lack the financial support to continue their education."),
    cause && h("section", { className: "page-section" }, h("div", { className: "wrap donation-layout" },
      h("div", null, h("h2", null, cause.title), h("p", null, cause.body), h("p", null, cause.secondary_body)),
      panel && h("div", { className: "donation-panel" }, h("span", { className: "eyebrow" }, panel.eyebrow), h("strong", null, panel.title), panel.link_url && h("a", { className: "btn", href: panel.link_url }, panel.link_label || "Learn more"))
    )),
    refund && h("section", { className: "page-section page-section-tint" }, h("div", { className: "wrap" }, h("h2", null, refund.title), h("p", null, refund.body))),
    h(AdditionalSections, { sections, excluded: ["cause", "donation-panel", "refund"] })
  );
}

function ContactPage({ content, sections }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const defaultDetails = [
    { section_key: "phone", eyebrow: "Phone number", title: "+91 8017555556", link_url: "tel:+918017555556" },
    { section_key: "email", eyebrow: "Email address", title: "knowledgereview08@gmail.com", link_url: "mailto:knowledgereview08@gmail.com" },
    { section_key: "address", eyebrow: "Head office", title: "8/1/2 Dr. U.N. Brahmachari Street (Loudon Street), Kolkata 700017" }
  ];
  const details = Array.isArray(sections) && sections.length ? sections : defaultDetails;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return setStatus("Database is not configured.");
    setBusy(true);
    setStatus("");
    try {
      const { error } = await supabase.from("feedback").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject || "Contact inquiry",
        message: form.message
      });
      if (error) throw error;
      setStatus("Thank you! Your message has been sent to SMSR. Our team will get back to you shortly.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus(err.message || "Failed to submit. Please try again.");
    }
    setBusy(false);
  };

  return h("div", { className: "page-view" },
    h(PageIntro, { eyebrow: content?.eyebrow || "Contact", title: content?.title || "We’d love to hear from you." }, content?.body || "Whether you have questions, suggestions or simply want to say hello, reach out and we’ll get back to you."),
    h("section", { className: "page-section" },
      h("div", { className: "wrap contact-grid" }, details.map(detail =>
        h("article", { key: detail.id || detail.section_key },
          detail.image_url && h("img", { src: detail.image_url, alt: detail.title || "", style: { width: "100%", height: "140px", objectFit: "cover", borderRadius: "10px", marginBottom: "12px" } }),
          h("span", { className: "eyebrow" }, detail.eyebrow),
          detail.link_url ? h("a", { href: detail.link_url }, detail.title) : h("p", { style: { fontWeight: "600", fontSize: "1.1rem" } }, detail.title),
          detail.body && h("p", { style: { marginTop: "6px" } }, detail.body),
          detail.secondary_body && h("p", { style: { fontSize: "0.85rem", color: "var(--muted)", marginTop: "4px" } }, detail.secondary_body)
        )
      ))
    ),
    h("section", { className: "page-section page-section-tint" },
      h("div", { className: "wrap", style: { maxWidth: "760px" } },
        h("h2", { style: { marginBottom: "10px" } }, "Send us a message"),
        h("p", { style: { color: "var(--muted)", marginBottom: "24px" } }, "Fill in the details below and an SMSR team member will connect with you."),
        h("form", { onSubmit: handleSubmit, style: { display: "grid", gap: "16px" } },
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" } },
            h("label", { style: { display: "grid", gap: "6px", fontWeight: "600", fontSize: "0.86rem" } }, "Your Name",
              h("input", { type: "text", required: true, value: form.name, placeholder: "Dr. / Prof. / Mr. / Ms.", onChange: e => setForm({ ...form, name: e.target.value }), style: { padding: "11px 12px", border: "1px solid var(--line)", borderRadius: "9px", background: "var(--surface)", color: "var(--ink)" } })
            ),
            h("label", { style: { display: "grid", gap: "6px", fontWeight: "600", fontSize: "0.86rem" } }, "Email address",
              h("input", { type: "email", required: true, value: form.email, placeholder: "name@example.com", onChange: e => setForm({ ...form, email: e.target.value }), style: { padding: "11px 12px", border: "1px solid var(--line)", borderRadius: "9px", background: "var(--surface)", color: "var(--ink)" } })
            )
          ),
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" } },
            h("label", { style: { display: "grid", gap: "6px", fontWeight: "600", fontSize: "0.86rem" } }, "Contact Phone / WhatsApp",
              h("input", { type: "tel", value: form.phone, placeholder: "+91 8017555556", onChange: e => setForm({ ...form, phone: e.target.value }), style: { padding: "11px 12px", border: "1px solid var(--line)", borderRadius: "9px", background: "var(--surface)", color: "var(--ink)" } })
            ),
            h("label", { style: { display: "grid", gap: "6px", fontWeight: "600", fontSize: "0.86rem" } }, "Subject",
              h("input", { type: "text", value: form.subject, placeholder: "Inquiry topic", onChange: e => setForm({ ...form, subject: e.target.value }), style: { padding: "11px 12px", border: "1px solid var(--line)", borderRadius: "9px", background: "var(--surface)", color: "var(--ink)" } })
            )
          ),
          h("label", { style: { display: "grid", gap: "6px", fontWeight: "600", fontSize: "0.86rem" } }, "Message",
            h("textarea", { required: true, rows: 4, value: form.message, placeholder: "How can we assist you?", onChange: e => setForm({ ...form, message: e.target.value }), style: { padding: "11px 12px", border: "1px solid var(--line)", borderRadius: "9px", background: "var(--surface)", color: "var(--ink)", resize: "vertical" } })
          ),
          h("div", null,
            h("button", { type: "submit", className: "btn", disabled: busy }, busy ? "Submitting..." : "Send message")
          ),
          status && h("p", { className: "login-status", "aria-live": "polite" }, status)
        )
      )
    )
  );
}

function LoginPage({ session }) {
  const [selected, setSelected] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (session?.user) {
      window.location.hash = "#/dashboard";
    }
  }, [session]);
  const options = [
    ["01", "Student", "Access student services, applications and learning support."],
    ["02", "Faculty", "Manage faculty participation, research and academic programmes."],
    ["03", "Member", "Access your SMSR membership and community information."],
    ["04", "Admin", "Use the administration portal for authorised SMSR staff."]
  ];
  const selectedOption = options.find(option => option[1] === selected);
  const resetSelection = () => {
    setSelected(null);
    setRegistering(false);
    setStatus("");
    setOtp("");
  };
  const signInWithGoogle = async () => {
    if (!supabase) return setStatus("Supabase is not configured.");
    setBusy(true);
    const target = (selected === "Admin" || isSuperAdminEmail(email)) ? "admin" : "dashboard";
    localStorage.setItem("smsr_auth_target", target);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}?auth_target=${target}`,
        data: { category: selected }
      }
    });
    if (error) {
      setStatus(error.message);
      setBusy(false);
    }
  };
  const sendOtp = async () => {
    if (!supabase) return setStatus("Supabase is not configured.");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setStatus("Enter your email address first.");
    setBusy(true);
    setStatus("");
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true, data: { category: selected } }
    });
    if (error) {
      setStatus(getAuthErrorMessage(error));
      setSent(false);
    } else {
      setStatus("A fresh verification code was sent to your email. Check your Inbox (and Spam/Junk folder). Enter the code below.");
      setSent(true);
    }
    setBusy(false);
  };
  const verifyLogin = async event => {
    event.preventDefault();
    if (!supabase) return setStatus("Supabase is not configured.");
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    if (!cleanEmail) return setStatus("Enter your email address first.");
    if (!cleanOtp) return setStatus("Enter the verification code received by email.");
    setBusy(true);
    setStatus("");
    const { error } = await verifyEmailOtp(supabase, cleanEmail, cleanOtp);
    if (error) {
      setStatus(getAuthErrorMessage(error));
      setBusy(false);
      return;
    }
    setStatus("Login successful!");
    setBusy(false);
    const dest = (selected === "Admin" || isSuperAdminEmail(cleanEmail)) ? "#/admin" : "#/dashboard";
    window.location.hash = dest;
  };
  return h("div", { className: "page-view section-page login-page" },
    h("div", { className: "page-intro" }, h("p", { className: "eyebrow" }, "Secure access"), h("h1", null, "Choose your login"), h("p", null, "Select the portal that matches your role in the SMSR community.")),
    h("section", { className: "page-section" }, h("div", { className: "wrap" },
      h("div", { className: "login-shell" + (selected ? " has-selection" : " choose-mode") },
        h("div", { className: "login-choice-panel" + (selected ? " has-selection" : "") },
          h("div", { className: "login-choice-heading" }, h("p", { className: "eyebrow" }, selected ? "Selected portal" : "01 / Choose a portal"), h("h2", null, selected || "Who are you logging in as?")),
          h("div", { className: "login-options" }, options.filter(option => !selected || selected === option[1]).map(option => h("button", {
            type: "button", className: "login-option" + (selected === option[1] ? " active" : ""), key: option[1], onClick: () => { setSelected(option[1]); setRegistering(false); setStatus(""); }
          }, h("span", { className: "login-number" }, option[0]), h("h2", null, option[1]), h("p", null, option[2]), !selected && h("span", { className: "login-continue" }, h("span", null, "Continue →"))))),
          selected && h("button", { type: "button", className: "login-back", onClick: resetSelection }, h("span", null, "← Choose another login"))
        ),
        selected ? registering && selected !== "Admin"
          ? h(RegistrationForm, { category: selected, onBack: () => setRegistering(false) })
          : h("form", { className: "login-selected", onSubmit: verifyLogin },
          h("p", { className: "eyebrow" }, (selectedOption ? selectedOption[0] : "02") + " / Verify access"),
          h("h2", null, "Login with email and OTP"),
          h("button", { type: "button", className: "btn google-login", onClick: signInWithGoogle, disabled: busy }, busy ? "Opening Google…" : "Continue with Google"),
          h("p", { className: "admin-divider" }, "or use email OTP"),
          h("label", null, "Email address", h("input", { type: "email", value: email, required: true, placeholder: "you@example.com", onChange: event => setEmail(event.target.value) })),
          h("div", { className: "otp-row" },
            h("label", null, "Verification code", h("input", { type: "text", value: otp, required: true, inputMode: "numeric", autoComplete: "one-time-code", maxLength: 10, placeholder: "Enter code from email", onChange: event => setOtp(event.target.value.replace(/\D/g, "").slice(0, 10)) })),
            h("button", { type: "button", className: "btn alt", onClick: sendOtp, disabled: busy }, busy ? "Sending…" : sent ? "Resend OTP" : "Send OTP")
          ),
          h("button", { type: "submit", className: "btn login-submit", disabled: busy }, busy ? "Verifying…" : "Verify & Login"),
          selected !== "Admin" && h("button", { type: "button", className: "login-register-link", onClick: () => { setRegistering(true); setStatus(""); } }, "Not registered yet? Complete the registration form"),
          selected === "Admin" && h("p", { className: "registration-privacy" }, "Admin accounts are created and approved by an existing administrator."),
          status && h("p", { className: "login-status", "aria-live": "polite" }, status),
          h("p", { className: "registration-privacy" }, "If you receive a magic link instead of a numeric code, click the link in the email or switch the Supabase Auth email template to 'Email OTP' using {{ .Token }}.")
        ) : null
      )
    ))
  );
}

const registrationFields = [
  ["email", "Email", "email", true],
  ["name", "Name", "text", true],
  ["father_name", "Father's name", "text", true],
  ["mother_name", "Mother's name", "text", true],
  ["gender", "Gender", "select", true],
  ["date_of_birth", "Date of birth", "date", true],
  ["aadhaar_no", "Aadhaar No", "text", true],
  ["designation", "Designation", "text", true],
  ["affiliation", "Affiliation", "text", true],
  ["research_interest", "Area of Research Interest (If Any)", "text", true],
  ["address", "Address", "textarea", true],
  ["contact_no", "Contact No", "tel", true],
  ["whatsapp_no", "WhatsApp No", "tel", true],
  ["alternate_email", "E-Mail Id", "email", true],
  ["highest_qualification", "Highest Qualification", "select", true]
];

function RegistrationForm({ category, onBack }) {
  const [form, setForm] = useState({ gender: "", highest_qualification: "" });
  const [files, setFiles] = useState({});
  const [registrationOtp, setRegistrationOtp] = useState("");
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [status, setStatus] = useState("");
  const [submittedCopy, setSubmittedCopy] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const chooseFile = (field, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setStatus("Each uploaded file must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }
    setFiles(current => ({ ...current, [field]: file }));
  };
  const upload = async (id, field, file) => {
    if (!file) return "";
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${id}/${field}-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("membership-documents").upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw new Error(`${field} upload failed: ${error.message}`);
    return path;
  };
  const sendRegistrationOtp = email => supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, data: { full_name: form.name, category } }
  });
  const submit = async event => {
    event.preventDefault();
    if (!supabase) return setStatus("Supabase is not configured.");
    if (pendingRegistration) return setStatus("Enter the OTP sent to your email to finish registration.");
    if (!files.qualification || !files.signature || !files.photo) return setStatus("Please upload the qualification, signature and passport photo files.");
    setBusy(true);
    setStatus("");
    setSubmittedCopy("");
    const id = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const registrationCopy = [
      "SMSR membership registration",
      `Registration ID: ${id}`,
      `Category: ${category}`,
      ...registrationFields.map(([key, label]) => `${label}: ${form[key] || ""}`)
    ].join("\n");
    try {
      const qualificationPath = await upload(id, "qualification", files.qualification);
      const signaturePath = await upload(id, "signature", files.signature);
      const photoPath = await upload(id, "photo", files.photo);
      const { error } = await supabase.from("membership_applications").insert({
        id,
        ...form,
        category,
        status: "approved",
        registration_copy: registrationCopy,
        qualification_document_path: qualificationPath,
        signature_document_path: signaturePath,
        photo_document_path: photoPath
      });
      if (error) throw new Error(error.message);
      const { error: otpError } = await sendRegistrationOtp(form.email);
      setPendingRegistration({ id, email: form.email });
      if (otpError) {
        setStatus(`Registration saved with ID ${id}, but the OTP email could not be sent. ${getAuthErrorMessage(otpError)} Use Resend OTP after fixing SMTP.`);
      } else {
        setStatus(`Registration saved with ID ${id}. Enter the one-time code sent to ${form.email} to finish registration.`);
      }
      setSubmittedCopy(registrationCopy);
    } catch (error) {
      setStatus(error.message);
    }
    setBusy(false);
  };
  const resendRegistrationOtp = async () => {
    if (!pendingRegistration) return;
    setBusy(true);
    const { error } = await sendRegistrationOtp(pendingRegistration.email);
    setStatus(error ? getAuthErrorMessage(error) : `A new OTP was sent to ${pendingRegistration.email}.`);
    setBusy(false);
  };
  const verifyRegistration = async event => {
    event.preventDefault();
    if (!supabase || !pendingRegistration) return;
    setBusy(true);
    const { error } = await verifyEmailOtp(supabase, pendingRegistration.email, registrationOtp);
    if (error) {
      setStatus(getAuthErrorMessage(error));
      setBusy(false);
      return;
    }
    const { error: claimError } = await supabase.rpc("claim_membership_application", {
      application_id: pendingRegistration.id
    });
    if (claimError) {
      setStatus(`Email verified, but the registration could not be linked to your account: ${claimError.message}`);
      setBusy(false);
      return;
    }
    setStatus(`Registration ${pendingRegistration.id} is verified and linked to your account.`);
    setForm({ gender: "", highest_qualification: "" });
    setFiles({});
    setPendingRegistration(null);
    setRegistrationOtp("");
    window.location.hash = "#/dashboard";
    setBusy(false);
  };
  const renderField = field => {
    const [key, label, type, required] = field;
    let input;
    if (type === "textarea") input = h("textarea", { value: form[key] || "", required, onChange: event => update(key, event.target.value) });
    else if (type === "select" && key === "gender") input = h("select", { value: form[key] || "", required, onChange: event => update(key, event.target.value) }, h("option", { value: "" }, "Select gender"), ["Female", "Male", "Other"].map(value => h("option", { key: value, value }, value)));
    else if (type === "select") input = h("select", { value: form[key] || "", required, onChange: event => update(key, event.target.value) }, h("option", { value: "" }, "Select qualification"), ["Ph.D", "Postgraduation", "Graduation", "Higher Secondary", "Secondary"].map(value => h("option", { key: value, value }, value)));
    else input = h("input", { type, value: form[key] || "", required, onChange: event => update(key, event.target.value) });
    return h("label", { key }, label, input);
  };
  const downloadCopy = () => {
    const blob = new Blob([submittedCopy], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smsr-membership-registration.txt";
    link.click();
    URL.revokeObjectURL(url);
  };
  return h("form", { className: "login-selected registration-form", onSubmit: submit },
    h("p", { className: "eyebrow" }, "Registration / Life membership"),
    h("h2", null, "Membership Form"),
    h("p", { className: "registration-intro" }, "To, The Chairman, KNOWLEDGE REVIEW, 8/1/2 Dr. U.N. Brahmachari Street, Kolkata-700017. I am seeking to be a Life Member of KNOWLEDGE REVIEW and agree to follow the rules and regulations of the organization."),
    h("div", { className: "registration-grid" }, registrationFields.map(renderField)),
    h("label", null, "Highest Qualification (Enclose Photocopy)", h("input", { type: "file", required: true, accept: "application/pdf,image/*", onChange: event => chooseFile("qualification", event) }), files.qualification && h("small", null, files.qualification.name)),
    h("label", null, "Signature of the Candidate", h("input", { type: "file", required: true, accept: "image/*", onChange: event => chooseFile("signature", event) }), files.signature && h("small", null, files.signature.name)),
    h("label", null, "Passport Size Photo", h("input", { type: "file", required: true, accept: "image/*", onChange: event => chooseFile("photo", event) }), files.photo && h("small", null, files.photo.name)),
    h("p", { className: "registration-privacy" }, "Files are stored in a private membership document area and can only be opened by authorised administrators."),
    pendingRegistration && h("div", { className: "registration-otp-panel" },
      h("p", { className: "eyebrow" }, "02 / Verify registration"),
      h("p", null, "Your application is saved. Enter the one-time code from your email to create/link your account and complete registration."),
       h("label", null, "8-digit verification code", h("input", { type: "text", required: true, value: registrationOtp, inputMode: "numeric", autoComplete: "one-time-code", pattern: "[0-9]{8}", maxLength: 8, placeholder: "Enter 8-digit code", onChange: event => setRegistrationOtp(event.target.value.replace(/\D/g, "").slice(0, 8)) })),
      h("div", { className: "admin-editor-actions" },
        h("button", { className: "btn", type: "button", onClick: verifyRegistration, disabled: busy }, busy ? "Verifying…" : "Verify registration"),
        h("button", { className: "btn alt", type: "button", onClick: resendRegistrationOtp, disabled: busy }, "Resend OTP")
      )
    ),
    h("div", { className: "admin-editor-actions" }, h("button", { className: "btn", type: "submit", disabled: busy || Boolean(pendingRegistration) }, busy ? "Submitting…" : "Submit registration"), h("button", { className: "btn alt", type: "button", onClick: onBack, disabled: busy }, "Back to login")),
    submittedCopy && h("button", { className: "btn alt", type: "button", onClick: downloadCopy }, "Download form copy"),
    status && h("p", { className: "login-status", "aria-live": "polite" }, status)
  );
}

function AccountPage({ cms = {}, session: appSession }) {
  const [user, setUser] = useState(appSession?.user || null);
  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!supabase) {
        setStatus("Supabase is not configured.");
        return;
      }
      let currentUser = user;
      if (!currentUser) {
        const { data: sessionData } = await supabase.auth.getSession();
        currentUser = sessionData.session?.user || null;
        if (currentUser && mounted) setUser(currentUser);
      }
      if (!currentUser) {
        if (mounted) setStatus("Please sign in to view your account.");
        return;
      }
      const [{ data: profileData, error: profileError }, { data: applicationData, error: applicationError }] = await Promise.all([
        supabase.from("profiles").select("email, full_name, category, status, phone, whatsapp, affiliation, address, created_at").eq("id", currentUser.id).maybeSingle(),
        supabase.from("membership_applications").select("id, category, status, created_at, admin_note").eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(1).maybeSingle()
      ]);
      if (!mounted) return;
      if (profileError) {
        setStatus(profileError.message);
        return;
      }
      if (applicationError) {
        setStatus(applicationError.message);
        return;
      }
      setProfile(profileData);
      setApplication(applicationData);
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    window.location.hash = "#/membership";
  };

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // no-op
    });
    return () => subscription.unsubscribe();
  }, []);

  const dashboardByCategory = {
    Student: {
      eyebrow: "Student dashboard",
      title: "Your learning space",
      intro: "Access student support, scholarships, coaching and application information from one place.",
      cards: [
        ["Learning support", "Explore coaching, mock tests and study resources.", "#/services"],
        ["Scholarships", "Review the latest education opportunities and announcements.", "#/notifications"],
        application ? ["Your registration", `Registration ${application.status}.`, "#/membership"] : ["Your registration", "Registration linked to your account.", "#/membership"]
      ]
    },
    Faculty: {
      eyebrow: "Faculty dashboard",
      title: "Your academic workspace",
      intro: "Keep track of faculty programmes, research guidance and SMSR opportunities.",
      cards: [
        ["Faculty programmes", "Explore faculty development and training services.", "#/services"],
        ["Research updates", "Read the latest SMSR announcements and academic opportunities.", "#/notifications"],
        application ? ["Your registration", `Registration ${application.status}.`, "#/membership"] : ["Your registration", "Registration linked to your account.", "#/membership"]
      ]
    },
    Member: {
      eyebrow: "Member dashboard",
      title: "Your SMSR membership",
      intro: "View your profile, membership registration and the latest SMSR community information.",
      cards: [
        application ? ["Membership", `Registration ${application.status}.`, "#/membership"] : ["Membership", "Registration linked to your account.", "#/membership"],
        ["Community news", "See the latest SMSR news, notices and opportunities.", "#/notifications"],
        ["Services", "Browse the services and programmes available to members.", "#/services"]
      ]
    }
  };
  const isAdmin = isSuperAdminEmail(user?.email) || profile?.role === "admin";
  const dashboard = dashboardByCategory[profile?.category] || dashboardByCategory.Member;
  const dashboardSlug = `${(profile?.category || "Member").toLowerCase()}-dashboard`;
  const configuredCards = cms.pageSections?.filter(section => section.page_slug === dashboardSlug) || [];
  let dashboardCards = configuredCards.length
    ? configuredCards.map(section => [section.title || "SMSR information", section.body || "", section.link_url || "#/services"])
    : (application ? dashboard.cards : dashboard.cards.filter(card => !(card[0] && card[0].toLowerCase().includes("registration") && card[1] && card[1].toLowerCase().includes("complete"))));
  if (isAdmin) {
    dashboardCards = [
      ["Admin Editor", "Edit all 8 site pages, texts, pictures, and menu options.", "#/admin"],
      ...dashboardCards
    ];
  }
  const isRevoked = profile?.status === "revoked" || profile?.status === "deleted";

  if (!user) {
    return h("div", { className: "page-view account-page" },
      h(PageIntro, { eyebrow: "Account", title: "Your account" }, status || "Loading your account…"),
      status && h("div", { className: "wrap account-actions" }, h("a", { className: "btn", href: "#/membership" }, "Go to login"))
    );
  }
  if (isRevoked) {
    return h("div", { className: "page-view account-page" },
      h(PageIntro, { eyebrow: "Account access", title: "Access unavailable" }, "Your account access has been revoked. Please contact SMSR administration for assistance."),
      h("div", { className: "wrap account-actions" }, h("button", { className: "btn", type: "button", onClick: signOut }, "Sign out"))
    );
  }
  return h("div", { className: "page-view account-page" },
    isAdmin && h("div", { className: "wrap", style: { margin: "20px auto 10px" } },
      h("div", {
        style: {
          background: "linear-gradient(135deg, #0d1b3e 0%, #1a3fb0 100%)",
          color: "#fff",
          padding: "20px 24px",
          borderRadius: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "0 10px 25px rgba(13,27,62,.2)"
        }
      },
        h("div", null,
          h("p", { className: "eyebrow", style: { color: "#93c5fd", margin: "0 0 4px" } }, "🛡️ Super Administrator"),
          h("h3", { style: { color: "#fff", margin: "0 0 4px", fontSize: "1.3rem" } }, "Website Content & Page Editor"),
          h("p", { style: { color: "#cbd5e1", margin: 0, fontSize: "0.88rem" } }, "Edit Home, About, Services, Notifications, Reviews, Gallery, Donate & Contact.")
        ),
        h("a", { className: "btn", href: "#/admin", style: { background: "#fff", color: "#0d1b3e", fontWeight: "700" } }, "Open Admin Editor →")
      )
    ),
    h(PageIntro, { eyebrow: dashboard.eyebrow, title: profile?.full_name ? `${dashboard.title}, ${profile.full_name}` : dashboard.title }, dashboard.intro),
    h("section", { className: "page-section dashboard-cards" }, h("div", { className: "wrap" },
      h("div", { className: "dashboard-card-grid" }, dashboardCards.map(card =>
        h("a", { className: "dashboard-card", href: card[2], key: card[0] },
          h("p", { className: "eyebrow" }, card[0]),
          h("p", null, card[1]),
          h("span", null, "Open →")
        )
      ))
    )),
    h("section", { className: "page-section" }, h("div", { className: "wrap account-layout" },
      h("article", { className: "account-card" },
        h("p", { className: "eyebrow" }, "Account details"),
        h("dl", null,
          h("dt", null, "Email"), h("dd", null, profile?.email || user.email || "Not available"),
          h("dt", null, "User ID"), h("dd", null, user.id),
          h("dt", null, "Category"), h("dd", null, profile?.category || "Member"),
          isAdmin && h(React.Fragment, null, h("dt", null, "Role"), h("dd", { style: { color: "var(--accent)", fontWeight: "600" } }, "Super Administrator")),
          h("dt", null, "Access status"), h("dd", null, profile?.status || "active")
        )
      ),
      h("article", { className: "account-card" },
        h("p", { className: "eyebrow" }, "Registration"),
        application ? h(React.Fragment, null,
          h("p", null, `Registration ID: ${application.id}`),
          h("p", null, `Category: ${application.category}`),
          h("p", null, `Status: ${application.status}`),
          application.admin_note && h("p", null, application.admin_note)
        ) : h("p", null, "No membership registration is linked to this account."),
        h("div", { style: { display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" } },
          isAdmin && h("a", { className: "btn", href: "#/admin" }, "Admin Editor"),
          h("button", { className: "btn alt", type: "button", onClick: signOut }, "Sign out")
        )
      )
    ))
  );
}

function PolicyPage({ content, sections, fallbackTitle, fallbackBody }) {
  const commitment = sections?.find(section => section.section_key === "commitment") || (sections === undefined ? {
    title: "Our commitment",
    body: "We aim to communicate clearly, handle information responsibly and provide educational services with care. Please contact the SMSR office if you need clarification about a policy.",
    secondary_body: "These local pages are being prepared from the public information supplied by Knowledge Review and will be updated as the organisation provides final policy wording."
  } : null);
  return h("div", { className: "page-view" },
    h(PageIntro, { eyebrow: content?.eyebrow || "SMSR policy", title: content?.title || fallbackTitle }, content?.body || fallbackBody),
    commitment && h("section", { className: "page-section" }, h("div", { className: "wrap policy-copy" },
      h("h2", null, commitment.title),
      h("p", null, commitment.body),
      h("p", null, commitment.secondary_body)
    )),
    h(AdditionalSections, { sections, excluded: ["commitment"] })
  );
}

export default function LocalPage({ page, cms = {}, session }) {
  const pageSections = cms.pageSections;
  const sectionsFor = slug => pageSections?.filter(section => section.page_slug === slug);
  if (page.startsWith("service/")) {
    const slug = page.slice("service/".length);
    return h(ServicePage, {
      slug,
      content: cms.services?.find(service => service.slug === slug),
      sections: sectionsFor(slug),
      cmsAvailable: Array.isArray(cms.services),
      session
    });
  }
  if (page === "about") return h(AboutPage, { content: cms.pages?.find(pageItem => pageItem.slug === "about"), sections: sectionsFor("about") });
  if (page === "services") return h("div", { className: "page-view section-page service-page" }, h(ServicesSection, { items: cms.services, section: sectionsFor("services")?.find(item => item.section_key === "services-intro") || sectionsFor("home")?.find(item => item.section_key === "services-intro") }), h(AdditionalSections, { sections: sectionsFor("services"), excluded: ["services-intro"] }));
  if (page === "notifications") return h(NotificationsPage, { items: cms.notifications, content: cms.pages?.find(pageItem => pageItem.slug === "notifications"), sections: sectionsFor("notifications") });
  if (page === "reviews") return h("div", { className: "page-view section-page" }, h(ReviewsSection, { items: cms.reviews, section: sectionsFor("reviews")?.find(item => item.section_key === "reviews-intro") || sectionsFor("home")?.find(item => item.section_key === "reviews-intro") }), h(AdditionalSections, { sections: sectionsFor("reviews"), excluded: ["reviews-intro"] }));
  if (page === "gallery") return h("div", { className: "page-view section-page" }, h(GallerySection, { items: cms.gallery, section: sectionsFor("gallery")?.find(item => item.section_key === "gallery-intro") || sectionsFor("home")?.find(item => item.section_key === "gallery-intro") }), h(AdditionalSections, { sections: sectionsFor("gallery"), excluded: ["gallery-intro"] }));
  if (page === "membership") return h(LoginPage, { session });
  if (page === "account" || page === "dashboard") return h(AccountPage, { cms, session });
  if (page === "donate") return h(DonatePage, { content: cms.pages?.find(pageItem => pageItem.slug === "donate"), sections: sectionsFor("donate") });
  if (page === "contact") return h(ContactPage, { content: cms.pages?.find(pageItem => pageItem.slug === "contact"), sections: sectionsFor("contact") });
  if (page === "terms") return h(PolicyPage, { content: cms.pages?.find(pageItem => pageItem.slug === "terms"), sections: sectionsFor("terms"), fallbackTitle: "Terms & conditions", fallbackBody: "Please review the terms that apply to SMSR programmes and services." });
  if (page === "privacy") return h(PolicyPage, { content: cms.pages?.find(pageItem => pageItem.slug === "privacy"), sections: sectionsFor("privacy"), fallbackTitle: "Privacy policy", fallbackBody: "We respect the information shared by students, educators, members and supporters." });
  if (page === "refund") return h(PolicyPage, { content: cms.pages?.find(pageItem => pageItem.slug === "refund"), sections: sectionsFor("refund"), fallbackTitle: "Refund policy", fallbackBody: "Please review refund expectations before choosing a paid service or making a contribution." });
  return null;
}
