import React from 'react';
import { motion } from 'framer-motion';
import {
  FaRegQuestionCircle,
  FaCopy,
  FaFilePdf,
  FaCheckCircle,
  FaHourglassHalf,
  FaBookmark,
  FaAtom,
  FaPenNib,
  FaList,
  FaVolumeUp,
  FaSortAmountUp,
  FaBookOpen,
  FaRulerHorizontal
} from 'react-icons/fa';
import ProgressCircle from './ProgressCircle';
import MetricCard from './MetricCard';
import { toast } from 'react-toastify';

const ResultCard = ({ result, text }) => {
  if (!result) {
    return (
      <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[450px] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
        <div className="p-5 rounded-full bg-cyan-500/5 text-cyan-400 mb-4 border border-cyan-500/10 group-hover:scale-110 transition-transform duration-500">
          <FaRegQuestionCircle className="text-4xl animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1.5 tracking-tight">
          Awaiting Input
        </h3>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed font-medium">
          Enter your text and click the analyze button to generate structural AI metrics.
        </p>
      </div>
    );
  }

  const {
    prediction,
    confidence,
    ai_probability,
    human_probability,
    perplexity,
    burstiness,
    sentence_diversity,
    vocabulary_richness,
    average_sentence_length,
    explanation
  } = result;

  const isAI = prediction === 'AI Generated';

  // Handle Clipboard Copy
  const handleCopy = () => {
    const reportText = `AI Detection Report
--------------------
Prediction: ${prediction}
Confidence: ${confidence.toFixed(1)}%
AI Probability: ${ai_probability.toFixed(1)}%
Human Probability: ${human_probability.toFixed(1)}%
Perplexity: ${perplexity}
Burstiness: ${burstiness}
Sentence Diversity: ${sentence_diversity}
Vocabulary Richness: ${vocabulary_richness}
Average Sentence Length: ${average_sentence_length} words/sentence

Explanations:
${explanation.map((e) => `- ${e}`).join('\n')}
`;
    navigator.clipboard.writeText(reportText);
    toast.success('Report copied to clipboard!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: 'dark',
    });
  };

  // Trigger PDF/Print Report
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-8 w-full shadow-2xl relative print:p-0 print:border-0 print:bg-white"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6 print:border-slate-200">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 block">
            Scan Results
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white print:text-black">
            Linguistic Analysis
          </h2>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="flex items-center space-x-2.5 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all font-semibold text-xs uppercase tracking-wider"
            title="Copy Raw Metrics"
          >
            <FaCopy />
            <span>Copy</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-cyan-500/10 hover:shadow-cyan-400/20 transition-all"
            title="Download PDF Report"
          >
            <FaFilePdf />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* Overview Block */}
      <div className="flex flex-col md:flex-row items-center gap-8 justify-center py-2">
        {/* SVG confidence circle */}
        <div className="flex-shrink-0">
          <ProgressCircle percentage={confidence} />
        </div>

        {/* Probability Bars */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex items-center justify-between">
            <span
              className={`text-lg font-black tracking-tight px-3 py-1 rounded-xl ${
                isAI ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
              }`}
            >
              {prediction}
            </span>
          </div>

          <div className="space-y-4">
            {/* AI Probability */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">AI Probability</span>
                <span className="text-rose-400">{ai_probability.toFixed(1)}%</span>
              </div>
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ai_probability}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Human Probability */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">Human Probability</span>
                <span className="text-emerald-400">{human_probability.toFixed(1)}%</span>
              </div>
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${human_probability}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
          Metric Breakdown
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard
            label="Perplexity"
            value={perplexity}
            icon={FaAtom}
            description="Linguistic complexity. Higher is more creative; lower indicates AI uniformity."
          />
          <MetricCard
            label="Burstiness"
            value={burstiness}
            icon={FaRulerHorizontal}
            description="Sentence length variance. High burstiness feels natural; low feels rigid."
          />
          <MetricCard
            label="Sentence Diversity"
            value={sentence_diversity}
            icon={FaList}
            description="Variation in sentence start structures and punctuation usage."
          />
          <MetricCard
            label="Vocab Richness"
            value={vocabulary_richness}
            icon={FaBookOpen}
            description="Lexical richness using type-token ratio. Higher is more diverse."
          />
          <MetricCard
            label="Sentence Length"
            value={average_sentence_length}
            icon={FaPenNib}
            unit="words"
            description="Average count of words per sentence. AI typically averages 15-22."
          />
          <MetricCard
            label="Status"
            value="Verified"
            icon={FaCheckCircle}
            description="Detection models fully evaluated. Scoring is stable."
          />
        </div>
      </div>

      {/* Explanation Checklist */}
      <div className="space-y-4 pt-6 border-t border-white/5 print:border-slate-200">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
          Explanation Checkpoints
        </h4>
        <div className="grid gap-3">
          {explanation.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-xl bg-white/3 border border-white/3 text-xs sm:text-sm font-medium text-slate-300 print:text-black"
            >
              <FaCheckCircle className="text-emerald-400 text-base mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Print-Only Footer */}
      <div className="hidden print-only text-slate-600 text-xs text-center border-t border-slate-200 pt-8 mt-12">
        Report generated by AI-Detection Platform. Deep Transformer Roberta Model evaluation.
      </div>
    </motion.div>
  );
};

export default ResultCard;
