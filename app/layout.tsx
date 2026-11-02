import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'TikTok Direct Video Extractor & API | مستخرج روابط تيك توك المباشرة',
  description: 'أداة سريعة وخفيفة للحصول على الروابط المباشرة لفيديوهات تيك توك بدون علامة مائية مع واجهة برمجية API متكاملة للمطورين.',
  openGraph: {
    title: 'TikTok Direct Video Extractor & API',
    description: 'أداة سريعة وخفيفة للحصول على الروابط المباشرة لفيديوهات تيك توك بدون علامة مائية مع واجهة برمجية API متكاملة.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TikTok Direct Video Extractor & API',
    description: 'أداة سريعة وخفيفة للحصول على الروابط المباشرة لفيديوهات تيك توك بدون علامة مائية.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`dark ${tajawal.variable}`}>
      <body className="min-h-screen bg-[#090b10] text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
