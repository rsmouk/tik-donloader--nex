'use client';

import React from 'react';
import { History, Trash2, Download, ExternalLink, Copy, Check, Clock, User } from 'lucide-react';
import type { TikTokVideoData } from '@/lib/tiktok-extractor';

interface ExtractionHistoryProps {
  history: TikTokVideoData[];
  onSelect: (item: TikTokVideoData) => void;
  onClear: () => void;
  onRemoveItem: (id: string) => void;
}

export default function ExtractionHistory({
  history,
  onSelect,
  onClear,
  onRemoveItem,
}: ExtractionHistoryProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">السجل فارغ حالياً</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          عندما تقوم باستخراج أي فيديو عبر الأداة، سيتم حفظه هنا محلياً في متصفحك للوصول السريع وإعادة
          تنزيل الروابط المباشرة.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-lg text-white">
            سجل الفيديوهات المستخرجة ({history.length})
          </h3>
        </div>

        <button
          onClick={onClear}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>مسح كل السجل</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {history.map((item) => {
          const directUrl = item.video?.noWatermark || item.cover;
          const proxyDownload = item.video?.noWatermark
            ? `/api/download?url=${encodeURIComponent(
                item.video.noWatermark
              )}&filename=tiktok_${item.id}.mp4&type=video`
            : '';

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="group bg-[#0e1320] border border-slate-800 hover:border-slate-700/80 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-900/80 shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                {item.duration > 0 && (
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[9px] font-mono text-white">
                    {Math.floor(item.duration / 60)}:
                    {(item.duration % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                  <User className="w-3 h-3" />
                  <span className="truncate">@{item.author.uniqueId}</span>
                </div>
                <h4 className="text-xs font-semibold text-white truncate mt-1">
                  {item.title || 'فيديو تيك توك'}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <span>👍 {item.stats.likes.toLocaleString()}</span>
                  <span>•</span>
                  <span>👁️ {item.stats.views.toLocaleString()}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {proxyDownload && (
                  <a
                    href={proxyDownload}
                    className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                    title="تحميل مباشر"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                {directUrl && (
                  <button
                    onClick={(e) => handleCopy(e, directUrl, item.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="نسخ الرابط المباشر"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
