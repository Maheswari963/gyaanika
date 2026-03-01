import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass })
      });

      const data = await res.json();

      if (data.status === "success" && data.token) {
        login(data.token);
        navigate("/admin/panel");
      } else {
        setError(data.message || "Invalid credentials");
      }

    } catch (e) {
      setError("Secure gateway unreachable");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">

      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-slate-700 p-10 rounded-3xl w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500 border border-emerald-500/20">
            <ShieldCheck size={48} />
          </div>
        </div>

        <h2 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Admin Intelligence</h2>
        <p className="text-slate-400 text-center mb-8 text-sm uppercase tracking-widest">Restricted Access</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              placeholder="Agent ID"
              value={user}
              onChange={e => setUser(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 focus:border-emerald-500 rounded-xl px-5 py-4 text-white outline-none transition-colors font-mono"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Passkey"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 focus:border-emerald-500 rounded-xl px-5 py-4 text-white outline-none transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Authenticate</>}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center text-sm font-bold"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
