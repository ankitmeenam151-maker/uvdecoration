"use client";

import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageSquare, MapPin, Send, CheckCircle2, Loader2, Clock, Sparkles } from "lucide-react";
import { dbService } from "@/services/dbService";
import { CelebrationContext } from "@/context/CelebrationContext";

export default function BookingForm({ contactInfo }) {
  const { selectedPackage } = useContext(CelebrationContext);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Pre-fill message if a package was selected
  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        message: `Hi! I would like to get a quote and details for the "${selectedPackage}" package. Let's discuss details!`
      }));
    }
  }, [selectedPackage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dbService.addContactSubmission({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        notes: selectedPackage ? `Pre-selected Package: ${selectedPackage}` : ""
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const phoneNum = contactInfo?.phone || "+91 62661 74324";
  const emailAddr = contactInfo?.email || "info@uvballonsanddecoration.shop";
  const addressLoc = contactInfo?.address || "Dongargaon Main Road, Rajnandgaon District, Chhattisgarh, 491661";
  
  // Format WhatsApp Link
  const cleanPhone = "916266174324";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20UV%20Balloon%20and%20Decoration!%20I'd%20like%20to%20inquire%20about%20your%20services.`;

  return (
    <section className="py-6 px-2 bg-transparent text-text-main">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel: Contact Information (Animated glassmorphic card) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-gradient-to-br from-primary/10 via-primary-light/5 to-secondary/15 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden border border-primary/20 flex flex-col justify-between"
          >
            {/* Animated glowing ambient blobs in background */}
            <motion.div 
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" 
            />
            <motion.div 
              animate={{ y: [0, 15, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-16 -right-16 w-56 h-56 bg-secondary/20 rounded-full blur-3xl pointer-events-none" 
            />

            {/* Header Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/25 mb-6">
                <Sparkles size={14} className="text-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Get in Touch</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading mb-4 leading-tight">Let's Create Magic Together</h2>
              <p className="text-gray-500 text-sm font-body leading-relaxed max-w-sm">
                Have an event in mind? Contact us today to plan a beautiful customized balloon decoration that fits your dream theme.
              </p>
            </div>

            {/* Info Cards */}
            <div className="my-10 space-y-6 relative z-10">
              {/* WhatsApp Option */}
              <motion.a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-5 p-4 rounded-2xl bg-white/70 hover:bg-white border border-white/50 shadow-soft hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">WhatsApp Chat</span>
                  <span className="font-semibold text-sm hover:text-primary transition-colors">Message Us Directly</span>
                </div>
              </motion.a>

              {/* Call Option */}
              <motion.a 
                href={`tel:${phoneNum}`}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-5 p-4 rounded-2xl bg-white/70 hover:bg-white border border-white/50 shadow-soft hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Phone Number</span>
                  <span className="font-semibold text-sm hover:text-primary transition-colors">{phoneNum}</span>
                </div>
              </motion.a>

              {/* Email Option */}
              <motion.a 
                href={`mailto:${emailAddr}`}
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-5 p-4 rounded-2xl bg-white/70 hover:bg-white border border-white/50 shadow-soft hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary-dark flex items-center justify-center flex-shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</span>
                  <span className="font-semibold text-sm hover:text-primary transition-colors break-all">{emailAddr}</span>
                </div>
              </motion.a>

              {/* Location Option */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/30 border border-white/20">
                <div className="w-12 h-12 rounded-xl bg-gray-400/10 text-gray-500 flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Our Location</span>
                  <span className="text-gray-600 text-xs font-medium leading-tight">{addressLoc}</span>
                </div>
              </div>
            </div>

            {/* Footer Clock Info */}
            <div className="relative z-10 border-t border-primary/10 pt-6 flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <Clock size={16} className="text-primary" />
              <span>Response Time: Under 24 Hours</span>
            </div>
          </motion.div>

          {/* Right Panel: Animated Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-center p-2"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl md:text-3xl font-heading mb-2">Send a Message</h3>
                  <p className="text-gray-500 text-sm mb-8 font-body">Complete the form below and our design specialists will reach out to you.</p>

                  {/* Pre-selected Package Notification */}
                  {selectedPackage && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-sm text-text-main flex items-center gap-3"
                    >
                      <Sparkles className="text-primary animate-bounce flex-shrink-0" size={18} />
                      <span>You selected the <strong className="text-primary">{selectedPackage}</strong> package! Fill details below to customize it.</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        required
                        className="w-full p-4.5 rounded-2xl bg-gray-50/50 border border-gray-200/80 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="john@example.com" 
                          required
                          className="w-full p-4.5 rounded-2xl bg-gray-50/50 border border-gray-200/80 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="+1 (555) 000-0000" 
                          required
                          className="w-full p-4.5 rounded-2xl bg-gray-50/50 border border-gray-200/80 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Message / Inquiry details */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Event Details & Message</label>
                      <textarea 
                        rows={4}
                        placeholder="Tell us about your event theme, balloon colors, or questions..." 
                        required
                        className="w-full p-4.5 rounded-2xl bg-gray-50/50 border border-gray-200/80 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 resize-none font-body text-sm leading-relaxed"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-primary to-primary-light text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover-lift transition-all duration-300 flex items-center justify-center gap-2 glow-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            <Send size={18} /> Submit Inquiry
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                /* Success Screen */
                <motion.div 
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="text-center py-10 px-4"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 size={42} className="animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-heading mb-3 text-text-main">Inquiry Received!</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 font-body leading-relaxed">
                    Thank you, <strong className="text-primary">{formData.name}</strong>. Our custom decor experts have received your event details and will send a personalized quote to <strong className="text-text-main">{formData.email}</strong> within 24 hours.
                  </p>
                  <button 
                    onClick={() => {
                      setFormData({ name: "", email: "", phone: "", message: "" });
                      setSubmitted(false);
                    }}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200/80 text-text-main rounded-full font-bold transition-colors cursor-pointer text-xs uppercase tracking-widest shadow-sm"
                  >
                    Send Another Inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
