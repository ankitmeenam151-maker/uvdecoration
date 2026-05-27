"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Sparkles, 
  DollarSign, 
  Briefcase, 
  MessageSquare, 
  PhoneCall, 
  Settings, 
  LogOut, 
  Globe, 
  Loader2, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Eye, 
  Copy, 
  Plus, 
  ChevronRight, 
  X,
  Menu,
  Upload,
  Calendar,
  AlertCircle,
  FileText
} from "lucide-react";
import { dbService } from "@/services/dbService";
import Image from "next/image";

export default function AdminPage() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submittingLogin, setSubmittingLogin] = useState(false);

  // Nav state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Database states
  const [dbData, setDbData] = useState({
    hero: null,
    themes: [],
    pricing: [],
    addons: [],
    portfolio: [],
    testimonials: [],
    contact: null,
    seo: null,
    settings: null,
    media: []
  });
  const [dataLoading, setDataLoading] = useState(false);

  // Editing modal states
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // theme, pricing, addon, portfolio, testimonial

  // Confirmation modal states
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: "", id: "", label: "" });

  // Upload state
  const [uploadingFile, setUploadingFile] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Form states for sections
  const [heroForm, setHeroForm] = useState({ heading: "", subheading: "", ctaText: "", heroImage: "" });
  const [contactForm, setContactForm] = useState({ phone: "", email: "", address: "" });
  const [seoForm, setSeoForm] = useState({ title: "", description: "", keywords: "", shareImage: "" });
  const [settingsForm, setSettingsForm] = useState({ logoText: "", logoSub: "", footerText: "", primaryColor: "", secondaryColor: "", instagram: "", facebook: "", pinterest: "", linkedin: "" });

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const loadAllData = async () => {
    setDataLoading(true);
    try {
      const [hero, themes, pricing, addons, portfolio, testimonials, contact, settings, seo, media] = await Promise.all([
        dbService.getHero(),
        dbService.getThemes(),
        dbService.getPricing(),
        dbService.getAddons(),
        dbService.getPortfolio(),
        dbService.getTestimonials(),
        dbService.getContact(),
        dbService.getSettings(),
        dbService.getSeo(),
        dbService.getMedia()
      ]);

      setDbData({ hero, themes, pricing, addons, portfolio, testimonials, contact, settings, seo, media });
      
      // Seed editor forms
      if (hero) setHeroForm({ ...hero });
      if (contact) setContactForm({ phone: contact.phone, email: contact.email, address: contact.address });
      if (seo) setSeoForm({ ...seo });
      if (settings) {
        setSettingsForm({
          logoText: settings.logoText,
          logoSub: settings.logoSub,
          footerText: settings.footerText,
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          instagram: settings.socialLinks?.instagram || "",
          facebook: settings.socialLinks?.facebook || "",
          pinterest: settings.socialLinks?.pinterest || "",
          linkedin: settings.socialLinks?.linkedin || ""
        });
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      showToast("Failed to load dashboard data.", "error");
    } finally {
      setDataLoading(false);
    }
  };

  // Auth check on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }
    checkSession();
  }, []);

  // Fetch all data once logged in
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setSubmittingLogin(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        showToast("Logged in successfully!");
      } else {
        setLoginError(data.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Failed to authenticate. Please check server connection.");
    } finally {
      setSubmittingLogin(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setUser(null);
      showToast("Logged out successfully.");
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Logout failed.", "error");
    }
  };

  // Handle File Uploads directly to MongoDB media service
  const uploadImage = async (file) => {
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData // Content-Type header must NOT be set manually when sending FormData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      const mediaItem = await res.json();
      showToast("Image uploaded successfully!");
      loadAllData(); // Refresh all data to include new media library item
      return mediaItem.url;
    } catch (err) {
      console.error("Upload error:", err);
      showToast(err.message || "Failed to upload image.", "error");
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // Update Hero Submit
  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    const success = await dbService.updateHero(heroForm);
    if (success) {
      showToast("Hero section updated successfully!");
      loadAllData();
    } else {
      showToast("Failed to update Hero section.", "error");
    }
  };

  // Update Contact Info Submit
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const success = await dbService.updateContact({
      ...dbData.contact,
      phone: contactForm.phone,
      email: contactForm.email,
      address: contactForm.address
    });
    if (success) {
      showToast("Contact details updated!");
      loadAllData();
    } else {
      showToast("Failed to update contact details.", "error");
    }
  };

  // Update SEO Submit
  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    const success = await dbService.updateSeo(seoForm);
    if (success) {
      showToast("SEO settings updated!");
      loadAllData();
    } else {
      showToast("Failed to update SEO.", "error");
    }
  };

  // Update Settings Submit
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const success = await dbService.updateSettings({
      logoText: settingsForm.logoText,
      logoSub: settingsForm.logoSub,
      footerText: settingsForm.footerText,
      primaryColor: settingsForm.primaryColor,
      secondaryColor: settingsForm.secondaryColor,
      socialLinks: {
        instagram: settingsForm.instagram,
        facebook: settingsForm.facebook,
        pinterest: settingsForm.pinterest,
        linkedin: settingsForm.linkedin
      }
    });
    if (success) {
      showToast("Website settings updated successfully!");
      loadAllData();
    } else {
      showToast("Failed to update settings.", "error");
    }
  };

  // Theme CRUD Handlers
  const handleOpenThemeModal = (theme = null) => {
    setEditingItem(theme ? { ...theme } : { name: "", image: "/images/hero.png", desc: "" });
    setModalType("theme");
    setIsModalOpen(true);
  };

  const handleThemeSave = async (e) => {
    e.preventDefault();
    if (editingItem.id) {
      await dbService.updateTheme(editingItem.id, { name: editingItem.name, image: editingItem.image, desc: editingItem.desc });
      showToast("Theme updated!");
    } else {
      await dbService.addTheme({ name: editingItem.name, image: editingItem.image, desc: editingItem.desc });
      showToast("Theme added!");
    }
    setIsModalOpen(false);
    loadAllData();
  };

  // Pricing CRUD Handlers
  const handleOpenPricingModal = (pkg = null) => {
    setEditingItem(pkg ? { ...pkg, featuresString: pkg.features.join("\n") } : { name: "", price: "From $199", featuresString: "", recommended: false });
    setModalType("pricing");
    setIsModalOpen(true);
  };

  const handlePricingSave = async (e) => {
    e.preventDefault();
    const features = editingItem.featuresString.split("\n").filter(f => f.trim() !== "");
    const data = { name: editingItem.name, price: editingItem.price, features, recommended: editingItem.recommended };
    
    if (editingItem.id) {
      await dbService.updatePricing(editingItem.id, data);
      showToast("Package updated!");
    } else {
      await dbService.addPricing(data);
      showToast("Package added!");
    }
    setIsModalOpen(false);
    loadAllData();
  };

  // Addons CRUD Handlers
  const handleOpenAddonModal = (addon = null) => {
    setEditingItem(addon ? { ...addon } : { name: "", price: "+$50" });
    setModalType("addon");
    setIsModalOpen(true);
  };

  const handleAddonSave = async (e) => {
    e.preventDefault();
    if (editingItem.id) {
      await dbService.updateAddon(editingItem.id, { name: editingItem.name, price: editingItem.price });
      showToast("Add-on updated!");
    } else {
      await dbService.addAddon({ name: editingItem.name, price: editingItem.price });
      showToast("Add-on added!");
    }
    setIsModalOpen(false);
    loadAllData();
  };

  // Portfolio CRUD Handlers
  const handleOpenPortfolioModal = (item = null) => {
    setEditingItem(item ? { ...item } : { title: "", category: "Birthdays", image: "/images/birthday.png" });
    setModalType("portfolio");
    setIsModalOpen(true);
  };

  const handlePortfolioSave = async (e) => {
    e.preventDefault();
    if (editingItem.id) {
      showToast("Portfolio items are fully static except category changes.");
    } else {
      await dbService.addPortfolio({ title: editingItem.title, category: editingItem.category, image: editingItem.image });
      showToast("Portfolio item added!");
    }
    setIsModalOpen(false);
    loadAllData();
  };

  // Testimonial CRUD Handlers
  const handleOpenTestimonialModal = (testimonial = null) => {
    setEditingItem(testimonial ? { ...testimonial } : { name: "", role: "", text: "", rating: 5, avatar: "https://i.pravatar.cc/150?u=sarah" });
    setModalType("testimonial");
    setIsModalOpen(true);
  };

  const handleTestimonialSave = async (e) => {
    e.preventDefault();
    const data = { name: editingItem.name, role: editingItem.role, text: editingItem.text, rating: parseInt(editingItem.rating), avatar: editingItem.avatar };
    if (editingItem.id) {
      await dbService.updateTestimonial(editingItem.id, data);
      showToast("Testimonial updated!");
    } else {
      await dbService.addTestimonial(data);
      showToast("Testimonial added!");
    }
    setIsModalOpen(false);
    loadAllData();
  };

  // Generic delete trigger
  const triggerDelete = (type, id, label) => {
    setConfirmDelete({ open: true, type, id, label });
  };

  const executeDelete = async () => {
    const { type, id } = confirmDelete;
    try {
      if (type === "theme") await dbService.deleteTheme(id);
      if (type === "pricing") await dbService.deletePricing(id);
      if (type === "addon") await dbService.deleteAddon(id);
      if (type === "portfolio") await dbService.deletePortfolio(id);
      if (type === "testimonial") await dbService.deleteTestimonial(id);
      if (type === "media") await dbService.deleteMedia(id);
      
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
      loadAllData();
    } catch (e) {
      showToast("Failed to delete item.", "error");
    } finally {
      setConfirmDelete({ open: false, type: "", id: "", label: "" });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Authenticating Portal...</span>
      </div>
    );
  }

  // --- LOGIN PANEL VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-white to-pink-50/20 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Decor bubbles */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FF9A9E]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#D4AF37]/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-pink-100/50 relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#FF9A9E] to-[#FECFEF] rounded-full flex items-center justify-center shadow-lg mb-6">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          
          <h2 className="font-heading text-3xl font-bold text-center text-gray-800">Admin Portal</h2>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mt-2 mb-8">UV Balloon & Decoration</p>

          <div className="w-full mb-6 p-4 bg-[#FF9A9E]/5 border border-pink-100 rounded-2xl flex gap-3 text-gray-500 text-xs leading-relaxed">
            <AlertCircle size={18} className="text-[#FF9A9E] flex-shrink-0" />
            <div>
              Sign in with your administrator credentials configured in the environment variables.
            </div>
          </div>

          {loginError && (
            <div className="w-full mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="admin@uvdecor.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none transition-all text-sm"
              />
            </div>
            <button 
              type="submit" 
              disabled={submittingLogin}
              className="w-full py-5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {submittingLogin ? <Loader2 className="animate-spin" /> : "Sign In to Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Navigation Links
  const menuLinks = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "hero", label: "Hero Section", icon: <Globe size={18} /> },
    { id: "themes", label: "Themes", icon: <Sparkles size={18} /> },
    { id: "pricing", label: "Pricing Packages", icon: <DollarSign size={18} /> },
    { id: "addons", label: "Add-ons", icon: <Plus size={18} /> },
    { id: "portfolio", label: "Portfolio", icon: <Briefcase size={18} /> },
    { id: "testimonials", label: "Testimonials", icon: <MessageSquare size={18} /> },
    { id: "contact", label: "Submissions & Info", icon: <PhoneCall size={18} /> },
    { id: "media", label: "Media Library", icon: <ImageIcon size={18} /> },
    { id: "seo", label: "SEO Settings", icon: <Globe size={18} /> },
    { id: "settings", label: "Website Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Toast popup */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <CheckCircle2 size={20} className={toast.type === "success" ? "text-green-600" : "text-red-600"} />
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* --- SIDEBAR MENU --- */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-pink-100/50 shadow-soft flex flex-col justify-between p-6 transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="space-y-8">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#FF9A9E] to-[#FECFEF] rounded-full flex items-center justify-center shadow">
              <span className="text-white font-bold text-lg">UV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg leading-none text-gray-800">Admin Studio</span>
              <span className="text-[10px] uppercase tracking-widest text-[#FF9A9E] font-bold mt-1">Management v1.0</span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            {menuLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === link.id ? "bg-pink-50/50 text-[#FF9A9E]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info / Logout */}
        <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600">
              AD
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-gray-700 truncate">{user.email}</span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">MongoDB Connected</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-3.5 rounded-xl border border-rose-100 text-rose-600 bg-rose-50/20 hover:bg-rose-50 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:text-rose-700 transition-colors"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/20 z-30 md:hidden" />
      )}

      {/* --- MAIN PORTAL SCREEN --- */}
      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-heading font-bold text-gray-800 capitalize">
              {menuLinks.find(l => l.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <Eye size={14} /> Preview Website
            </a>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-6 md:p-10 relative">
          {dataLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-30 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary w-10 h-10" />
            </div>
          )}

          {/* Tab 1: Dashboard Stats */}
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Themes</span>
                    <h3 className="text-3xl font-heading font-bold mt-2 text-gray-800">{dbData.themes.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-pink-50 text-[#FF9A9E] rounded-2xl flex items-center justify-center"><Sparkles size={24} /></div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pricing Cards</span>
                    <h3 className="text-3xl font-heading font-bold mt-2 text-gray-800">{dbData.pricing.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-pink-50 text-[#FF9A9E] rounded-2xl flex items-center justify-center"><DollarSign size={24} /></div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Portfolio Items</span>
                    <h3 className="text-3xl font-heading font-bold mt-2 text-gray-800">{dbData.portfolio.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-pink-50 text-[#FF9A9E] rounded-2xl flex items-center justify-center"><Briefcase size={24} /></div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Reviews</span>
                    <h3 className="text-3xl font-heading font-bold mt-2 text-gray-800">{dbData.testimonials.length}</h3>
                  </div>
                  <div className="w-12 h-12 bg-pink-50 text-[#FF9A9E] rounded-2xl flex items-center justify-center"><MessageSquare size={24} /></div>
                </div>
              </div>

              {/* Submissions Overview */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft">
                <h3 className="text-xl font-heading font-bold mb-6 text-gray-800">Recent Contact Inquiries</h3>
                
                {dbData.contact?.submissions?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                      <thead className="text-xs text-gray-400 uppercase tracking-widest bg-gray-55/50 border-b border-gray-100">
                        <tr>
                          <th className="py-4 px-6">Name</th>
                          <th className="py-4 px-6">Email</th>
                          <th className="py-4 px-6">Event Details</th>
                          <th className="py-4 px-6">Budget</th>
                          <th className="py-4 px-6">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {dbData.contact.submissions.slice(0, 5).map((sub) => (
                          <tr key={sub.id} className="hover:bg-gray-50/50">
                            <td className="py-4 px-6 font-bold text-gray-800">{sub.name}</td>
                            <td className="py-4 px-6">{sub.email}</td>
                            <td className="py-4 px-6">
                              <span className="font-semibold text-primary capitalize">{sub.eventType}</span> at <span className="italic">{sub.venue}</span>
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-700">${sub.budget}</td>
                            <td className="py-4 px-6 text-xs">{new Date(sub.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">No contact inquiries yet.</div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Hero Editor */}
          {activeTab === "hero" && (
            <div className="max-w-4xl bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-100 shadow-soft">
              <form onSubmit={handleHeroSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Heading Title</label>
                  <input 
                    type="text" 
                    value={heroForm.heading}
                    onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Subheading Description</label>
                  <textarea 
                    rows={4}
                    value={heroForm.subheading}
                    onChange={(e) => setHeroForm({ ...heroForm, subheading: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm font-medium leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">CTA Button Text</label>
                    <input 
                      type="text" 
                      value={heroForm.ctaText}
                      onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                      required
                      className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Hero Image Location</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={heroForm.heroImage}
                        onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                        required
                        className="flex-1 p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                      />
                      <label className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl cursor-pointer flex items-center justify-center transition-colors">
                        <Upload size={18} />
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await uploadImage(e.target.files[0]);
                              if (url) setHeroForm({ ...heroForm, heroImage: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-10 py-4 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Save Hero Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Themes Management */}
          {activeTab === "themes" && (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button 
                  onClick={() => handleOpenThemeModal()}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-soft hover:shadow-lg transition-all"
                >
                  <Plus size={18} /> Add New Theme
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbData.themes.map((theme) => (
                  <div key={theme.id} className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden group">
                    <div className="relative h-48 w-full">
                      <Image src={theme.image} alt={theme.name} fill className="object-cover" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold text-gray-800">{theme.name}</h3>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{theme.desc}</p>
                      <div className="mt-6 flex justify-end gap-3">
                        <button 
                          onClick={() => handleOpenThemeModal(theme)}
                          className="p-3 bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#FF9A9E] rounded-xl transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => triggerDelete("theme", theme.id, theme.name)}
                          className="p-3 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Pricing Management */}
          {activeTab === "pricing" && (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button 
                  onClick={() => handleOpenPricingModal()}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-soft hover:shadow-lg transition-all"
                >
                  <Plus size={18} /> Add Service Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dbData.pricing.map((pkg) => (
                  <div key={pkg.id} className={`bg-white rounded-3xl p-8 border shadow-soft relative flex flex-col justify-between ${pkg.recommended ? "border-[#FF9A9E] ring-2 ring-[#FF9A9E]/10" : "border-gray-100"}`}>
                    {pkg.recommended && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        Recommended
                      </span>
                    )}
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-gray-800">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-gray-700 mt-2">{pkg.price}</div>
                      <ul className="mt-6 space-y-3.5">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="text-gray-500 text-sm flex gap-2 font-medium">
                            <span className="text-primary font-bold">✓</span> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-50">
                      <button 
                        onClick={() => handleOpenPricingModal(pkg)}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#FF9A9E] rounded-xl transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => triggerDelete("pricing", pkg.id, pkg.name)}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Addons */}
          {activeTab === "addons" && (
            <div className="space-y-8 max-w-4xl">
              <div className="flex justify-end">
                <button 
                  onClick={() => handleOpenAddonModal()}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-soft hover:shadow-lg transition-all"
                >
                  <Plus size={18} /> Add Popular Add-on
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft">
                <div className="divide-y divide-gray-50">
                  {dbData.addons.map((addon) => (
                    <div key={addon.id} className="py-5 flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{addon.name}</h4>
                        <span className="text-primary font-bold text-sm mt-1 block">{addon.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenAddonModal(addon)}
                          className="p-3 bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#FF9A9E] rounded-xl transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => triggerDelete("addon", addon.id, addon.name)}
                          className="p-3 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Portfolio Management */}
          {activeTab === "portfolio" && (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button 
                  onClick={() => handleOpenPortfolioModal()}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-soft hover:shadow-lg transition-all"
                >
                  <Plus size={18} /> Add Portfolio Item
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbData.portfolio.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden group">
                    <div className="relative h-56 w-full">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-6 flex justify-between items-center">
                      <h4 className="font-heading font-bold text-gray-800 truncate flex-1 pr-4">{item.title}</h4>
                      <button 
                        onClick={() => triggerDelete("portfolio", item.id, item.title)}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Testimonials Management */}
          {activeTab === "testimonials" && (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button 
                  onClick={() => handleOpenTestimonialModal()}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-soft hover:shadow-lg transition-all"
                >
                  <Plus size={18} /> Add Client Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbData.testimonials.map((test) => (
                  <div key={test.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3.5 mb-6">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image src={test.avatar} alt={test.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm leading-none">{test.name}</h4>
                          <span className="text-[#FF9A9E] text-xs font-bold mt-1.5 block">{test.role}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm italic leading-relaxed">&ldquo;{test.text}&rdquo;</p>
                      <div className="mt-4 text-amber-400 font-bold text-sm">Rating: {test.rating} / 5</div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end gap-3">
                      <button 
                        onClick={() => handleOpenTestimonialModal(test)}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#FF9A9E] rounded-xl transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => triggerDelete("testimonial", test.id, test.name)}
                        className="p-3 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 8: Contact Submissions & Info */}
          {activeTab === "contact" && (
            <div className="space-y-10">
              <div className="max-w-4xl bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-100 shadow-soft">
                <h3 className="text-xl font-heading font-bold mb-6 text-gray-800">Operational Contact Details</h3>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">WhatsApp / Phone Number</label>
                      <input 
                        type="text" 
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        required
                        className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Operational Email</label>
                      <input 
                        type="email" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Physical Address</label>
                    <input 
                      type="text" 
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      required
                      className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit" 
                      className="px-10 py-4 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft"
                    >
                      Update Details
                    </button>
                  </div>
                </form>
              </div>

              {/* Submissions logs */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft">
                <h3 className="text-xl font-heading font-bold mb-6 text-gray-800 font-heading">Complete Inquiries Submissions</h3>
                {dbData.contact?.submissions?.length > 0 ? (
                  <div className="space-y-4">
                    {dbData.contact.submissions.map((sub) => (
                      <div key={sub.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800">{sub.name}</span>
                            <span className="text-xs text-gray-400 bg-white border px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                              {sub.eventType}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 block mt-1">{sub.email}</span>
                          <p className="text-gray-500 text-sm mt-3 font-medium">
                            Venue: <span className="text-gray-700 italic">{sub.venue}</span> | Budget: <span className="text-primary font-bold">${sub.budget}</span>
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">
                            <Calendar size={12} /> {new Date(sub.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">No contact inquiries.</div>
                )}
              </div>
            </div>
          )}

          {/* Tab 9: Media Library */}
          {activeTab === "media" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Copy URL links to paste in forms</span>
                <label className="px-6 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-2xl font-bold flex items-center gap-2 shadow-soft hover:shadow-lg transition-all cursor-pointer">
                  {uploadingFile ? <Loader2 className="animate-spin" /> : <><Upload size={18} /> Upload Image</>}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        await uploadImage(e.target.files[0]);
                        showToast("Image uploaded to library!");
                      }
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {dbData.media.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden flex flex-col justify-between group">
                    <div className="relative h-40 w-full bg-gray-50">
                      <Image src={item.url} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-4 bg-white flex flex-col justify-between flex-1 border-t border-gray-50">
                      <span className="text-gray-600 text-xs truncate font-bold font-heading">{item.name}</span>
                      <div className="mt-4 flex gap-2 justify-end">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            showToast("URL copied to clipboard!");
                          }}
                          title="Copy Image URL"
                          className="p-3 bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-[#FF9A9E] rounded-xl transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          onClick={() => triggerDelete("media", item.id, item.name)}
                          title="Delete from Media Library"
                          className="p-3 bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 10: SEO Settings */}
          {activeTab === "seo" && (
            <div className="max-w-4xl bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-100 shadow-soft">
              <form onSubmit={handleSeoSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Meta Title</label>
                  <input 
                    type="text" 
                    value={seoForm.title}
                    onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Meta Description</label>
                  <textarea 
                    rows={4}
                    value={seoForm.description}
                    onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm font-medium leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Meta Keywords (Comma separated)</label>
                  <input 
                    type="text" 
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Social Sharing Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={seoForm.shareImage}
                      onChange={(e) => setSeoForm({ ...seoForm, shareImage: e.target.value })}
                      required
                      className="flex-1 p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                    <label className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl cursor-pointer flex items-center justify-center transition-colors">
                      <Upload size={18} />
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await uploadImage(e.target.files[0]);
                            if (url) setSeoForm({ ...seoForm, shareImage: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-10 py-4 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft"
                  >
                    Save SEO settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 11: Website Settings */}
          {activeTab === "settings" && (
            <div className="max-w-4xl bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-100 shadow-soft">
              <form onSubmit={handleSettingsSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Logo Text</label>
                    <input 
                      type="text" 
                      value={settingsForm.logoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                      required
                      className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Logo Subtitle</label>
                    <input 
                      type="text" 
                      value={settingsForm.logoSub}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoSub: e.target.value })}
                      required
                      className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Footer Copyright Text</label>
                  <input 
                    type="text" 
                    value={settingsForm.footerText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Branding Color: Primary</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                        className="w-14 h-14 rounded-2xl border border-gray-200 cursor-pointer overflow-hidden p-0 bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                        required
                        className="flex-1 p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Branding Color: Secondary</label>
                    <div className="flex gap-4">
                      <input 
                        type="color" 
                        value={settingsForm.secondaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                        className="w-14 h-14 rounded-2xl border border-gray-200 cursor-pointer overflow-hidden p-0 bg-transparent"
                      />
                      <input 
                        type="text" 
                        value={settingsForm.secondaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, secondaryColor: e.target.value })}
                        required
                        className="flex-1 p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Social Networking URLs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Instagram Link</label>
                      <input 
                        type="text" 
                        value={settingsForm.instagram}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Facebook Link</label>
                      <input 
                        type="text" 
                        value={settingsForm.facebook}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Pinterest Link</label>
                      <input 
                        type="text" 
                        value={settingsForm.pinterest}
                        onChange={(e) => setSettingsForm({ ...settingsForm, pinterest: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">LinkedIn Link</label>
                      <input 
                        type="text" 
                        value={settingsForm.linkedin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, linkedin: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-gray-55 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-10 py-4 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft"
                  >
                    Save All Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* --- CRUD MODAL POPUP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-xl shadow-2xl border border-pink-50 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-heading font-bold text-gray-800 capitalize">
                {editingItem.id ? "Edit" : "Add"} {modalType}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-150 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            {modalType === "theme" && (
              <form onSubmit={handleThemeSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Theme Name</label>
                  <input 
                    type="text" 
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Theme Description</label>
                  <textarea 
                    value={editingItem.desc}
                    onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })}
                    required
                    rows={3}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      required
                      className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                    <label className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl cursor-pointer flex items-center justify-center transition-colors">
                      <Upload size={18} />
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await uploadImage(e.target.files[0]);
                            if (url) setEditingItem({ ...editingItem, image: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600">Cancel</button>
                  <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft">Save Theme</button>
                </div>
              </form>
            )}

            {modalType === "pricing" && (
              <form onSubmit={handlePricingSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Package Name</label>
                  <input 
                    type="text" 
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Price Label</label>
                  <input 
                    type="text" 
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Included Features (one per line)</label>
                  <textarea 
                    value={editingItem.featuresString}
                    onChange={(e) => setEditingItem({ ...editingItem, featuresString: e.target.value })}
                    required
                    rows={4}
                    placeholder="2 Organic Balloon Pillars&#10;Standard Color Palette"
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="recommended"
                    checked={editingItem.recommended}
                    onChange={(e) => setEditingItem({ ...editingItem, recommended: e.target.checked })}
                    className="w-5 h-5 accent-primary border-gray-300 rounded"
                  />
                  <label htmlFor="recommended" className="text-sm font-bold text-gray-500 select-none cursor-pointer">Highlight as &ldquo;Most Popular&rdquo;</label>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600">Cancel</button>
                  <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft">Save Package</button>
                </div>
              </form>
            )}

            {modalType === "addon" && (
              <form onSubmit={handleAddonSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Add-on Name</label>
                  <input 
                    type="text" 
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Price Label</label>
                  <input 
                    type="text" 
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600">Cancel</button>
                  <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft">Save Add-on</button>
                </div>
              </form>
            )}

            {modalType === "portfolio" && (
              <form onSubmit={handlePortfolioSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Item Title</label>
                  <input 
                    type="text" 
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Category</label>
                  <select 
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  >
                    <option value="Birthdays">Birthdays</option>
                    <option value="Weddings">Weddings</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Baby Shower">Baby Shower</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Image URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      required
                      className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                    <label className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl cursor-pointer flex items-center justify-center transition-colors">
                      <Upload size={18} />
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await uploadImage(e.target.files[0]);
                            if (url) setEditingItem({ ...editingItem, image: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600">Cancel</button>
                  <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft">Save Portfolio</button>
                </div>
              </form>
            )}

            {modalType === "testimonial" && (
              <form onSubmit={handleTestimonialSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Client Name</label>
                    <input 
                      type="text" 
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      required
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Role / Label</label>
                    <input 
                      type="text" 
                      value={editingItem.role}
                      onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                      required
                      placeholder="Bride, Corporate Lead..."
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Rating</label>
                  <select 
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Review Content</label>
                  <textarea 
                    value={editingItem.text}
                    onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                    required
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Avatar Link</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={editingItem.avatar}
                      onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value })}
                      required
                      className="flex-1 p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF9A9E] outline-none text-sm"
                    />
                    <label className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl cursor-pointer flex items-center justify-center transition-colors">
                      <Upload size={18} />
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await uploadImage(e.target.files[0]);
                            if (url) setEditingItem({ ...editingItem, avatar: url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600">Cancel</button>
                  <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-white rounded-full font-bold shadow-soft">Save Review</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- CONFIRMATION DELETE MODAL --- */}
      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-red-50 text-center">
            <h3 className="text-2xl font-heading font-bold text-gray-800 mb-2">Are you absolutely sure?</h3>
            <p className="text-gray-500 text-sm mb-8">
              This action will permanently delete <span className="font-bold text-red-600">{confirmDelete.label}</span>. This cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setConfirmDelete({ open: false, type: "", id: "", label: "" })}
                className="px-6 py-3.5 bg-gray-100 text-gray-600 rounded-full font-bold text-sm"
              >
                No, Keep it
              </button>
              <button 
                onClick={executeDelete}
                className="px-8 py-3.5 bg-rose-600 text-white rounded-full font-bold text-sm shadow-lg hover:bg-rose-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
