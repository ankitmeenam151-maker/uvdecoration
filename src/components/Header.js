"use client";
import { useState, useEffect, useContext } from "react";
import { CelebrationContext } from "@/context/CelebrationContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Themes", href: "#themes" },
  { name: "Pricing", href: "#pricing" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Our Team", href: "/our-team" },
  { name: "Contact", href: "#booking-form" },
];

export default function Header({ settings }) {
  const { openBooking, openPlanning } = useContext(CelebrationContext);
  const router = useRouter();
  const initials = settings?.logoText 
    ? settings.logoText.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : "UV";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Premium scrollspy logic to highlight current section
      const sections = ["themes", "pricing", "portfolio"];
      let currentSection = "home";
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.40) {
            currentSection = sectionId;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    const isHomePage = window.location.pathname === "/";

    if (href === "#booking-form") {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      if (isHomePage) {
        openBooking();
      } else {
        router.push("/?openBooking=true");
      }
      return;
    }

    if (href.startsWith("/")) {
      e.preventDefault();
      router.push(href);
      setIsMobileMenuOpen(false);
      return;
    }

    if (href.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      if (isHomePage) {
        if (href === "#") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          try {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
            }
          } catch (err) {
            console.error("Scroll to section failed:", err);
          }
        }
      } else {
        router.push(href === "#" ? "/" : `/${href}`);
      }
    }
  };

  const getSectionFromHref = (href) => {
    if (href === "#") return "home";
    return href.replace("#", "");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "top-2 lg:top-4" : "top-0"
      )}
    >
      <nav 
        className={cn(
          "relative container mx-auto flex items-center justify-between transition-all duration-500",
          isScrolled 
            ? "glass-premium rounded-[2rem] px-8 py-3 max-w-6xl" 
            : "bg-transparent px-0 py-2"
        )}
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
          onClick={(e) => handleNavClick(e, "#")}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-soft group-hover:rotate-12 transition-transform duration-500 bg-white border border-primary/20">
              <img src="/images/logo.jpg" alt="UV Logo" className="w-full h-full object-cover" />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-[-4px] border border-secondary/30 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl lg:text-2xl font-bold tracking-tight text-text-main leading-none">
              {settings?.logoText || <>Balloon <span className="text-primary">&</span> Decor</>}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary mt-1 opacity-80">{settings?.logoSub || "Premium Events"}</span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link, idx) => {
            const isLinkActive = activeSection === getSectionFromHref(link.href);
            return (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest transition-all relative py-2 group",
                  isLinkActive ? "text-primary" : "text-gray-500 hover:text-primary"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300",
                  isLinkActive ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                )} />
              </motion.a>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/start-planning')}
            className="hidden sm:flex px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-soft hover:shadow-lg transition-all items-center gap-2 group glow-primary cursor-pointer"
          >
            Get Quote
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-text-main hover:bg-gray-100/80 active:bg-gray-200/50 rounded-xl transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu inside relative nav */}
        <div
          className={cn(
            "lg:hidden absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-3xl shadow-xl overflow-hidden z-50 transition-all duration-300 transform origin-top",
            isMobileMenuOpen 
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          <div className="flex flex-col p-6 gap-3">
            {navLinks.map((link, idx) => {
              const isLinkActive = activeSection === getSectionFromHref(link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "text-lg font-heading font-medium py-2 px-4 rounded-xl transition-all duration-300 transform",
                    isLinkActive 
                      ? "text-primary bg-primary/5 translate-x-1" 
                      : "text-gray-700 hover:text-primary hover:bg-gray-50/50"
                  )}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${idx * 40}ms` : '0ms',
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)'
                  }}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
