'use client';

import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Play,
  Send,
  Loader2,
  Globe,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function ApiDocumentation() {
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python' | 'php' | 'node'>('curl');
  const [testUrl, setTestUrl] = useState('https://www.tiktok.com/@platosclosethagerstown/video/7698121092979756319');
  const [testMethod, setTestMethod] = useState<'GET' | 'POST'>('GET');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Dynamic host based on current environment
  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  const codeSnippets = {
    curl: testMethod === 'GET'
      ? `curl -X GET "${appOrigin}/api/extract?url=${encodeURIComponent(testUrl)}"`
      : `curl -X POST "${appOrigin}/api/extract" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "${testUrl}"}'`,

    js: testMethod === 'GET'
      ? `// JavaScript (Fetch GET)
const response = await fetch(
  "${appOrigin}/api/extract?url=" + encodeURIComponent("${testUrl}")
);
const result = await response.json();

if (result.success) {
  console.log("Direct Video MP4:", result.data.downloads.video_no_watermark);
  console.log("Audio MP3:", result.data.downloads.music_audio);
  console.log("Forced Download URL:", result.data.downloads.proxy_video_download);
}`
      : `// JavaScript (Fetch POST)
const response = await fetch("${appOrigin}/api/extract", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "${testUrl}" })
});
const result = await response.json();
console.log("Direct Video URL:", result.data.downloads.video_no_watermark);`,

    python: `import requests

url = "${appOrigin}/api/extract"
params = {"url": "${testUrl}"}

response = requests.get(url, params=params)
data = response.json()

if data.get("success"):
    video_url = data["data"]["downloads"]["video_no_watermark"]
    title = data["data"]["title"]
    print(f"Title: {title}")
    print(f"Direct Video Download Link: {video_url}")
else:
    print("Error:", data.get("error"))`,

    php: `<?php
$apiUrl = "${appOrigin}/api/extract?url=" . urlencode("${testUrl}");
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result['success']) {
    $videoLink = $result['data']['downloads']['video_no_watermark'];
    echo "Direct Video URL: " . $videoLink;
}
?>`,

    node: `import fetch from 'node-fetch';

async function getTikTokDirect(videoUrl) {
  const endpoint = \`${appOrigin}/api/extract?url=\${encodeURIComponent(videoUrl)}\`;
  const res = await fetch(endpoint);
  const json = await res.json();
  
  if (json.success) {
    return {
      title: json.data.title,
      directMp4: json.data.downloads.video_no_watermark,
      directHd: json.data.downloads.video_hd,
      directMp3: json.data.downloads.music_audio
    };
  }
  throw new Error(json.error);
}

// Example usage:
getTikTokDirect("${testUrl}").then(console.log);`,
  };

  const handleTestApi = async () => {
    if (!testUrl.trim()) return;
    setIsLoading(true);
    setApiResponse(null);
    setResponseStatus(null);
    setExecutionTime(null);

    const start = performance.now();
    try {
      let res: Response;
      if (testMethod === 'GET') {
        res = await fetch(`/api/extract?url=${encodeURIComponent(testUrl)}`);
      } else {
        res = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: testUrl }),
        });
      }

      const elapsed = Math.round(performance.now() - start);
      setResponseStatus(res.status);
      setExecutionTime(elapsed);

      const json = await res.json();
      setApiResponse(JSON.stringify(json, null, 2));
    } catch (err: unknown) {
      setResponseStatus(500);
      setExecutionTime(Math.round(performance.now() - start));
      setApiResponse(
        JSON.stringify(
          {
            success: false,
            error: err instanceof Error ? err.message : String(err),
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyResponseText = () => {
    if (!apiResponse) return;
    navigator.clipboard.writeText(apiResponse);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-6">
      {/* Intro Header */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
              <Code2 className="w-3.5 h-3.5" />
              واجهة برمجة التطبيقات للمطورين (REST API)
            </div>
            <h2 className="text-2xl font-black text-white">
              توثيق واجهة API لاستخراج الروابط المباشرة
            </h2>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              يمكنك ربط تطبيقك، موقعك، بوت تليجرام، أو أي سكربت بالـ API مباشرة للحصول على رابط MP4
              المباشر القابل للتنزيل بدون علامة مائية فوراً.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs font-mono text-emerald-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CORS Enabled (Access-Control-Allow-Origin: *)
          </div>
        </div>

        {/* Endpoints overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                GET
              </span>
              <code className="text-xs font-mono text-slate-200">/api/extract?url=&#123;TIKTOK_URL&#125;</code>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              طريقة سريعة ومباشرة عبر رابط GET لتمرير رابط تيك توك في الاستعلام، مثالية للبوتات والمتصفحات.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                POST
              </span>
              <code className="text-xs font-mono text-slate-200">/api/extract</code>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              طريقة POST مع جسم طلب JSON: <code className="text-cyan-300">&#123; &quot;url&quot;: &quot;...&quot; &#125;</code> ومناسبة لجميع أطر العمل وتطبيقات الموبايل.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive API Tester / Playground */}
      <div className="bg-[#0e1320] border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">
              مجرّب API التفاعلي الحي (Live API Playground)
            </h3>
          </div>
          <span className="text-xs text-slate-400">جرب الطلب الآن ولاحظ الاستجابة الفعلية</span>
        </div>

        {/* Tester Form */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={testMethod}
              onChange={(e) => setTestMethod(e.target.value as 'GET' | 'POST')}
              className="bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>

            <div className="flex-1 relative">
              <input
                type="text"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="رابط تيك توك للتجربة..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                dir="ltr"
              />
            </div>

            <button
              onClick={handleTestApi}
              disabled={isLoading || !testUrl.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال طلب API</span>
                </>
              )}
            </button>
          </div>

          {/* Response Box */}
          {apiResponse && (
            <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      responseStatus === 200
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    Status: {responseStatus}
                  </span>
                  {executionTime !== null && (
                    <span className="text-slate-400">⏱️ Time: {executionTime}ms</span>
                  )}
                </div>
                <button
                  onClick={copyResponseText}
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedResponse ? 'تم النسخ' : 'نسخ JSON'}</span>
                </button>
              </div>

              <pre
                className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-80 scrollbar-thin"
                dir="ltr"
              >
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Code Snippets for Developers */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-lg text-white">
              أمثلة برمجية للاستدعاء (Ready-to-use Code)
            </h3>
          </div>

          {/* Language selector tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['curl', 'js', 'python', 'php', 'node'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                  activeLang === lang
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Code display box */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
          <button
            onClick={copyCode}
            className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700/60"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>

          <pre
            className="p-5 pt-12 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed"
            dir="ltr"
          >
            {codeSnippets[activeLang]}
          </pre>
        </div>
      </div>

      {/* Schema / Fields Reference Table */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-lg text-white">دليل حقول الاستجابة (Response Fields Reference)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="py-2.5 px-3">الحقل (Field)</th>
                <th className="py-2.5 px-3">النوع (Type)</th>
                <th className="py-2.5 px-3">الوصف (Description)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-3 px-3 text-cyan-400 font-bold">data.downloads.video_no_watermark</td>
                <td className="py-3 px-3 text-slate-400">string (URL)</td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  الرابط المباشر لملف الفيديو MP4 نقي تماماً وبدون علامة مائية.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-cyan-400 font-bold">data.downloads.video_hd</td>
                <td className="py-3 px-3 text-slate-400">string (URL) | optional</td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  رابط الفيديو بأعلى دقة HD فائقة إن توفرت من المصدر.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-amber-400 font-bold">data.downloads.music_audio</td>
                <td className="py-3 px-3 text-slate-400">string (URL)</td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  الرابط المباشر لمقطع الصوت المدمج في الفيديو بصيغة MP3.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-emerald-400 font-bold">data.downloads.proxy_video_download</td>
                <td className="py-3 px-3 text-slate-400">string (URL)</td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  رابط تحميل مباشر مهيأ بـ Content-Disposition يجبر المتصفح على تحميل الملف فوراً باسم محدد.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-rose-400 font-bold">data.author</td>
                <td className="py-3 px-3 text-slate-400">object</td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  معلومات صانع المحتوى (uniqueId, nickname, avatar).
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-rose-400 font-bold">data.stats</td>
                <td className="py-3 px-3 text-slate-400">object</td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  إحصائيات الفيديو: عدد المشاهدات، الإعجابات، التعليقات، والمشاركات.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-rose-400 font-bold">data.isPhoto / photos</td>
                <td className="py-3 px-3 text-slate-400">boolean / array</td>
                <td className="py-3 px-3 text-slate-300 font-sans">
                  في حال كان منشور ألبوم صور، يحتوي على روابط جميع الصور المباشرة.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
