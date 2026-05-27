"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Bride",
    text: "UV Balloon and Decoration transformed our wedding venue into a fairytale. The organic arch was the talk of the night!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Marketing Director",
    text: "Professional, punctual, and incredibly creative. They handled our product launch decor with absolute perfection.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=michael"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Happy Parent",
    text: "The 1st birthday setup was beyond my expectations. My daughter loved the colors and the floating teddy bear balloon!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

export default function Testimonials({ testimonialsList }) {
  const reviews = testimonialsList || testimonials;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <section className="py-24 px-6 lg:px-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-heading mb-4">Kind Words from Clients</h2>
          <p className="text-gray-500">Real stories from the beautiful events we&apos;ve been part of.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${activeIdx * 100}%)` }}>
            {reviews.map((testimonial) => (
              <div key={testimonial.id} className="min-w-full px-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="bg-white p-10 lg:p-16 rounded-[3rem] shadow-soft border border-gray-100 flex flex-col items-center text-center relative"
                >
                  <Quote className="absolute top-10 left-10 text-primary/10 w-24 h-24 -z-0" />
                  
                  <div className="relative mb-8 p-1 rounded-full bg-gradient-to-tr from-primary to-secondary">
                    <Image src={testimonial.avatar} alt={testimonial.name} width={96} height={96} className="w-24 h-24 rounded-full border-4 border-white object-cover" unoptimized />
                  </div>

                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#D4AF37" color="#D4AF37" />
                    ))}
                  </div>

                  <p className="text-xl lg:text-2xl text-gray-700 italic font-body mb-8 relative z-10">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  <div>
                    <h4 className="text-xl font-heading font-bold">{testimonial.name}</h4>
                    <p className="text-primary font-medium text-sm tracking-widest uppercase mt-1">{testimonial.role}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-2 transition-all duration-500 rounded-full ${activeIdx === i ? "w-10 bg-primary" : "w-2 bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
