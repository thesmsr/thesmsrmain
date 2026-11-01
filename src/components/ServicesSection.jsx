import React, { useState } from "react";
import Card from "./Card";
import { services } from "../data";

const h = React.createElement;

export default function ServicesSection({ items, section }) {
  const [selectedService, setSelectedService] = useState(null);
  const serviceItems = Array.isArray(items) ? items.map(service => [service.title, service.summary, service.slug + ".html", service.image_url]) : services;

  return h("section", { id: "services", className: "services-section" }, h("div", { className: "wrap" },
    h("div", { className: "head" }, h("p", { className: "eyebrow" }, section?.eyebrow || "The society is engaged to render"), h("h2", null, section?.title || "Services"),
      h("p", null, section?.body || "From publishing your research to preparing for your first job, each service is run by the trust and open to learners and educators.")),
    h("div", { className: "services-grid" }, serviceItems.map((service, index) => h(Card, {
      key: service[0],
      i: index,
      s: service,
      isActive: selectedService === index,
      onSelect: () => setSelectedService(selectedService === index ? null : index)
    })))
  ));
}
