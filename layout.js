export const metadata = {
  title: "UV Balloon & Decor - Admin Portal",
  description: "Manage content, themes, portfolio, testimonials, and settings.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {children}
    </div>
  );
}
