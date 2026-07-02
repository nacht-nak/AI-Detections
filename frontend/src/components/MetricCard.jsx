import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ label, value, description, icon: Icon, unit = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-panel p-4.5 rounded-2xl border border-white/5 flex flex-col justify-between h-full hover:border-cyan-500/20 transition-all duration-300 relative group overflow-hidden"
    >
      {/* Background glow hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors">
          {label}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-white/5 text-cyan-400 group-hover:bg-cyan-500/10 transition-all duration-300">
            <Icon className="text-base" />
          </div>
        )}
      </div>

      <div className="flex items-baseline mb-2">
        <span className="text-2xl font-black tracking-tight text-white">
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
        </span>
        {unit && <span className="text-xs text-slate-400 ml-1 font-medium">{unit}</span>}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-normal">
        {description}
      </p>
    </motion.div>
  );
};

export default MetricCard;
