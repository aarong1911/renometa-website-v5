// components/RequestEstimateForm.tsx

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RequestEstimateForm({ userRequestId }: { userRequestId: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "", // Renamed from 'details' for consistency, but ensure your backend matches
    preferred_time: new Date(),
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for displaying submission errors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false); // Reset submitted status
    setError(null);     // Clear any previous errors

    try {
      // FIX: Changed the URL to the correct local Netlify function endpoint
      const res = await fetch("http://localhost:8888/.netlify/functions/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_request_id: userRequestId,
          // Ensure property names match your backend's expectation for the estimate_requests table
          // If 'notes' should be 'service_details' in DB, adjust here:
          service_details: form.notes, // Adjust if your backend expects 'service_details'
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.error || res.statusText || 'Unknown error during submission.';
        console.error("Failed to submit estimate:", errorData);
        setError(`Failed to submit: ${errorMessage}`);
      }
    } catch (err: any) {
      console.error("Network or unexpected error submitting estimate:", err);
      setError(`Network error: ${err.message || 'Please check your connection.'}`);
    }
  };

  // Render success message if submitted successfully
  if (submitted) {
    return <p className="text-green-600 font-semibold text-center py-4">✅ Thanks! We'll be in touch soon.</p>;
  }

  // Render form with error message if any
  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4 bg-gray-50 p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold text-center">Request an Estimate</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <input
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />
      <textarea
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px]"
        placeholder="Project details"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <div className="w-full">
        <DatePicker
          selected={form.preferred_time}
          onChange={(date: Date | null) => {
            setForm({ ...form, preferred_time: date || new Date() });
          }}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          popperPlacement="top-end" // Helps with positioning if keyboard covers it
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-700 transition-colors"
      >
        Book Estimate
      </button>
    </form>
  );
}