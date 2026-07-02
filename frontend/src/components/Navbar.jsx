import React from 'react';
import { FaRobot, FaSun, FaMoon, FaHistory, FaGithub } from 'react-icons/fa';

const Navbar = ({ darkMode, setDarkMode, showHistory, setShowHistory }) => {
  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 transition-all duration-300 border-b border-white/10 bg-[#030712]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <FaRobot className="text-2xl animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            AI-Detection
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          {/* History Toggle Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
              showHistory
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'border-white/10 text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
            title="Toggle History"
          >
            <FaHistory className="text-base" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-300"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FaSun className="text-yellow-400 text-lg animate-spin-slow" /> : <FaMoon className="text-cyan-400 text-lg" />}
          </button>

          {/* GitHub link / External info */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-300 hidden md:flex"
            title="GitHub Repository"
          >
            <FaGithub className="text-lg" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
