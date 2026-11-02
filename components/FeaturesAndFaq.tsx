'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, CheckCircle2, Shield, Zap, Terminal } from 'lucide-react';

const FAQS = [
  {
    q: 'كيف يمكنني الحصول على الرابط المباشر لفيديو تيك توك؟',
    a: 'افتح تطبيق TikTok أو المتصفح، اضغط على زر المشاركة (Share) في الفيديو، ثم اختر "نسخ الرابط" (Copy Link). قم بلصق الرابط في المربع أعلاه واضغط على "استخراج الرابط المباشر"، وستحصل فوراً على رابط MP4 المباشر للتحميل بدون أي علامة مائية.',
  },
  {
    q: 'كيف أستخدم الـ API في تطبيقاتي أو البوت الخاص بي؟',
    a: 'يمكنك إرسال طلب GET أو POST إلى https://your-domain/api/extract مع تمرير رابط تيك توك في المعامل url. الـ API مجاني ويدعم CORS بالكامل، ويعيد لك كائن JSON يحتوي على رابط MP4 المباشر بدون علامة مائية، ورابط الصوت MP3، ورابط التحميل التلقائي.',
  },
  {
    q: 'هل التحميل متاح بدون علامة مائية وبأعلى جودة HD؟',
    a: 'نعم 100%! الأداة تستخرج الفيديو الخام الأصلي المرفوع على خوادم تيك توك قبل دمج الشعار أو اسم المستخدم، كما توفر خيار الجودة الفائقة HD إذا كان الفيديو الأصلي مصوراً بدقة عالية.',
  },
  {
    q: 'كيف أقوم بالتنزيل على أجهزة iPhone أو Android؟',
    a: 'على أجهزة Android و iPhone، بمجرد الضغط على زر "تحميل مباشر بدون علامة مائية"، سيبدأ التنزيل تلقائياً في مجلد التنزيلات أو تطبيق الملفات، ويمكنك أيضاً مسح رمز QR المعروض بكاميرا هاتفك للتحميل المباشر فوراً.',
  },
  {
    q: 'هل تدعم الأداة منشورات ألبومات الصور (Slideshows)؟',
    a: 'نعم، إذا كان منشور تيك توك عبارة عن صور متعددة وموسيقى، ستعرض لك الأداة معرض الصور كاملاً مع إمكانية تحميل كل صورة بدقتها الأصلية وتحميل المقطع الصوتي MP3 كذلك.',
  },
];

export default function FeaturesAndFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="w-full max-w-4xl mx-auto py-12 space-y-12">
      {/* How it works steps */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            خطوات بسيطة وسريعة
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            كيف تعمل أداة استخراج روابط تيك توك؟
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 font-extrabold flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-bold text-white text-sm mb-1">نسخ رابط الفيديو</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              افتح تيك توك، اضغط على مشاركة ثم نسخ الرابط من أي فيديو أو منشور.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-bold text-white text-sm mb-1">لصق الرابط</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ضع الرابط في خانة البحث بالأعلى واضغط على زر &quot;استخراج الرابط&quot;.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-bold text-white text-sm mb-1">التحميل المباشر</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              حمل الفيديو بدون علامة مائية أو بصيغة MP3، أو انسخ الرابط المباشر.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-white">الأسئلة الشائعة (FAQ)</h3>
          <p className="text-xs text-slate-400 mt-1">كل ما تحتاج لمعرفته حول الخدمة وواجهة الـ API</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800/80 bg-[#0e1320] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-right flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-rose-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
