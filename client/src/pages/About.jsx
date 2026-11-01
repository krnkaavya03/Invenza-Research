import { Link } from 'react-router-dom';
import { HiOutlineUserGroup, HiOutlineArrowLeft, HiOutlineLightningBolt } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

export default function About() {
    return (
        <div className="min-h-screen bg-surface flex flex-col text-text overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-12 w-full">
                <Link to="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
                    <HiOutlineArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <HiOutlineUserGroup className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-bold">About Us</h1>
                </div>

                <div className="glass-card p-8 text-center space-y-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-6">
                        <HiOutlineLightningBolt className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Invenza Project Team</h2>
                    <p className="text-sm text-slate-500 mt-2">Final Year B.Tech CSE</p>
                    <p className="text-sm text-slate-400 mt-3">Kaavya K · Prithi Jessica J · Tharshini A · Akash J V</p>
                    <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Invenza is developed by a team of Final Year B.Tech CSE students to simplify digital product catalogs and intelligent inventory management.
                        Invenza is a Final Year Project demonstrating the real-world application of Generative AI, machine learning forecasting, multimodal product cataloging, and inventory optimization.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                            <h3 className="font-semibold text-indigo-300 mb-2">Our Mission</h3>
                            <p className="text-sm text-slate-400">To make AI-assisted product catalog creation, inventory intelligence, demand forecasting, and transparent recommendations accessible to businesses of all sizes.</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                            <h3 className="font-semibold text-cyan-300 mb-2">The Tech</h3>
                            <p className="text-sm text-slate-400">Powered by React, Node.js, FastAPI, and Google Gemini, Invenza combines multimodal AI, machine learning, inventory analytics, and generative insights.</p>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-700/50">
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 hover:border-indigo-500/50 hover:bg-slate-700/80 transition-all duration-300 group"
                        >
                            <FaGithub className="w-6 h-6 text-white group-hover:text-indigo-400 transition-colors" />
                            <div className="text-left">
                                <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">View on GitHub</div>
                                <div className="text-xs text-slate-500">Invenza Project Repository</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
