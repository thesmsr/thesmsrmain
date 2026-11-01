import React, { useEffect, useState } from "react";
import { supabase, isSuperAdminEmail } from "../lib/supabase";
import { getAuthErrorMessage, verifyEmailOtp } from "../lib/authMessages";

const h = React.createElement;

const collections = {
  site_content: {
    label: "Pages",
    key: "slug",
    required: ["slug"],
    fields: [["slug", "Slug", "text"], ["title", "Title", "text"], ["eyebrow", "Eyebrow", "text"], ["body", "Content", "textarea"], ["active", "Published", "checkbox"]]
  },
  services: {
    label: "Services",
    key: "slug",
    order: "sort_order",
    required: ["slug", "title"],
    fields: [["slug", "Slug", "text"], ["title", "Title", "text"], ["summary", "Summary", "textarea"], ["body", "Full content", "textarea"], ["image_url", "Image URL", "text"], ["sort_order", "Order", "number"], ["active", "Published", "checkbox"]]
  },
  gallery_items: {
    label: "Gallery",
    key: "id",
    order: "sort_order",
    required: ["title"],
    fields: [["title", "Title", "text"], ["description", "Description", "textarea"], ["image_url", "Image URL", "text"], ["sort_order", "Order", "number"], ["active", "Published", "checkbox"]]
  },
  reviews: {
    label: "Reviews / Person Feedback",
    key: "id",
    order: "sort_order",
    required: ["name"],
    fields: [["name", "Name", "text"], ["role", "Role", "text"], ["organization", "Organization", "text"], ["service", "Service", "text"], ["quote", "Review/Feedback", "textarea"], ["photo_url", "Photo URL", "text"], ["sort_order", "Order", "number"], ["active", "Published", "checkbox"]]
  },
  notifications: {
    label: "News / Notifications",
    key: "id",
    required: ["title"],
    fields: [["title", "Title", "text"], ["body", "Notification/News", "textarea"], ["published_at", "Published at", "datetime-local"], ["active", "Published", "checkbox"]]
  },
  page_sections: {
    label: "All Pages & Sections",
    key: "id",
    order: "sort_order",
    required: ["page_slug", "section_key"],
    fields: [["page_slug", "Page slug", "text"], ["section_key", "Section key", "text"], ["eyebrow", "Eyebrow", "text"], ["title", "Title", "text"], ["body", "Content", "textarea"], ["secondary_body", "Additional content", "textarea"], ["image_url", "Image URL", "text"], ["link_label", "Link label", "text"], ["link_url", "Link URL", "text"], ["sort_order", "Order", "number"], ["active", "Published", "checkbox"]]
  },
  site_settings: {
    label: "Site Settings / Texts",
    key: "key",
    required: ["key"],
    fields: [["key", "Key", "text"], ["label", "Label", "text"], ["value", "Value", "textarea"], ["active", "Published", "checkbox"]]
  },
  menu_items: {
    label: "Header Menu (All Options)",
    key: "id",
    order: "sort_order",
    required: ["label", "href"],
    fields: [["label", "Label", "text"], ["href", "Link/Href", "text"], ["sort_order", "Order", "number"], ["active", "Active", "checkbox"], ["visible_when_logged_in", "Visible when logged in", "checkbox"], ["visible_when_logged_out", "Visible when logged out", "checkbox"]]
  },
  membership_plans: {
    label: "Membership Plans & Duration",
    key: "id",
    order: "sort_order",
    required: ["name"],
    fields: [["name", "Plan Name", "text"], ["duration_months", "Duration (Months)", "number"], ["price", "Price", "number"], ["sort_order", "Order", "number"], ["active", "Active", "checkbox"]]
  },
  feedback: {
    label: "Feedback",
    key: "id",
    required: ["message"],
    fields: [["name", "Name", "text"], ["email", "Email", "email"], ["phone", "Phone", "text"], ["subject", "Subject", "text"], ["message", "Message", "textarea"], ["status", "Status", "text"], ["admin_note", "Admin Note", "textarea"]]
  },
  comments: {
    label: "Comments",
    key: "id",
    required: ["message"],
    fields: [["post_type", "Post Type", "text"], ["post_slug", "Post/Page Slug", "text"], ["name", "Name", "text"], ["email", "Email", "email"], ["message", "Comment", "textarea"], ["status", "Status", "text"]]
  }
};

const blank = definition => definition.fields.reduce((record, field) => {
  record[field[0]] = field[2] === "checkbox" ? true : field[2] === "number" ? 0 : "";
  return record;
}, {});

const toDateTimeInput = value => value ? String(value).slice(0, 16) : "";

