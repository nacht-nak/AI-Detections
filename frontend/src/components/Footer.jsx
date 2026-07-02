import React from 'react';
import { FaHeart, FaRobot } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-16 border-t border-white/5 bg-[#030712]/40 backdrop-blur-sm z-10 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Branding */}
        <div className="flex items-center space-x-2 text-slate-500">
          <FaRobot className="text-lg" />
          <span className="text-sm font-semibold tracking-wider uppercase">
            AI-Detection &copy; {currentYear}
          </span>
        </div>

        {/* Note */}
        <div className="text-center text-slate-500 text-xs flex items-center gap-1.5">
          <span>Made with</span>
          <FaHeart className="text-rose-500 animate-pulse" />
          <span>for safe, verified content. Powered by RoBERTa.</span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
            Terms of Service
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
