"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import Image from "next/image";

const portfolioItems = [
  { id: 1, category: "Birthdays", image: "/images/birthday.png", title: "Pastel Princess 1st Birthday" },
  { id: 2, category: "Weddings", image: "/images/wedding.png", title: "Gold & White Elegant Arch" },
  { id: 3, category: "Baby Shower", image: "/images/babyshower.png", title: "Dreamy Cloud Setup" },
  { id: 4, category: "Corporate", image: "/images/hero.png", title: "Grand Opening Gala" },
  { id: 5, category: "Birthdays", image: "/images/after.png", title: "Luxury Living Room Party" },
  { id: 6, category: "Weddings", image: "/images/wedding.png", title: "Floral Fusion Wall" },
];

const categories = ["All", "Birthdays", "Weddings", "Corporate", "Baby Shower"];

export default function Portfolio({ portfolioItemsList }) {
  const items = portfolioItemsList || portfolioItems;
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [sliderPos, setSliderPos] = useState(50);

  const filteredItems = filter === "All" 
    ? items 
    : items.filter(item => item.category === filter);

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  return (
    <section id="portfolio" className="py-24 px-6 lg:px-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading mb-4">Our Visual Portfolio</h2>
          <p className="text-gray-500">A glimpse into the magic we create for our clients.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${filter === cat ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {/* Before & After Card (Special) */}
          <motion.div 
            layout
            className="break-inside-avoid rounded-3xl overflow-hidden shadow-soft border border-gray-100 group"
          >
            <div 
              className="relative h-[400px] cursor-ew-resize select-none overflow-hidden"
              onMouseMove={handleSliderMove}
              onTouchMove={(e) => handleSliderMove(e.touches[0])}
            >
              <Image src="/images/after.png" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt="After" />
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <Image src="/images/before.png" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt="Before" />
              </div>
              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-20 cursor-ew-resize"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-gray-300 rounded-full" />
                    <div className="w-1 h-4 bg-gray-300 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest pointer-events-none">Empty Room</div>
              <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest pointer-events-none">Decorated</div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="font-heading text-xl">The Transformation</h3>
              <p className="text-gray-500 text-sm mt-1">Drag the slider to see the magic.</p>
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid rounded-3xl overflow-hidden shadow-soft border border-gray-100 group relative"
              >
                <Image src={item.image} alt={item.title} width={600} height={400} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedImage(item)}
                    className="p-4 bg-white rounded-full text-primary shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                  >
                    <Maximize2 size={24} />
                  </button>
                </div>
                <div className="p-6 bg-white">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">{item.category}</span>
                  <h3 className="font-heading text-xl mt-1">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setSelectedImage(null)}
            >
              <button className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={32} />
              </button>
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={selectedImage.image} alt={selectedImage.title} width={1200} height={800} className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl" />
                <div className="mt-8 text-center text-white">
                  <h3 className="text-3xl font-heading">{selectedImage.title}</h3>
                  <p className="text-white/60 mt-2">{selectedImage.category}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
