import { NextRequest, NextResponse } from 'next/server';
import { extractTikTok, extractTikTokUrl } from '@/lib/tiktok-extractor';

export const runtime = 'nodejs';

// Helper to add standard CORS headers for external developer access
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

/**
 * GET /api/extract?url=https://www.tiktok.com/@...
 */
export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing "url" parameter in query string. Example: /api/extract?url=https://www.tiktok.com/@username/video/1234567890',
        errorAr: 'يرجى تزويد معامل url في الرابط. مثال: /api/extract?url=https://www.tiktok.com/@username/video/1234567890',
      },
      {
        status: 400,
        headers: corsHeaders(),
      }
    );
  }

  const result = await extractTikTok(urlParam);

  if (!result.success || !result.data) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        errorAr: result.errorAr,
        executionTimeMs: result.executionTimeMs,
      },
      {
        status: 422,
        headers: corsHeaders(),
      }
    );
  }

  // Construct convenient direct links and proxy download URLs
  const origin = req.nextUrl.origin;
  const videoData = result.data;

  const responsePayload = {
    success: true,
    executionTimeMs: result.executionTimeMs,
    data: {
      id: videoData.id,
      title: videoData.title,
      duration: videoData.duration,
      isPhoto: videoData.isPhoto,
      author: videoData.author,
      stats: videoData.stats,
      cover: videoData.cover,
      originCover: videoData.originCover,
      downloads: {
        // Direct media links
        video_no_watermark: videoData.video?.noWatermark,
        video_hd: videoData.video?.hd,
        video_watermark: videoData.video?.watermark,
        music_audio: videoData.music?.url,
        photos: videoData.images,
        // Server proxy direct download attachments (bypasses browser CORS & forces download)
        proxy_video_download: videoData.video?.noWatermark
          ? `${origin}/api/download?url=${encodeURIComponent(videoData.video.noWatermark)}&filename=tiktok_${videoData.id}.mp4&type=video`
          : undefined,
        proxy_hd_download: videoData.video?.hd
          ? `${origin}/api/download?url=${encodeURIComponent(videoData.video.hd)}&filename=tiktok_${videoData.id}_hd.mp4&type=video`
          : undefined,
        proxy_music_download: videoData.music?.url
          ? `${origin}/api/download?url=${encodeURIComponent(videoData.music.url)}&filename=tiktok_${videoData.id}_sound.mp3&type=audio`
          : undefined,
      },
      music: videoData.music,
      rawUrl: videoData.rawUrl,
    },
    meta: {
      generator: 'TikTok Direct Video Extractor API',
      timestamp: new Date().toISOString(),
      usage_help: 'You can use video_no_watermark for direct CDN stream or proxy_video_download for forced file download.',
    },
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: corsHeaders(),
  });
}

/**
 * POST /api/extract
 * Body: { "url": "https://www.tiktok.com/..." }
 */
export async function POST(req: NextRequest) {
  try {
    let body: { url?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON body. Please provide { "url": "https://www.tiktok.com/..." }',
          errorAr: 'صيغة JSON غير صحيحة. يرجى إرسال { "url": "..." }',
        },
        { status: 400, headers: corsHeaders() }
      );
    }

    const rawUrl = body.url;
    if (!rawUrl || typeof rawUrl !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Field "url" is required in JSON body',
          errorAr: 'حقل "url" مطلوب في بيانات الطلب',
        },
        { status: 400, headers: corsHeaders() }
      );
    }

    const detectedUrl = extractTikTokUrl(rawUrl);
    if (!detectedUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid TikTok link detected in the provided url string',
          errorAr: 'لم يتم العثور على رابط تيك توك صالح',
        },
        { status: 400, headers: corsHeaders() }
      );
    }

    const result = await extractTikTok(detectedUrl);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          errorAr: result.errorAr,
          executionTimeMs: result.executionTimeMs,
        },
        { status: 422, headers: corsHeaders() }
      );
    }

    const origin = req.nextUrl.origin;
    const videoData = result.data;

    return NextResponse.json(
      {
        success: true,
        executionTimeMs: result.executionTimeMs,
        data: {
          id: videoData.id,
          title: videoData.title,
          duration: videoData.duration,
          isPhoto: videoData.isPhoto,
          author: videoData.author,
          stats: videoData.stats,
          cover: videoData.cover,
          originCover: videoData.originCover,
          downloads: {
            video_no_watermark: videoData.video?.noWatermark,
            video_hd: videoData.video?.hd,
            video_watermark: videoData.video?.watermark,
            music_audio: videoData.music?.url,
            photos: videoData.images,
            proxy_video_download: videoData.video?.noWatermark
              ? `${origin}/api/download?url=${encodeURIComponent(videoData.video.noWatermark)}&filename=tiktok_${videoData.id}.mp4&type=video`
              : undefined,
            proxy_hd_download: videoData.video?.hd
              ? `${origin}/api/download?url=${encodeURIComponent(videoData.video.hd)}&filename=tiktok_${videoData.id}_hd.mp4&type=video`
              : undefined,
            proxy_music_download: videoData.music?.url
              ? `${origin}/api/download?url=${encodeURIComponent(videoData.music.url)}&filename=tiktok_${videoData.id}_sound.mp3&type=audio`
              : undefined,
          },
          music: videoData.music,
          rawUrl: videoData.rawUrl,
        },
        meta: {
          generator: 'TikTok Direct Video Extractor API',
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: message || 'Internal extraction server error',
        errorAr: 'حدث خطأ في الخادم أثناء المعالجة',
      },
      { status: 500, headers: corsHeaders() }
    );
  }
}
