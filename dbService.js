// Client-side database service communicating with Next.js API routes.
// This preserves the exact interface used by the components and pages.

const handleResponse = async (res) => {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const dbService = {
  // --- HERO ---
  async getHero() {
    return fetch("/api/data?key=hero").then(handleResponse);
  },

  async updateHero(data) {
    return fetch("/api/data?key=hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  // --- THEMES ---
  async getThemes() {
    return fetch("/api/data?key=themes").then(handleResponse);
  },

  async addTheme(theme) {
    return fetch("/api/data?key=themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    }).then(handleResponse);
  },

  async updateTheme(id, theme) {
    return fetch(`/api/data?key=themes&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    }).then(handleResponse);
  },

  async deleteTheme(id) {
    return fetch(`/api/data?key=themes&id=${id}`, {
      method: "DELETE",
    }).then(handleResponse);
  },

  async reorderThemes(themesList) {
    return fetch("/api/data?key=themes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(themesList),
    }).then(handleResponse);
  },

  // --- PRICING ---
  async getPricing() {
    return fetch("/api/data?key=pricing").then(handleResponse);
  },

  async addPricing(pkg) {
    return fetch("/api/data?key=pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pkg),
    }).then(handleResponse);
  },

  async updatePricing(id, pkg) {
    return fetch(`/api/data?key=pricing&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pkg),
    }).then(handleResponse);
  },

  async deletePricing(id) {
    return fetch(`/api/data?key=pricing&id=${id}`, {
      method: "DELETE",
    }).then(handleResponse);
  },

  // --- ADD-ONS ---
  async getAddons() {
    return fetch("/api/data?key=addons").then(handleResponse);
  },

  async addAddon(addon) {
    return fetch("/api/data?key=addons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addon),
    }).then(handleResponse);
  },

  async updateAddon(id, addon) {
    return fetch(`/api/data?key=addons&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addon),
    }).then(handleResponse);
  },

  async deleteAddon(id) {
    return fetch(`/api/data?key=addons&id=${id}`, {
      method: "DELETE",
    }).then(handleResponse);
  },

  // --- PORTFOLIO ---
  async getPortfolio() {
    return fetch("/api/data?key=portfolio").then(handleResponse);
  },

  async addPortfolio(item) {
    return fetch("/api/data?key=portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }).then(handleResponse);
  },

  async deletePortfolio(id) {
    return fetch(`/api/data?key=portfolio&id=${id}`, {
      method: "DELETE",
    }).then(handleResponse);
  },

  // --- TESTIMONIALS ---
  async getTestimonials() {
    return fetch("/api/data?key=testimonials").then(handleResponse);
  },

  async addTestimonial(testimonial) {
    return fetch("/api/data?key=testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonial),
    }).then(handleResponse);
  },

  async updateTestimonial(id, testimonial) {
    return fetch(`/api/data?key=testimonials&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonial),
    }).then(handleResponse);
  },

  async deleteTestimonial(id) {
    return fetch(`/api/data?key=testimonials&id=${id}`, {
      method: "DELETE",
    }).then(handleResponse);
  },

  // --- CONTACT INFO & SUBMISSIONS ---
  async getContact() {
    return fetch("/api/data?key=contact").then(handleResponse);
  },

  async updateContact(data) {
    return fetch("/api/data?key=contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  async addContactSubmission(submission) {
    return fetch("/api/data?key=contact_submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    }).then(handleResponse);
  },

  // --- SEO ---
  async getSeo() {
    return fetch("/api/data?key=seo").then(handleResponse);
  },

  async updateSeo(data) {
    return fetch("/api/data?key=seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  // --- WEBSITE SETTINGS ---
  async getSettings() {
    return fetch("/api/data?key=settings").then(handleResponse);
  },

  async updateSettings(data) {
    return fetch("/api/data?key=settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  // --- MEDIA LIBRARY ---
  async getMedia() {
    return fetch("/api/media").then(handleResponse);
  },

  async addMedia(item) {
    // This supports metadata registration if needed, but file upload to /api/media is preferred
    return fetch("/api/data?key=media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }).then(handleResponse);
  },

  async deleteMedia(id) {
    return fetch(`/api/data?key=media&id=${id}`, {
      method: "DELETE",
    }).then(handleResponse);
  },
};
