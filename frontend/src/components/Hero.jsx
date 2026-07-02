import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-12 pb-8 text-center max-w-4xl mx-auto px-4 z-10">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl animate-float-slow -z-10" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl animate-float-medium -z-10" />

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
      >
        <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
          Reveal the Source of{' '}
        </span>
        <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
          Any Text
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
      >
        Analyze text using advanced Artificial Intelligence models to accurately estimate whether it was authored by AI or written by a human.
      </motion.p>

      {/* Micro badges for credibility */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
      >
        <span className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
          ⚡ Deep Transformers
        </span>
        <span className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
          📊 Perplexity Analysis
        </span>
        <span className="px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
          🖋️ Burstiness Check
        </span>
      </motion.div>
    </div>
  );
};

export default Hero;
