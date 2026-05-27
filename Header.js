"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Themes", href: "#themes" },
  { name: "Pricing", href: "#pricing" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact", href: "#booking-form" },
];

export default function Header({ settings }) {
  const initials = settings?.logoText 
    ? settings.logoText.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() 
    : "UV";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "top-4" : "top-0"
      )}
    >
      <nav 
        className={cn(
          "container mx-auto flex items-center justify-between transition-all duration-500",
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-glass border border-white/40 rounded-[2rem] px-8 py-3 max-w-6xl" 
            : "bg-transparent px-0 py-2"
        )}
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary to-primary-light rounded-full flex items-center justify-center shadow-soft group-hover:rotate-12 transition-transform duration-500">
              <span className="text-white font-bold text-xl tracking-tighter">{initials}</span>
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
          {navLinks.map((link, idx) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={(e) => link.href.startsWith("#") && scrollToSection(e, link.href)}
              className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
            </motion.a>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(255, 154, 158, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => scrollToSection(e, "#booking-form")}
            className="hidden sm:flex px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-soft hover:shadow-lg transition-all items-center gap-2 group"
          >
            Get Quote
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-text-main hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => link.href.startsWith("#") && scrollToSection(e, link.href)}
                  className="text-lg font-heading font-medium text-gray-700 hover:text-primary py-2"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={(e) => scrollToSection(e, "#booking-form")}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl font-bold shadow-soft"
              >
                Get Custom Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
