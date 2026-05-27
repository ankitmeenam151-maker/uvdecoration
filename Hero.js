"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Hero({ data }) {
  const heading = data?.heading || "Elevate Your Celebrations with Premium Decor";
  const subheading = data?.subheading || "Transforming ordinary spaces into extraordinary memories with our 100% custom, artisanal balloon designs.";
  const ctaText = data?.ctaText || "Get Custom Quote";
  const heroImage = data?.heroImage || "/images/hero.png";

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-form");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 px-6 lg:px-20 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Bookings Open for 2026</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-heading text-text-main mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-body">
            {subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToBooking}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full font-semibold shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {ctaText}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-white text-text-main border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              View Portfolio
            </button>
          </div>
        </motion.div>

        {/* Right Side: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-[400px] lg:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl"
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
            className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl" 
          />
          <motion.div 
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" 
          />
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
