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
    <section id="themes" className="py-24 px-6 lg:px-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
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
              whileHover={{ y: -10 }}
              className="min-w-[300px] lg:min-w-[400px] snap-center"
            >
              <div className="relative h-[300px] rounded-3xl overflow-hidden shadow-soft mb-4">
                <Image src={setup.image} alt={setup.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-xl font-heading">{setup.name}</h3>
                    <p className="text-white/80 text-sm">{setup.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Color Picker */}
        <div className="mt-20 p-8 lg:p-12 rounded-[2rem] bg-gray-50 border border-gray-100 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h3 className="text-3xl font-heading mb-6">Color Your Celebration</h3>
            <p className="text-gray-600 mb-8">
              Click up to 3 colors to see how they look together in a balloon bunch. 
              Our decorators will match these exactly to your venue.
            </p>
            <div className="flex flex-wrap gap-4">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.id}
                  onClick={() => toggleColor(swatch.color)}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 transition-all duration-300 transform hover:scale-110 shadow-sm",
                    selectedColors.includes(swatch.color) ? "border-primary scale-110 ring-4 ring-primary/20" : "border-transparent"
                  )}
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.name}
                />
              ))}
            </div>
            <div className="mt-8">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Selected Colors:</span>
              <div className="flex gap-3 mt-2">
                {selectedColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-medium text-gray-500 uppercase">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[300px] flex justify-center">
            {/* Balloon Bunch SVG */}
            <svg viewBox="0 0 200 300" className="w-full h-auto drop-shadow-2xl">
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.2"/>
                </filter>
              </defs>
              {/* String */}
              <path d="M100,200 Q100,250 80,300" stroke="#DDD" fill="none" strokeWidth="2" />
              <path d="M100,200 Q100,250 120,300" stroke="#DDD" fill="none" strokeWidth="2" />
              
              {/* Balloon 1 (Background) */}
              <motion.circle 
                cx="120" cy="140" r="45" 
                animate={{ fill: selectedColors[1] || selectedColors[0] }}
                transition={{ duration: 0.5 }}
                className="floating" style={{ animationDelay: "0.5s" }}
              />
              {/* Balloon 2 (Background) */}
              <motion.circle 
                cx="80" cy="140" r="45" 
                animate={{ fill: selectedColors[2] || selectedColors[0] }}
                transition={{ duration: 0.5 }}
                className="floating" style={{ animationDelay: "1s" }}
              />
              {/* Balloon 3 (Front) */}
              <motion.circle 
                cx="100" cy="100" r="50" 
                animate={{ fill: selectedColors[0] }}
                transition={{ duration: 0.5 }}
                className="floating"
              />
              
              {/* Gloss Highlights */}
              <ellipse cx="85" cy="80" rx="10" ry="15" fill="white" fillOpacity="0.3" transform="rotate(-30, 85, 80)" />
              <ellipse cx="65" cy="120" rx="8" ry="12" fill="white" fillOpacity="0.2" transform="rotate(-30, 65, 120)" />
              <ellipse cx="105" cy="120" rx="8" ry="12" fill="white" fillOpacity="0.2" transform="rotate(-30, 105, 120)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
