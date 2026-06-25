import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { CelebrationProvider } from '@/context/CelebrationContext';
import GlobalClickRipple from '@/components/GlobalClickRipple';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Best Decoration Shop in Dongargaon Chhattisgarh | UV Balloon & Decoration",
  description: "Looking for the Best Balloon Decorator in Dongargaon? UV Balloon & Decoration is the top event decoration company in Chhattisgarh. Premium event decorator near me for weddings, birthdays, anniversaries, and custom themes in Dongargaon, Rajnandgaon, Durg, Bhilai & Raipur.",
  keywords: "Best Decoration Shop in Dongargaon Chhattisgarh, Best Balloon Decorator in Dongargaon, Balloon Decoration in Dongargaon, Birthday Decoration in Dongargaon, Event Decoration in Dongargaon, Wedding Decoration in Dongargaon, Premium Event Decorator in Dongargaon, Top Event Decoration Company in Dongargaon, Birthday Party Decoration in Dongargaon, Home Decoration Services in Dongargaon, Balloon Decoration in Rajnandgaon, Corporate Event Decoration in Chhattisgarh, Premium Event Decorator Near Me, Decoration Services Near Me, Best Event Planner in Chhattisgarh, Luxury Balloon Decoration Services",
  verification: {
    google: "Z_OTcCl9mFSaKkhy8MPK_20HI-FW7PbO9cNR9VE3N44",
  },
};

export default function RootLayout({ children }) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "UV Balloon & Decoration",
    "image": "https://uvballonsanddecoration.shop/images/hero.png",
    "@id": "https://uvballonsanddecoration.shop/#localbusiness",
    "url": "https://uvballonsanddecoration.shop",
    "telephone": "+916266174324",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Dongargaon Main Road",
      "addressLocality": "Dongargaon",
      "addressRegion": "Chhattisgarh",
      "postalCode": "491661",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.9708,
      "longitude": 80.8407
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.instagram.com/uv_decorations"
    ],
    "areaServed": [
      { "@type": "Place", "name": "Dongargaon" },
      { "@type": "Place", "name": "Rajnandgaon" },
      { "@type": "Place", "name": "Bhilai" },
      { "@type": "Place", "name": "Durg" },
      { "@type": "Place", "name": "Raipur" },
      { "@type": "Place", "name": "Chhattisgarh" }
    ]
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "UV Balloon & Decoration"
    },
    "serviceType": "Event Decoration Services",
    "areaServed": {
      "@type": "State",
      "name": "Chhattisgarh"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Event Decoration Catalog",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Birthday Decoration in Dongargaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Balloon Decoration in Dongargaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wedding Decoration in Dongargaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Baby Shower Decoration in Dongargaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Anniversary Decoration in Dongargaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Corporate Event Decoration in Chhattisgarh"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "School Event Decoration in Chhattisgarh"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Hotel Event Decoration in Chhattisgarh"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Theme Decorations in Dongargaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Surprise Room Decorations in Dongargaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Engagement Decorations in Rajnandgaon"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Welcome Baby Decorations in Rajnandgaon"
          }
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the price range of balloon decoration in Dongargaon?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our premium balloon decoration in Dongargaon starts from standard home setups to full room luxury packages. Contact us for a free quote tailored to your budget."
        }
      },
      {
        "@type": "Question",
        "name": "Which is the best event decoration company in Chhattisgarh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "UV Balloon & Decoration is highly recognized as a leading event decoration company in Chhattisgarh, serving Dongargaon, Rajnandgaon, Bhilai, Raipur, and Durg with luxury installations."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide wedding decoration in Dongargaon and Rajnandgaon?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide complete, customized wedding decoration in Dongargaon and Rajnandgaon, specializing in luxury gold and rose pink themes."
        }
      },
      {
        "@type": "Question",
        "name": "How can I book the best balloon decorator in Dongargaon for a birthday party?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can easily book the best balloon decorator in Dongargaon by clicking our WhatsApp Enquiries button or using our online Planning Wizard for same-day booking enquiries."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer birthday decoration near me in Bhilai and Raipur?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We serve Bhilai, Raipur, Durg, Rajnandgaon, and nearby areas, making us the top choice when searching for premium birthday decoration near me."
        }
      },
      {
        "@type": "Question",
        "name": "What makes you a premium event decorator near me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use double-stuffed pastel balloons, premium chrome gold accents, and customizable gold backdrops to create high-end, luxury event aesthetics."
        }
      },
      {
        "@type": "Question",
        "name": "Can we order custom theme decorations for corporate events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we design corporate event decoration in Chhattisgarh, including custom themes, showroom grand openings, and hotel setups."
        }
      },
      {
        "@type": "Question",
        "name": "Are your decorations safe for hotel rooms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our hotel event decoration uses freestanding frames and stands, ensuring zero damage to hotel property."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer home decoration services in Dongargaon?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer complete home decoration services in Dongargaon, including surprise room decorations and baby shower setups."
        }
      },
      {
        "@type": "Question",
        "name": "Do you support same-day booking enquiries?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accommodate same-day booking enquiries for birthday party decoration in Dongargaon depending on availability."
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} h-full`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <CelebrationProvider>{children}</CelebrationProvider>
        <GlobalClickRipple />
      </body>
    </html>
  );
}
