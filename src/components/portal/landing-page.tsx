'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useVSUALStore } from '@/lib/store';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function LandingPage() {
  const setAppMode = useVSUALStore((s) => s.setAppMode);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0A0A0A] text-[#F0EEE8] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Cover image with overlay */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(/vsual-cover.jpg)' }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 via-transparent to-[#0A0A0A]/50" />
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo & Tagline */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center mb-12 sm:mb-16"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl scale-110" />
            <Image
              src="/vsual-logo.png"
              alt="VSUAL"
              width={80}
              height={80}
              className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
            <span className="text-[#F0EEE8]">V</span>
            <span className="text-emerald-400">S</span>
            <span className="text-[#F0EEE8]">U</span>
            <span className="text-emerald-400">A</span>
            <span className="text-[#F0EEE8]">L</span>
          </h1>
          <p className="text-base sm:text-lg text-[#F0EEE8]/60 font-light tracking-wide max-w-md">
            Business Operating System for Modern Agencies
          </p>
        </motion.div>

        {/* CTA Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl lg:max-w-3xl"
        >
          {/* VSUAL OS Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-emerald-500/40 via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20">
                  <Image src="/vsual-logo.png" alt="VSUAL" width={24} height={24} className="h-6 w-6 rounded-md" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#F0EEE8]">VSUAL OS</h3>
                </div>
              </div>
              <p className="text-sm text-[#F0EEE8]/50 mb-6 leading-relaxed">
                Manage Leads, Pipeline &amp; Automation
              </p>
              <Button
                onClick={() => setAppMode('vsual-login')}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0A] font-semibold h-11 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Enter VSUAL OS →
              </Button>
            </div>
          </motion.div>

          {/* NXL BYLDR Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-[#D6006E]/40 via-[#D6006E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(214,0,110,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D6006E]/15 border border-[#D6006E]/20">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#D6006E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#F0EEE8]">NXL BYLDR</h3>
                </div>
              </div>
              <p className="text-sm text-[#F0EEE8]/50 mb-6 leading-relaxed">
                Track Your Project Status
              </p>
              <Button
                onClick={() => setAppMode('nxl-login')}
                className="w-full bg-[#D6006E] hover:bg-[#E8007A] text-white font-semibold h-11 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(214,0,110,0.3)]"
              >
                Open Command Center →
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 mt-auto pb-6 pt-4"
      >
        <div className="flex flex-col items-center gap-2 text-[#F0EEE8]/30 text-xs">
          <Image
            src="/ca-logo.png"
            alt="CA Digital"
            width={28}
            height={28}
            className="h-7 w-7 rounded opacity-50"
          />
          <span>Powered by VSUAL Digital Media</span>
        </div>
      </motion.footer>
    </div>
  );
}
