"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
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

const enrichPortfolioItem = (item) => {
  if (item.similarImages && item.similarImages.length > 0) {
    return item;
  }

  const idStr = String(item.id);
  let similar = [];

  switch (idStr) {
    case "1": // Pastel Princess 1st Birthday
      similar = [
        "/images/birthday.png",
        "/images/portfolio/birthday_1.png",
        "/images/portfolio/livingroom_1.png",
        "/images/after.png",
        "/images/babyshower.png"
      ];
      break;
    case "2": // Gold & White Elegant Arch
      similar = [
        "/images/wedding.png",
        "/images/portfolio/wedding_1.png",
        "/images/portfolio/floral_1.png",
        "/images/hero.png",
        "/images/portfolio/corporate_1.png"
      ];
      break;
    case "3": // Dreamy Cloud Setup
      similar = [
        "/images/babyshower.png",
        "/images/portfolio/babyshower_1.png",
        "/images/portfolio/birthday_1.png",
        "/images/birthday.png",
        "/images/after.png"
      ];
      break;
    case "4": // Grand Opening Gala
      similar = [
        "/images/hero.png",
        "/images/portfolio/corporate_1.png",
        "/images/portfolio/wedding_1.png",
        "/images/wedding.png",
        "/images/portfolio/livingroom_1.png"
      ];
      break;
    case "5": // Luxury Living Room Party
      similar = [
        "/images/after.png",
        "/images/portfolio/livingroom_1.png",
        "/images/portfolio/birthday_1.png",
        "/images/birthday.png",
        "/images/before.png"
      ];
      break;
    case "6": // Floral Fusion Wall
      similar = [
        "/images/wedding.png",
        "/images/portfolio/floral_1.png",
        "/images/portfolio/wedding_1.png",
        "/images/portfolio/babyshower_1.png",
        "/images/babyshower.png"
      ];
      break;
    default:
      similar = [
        item.image,
        "/images/portfolio/birthday_1.png",
        "/images/portfolio/wedding_1.png",
        "/images/portfolio/babyshower_1.png",
        "/images/portfolio/livingroom_1.png"
      ];
  }

  return {
    ...item,
    similarImages: similar
  };
};

