"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-amber-500" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-widest text-white mb-2 font-[family-name:var(--font-chakra-petch)] uppercase">
              Dubai 2035
            </h1>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
              ENTER THE MARKET
            </h2>
            <p className="text-sm text-gray-400 mt-2 font-mono">
              "Your strategy starts here."
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">
                {error === "account_disabled" 
                  ? "Your account has been disabled. Please contact an administrator."
                  : "An error occurred during authentication."}
              </div>
            </div>
          )}

          <div className="space-y-4">

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoading(true);
                const form = e.currentTarget as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const password = (form.elements.namedItem('password') as HTMLInputElement).value;
                const callbackUrl = searchParams.get("callbackUrl") || "/profile";
                signIn("credentials", { email, password, callbackUrl });
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="Email address" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="space-y-1">
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="Password" 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 p-3 rounded-lg hover:bg-cyan-900/50 transition-colors font-bold tracking-wide mt-2"
              >
                EMAIL LOGIN
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>NOT REGISTERED YET?</p>
            <Link 
              href="/register" 
              className="mt-2 inline-block text-cyan-400 hover:text-cyan-300 transition-colors font-bold tracking-wider hover:underline underline-offset-4"
            >
              REGISTER FOR THE CHALLENGE
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 font-mono space-y-1">
          <p>REGISTERED CANDIDATES ONLY</p>
          <p>Algorithmic Trading Challenge</p>
          <p>BITS Dubai</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
        <div className="text-cyan-400 font-mono text-sm animate-pulse">LOADING MARKET GATEWAY...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
