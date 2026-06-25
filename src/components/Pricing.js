"use client";

import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { CelebrationContext } from "@/context/CelebrationContext";

const packages = [
  {
    name: "Basic",
    price: "From $199",
    features: [
      "2 Organic Balloon Pillars",
      "Standard Color Palette (2 Colors)",
      "Setup & Teardown (Standard Hours)",
      "Basic Photo Backdrop"
    ],
    recommended: false
  },
  {
    name: "Standard",
    price: "From $499",
    features: [
      "Full Organic Arch (8-10ft)",
      "Premium Chrome & Pastel Palette",
      "Custom Vinyl Lettering",
      "Themed Foil Balloons",
      "Priority Setup Slot"
    ],
    recommended: true
  },
  {
    name: "Premium",
    price: "From $999",
    features: [
      "Full Room Transformation",
      "Custom Floral & Foliage Mix",
      "Marquee Letters/Numbers",
      "Metallic & Glitter Accents",
      "On-site Styling Professional",
      "Next-day Teardown"
    ],
    recommended: false
  }
];

const addOns = [
  { id: "cake", name: "Cake Delivery", price: "+$50" },
  { id: "magician", name: "Magician", price: "+$150" },
  { id: "booth", name: "Photo Booth", price: "+$300" },
  { id: "puppet", name: "Puppet Show", price: "+$100" }
];

export default function Pricing({ packagesList, addonsList }) {
  const { openPlanning } = useContext(CelebrationContext);
  const pkgs = packagesList || packages;
  const listAddons = addonsList || addOns;
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <section id="pricing" className="py-16 lg:py-0 lg:h-[calc(100vh-80px)] lg:min-h-[620px] flex items-center px-6 lg:px-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl lg:text-4xl font-heading mb-2 lg:mb-3">Service Packages</h2>
          <p className="text-gray-500 text-sm lg:text-base">Transparent pricing for every scale of celebration.</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-10">
          {pkgs.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className={`relative p-6 lg:p-8 rounded-[2.5rem] bg-white border transition-all duration-300 ${
                pkg.recommended 
                  ? "border-primary/80 shadow-lg shadow-primary/5 ring-1 ring-primary/20" 
                  : "border-gray-100 shadow-soft hover:shadow-md"
              }`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-primary-light text-white px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-heading mb-1 lg:mb-2">{pkg.name}</h3>
              <div className="text-2xl lg:text-3xl font-bold text-text-main mb-4 lg:mb-5 tracking-tight">{pkg.price}</div>
              <ul className="space-y-2.5 lg:space-y-3 mb-6 lg:mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed font-body">
                    <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => openPlanning(pkg.name)}
                className={`w-full py-3 lg:py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-center block transition-all duration-300 cursor-pointer ${
                  pkg.recommended 
                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-soft hover:shadow-lg hover:opacity-95 glow-primary" 
                    : "bg-gray-100 text-text-main hover:bg-primary hover:text-white hover:shadow-md"
                }`}
              >
                Select Package
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => openPlanning()} 
            className="text-primary font-semibold hover:text-primary-light transition-colors flex items-center justify-center gap-2 group mx-auto cursor-pointer"
          >
            <span>Need something unique? Request a Custom Quote</span>
            <Info size={16} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
