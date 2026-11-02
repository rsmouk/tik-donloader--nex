'use client';

import React, { useState } from 'react';
import {
  Search,
  ClipboardPaste,
  X,
  Loader2,
  Sparkles,
  Zap,
  ShieldCheck,
  Music,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { extractTikTokUrl } from '@/lib/tiktok-extractor';

interface HeroExtractorProps {
  onExtract: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  errorAr: string | null;
}

const SAMPLE_LINKS = [
  {
    label: 'عينة فيديو نشط 1 (Black Friday)',
    url: 'https://www.tiktok.com/@platosclosethagerstown/video/7698121092979756319',
  },
  {
    label: 'عينة فيديو 2 (رابط مباشر مع الصوت)',
    url: 'https://www.tiktok.com/@user/video/7698121092979756319',
  },
];

export default function HeroExtractor({
  onExtract,
  isLoading,
  error,
  errorAr,
}: HeroExtractorProps) {
  const [urlInput, setUrlInput] = useState('');

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          const detected = extractTikTokUrl(text);
          if (detected) {
            onExtract(detected);
          }
        }
      }
    } catch {
      // Browser permission issue
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onExtract(urlInput.trim());
  };

  return (
    <section className="w-full pt-8 pb-4 sm:pt-12 sm:pb-8 flex flex-col items-center text-center">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300 mb-5 shadow-sm">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent font-bold">
          أسرع أداة مجانية 2026
        </span>
        <span className="text-slate-500">•</span>
        <span>بدون علامة مائية + API مفتوح</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-[1.2] sm:leading-[1.2]">
        استخرج الرابط المباشر لفيديوهات{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
          تيك توك
        </span>{' '}
        بسرعة فائقة
      </h1>

      {/* Subtitle */}
      <p className="mt-3.5 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
        ألصق أي رابط فيديو أو ألبوم صور من TikTok للحصول على رابط MP4 المباشر عالي الدقة HD بدون
        علامة مائية، أو استخرج الصوت MP3 فوراً مع واجهة برمجية API سريعة للمطورين.
      </p>

      {/* Main Input Form Card */}
      <div className="w-full max-w-2xl mt-8">
        <form
          onSubmit={handleSubmit}
          className="relative bg-[#0d121c] border-2 border-slate-700/80 focus-within:border-rose-500/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl shadow-rose-950/20 transition-all"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-500 mr-3 ml-2 shrink-0 hidden sm:block" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="ألصق رابط تيك توك هنا... (https://www.tiktok.com/@...)"
                className="w-full bg-transparent px-3 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                disabled={isLoading}
                dir="ltr"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors ml-1"
                  title="مسح"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                className="px-2.5 py-1.5 mr-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 flex items-center gap-1.5 shrink-0 transition-colors"
                title="لصق من الحافظة"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">لصق</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-rose-950/50 transition-all shrink-0 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري الاستخراج...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>استخراج الرابط</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sample Links for quick 1-click testing */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            روابط تجريبية سريعة:
          </span>
          {SAMPLE_LINKS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrlInput(sample.url);
                onExtract(sample.url);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Error message card */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 text-right">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{errorAr || 'تعذر معالجة هذا الرابط'}</p>
              <p className="text-xs text-rose-400/80 font-mono" dir="ltr">
                {error}
              </p>
              <p className="text-xs text-slate-400 pt-1">
                تأكد من أن الفيديو عام (Public) وليس خاصاً ومتاح في منطقتك، أو جرب رابطاً آخر.
              </p>
            </div>
          </div>
        )}

        {/* Feature Pills */}
        <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">بدون علامة مائية</div>
              <div className="text-[10px] text-slate-400">فيديو نقي تماماً</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">سرعة فائقة HD</div>
              <div className="text-[10px] text-slate-400">أعلى دقة متوفرة</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">تحميل الصوت MP3</div>
              <div className="text-[10px] text-slate-400">فصل الموسيقى بنقرة</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">واجهة API مجانية</div>
              <div className="text-[10px] text-slate-400">للبوتات والتطبيقات</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
