"use client";

import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { useState } from "react";

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
  const pkgs = packagesList || packages;
  const listAddons = addonsList || addOns;
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <section id="pricing" className="py-24 px-6 lg:px-20 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading mb-4">Service Packages</h2>
          <p className="text-gray-500">Transparent pricing for every scale of celebration.</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pkgs.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`relative p-8 rounded-[2rem] bg-white border ${pkg.recommended ? "border-primary shadow-lg" : "border-gray-100 shadow-soft"}`}
            >
              {pkg.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-heading mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-text-main mb-6">{pkg.price}</div>
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                    <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-full font-bold transition-all ${pkg.recommended ? "bg-primary text-white shadow-soft" : "bg-gray-100 text-text-main hover:bg-gray-200"}`}>
                Select Package
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-12">
          <a href="#booking-form" className="text-primary font-semibold hover:underline flex items-center justify-center gap-2">
            Need something unique? Request a Custom Quote
            <Info size={16} />
          </a>
        </div>

        {/* Add-ons Section */}
        <div className="max-w-3xl mx-auto p-10 rounded-[2.5rem] bg-white shadow-soft border border-gray-50">
          <h3 className="text-2xl font-heading mb-8 text-center">Popular Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listAddons.map((addon) => (
              <div 
                key={addon.id}
                onClick={() => toggleAddOn(addon.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedAddOns.includes(addon.id) ? "border-primary bg-primary/5" : "border-gray-100 hover:border-primary/30"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedAddOns.includes(addon.id) ? "bg-primary border-primary" : "border-gray-300"}`}>
                    {selectedAddOns.includes(addon.id) && <Check size={14} className="text-white" />}
                  </div>
                  <span className="font-medium text-gray-700">{addon.name}</span>
                </div>
                <span className="text-primary font-bold text-sm">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