function AdminLogin({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const signInWithGoogle = async () => {
    if (!supabase) return setStatus("Supabase is not configured.");
    setBusy(true);
    localStorage.setItem("smsr_auth_target", "admin");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${window.location.pathname}?auth_target=admin` }
    });
    if (error) {
      setStatus(error.message);
      setBusy(false);
    }
  };
  const send = async () => {
    if (!supabase) return setStatus("Supabase is not configured.");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setStatus("Please enter your admin email address.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail, options: { shouldCreateUser: true } });
    setStatus(error ? getAuthErrorMessage(error) : "A fresh verification code was sent to your email. Check your Inbox (and Spam/Junk folder). Enter the code below.");
    if (!error) setSent(true);
    setBusy(false);
  };
  const verify = async event => {
    event.preventDefault();
    if (!supabase) return setStatus("Supabase is not configured.");
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    if (!cleanEmail) return setStatus("Please enter your admin email address.");
    if (!cleanOtp) return setStatus("Please enter the verification code received by email.");
    setBusy(true);
    const { data, error } = await verifyEmailOtp(supabase, cleanEmail, cleanOtp);
    if (error) {
      setStatus(getAuthErrorMessage(error));
      setBusy(false);
      return;
    }
    onAuthenticated(data.session);
  };
  return h("div", { className: "admin-login" },
    h("div", { className: "admin-login-card" }, h("p", { className: "eyebrow" }, "SMSR administration"), h("h1", null, "Admin access"),
      h("p", null, "Sign in with an approved administrator email to manage every editable site record."),
      h("button", { className: "btn", type: "button", onClick: signInWithGoogle, disabled: busy }, busy ? "Opening Google…" : "Continue with Google"),
      h("p", { className: "admin-divider" }, "or use an approved email OTP"),
      h("label", null, "Admin email", h("input", { type: "email", required: true, value: email, placeholder: "admin@example.com", onChange: event => setEmail(event.target.value) })),
      h("button", { className: "btn alt", type: "button", onClick: send, disabled: busy }, busy ? "Sending…" : sent ? "Resend OTP" : "Send admin OTP"),
      h("form", { onSubmit: verify },
        h("label", null, "Verification code", h("input", { type: "text", required: true, value: otp, inputMode: "numeric", autoComplete: "one-time-code", maxLength: 10, placeholder: "Enter code from email", onChange: event => setOtp(event.target.value.replace(/\D/g, "").slice(0, 10)) })),
        h("button", { className: "btn", type: "submit" }, "Verify admin access")
      ),
      status && h("p", { className: "admin-status", "aria-live": "polite" }, status)
    )
  );
}

function AdminCollection({ table, definition, user }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(() => blank(definition));
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const load = async () => {
    const { data, error } = await supabase.from(table).select("*").order(definition.order || (definition.key === "id" ? "created_at" : definition.key), { ascending: true });
    if (error) setStatus(error.message); else setRows(data || []);
  };
  useEffect(() => { load(); }, [table]);
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const uploadImage = async (field, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${table}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      setStatus(`Image upload failed: ${error.message}`);
    } else {
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      update(field, data.publicUrl);
      setStatus("Image uploaded. Save changes to publish it.");
    }
    setUploading(false);
    event.target.value = "";
  };
  const renderField = field => {
    if (field[2] === "checkbox") {
      return h("label", { className: "admin-check", key: field[0] }, h("input", { type: "checkbox", checked: Boolean(form[field[0]]), onChange: event => update(field[0], event.target.checked) }), field[1]);
    }
    if (field[0] === "status" && (table === "feedback" || table === "comments")) {
      const options = table === "feedback" ? ["new", "read", "replied", "archived"] : ["pending", "approved", "rejected"];
      return h("label", { key: field[0] }, field[1], h("select", { value: form[field[0]] || options[0], onChange: event => update(field[0], event.target.value) }, options.map(v => h("option", { key: v, value: v }, v))));
    }
    const input = field[2] === "textarea"
      ? h("textarea", { value: form[field[0]] || "", onChange: event => update(field[0], event.target.value) })
      : h("input", { type: field[2], value: form[field[0]] || "", required: definition.required?.includes(field[0]), onChange: event => update(field[0], field[2] === "number" ? Number(event.target.value) : event.target.value) });
    return h("label", { key: field[0] }, field[1], input,
      (field[0] === "image_url" || field[0] === "photo_url") && h("span", { className: "admin-upload" },
        h("input", { type: "file", accept: "image/*", disabled: uploading, onChange: event => uploadImage(field[0], event) }),
        uploading && "Uploading…"
      ));
  };
  const edit = row => {
    setEditing(row[definition.key]);
    setForm(Object.fromEntries(definition.fields.map(field => [field[0], field[2] === "datetime-local" ? toDateTimeInput(row[field[0]]) : row[field[0]] ?? (field[2] === "checkbox" ? false : "")])));
    setStatus("");
  };
  const reset = () => { setEditing(null); setForm(blank(definition)); };
  const save = async event => {
    event.preventDefault();
    setStatus("");
    const payload = { ...form };
    if (definition.key === "id") {
      if (editing) payload.id = editing;
      else delete payload.id;
    }
    if (payload.published_at) payload.published_at = new Date(payload.published_at).toISOString();
    else if (Object.prototype.hasOwnProperty.call(payload, "published_at")) delete payload.published_at;
    const { error } = await supabase.from(table).upsert(payload);
    if (error) return setStatus(error.message);
    setStatus("Saved."); reset(); load();
  };
  const remove = async key => {
    if (!window.confirm("Delete this record?")) return;
    const { error } = await supabase.from(table).delete().eq(definition.key, key);
    if (error) setStatus(error.message); else { setStatus("Deleted."); load(); }
  };
  return h("div", { className: "admin-collection" },
    h("div", { className: "admin-collection-list" }, h("div", { className: "admin-collection-heading" }, h("h2", null, definition.label), h("button", { className: "btn alt", type: "button", onClick: reset }, "New")),
      rows.map(row => h("div", { className: "admin-record", key: row[definition.key] }, h("div", null, h("b", null, row.title || row.name || row.slug || "Untitled"), h("small", null, row.active === false ? "Draft" : "Published")), h("div", { className: "admin-record-actions" }, h("button", { type: "button", onClick: () => edit(row) }, "Edit"), h("button", { type: "button", onClick: () => remove(row[definition.key]) }, "Delete"))))),
    h("form", { className: "admin-editor", onSubmit: save }, h("p", { className: "eyebrow" }, editing ? "Edit record" : "New record"), definition.fields.map(renderField), h("div", { className: "admin-editor-actions" }, h("button", { className: "btn", type: "submit" }, "Save changes"), editing && h("button", { className: "btn alt", type: "button", onClick: reset }, "Cancel")), status && h("p", { className: "admin-status" }, status))
  );
}

// Media upload helper
async function uploadMediaFile(file, folder = "uploads") {
  if (!file) return "";
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return data.publicUrl;
}

// Page & Section Manager (Home, About, Donate, Contact)
function AdminPageManager({ pageSlug, pageTitle, isContact }) {
  const [header, setHeader] = useState({ title: "", eyebrow: "", body: "", image_url: "" });
  const [sections, setSections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ section_key: "", eyebrow: "", title: "", body: "", secondary_body: "", image_url: "", link_label: "", link_url: "", sort_order: 0, active: true });
  const [uploading, setUploading] = useState(false);
  const [headerStatus, setHeaderStatus] = useState("");
  const [sectionStatus, setSectionStatus] = useState("");

  const load = async () => {
    const { data: pageData } = await supabase.from("site_content").select("*").eq("slug", pageSlug).maybeSingle();
    if (pageData) {
      setHeader({ title: pageData.title || "", eyebrow: pageData.eyebrow || "", body: pageData.body || "", image_url: pageData.image_url || "" });
    }
    const { data: secData } = await supabase.from("page_sections").select("*").eq("page_slug", pageSlug).order("sort_order");
    setSections(secData || []);
  };

  useEffect(() => { load(); }, [pageSlug]);

  const handleHeaderUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setHeaderStatus("Uploading picture...");
    try {
      const url = await uploadMediaFile(file, pageSlug);
      setHeader(h => ({ ...h, image_url: url }));
      setHeaderStatus("Picture uploaded! Click 'Save Header' below to apply.");
    } catch (err) {
      setHeaderStatus(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleSectionUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSectionStatus("Uploading picture...");
    try {
      const url = await uploadMediaFile(file, pageSlug);
      setForm(f => ({ ...f, image_url: url }));
      setSectionStatus("Picture uploaded!");
    } catch (err) {
      setSectionStatus(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const saveHeader = async (e) => {
    e.preventDefault();
    setHeaderStatus("Saving...");
    const { error } = await supabase.from("site_content").upsert({
      slug: pageSlug,
      title: header.title,
      eyebrow: header.eyebrow,
      body: header.body,
      image_url: header.image_url,
      active: true,
      updated_at: new Date().toISOString()
    });
    if (error) setHeaderStatus(`Error: ${error.message}`);
    else {
      setHeaderStatus("Page header saved successfully!");
      setTimeout(() => setHeaderStatus(""), 3000);
    }
  };

  const editSection = (sec) => {
    setEditingId(sec.id || sec.section_key);
    setIsAdding(true);
    setForm({
      id: sec.id,
      section_key: sec.section_key || "",
      eyebrow: sec.eyebrow || "",
      title: sec.title || "",
      body: sec.body || "",
      secondary_body: sec.secondary_body || "",
      image_url: sec.image_url || "",
      link_label: sec.link_label || "",
      link_url: sec.link_url || "",
      sort_order: sec.sort_order ?? 0,
      active: sec.active !== false
    });
    setSectionStatus("");
  };

  const startNew = () => {
    setEditingId(null);
    setIsAdding(true);
    setForm({
      section_key: `${pageSlug}-${Date.now().toString(36)}`,
      eyebrow: "",
      title: "",
      body: "",
      secondary_body: "",
      image_url: "",
      link_label: "",
      link_url: "",
      sort_order: sections.length + 1,
      active: true
    });
    setSectionStatus("");
  };

  const saveSection = async (e) => {
    e.preventDefault();
    setSectionStatus("Saving section...");
    const payload = {
      page_slug: pageSlug,
      section_key: form.section_key || `${pageSlug}-${Date.now().toString(36)}`,
      eyebrow: form.eyebrow || "",
      title: form.title || "",
      body: form.body || "",
      secondary_body: form.secondary_body || "",
      image_url: form.image_url || "",
      link_label: form.link_label || "",
      link_url: form.link_url || "",
      sort_order: Number(form.sort_order) || 0,
      active: Boolean(form.active),
      updated_at: new Date().toISOString()
    };
    if (form.id) payload.id = form.id;
    const { error } = await supabase.from("page_sections").upsert(payload);
    if (error) setSectionStatus(`Error: ${error.message}`);
    else {
      setSectionStatus("Section saved successfully!");
      setIsAdding(false);
      setEditingId(null);
      load();
    }
  };

  const deleteSection = async (sec) => {
    if (!window.confirm(`Delete section "${sec.title || sec.section_key}"?`)) return;
    const { error } = sec.id
      ? await supabase.from("page_sections").delete().eq("id", sec.id)
      : await supabase.from("page_sections").delete().eq("page_slug", pageSlug).eq("section_key", sec.section_key);
    if (error) alert(`Error: ${error.message}`);
    else load();
  };

  return h("div", null,
    // Page Header Card
    h("form", { className: "admin-card-box", onSubmit: saveHeader },
      h("p", { className: "eyebrow" }, "Page Intro & Header"),
      h("h2", null, pageTitle),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Eyebrow tag", h("input", { type: "text", value: header.eyebrow, placeholder: "e.g. A public charitable trust", onChange: e => setHeader({ ...header, eyebrow: e.target.value }) })),
        h("label", null, "Main Heading / Title", h("input", { type: "text", required: true, value: header.title, placeholder: "Main heading", onChange: e => setHeader({ ...header, title: e.target.value }) })),
        h("label", null, "Introductory text", h("textarea", { value: header.body, rows: 3, placeholder: "Description", onChange: e => setHeader({ ...header, body: e.target.value }) })),
        h("div", null,
          h("label", null, "Banner / Picture URL", h("input", { type: "text", value: header.image_url, placeholder: "https://... or upload below", onChange: e => setHeader({ ...header, image_url: e.target.value }) })),
          h("div", { className: "admin-upload-row" },
            h("input", { type: "file", accept: "image/*", disabled: uploading, onChange: handleHeaderUpload }),
            header.image_url && h("img", { src: header.image_url, className: "admin-img-preview-mini", alt: "Preview" })
          )
        )
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "16px" } },
        h("button", { className: "btn", type: "submit" }, "Save Header"),
        headerStatus && h("span", { className: "admin-status" }, headerStatus)
      )
    ),

    // Sections List Card
    h("div", { className: "admin-card-box" },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
        h("div", null,
          h("p", { className: "eyebrow" }, "Custom & Built-in"),
          h("h2", { style: { margin: 0 } }, `${pageTitle} Sections (${sections.length})`)
        ),
        h("button", { className: "btn", type: "button", onClick: startNew }, "+ Add New Section")
      ),
      h("div", { className: "admin-grid-cards" }, sections.map(sec =>
        h("div", { className: "admin-item-card", key: sec.id || sec.section_key },
          h("div", null,
            sec.image_url && h("img", { src: sec.image_url, className: "admin-item-thumb", alt: sec.title || "" }),
            sec.eyebrow && h("span", { className: "eyebrow" }, sec.eyebrow),
            h("h3", { style: { margin: "4px 0 6px" } }, sec.title || sec.section_key),
            sec.body && h("p", { style: { fontSize: "0.88rem", color: "var(--muted)", margin: "0 0 8px" } }, sec.body.slice(0, 100) + (sec.body.length > 100 ? "..." : "")),
            sec.link_label && h("span", { className: "admin-status-pill approved", style: { fontSize: "0.75rem" } }, `Button: ${sec.link_label}`),
            h("div", { className: "admin-item-meta" },
              h("span", { className: "admin-status-pill " + (sec.active !== false ? "active" : "rejected") }, sec.active !== false ? "Active" : "Hidden"),
              h("span", { style: { fontSize: "0.78rem", color: "var(--muted)" } }, `Order: ${sec.sort_order ?? 0}`)
            )
          ),
          h("div", { className: "admin-record-actions", style: { marginTop: "12px" } },
            h("button", { type: "button", onClick: () => editSection(sec) }, "Edit"),
            h("button", { type: "button", onClick: () => deleteSection(sec) }, "Delete")
          )
        )
      ))
    ),

    // Add / Edit Section Form
    isAdding && h("form", { className: "admin-card-box", onSubmit: saveSection, style: { border: "2px solid var(--accent)" } },
      h("p", { className: "eyebrow" }, editingId ? "Edit Section" : "New Section"),
      h("h2", null, editingId ? "Edit Section Details" : `Add Section to ${pageTitle}`),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
          h("label", null, "Section Key (Unique code)", h("input", { type: "text", required: true, value: form.section_key, placeholder: "e.g. history, mission, custom-1", onChange: e => setForm({ ...form, section_key: e.target.value }) })),
          h("label", null, "Eyebrow tag", h("input", { type: "text", value: form.eyebrow, placeholder: "e.g. Overview", onChange: e => setForm({ ...form, eyebrow: e.target.value }) }))
        ),
        h("label", null, "Section Title / Heading", h("input", { type: "text", value: form.title, placeholder: "Section title", onChange: e => setForm({ ...form, title: e.target.value }) })),
        h("label", null, "Main Content / Text", h("textarea", { rows: 3, value: form.body, placeholder: "Primary paragraph", onChange: e => setForm({ ...form, body: e.target.value }) })),
        h("label", null, "Additional / Secondary Content", h("textarea", { rows: 2, value: form.secondary_body, placeholder: "Extra details or paragraph 2", onChange: e => setForm({ ...form, secondary_body: e.target.value }) })),
        h("div", null,
          h("label", null, "Picture / Image URL", h("input", { type: "text", value: form.image_url, placeholder: "https://... or upload below", onChange: e => setForm({ ...form, image_url: e.target.value }) })),
          h("div", { className: "admin-upload-row" },
            h("input", { type: "file", accept: "image/*", disabled: uploading, onChange: handleSectionUpload }),
            form.image_url && h("img", { src: form.image_url, className: "admin-img-preview-mini", alt: "Preview" })
          )
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
          h("label", null, "Button Text (Optional)", h("input", { type: "text", value: form.link_label, placeholder: "e.g. Learn more", onChange: e => setForm({ ...form, link_label: e.target.value }) })),
          h("label", null, "Button Link (URL / #hash)", h("input", { type: "text", value: form.link_url, placeholder: "e.g. #/services", onChange: e => setForm({ ...form, link_url: e.target.value }) }))
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" } },
          h("label", null, "Display Order", h("input", { type: "number", value: form.sort_order, onChange: e => setForm({ ...form, sort_order: e.target.value }) })),
          h("label", { className: "admin-check", style: { marginTop: "24px" } },
            h("input", { type: "checkbox", checked: form.active, onChange: e => setForm({ ...form, active: e.target.checked }) }),
            "Published / Visible on page"
          )
        )
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "18px" } },
        h("button", { className: "btn", type: "submit" }, editingId ? "Update Section" : "Save Section"),
        h("button", { className: "btn alt", type: "button", onClick: () => { setIsAdding(false); setEditingId(null); } }, "Cancel"),
        sectionStatus && h("span", { className: "admin-status" }, sectionStatus)
      )
    )
  );
}

// Services Manager
function AdminServicesManager() {
  const [servicesList, setServicesList] = useState([]);
  const [editingSlug, setEditingSlug] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ slug: "", title: "", summary: "", body: "", image_url: "", sort_order: 0, active: true });
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [intro, setIntro] = useState({ eyebrow: "", title: "", body: "" });
  const [introStatus, setIntroStatus] = useState("");

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServicesList(data || []);
  };

  const loadIntro = async () => {
    const { data } = await supabase.from("page_sections").select("*").eq("section_key", "services-intro").limit(1).maybeSingle();
    if (data) {
      setIntro({ eyebrow: data.eyebrow || "", title: data.title || "", body: data.body || "" });
    }
  };

  useEffect(() => {
    load();
    loadIntro();
  }, []);

  const saveIntro = async (e) => {
    e.preventDefault();
    setIntroStatus("Saving services header...");
    const payloadHome = {
      page_slug: "home",
      section_key: "services-intro",
      eyebrow: intro.eyebrow,
      title: intro.title,
      body: intro.body,
      active: true,
      updated_at: new Date().toISOString()
    };
    const payloadServices = {
      page_slug: "services",
      section_key: "services-intro",
      eyebrow: intro.eyebrow,
      title: intro.title,
      body: intro.body,
      active: true,
      updated_at: new Date().toISOString()
    };
    const { error: e1 } = await supabase.from("page_sections").upsert(payloadHome);
    const { error: e2 } = await supabase.from("page_sections").upsert(payloadServices);
    if (e1 || e2) setIntroStatus(`Error: ${(e1 || e2).message}`);
    else {
      setIntroStatus("Services header saved successfully!");
      setTimeout(() => setIntroStatus(""), 3000);
    }
  };

  const uploadServiceImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("Uploading service picture/icon...");
    try {
      const url = await uploadMediaFile(file, "services");
      setForm(f => ({ ...f, image_url: url }));
      setStatus("Picture uploaded!");
    } catch (err) {
      setStatus(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const startNew = () => {
    setEditingSlug(null);
    setIsAdding(true);
    setForm({ slug: "", title: "", summary: "", body: "", image_url: "", sort_order: servicesList.length + 1, active: true });
    setStatus("");
  };

  const editService = (item) => {
    setEditingSlug(item.slug);
    setIsAdding(true);
    setForm({
      slug: item.slug,
      title: item.title || "",
      summary: item.summary || "",
      body: item.body || "",
      image_url: item.image_url || "",
      sort_order: item.sort_order ?? 0,
      active: item.active !== false
    });
    setStatus("");
  };

  const saveService = async (e) => {
    e.preventDefault();
    setStatus("Saving service...");
    const slug = (form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");
    const { error } = await supabase.from("services").upsert({
      slug,
      title: form.title,
      summary: form.summary || "",
      body: form.body || "",
      image_url: form.image_url || "",
      sort_order: Number(form.sort_order) || 0,
      active: Boolean(form.active),
      updated_at: new Date().toISOString()
    });
    if (error) setStatus(`Error: ${error.message}`);
    else {
      setStatus("Service saved!");
      setIsAdding(false);
      setEditingSlug(null);
      load();
    }
  };

  const deleteService = async (slug, title) => {
    if (!window.confirm(`Delete service "${title}" (${slug})?`)) return;
    const { error } = await supabase.from("services").delete().eq("slug", slug);
    if (error) alert(`Error: ${error.message}`);
    else load();
  };

  return h("div", null,
    // Services Section Header Form
    h("form", { className: "admin-card-box", onSubmit: saveIntro },
      h("p", { className: "eyebrow" }, "Services Section Heading & Introduction"),
      h("h2", null, "Services Heading & Text"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Eyebrow tag", h("input", { type: "text", value: intro.eyebrow, placeholder: "e.g. The society is engaged to render", onChange: e => setIntro({ ...intro, eyebrow: e.target.value }) })),
        h("label", null, "Main Heading / Title", h("input", { type: "text", value: intro.title, placeholder: "e.g. Services", onChange: e => setIntro({ ...intro, title: e.target.value }) })),
        h("label", null, "Introductory description", h("textarea", { rows: 2, value: intro.body, placeholder: "e.g. From publishing your research to preparing for your first job...", onChange: e => setIntro({ ...intro, body: e.target.value }) }))
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "14px" } },
        h("button", { className: "btn", type: "submit" }, "Save Services Header"),
        introStatus && h("span", { className: "admin-status" }, introStatus)
      )
    ),

    h("div", { className: "admin-card-box" },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        h("div", null,
          h("p", { className: "eyebrow" }, "Services Catalog"),
          h("h2", { style: { margin: 0 } }, `Services Management (${servicesList.length})`)
        ),
        h("button", { className: "btn", type: "button", onClick: startNew }, "+ Add New Service")
      )
    ),
    h("div", { className: "admin-grid-cards" }, servicesList.map(item =>
      h("div", { className: "admin-item-card", key: item.slug },
        h("div", null,
          item.image_url && h("img", { src: item.image_url, className: "admin-item-thumb", alt: item.title }),
          h("h3", { style: { margin: "4px 0 6px" } }, item.title),
          h("span", { className: "eyebrow", style: { fontSize: "0.75rem" } }, item.slug),
          item.summary && h("p", { style: { fontSize: "0.85rem", color: "var(--muted)", margin: "6px 0 10px" } }, item.summary),
          h("div", { className: "admin-item-meta" },
            h("span", { className: "admin-status-pill " + (item.active !== false ? "active" : "rejected") }, item.active !== false ? "Published" : "Hidden"),
            h("span", { style: { fontSize: "0.78rem", color: "var(--muted)" } }, `Order: ${item.sort_order ?? 0}`)
          )
        ),
        h("div", { className: "admin-record-actions", style: { marginTop: "12px" } },
          h("button", { type: "button", onClick: () => editService(item) }, "Edit"),
          h("button", { type: "button", onClick: () => deleteService(item.slug, item.title) }, "Delete")
        )
      )
    )),
    isAdding && h("form", { className: "admin-card-box", onSubmit: saveService, style: { border: "2px solid var(--accent)" } },
      h("p", { className: "eyebrow" }, editingSlug ? "Edit Service" : "New Service"),
      h("h2", null, editingSlug ? `Edit "${form.title}"` : "Create New Service"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
          h("label", null, "Service Title", h("input", { type: "text", required: true, value: form.title, placeholder: "e.g. Research Journal", onChange: e => setForm({ ...form, title: e.target.value }) })),
          h("label", null, "URL Slug", h("input", { type: "text", required: true, value: form.slug, placeholder: "e.g. research-journal", readOnly: Boolean(editingSlug), onChange: e => setForm({ ...form, slug: e.target.value }) }))
        ),
        h("label", null, "Short Summary", h("textarea", { rows: 2, required: true, value: form.summary, placeholder: "Short summary shown on service card", onChange: e => setForm({ ...form, summary: e.target.value }) })),
        h("label", null, "Full Detail Page Content", h("textarea", { rows: 4, value: form.body, placeholder: "Detailed description shown on service detail page", onChange: e => setForm({ ...form, body: e.target.value }) })),
        h("div", null,
          h("label", null, "Icon / Picture URL", h("input", { type: "text", value: form.image_url, placeholder: "https://... or upload below", onChange: e => setForm({ ...form, image_url: e.target.value }) })),
          h("div", { className: "admin-upload-row" },
            h("input", { type: "file", accept: "image/*", disabled: uploading, onChange: uploadServiceImage }),
            form.image_url && h("img", { src: form.image_url, className: "admin-img-preview-mini", alt: "Preview" })
          )
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" } },
          h("label", null, "Sort Order", h("input", { type: "number", value: form.sort_order, onChange: e => setForm({ ...form, sort_order: e.target.value }) })),
          h("label", { className: "admin-check", style: { marginTop: "24px" } },
            h("input", { type: "checkbox", checked: form.active, onChange: e => setForm({ ...form, active: e.target.checked }) }),
            "Published / Active"
          )
        )
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "18px" } },
        h("button", { className: "btn", type: "submit" }, editingSlug ? "Update Service" : "Save Service"),
        h("button", { className: "btn alt", type: "button", onClick: () => { setIsAdding(false); setEditingSlug(null); } }, "Cancel"),
        status && h("span", { className: "admin-status" }, status)
      )
    )
  );
}

// Notifications Manager
function AdminNotificationsManager() {
  const [notices, setNotices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", published_at: "", active: true });
  const [status, setStatus] = useState("");
  const [header, setHeader] = useState({ eyebrow: "", title: "", body: "" });
  const [headerStatus, setHeaderStatus] = useState("");

  const load = async () => {
    const { data } = await supabase.from("notifications").select("*").order("published_at", { ascending: false });
    setNotices(data || []);
  };

  const loadHeader = async () => {
    const { data } = await supabase.from("site_content").select("*").eq("slug", "notifications").maybeSingle();
    if (data) {
      setHeader({ eyebrow: data.eyebrow || "", title: data.title || "", body: data.body || "" });
    }
  };

  useEffect(() => {
    load();
    loadHeader();
  }, []);

  const saveHeader = async (e) => {
    e.preventDefault();
    setHeaderStatus("Saving notifications header...");
    const { error } = await supabase.from("site_content").upsert({
      slug: "notifications",
      eyebrow: header.eyebrow,
      title: header.title,
      body: header.body,
      active: true,
      updated_at: new Date().toISOString()
    });
    if (error) setHeaderStatus(`Error: ${error.message}`);
    else {
      setHeaderStatus("Notifications header saved successfully!");
      setTimeout(() => setHeaderStatus(""), 3000);
    }
  };

  const startNew = () => {
    setEditingId(null);
    setIsAdding(true);
    setForm({ title: "", body: "", published_at: new Date().toISOString().slice(0, 16), active: true });
    setStatus("");
  };

  const editNotice = (item) => {
    setEditingId(item.id);
    setIsAdding(true);
    setForm({
      title: item.title || "",
      body: item.body || "",
      published_at: item.published_at ? item.published_at.slice(0, 16) : "",
      active: item.active !== false
    });
    setStatus("");
  };

  const saveNotice = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const payload = {
      title: form.title,
      body: form.body || "",
      published_at: form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
      active: Boolean(form.active),
      updated_at: new Date().toISOString()
    };
    if (editingId) payload.id = editingId;
    const { error } = await supabase.from("notifications").upsert(payload);
    if (error) setStatus(`Error: ${error.message}`);
    else {
      setStatus("Notification saved!");
      setIsAdding(false);
      setEditingId(null);
      load();
    }
  };

  const deleteNotice = async (id, title) => {
    if (!window.confirm(`Delete notification "${title}"?`)) return;
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) alert(`Error: ${error.message}`);
    else load();
  };

  return h("div", null,
    // Notifications Page Header Form
    h("form", { className: "admin-card-box", onSubmit: saveHeader },
      h("p", { className: "eyebrow" }, "Notifications Page Heading & Introduction"),
      h("h2", null, "Notifications Page Text"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Eyebrow tag", h("input", { type: "text", value: header.eyebrow, placeholder: "e.g. Notifications", onChange: e => setHeader({ ...header, eyebrow: e.target.value }) })),
        h("label", null, "Main Heading / Title", h("input", { type: "text", value: header.title, placeholder: "e.g. Updates from the SMSR community", onChange: e => setHeader({ ...header, title: e.target.value }) })),
        h("label", null, "Introductory description", h("textarea", { rows: 2, value: header.body, placeholder: "e.g. Important announcements about programmes, registrations, scholarships...", onChange: e => setHeader({ ...header, body: e.target.value }) }))
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "14px" } },
        h("button", { className: "btn", type: "submit" }, "Save Notifications Header"),
        headerStatus && h("span", { className: "admin-status" }, headerStatus)
      )
    ),

    h("div", { className: "admin-card-box" },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        h("div", null,
          h("p", { className: "eyebrow" }, "News & Updates"),
          h("h2", { style: { margin: 0 } }, `Notifications List (${notices.length})`)
        ),
        h("button", { className: "btn", type: "button", onClick: startNew }, "+ Add Notification")
      )
    ),
    h("div", { className: "admin-grid-cards" }, notices.map(item =>
      h("div", { className: "admin-item-card", key: item.id },
        h("div", null,
          h("h3", { style: { margin: "0 0 6px" } }, item.title),
          h("p", { style: { fontSize: "0.85rem", color: "var(--muted)", margin: "0 0 10px" } }, item.body),
          h("div", { className: "admin-item-meta" },
            h("span", { className: "admin-status-pill " + (item.active !== false ? "active" : "rejected") }, item.active !== false ? "Published" : "Draft"),
            h("span", { style: { fontSize: "0.78rem", color: "var(--muted)" } }, new Date(item.published_at).toLocaleDateString())
          )
        ),
        h("div", { className: "admin-record-actions", style: { marginTop: "12px" } },
          h("button", { type: "button", onClick: () => editNotice(item) }, "Edit"),
          h("button", { type: "button", onClick: () => deleteNotice(item.id, item.title) }, "Delete")
        )
      )
    )),
    isAdding && h("form", { className: "admin-card-box", onSubmit: saveNotice, style: { border: "2px solid var(--accent)" } },
      h("p", { className: "eyebrow" }, editingId ? "Edit Notification" : "New Notification"),
      h("h2", null, editingId ? "Edit Notification" : "Publish New Notification"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Notification Title", h("input", { type: "text", required: true, value: form.title, placeholder: "e.g. Membership registration open", onChange: e => setForm({ ...form, title: e.target.value }) })),
        h("label", null, "Notice Content / Body", h("textarea", { rows: 3, required: true, value: form.body, placeholder: "Details of announcement", onChange: e => setForm({ ...form, body: e.target.value }) })),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" } },
          h("label", null, "Published Date & Time", h("input", { type: "datetime-local", value: form.published_at, onChange: e => setForm({ ...form, published_at: e.target.value }) })),
          h("label", { className: "admin-check", style: { marginTop: "24px" } },
            h("input", { type: "checkbox", checked: form.active, onChange: e => setForm({ ...form, active: e.target.checked }) }),
            "Published / Active"
          )
        )
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "18px" } },
        h("button", { className: "btn", type: "submit" }, editingId ? "Update Notice" : "Publish Notice"),
        h("button", { className: "btn alt", type: "button", onClick: () => { setIsAdding(false); setEditingId(null); } }, "Cancel"),
        status && h("span", { className: "admin-status" }, status)
      )
    )
  );
}

// Reviews Manager
function AdminReviewsManager() {
  const [reviewsList, setReviewsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", organization: "", service: "", quote: "", photo_url: "", sort_order: 0, active: true });
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [intro, setIntro] = useState({ eyebrow: "", title: "", body: "" });
  const [introStatus, setIntroStatus] = useState("");

  const load = async () => {
    const { data } = await supabase.from("reviews").select("*").order("sort_order");
    setReviewsList(data || []);
  };

  const loadIntro = async () => {
    const { data } = await supabase.from("page_sections").select("*").eq("section_key", "reviews-intro").limit(1).maybeSingle();
    if (data) {
      setIntro({ eyebrow: data.eyebrow || "", title: data.title || "", body: data.body || "" });
    }
  };

  useEffect(() => {
    load();
    loadIntro();
  }, []);

  const saveIntro = async (e) => {
    e.preventDefault();
    setIntroStatus("Saving reviews header...");
    const payloadHome = {
      page_slug: "home",
      section_key: "reviews-intro",
      eyebrow: intro.eyebrow,
      title: intro.title,
      body: intro.body,
      active: true,
      updated_at: new Date().toISOString()
    };
    const payloadReviews = {
      page_slug: "reviews",
      section_key: "reviews-intro",
      eyebrow: intro.eyebrow,
      title: intro.title,
      body: intro.body,
      active: true,
      updated_at: new Date().toISOString()
    };
    const { error: e1 } = await supabase.from("page_sections").upsert(payloadHome);
    const { error: e2 } = await supabase.from("page_sections").upsert(payloadReviews);
    if (e1 || e2) setIntroStatus(`Error: ${(e1 || e2).message}`);
    else {
      setIntroStatus("Reviews header saved successfully!");
      setTimeout(() => setIntroStatus(""), 3000);
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("Uploading photo...");
    try {
      const url = await uploadMediaFile(file, "reviews");
      setForm(f => ({ ...f, photo_url: url }));
      setStatus("Photo uploaded!");
    } catch (err) {
      setStatus(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const startNew = () => {
    setEditingId(null);
    setIsAdding(true);
    setForm({ name: "", role: "", organization: "", service: "", quote: "", photo_url: "", sort_order: reviewsList.length + 1, active: true });
    setStatus("");
  };

  const editReview = (item) => {
    setEditingId(item.id);
    setIsAdding(true);
    setForm({
      name: item.name || "",
      role: item.role || "",
      organization: item.organization || "",
      service: item.service || "",
      quote: item.quote || "",
      photo_url: item.photo_url || "",
      sort_order: item.sort_order ?? 0,
      active: item.active !== false
    });
    setStatus("");
  };

  const saveReview = async (e) => {
    e.preventDefault();
    setStatus("Saving review...");
    const payload = {
      name: form.name,
      role: form.role || "",
      organization: form.organization || "",
      service: form.service || "",
      quote: form.quote || "",
      photo_url: form.photo_url || "",
      sort_order: Number(form.sort_order) || 0,
      active: Boolean(form.active),
      updated_at: new Date().toISOString()
    };
    if (editingId) payload.id = editingId;
    const { error } = await supabase.from("reviews").upsert(payload);
    if (error) setStatus(`Error: ${error.message}`);
    else {
      setStatus("Review saved!");
      setIsAdding(false);
      setEditingId(null);
      load();
    }
  };

  const deleteReview = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) alert(`Error: ${error.message}`);
    else load();
  };

  return h("div", null,
    // Reviews Section Header Form
    h("form", { className: "admin-card-box", onSubmit: saveIntro },
      h("p", { className: "eyebrow" }, "Reviews Section Heading & Introduction"),
      h("h2", null, "Reviews Heading & Text"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Eyebrow tag", h("input", { type: "text", value: intro.eyebrow, placeholder: "e.g. Our community", onChange: e => setIntro({ ...intro, eyebrow: e.target.value }) })),
        h("label", null, "Main Heading / Title", h("input", { type: "text", value: intro.title, placeholder: "e.g. People who have worked with us", onChange: e => setIntro({ ...intro, title: e.target.value }) })),
        h("label", null, "Introductory description", h("textarea", { rows: 2, value: intro.body, placeholder: "e.g. Educators and professionals from colleges, universities and companies...", onChange: e => setIntro({ ...intro, body: e.target.value }) }))
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "14px" } },
        h("button", { className: "btn", type: "submit" }, "Save Reviews Header"),
        introStatus && h("span", { className: "admin-status" }, introStatus)
      )
    ),

    h("div", { className: "admin-card-box" },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        h("div", null,
          h("p", { className: "eyebrow" }, "Testimonials & Community"),
          h("h2", { style: { margin: 0 } }, `Reviews (${reviewsList.length})`)
        ),
        h("button", { className: "btn", type: "button", onClick: startNew }, "+ Add New Review")
      )
    ),
    h("div", { className: "admin-grid-cards" }, reviewsList.map(item =>
      h("div", { className: "admin-item-card", key: item.id },
        h("div", null,
          item.photo_url && h("img", { src: item.photo_url, className: "admin-item-thumb", style: { height: "100px", objectFit: "cover" }, alt: item.name }),
          h("h3", { style: { margin: "4px 0 2px" } }, item.name),
          h("p", { style: { fontSize: "0.82rem", color: "var(--muted)", margin: "0 0 6px" } }, `${item.role || ""} · ${item.organization || ""}`),
          h("p", { style: { fontSize: "0.85rem", fontStyle: "italic", margin: "6px 0 10px" } }, `“${(item.quote || "").slice(0, 110)}...”`),
          item.service && h("span", { className: "admin-status-pill approved", style: { fontSize: "0.75rem" } }, item.service),
          h("div", { className: "admin-item-meta" },
            h("span", { className: "admin-status-pill " + (item.active !== false ? "active" : "rejected") }, item.active !== false ? "Active" : "Hidden"),
            h("span", { style: { fontSize: "0.78rem", color: "var(--muted)" } }, `Order: ${item.sort_order ?? 0}`)
          )
        ),
        h("div", { className: "admin-record-actions", style: { marginTop: "12px" } },
          h("button", { type: "button", onClick: () => editReview(item) }, "Edit"),
          h("button", { type: "button", onClick: () => deleteReview(item.id, item.name) }, "Delete")
        )
      )
    )),
    isAdding && h("form", { className: "admin-card-box", onSubmit: saveReview, style: { border: "2px solid var(--accent)" } },
      h("p", { className: "eyebrow" }, editingId ? "Edit Review" : "New Review"),
      h("h2", null, editingId ? `Edit Review from "${form.name}"` : "Add Community Review"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
          h("label", null, "Reviewer Name", h("input", { type: "text", required: true, value: form.name, placeholder: "e.g. Dr. Ayan Shee", onChange: e => setForm({ ...form, name: e.target.value }) })),
          h("label", null, "Role / Title", h("input", { type: "text", value: form.role, placeholder: "e.g. Assistant Professor", onChange: e => setForm({ ...form, role: e.target.value }) }))
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
          h("label", null, "Organization / University", h("input", { type: "text", value: form.organization, placeholder: "e.g. University of Algarve", onChange: e => setForm({ ...form, organization: e.target.value }) })),
          h("label", null, "Service Tag", h("input", { type: "text", value: form.service, placeholder: "e.g. Journal publication", onChange: e => setForm({ ...form, service: e.target.value }) }))
        ),
        h("label", null, "Review / Testimonial Quote", h("textarea", { rows: 3, required: true, value: form.quote, placeholder: "Feedback text", onChange: e => setForm({ ...form, quote: e.target.value }) })),
        h("div", null,
          h("label", null, "Reviewer Photo URL", h("input", { type: "text", value: form.photo_url, placeholder: "https://... or upload below", onChange: e => setForm({ ...form, photo_url: e.target.value }) })),
          h("div", { className: "admin-upload-row" },
            h("input", { type: "file", accept: "image/*", disabled: uploading, onChange: uploadPhoto }),
            form.photo_url && h("img", { src: form.photo_url, className: "admin-img-preview-mini", alt: "Preview" })
          )
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" } },
          h("label", null, "Sort Order", h("input", { type: "number", value: form.sort_order, onChange: e => setForm({ ...form, sort_order: e.target.value }) })),
          h("label", { className: "admin-check", style: { marginTop: "24px" } },
            h("input", { type: "checkbox", checked: form.active, onChange: e => setForm({ ...form, active: e.target.checked }) }),
            "Published / Visible in carousel"
          )
        )
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "18px" } },
        h("button", { className: "btn", type: "submit" }, editingId ? "Update Review" : "Save Review"),
        h("button", { className: "btn alt", type: "button", onClick: () => { setIsAdding(false); setEditingId(null); } }, "Cancel"),
        status && h("span", { className: "admin-status" }, status)
      )
    )
  );
}

// Gallery Manager
function AdminGalleryManager() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image_url: "", sort_order: 0, active: true });
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [intro, setIntro] = useState({ eyebrow: "", title: "", body: "" });
  const [introStatus, setIntroStatus] = useState("");

  const load = async () => {
    const { data } = await supabase.from("gallery_items").select("*").order("sort_order");
    setItems(data || []);
  };

  const loadIntro = async () => {
    const { data } = await supabase.from("page_sections").select("*").eq("section_key", "gallery-intro").limit(1).maybeSingle();
    if (data) {
      setIntro({ eyebrow: data.eyebrow || "", title: data.title || "", body: data.body || "" });
    }
  };

  useEffect(() => {
    load();
    loadIntro();
  }, []);

  const saveIntro = async (e) => {
    e.preventDefault();
    setIntroStatus("Saving gallery header...");
    const payloadHome = {
      page_slug: "home",
      section_key: "gallery-intro",
      eyebrow: intro.eyebrow,
      title: intro.title,
      body: intro.body,
      active: true,
      updated_at: new Date().toISOString()
    };
    const payloadGallery = {
      page_slug: "gallery",
      section_key: "gallery-intro",
      eyebrow: intro.eyebrow,
      title: intro.title,
      body: intro.body,
      active: true,
      updated_at: new Date().toISOString()
    };
    const { error: e1 } = await supabase.from("page_sections").upsert(payloadHome);
    const { error: e2 } = await supabase.from("page_sections").upsert(payloadGallery);
    if (e1 || e2) setIntroStatus(`Error: ${(e1 || e2).message}`);
    else {
      setIntroStatus("Gallery header saved successfully!");
      setTimeout(() => setIntroStatus(""), 3000);
    }
  };

  const uploadGalleryImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("Uploading picture...");
    try {
      const url = await uploadMediaFile(file, "gallery");
      setForm(f => ({ ...f, image_url: url }));
      setStatus("Picture uploaded!");
    } catch (err) {
      setStatus(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const startNew = () => {
    setEditingId(null);
    setIsAdding(true);
    setForm({ title: "", description: "", image_url: "", sort_order: items.length + 1, active: true });
    setStatus("");
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setIsAdding(true);
    setForm({
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url || "",
      sort_order: item.sort_order ?? 0,
      active: item.active !== false
    });
    setStatus("");
  };

  const saveItem = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const payload = {
      title: form.title,
      description: form.description || "",
      image_url: form.image_url || "",
      sort_order: Number(form.sort_order) || 0,
      active: Boolean(form.active),
      updated_at: new Date().toISOString()
    };
    if (editingId) payload.id = editingId;
    const { error } = await supabase.from("gallery_items").upsert(payload);
    if (error) setStatus(`Error: ${error.message}`);
    else {
      setStatus("Gallery item saved!");
      setIsAdding(false);
      setEditingId(null);
      load();
    }
  };

  const deleteItem = async (id, title) => {
    if (!window.confirm(`Delete gallery item "${title}"?`)) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) alert(`Error: ${error.message}`);
    else load();
  };

  return h("div", null,
    // Gallery Section Header Form
    h("form", { className: "admin-card-box", onSubmit: saveIntro },
      h("p", { className: "eyebrow" }, "Gallery Section Heading & Introduction"),
      h("h2", null, "Gallery Heading & Text"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Eyebrow tag", h("input", { type: "text", value: intro.eyebrow, placeholder: "e.g. Gallery", onChange: e => setIntro({ ...intro, eyebrow: e.target.value }) })),
        h("label", null, "Main Heading / Title", h("input", { type: "text", value: intro.title, placeholder: "e.g. A record of learning in motion", onChange: e => setIntro({ ...intro, title: e.target.value }) })),
        h("label", null, "Introductory description", h("textarea", { rows: 2, value: intro.body, placeholder: "e.g. Explore the work, gatherings and people that make the SMSR community active...", onChange: e => setIntro({ ...intro, body: e.target.value }) }))
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "14px" } },
        h("button", { className: "btn", type: "submit" }, "Save Gallery Header"),
        introStatus && h("span", { className: "admin-status" }, introStatus)
      )
    ),

    h("div", { className: "admin-card-box" },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        h("div", null,
          h("p", { className: "eyebrow" }, "Visual Memories"),
          h("h2", { style: { margin: 0 } }, `Gallery Photos (${items.length})`)
        ),
        h("button", { className: "btn", type: "button", onClick: startNew }, "+ Add Picture")
      )
    ),
    h("div", { className: "admin-grid-cards" }, items.map(item =>
      h("div", { className: "admin-item-card", key: item.id },
        h("div", null,
          item.image_url && h("img", { src: item.image_url, className: "admin-item-thumb", alt: item.title }),
          h("h3", { style: { margin: "4px 0 6px" } }, item.title),
          item.description && h("p", { style: { fontSize: "0.85rem", color: "var(--muted)", margin: "0 0 10px" } }, item.description),
          h("div", { className: "admin-item-meta" },
            h("span", { className: "admin-status-pill " + (item.active !== false ? "active" : "rejected") }, item.active !== false ? "Published" : "Hidden"),
            h("span", { style: { fontSize: "0.78rem", color: "var(--muted)" } }, `Order: ${item.sort_order ?? 0}`)
          )
        ),
        h("div", { className: "admin-record-actions", style: { marginTop: "12px" } },
          h("button", { type: "button", onClick: () => editItem(item) }, "Edit"),
          h("button", { type: "button", onClick: () => deleteItem(item.id, item.title) }, "Delete")
        )
      )
    )),
    isAdding && h("form", { className: "admin-card-box", onSubmit: saveItem, style: { border: "2px solid var(--accent)" } },
      h("p", { className: "eyebrow" }, editingId ? "Edit Picture" : "New Gallery Picture"),
      h("h2", null, editingId ? `Edit "${form.title}"` : "Add Picture to Gallery"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Photo Title / Caption", h("input", { type: "text", required: true, value: form.title, placeholder: "e.g. Annual Academic Conference", onChange: e => setForm({ ...form, title: e.target.value }) })),
        h("label", null, "Description / Subtitle", h("textarea", { rows: 2, value: form.description, placeholder: "Details of event or photo", onChange: e => setForm({ ...form, description: e.target.value }) })),
        h("div", null,
          h("label", null, "Picture URL", h("input", { type: "text", value: form.image_url, placeholder: "https://... or upload below", onChange: e => setForm({ ...form, image_url: e.target.value }) })),
          h("div", { className: "admin-upload-row" },
            h("input", { type: "file", accept: "image/*", disabled: uploading, onChange: uploadGalleryImage }),
            form.image_url && h("img", { src: form.image_url, className: "admin-img-preview-mini", alt: "Preview" })
          )
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" } },
          h("label", null, "Display Order", h("input", { type: "number", value: form.sort_order, onChange: e => setForm({ ...form, sort_order: e.target.value }) })),
          h("label", { className: "admin-check", style: { marginTop: "24px" } },
            h("input", { type: "checkbox", checked: form.active, onChange: e => setForm({ ...form, active: e.target.checked }) }),
            "Published / Visible in Gallery"
          )
        )
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "18px" } },
        h("button", { className: "btn", type: "submit" }, editingId ? "Update Picture" : "Save Picture"),
        h("button", { className: "btn alt", type: "button", onClick: () => { setIsAdding(false); setEditingId(null); } }, "Cancel"),
        status && h("span", { className: "admin-status" }, status)
      )
    )
  );
}

// Menu Manager
function AdminMenuManager() {
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ label: "", href: "", sort_order: 0, active: true });
  const [status, setStatus] = useState("");

  const load = async () => {
    const { data } = await supabase.from("menu_items").select("*").order("sort_order");
    setMenu(data || []);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditingId(null);
    setIsAdding(true);
    setForm({ label: "", href: "", sort_order: menu.length, active: true });
    setStatus("");
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setIsAdding(true);
    setForm({
      label: item.label || "",
      href: item.href || "",
      sort_order: item.sort_order ?? 0,
      active: item.active !== false
    });
    setStatus("");
  };

  const saveMenu = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    const payload = {
      label: form.label,
      href: form.href,
      sort_order: Number(form.sort_order) || 0,
      active: Boolean(form.active),
      updated_at: new Date().toISOString()
    };
    if (editingId) payload.id = editingId;
    const { error } = await supabase.from("menu_items").upsert(payload);
    if (error) setStatus(`Error: ${error.message}`);
    else {
      setStatus("Menu option saved!");
      setIsAdding(false);
      setEditingId(null);
      load();
    }
  };

  const deleteMenu = async (id, label) => {
    if (!window.confirm(`Delete menu option "${label}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) alert(`Error: ${error.message}`);
    else load();
  };

  return h("div", null,
    h("div", { className: "admin-card-box" },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        h("div", null,
          h("p", { className: "eyebrow" }, "Navigation"),
          h("h2", { style: { margin: 0 } }, `Header Menu Options (${menu.length})`)
        ),
        h("button", { className: "btn", type: "button", onClick: startNew }, "+ Add Menu Option")
      )
    ),
    h("div", { className: "admin-grid-cards" }, menu.map(item =>
      h("div", { className: "admin-item-card", key: item.id },
        h("div", null,
          h("h3", { style: { margin: "0 0 4px" } }, item.label),
          h("span", { style: { fontSize: "0.82rem", color: "var(--accent)", wordBreak: "break-all" } }, item.href),
          h("div", { className: "admin-item-meta", style: { marginTop: "10px" } },
            h("span", { className: "admin-status-pill " + (item.active !== false ? "active" : "rejected") }, item.active !== false ? "Visible" : "Hidden"),
            h("span", { style: { fontSize: "0.78rem", color: "var(--muted)" } }, `Order: ${item.sort_order ?? 0}`)
          )
        ),
        h("div", { className: "admin-record-actions", style: { marginTop: "12px" } },
          h("button", { type: "button", onClick: () => editItem(item) }, "Edit"),
          h("button", { type: "button", onClick: () => deleteMenu(item.id, item.label) }, "Delete")
        )
      )
    )),
    isAdding && h("form", { className: "admin-card-box", onSubmit: saveMenu, style: { border: "2px solid var(--accent)" } },
      h("p", { className: "eyebrow" }, editingId ? "Edit Menu Option" : "New Menu Option"),
      h("h2", null, editingId ? `Edit Option "${form.label}"` : "Add Menu Option"),
      h("div", { style: { display: "grid", gap: "14px" } },
        h("label", null, "Option Label", h("input", { type: "text", required: true, value: form.label, placeholder: "e.g. Services, About, Publications", onChange: e => setForm({ ...form, label: e.target.value }) })),
        h("label", null, "Target URL / Link", h("input", { type: "text", required: true, value: form.href, placeholder: "e.g. #/services, #/about, https://...", onChange: e => setForm({ ...form, href: e.target.value }) })),
        h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" } },
          h("label", null, "Sort Order", h("input", { type: "number", value: form.sort_order, onChange: e => setForm({ ...form, sort_order: e.target.value }) })),
          h("label", { className: "admin-check", style: { marginTop: "24px" } },
            h("input", { type: "checkbox", checked: form.active, onChange: e => setForm({ ...form, active: e.target.checked }) }),
            "Active in header"
          )
        )
      ),
      h("div", { className: "admin-editor-actions", style: { marginTop: "18px" } },
        h("button", { className: "btn", type: "submit" }, editingId ? "Update Option" : "Save Option"),
        h("button", { className: "btn alt", type: "button", onClick: () => { setIsAdding(false); setEditingId(null); } }, "Cancel"),
        status && h("span", { className: "admin-status" }, status)
      )
    )
  );
}

