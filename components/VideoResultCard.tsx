'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Copy,
  Check,
  Music,
  Share2,
  ExternalLink,
  QrCode,
  Sparkles,
  Heart,
  Eye,
  MessageCircle,
  Clock,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { TikTokVideoData } from '@/lib/tiktok-extractor';

interface VideoResultCardProps {
  data: TikTokVideoData;
  executionTimeMs?: number;
}

export default function VideoResultCard({ data, executionTimeMs }: VideoResultCardProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [showRawLinks, setShowRawLinks] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = data.video?.noWatermark || '';
  const hdVideoUrl = data.video?.hd || '';
  const musicUrl = data.music?.url || '';

  // Proxy download endpoints
  const proxyVideoUrl = videoUrl
    ? `/api/download?url=${encodeURIComponent(videoUrl)}&filename=tiktok_${data.id}_no_wm.mp4&type=video`
    : '';
  const proxyHdUrl = hdVideoUrl
    ? `/api/download?url=${encodeURIComponent(hdVideoUrl)}&filename=tiktok_${data.id}_hd.mp4&type=video`
    : '';
  const proxyMusicUrl = musicUrl
    ? `/api/download?url=${encodeURIComponent(musicUrl)}&filename=tiktok_${data.id}_audio.mp3&type=audio`
    : '';

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatDuration = (secs: number) => {
    if (!secs) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    typeof window !== 'undefined' ? `${window.location.origin}${proxyVideoUrl}` : proxyVideoUrl
  )}`;

  return (
    <div className="w-full bg-[#0e131f] border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/60 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header bar with author & timing */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-rose-500/30 bg-slate-800 shrink-0">
            {data.author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.author.avatar}
                alt={data.author.nickname}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                {data.author.uniqueId.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-base">
                {data.author.nickname || data.author.uniqueId}
              </h3>
              <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                @{data.author.uniqueId}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>معرف الفيديو: {data.id}</span>
              {executionTimeMs ? (
                <>
                  <span>•</span>
                  <span className="text-emerald-400">⚡ تم الاستخراج في {executionTimeMs}ms</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        {/* Quick share and QR buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQr(!showQr)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 flex items-center gap-1.5 transition-all"
            title="تحميل على الهاتف عبر رمز QR"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">رمز QR للهاتف</span>
          </button>
          <a
            href={data.rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all"
            title="فتح في تيك توك"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* QR Code Modal/Panel */}
      {showQr && (
        <div className="relative z-10 mt-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          <div className="p-2 bg-white rounded-lg shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImageUrl} alt="QR Code" className="w-32 h-32" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              امسح الرمز بكاميرا الهاتف للتحميل المباشر
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              افتح كاميرا هاتفك وامسح رمز الاستجابة السريعة (QR) لبدء تنزيل الفيديو مباشرة على هاتفك الذكي فوراً بدون تثبيت أي برامج.
            </p>
            <button
              onClick={() => setShowQr(false)}
              className="text-xs text-rose-400 hover:underline pt-1 block"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="relative z-10 mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player / Media Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] max-h-[500px] rounded-2xl overflow-hidden bg-black/90 border border-slate-800 shadow-xl flex items-center justify-center group">
            {data.isPhoto && data.images && data.images.length > 0 ? (
              // Photos / Slideshow Preview
              <div className="relative w-full h-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.images[selectedPhotoIndex] || data.cover}
                  alt={`TikTok slide ${selectedPhotoIndex + 1}`}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center justify-between text-xs text-white">
                  <span>
                    صورة {selectedPhotoIndex + 1} من {data.images.length}
                  </span>
                  <a
                    href={`/api/download?url=${encodeURIComponent(
                      data.images[selectedPhotoIndex]
                    )}&filename=tiktok_photo_${data.id}_${selectedPhotoIndex + 1}.jpg&type=image`}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> تحميل هذه الصورة
                  </a>
                </div>
              </div>
            ) : videoUrl ? (
              // HTML5 Video Player
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={data.cover}
                  controls
                  playsInline
                  loop
                  muted={isMuted}
                  className="w-full h-full object-contain"
                >
                  <source src={videoUrl} type="video/mp4" />
                  متصفحك لا يدعم مشغل الفيديو المباشر.
                </video>
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !videoRef.current.muted;
                      setIsMuted(videoRef.current.muted);
                    }
                  }}
                  className="absolute top-3 left-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              // Fallback cover
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.cover}
                alt={data.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Duration pill */}
            {data.duration > 0 && (
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-white flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{formatDuration(data.duration)}</span>
              </div>
            )}
          </div>

          {/* Photo album thumbnails if multiple images */}
          {data.isPhoto && data.images && data.images.length > 1 && (
            <div className="w-full max-w-[340px] mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {data.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedPhotoIndex === idx
                      ? 'border-cyan-400 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`thumb ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Stats & Direct Download Options */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Caption / Title */}
          <div>
            <h4 className="text-slate-100 font-semibold text-base sm:text-lg leading-relaxed line-clamp-3">
              {data.title || 'فيديو تيك توك بدون عنوان'}
            </h4>

            {/* Sound / Music track */}
            {data.music && (
              <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5">
                <div className="w-7 h-7 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate text-slate-200">
                    {data.music.title}
                  </div>
                  <div className="text-slate-400 text-[11px] truncate">
                    بصوت: {data.music.author}
                  </div>
                </div>
                {musicUrl && (
                  <a
                    href={proxyMusicUrl}
                    className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-2.5 py-1 rounded-md font-medium shrink-0 flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" /> تحميل MP3
                  </a>
                )}
              </div>
            )}

            {/* Statistics Row */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-2">
                <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>مشاهدات</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-white">
                  {formatNumber(data.stats.views)}
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-2">
                <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>إعجابات</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-white">
                  {formatNumber(data.stats.likes)}
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-2">
                <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>تعليقات</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-white">
                  {formatNumber(data.stats.comments)}
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-2">
                <div className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-1">
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مشاركات</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-white">
                  {formatNumber(data.stats.shares)}
                </div>
              </div>
            </div>
          </div>

          {/* DOWNLOAD ACTION BUTTONS (The Core of the App!) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4 text-rose-400" />
              خيارات التنزيل المباشر
            </h5>

            {!data.isPhoto ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Main Direct Download (No Watermark) */}
                <a
                  href={proxyVideoUrl}
                  className="sm:col-span-2 group relative overflow-hidden flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-base shadow-lg shadow-rose-950/40 transition-all transform active:scale-[0.99]"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>تحميل مباشر بدون علامة مائية (MP4)</span>
                  <span className="text-[11px] bg-black/20 px-2 py-0.5 rounded-full font-normal">
                    سريع ⚡
                  </span>
                </a>

                {/* 2. HD Video Download (if available) */}
                {hdVideoUrl ? (
                  <a
                    href={proxyHdUrl}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>تحميل بجودة فائقة (HD)</span>
                  </a>
                ) : (
                  <button
                    onClick={() => copyToClipboard(videoUrl, 'direct_link')}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
                  >
                    {copiedType === 'direct_link' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                    <span>
                      {copiedType === 'direct_link'
                        ? 'تم نسخ الرابط المباشر!'
                        : 'نسخ رابط الفيديو المباشر'}
                    </span>
                  </button>
                )}

                {/* 3. Audio / MP3 Download */}
                {musicUrl && (
                  <a
                    href={proxyMusicUrl}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-rose-500/30 text-rose-300 hover:text-white font-bold text-sm transition-all"
                  >
                    <Music className="w-4 h-4 text-rose-400" />
                    <span>تحميل الصوت فقط (MP3)</span>
                  </a>
                )}

                {/* 4. Cover Image Download */}
                <a
                  href={`/api/download?url=${encodeURIComponent(
                    data.originCover || data.cover
                  )}&filename=tiktok_${data.id}_cover.jpg&type=image`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-medium text-xs transition-all"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>تحميل غلاف الفيديو (Cover)</span>
                </a>

                {/* 5. Watermarked Original (if user specifically wants it) */}
                {data.video?.watermark && (
                  <a
                    href={`/api/download?url=${encodeURIComponent(
                      data.video.watermark
                    )}&filename=tiktok_${data.id}_watermark.mp4&type=video`}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-white font-medium text-xs transition-all"
                  >
                    <Film className="w-3.5 h-3.5 text-slate-400" />
                    <span>تحميل مع العلامة المائية</span>
                  </a>
                )}
              </div>
            ) : (
              // Photos Download Block
              <div className="space-y-2">
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    هذا المنشور عبارة عن ألبوم صور تيك توك يحتوي على {data.images?.length || 0} صورة
                    بدون علامة مائية.
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.images?.map((img, i) => (
                    <a
                      key={i}
                      href={`/api/download?url=${encodeURIComponent(
                        img
                      )}&filename=tiktok_photo_${data.id}_${i + 1}.jpg&type=image`}
                      className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center justify-between transition-all"
                    >
                      <span className="font-semibold">تنزيل صورة #{i + 1}</span>
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Raw Links & Developer Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowRawLinks(!showRawLinks)}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <span>{showRawLinks ? 'إخفاء الروابط الخام للمطورين' : 'عرض الروابط الخام للمطورين (Direct Raw URLs)'}</span>
            </button>

            {showRawLinks && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2.5">
                <div>
                  <div className="text-slate-400 mb-1 flex items-center justify-between">
                    <span className="text-rose-400 font-bold">Direct MP4 URL:</span>
                    <button
                      onClick={() => copyToClipboard(videoUrl, 'raw_mp4')}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {copiedType === 'raw_mp4' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      نسخ
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={videoUrl}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px] truncate select-all"
                  />
                </div>

                {hdVideoUrl && (
                  <div>
                    <div className="text-slate-400 mb-1 flex items-center justify-between">
                      <span className="text-cyan-400 font-bold">HD MP4 URL:</span>
                      <button
                        onClick={() => copyToClipboard(hdVideoUrl, 'raw_hd')}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        {copiedType === 'raw_hd' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        نسخ
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={hdVideoUrl}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px] truncate select-all"
                    />
                  </div>
                )}

                {musicUrl && (
                  <div>
                    <div className="text-slate-400 mb-1 flex items-center justify-between">
                      <span className="text-amber-400 font-bold">MP3 Audio URL:</span>
                      <button
                        onClick={() => copyToClipboard(musicUrl, 'raw_music')}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        {copiedType === 'raw_music' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        نسخ
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={musicUrl}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px] truncate select-all"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
