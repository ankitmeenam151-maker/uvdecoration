"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { CelebrationContext } from "@/context/CelebrationContext";

export default function Hero({ data }) {
  const { openBooking } = useContext(CelebrationContext);
  const heading = data?.heading || "Elevate Your Celebrations with Premium Decor";
  const subheading = data?.subheading || "Transforming ordinary spaces into extraordinary memories with our 100% custom, artisanal balloon designs.";
  const ctaText = data?.ctaText || "Get Custom Quote";
  const heroImage = data?.heroImage || "/images/hero.png";

  const handleCTAClick = () => {
    openBooking();
  };

  return (
    <section className="relative min-h-[90vh] lg:h-[calc(100vh-80px)] lg:min-h-[600px] flex items-center pt-24 lg:pt-32 pb-12 px-6 lg:px-20 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Bookings Open for 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-text-main mb-4 lg:mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-lg leading-relaxed font-body">
            {subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full font-semibold shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group glow-primary hover-lift cursor-pointer"
            >
              View Portfolio
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative h-[350px] lg:h-[calc(100vh-280px)] lg:max-h-[500px] lg:min-h-[380px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40"
        >
          <Image
            src={heroImage}
            alt="Organic Balloon Arch"
            fill
            className="object-cover floating"
            priority
          />
          {/* Floating decorative elements */}
          <motion.div 
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl pointer-events-none" 
          />
          <motion.div 
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" 
          />
        </motion.div>
      </div>

      {/* Background Decor: slow moving light leak blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] -z-10 ambient-blob" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/6 rounded-full blur-[100px] -z-10 ambient-blob" style={{ animationDelay: "-5s" }} />
      <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-primary-light/8 rounded-full blur-[90px] -z-10 ambient-blob" style={{ animationDelay: "-10s" }} />
    </section>
  );
}
