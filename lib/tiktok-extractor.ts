export interface TikTokAuthor {
  id: string;
  uniqueId: string;
  nickname: string;
  avatar: string;
}

export interface TikTokMusic {
  id: string;
  title: string;
  author: string;
  url: string;
  duration?: number;
  cover?: string;
}

export interface TikTokStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  downloads: number;
}

export interface TikTokVideoData {
  id: string;
  title: string;
  cover: string;
  originCover: string;
  duration: number;
  isPhoto: boolean;
  images?: string[];
  video?: {
    noWatermark: string;
    hd?: string;
    watermark?: string;
    size?: number;
  };
  music?: TikTokMusic;
  author: TikTokAuthor;
  stats: TikTokStats;
  createTime?: number;
  rawUrl: string;
}

export interface ExtractionResult {
  success: boolean;
  data?: TikTokVideoData;
  error?: string;
  errorAr?: string;
  executionTimeMs: number;
}

/**
 * Extracts a TikTok URL from any text snippet (handles share messages with text + URL)
 */
export function extractTikTokUrl(text: string): string | null {
  if (!text) return null;
  const trimmed = text.trim();

  // Regex to match tiktok domains (vm.tiktok.com, vt.tiktok.com, tiktok.com, etc.)
  const regex = /(https?:\/\/(?:(?:www|v[mt]|m)\.)?tiktok\.com\/(?:[^\s]+)|https?:\/\/(?:www\.)?douyin\.com\/(?:[^\s]+))/i;
  const match = trimmed.match(regex);
  if (match) {
    return match[0].split('?')[0] + (match[0].includes('?') ? '?' + match[0].split('?')[1] : '');
  }

  // If user just typed something with tiktok.com
  if (trimmed.includes('tiktok.com') || trimmed.includes('douyin.com')) {
    return trimmed;
  }

  return null;
}

/**
 * Resolves short links (like vm.tiktok.com) to target location if needed
 */
export async function resolveRedirect(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });
    return response.url || url;
  } catch {
    return url;
  }
}

/**
 * Ensures a TikWM link is an absolute URL
 */
function makeAbsolute(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  return `https://www.tikwm.com${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Extracts TikTok video or photo data using TikWM primary engine
 */
export async function extractTikTok(rawInput: string): Promise<ExtractionResult> {
  const startTime = Date.now();
  const cleanUrl = extractTikTokUrl(rawInput);

  if (!cleanUrl) {
    return {
      success: false,
      error: 'Invalid TikTok URL. Please provide a valid link from tiktok.com or vm.tiktok.com',
      errorAr: 'رابط تيك توك غير صالح. يرجى إدخال رابط صحيح من تطبيق أو موقع تيك توك.',
      executionTimeMs: Date.now() - startTime,
    };
  }

  try {
    // Call TikWM API with HD enabled
    const tikwmApiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(tikwmApiUrl, {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`TikWM server responded with status: ${response.status}`);
    }

    const json = await response.json();

    if (json.code !== 0 || !json.data) {
      const msg = json.msg || 'Unable to fetch video details';
      return {
        success: false,
        error: msg,
        errorAr: 'تعذر جلب تفاصيل الفيديو. قد يكون الفيديو خاصاً أو محذوفاً أو تم تقييده.',
        executionTimeMs: Date.now() - startTime,
      };
    }

    const d = json.data;
    const isPhoto = Array.isArray(d.images) && d.images.length > 0;

    const noWatermark = makeAbsolute(d.play);
    const hd = d.hdplay ? makeAbsolute(d.hdplay) : undefined;
    const watermark = d.wmplay ? makeAbsolute(d.wmplay) : undefined;
    const musicUrl = makeAbsolute(d.music);
    const cover = makeAbsolute(d.cover);
    const originCover = makeAbsolute(d.origin_cover || d.cover);
    const avatar = makeAbsolute(d.author?.avatar);

    const images = isPhoto
      ? d.images.map((img: string) => makeAbsolute(img))
      : undefined;

    const resultData: TikTokVideoData = {
      id: String(d.id || ''),
      title: d.title || 'TikTok Video',
      cover,
      originCover,
      duration: Number(d.duration || 0),
      isPhoto,
      images,
      video: !isPhoto
        ? {
            noWatermark,
            hd,
            watermark,
            size: d.size ? Number(d.size) : undefined,
          }
        : undefined,
      music: d.music
        ? {
            id: String(d.music_info?.id || ''),
            title: d.music_info?.title || 'Original Sound',
            author: d.music_info?.author || d.author?.nickname || 'Unknown Artist',
            url: musicUrl,
            duration: d.music_info?.duration,
            cover: makeAbsolute(d.music_info?.cover),
          }
        : undefined,
      author: {
        id: String(d.author?.id || ''),
        uniqueId: d.author?.unique_id || 'user',
        nickname: d.author?.nickname || 'TikTok User',
        avatar,
      },
      stats: {
        views: Number(d.play_count || 0),
        likes: Number(d.digg_count || 0),
        comments: Number(d.comment_count || 0),
        shares: Number(d.share_count || 0),
        downloads: Number(d.download_count || 0),
      },
      createTime: d.create_time,
      rawUrl: cleanUrl,
    };

    return {
      success: true,
      data: resultData,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: message || 'Failed to extract TikTok media',
      errorAr: 'حدث خطأ أثناء معالجة الرابط. يرجى التأكد من الرابط والمحاولة مجدداً.',
      executionTimeMs: Date.now() - startTime,
    };
  }
}
