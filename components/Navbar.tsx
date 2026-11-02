'use client';

import React from 'react';
import { Download, Code2, Sparkles, History } from 'lucide-react';

interface NavbarProps {
  activeTab: 'tool' | 'api' | 'history';
  setActiveTab: (tab: 'tool' | 'api' | 'history') => void;
  historyCount: number;
}

export default function Navbar({ activeTab, setActiveTab, historyCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090b10]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('tool')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-rose-500 to-amber-400 p-[1.5px] transition-transform duration-200 group-hover:scale-105">
            <div className="w-full h-full bg-[#0d111a] rounded-[10px] flex items-center justify-center">
              <Download className="w-5 h-5 text-rose-400 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TikDirect
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                API + مجاني
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              مستخرج روابط تيك توك المباشرة بدون علامة مائية
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('tool')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'tool'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>الأداة</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'api'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>واجهة البرمجة (API)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">السجل</span>
            {historyCount > 0 && (
              <span className="text-[11px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
