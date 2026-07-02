import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl animate-pulse space-y-8 w-full border border-white/5">
      {/* Prediction Badge Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="h-8 w-48 bg-white/10 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-white/10 rounded-xl" />
      </div>

      {/* Progress Circle & Probability Bars Skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-8 justify-center py-4">
        {/* Circle Skeleton */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="w-full h-full rounded-full border-[10px] border-white/5" />
          <div className="absolute flex flex-col items-center space-y-2">
            <div className="h-8 w-16 bg-white/10 rounded-md" />
            <div className="h-3 w-16 bg-white/5 rounded-md" />
          </div>
        </div>

        {/* Probability Bars Skeleton */}
        <div className="flex-1 w-full space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-white/10 rounded-md" />
              <div className="h-4 w-12 bg-white/10 rounded-md" />
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-white/15 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-28 bg-white/10 rounded-md" />
              <div className="h-4 w-12 bg-white/10 rounded-md" />
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-white/15 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-white/5 rounded-md" />
              <div className="h-7 w-7 bg-white/5 rounded-lg" />
            </div>
            <div className="h-6 w-12 bg-white/10 rounded-md" />
            <div className="h-3 w-full bg-white/5 rounded-md" />
          </div>
        ))}
      </div>

      {/* Explanations Skeleton */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="h-5 w-36 bg-white/10 rounded-md mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="h-5 w-5 bg-white/10 rounded-full flex-shrink-0" />
            <div className="h-4 bg-white/10 rounded-md flex-1" style={{ width: `${80 - i * 15}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
