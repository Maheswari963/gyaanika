import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Gateway() {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-white">

            {/* Aurora Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900/60 to-slate-950 animate-blob"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-slate-950/90"></div>
            </div>

            <div className="relative z-10 text-center space-y-12 max-w-4xl px-6">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 animate-shine bg-[length:200%_auto]">
                        Gyaanika
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-slate-300 tracking-[0.5em] uppercase">
                        The Future of Academic Guidance
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8 mt-16 justify-center">

                    {/* STUDENT PORTAL */}
                    <motion.div
                        whileHover={{ scale: 1.05, translateY: -10 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative w-full md:w-80 h-96 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between cursor-pointer hover:bg-white/10 transition-all shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]"
                        onClick={() => navigate('/portal')}
                    >
                        <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <GraduationCap size={32} />
                        </div>

                        <div className="text-left">
                            <h3 className="text-2xl font-bold mb-2">Student Portal</h3>
                            <p className="text-sm text-slate-400">AI-powered career mapping & college selection engine.</p>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </motion.div>

                    {/* ADMIN PORTAL */}
                    <motion.div
                        whileHover={{ scale: 1.05, translateY: -10 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative w-full md:w-80 h-96 rounded-[2.5rem] bg-slate-950/50 backdrop-blur-xl border border-white/5 p-8 flex flex-col justify-between cursor-pointer hover:bg-slate-900/80 transition-all"
                        onClick={() => navigate('/admin')}
                    >
                        <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <ShieldCheck size={32} />
                        </div>

                        <div className="text-left">
                            <h3 className="text-2xl font-bold mb-2">Admin Intelligence</h3>
                            <p className="text-sm text-slate-400">Secure data validation & system monitoring.</p>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </motion.div>

                </div>

            </div>

            <div className="absolute bottom-10 text-xs font-bold text-slate-600 uppercase tracking-widest">
                Secure System v2.0 • 1-Call Architecture
            </div>

        </div>
    );
}