export default function Portfolio({ portfolioItemsList }) {
  const items = portfolioItemsList || portfolioItems;
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderContainerRef = useRef(null);

  const filteredItems = filter === "All" 
    ? items 
    : items.filter(item => item.category === filter);

  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  useEffect(() => {
    const container = sliderContainerRef.current;
    if (!container) return;

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        if (e.cancelable) {
          e.preventDefault();
        }
        const rect = container.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(percent);
      }
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [filter]);

  const handleNextImage = () => {
    if (!selectedImage || !selectedImage.similarImages) return;
    setActiveImageIndex((prev) => (prev + 1) % selectedImage.similarImages.length);
  };

  const handlePrevImage = () => {
    if (!selectedImage || !selectedImage.similarImages) return;
    setActiveImageIndex((prev) => (prev - 1 + selectedImage.similarImages.length) % selectedImage.similarImages.length);
  };

  return (
    <section id="portfolio" className="py-24 px-6 lg:px-20 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading mb-4">Our Visual Portfolio</h2>
          <p className="text-gray-500">A glimpse into the magic we create for our clients.</p>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center gap-4 mb-12 no-scrollbar px-4 -mx-6 md:mx-0 snap-x scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                if (window.innerWidth < 1024) {
                  setTimeout(() => {
                    const gridEl = document.getElementById("portfolio-grid");
                    if (gridEl) {
                      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }, 100);
                }
              }}
              className={`px-6 py-2 rounded-full font-medium transition-all snap-center whitespace-nowrap ${filter === cat ? "bg-primary text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div id="portfolio-grid" className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 scroll-mt-28">
          {/* Before & After Card (Special) - Only show when All is selected */}
          {filter === "All" && (
            <motion.div 
              layout
              className="break-inside-avoid rounded-[2.5rem] overflow-hidden shadow-soft border border-gray-100/50 group"
            >
              <div 
                ref={sliderContainerRef}
                className="relative h-[400px] cursor-ew-resize select-none overflow-hidden touch-pan-y"
                onMouseMove={(e) => handleSliderMove(e.clientX)}
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
                    {/* Pulse ring indicating interactivity */}
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping -z-10" />
                    <div className="flex gap-1.5">
                      <div className="w-1 h-3.5 bg-primary/45 rounded-full" />
                      <div className="w-1 h-3.5 bg-primary/45 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none">Empty Room</div>
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none">Decorated</div>
              </div>
              <div className="p-8 bg-white flex justify-between items-center">
                <div>
                  <h3 className="font-heading text-xl">The Transformation</h3>
                  <p className="text-gray-500 text-sm mt-1 font-body">Drag the slider to see the magic.</p>
                </div>
                <motion.button 
                  onClick={() => {
                    const enriched = enrichPortfolioItem({
                      id: "5", // Link to Living Room transformation set
                      category: "Transformation",
                      image: "/images/after.png",
                      title: "Room Transformation Gallery"
                    });
                    setSelectedImage(enriched);
                    setActiveImageIndex(0);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <Maximize2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="break-inside-avoid rounded-[2rem] overflow-hidden shadow-soft border border-gray-100/50 group relative hover-zoom hover-lift"
              >
                <div 
                  onClick={() => {
                    const enriched = enrichPortfolioItem(item);
                    setSelectedImage(enriched);
                    setActiveImageIndex(0);
                  }}
                  className="relative overflow-hidden w-full h-auto cursor-pointer"
                >
                  <Image src={item.image} alt={item.title} width={600} height={400} className="w-full h-auto object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-4.5 bg-white rounded-full text-primary shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                </div>
                <div className="p-6.5 bg-white">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-widest">{item.category}</span>
                  <h3 className="font-heading text-xl mt-1 text-text-main">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox with Side Scrollable Gallery */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button */}
              <motion.button 
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 cursor-pointer z-50 bg-black/40 backdrop-blur-sm"
              >
                <X size={28} />
              </motion.button>

              <motion.div
                initial={{ scale: 0.96, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative max-w-5xl w-full h-[85vh] flex flex-col justify-between items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Main Image and Navigation Area */}
                <div className="relative w-full flex-grow flex items-center justify-center min-h-[40vh] max-h-[60vh] md:max-h-[65vh]">
                  {/* Left Arrow */}
                  {selectedImage.similarImages && selectedImage.similarImages.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePrevImage}
                      className="absolute left-2 md:left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center border border-white/10 transition-all cursor-pointer"
                    >
                      <ChevronLeft size={24} />
                    </motion.button>
                  )}

                  {/* Main Image Frame */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImageIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <Image 
                          src={selectedImage.similarImages ? selectedImage.similarImages[activeImageIndex] : selectedImage.image} 
                          alt={`${selectedImage.title} - Image ${activeImageIndex + 1}`} 
                          fill
                          sizes="(max-width: 1024px) 100vw, 1024px"
                          className="object-contain" 
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right Arrow */}
                  {selectedImage.similarImages && selectedImage.similarImages.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNextImage}
                      className="absolute right-2 md:right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center border border-white/10 transition-all cursor-pointer"
                    >
                      <ChevronRight size={24} />
                    </motion.button>
                  )}
                </div>

                {/* Details and Thumbnails Side Scroller */}
                <div className="w-full text-center mt-4 mb-2 flex flex-col items-center">
                  <h3 className="text-xl md:text-2xl font-heading text-white px-4">{selectedImage.title}</h3>
                  <p className="text-primary-light font-bold text-xs uppercase tracking-widest mt-1 mb-4">{selectedImage.category}</p>
                  
                  {/* Side Scrolling Thumbnails */}
                  {selectedImage.similarImages && selectedImage.similarImages.length > 1 && (
                    <div 
                      className="flex gap-3 overflow-x-auto py-2 px-6 max-w-full justify-start md:justify-center select-none"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      {/* CSS helper to hide scrollbar in chrome/safari */}
                      <style jsx global>{`
                        .no-scrollbar::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      
                      <div className="flex gap-3 no-scrollbar overflow-x-auto pb-1">
                        {selectedImage.similarImages.map((imgUrl, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 cursor-pointer ${
                              activeImageIndex === index 
                                ? "border-primary shadow-[0_0_15px_rgba(255,154,158,0.7)] scale-105" 
                                : "border-white/10 hover:border-white/40 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image 
                              src={imgUrl} 
                              fill 
                              sizes="96px"
                              className="object-cover" 
                              alt={`Thumbnail ${index + 1}`} 
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
