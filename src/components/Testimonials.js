"use client";

import ReviewForm from "@/components/ReviewForm";

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-0 lg:h-[calc(100vh-80px)] lg:min-h-[580px] flex items-center px-6 lg:px-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-4 lg:mb-6">
          <h2 className="text-3xl lg:text-4xl font-heading mb-2 text-text-main">Share Your Experience</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm lg:text-base font-body">
            We value your feedback! Let us know how we did for your celebration.
          </p>
        </div>
        
        <div className="mt-2 lg:mt-4">
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
