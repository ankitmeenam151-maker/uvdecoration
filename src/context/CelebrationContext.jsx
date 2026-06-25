"use client";
import React, { createContext, useState, useEffect, useCallback } from 'react';

// Context holds theme (day/night), discount generation, confetti trigger, booking modal state, and planning modal state
export const CelebrationContext = createContext({
  isNight: false,
  generateDiscount: () => ({ discount: 0, code: '' }),
  triggerConfetti: () => {},
  isBookingOpen: false,
  selectedPackage: "",
  openBooking: (pkgName = "") => {},
  closeBooking: () => {},
  isPlanningOpen: false,
  openPlanning: (pkgName = "") => {},
  closePlanning: () => {}
});

export const CelebrationProvider = ({ children }) => {
  const [isNight, setIsNight] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [isPlanningOpen, setIsPlanningOpen] = useState(false);

  // Detect system theme
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsNight(e.matches);
    setIsNight(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const generateDiscount = useCallback(() => {
    const discount = Math.floor(Math.random() * 15) + 1; // 1‑15%
    const code = `PARTY${discount}`;
    return { discount, code };
  }, []);

  const triggerConfetti = useCallback(() => {
    setConfettiKey((k) => k + 1);
  }, []);

  // Contact Us modal
  const openBooking = useCallback((pkgName = "") => {
    setSelectedPackage(pkgName);
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
    setSelectedPackage("");
  }, []);

  // Start Planning (wizard) modal
  const openPlanning = useCallback((pkgName = "") => {
    setSelectedPackage(pkgName);
    setIsPlanningOpen(true);
  }, []);

  const closePlanning = useCallback(() => {
    setIsPlanningOpen(false);
    setSelectedPackage("");
  }, []);

  return (
    <CelebrationContext.Provider value={{ 
      isNight, 
      generateDiscount, 
      triggerConfetti, 
      confettiKey,
      isBookingOpen,
      selectedPackage,
      openBooking,
      closeBooking,
      isPlanningOpen,
      openPlanning,
      closePlanning
    }}>
      {children}
    </CelebrationContext.Provider>
  );
};
