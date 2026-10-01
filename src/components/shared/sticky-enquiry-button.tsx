"use client";

import { useState, useTransition } from "react";
import { X, Phone, MessageSquare, Send, CheckCircle2, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { submitEnquiry } from "@/actions/enquiry.actions";
import { toast } from "sonner";

export function StickyEnquiryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("Class I - V (Primary)");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    startTransition(async () => {
      const res = await submitEnquiry({
        name,
        phone,
        email,
        grade,
        message,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        setSubmitted(true);
        toast.success("Enquiry submitted successfully!");
      }
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      }, 300);
    }
  };

  return (
    <>
      {/* 
        STICKY ENQUIRE NOW BUTTON
        Exact styling from user's screenshot:
        - Maroon (#680000 / #932248) background
        - Crisp white text "Enquire Now!"
        - Fixed sticky on the right edge of viewport
        - Elevation and interactive hover
      */}
      <aside aria-label="Quick Enquiry" className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center bg-[#680000] hover:bg-[#6c1641] text-white font-medium text-sm sm:text-base px-4 sm:px-5 py-3 sm:py-3.5 rounded-l-xl shadow-2xl transition-all duration-300 hover:-translate-x-1.5 active:scale-95 cursor-pointer border-t border-b border-l border-white/20 select-none"
          title="Click to submit an admission enquiry"
        >
          {/* Subtle pulse indicator */}
          <span className="absolute -top-1 -left-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A72C] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4A72C]" />
          </span>

          <span className="tracking-wide font-semibold text-white drop-shadow-xs">
            Enquire Now!
          </span>
        </button>
      </aside>

      {/* ENQUIRY MODAL BACKDROP & DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#680000] via-[#8A0000] to-[#680000] text-white px-6 py-5 relative border-b-2 border-[#D4A72C]">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 text-[#D4A72C] text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Admissions 2026–27 Open</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Admission &amp; School Enquiry
              </h2>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                Siddharth International School, Nangal, Udaipurwati
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Enquiry Received!</h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-slate-800">{name}</span>. Your enquiry has been received and routed to{" "}
                    <span className="font-bold text-[#680000]">SISNANGAL@gmail.com</span>. Our admissions counselor will contact you shortly on{" "}
                    <span className="font-semibold text-slate-800">{phone}</span>.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <a
                      href="tel:+917568419751"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#680000] text-white text-xs font-bold hover:bg-[#6c1641] transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Now: +91 7568419751</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Parent / Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#680000]/30 focus:border-[#680000] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        maxLength={15}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#680000]/30 focus:border-[#680000] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Class / Grade Interested In
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#680000]/30 focus:border-[#680000] transition-all"
                      >
                        <option value="Pre-Primary (Nursery, LKG, UKG)">Pre-Primary (Nursery, LKG, UKG)</option>
                        <option value="Class I - V (Primary)">Class I - V (Primary)</option>
                        <option value="Class VI - VIII (Middle)">Class VI - VIII (Middle)</option>
                        <option value="Class IX - X (Secondary)">Class IX - X (Secondary)</option>
                        <option value="Class XI - XII (Science)">Class XI - XII (Science)</option>
                        <option value="Class XI - XII (Commerce / Arts)">Class XI - XII (Commerce / Arts)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#680000]/30 focus:border-[#680000] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Specific Query / Message <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask about fee structure, transport, admissions..."
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#680000]/30 focus:border-[#680000] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#680000] to-[#8A0000] hover:from-[#6c1641] hover:to-[#680000] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting to SISNANGAL@gmail.com...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    Enquiries are dispatched to official desk at <span className="text-slate-600 font-medium">SISNANGAL@gmail.com</span>
                  </p>
                </form>
              )}

              {/* Direct helpline alternative */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-medium">Direct Admissions Helpline:</span>
                <div className="flex items-center gap-3">
                  <a
                    href="tel:+917568419751"
                    className="font-bold text-[#680000] hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>7568419751</span>
                  </a>
                  <span>•</span>
                  <a
                    href="mailto:SISNANGAL@gmail.com?subject=Admission%20Enquiry%20-%20Siddharth%20International%20School"
                    className="font-bold text-[#680000] hover:underline"
                  >
                    SISNANGAL@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
