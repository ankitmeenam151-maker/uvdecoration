"use client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BookingForm from '@/components/BookingForm';
import { Suspense } from 'react';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';

function StartPlanningContent() {
  const searchParams = useSearchParams();
  const pkg = searchParams.get('package') || 'Unknown';
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    async function loadContact() {
      try {
        const contact = await dbService.getContact();
        setContactInfo(contact);
      } catch (err) {
        console.error("Error loading contact info on planner:", err);
      }
    }
    loadContact();
  }, []);

  return (
    <div className="container mx-auto max-w-2xl text-center">
      <h1 className="text-4xl lg:text-5xl font-heading mb-4 text-primary">Start Planning</h1>
      <p className="text-lg text-gray-600 mb-8">
        You selected the <span className="font-bold text-primary">{pkg}</span> package.
      </p>
      {/* Render the full booking form here */}
      <BookingForm contactInfo={contactInfo} />
      <div className="mt-8">
        <Link href="/" className="text-primary hover:underline">
          ← Back to Packages
        </Link>
      </div>
    </div>
  );
}

export default function StartPlanningPage() {
  return (
    <section className="py-24 px-6 lg:px-20 bg-gray-50 min-h-screen">
      <Suspense fallback={<div className="text-center py-12 text-gray-500 font-bold uppercase tracking-wider animate-pulse">Loading Planner...</div>}>
        <StartPlanningContent />
      </Suspense>
    </section>
  );
}
