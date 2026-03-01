import React, { useEffect, useState } from "react";
import { Sparkles, RefreshCcw, CheckCircle2, AlertCircle, Save, X, Database } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPanel() {
  const { token, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Editor State
  const [editingTicket, setEditingTicket] = useState(null);
  const [fixData, setFixData] = useState({ collegeId: "", corrections: {} });

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/admin/reviews", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const payload = await res.json();
      if (payload.status === "success") {
        setTickets(payload.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleResolve = async () => {
    if (!editingTicket) return;

    // Parse logic (User types generic JSON in text area for speed)
    // For "confused data", we assume the admin enters raw updates
    let corrections = {};
    try {
      corrections = typeof fixData.corrections === 'string'
        ? JSON.parse(fixData.corrections)
        : fixData.corrections;
    } catch (e) {
      alert("Invalid JSON format in corrections");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/admin/fix-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketId: editingTicket._id,
          collegeId: fixData.collegeId,
          corrections: corrections
        })
      });

      const data = await res.json();
      if (data.status === "success") {
        setEditingTicket(null);
        loadTickets();
        setFixData({ collegeId: "", corrections: {} });
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Fix failed");
    }
  };

  const openEditor = (ticket) => {
    setEditingTicket(ticket);
    // Pre-fill if ticket has suggestive info (simplified for now)
    setFixData({
      collegeId: "",
      corrections: "{\n  \"ranking.suitability\": 95\n}"
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-12 font-sans">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-xl border border-emerald-500/30">
              <Database size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Intelligence Control
              </h1>
              <p className="text-slate-400 text-xs uppercase tracking-widest">Gyaanika System Core</p>
            </div>
          </div>

          <button onClick={logout} className="text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase">
            Terminate Session
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="flex justify-between mb-8">
          <button
            onClick={loadTickets}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors text-sm font-bold uppercase"
          >
            <RefreshCcw size={16} className={loading && "animate-spin"} /> Refresh Stream
          </button>

          <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-slate-500">
            CONN: SECURE_V2
          </div>
        </div>

        {/* TICKET GRID */}
        <div className="grid grid-cols-1 gap-6">
          {tickets.length === 0 && !loading && (
            <div className="p-16 border-2 border-dashed border-slate-800 rounded-3xl text-center flex flex-col items-center">
              <CheckCircle2 className="text-emerald-500 mb-4" size={48} />
              <p className="font-bold text-slate-400 text-lg">
                System Optimal. No anomalies detected.
              </p>
            </div>
          )}

          {tickets.map((t) => (
            <motion.div
              layout
              key={t._id}
              className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col md:flex-row gap-8 justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-500/10 text-red-400 px-3 py-1 rounded text-xs font-black uppercase tracking-wide flex items-center gap-2">
                    <AlertCircle size={12} /> Confused Data
                  </div>
                  <span className="text-slate-500 text-xs font-mono">{t._id}</span>
                </div>

                <p className="text-xl text-white font-medium leading-relaxed">
                  {t.issue}
                </p>

                <div className="mt-4 flex gap-4">
                  <div className="text-xs text-slate-400 font-bold uppercase">
                    Field: <span className="text-white">{t.field}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase">
                    Origin: <span className="text-white">{t.collegeName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openEditor(t)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg flex items-center gap-2 transition-all"
              >
                <Sparkles size={16} /> Resolve Issue
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingTicket && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white">Correction Protocol</h3>
                <button onClick={() => setEditingTicket(null)} className="p-2 hover:bg-slate-800 rounded-full"><X /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Target College ID</label>
                  <input
                    value={fixData.collegeId}
                    onChange={e => setFixData({ ...fixData, collegeId: e.target.value })}
                    placeholder="Enter 24-char MongoDB ID..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Data Overwrites (JSON)</label>
                  <textarea
                    rows={6}
                    value={typeof fixData.corrections === 'string' ? fixData.corrections : JSON.stringify(fixData.corrections, null, 2)}
                    onChange={e => setFixData({ ...fixData, corrections: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-emerald-400 font-mono text-sm focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button onClick={() => setEditingTicket(null)} className="px-6 py-3 font-bold text-slate-400 hover:text-white">Cancel</button>
                  <button
                    onClick={handleResolve}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg flex items-center gap-2"
                  >
                    <Save size={16} /> Apply Fix & Resolve
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
