"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { dbService } from "@/services/dbService";
import Header from "@/components/Header";
import Link from "next/link";
import { ArrowLeft, Star, Heart, Users, Award } from "lucide-react";

export default function OurTeamPage() {
  const [founder, setFounder] = useState(null);
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [founderData, teamData, settingsData] = await Promise.all([
          dbService.getFounder().catch(() => null),
          dbService.getTeam().catch(() => []),
          dbService.getSettings().catch(() => null),
        ]);
        setFounder(founderData);
        setTeam(Array.isArray(teamData) ? teamData : []);
        setSettings(settingsData);
      } catch (e) {
        console.error("Failed to load team data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <Header settings={settings} />

      {/* Hero Banner */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF9A9E]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Back button */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex justify-center mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF9A9E] transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="inline-flex items-center gap-2 bg-[#FF9A9E]/10 text-[#FF9A9E] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border border-[#FF9A9E]/20 mb-6"
          >
            <Heart size={14} fill="currentColor" />
            The People Behind the Magic
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37]">
              Talented
            </span>{" "}
            Team
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1.5}
            className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed"
          >
            Behind every stunning balloon arch and breathtaking event setup is a dedicated team of artists, dreamers, and detail-obsessed decorators.
          </motion.p>

          {/* Stats strip */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { icon: Star, label: "5-Star Events", value: "500+" },
              { icon: Users, label: "Happy Families", value: "1200+" },
              { icon: Award, label: "Years Experience", value: "10+" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF9A9E]/15 to-[#D4AF37]/15 flex items-center justify-center border border-[#FF9A9E]/20">
                  <Icon size={20} className="text-[#FF9A9E]" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#FF9A9E]/30 to-transparent" />
      </div>

      {/* Founder Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
              Leadership
            </span>
            <h2
              className="text-4xl font-bold text-gray-900 mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Meet the Founder
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-[#FF9A9E]/30 border-t-[#FF9A9E] rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.5}
              className="max-w-5xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-center bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100/50 overflow-hidden p-8 lg:p-12">
                {/* Founder Photo */}
                <div className="shrink-0">
                  <div className="relative w-56 h-56 lg:w-72 lg:h-72">
                    {/* Decorative rings */}
                    <div className="absolute inset-[-8px] rounded-full border-2 border-[#FF9A9E]/20 animate-spin" style={{ animationDuration: "12s" }} />
                    <div className="absolute inset-[-16px] rounded-full border border-[#D4AF37]/15 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />

                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF9A9E]/20 via-[#FDFCFB] to-[#D4AF37]/20 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                      {founder?.image ? (
                        <img
                          src={founder.image}
                          alt={founder?.name || "Founder"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-gray-300">
                          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-300">Photo Coming Soon</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Founder Details */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#D4AF37]/20 mb-4">
                    <Award size={12} />
                    {founder?.role || "Founder & Creative Director"}
                  </div>
                  <h2
                    className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {founder?.name || "Our Founder"}
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    {founder?.description ||
                      "With a passion for creating unforgettable celebrations, our founder has been transforming ordinary spaces into extraordinary memories for over a decade."}
                  </p>

                  {/* Decorative quote mark */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-[#FF9A9E] italic font-medium text-lg">
                      "Every celebration deserves to be extraordinary."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Team Members Section */}
      {!loading && team.length > 0 && (
        <section className="py-20 bg-gray-50/60">
          <div className="container mx-auto px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="text-center mb-16"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FF9A9E]">
                Our Crew
              </span>
              <h2
                className="text-4xl font-bold text-gray-900 mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Team Members
              </h2>
              <p className="text-gray-400 mt-3 max-w-lg mx-auto">
                A passionate group of artists and event specialists dedicated to making your day unforgettable.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member.id || i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.15}
                  className="group bg-white rounded-[2rem] shadow-lg shadow-gray-100/80 border border-gray-100/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Member Photo */}
                  <div className="relative h-64 bg-gradient-to-br from-[#FF9A9E]/10 to-[#D4AF37]/10 flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-300">
                        <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs font-medium">Photo Coming Soon</span>
                      </div>
                    )}

                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <div className="inline-flex items-center gap-1.5 bg-[#FF9A9E]/8 text-[#FF9A9E] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                      <Star size={10} fill="currentColor" />
                      {member.role || "Team Member"}
                    </div>
                    <h3
                      className="text-xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#FF9A9E] to-[#D4AF37] rounded-[2.5rem] p-12 lg:p-16 text-center text-white shadow-2xl shadow-[#FF9A9E]/20 relative overflow-hidden"
          >
            <div className="absolute top-[-30%] right-[-10%] w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-30%] left-[-10%] w-80 h-80 bg-black/5 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <h2
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ready to Create Something Beautiful?
              </h2>
              <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
                Let our team of passionate decorators turn your dream event into a reality.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-[#FF9A9E] font-bold px-8 py-4 rounded-full hover:shadow-xl hover:scale-[1.02] transition-all text-sm uppercase tracking-widest"
              >
                <Heart size={16} fill="currentColor" />
                Get Your Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        {settings?.footerText || "© 2026 UV Balloon and Decoration. All Rights Reserved."}
      </footer>
    </div>
  );
}
