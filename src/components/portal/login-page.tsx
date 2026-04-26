'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVSUALStore } from '@/lib/store';
import Image from 'next/image';

interface LoginPageProps {
  mode: 'vsual-login' | 'nxl-login';
}

export function LoginPage({ mode }: LoginPageProps) {
  const setAppMode = useVSUALStore((s) => s.setAppMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isNxl = mode === 'nxl-login';
  const title = isNxl ? 'NXL BYLDR' : 'VSUAL OS';
  const accentColor = isNxl ? 'bg-[#D6006E]' : 'bg-emerald-500';
  const hoverColor = isNxl ? 'hover:bg-[#E8007A]' : 'hover:bg-emerald-400';
  const textColor = isNxl ? 'text-white' : 'text-[#0A0A0A]';
  const borderColor = isNxl ? 'border-[#D6006E]/30 focus-visible:ring-[#D6006E]' : 'border-emerald-500/30 focus-visible:ring-emerald-500';
  const glowColor = isNxl ? 'rgba(214,0,110,0.15)' : 'rgba(16,185,129,0.15)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a brief loading state, then route
    setTimeout(() => {
      setAppMode(isNxl ? 'nxl' : 'vsual');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: glowColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Glassmorphism Card */}
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div
                className="absolute inset-0 rounded-xl blur-lg"
                style={{ background: isNxl ? 'rgba(214,0,110,0.2)' : 'rgba(16,185,129,0.2)' }}
              />
              <Image
                src="/vsual-logo.png"
                alt="VSUAL"
                width={48}
                height={48}
                className="relative h-12 w-12 rounded-xl"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#F0EEE8] tracking-tight">{title}</h1>
            <p className="text-sm text-[#F0EEE8]/40 mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F0EEE8]/60 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-11 rounded-xl bg-white/[0.06] border-white/10 text-[#F0EEE8] placeholder:text-[#F0EEE8]/25 ${borderColor} transition-all`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F0EEE8]/60 text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`h-11 rounded-xl bg-white/[0.06] border-white/10 text-[#F0EEE8] placeholder:text-[#F0EEE8]/25 ${borderColor} transition-all`}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${accentColor} ${hoverColor} ${textColor} font-semibold h-11 rounded-xl transition-all duration-300 mt-2`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setAppMode('landing')}
              className="text-sm text-[#F0EEE8]/30 hover:text-[#F0EEE8]/60 transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
