import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TextInput from '../components/TextInput';
import ResultCard from '../components/ResultCard';
import History from '../components/History';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import { analyzeText } from '../services/api';
import { toast } from 'react-toastify';

const Home = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Load Scan History and Dark Mode settings on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai_detection_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory([]);
      }
    }

    const savedDarkMode = localStorage.getItem('ai_detection_dark_mode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Update dark mode classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#030712';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
    localStorage.setItem('ai_detection_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Save history helper
  const saveHistory = (updatedHistory) => {
    setHistory(updatedHistory);
    localStorage.setItem('ai_detection_history', JSON.stringify(updatedHistory));
  };

  // Perform Analysis
  const handleAnalyze = async () => {
    if (!text || text.trim().length < 20) {
      toast.warning('Please enter at least 20 characters of text to analyze.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeText(text);
      setResult(data);

      // Save to History list (limit to top 15 records)
      const newRecord = {
        id: Date.now().toString(),
        text: text.slice(0, 100), // store preview snippet
        fullText: text,
        prediction: data.prediction,
        confidence: data.confidence,
        result: data,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [newRecord, ...history.slice(0, 14)];
      saveHistory(updatedHistory);

      toast.success('Analysis completed successfully!');
    } catch (error) {
      toast.error(error.message || 'Unable to connect to AI server.');
    } finally {
      setLoading(false);
    }
  };

  // Select item from history
  const handleSelectHistoryItem = (item) => {
    setText(item.fullText || item.text);
    setResult(item.result);
    // If mobile, close drawer on select
    if (window.innerWidth < 768) {
      setShowHistory(false);
    }
  };

  // Clear history
  const handleClearHistory = () => {
    saveHistory([]);
    toast.info('Scan history cleared.');
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-300 ${
      darkMode ? 'bg-[#030712] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />

      {/* Main Page Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col z-10">
        <Hero />

        {/* Dynamic Panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 items-start">
          
          {/* History Sidebar Panel */}
          {showHistory && (
            <div className="col-span-1 md:col-span-3 h-full md:sticky md:top-24 max-h-[500px] md:max-h-[calc(100vh-140px)]">
              <History
                history={history}
                onSelect={handleSelectHistoryItem}
                onClear={handleClearHistory}
                onClose={() => setShowHistory(false)}
              />
            </div>
          )}

          {/* Input Panel */}
          <div className={`${
            showHistory ? 'col-span-1 md:col-span-4' : 'col-span-1 md:col-span-6'
          } h-full`}>
            <TextInput
              text={text}
              setText={setText}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </div>

          {/* Results Panel */}
          <div className={`${
            showHistory ? 'col-span-1 md:col-span-5' : 'col-span-1 md:col-span-6'
          } h-full`}>
            {loading ? (
              <LoadingScreen />
            ) : (
              <ResultCard result={result} text={text} />
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
