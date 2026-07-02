import React from 'react';
import { FaPlay, FaSpinner, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EXAMPLES = {
  essay: `I have been thinking a lot lately about how technology is changing the way we learn. In my experience, going to classes in person is way better than online school. When you are sitting in a classroom, you can raise your hand and get an answer right away, instead of sending an email and waiting for hours. Also, it's just nice to see other people and make friends. Honestly, when I was doing Zoom classes during the pandemic, I spent half the time looking at my phone or browsing the web. It is super hard to stay focused when you are just staring at a screen all day in your bedroom. Natural human interactions and the structured environment of a physical school really help keep students accountable.`,
  
  academic: `This study explores the correlation between dynamic neural networks and cognitive language modeling. By integrating standard transformer layers with adaptive attention modules, we establish a robust framework capable of parsing highly non-linear contextual sequences. The dataset utilized comprises over fifty thousand academic publications, pre-processed to remove semantic inconsistencies. Statistical evaluation reveals a significant margin of improvement in terms of validation loss reduction. The implications of this research are multi-fold, paving the way for enhanced context-aware natural language processing agents in real-time prediction environments.`,
  
  news: `The local government announced a new initiative on Tuesday aimed at expanding public green spaces across the metropolitan area over the next five years. According to officials, the project will receive initial funding of forty-five million dollars, with construction scheduled to begin early next spring. The plan outlines the development of six new public parks and the revitalization of existing urban trails. Mayor Evelyn Carter emphasized the community benefits, stating that accessible public recreation zones are critical for public health. Public feedback forums will begin next month to gather citizen input on design details.`,
  
  story: `The wind howled through the skeletal branches of the ancient oak trees as Sarah hurried along the narrow forest path. She clutched the weathered leather satchel tightly against her side, her heartbeat racing in sync with the rustle of dry autumn leaves behind her. "Hello?" she called out, her voice trembling slightly in the crisp night air. There was no response, only the sudden crack of a twig breaking just a few feet away. She gasped, running forward into the pitch-black shadows as rain started to fall. She couldn't look back. She had to deliver the message, no matter what.`,
  
  programming: `When writing clean code, I always prefer to keep my functions small and focused on a single responsibility. It makes debugging so much simpler down the road! In Python, using list comprehensions can write super elegant one-liners, but you should be careful not to make them too complex or hard to read. If you're building APIs, FastAPI is an amazing choice because it automatically generates documentation and performs type checks out of the box. Always write docstrings, comment on the non-obvious workarounds, and write simple unit tests before you ship your code to production.`
};

const TextInput = ({ text, setText, onAnalyze, loading }) => {
  const handleTextChange = (e) => {
    const val = e.target.value;
    if (val.length <= 5000) {
      setText(val);
    }
  };

  const handleSelectExample = (key) => {
    if (loading) return;
    setText(EXAMPLES[key]);
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col h-full shadow-2xl relative">
      {/* Quick Examples Header */}
      <div className="mb-4">
        <label className="text-xs uppercase font-extrabold tracking-widest text-slate-500 block mb-2.5">
          Quick Examples
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(EXAMPLES).map((key) => (
            <button
              key={key}
              type="button"
              disabled={loading}
              onClick={() => handleSelectExample(key)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 min-h-[300px] flex flex-col">
        <textarea
          value={text}
          onChange={handleTextChange}
          disabled={loading}
          placeholder="Paste your text here (minimum 20 characters)..."
          className="w-full flex-1 p-5 rounded-2xl glass-input custom-scrollbar text-sm resize-none focus:ring-0 focus:outline-none min-h-[250px]"
        />

        {/* Floating actions (Character counter, Clear button) */}
        <div className="absolute bottom-3 right-4 flex items-center space-x-3 pointer-events-none">
          <span
            className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded-lg ${
              text.length >= 5000
                ? 'bg-rose-500/10 text-rose-400'
                : text.length < 20
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-white/5 text-slate-400'
            }`}
          >
            {text.length} / 5000
          </span>
        </div>
      </div>

      {/* Helper text */}
      <div className="mt-2 text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
        <FaFileAlt />
        <span>Supports essay, news reports, academic texts, and creative narratives.</span>
      </div>

      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: loading || text.length < 20 ? 1 : 1.02 }}
        whileTap={{ scale: loading || text.length < 20 ? 1 : 0.98 }}
        onClick={onAnalyze}
        disabled={loading || text.length < 20}
        className={`mt-6 w-full flex items-center justify-center space-x-2.5 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/10 ${
          loading
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/20'
            : text.length < 20
            ? 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white border-0 shadow-cyan-500/20 hover:shadow-cyan-400/30'
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin text-base" />
            <span>Analyzing Content...</span>
          </>
        ) : (
          <>
            <FaPlay className="text-xs" />
            <span>Analyze Text</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default TextInput;
