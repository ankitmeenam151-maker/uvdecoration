"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function ReviewsList({ testimonials }) {
  // Filter for only approved testimonials
  const approvedReviews = (testimonials || []).filter(t => t.approved);

  if (approvedReviews.length === 0) {
    return null; // Don't render the section if there are no approved reviews
  }

  return (
    <section id="reviews-list" className="py-20 px-6 lg:px-20 bg-gray-50/30 border-t border-b border-gray-100/50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Star size={14} className="text-primary fill-current" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Client Love</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading mb-2 text-text-main">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm lg:text-base font-body">
            Real feedback from families and clients who celebrated their special moments with us.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedReviews.map((review, idx) => (
            <motion.div
              key={review.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-gray-100/80 shadow-soft hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-6 right-6 text-primary/10">
                <Quote size={40} className="fill-current" />
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4 text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < (review.rating || 5) ? "fill-current" : "opacity-30"}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed italic font-body mb-6 relative z-10">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.name)}`;
                      }}
                    />
                  ) : (
                    <div className="font-bold text-primary text-sm uppercase">
                      {review.name ? review.name.slice(0, 2) : "UV"}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-text-main text-sm lg:text-base leading-snug">
                    {review.name}
                  </h4>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider block mt-0.5">
                    {review.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
