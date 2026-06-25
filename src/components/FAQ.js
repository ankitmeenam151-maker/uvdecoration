"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqsList = [
  {
    q: "What is the price range of balloon decoration in Dongargaon?",
    a: "Our premium balloon decoration in Dongargaon starts from standard home setups to full room luxury packages. Contact us for a free quote tailored to your budget."
  },
  {
    q: "Which is the best event decoration company in Chhattisgarh?",
    a: "UV Balloon & Decoration is highly recognized as a leading event decoration company in Chhattisgarh, serving Dongargaon, Rajnandgaon, Bhilai, Raipur, and Durg with luxury installations."
  },
  {
    q: "Do you provide wedding decoration in Dongargaon and Rajnandgaon?",
    a: "Yes, we provide complete, customized wedding decoration in Dongargaon and Rajnandgaon, specializing in luxury gold and rose pink themes."
  },
  {
    q: "How can I book the best balloon decorator in Dongargaon for a birthday party?",
    a: "You can easily book the best balloon decorator in Dongargaon by clicking our WhatsApp Enquiries button or using our online Planning Wizard for same-day booking enquiries."
  },
  {
    q: "Do you offer birthday decoration near me in Bhilai and Raipur?",
    a: "Absolutely! We serve Bhilai, Raipur, Durg, Rajnandgaon, and nearby areas, making us the top choice when searching for premium birthday decoration near me."
  },
  {
    q: "What makes you a premium event decorator near me?",
    a: "We use double-stuffed pastel balloons, premium chrome gold accents, and customizable gold backdrops to create high-end, luxury event aesthetics."
  },
  {
    q: "Can we order custom theme decorations for corporate events?",
    a: "Yes, we design corporate event decoration in Chhattisgarh, including custom themes, showroom grand openings, and hotel setups."
  },
  {
    q: "Are your decorations safe for hotel rooms?",
    a: "Yes! Our hotel event decoration uses freestanding frames and stands, ensuring zero damage to hotel property."
  },
  {
    q: "Do you offer home decoration services in Dongargaon?",
    a: "Yes, we offer complete home decoration services in Dongargaon, including surprise room decorations and baby shower setups."
  },
  {
    q: "Do you support same-day booking enquiries?",
    a: "We accommodate same-day booking enquiries for birthday party decoration in Dongargaon depending on availability."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 lg:px-20 bg-gray-50/50">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <HelpCircle size={14} className="text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-heading mb-4 text-text-main">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto font-body text-sm lg:text-base">
            Everything you need to know about our event planning, custom themes, and balloon decoration services.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqsList.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl border border-gray-100/80 overflow-hidden shadow-soft transition-all duration-300 ${isOpen ? "ring-2 ring-primary/15 border-transparent shadow-md" : "hover:border-gray-200/50"}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-6 px-8 flex justify-between items-center text-left gap-4 font-semibold text-text-main hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="font-heading text-lg lg:text-xl leading-snug">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-6 pt-1 text-gray-600 font-body text-sm lg:text-base leading-relaxed border-t border-gray-50/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
