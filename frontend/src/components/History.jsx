import React from 'react';
import { FaTrash, FaCheckCircle, FaRobot, FaTimes, FaHistory, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const History = ({ history, onSelect, onClear, onClose }) => {
  return (
    <div className="glass-card h-full rounded-3xl border border-white/5 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 text-cyan-400">
          <FaHistory className="text-lg animate-pulse" />
          <h3 className="font-extrabold tracking-tight text-white text-base">
            Scan History
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          title="Close History"
        >
          <FaTimes />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
            <FaHistory className="text-3xl mb-3 opacity-30" />
            <p className="text-sm font-medium">No scans yet</p>
            <p className="text-xs opacity-75 mt-1">Previous analyses will appear here</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelect(item)}
                className="glass-panel p-3.5 rounded-2xl border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all duration-300 group flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.prediction === 'AI Generated'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {item.prediction}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate">
                    {item.text}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-sm font-black text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {Math.round(item.confidence)}%
                  </span>
                  <FaArrowRight className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all text-xs" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer / Actions */}
      {history.length > 0 && (
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onClear}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all duration-300 font-semibold text-xs uppercase tracking-wider"
          >
            <FaTrash className="text-xs" />
            <span>Clear History</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
