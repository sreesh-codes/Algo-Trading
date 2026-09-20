"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    studentId: "",
    degree: "",
    graduationYear: "",
    phone: "",
    country: "",
    githubUsername: "",
    codingExperience: "",
    quantExperience: "",
    agreedToTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl text-center shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-amber-500" />
          <CheckCircle2 className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-chakra-petch)]">
            Registration Successful
          </h2>
          <p className="text-gray-300 mb-8 font-mono text-sm leading-relaxed">
            Your profile has been created. You can now sign in with your registered email to access the competition environment.
          </p>
          <Link
            href="/login"
            className="block w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors font-[family-name:var(--font-chakra-petch)] tracking-widest"
          >
            PROCEED TO LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] py-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 mb-2 font-[family-name:var(--font-chakra-petch)] uppercase">
            Candidate Registration
          </h1>
          <p className="text-gray-400 font-mono">Dubai 2035 — Algorithmic Trading Challenge</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-t-2xl" />

          {error && (
            <div className="mb-8 p-4 bg-red-950/50 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-chakra-petch)] border-b border-white/10 pb-2">
                01 // PERSONAL DETAILS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">FULL NAME *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">EMAIL ADDRESS *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">PASSWORD *</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">PHONE NUMBER *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">COUNTRY</label>
                  <input name="country" value={formData.country} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-amber-400 font-[family-name:var(--font-chakra-petch)] border-b border-white/10 pb-2">
                02 // ACADEMIC PROFILE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">UNIVERSITY *</label>
                  <input required name="university" value={formData.university} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">STUDENT ID *</label>
                  <input required name="studentId" value={formData.studentId} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">DEGREE / PROGRAM *</label>
                  <input required name="degree" value={formData.degree} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">GRADUATION YEAR *</label>
                  <input required name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="e.g. 2026" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Optional Details */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-gray-300 font-[family-name:var(--font-chakra-petch)] border-b border-white/10 pb-2">
                03 // BACKGROUND (OPTIONAL)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 font-mono mb-1">GITHUB USERNAME</label>
                  <input name="githubUsername" value={formData.githubUsername} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">CODING EXPERIENCE</label>
                  <select name="codingExperience" value={formData.codingExperience} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gray-400 focus:outline-none transition-colors">
                    <option value="">Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-mono mb-1">QUANT/FINANCE EXPERIENCE</label>
                  <select name="quantExperience" value={formData.quantExperience} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gray-400 focus:outline-none transition-colors">
                    <option value="">Select Level</option>
                    <option value="none">None</option>
                    <option value="some">Some coursework</option>
                    <option value="extensive">Extensive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-start">
                  <input
                    type="checkbox"
                    required
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded border border-white/30 bg-black/50 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                  </div>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-tight">
                  I agree to the competition rules, terms of service, and acknowledge that all trading activity will be monitored and logged for evaluation purposes.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.agreedToTerms}
              className="w-full relative group overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-amber-600 p-[1px] mt-8"
            >
              <div className="w-full bg-black/50 backdrop-blur-sm p-4 rounded-[7px] transition-all group-hover:bg-transparent group-disabled:opacity-50 group-disabled:cursor-not-allowed">
                <span className="font-bold tracking-widest text-white font-[family-name:var(--font-chakra-petch)] text-lg">
                  {isSubmitting ? "PROCESSING..." : "REGISTER FOR THE CHALLENGE"}
                </span>
              </div>
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>ALREADY REGISTERED?</p>
            <Link 
              href="/login" 
              className="mt-2 inline-block text-amber-400 hover:text-amber-300 transition-colors font-bold tracking-wider hover:underline underline-offset-4"
            >
              SIGN IN HERE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
