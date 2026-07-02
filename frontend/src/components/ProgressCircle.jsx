import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ProgressCircle = ({ percentage = 0, size = 160, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track Circle */}
        <circle
          className="text-white/5"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Animated Progress Circle */}
        <motion.circle
          stroke="url(#circleGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Percentage Center Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent"
        >
          {Math.round(percentage)}%
        </motion.span>
        <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">
          Confidence
        </span>
      </div>
    </div>
  );
};

export default ProgressCircle;
