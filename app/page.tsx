'use client';

import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroExtractor from '@/components/HeroExtractor';
import VideoResultCard from '@/components/VideoResultCard';
import ApiDocumentation from '@/components/ApiDocumentation';
import ExtractionHistory from '@/components/ExtractionHistory';
import FeaturesAndFaq from '@/components/FeaturesAndFaq';
import type { TikTokVideoData } from '@/lib/tiktok-extractor';

const STORAGE_KEY = 'tikdirect_history_v1';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'tool' | 'api' | 'history'>('tool');
  const [currentVideo, setCurrentVideo] = useState<TikTokVideoData | null>(null);
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorAr, setErrorAr] = useState<string | null>(null);

  // Lazy initialize history from localStorage
  const [history, setHistory] = useState<TikTokVideoData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
    return [];
  });

  const resultRef = useRef<HTMLDivElement>(null);

  const saveToHistory = (item: TikTokVideoData) => {
    try {
      setHistory((prev) => {
        const filtered = prev.filter((x) => x.id !== item.id);
        const updated = [item, ...filtered].slice(0, 30); // keep up to 30 items
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Storage quota or privacy mode
    }
  };

  const handleExtract = async (url: string) => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError(null);
    setErrorAr(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setError(json.error || 'Failed to extract video');
        setErrorAr(json.errorAr || 'تعذر استخراج هذا الفيديو. يرجى التأكد من الرابط والمحاولة مجدداً.');
        setIsLoading(false);
        return;
      }

      const extractedData: TikTokVideoData = {
        id: json.data.id,
        title: json.data.title,
        cover: json.data.cover,
        originCover: json.data.originCover,
        duration: json.data.duration,
        isPhoto: json.data.isPhoto,
        images: json.data.downloads?.photos,
        video: {
          noWatermark: json.data.downloads?.video_no_watermark,
          hd: json.data.downloads?.video_hd,
          watermark: json.data.downloads?.video_watermark,
        },
        music: json.data.music,
        author: json.data.author,
        stats: json.data.stats,
        rawUrl: json.data.rawUrl,
      };

      setCurrentVideo(extractedData);
      setExecutionTime(json.executionTimeMs);
      saveToHistory(extractedData);
      setActiveTab('tool');

      // Scroll smoothly down to the result card
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error');
      setErrorAr('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة ثانية.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      //
    }
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        //
      }
      return updated;
    });
  };

  const handleSelectFromHistory = (item: TikTokVideoData) => {
    setCurrentVideo(item);
    setActiveTab('tool');
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4">
        {activeTab === 'tool' && (
          <div className="space-y-8">
            {/* Hero Input Section */}
            <HeroExtractor
              onExtract={handleExtract}
              isLoading={isLoading}
              error={error}
              errorAr={errorAr}
            />

            {/* Extracted Video Result Card */}
            {currentVideo && (
              <div ref={resultRef} className="pt-4 scroll-mt-20">
                <VideoResultCard
                  data={currentVideo}
                  executionTimeMs={executionTime}
                />
              </div>
            )}

            {/* Guide & FAQ */}
            <FeaturesAndFaq />
          </div>
        )}

        {activeTab === 'api' && (
          <div className="pt-4">
            <ApiDocumentation />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="pt-4">
            <ExtractionHistory
              history={history}
              onSelect={handleSelectFromHistory}
              onClear={handleClearHistory}
              onRemoveItem={handleRemoveHistoryItem}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#06080d] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('tool')}
              className="hover:text-white transition-colors"
            >
              أداة التحميل
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('api')}
              className="hover:text-cyan-400 transition-colors"
            >
              واجهة API للمطورين
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('history')}
              className="hover:text-amber-400 transition-colors"
            >
              السجل المحلي
            </button>
          </div>
          <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            تنويه: هذه الأداة مخصصة للاستخدام الشخصي والنسخ الاحتياطي للفيديوهات العامة. TikTok علامة
            تجارية مسجلة لشركة ByteDance Ltd. هذا الموقع غير تابع أو مدعوم من شركة TikTok.
          </p>
          <div className="pt-2 text-[11px] text-slate-600 flex items-center justify-center gap-1">
            <span>TikDirect Extractor & API • تم البناء بدقة عالية وسرعة فائقة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
