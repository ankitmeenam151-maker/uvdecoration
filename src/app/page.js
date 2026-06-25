"use client";

import { useState, useEffect, useContext } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Themes from "@/components/Themes";
import Pricing from "@/components/Pricing";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import ReviewsList from "@/components/ReviewsList";
import FAQ from "@/components/FAQ";
import BookingForm from "@/components/BookingForm";
import StartPlanningForm from "@/components/StartPlanningForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingBalloons from "@/components/celebration/FloatingBalloons";


import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { dbService } from "@/services/dbService";
import { CelebrationContext } from "@/context/CelebrationContext";
import { SEED_DATA } from "@/lib/seedData";

export default function Home() {
  const { isBookingOpen, openBooking, closeBooking, isPlanningOpen, closePlanning } = useContext(CelebrationContext);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isBookingOpen || isPlanningOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBookingOpen, isPlanningOpen]);

  const [dbData, setDbData] = useState({
    hero: SEED_DATA.hero,
    themes: SEED_DATA.themes,
    pricing: SEED_DATA.pricing,
    addons: SEED_DATA.addons,
    portfolio: SEED_DATA.portfolio,
    testimonials: SEED_DATA.testimonials,
    contact: SEED_DATA.contact,
    settings: SEED_DATA.settings,
    seo: SEED_DATA.seo
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAllData() {
      try {
        const [hero, themes, pricing, addons, portfolio, testimonials, contact, settings, seo] = await Promise.all([
          dbService.getHero(),
          dbService.getThemes(),
          dbService.getPricing(),
          dbService.getAddons(),
          dbService.getPortfolio(),
          dbService.getTestimonials(),
          dbService.getContact(),
          dbService.getSettings(),
          dbService.getSeo()
        ]);
        
        setDbData({ hero, themes, pricing, addons, portfolio, testimonials, contact, settings, seo });
        
        // Dynamically apply SEO title & metadata
        if (seo) {
          document.title = seo.title || "UV Balloon and Decoration | Premium Event Decor";
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", seo.description || "");
          }
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (metaKeywords) {
            metaKeywords.setAttribute("content", seo.keywords || "");
          } else {
            const meta = document.createElement("meta");
            meta.name = "keywords";
            meta.content = seo.keywords || "";
            document.head.appendChild(meta);
          }
        }
      } catch (err) {
        console.error("Error loading frontend data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("openBooking") === "true") {
        openBooking();
        // Clean URL query parameters
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [openBooking]);

  useEffect(() => {
    if (dbData.settings) {
      if (dbData.settings.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', dbData.settings.primaryColor);
      }
      if (dbData.settings.secondaryColor) {
        document.documentElement.style.setProperty('--color-secondary', dbData.settings.secondaryColor);
      }
    }
  }, [dbData.settings]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <h2 className="font-heading text-2xl text-text-main animate-pulse">UV Balloon & Decor</h2>
        <span className="text-xs uppercase tracking-widest text-primary font-bold mt-2">Loading Luxury Experience...</span>
      </div>
    );
  }

  return (
    <main className="relative">
      <FloatingBalloons />
      <Header settings={dbData.settings} />
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-[100] origin-left"
        style={{ scaleX }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Hero data={dbData.hero} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Themes themesList={dbData.themes} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Pricing packagesList={dbData.pricing} addonsList={dbData.addons} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Portfolio portfolioItemsList={dbData.portfolio} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <Testimonials testimonialsList={dbData.testimonials} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <ReviewsList testimonials={dbData.testimonials} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <FAQ />
      </motion.div>



      {/* Footer */}
      <footer className="py-20 px-6 lg:px-20 bg-text-main text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading mb-6 italic text-primary-light">
            {dbData.settings?.logoText || "UV Balloon and Decoration"}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-10">
            {dbData.settings?.footerDescription || "Crafting luxury balloon installations for life's most precious moments. Available for events worldwide."}
          </p>
          <div className="flex justify-center items-center gap-6 mb-12">
            {Object.entries(dbData.settings?.socialLinks || {})
              .filter(([platform]) => !['linkedin', 'pinterest', 'facebook'].includes(platform.toLowerCase()))
              .map(([platform, url]) => {
                if (!url) return null;
                
                const isInstagram = platform.toLowerCase() === 'instagram';
                const isWhatsApp = platform.toLowerCase() === 'whatsapp';
                
                if (isInstagram) {
                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-transparent transition-all duration-300 overflow-hidden shadow-lg cursor-pointer"
                    >
                      {/* Glow effect */}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-60 blur-md bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] transition-opacity duration-300" />
                      
                      {/* Background gradient overlay */}
                      <span className="absolute inset-0 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Inner border/mask to keep background dark except when hovered */}
                      <span className="absolute inset-[1.5px] bg-text-main rounded-[15px] z-10 group-hover:bg-transparent transition-colors duration-300" />
                      
                      <span className="relative z-20 text-white">
                        <svg
                          className="w-7 h-7 stroke-current fill-none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </span>
                    </motion.a>
                  );
                }

                if (isWhatsApp) {
                  return (
                    <motion.a
                      key={platform}
                      href={platform.toLowerCase() === 'whatsapp' ? "https://wa.me/916266174324" : url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-transparent transition-all duration-300 overflow-hidden shadow-lg cursor-pointer"
                    >
                      {/* Glow effect */}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-60 blur-md bg-gradient-to-tr from-[#128c7e] to-[#25d366] transition-opacity duration-300" />
                      
                      {/* Background gradient overlay */}
                      <span className="absolute inset-0 bg-gradient-to-tr from-[#128c7e] to-[#25d366] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Inner border/mask to keep background dark except when hovered */}
                      <span className="absolute inset-[1.5px] bg-text-main rounded-[15px] z-10 group-hover:bg-transparent transition-colors duration-300" />
                      
                      <span className="relative z-20 text-white">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </span>
                    </motion.a>
                  );
                }

                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 cursor-pointer"
                  >
                    {platform}
                  </motion.a>
                );
              })}
          </div>
  <div className="pt-8 border-t border-white/10 text-xs text-gray-500 uppercase tracking-widest">
    {dbData.settings?.footerText || "© 2026 UV Balloon and Decoration. All Rights Reserved."}
    <div className="mt-2 text-sm text-gray-500 uppercase tracking-widest">
        <a href="https://www.leovantagewebstudio.com/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary transition-colors">leovantagewebstudio.com</a>
    </div>
  </div>
        </div>
      </footer>

      <WhatsAppButton phone={dbData.contact?.phone} />

      {/* Contact Us Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-text-main/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeBooking}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-[2.5rem] shadow-glass border border-white/20 w-full max-w-5xl relative p-1 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeBooking}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-text-main flex items-center justify-center transition-all duration-300 z-50 cursor-pointer shadow-sm hover:shadow"
              >
                <X size={20} />
              </button>
              <div className="overflow-y-auto max-h-[85vh] p-2">
                <BookingForm contactInfo={dbData.contact} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Planning Wizard Modal */}
      <AnimatePresence>
        {isPlanningOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-text-main/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={closePlanning}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-[2.5rem] shadow-glass border border-white/20 w-full max-w-3xl relative p-1 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closePlanning}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-text-main flex items-center justify-center transition-all duration-300 z-50 cursor-pointer shadow-sm hover:shadow"
              >
                <X size={20} />
              </button>
              <div className="overflow-y-auto max-h-[85vh] p-2">
                <StartPlanningForm />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
