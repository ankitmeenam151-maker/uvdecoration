"use client";

import { useState } from "react";
import { dbService } from "@/services/dbService";

export default function ReviewForm() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    rating: 5,
    text: "",
    avatar: ""
  });
  const [status, setStatus] = useState({ message: "", success: true, show: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value
    }));
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      await dbService.addTestimonial({ ...form, approved: false });
      setStatus({ show: true, success: true, message: "Review submitted successfully! It will appear once approved by the admin." });
      setForm({ name: "", role: "", rating: 5, text: "", avatar: "" });
    } catch (err) {
      console.error(err);
      setStatus({ show: true, success: false, message: "Failed to submit review" });
    }
    setTimeout(() => setStatus((s) => ({ ...s, show: false })), 4000);
  };

  const handleCancel = () => {
    setForm({ name: "", role: "", rating: 5, text: "", avatar: "" });
    setStatus({ show: true, success: true, message: "Review submission cancelled" });
    setTimeout(() => setStatus((s) => ({ ...s, show: false })), 3000);
  };

  return (
    <section className="py-6 lg:py-8 px-6 lg:px-12 bg-white rounded-[2.5rem] shadow-soft border border-gray-100/50 max-w-2xl mx-auto">
      <h3 className="text-2xl lg:text-3xl font-heading text-center mb-4 lg:mb-6 text-text-main">
        Leave a Review
      </h3>
      {status.show && (
        <div
          className={`p-3 mb-4 rounded-2xl text-sm font-semibold text-center border ${
            status.success 
              ? "bg-green-50 text-green-600 border-green-100" 
              : "bg-red-50 text-red-600 border-red-100"
          }`}
        >
          {status.message}
        </div>
      )}
      <form className="space-y-3 lg:space-y-4 max-w-xl mx-auto text-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all duration-300 font-body placeholder:text-gray-400 text-sm"
          />
          <input
            type="text"
            name="role"
            placeholder="Your Role (e.g., Bride)"
            required
            value={form.role}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all duration-300 font-body placeholder:text-gray-400 text-sm"
          />
        </div>
        <textarea
          name="text"
          placeholder="Your review"
          required
          rows={3}
          value={form.text}
          onChange={handleChange}
          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all duration-300 font-body placeholder:text-gray-400 resize-none text-sm"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="url"
            name="avatar"
            placeholder="Avatar Image URL (optional)"
            value={form.avatar}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all duration-300 font-body placeholder:text-gray-400 text-sm"
          />
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 transition-all duration-300 font-body cursor-pointer text-sm"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>
        </div>
        <div className="pt-1 space-y-2">
          <button
            type="submit"
            onClick={handleApprove}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-full shadow-soft hover:shadow-lg hover:opacity-95 transition-all duration-300 uppercase tracking-widest text-xs cursor-pointer text-center glow-primary"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-text-main font-bold rounded-full uppercase tracking-widest text-xs transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
