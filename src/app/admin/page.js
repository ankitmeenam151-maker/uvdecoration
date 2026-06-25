"use client";

import { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, Image, Palette, DollarSign, PlusCircle, 
  Sparkles, Settings, Globe, Shield, LogOut, Trash2, Edit2, 
  Upload, FolderHeart, CheckSquare, UserCheck, CheckCircle2, 
  AlertCircle, X, Check, ArrowRight, Eye, RefreshCw, Menu,
  Share2, FileText, Users
} from "lucide-react";
import { dbService } from "@/services/dbService";
import ReviewForm from "@/components/ReviewForm";

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global app data state
  const [data, setData] = useState({
    hero: null,
    themes: [],
    pricing: [],
    addons: [],
    portfolio: [],
    testimonials: [],
    contact: null,
    settings: null,
    seo: null,
    media: [],
    team: [],
    founder: null
  });

  const [dataLoading, setDataLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ show: false, success: true, message: "" });
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { tab, field, index, key }

  // Drag & drop file upload state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Form edit states (temporary holding states)
  const [heroForm, setHeroForm] = useState({ heading: "", subheading: "", ctaText: "", heroImage: "" });
  const [contactForm, setContactForm] = useState({ phone: "", email: "", address: "" });
  const [founderForm, setFounderForm] = useState({ name: "", role: "", description: "", image: "" });
  const [settingsForm, setSettingsForm] = useState({
    logoText: "",
    logoSub: "",
    footerText: "",
    footerDescription: "",
    primaryColor: "#FF9A9E",
    secondaryColor: "#D4AF37",
    socialLinks: { instagram: "", facebook: "", pinterest: "", linkedin: "", whatsapp: "" }
  });
  const [seoForm, setSeoForm] = useState({ title: "", description: "", keywords: "", shareImage: "" });

  // Modal item states (for creating/editing list entries)
  const [listModal, setListModal] = useState({ show: false, type: "", mode: "create", item: null });

  // Check auth on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth");
        const json = await res.json();
        if (json.success && json.user) {
          setIsAuthenticated(true);
          loadAllData();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch all site data
  const loadAllData = async () => {
    setDataLoading(true);
    try {
      const [hero, themes, pricing, addons, portfolio, testimonials, contact, settings, seo, media, team, founder] = await Promise.all([
        dbService.getHero().catch(() => null),
        dbService.getThemes().catch(() => []),
        dbService.getPricing().catch(() => []),
        dbService.getAddons().catch(() => []),
        dbService.getPortfolio().catch(() => []),
        dbService.getTestimonials().catch(() => []),
        dbService.getContact().catch(() => null),
        dbService.getSettings().catch(() => null),
        dbService.getSeo().catch(() => null),
        dbService.getMedia().catch(() => []),
        dbService.getTeam().catch(() => []),
        dbService.getFounder().catch(() => null)
      ]);

      const loadedData = {
        hero,
        themes: Array.isArray(themes) ? themes : [],
        pricing: Array.isArray(pricing) ? pricing : [],
        addons: Array.isArray(addons) ? addons : [],
        portfolio: Array.isArray(portfolio) ? portfolio : [],
        testimonials: Array.isArray(testimonials) ? testimonials : [],
        contact,
        settings,
        seo,
        media: Array.isArray(media) ? media : [],
        team: Array.isArray(team) ? team : [],
        founder
      };

      setData(loadedData);

      // Populate form states
      if (hero) setHeroForm({ heading: hero.heading || "", subheading: hero.subheading || "", ctaText: hero.ctaText || "", heroImage: hero.heroImage || "" });
      if (contact) setContactForm({ phone: contact.phone || "", email: contact.email || "", address: contact.address || "" });
      if (founder) setFounderForm({ name: founder.name || "", role: founder.role || "", description: founder.description || "", image: founder.image || "" });
      if (settings) {
        setSettingsForm({
          logoText: settings.logoText || "",
          logoSub: settings.logoSub || "",
          footerText: settings.footerText || "",
          footerDescription: settings.footerDescription || "",
          primaryColor: settings.primaryColor || "#FF9A9E",
          secondaryColor: settings.secondaryColor || "#D4AF37",
          socialLinks: {
            instagram: settings.socialLinks?.instagram || "",
            facebook: settings.socialLinks?.facebook || "",
            pinterest: settings.socialLinks?.pinterest || "",
            linkedin: settings.socialLinks?.linkedin || "",
            whatsapp: settings.socialLinks?.whatsapp || ""
          }
        });
      }
      if (seo) setSeoForm({ title: seo.title || "", description: seo.description || "", keywords: seo.keywords || "", shareImage: seo.shareImage || "" });

    } catch (error) {
      console.error("Error loading admin data:", error);
      triggerAlert(false, "Failed to load database values.");
    } finally {
      setDataLoading(false);
    }
  };

  // Trigger alert toast
  const triggerAlert = (success, message) => {
    setSaveStatus({ show: true, success, message });
    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setAuthError(json.error || "Invalid username or password.");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setIsAuthenticated(false);
        setData({
          hero: null, themes: [], pricing: [], addons: [],
          portfolio: [], testimonials: [], contact: null,
          settings: null, seo: null, media: [], team: [], founder: null
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Save Single Document Forms (Hero, Contact, SEO, Settings)
  const saveForm = async (key, formData) => {
    try {
      let res;
      if (key === "hero") res = await dbService.updateHero(formData);
      else if (key === "contact") res = await dbService.updateContact(formData);
      else if (key === "seo") res = await dbService.updateSeo(formData);
      else if (key === "settings") res = await dbService.updateSettings(formData);
      else if (key === "founder") res = await dbService.updateFounder(formData);

      if (res) {
        triggerAlert(true, `${key.toUpperCase()} settings saved successfully!`);
        loadAllData();
      }
    } catch (err) {
      console.error(`Save error for ${key}:`, err);
      triggerAlert(false, `Failed to update ${key} settings.`);
    }
  };

  // Create or Update list items (Themes, Pricing, Add-ons, Testimonials, Portfolio)
  const handleModalSave = async (e) => {
    e.preventDefault();
    const { type, mode, item } = listModal;

    try {
      let res;
      if (mode === "create") {
        if (type === "themes") res = await dbService.addTheme(item);
        else if (type === "pricing") res = await dbService.addPricing(item);
        else if (type === "addons") res = await dbService.addAddon(item);
        else if (type === "portfolio") res = await dbService.addPortfolio(item);
        else if (type === "testimonials") res = await dbService.addTestimonial(item);
        else if (type === "team") res = await dbService.addTeamMember(item);
      } else {
        if (type === "themes") res = await dbService.updateTheme(item.id, item);
        else if (type === "pricing") res = await dbService.updatePricing(item.id, item);
        else if (type === "addons") res = await dbService.updateAddon(item.id, item);
        else if (type === "testimonials") res = await dbService.updateTestimonial(item.id, item);
        else if (type === "team") res = await dbService.updateTeamMember(item.id, item);
      }

      triggerAlert(true, `${type === "testimonials" ? "Review" : type.slice(0, -1).toUpperCase()} saved successfully!`);
      setListModal({ show: false, type: "", mode: "create", item: null });
      loadAllData();
    } catch (err) {
      console.error("Save list modal item failed:", err);
      triggerAlert(false, `Error saving item to database.`);
    }
  };

  // Delete item from list
  const handleDeleteItem = async (type, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      let res;
      if (type === "themes") res = await dbService.deleteTheme(id);
      else if (type === "pricing") res = await dbService.deletePricing(id);
      else if (type === "addons") res = await dbService.deleteAddon(id);
      else if (type === "portfolio") res = await dbService.deletePortfolio(id);
      else if (type === "testimonials") res = await dbService.deleteTestimonial(id);
      else if (type === "media") res = await dbService.deleteMedia(id);
      else if (type === "team") res = await dbService.deleteTeamMember(id);

      triggerAlert(true, `Item deleted successfully!`);
      loadAllData();
    } catch (err) {
      console.error(`Delete failed for ${type}:`, err);
      triggerAlert(false, `Could not delete the item.`);
    }
  };

  // File Upload (Drag & Drop or Manual)
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData
      });
      const json = await res.json();
      if (json.error) {
        triggerAlert(false, json.error);
      } else {
        triggerAlert(true, "Image uploaded and stored successfully!");
        loadAllData();
      }
    } catch (err) {
      triggerAlert(false, "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Open Media Selector Modal
  const openMediaPicker = (tab, field, index = null, key = null) => {
    setMediaPickerTarget({ tab, field, index, key });
  };

  // Select Image from Media Picker
  const selectMediaItem = (url) => {
    if (!mediaPickerTarget) return;

    const { tab, field, index, key } = mediaPickerTarget;

    if (tab === "hero") {
      setHeroForm((prev) => ({ ...prev, [field]: url }));
    } else if (tab === "seo") {
      setSeoForm((prev) => ({ ...prev, [field]: url }));
    } else if (tab === "modal") {
      setListModal((prev) => ({
        ...prev,
        item: { ...prev.item, [field]: url }
      }));
    } else if (tab === "founder") {
      setFounderForm((prev) => ({ ...prev, [field]: url }));
    }

    setMediaPickerTarget(null);
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-[#FF9A9E] animate-spin mb-4" />
        <h2 className="text-xl font-medium text-white/80 animate-pulse">Initializing Portal...</h2>
      </div>
    );
  }

  // Render Login Card
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF9A9E]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px]" />

        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF9A9E] to-[#D4AF37] mx-auto flex items-center justify-center shadow-lg shadow-[#FF9A9E]/20 mb-6">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-heading text-white tracking-wide">UV Admin Access</h1>
            <p className="text-gray-400 text-sm mt-2">Sign in to manage live event content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="flex gap-2 items-center p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@uvdecor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-[#FF9A9E] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-[#FF9A9E] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#FF9A9E]/10 flex items-center justify-center gap-2 group"
            >
              <span>Authenticate Portal</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Full Admin Panel Dashboard
  return (
    <div className="admin-container flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-gray-950 text-white">
      {/* Save Alerts Toast */}
      {saveStatus.show && (
        <div className={`fixed top-6 right-6 z-[99999] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-in ${saveStatus.success
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
          {saveStatus.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-semibold">{saveStatus.message}</span>
        </div>
      )}

      {/* Media Picker Popup Modal */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-white/10 w-full max-w-4xl rounded-[2rem] flex flex-col max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/50">
              <div>
                <h3 className="text-xl font-heading text-white">Select Asset</h3>
                <p className="text-xs text-gray-400 mt-1">Choose an image from your live Media Library</p>
              </div>
              <button
                onClick={() => setMediaPickerTarget(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-950/40">
              {data.media.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Image size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="font-semibold">Media Library is empty</p>
                  <p className="text-xs mt-1">Upload images in the Media Library tab first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {data.media.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => selectMediaItem(img.url)}
                      className="group cursor-pointer bg-white/5 border border-white/5 hover:border-[#FF9A9E]/40 rounded-2xl overflow-hidden transition-all duration-300 relative aspect-video"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white text-xs font-bold rounded-xl shadow-lg">Choose Asset</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List CRUD Modal */}
      {listModal.show && (
        <div className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-white/10 w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl font-heading text-white">
                {listModal.mode === "create" ? "Add New" : "Edit"} {listModal.type === "testimonials" ? "Review" : listModal.type.slice(0, -1).toUpperCase()}
              </h3>
              <button
                onClick={() => setListModal({ show: false, type: "", mode: "create", item: null })}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-gray-950/40">
              {/* THEMES TAB INPUTS */}
              {listModal.type === "themes" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Theme Name</label>
                    <input
                      type="text" required
                      placeholder="e.g. Dreamy Pink Canopy"
                      value={listModal.item?.name || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Short Description</label>
                    <textarea
                      required rows={3}
                      placeholder="e.g. Gorgeous organic arch with metallic rose gold accents."
                      value={listModal.item?.desc || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, desc: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Theme Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text" required
                        placeholder="/images/example.png"
                        value={listModal.item?.image || ""}
                        onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, image: e.target.value } }))}
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker("modal", "image")}
                        className="px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all border border-white/10 text-xs font-bold"
                      >
                        Media Library
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* PRICING TAB INPUTS */}
              {listModal.type === "pricing" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Package Name</label>
                    <input
                      type="text" required
                      placeholder="e.g. Golden Canopy Gala"
                      value={listModal.item?.name || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Price String</label>
                    <input
                      type="text" required
                      placeholder="e.g. From $499"
                      value={listModal.item?.price || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, price: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Features (Comma Separated)</label>
                    <textarea
                      required rows={4}
                      placeholder="8-10ft Balloon Garland, High Chrome Palette, 2 Light Stands, Cleanup Included"
                      value={Array.isArray(listModal.item?.features) ? listModal.item.features.join(", ") : ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, features: e.target.value.split(",").map(f => f.trim()) } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recommended"
                      checked={listModal.item?.recommended || false}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, recommended: e.target.checked } }))}
                      className="w-5 h-5 rounded bg-white/5 border border-white/10 accent-[#FF9A9E]"
                    />
                    <label htmlFor="recommended" className="text-sm font-bold text-gray-300">Feature this package (Recommended badge)</label>
                  </div>
                </>
              )}

              {/* ADD-ONS TAB INPUTS */}
              {listModal.type === "addons" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Option Title</label>
                    <input
                      type="text" required
                      placeholder="e.g. Magic Show"
                      value={listModal.item?.name || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Surcharge</label>
                    <input
                      type="text" required
                      placeholder="e.g. +$150"
                      value={listModal.item?.price || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, price: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                </>
              )}

              {/* PORTFOLIO TAB INPUTS */}
              {listModal.type === "portfolio" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Project Title</label>
                    <input
                      type="text" required
                      placeholder="e.g. Romantic Balloon Arch Setup"
                      value={listModal.item?.title || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, title: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Category</label>
                    <select
                      value={listModal.item?.category || "Birthdays"}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, category: e.target.value } }))}
                      className="w-full bg-gray-900 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    >
                      <option value="Birthdays">Birthdays</option>
                      <option value="Weddings">Weddings</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Project Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text" required
                        placeholder="/images/example.png"
                        value={listModal.item?.image || ""}
                        onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, image: e.target.value } }))}
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker("modal", "image")}
                        className="px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all border border-white/10 text-xs font-bold"
                      >
                        Media Library
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TESTIMONIALS TAB INPUTS */}
              {listModal.type === "testimonials" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Client Name</label>
                    <input
                      type="text" required
                      placeholder="e.g. Sarah Johnson"
                      value={listModal.item?.name || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Client Role</label>
                    <input
                      type="text" required
                      placeholder="e.g. Bride / Happy Parent"
                      value={listModal.item?.role || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, role: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Client Review Message</label>
                    <textarea
                      required rows={3}
                      placeholder="Professional service, beautiful decorations..."
                      value={listModal.item?.text || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, text: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Review Rating (1-5)</label>
                    <input
                      type="number" required min={1} max={5}
                      value={listModal.item?.rating || 5}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, rating: parseInt(e.target.value) } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Client Avatar URL</label>
                    <input
                      type="text"
                      placeholder="https://i.pravatar.cc/150"
                      value={listModal.item?.avatar || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, avatar: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                </>
              )}

              {/* TEAM MEMBER INPUTS */}
              {listModal.type === "team" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Member Name</label>
                    <input
                      type="text" required
                      placeholder="e.g. Rahul Sharma"
                      value={listModal.item?.name || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Role / Designation</label>
                    <input
                      type="text" required
                      placeholder="e.g. Senior Decorator"
                      value={listModal.item?.role || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, role: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">About This Member</label>
                    <textarea
                      required rows={3}
                      placeholder="A short description about this team member..."
                      value={listModal.item?.description || ""}
                      onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, description: e.target.value } }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Photo URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="/images/member.jpg"
                        value={listModal.item?.image || ""}
                        onChange={(e) => setListModal(prev => ({ ...prev, item: { ...prev.item, image: e.target.value } }))}
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker("modal", "image")}
                        className="px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all border border-white/10 text-xs font-bold"
                      >
                        Media Library
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save {listModal.type === "testimonials" ? "Review" : listModal.type === "team" ? "Team Member" : listModal.type.slice(0, -1).toUpperCase()} Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden w-full h-16 bg-gray-900 border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-30 bg-gray-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF9A9E] to-[#D4AF37] flex items-center justify-center shadow-md">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-heading text-white tracking-wide">UV Portal</h2>
          </div>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 hover:text-white transition-all border border-white/10"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] lg:hidden animate-fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 bg-gray-900 border-r border-white/5 flex flex-col p-6 z-[1000] lg:hidden transition-transform duration-300 ease-out transform ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-2xl overflow-y-auto`}
      >
        {/* Top Close Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF9A9E] to-[#D4AF37] flex items-center justify-center shadow-lg">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-heading text-white tracking-wide">UV Portal</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mt-0.5">Luxury Manager</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "hero", label: "Hero Banner", icon: Sparkles },
            { id: "themes", label: "Themes Gallery", icon: Palette },
            { id: "pricing", label: "Packages & Addons", icon: DollarSign },
            { id: "portfolio", label: "Portfolio Items", icon: FolderHeart },
            { id: "testimonials", label: "Customer Reviews", icon: UserCheck },
            { id: "team", label: "Our Team", icon: Users },
            { id: "settings", label: "Branding & Contact", icon: Settings },
            { id: "footer", label: "Footer Settings", icon: FileText },
            { id: "socials", label: "Social Media Links", icon: Share2 },
            { id: "seo", label: "SEO & Google Meta", icon: Globe },
            { id: "media", label: "Media Library", icon: Image }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all ${isActive
                    ? "bg-gradient-to-r from-[#FF9A9E]/15 to-[#D4AF37]/15 text-[#FF9A9E] border border-[#FF9A9E]/20 shadow-md shadow-[#FF9A9E]/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-white/5 mt-6">
          <button
            onClick={() => {
              handleLogout();
              setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/5 hover:text-red-300 border border-transparent hover:border-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar Navigation (Fixed) */}
      <aside className="hidden lg:flex h-full w-[280px] flex-col p-8 shrink-0 shadow-2xl bg-gray-900/40 backdrop-blur-xl border-r border-white/5 overflow-hidden relative">
        {/* Ambient Decorative Blurs */}
        <div className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-[#FF9A9E]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Title */}
        <div className="flex items-center gap-3 mb-10 z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF9A9E] to-[#D4AF37] flex items-center justify-center shadow-lg">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-heading text-white tracking-wide">UV Portal</h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block mt-0.5">Luxury Manager</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 flex-1 z-10 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "hero", label: "Hero Banner", icon: Sparkles },
            { id: "themes", label: "Themes Gallery", icon: Palette },
            { id: "pricing", label: "Packages & Addons", icon: DollarSign },
            { id: "portfolio", label: "Portfolio Items", icon: FolderHeart },
            { id: "testimonials", label: "Customer Reviews", icon: UserCheck },
            { id: "team", label: "Our Team", icon: Users },
            { id: "settings", label: "Branding & Contact", icon: Settings },
            { id: "footer", label: "Footer Settings", icon: FileText },
            { id: "socials", label: "Social Media Links", icon: Share2 },
            { id: "seo", label: "SEO & Google Meta", icon: Globe },
            { id: "media", label: "Media Library", icon: Image }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all ${isActive
                    ? "bg-gradient-to-r from-[#FF9A9E]/15 to-[#D4AF37]/15 text-[#FF9A9E] border border-[#FF9A9E]/20 shadow-md shadow-[#FF9A9E]/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-white/5 mt-6 lg:mt-0 z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/5 hover:text-red-300 border border-transparent hover:border-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-gray-950/60">
        <header className="p-6 lg:p-10 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/20">
          <div>
            <h1 className="text-3xl font-heading tracking-wide capitalize">{activeTab} Controls</h1>
            <p className="text-xs text-gray-400 mt-1">Managing live content synced with MongoDB</p>
          </div>
          <button
            onClick={loadAllData}
            disabled={dataLoading}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2 transition-all"
          >
            <RefreshCw size={14} className={dataLoading ? "animate-spin" : ""} />
            <span>Synchronize</span>
          </button>
        </header>

        {/* Content body */}
        <div className="p-6 lg:p-10 flex-1">
          {dataLoading && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 text-gray-300 text-sm mb-6 animate-pulse">
              <RefreshCw size={18} className="animate-spin" />
              <span>Fetching latest server-side database payload...</span>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* Quick stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Active Themes", val: data.themes.length, desc: "Decoration designs", col: "from-[#FF9A9E] to-pink-500" },
                  { label: "Packages", val: data.pricing.length, desc: "Featured pricing deals", col: "from-[#D4AF37] to-amber-600" },
                  { label: "Submissions", val: data.contact?.submissions?.length || 0, desc: "Inquiries submitted", col: "from-blue-400 to-indigo-600" },
                  { label: "Assets Uploaded", val: data.media.length, desc: "High-res media library", col: "from-emerald-400 to-teal-600" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr ${stat.col} opacity-5 rounded-full blur-2xl`} />
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                    <span className="text-4xl lg:text-5xl font-heading font-bold mt-4 bg-gradient-to-tr from-white to-gray-400 bg-clip-text text-transparent">{stat.val}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-2">{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Submissions Section */}
              <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-8 relative">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-heading text-white">Contact Form Submissions</h2>
                    <p className="text-xs text-gray-400 mt-1">Client leads generated from the live booking form</p>
                  </div>
                  <span className="px-3 py-1 bg-white/5 text-xs font-bold rounded-xl border border-white/10 text-[#FF9A9E]">
                    {data.contact?.submissions?.length || 0} Submissions
                  </span>
                </div>

                {!data.contact?.submissions || data.contact.submissions.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <CheckSquare size={48} className="mx-auto text-white/10 mb-4" />
                    <p className="font-semibold">No inquiries yet</p>
                    <p className="text-xs mt-1">Inquiries made from the website booking page will display here.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {data.contact.submissions.map((sub) => (
                      <div key={sub.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-[#FF9A9E]/20 transition-all flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-white">{sub.name}</span>
                            <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                              {new Date(sub.dateSubmitted).toLocaleDateString(undefined, { dateStyle: "medium" })}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-semibold">
                            <span>Phone: <a href={`tel:${sub.phone}`} className="text-[#FF9A9E] hover:underline">{sub.phone}</a></span>
                            <span>Email: <a href={`mailto:${sub.email}`} className="text-[#D4AF37] hover:underline">{sub.email}</a></span>
                          </div>
                          <p className="text-sm text-gray-300 pt-2 leading-relaxed italic">&ldquo;{sub.message}&rdquo;</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HERO BANNER */}
          {activeTab === "hero" && (
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-10 max-w-4xl animate-fade-in">
              <form onSubmit={(e) => { e.preventDefault(); saveForm("hero", heroForm); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Hero Title (Heading)</label>
                    <input
                      type="text" required
                      value={heroForm.heading}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, heading: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">CTA Button Text</label>
                    <input
                      type="text" required
                      value={heroForm.ctaText}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, ctaText: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Banner Subtext (Sub-heading)</label>
                  <textarea
                    required rows={4}
                    value={heroForm.subheading}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, subheading: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Banner Hero Image Path</label>
                  <div className="flex gap-2">
                    <input
                      type="text" required
                      value={heroForm.heroImage}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, heroImage: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("hero", "heroImage")}
                      className="px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all border border-white/10 text-xs font-bold"
                    >
                      Choose Media
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Save Hero Section Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: THEMES CRUD */}
          {activeTab === "themes" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                <div>
                  <h3 className="text-lg font-heading text-white">Live Themes</h3>
                  <p className="text-xs text-gray-400 mt-1">Manage standard party themes listed in the selection tool</p>
                </div>
                <button
                  onClick={() => setListModal({ show: true, type: "themes", mode: "create", item: { name: "", desc: "", image: "" } })}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <PlusCircle size={14} />
                  <span>Add New Theme</span>
                </button>
              </div>

              {data.themes.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/5 rounded-[2rem] text-gray-500">
                  <Palette size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="font-semibold">No decoration themes found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.themes.map((theme) => (
                    <div key={theme.id} className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col group">
                      <div className="relative aspect-video bg-gray-950 overflow-hidden border-b border-white/5">
                        <img src={theme.image} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 flex gap-1.5">
                          <button
                            onClick={() => setListModal({ show: true, type: "themes", mode: "edit", item: theme })}
                            className="p-2 bg-black/60 backdrop-blur-md hover:bg-black/80 rounded-xl text-white transition-all shadow-md"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("themes", theme.id)}
                            className="p-2 bg-red-500/20 backdrop-blur-md hover:bg-red-500/40 rounded-xl text-red-300 transition-all shadow-md"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-heading text-lg text-white">{theme.name}</h4>
                          <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{theme.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRICING & ADDONS */}
          {activeTab === "pricing" && (
            <div className="space-y-10 animate-fade-in">
              {/* Pricing Packages Area */}
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                  <div>
                    <h3 className="text-lg font-heading text-white">Pricing Packages</h3>
                    <p className="text-xs text-gray-400 mt-1">Manage featured party deals and tier bundles</p>
                  </div>
                  <button
                    onClick={() => setListModal({ show: true, type: "pricing", mode: "create", item: { name: "", price: "", features: [], recommended: false } })}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    <PlusCircle size={14} />
                    <span>Add Package</span>
                  </button>
                </div>

                {data.pricing.length === 0 ? (
                  <div className="text-center py-16 bg-white/5 border border-white/5 rounded-[2rem] text-gray-500">
                    <DollarSign size={48} className="mx-auto text-white/10 mb-4" />
                    <p className="font-semibold">No packages found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.pricing.map((pkg) => (
                      <div key={pkg.id} className={`bg-white/5 border rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden ${pkg.recommended ? "border-[#FF9A9E]/35" : "border-white/5"
                        }`}>
                        {pkg.recommended && (
                          <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
                            Featured Deal
                          </div>
                        )}
                        <div>
                          <div className="flex justify-between items-start pr-12">
                            <div>
                              <h4 className="font-heading text-xl text-white">{pkg.name}</h4>
                              <p className="text-gray-400 text-xs mt-1">Price tier summary</p>
                            </div>
                          </div>
                          <span className="text-3xl font-heading font-bold text-[#FF9A9E] block mt-4">{pkg.price}</span>

                          <ul className="space-y-2 mt-6">
                            {Array.isArray(pkg.features) && pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex gap-2 items-start text-xs text-gray-300 leading-relaxed font-semibold">
                                <Check size={14} className="text-green-400 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex gap-2 justify-end">
                          <button
                            onClick={() => setListModal({ show: true, type: "pricing", mode: "edit", item: pkg })}
                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-white transition-all text-xs flex items-center gap-1 font-bold"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem("pricing", pkg.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20 rounded-xl text-red-400 transition-all text-xs flex items-center gap-1 font-bold"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Addons Area */}
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                  <div>
                    <h3 className="text-lg font-heading text-white">Optional Add-ons</h3>
                    <p className="text-xs text-gray-400 mt-1">Manage individual extras dynamically populated in lists</p>
                  </div>
                  <button
                    onClick={() => setListModal({ show: true, type: "addons", mode: "create", item: { name: "", price: "" } })}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    <PlusCircle size={14} />
                    <span>Add Option</span>
                  </button>
                </div>

                {data.addons.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 border border-white/5 rounded-[2rem] text-gray-500">
                    <p className="font-semibold">No options found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.addons.map((addon) => (
                      <div key={addon.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                          <span className="text-sm font-bold text-white block">{addon.name}</span>
                          <span className="text-base font-bold text-[#D4AF37] block mt-1">{addon.price}</span>
                        </div>
                        <div className="flex gap-1 justify-end mt-4 pt-3 border-t border-white/5">
                          <button
                            onClick={() => setListModal({ show: true, type: "addons", mode: "edit", item: addon })}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("addons", addon.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PORTFOLIO CRUD */}
          {activeTab === "portfolio" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                <div>
                  <h3 className="text-lg font-heading text-white">Project Portfolio</h3>
                  <p className="text-xs text-gray-400 mt-1">Manage project showpieces categorized by event type</p>
                </div>
                <button
                  onClick={() => setListModal({ show: true, type: "portfolio", mode: "create", item: { title: "", category: "Birthdays", image: "" } })}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <PlusCircle size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              {data.portfolio.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/5 rounded-[2rem] text-gray-500">
                  <FolderHeart size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="font-semibold">No portfolio projects found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {data.portfolio.map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col group relative">
                      <div className="aspect-video bg-gray-950 overflow-hidden relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-[#FF9A9E] text-[10px] font-bold uppercase rounded-lg border border-white/5">
                          {item.category}
                        </span>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleDeleteItem("portfolio", item.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-xl text-red-300 transition-all shadow-md"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-sm font-bold text-white tracking-wide">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: TESTIMONIALS CRUD */}
          {activeTab === "testimonials" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-[2rem]">
                <div>
                  <h3 className="text-lg font-heading text-white">Client Reviews</h3>
                  <p className="text-xs text-gray-400 mt-1">Manage live client reviews displayed on the home page</p>
                </div>
                <button
                  onClick={() => setListModal({ show: true, type: "testimonials", mode: "create", item: { name: "", role: "", text: "", rating: 5, avatar: "" } })}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <PlusCircle size={14} />
                  <span>Add Review</span>
                </button>
              </div>

              {data.testimonials.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/5 rounded-[2rem] text-gray-500">
                  <UserCheck size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="font-semibold">No reviews found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.testimonials.map((review) => (
                    <div key={review.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-4 items-center">
                          {review.avatar && (
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-white tracking-wide">{review.name}</h4>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">{review.role}</span>
                          </div>
                        </div>

                        <div className="flex gap-0.5 mt-4">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-base ${i < review.rating ? "text-amber-400" : "text-gray-600"}`}>★</span>
                          ))}
                        </div>

                        <p className="text-sm text-gray-300 mt-4 leading-relaxed font-medium italic">&ldquo;{review.text}&rdquo;</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 justify-end">
                        {!review.approved && (
                          <button
                            onClick={async () => {
                              await dbService.updateTestimonial(review.id, { ...review, approved: true });
                              triggerAlert(true, "Review approved");
                              loadAllData();
                            }}
                            className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/10 rounded-xl text-green-400 transition-all text-xs font-bold flex items-center gap-1"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => setListModal({ show: true, type: "testimonials", mode: "edit", item: review })}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem("testimonials", review.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-xl text-red-400 transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BRANDING & COLORS */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-fade-in max-w-4xl">
              {/* Branding & Logo Settings */}
              <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-10">
                <h3 className="text-xl font-heading text-white mb-6">Branding & Logo Settings</h3>
                <form onSubmit={(e) => { e.preventDefault(); saveForm("settings", settingsForm); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Logo Title (Primary Text)</label>
                      <input
                        type="text" required
                        value={settingsForm.logoText}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, logoText: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Logo Sub-heading (Small Text)</label>
                      <input
                        type="text" required
                        value={settingsForm.logoSub}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, logoSub: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block">Primary Theme Color</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={settingsForm.primaryColor}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-12 h-12 bg-transparent border-0 cursor-pointer block rounded-xl"
                        />
                        <input
                          type="text" required
                          value={settingsForm.primaryColor}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block">Secondary Theme Color</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={settingsForm.secondaryColor}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-12 h-12 bg-transparent border-0 cursor-pointer block rounded-xl"
                        />
                        <input
                          type="text" required
                          value={settingsForm.secondaryColor}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                  >
                    Save Branding & Colors
                  </button>
                </form>
              </div>

              {/* Contact details */}
              <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-10">
                <h3 className="text-xl font-heading text-white mb-2">Contact Details</h3>
                <p className="text-xs text-gray-400 mb-6">Updates phone, email, and location across the booking form and floating buttons</p>
                <form onSubmit={(e) => { e.preventDefault(); saveForm("contact", contactForm); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Phone / WhatsApp Number</label>
                      <input
                        type="text" required
                        placeholder="e.g. +91 99999 99999"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Contact Email Address</label>
                      <input
                        type="email" required
                        placeholder="info@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Office / Studio Address</label>
                    <input
                      type="text" required
                      placeholder="123 Luxury Decor Way, New York"
                      value={contactForm.address}
                      onChange={(e) => setContactForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                  >
                    Save Contact Details
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: FOOTER SETTINGS */}
          {activeTab === "footer" && (
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-10 max-w-4xl animate-fade-in">
              <h3 className="text-xl font-heading text-white mb-2">Footer Customization</h3>
              <p className="text-xs text-gray-400 mb-6">Manage description text and copyrights shown at bottom of all pages</p>
              <form onSubmit={(e) => { e.preventDefault(); saveForm("settings", settingsForm); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Footer Description Text</label>
                  <textarea
                    rows={3}
                    value={settingsForm.footerDescription}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, footerDescription: e.target.value }))}
                    placeholder="e.g. Crafting luxury balloon installations for life's most precious moments."
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Footer Copyright Text</label>
                  <input
                    type="text" required
                    value={settingsForm.footerText}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, footerText: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                >
                  Save Footer Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB: SOCIAL MEDIA LINKS */}
          {activeTab === "socials" && (
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-10 max-w-4xl animate-fade-in">
              <h3 className="text-xl font-heading text-white mb-2">Social Media Profiles</h3>
              <p className="text-xs text-gray-400 mb-6">Manage profile URLs rendered in header, footer, and floaters</p>
              <form onSubmit={(e) => { e.preventDefault(); saveForm("settings", settingsForm); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["instagram", "facebook", "pinterest", "linkedin", "whatsapp"].map((plat) => (
                    <div key={plat} className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold capitalize">{plat} URL Profile</label>
                      <input
                        type="text"
                        placeholder={plat === "whatsapp" ? "https://wa.me/..." : `https://${plat}.com/yourpage`}
                        value={settingsForm.socialLinks[plat] || ""}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, [plat]: e.target.value }
                        }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                >
                  Save Social Links
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: SEO & GOOGLE META */}
          {activeTab === "seo" && (
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-10 max-w-4xl animate-fade-in">
              <form onSubmit={(e) => { e.preventDefault(); saveForm("seo", seoForm); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">SEO Title Tag (Page Title)</label>
                  <input
                    type="text" required
                    value={seoForm.title}
                    onChange={(e) => setSeoForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Meta Keywords (Comma Separated)</label>
                  <input
                    type="text" required
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm(prev => ({ ...prev, keywords: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Meta Description</label>
                  <textarea
                    required rows={4}
                    value={seoForm.description}
                    onChange={(e) => setSeoForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Social Share Default Image Path</label>
                  <div className="flex gap-2">
                    <input
                      type="text" required
                      value={seoForm.shareImage}
                      onChange={(e) => setSeoForm(prev => ({ ...prev, shareImage: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker("seo", "shareImage")}
                      className="px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all border border-white/10 text-xs font-bold"
                    >
                      Choose Asset
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white font-bold tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Save SEO Configurations
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: MEDIA LIBRARY */}
          {activeTab === "media" && (
            <div className="space-y-8 animate-fade-in">
              {/* Drag and Drop Uploader */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[2.5rem] p-10 text-center cursor-pointer transition-all ${dragActive
                    ? "border-[#FF9A9E] bg-[#FF9A9E]/5"
                    : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/5"
                  }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-gray-300">
                  {uploading ? (
                    <RefreshCw className="animate-spin text-[#FF9A9E]" size={24} />
                  ) : (
                    <Upload size={24} />
                  )}
                </div>
                <h4 className="font-heading text-lg text-white">
                  {uploading ? "Storing media payload in database..." : "Upload files directly to MongoDB"}
                </h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
                  Drag and drop high-resolution JPG or PNG assets here, or click to browse. Max size 5MB.
                </p>
              </div>

              {/* Grid listing */}
              <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-heading text-white">Active Media Assets</h2>
                  <p className="text-xs text-gray-400 mt-1">High-performance lightweight listings served straight from database buckets</p>
                </div>

                {data.media.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Image size={48} className="mx-auto text-white/10 mb-4" />
                    <p className="font-semibold">Media Library is empty</p>
                    <p className="text-xs mt-1">Upload images to get database asset URLs.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {data.media.map((img) => (
                      <div key={img.id} className="bg-gray-950 border border-white/5 rounded-2xl overflow-hidden group relative flex flex-col">
                        <div className="aspect-square bg-gray-900 flex items-center justify-center relative overflow-hidden">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            <a
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                            >
                              <Eye size={14} />
                            </a>
                            <button
                              onClick={() => handleDeleteItem("media", img.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl text-red-300 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3.5 border-t border-white/5 bg-gray-900/40">
                          <span className="text-[10px] font-bold text-white/90 truncate block tracking-wide">{img.name}</span>
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(img.url);
                              triggerAlert(true, "Image URL copied to clipboard!");
                            }}
                            className="text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#FF9A9E] cursor-pointer mt-1 block select-all truncate"
                          >
                            Copy Link
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* TAB: OUR TEAM */}
          {activeTab === "team" && (
            <div className="space-y-10 animate-fade-in">
              {/* Founder Section */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-heading text-white">Founder Details</h2>
                    <p className="text-xs text-gray-400 mt-1">Edit the founder section shown at the top of the Our Team page.</p>
                  </div>
                </div>
                <div className="p-6 lg:p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Founder Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={founderForm.name}
                        onChange={(e) => setFounderForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Role / Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Founder & Creative Director"
                        value={founderForm.role}
                        onChange={(e) => setFounderForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">About / Description</label>
                    <textarea
                      rows={4}
                      placeholder="Brief description about the founder..."
                      value={founderForm.description}
                      onChange={(e) => setFounderForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Founder Photo URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="/images/founder.jpg or upload from Media Library"
                        value={founderForm.image}
                        onChange={(e) => setFounderForm(prev => ({ ...prev, image: e.target.value }))}
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF9A9E]"
                      />
                      <button
                        type="button"
                        onClick={() => openMediaPicker("founder", "image")}
                        className="px-4 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all border border-white/10 text-xs font-bold"
                      >
                        Media Library
                      </button>
                    </div>
                    {founderForm.image && (
                      <img src={founderForm.image} alt="Founder Preview" className="mt-2 h-24 w-24 object-cover rounded-2xl border border-white/10" />
                    )}
                  </div>
                  <button
                    onClick={() => saveForm("founder", founderForm)}
                    className="px-8 py-3 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Save Founder Details
                  </button>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
                <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-heading text-white">Team Members</h2>
                    <p className="text-xs text-gray-400 mt-1">{data.team.length} member{data.team.length !== 1 ? 's' : ''} added</p>
                  </div>
                  <button
                    onClick={() => setListModal({ show: true, type: "team", mode: "create", item: { name: "", role: "", description: "", image: "" } })}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all"
                  >
                    <PlusCircle size={14} /> Add Member
                  </button>
                </div>

                <div className="p-6 lg:p-8">
                  {data.team.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users size={40} className="mx-auto text-white/10 mb-3" />
                      <p className="font-semibold">No team members yet</p>
                      <p className="text-xs mt-1">Click "Add Member" to add your first team member.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data.team.map((member) => (
                        <div key={member.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                          <div className="h-40 bg-gray-900/40 flex items-center justify-center relative overflow-hidden">
                            {member.image ? (
                              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-gray-600">
                                <Users size={32} />
                                <span className="text-xs">No Photo</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-[#FF9A9E] font-bold uppercase tracking-wider mb-1">{member.role}</p>
                            <h3 className="text-white font-heading font-semibold text-lg">{member.name}</h3>
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{member.description}</p>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => setListModal({ show: true, type: "team", mode: "edit", item: { ...member } })}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-[#FF9A9E]/10 text-white/70 hover:text-[#FF9A9E] rounded-xl text-xs font-bold border border-white/10 transition-all"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem("team", member.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 rounded-xl text-xs font-bold border border-white/10 transition-all"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
