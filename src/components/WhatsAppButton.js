"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton({ phone }) {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Clean phone number: always use your WhatsApp number 916266174324
  const cleanedPhoneNumber = "916266174324";

  const message = encodeURIComponent("Hi, I want to inquire about balloon decoration!");
  const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${message}`;

  // Show button and tooltip after structured delays
  useEffect(() => {
    const btnTimer = setTimeout(() => {
      setVisible(true);
      const tooltipTimer = setTimeout(() => setShowTooltip(true), 1200);
      const hideTooltipTimer = setTimeout(() => setShowTooltip(false), 7000);
      
      return () => {
        clearTimeout(tooltipTimer);
        clearTimeout(hideTooltipTimer);
      };
    }, 1500);
    
    return () => clearTimeout(btnTimer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed z-[99999] bottom-6 right-6 flex items-center select-none pointer-events-none">
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="animate-tooltip bg-white text-text-main py-2 px-4 rounded-2xl shadow-xl border border-gray-100/80 flex items-center gap-2 mr-3 text-xs font-bold font-body"
          style={{
            boxShadow: "0 10px 30px -8px rgba(0, 0, 0, 0.08)",
            pointerEvents: "auto",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>Chat with us!</span>
        </div>
      )}

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[60px] h-[60px] bg-[#25D366] text-white rounded-full flex items-center justify-center relative pointer-events-auto"
        style={{
          boxShadow: "0 4px 24px rgba(37, 211, 102, 0.4), 0 8px 32px rgba(0,0,0,0.15)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
          animation: "whatsapp-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 32px rgba(37, 211, 102, 0.5), 0 12px 40px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(37, 211, 102, 0.4), 0 8px 32px rgba(0,0,0,0.15)";
        }}
        aria-label="Contact on WhatsApp"
      >
        {/* Pulsing ring animation */}
        <div 
          className="absolute inset-[-6px] border-2 border-[#25D366] rounded-full pointer-events-none"
          style={{
            animation: "pulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite"
          }}
        />
        
        {/* WhatsApp SVG Icon */}
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
