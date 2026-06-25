"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const trendingSetups = [
  { id: 1, name: "Pastel Dream", image: "/images/birthday.png", desc: "Soft hues for gentle celebrations." },
  { id: 2, name: "Golden Luxury", image: "/images/wedding.png", desc: "Metallic accents for premium events." },
  { id: 3, name: "Organic Blush", image: "/images/hero.png", desc: "Natural flow for any occasion." },
];

const colorSwatches = [
  { id: "gold", color: "#D4AF37", name: "Gold" },
  { id: "rose", color: "#FF9A9E", name: "Rose Pink" },
  { id: "white", color: "#FFFFFF", name: "White" },
  { id: "chrome", color: "#C0C0C0", name: "Chrome" },
  { id: "lavender", color: "#E6E6FA", name: "Lavender" },
  { id: "mint", color: "#98FF98", name: "Mint" },
];

export default function Themes({ themesList }) {
  const setups = themesList || trendingSetups;
  const [selectedColors, setSelectedColors] = useState(["#FF9A9E", "#D4AF37", "#FFFFFF"]);

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors.slice(-2), color]);
    }
  };

  return (
    <section id="themes" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-20 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-10 lg:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-heading mb-4"
          >
            Trending Themes
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover our most loved setups or create your own custom color palette below.
          </p>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x">
          {setups.map((setup) => (
            <motion.div
              key={setup.id}
              whileHover={{ y: -8 }}
              className="min-w-[300px] lg:min-w-[400px] snap-center hover-zoom"
            >
              <div className="relative h-[300px] rounded-[2.5rem] overflow-hidden shadow-soft mb-4 border border-gray-100/50">
                <Image src={setup.image} alt={setup.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-white text-2xl font-heading mb-1">{setup.name}</h3>
                    <p className="text-white/80 text-sm font-body">{setup.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Color Picker */}
        <div className="mt-16 p-6 lg:p-16 rounded-[2.5rem] lg:rounded-[3rem] bg-gray-50 border border-gray-100 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 overflow-hidden">
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-2xl lg:text-4xl font-heading mb-4 lg:mb-6">Color Your Celebration</h3>
            <p className="text-gray-600 mb-6 lg:mb-8 max-w-xl leading-relaxed font-body text-sm lg:text-base">
              Click up to 3 colors to see how they look together in a balloon bunch. 
              Our decorators will match these exactly to your venue.
            </p>
            <div className="flex flex-wrap gap-3 lg:gap-4">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.id}
                  onClick={() => toggleColor(swatch.color)}
                  className={cn(
                    "w-11 h-11 lg:w-12 lg:h-12 rounded-full border-4 transition-all duration-300 transform hover:scale-110 shadow-md cursor-pointer",
                    selectedColors.includes(swatch.color) 
                      ? "border-white scale-110 ring-4 ring-primary/30" 
                      : "border-white/20 hover:border-white"
                  )}
                  style={{ backgroundColor: swatch.color, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  title={swatch.name}
                />
              ))}
            </div>
            <div className="mt-6 lg:mt-8">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Selected Palette</span>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {selectedColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                    <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-[10px] lg:text-xs font-semibold text-gray-500 uppercase tracking-wider">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[280px] flex justify-center bg-white/60 p-8 rounded-3xl border border-white/50 shadow-sm">
            {/* Balloon Bunch SVG with grouped float animations */}
            <svg viewBox="0 0 200 320" className="w-full h-auto drop-shadow-2xl">
              {/* Strings */}
              <path d="M100,180 C100,240 120,240 120,320" stroke="#E2E8F0" fill="none" strokeWidth="2" />
              <path d="M100,180 C100,240 80,240 80,320" stroke="#E2E8F0" fill="none" strokeWidth="2" />
              <path d="M100,180 C100,240 100,240 100,320" stroke="#E2E8F0" fill="none" strokeWidth="2" />

              {/* Balloon 1 (Right back) */}
              <motion.g
                className="floating"
                style={{ transformOrigin: "120px 140px", animationDelay: "0.4s" }}
              >
                <motion.path
                  d="M 120,95 C 145,95 165,115 165,140 C 165,165 140,185 120,185 C 100,185 75,165 75,140 C 75,115 95,95 120,95 Z"
                  animate={{ fill: selectedColors[1] || selectedColors[0] }}
                  transition={{ duration: 0.5 }}
                />
                {/* Knot */}
                <polygon points="116,185 124,185 120,192" fill="#E2E8F0" />
                {/* Shine */}
                <ellipse cx="108" cy="115" rx="6" ry="10" fill="white" fillOpacity="0.25" transform="rotate(-30, 108, 115)" />
              </motion.g>

              {/* Balloon 2 (Left back) */}
              <motion.g
                className="floating"
                style={{ transformOrigin: "80px 140px", animationDelay: "0.8s" }}
              >
                <motion.path
                  d="M 80,95 C 105,95 125,115 125,140 C 125,165 100,185 80,185 C 60,185 35,165 35,140 C 35,115 55,95 80,95 Z"
                  animate={{ fill: selectedColors[2] || selectedColors[0] }}
                  transition={{ duration: 0.5 }}
                />
                {/* Knot */}
                <polygon points="76,185 84,185 80,192" fill="#E2E8F0" />
                {/* Shine */}
                <ellipse cx="68" cy="115" rx="6" ry="10" fill="white" fillOpacity="0.25" transform="rotate(-30, 68, 115)" />
              </motion.g>

              {/* Balloon 3 (Front Center) */}
              <motion.g
                className="floating"
                style={{ transformOrigin: "100px 100px" }}
              >
                <motion.path
                  d="M 100,50 C 127,50 150,72 150,100 C 150,128 122,150 100,150 C 78,150 50,128 50,100 C 50,72 73,50 100,50 Z"
                  animate={{ fill: selectedColors[0] }}
                  transition={{ duration: 0.5 }}
                />
                {/* Knot */}
                <polygon points="96,150 104,150 100,158" fill="#CBD5E1" />
                {/* Shine */}
                <ellipse cx="86" cy="74" rx="7" ry="12" fill="white" fillOpacity="0.3" transform="rotate(-30, 86, 74)" />
              </motion.g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