// Settings Manager
function AdminSettingsManager() {
  const [form, setForm] = useState({
    footer_eyebrow: "Contact SMSR",
    footer_title: "Let’s build access to learning together.",
    footer_phone: "+91 8017555556",
    footer_email: "knowledgereview08@gmail.com",
    footer_address: "8/1/2 Dr. U.N. Brahmachari Street (Loudon Street), Kolkata 700017",
    footer_copyright: "SMSR · Since 2008",
    site_logo: ""
  });
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    if (data && data.length) {
      const map = {};
      data.forEach(s => { map[s.key] = s.value; });
      setForm(prev => ({ ...prev, ...map }));
    }
  };

  useEffect(() => { load(); }, []);

  const uploadLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("Uploading logo...");
    try {
      const url = await uploadMediaFile(file, "branding");
      setForm(f => ({ ...f, site_logo: url }));
      setStatus("Logo uploaded! Click 'Save Settings' to apply.");
    } catch (err) {
      setStatus(err.message);
    }
    setUploading(false);
    e.target.value = "";
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      for (const [key, value] of Object.entries(form)) {
        await supabase.from("site_settings").upsert({
          key,
          label: key.replace(/_/g, " "),
          value: value || "",
          active: true,
          updated_at: new Date().toISOString()
        });
      }
      setStatus("Site settings saved successfully!");
      setTimeout(() => setStatus(""), 3000);
      load();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return h("form", { className: "admin-card-box", onSubmit: saveSettings },
    h("p", { className: "eyebrow" }, "Global Settings"),
    h("h2", null, "Site Settings & Footer"),
    h("div", { style: { display: "grid", gap: "14px" } },
      h("div", null,
        h("label", null, "Site Logo / Crest URL", h("input", { type: "text", value: form.site_logo, placeholder: "https://... or upload below", onChange: e => setForm({ ...form, site_logo: e.target.value }) })),
        h("div", { className: "admin-upload-row" },
          h("input", { type: "file", accept: "image/*", disabled: uploading, onChange: uploadLogo }),
          form.site_logo && h("img", { src: form.site_logo, className: "admin-img-preview-mini", alt: "Logo Preview" })
        )
      ),
      h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
        h("label", null, "Footer Eyebrow", h("input", { type: "text", value: form.footer_eyebrow, onChange: e => setForm({ ...form, footer_eyebrow: e.target.value }) })),
        h("label", null, "Footer Main Title", h("input", { type: "text", value: form.footer_title, onChange: e => setForm({ ...form, footer_title: e.target.value }) }))
      ),
      h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
        h("label", null, "Footer Phone Number", h("input", { type: "text", value: form.footer_phone, onChange: e => setForm({ ...form, footer_phone: e.target.value }) })),
        h("label", null, "Footer Email Address", h("input", { type: "email", value: form.footer_email, onChange: e => setForm({ ...form, footer_email: e.target.value }) }))
      ),
      h("label", null, "Head Office Address", h("textarea", { rows: 2, value: form.footer_address, onChange: e => setForm({ ...form, footer_address: e.target.value }) })),
      h("label", null, "Footer Copyright Notice", h("input", { type: "text", value: form.footer_copyright, onChange: e => setForm({ ...form, footer_copyright: e.target.value }) }))
    ),
    h("div", { className: "admin-editor-actions", style: { marginTop: "18px" } },
      h("button", { className: "btn", type: "submit" }, "Save Settings"),
      status && h("span", { className: "admin-status" }, status)
    )
  );
}

