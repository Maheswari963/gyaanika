import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Building2, Briefcase, GraduationCap,
  Sparkles, ArrowRight, CheckCircle2, X, AlertCircle, Phone, Globe, Info, Trophy, BarChart3, Target, DollarSign, ShieldCheck, Home, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const GlassCard = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`backdrop-blur-xl bg-white/40 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] ${className}`}
  >
    {children}
  </div>
);

// HERO SLIDER COMPONENT
const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1617526738882-1ea945ce3e56?q=80&w=2600&auto=format&fit=crop', // Futuristic Building
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2600&auto=format&fit=crop', // Classic Uni
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2600&auto=format&fit=crop'  // College Campus
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds auto slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }} // Smooth crossfade
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div> {/* Overlay for text readability */}

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
};

// CUSTOM DROPDOWN COMPONENT
const GlassDropdown = ({ label, options, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1">
        {label}
        {value && <CheckCircle2 size={10} className="text-emerald-500" />}
      </label>

      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-4 rounded-xl text-left font-bold flex justify-between items-center transition-all bg-white/50 border border-white/60 text-slate-800 hover:bg-white/80 active:scale-[0.98] ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-sm hover:shadow-md'}`}
      >
        <span className="truncate">{value || `Select ${label}...`}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ArrowRight size={16} className="rotate-90 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-[110%] left-0 right-0 max-h-64 overflow-y-auto bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl z-50 p-2 custom-scrollbar"
          >
            {options?.map(o => (
              <div
                key={o}
                onClick={() => {
                  onChange(o);
                  setIsOpen(false);
                }}
                className={`p-3 rounded-xl cursor-pointer text-sm font-bold transition-colors ${value === o ? 'bg-blue-100/50 text-blue-700' : 'text-slate-700 hover:bg-slate-100/50'}`}
              >
                {o}
              </div>
            ))}
            {(!options || options.length === 0) && (
              <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase">No Options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SearchFilters() { // Refactored to clean export
  // Context Data
  const [initData, setInitData] = useState(null);

  // State
  const [filters, setFilters] = useState({ district: "", program: "", degree: "", branch: "" });
  const [jobInput, setJobInput] = useState("");
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Refs
  const resultsRef = useRef(null);
  const detailsRef = useRef(null);

  // 1. THE SINGLE API CALL
  useEffect(() => {
    const boot = async () => {
      try {
        const res = await fetch('/api/context');
        const payload = await res.json();

        if (payload.status === "success") {
          setInitData(payload.data);
        }
      } catch (err) {
        console.error("Boot failed", err);
      } finally {
        setTimeout(() => setBooting(false), 800);
      }
    };
    boot();
  }, []);

  // Search Logic
  const handleSearch = async () => {
    if (!jobInput) return;
    setLoading(true);
    setShowResults(false);

    try {
      const res = await fetch('/api/search-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...filters, dreamPath: jobInput })
      });
      const data = await res.json();

      if (data.type === 'valid') {
        setColleges(data.colleges || []);
        setShowResults(true);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCollegeSelect = async (college) => {
    // Fetch full details including Deep AI Analysis
    try {
      const res = await fetch(`/api/college-details/${college._id}?dream=${encodeURIComponent(jobInput)}`);
      const data = await res.json();
      setSelectedCollege(data);
      setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      console.error("Details fetch failed", e);
    }
  };

  const toggleCompare = (e, college) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.find(c => c._id === college._id)) {
        return prev.filter(c => c._id !== college._id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, college];
    });
  };

  if (booting) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 overflow-hidden relative pb-32">

      {/* 🌟 HERO SLIDER BG 🌟 */}
      <HeroSlider />

      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 right-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/60 border border-white/50 shadow-sm rounded-2xl flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <Sparkles size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">GYAANIKA</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              <Home size={16} /> Home
            </button>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              <Lock size={16} /> Admin Intelligence
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-2xl mb-4">
            FIND YOUR FUTURE
          </h1>
          <p className="text-xl font-light tracking-[0.3em] uppercase text-blue-100 drop-shadow-md">
            Professional Academic Intelligence
          </p>
        </motion.div>

        {/* GLASS FILTER PANEL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <GlassCard className="p-8 !bg-white/80 !backdrop-blur-2xl"> {/* Enhanced visibility over slider */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "District", key: "district", options: initData?.filters?.districts },
                { label: "Program", key: "program", options: initData?.filters?.programs },
                { label: "Degree", key: "degree", options: initData?.filters?.degrees },
                { label: "Branch", key: "branch", options: initData?.filters?.branches },
              ].map(f => (
                <GlassDropdown
                  key={f.key}
                  label={f.label}
                  options={f.options}
                  value={filters[f.key]}
                  onChange={(val) => setFilters(prev => ({ ...prev, [f.key]: val }))}
                  disabled={
                    (f.key === "program" && !filters.district) ||
                    (f.key === "degree" && !filters.program) ||
                    (f.key === "branch" && !filters.degree)
                  }
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto mb-20 relative">
          <GlassCard className="p-2 flex items-center pr-2 !bg-white/90">
            <input
              type="text"
              placeholder="Ask Gyaanika: 'I want to be a Robotics Engineer'..."
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-2xl font-bold px-6 py-4 placeholder:text-slate-400 text-slate-800"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-slate-900 text-white p-5 rounded-[1.5rem] shadow-lg hover:bg-blue-600 transition-colors"
            >
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={24} /></motion.div> : <Search size={28} />}
            </motion.button>
          </GlassCard>
        </div>

        {/* RESULTS GRID */}
        {showResults && (
          <div ref={resultsRef} className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] bg-slate-300 flex-1"></div>
              <span className="text-sm font-bold uppercase tracking-widest text-slate-400">AI Results (High to Low Suitability)</span>
              <div className="h-[1px] bg-slate-300 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {colleges.map((c, idx) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleCollegeSelect(c)}
                  className="group cursor-pointer"
                >
                  <GlassCard className="p-8 h-full hover:bg-white/60 transition-colors border-l-8 border-l-blue-500 relative overflow-hidden !bg-white/90">

                    {/* COMPARE BUTTON */}
                    <div
                      onClick={(e) => toggleCompare(e, c)}
                      className={`absolute top-6 right-6 z-20 p-2 rounded-full border-2 transition-all ${compareList.find(i => i._id === c._id)
                        ? "bg-emerald-500 border-emerald-600 text-white"
                        : "bg-white/50 border-slate-200 text-slate-400 hover:scale-110"
                        }`}
                      title="Compare"
                    >
                      <CheckCircle2 size={20} />
                    </div>

                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                      <GraduationCap size={120} />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6 pr-12">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {c.facts?.accreditation || "Accredited"}
                        </span>
                        <span className="font-black text-3xl text-blue-600">
                          {c.ranking?.suitability}%
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                        {c.name}
                      </h3>

                      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wide mb-8">
                        <MapPin size={16} /> {c.location}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/40 rounded-xl p-3">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Avg Package</p>
                          <p className="text-lg font-black text-slate-800">{c.ranking?.avgPackage}</p>
                        </div>
                        <div className="bg-white/40 rounded-xl p-3">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Placement</p>
                          <p className="text-lg font-black text-slate-800">{c.facts?.placementRate}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FLOATING COMPARE BAR */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-0 right-0 z-40 flex justify-center"
            >
              <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center gap-6 pr-6">
                <div className="flex -space-x-4 pl-2">
                  {compareList.map(c => (
                    <div key={c._id} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center font-bold text-slate-900 text-xs shadow-lg">
                      {c.name[0]}
                    </div>
                  ))}
                </div>
                <div className="text-white text-sm font-bold uppercase tracking-widest">
                  {compareList.length} / 3 Selected
                </div>
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg transition-all hover:scale-105"
                >
                  Compare Now
                </button>
                <button onClick={() => setCompareList([])} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPARISON MODAL */}
        <AnimatePresence>
          {showCompareModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md overflow-x-hidden overflow-y-auto p-4 md:p-10 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                className="bg-white/95 backdrop-blur-2xl border border-white/50 w-full max-w-7xl rounded-[2.5rem] shadow-2xl overflow-hidden mt-10 md:mt-0"
              >
                <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-white/50 sticky top-0 z-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">INSTITUTIONAL COMPARISON</h2>
                  <button onClick={() => setShowCompareModal(false)} className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-colors flex items-center gap-2 shadow-sm border border-red-100">
                    Close Window <X size={18} />
                  </button>
                </div>

                <div className="overflow-x-auto p-8">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="p-6 text-left text-slate-400 font-bold uppercase tracking-widest text-xs w-1/4">Metric</th>
                        {compareList.map(c => (
                          <th key={c._id} className="p-6 text-left w-1/4 align-top">
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm">
                              <h3 className="font-black text-xl text-slate-900 leading-tight mb-2">{c.name}</h3>
                              <div className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-md">
                                <MapPin size={10} className="text-slate-400" />
                                <span className="text-[10px] text-slate-600 font-bold uppercase">{c.location}</span>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { l: "AI Match Score", k: "suitability", path: "ranking" },
                        { l: "NIRF Ranking", k: "nirfRank", path: "facts" },
                        { l: "Avg Package", k: "avgPackage", path: "ranking" },
                        { l: "Highest Package", k: "highestPackage", path: "facts" },
                        { l: "Placement Rate", k: "placementRate", path: "facts" },
                        { l: "Fees / Year", k: "fees", path: "facts" }
                      ].map((m, i) => (
                        <tr key={i} className="border-b border-slate-100/50 hover:bg-blue-50/30 transition-colors">
                          <td className="p-6 text-slate-500 font-bold text-sm">{m.l}</td>
                          {compareList.map(c => (
                            <td key={c._id} className="p-6">
                              <span className={`text-lg font-black ${m.l.includes("Match") ? "text-emerald-600" : "text-slate-800"}`}>
                                {m.path === "ranking" ? c.ranking?.[m.k] : c.facts?.[m.k]}
                                {m.l.includes("Match") && "%"}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                      {/* DEEP AI ROW */}
                      <tr className="bg-slate-50/50">
                        <td className="p-6 align-top pt-8 text-blue-600 font-black text-sm uppercase">AI Verdict</td>
                        {compareList.map(c => (
                          <td key={c._id} className="p-6 align-top">
                            <p className="text-xs leading-relaxed text-slate-600 font-medium">
                              {c.deepAnalysis?.match ? c.deepAnalysis.match.substring(0, 150) + "..." : "Analysis loading..."}
                            </p>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DETAILS MODAL OVERLAY - "DEEP CARD" */}
        <AnimatePresence>
          {selectedCollege && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[250] bg-slate-900/80 backdrop-blur-lg overflow-y-auto p-0 md:p-6"
            >
              <motion.div
                initial={{ scale: 0.95, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 50 }}
                ref={detailsRef}
                className="bg-slate-50 rounded-none md:rounded-[3rem] w-full max-w-[90rem] mx-auto overflow-hidden shadow-2xl relative min-h-screen md:min-h-0"
              >
                {/* HERO BANNER - CINEMATIC */}
                <div className="h-[40vh] md:h-[50vh] relative flex items-end overflow-hidden pb-12 px-6 md:px-12 group">
                  <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2600&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Campus" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                  </div>

                  <div className="relative z-10 w-full">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                      <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md text-emerald-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <Sparkles size={12} /> Institutional Intelligence Report
                      </span>
                      <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-4 tracking-tight">
                        {selectedCollege.name}
                      </h1>
                      <p className="text-white/80 text-xl font-light flex items-center gap-2">
                        <MapPin size={20} className="text-blue-400" /> {selectedCollege.location}
                      </p>
                    </motion.div>
                  </div>

                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="absolute top-8 right-8 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white p-4 rounded-full transition-all hover:rotate-90 z-20"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 md:p-12 space-y-12 bg-slate-50">

                  {/* 1. KEY STATS GRID - MODERN BENTO */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                      { l: "Fees / Year", v: selectedCollege.facts?.fees, i: <DollarSign className="text-emerald-500" />, bg: "bg-emerald-50/50 border-emerald-100" },
                      { l: "Placement Rate", v: selectedCollege.facts?.placementRate, i: <Target className="text-blue-500" />, bg: "bg-blue-50/50 border-blue-100" },
                      { l: "Highest Package", v: selectedCollege.facts?.highestPackage, i: <Trophy className="text-amber-500" />, bg: "bg-amber-50/50 border-amber-100" },
                      { l: "NIRF Rank", v: `#${selectedCollege.facts?.nirfRank}`, i: <BarChart3 className="text-purple-500" />, bg: "bg-purple-50/50 border-purple-100" }
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className={`${s.bg} p-4 md:p-6 rounded-[2rem] border flex flex-col justify-between h-32 shadow-sm`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mix-blend-multiply">{s.l}</span>
                          {s.i}
                        </div>
                        <span className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{s.v}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* 2. GYAANIKA AI ANALYSIS - VERTICAL STACK */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
                        <Sparkles className="text-indigo-600" size={20} /> GYAANIKA AI ANALYSIS
                      </h3>

                      <div className="flex flex-col gap-4">
                        {/* MATCH VERDICT - GREEN */}
                        <div className="p-6 bg-emerald-50/50 border-l-4 border-emerald-500 rounded-r-2xl">
                          <p className="text-emerald-900 text-sm leading-relaxed font-medium text-justify">
                            {selectedCollege.deepAnalysis?.match || "Quantifying neural alignment with your career trajectory..."}
                          </p>
                        </div>

                        {/* CAREER TRAJECTORY - BLUE */}
                        <div className="p-6 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-2xl">
                          <p className="text-blue-900 text-sm leading-relaxed font-medium text-justify">
                            {selectedCollege.deepAnalysis?.career || "Analyzing graduate placement vectors and historical velocity..."}
                          </p>
                        </div>

                        {/* ROI ANALYSIS - AMBER */}
                        <div className="p-6 bg-amber-50/50 border-l-4 border-amber-500 rounded-r-2xl">
                          <p className="text-amber-900 text-sm leading-relaxed font-medium text-justify">
                            {selectedCollege.deepAnalysis?.roi || "Calculating financial yield based on current tuition vs market realization..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. CAMPUS OVERVIEW & CAREER */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* OVERVIEW */}
                    <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center">
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                      <div className="relative z-10">
                        <h4 className="flex items-center gap-2 text-blue-300 font-bold uppercase tracking-widest mb-6">
                          <Info size={16} /> Campus Intelligence
                        </h4>
                        <p className="text-lg leading-relaxed font-light text-slate-300">
                          {selectedCollege.profile?.overview || selectedCollege.about}
                        </p>
                      </div>
                    </div>

                    {/* CAREER OPPORTUNITIES - PRETTY BOX */}
                    <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8 rounded-[2.5rem] border border-violet-100 relative overflow-hidden flex flex-col justify-center">
                      <h4 className="flex items-center gap-2 text-violet-600 font-bold uppercase tracking-widest mb-6">
                        <Briefcase size={16} /> Strategic Career Trajectories
                      </h4>
                      <div className="flex flex-wrap gap-3 relative z-10">
                        {selectedCollege.career?.map((c, i) => (
                          <div key={i} className="bg-white/80 backdrop-blur-sm border border-violet-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm hover:scale-105 transition-transform">
                            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">{c.role}</span>
                              <span className="text-[10px] font-bold uppercase text-violet-400 block">{c.sector}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. INFRASTRUCTURE & VOICES ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* INFRASTRUCTURE - DEDICATED ECOSYSTEM BOX */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-[2.5rem] border border-slate-200">
                      <h4 className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest mb-6">
                        <Building2 size={16} /> Infrastructure Ecosystem
                      </h4>
                      <h4 className="text-xl font-black text-slate-900 mb-2">Student Voices</h4>
                      <p className="text-slate-500 text-sm mb-6">Real feedback from verified alumni.</p>
                      <div className="w-full space-y-4">
                        {selectedCollege.voices?.slice(0, 2).map((v, i) => (
                          <div key={i} className="bg-slate-50 p-4 rounded-xl text-left border border-slate-100">
                            <div className="flex text-amber-400 text-xs mb-2">
                              {[...Array(v.rating)].map((_, i) => <Sparkles key={i} size={8} fill="currentColor" />)}
                            </div>
                            <p className="text-slate-700 text-xs font-medium italic">"{v.text.substring(0, 60)}..."</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};


