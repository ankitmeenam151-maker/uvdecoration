"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, ChevronLeft, Send, CheckCircle2, Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dbService } from "@/services/dbService";

export default function BookingForm({ contactInfo }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    eventType: "",
    venue: "",
    budget: 500,
    name: "",
    email: ""
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dbService.addContactSubmission({
        name: formData.name,
        email: formData.email,
        date: formData.date.toISOString(),
        eventType: formData.eventType,
        venue: formData.venue,
        budget: formData.budget
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Event Details", icon: <Calendar size={20} /> },
    { title: "Personal Info", icon: <CheckCircle2 size={20} /> }
  ];

  return (
    <section id="booking-form" className="py-24 px-6 lg:px-20 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading mb-4">Start Planning</h2>
          <p className="text-gray-500">Fill out our interactive wizard to get an instant estimate.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-50 p-6 flex justify-between px-10 lg:px-20 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-10" 
              initial={{ width: "0%" }}
              animate={{ width: submitted ? "100%" : `${(step / 2) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="relative z-20 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step > i ? "bg-primary text-white" : "bg-white text-gray-400 border border-gray-200"}`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step > i ? "text-primary" : "text-gray-400"}`}>{s.title}</span>
              </div>
            ))}
          </div>

          <div className="p-10 lg:p-20">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
                >
                  {step === 1 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Event Date</label>
                          <div className="relative">
                            <DatePicker
                              selected={formData.date}
                              onChange={(date) => setFormData({ ...formData, date })}
                              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary outline-none transition-all"
                              minDate={new Date()}
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Event Type</label>
                          <select 
                            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary outline-none transition-all appearance-none"
                            value={formData.eventType}
                            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                          >
                            <option value="">Select Category</option>
                            <option value="birthday">Birthday</option>
                            <option value="wedding">Wedding</option>
                            <option value="corporate">Corporate</option>
                            <option value="baby">Baby Shower</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Venue Details</label>
                        <input 
                          type="text" 
                          placeholder="Where is the magic happening?" 
                          className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary outline-none transition-all"
                          value={formData.venue}
                          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-sm font-bold uppercase tracking-wider text-gray-400">Budget Range</label>
                          <span className="text-primary font-bold text-xl">${formData.budget}+</span>
                        </div>
                        <input 
                          type="range" 
                          min="100" 
                          max="5000" 
                          step="100"
                          className="w-full accent-primary cursor-pointer"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                          <span>BASIC</span>
                          <span>STANDARD</span>
                          <span>PREMIUM</span>
                        </div>
                      </div>

                      <div className="pt-8">
                        <button 
                          type="button"
                          onClick={nextStep}
                          disabled={!formData.eventType || !formData.venue}
                          className="w-full py-5 bg-text-main text-white rounded-full font-bold shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          Continue to Details <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Your Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe" 
                          className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary outline-none transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="john@example.com" 
                          className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary outline-none transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="pt-8 flex gap-4">
                        <button 
                          type="button"
                          onClick={prevStep}
                          className="flex-1 py-5 bg-gray-100 text-text-main rounded-full font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <ChevronLeft size={20} /> Back
                        </button>
                        <button 
                          type="submit"
                          className="flex-[2] py-5 bg-gradient-to-r from-primary to-primary-light text-white rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit Inquiry</>}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-heading mb-4">Inquiry Received!</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-10">
                    Thank you, {formData.name}. Our premium design team will review your details and send a custom quote to {formData.email} within 24 hours.
                  </p>
                  <button 
                    onClick={() => { setStep(1); setSubmitted(false); }}
                    className="px-8 py-3 bg-gray-100 text-text-main rounded-full font-bold"
                  >
                    Send Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