const userFields = [
  ["full_name", "Full name", "text"],
  ["email", "Email", "email"],
  ["category", "User category", "text"],
  ["user_category", "Membership category", "text"],
  ["role", "Role", "text"],
  ["status", "Access status", "text"],
  ["phone", "Contact number", "text"],
  ["whatsapp", "WhatsApp number", "text"],
  ["affiliation", "Affiliation", "text"],
  ["address", "Address", "textarea"],
  ["membership_start_date", "Membership Start", "date"],
  ["membership_end_date", "Membership End", "date"]
];

function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const load = async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) setStatus(error.message);
    else setRows(data || []);
  };
  useEffect(() => { load(); }, []);
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const edit = row => { setSelected(row.id); setForm({ ...row }); setStatus(""); };
  const resetForm = () => { setSelected(null); setCreating(false); setForm({}); setStatus(""); };
  const save = async event => {
    event.preventDefault();
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name || "",
      category: form.category || "Member",
      user_category: form.user_category || form.category || "Member",
      status: form.status || "active",
      phone: form.phone || "",
      whatsapp: form.whatsapp || "",
      affiliation: form.affiliation || "",
      address: form.address || "",
      role: form.role === "admin" ? "admin" : "member",
      membership_start_date: form.membership_start_date || null,
      membership_end_date: form.membership_end_date || null,
      updated_at: new Date().toISOString()
    }).eq("id", selected);
    if (error) return setStatus(error.message);
    setStatus("User details saved.");
    resetForm();
    load();
  };
  const create = async event => {
    event.preventDefault();
    if (!form.email) return setStatus("Email is required.");
    setBusy(true);
    setStatus("");
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: {
          email: form.email,
          full_name: form.full_name || "",
          category: form.category || "Member",
          role: form.role || "member",
          phone: form.phone || "",
          whatsapp: form.whatsapp || "",
          affiliation: form.affiliation || "",
          address: form.address || "",
          sendEmail: true
        }
      });
      if (error) throw new Error(error.message || "Failed to create user.");
      setStatus(`User created. User ID: ${data.user.id}. Login email sent.`);
      resetForm();
      load();
    } catch (error) {
      setStatus(error.message);
    }
    setBusy(false);
  };
  const setAccess = async (id, nextStatus) => {
    const { error } = await supabase.from("profiles").update({ status: nextStatus, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) setStatus(error.message);
    else { setStatus(`Access ${nextStatus}.`); load(); }
  };
  const sendReset = async email => {
    if (!email) return setStatus("This user has no email address.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}${window.location.pathname}#/membership` });
    setStatus(error ? error.message : "Password reset email sent.");
  };
  const resend = async email => {
    if (!email) return setStatus("This user has no email address.");
    const { error } = await supabase.auth.resend({ type: "email", email });
    setStatus(error ? error.message : "Login email resent.");
  };
  return h("div", { className: "admin-management" },
    h("div", { className: "admin-collection-heading" }, h("div", null, h("p", { className: "eyebrow" }, "Accounts"), h("h2", null, "Users & access"), h("p", null, "Passwords are never visible. Use reset email instead.")), h("button", { type: "button", className: "btn alt", onClick: () => { setCreating(true); setForm({}); setStatus(""); } }, "New user")),
    h("div", { className: "admin-user-list" }, rows.map(row =>
      h("article", { className: "admin-user-card", key: row.id },
        h("div", null, h("b", null, row.full_name || "Unnamed user"), h("small", null, row.email || "Email unavailable"), h("small", null, `User ID: ${row.id}`)),
        h("div", { className: "admin-user-meta" }, h("span", null, row.user_category || row.category || "Member"), h("span", { className: "admin-status-pill " + (row.status || "active") }, row.status || "active"), h("span", null, row.role || "member"), row.membership_end_date && h("span", null, `Expires: ${row.membership_end_date}`)),
        h("div", { className: "admin-record-actions" },
          h("button", { type: "button", onClick: () => edit(row) }, "Edit details"),
          h("button", { type: "button", onClick: () => sendReset(row.email) }, "Reset password"),
          h("button", { type: "button", onClick: () => resend(row.email) }, "Resend email"),
          row.status === "active" ? h("button", { type: "button", onClick: () => setAccess(row.id, "revoked") }, "Revoke") : h("button", { type: "button", onClick: () => setAccess(row.id, "active") }, "Accept"),
          row.status !== "deleted" && h("button", { type: "button", onClick: () => setAccess(row.id, "deleted") }, "Remove")
        )
      )
    )),
    (selected || creating) && h("form", { className: "admin-editor admin-user-editor", onSubmit: selected ? save : create },
      h("p", { className: "eyebrow" }, creating ? "New user" : "Edit user details"),
      creating && h("label", null, "Email address", h("input", { type: "email", value: form.email || "", required: true, placeholder: "user@example.com", onChange: event => update("email", event.target.value) })),
  userFields.map(field => h("label", { key: field[0] }, field[1], field[2] === "textarea"
    ? h("textarea", { value: form[field[0]] || "", onChange: event => update(field[0], event.target.value) })
    : h("input", { type: field[2], value: form[field[0]] || "", onChange: event => update(field[0], event.target.value), readOnly: field[0] === "email" && selected }))),
      h("label", null, "Role", h("select", { value: form.role || "member", onChange: event => update("role", event.target.value) }, h("option", { value: "member" }, "Member"), h("option", { value: "admin" }, "Admin"))),
      h("label", null, "Membership Category (Admin only)", h("select", { value: form.user_category || form.category || "Life Member", onChange: event => update("user_category", event.target.value) }, ["Life Member", "Executive", "Elite", "Premium", "Member", "Student", "Faculty", "Alumni", "Associate", "Other"].map(v => h("option", { key: v, value: v }, v)))),
      h("div", { className: "admin-editor-actions" }, h("button", { className: "btn", type: "submit" }, creating ? "Create user" : "Save user"), h("button", { className: "btn alt", type: "button", onClick: resetForm }, "Cancel")),
      status && h("p", { className: "admin-status", "aria-live": "polite" }, status)
    )
  );
}

const applicationFields = [
  ["email", "Email", "email"],
  ["name", "Name", "text"],
  ["father_name", "Father's name", "text"],
  ["mother_name", "Mother's name", "text"],
  ["gender", "Gender", "text"],
  ["date_of_birth", "Date of birth", "date"],
  ["aadhaar_no", "Aadhaar number", "text"],
  ["designation", "Designation", "text"],
  ["affiliation", "Affiliation", "text"],
  ["research_interest", "Area of research interest", "text"],
  ["address", "Address", "textarea"],
  ["contact_no", "Contact number", "text"],
  ["whatsapp_no", "WhatsApp number", "text"],
  ["alternate_email", "E-mail ID", "email"],
  ["highest_qualification", "Highest qualification", "text"],
  ["admin_note", "Admin note", "textarea"]
];

function AdminApplications() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [status, setStatus] = useState("");
  const load = async () => {
    const { data, error } = await supabase.from("membership_applications").select("*").order("created_at", { ascending: false });
    if (error) setStatus(error.message);
    else setRows(data || []);
  };
  useEffect(() => { load(); }, []);
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const edit = row => { setSelected(row.id); setForm({ ...row }); setStatus(""); };
  const save = async event => {
    event.preventDefault();
    const payload = Object.fromEntries(applicationFields.map(([key]) => [key, form[key] || ""]));
    payload.date_of_birth = form.date_of_birth || null;
    payload.status = form.status || "approved";
    payload.category = form.category || "Member";
    payload.membership_plan_id = form.membership_plan_id || null;
    payload.membership_duration_months = form.membership_duration_months ? Number(form.membership_duration_months) : null;
    payload.membership_start_date = form.membership_start_date || null;
    payload.membership_end_date = form.membership_end_date || null;
    payload.updated_at = new Date().toISOString();
    const { error } = await supabase.from("membership_applications").update(payload).eq("id", selected);
    if (error) return setStatus(error.message);
    setStatus("Application saved.");
    setSelected(null);
    load();
  };
  const updateStatus = async (id, nextStatus) => {
    const { error } = await supabase.from("membership_applications").update({ status: nextStatus, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) setStatus(error.message);
    else { setStatus(`Application ${nextStatus}.`); load(); }
  };
  const openDocument = async path => {
    if (!path) return setStatus("No document has been uploaded.");
    const { data, error } = await supabase.storage.from("membership-documents").createSignedUrl(path, 300);
    if (error) setStatus(error.message);
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };
  const downloadCopy = row => {
    if (!row.registration_copy) return setStatus("This application has no saved form copy.");
    const blob = new Blob([row.registration_copy], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smsr-registration-${row.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return h("div", { className: "admin-management" },
    h("div", { className: "admin-collection-heading" }, h("div", null, h("p", { className: "eyebrow" }, "Life membership"), h("h2", null, "Registration applications"), h("p", null, "Review submitted details and uploaded documents.")), h("button", { type: "button", className: "btn alt", onClick: load }, "Refresh")),
    h("div", { className: "admin-user-list" }, rows.map(row =>
      h("article", { className: "admin-user-card", key: row.id },
        h("div", null, h("b", null, row.name), h("small", null, row.email), h("small", null, `Application ID: ${row.id}`), h("small", null, `Linked user ID: ${row.user_id || "Not verified yet"}`)),
        h("div", { className: "admin-user-meta" }, h("span", null, row.category), h("span", { className: "admin-status-pill " + row.status }, row.status), h("span", null, new Date(row.created_at).toLocaleDateString())),
        h("div", { className: "admin-record-actions" },
          h("button", { type: "button", onClick: () => edit(row) }, "Edit details"),
          h("button", { type: "button", onClick: () => updateStatus(row.id, "approved") }, "Accept"),
          h("button", { type: "button", onClick: () => updateStatus(row.id, "revoked") }, "Revoke"),
          h("button", { type: "button", onClick: () => updateStatus(row.id, "deleted") }, "Remove"),
          h("button", { type: "button", onClick: () => openDocument(row.qualification_document_path) }, "Qualification"),
          h("button", { type: "button", onClick: () => openDocument(row.signature_document_path) }, "Signature"),
          h("button", { type: "button", onClick: () => openDocument(row.photo_document_path) }, "Photo"),
          h("button", { type: "button", onClick: () => downloadCopy(row) }, "Download form copy")
        )
      )
    )),
    selected && h("form", { className: "admin-editor admin-user-editor", onSubmit: save }, h("p", { className: "eyebrow" }, "Edit application"),
      applicationFields.map(field => h("label", { key: field[0] }, field[1], field[2] === "textarea"
        ? h("textarea", { value: form[field[0]] || "", onChange: event => update(field[0], event.target.value) })
        : h("input", { type: field[2], value: form[field[0]] || "", onChange: event => update(field[0], event.target.value), readOnly: field[0] === "email" })),
      h("label", null, "User category", h("input", { value: form.category || "Member", onChange: event => update("category", event.target.value) })),
      h("label", null, "Application status", h("select", { value: form.status || "approved", onChange: event => update("status", event.target.value) }, ["pending", "approved", "rejected", "revoked", "deleted"].map(value => h("option", { key: value, value }, value)))),
      h("label", null, "Membership duration (months)", h("input", { type: "number", value: form.membership_duration_months || "", onChange: event => update("membership_duration_months", event.target.value) })),
      h("label", null, "Membership start date", h("input", { type: "date", value: form.membership_start_date || "", onChange: event => update("membership_start_date", event.target.value) })),
      h("label", null, "Membership end date", h("input", { type: "date", value: form.membership_end_date || "", onChange: event => update("membership_end_date", event.target.value) })),
      h("label", null, "Saved form copy", h("textarea", { value: form.registration_copy || "", readOnly: true })),
      h("div", { className: "admin-editor-actions" }, h("button", { className: "btn", type: "submit" }, "Save application"), h("button", { className: "btn alt", type: "button", onClick: () => setSelected(null) }, "Cancel")))
    ),
    status && h("p", { className: "admin-status", "aria-live": "polite" }, status)
  );
}

function AdminApplicationAudit() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");
  const load = async () => {
    const { data, error } = await supabase
      .from("membership_application_audit")
      .select("id, application_id, event_type, actor_user_id, before_data, after_data, created_at")
      .order("created_at", { ascending: false });
    if (error) setStatus(error.message);
    else setRows(data || []);
  };
  useEffect(() => { load(); }, []);
  return h("div", { className: "admin-management" },
    h("div", { className: "admin-collection-heading" },
      h("div", null, h("p", { className: "eyebrow" }, "Database history"), h("h2", null, "Registration audit trail"), h("p", null, "Every submission, edit, status change, and deletion is recorded by the database.")),
      h("button", { type: "button", className: "btn alt", onClick: load }, "Refresh")
    ),
    h("div", { className: "admin-audit-list" }, rows.map(row =>
      h("article", { className: "admin-user-card", key: row.id },
        h("div", null,
          h("b", null, row.event_type.replace("_", " ")),
          h("small", null, `Application ID: ${row.application_id || "Unavailable"}`),
          h("small", null, `Actor user ID: ${row.actor_user_id || "Public submission"}`),
          h("small", null, new Date(row.created_at).toLocaleString())
        ),
        h("details", null,
          h("summary", null, "View saved record snapshot"),
          h("pre", { className: "admin-audit-json" }, JSON.stringify(row.after_data, null, 2))
        )
      )
    )),
    status && h("p", { className: "admin-status", "aria-live": "polite" }, status)
  );
}

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("home");
  const [status, setStatus] = useState("");
  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setStatus("Supabase is not configured.");
      return () => { mounted = false; };
    }
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setSession(data.session);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) setSession(newSession);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!session || !supabase) {
      setProfile(null);
      return () => { mounted = false; };
    }
    const loadProfile = async () => {
      const email = session.user.email?.toLowerCase();
      if (isSuperAdminEmail(email)) {
        if (mounted) setProfile({ role: "admin", full_name: session.user.user_metadata?.full_name || "Super Admin" });
        return;
      }
      const { data, error } = await supabase.from("profiles").select("role, full_name").eq("id", session.user.id).maybeSingle();
      if (!mounted) return;
      if (error) {
        setStatus(error.message);
        return;
      }
      if (data?.role === "admin") {
        setProfile(data);
      } else {
        setStatus("This account is not an administrator.");
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, [session]);
  if (!session || !profile) return h("div", { className: "admin-page" }, h(AdminLogin, { onAuthenticated: setSession }), status && h("p", { className: "admin-status" }, status));
  return h("div", { className: "admin-page" }, h("div", { className: "wrap admin-wrap admin-wrap-modern" },
    h("div", { className: "admin-header admin-header-modern" },
      h("div", null,
        h("p", { className: "eyebrow" }, "SMSR administration"),
        h("h1", null, "Admin Dashboard")
      ),
      h("div", { className: "admin-header-actions" },
        h("a", { className: "btn alt", href: "#/home" }, "← View Live Site"),
        h("span", { className: "admin-user-chip" }, profile?.full_name || session.user.email),
        h("button", { className: "btn alt", type: "button", onClick: () => supabase.auth.signOut() }, "Sign out")
      )
    ),
    h("div", { className: "admin-layout" },
      h("nav", { className: "admin-sidebar" },
        h("p", { className: "admin-sidebar-title" }, "Site Pages & Sections"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "home" ? " active" : ""), onClick: () => setTab("home") }, "🏠 Home"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "about" ? " active" : ""), onClick: () => setTab("about") }, "ℹ️ About"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "services" ? " active" : ""), onClick: () => setTab("services") }, "💼 Services"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "notifications" ? " active" : ""), onClick: () => setTab("notifications") }, "🔔 Notifications"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "reviews" ? " active" : ""), onClick: () => setTab("reviews") }, "⭐ Reviews"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "gallery" ? " active" : ""), onClick: () => setTab("gallery") }, "🖼️ Gallery"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "donate" ? " active" : ""), onClick: () => setTab("donate") }, "❤️ Donate"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "contact" ? " active" : ""), onClick: () => setTab("contact") }, "📞 Contact"),

        h("p", { className: "admin-sidebar-title" }, "Navigation & Site"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "menu_items" ? " active" : ""), onClick: () => setTab("menu_items") }, "🧭 Header Menu Options"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "site_settings" ? " active" : ""), onClick: () => setTab("site_settings") }, "⚙️ Footer & Site Settings"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "membership_plans" ? " active" : ""), onClick: () => setTab("membership_plans") }, "💳 Membership Plans"),

        h("p", { className: "admin-sidebar-title" }, "Members & Submissions"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "users" ? " active" : ""), onClick: () => setTab("users") }, "👥 Users / Categories"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "applications" ? " active" : ""), onClick: () => setTab("applications") }, "📋 Registrations & Duration"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "feedback" ? " active" : ""), onClick: () => setTab("feedback") }, "✉️ Inquiries & Feedback"),
        h("button", { type: "button", className: "admin-nav-item" + (tab === "audit" ? " active" : ""), onClick: () => setTab("audit") }, "📜 Audit Trail")
      ),
      h("main", { className: "admin-main" },
        tab === "home" ? h(AdminPageManager, { pageSlug: "home", pageTitle: "Home Page" }) :
        tab === "about" ? h(AdminPageManager, { pageSlug: "about", pageTitle: "About Page" }) :
        tab === "services" ? h(AdminServicesManager) :
        tab === "notifications" ? h(AdminNotificationsManager) :
        tab === "reviews" ? h(AdminReviewsManager) :
        tab === "gallery" ? h(AdminGalleryManager) :
        tab === "donate" ? h(AdminPageManager, { pageSlug: "donate", pageTitle: "Donate Page" }) :
        tab === "contact" ? h(AdminPageManager, { pageSlug: "contact", pageTitle: "Contact Page", isContact: true }) :
        tab === "menu_items" ? h(AdminMenuManager) :
        tab === "site_settings" ? h(AdminSettingsManager) :
        tab === "users" ? h(AdminUsers) :
        tab === "applications" ? h(AdminApplications) :
        tab === "audit" ? h(AdminApplicationAudit) :
        tab === "feedback" ? h(AdminCollection, { table: "feedback", definition: collections.feedback, user: session.user }) :
        tab === "membership_plans" ? h(AdminCollection, { table: "membership_plans", definition: collections.membership_plans, user: session.user }) :
        h(AdminCollection, { table: tab, definition: collections[tab], user: session.user })
      )
    )
  ));
}
