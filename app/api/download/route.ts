import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');
  const filename = req.nextUrl.searchParams.get('filename') || 'tiktok_video.mp4';
  const type = req.nextUrl.searchParams.get('type') || 'video';
  const mode = req.nextUrl.searchParams.get('mode') || 'attachment'; // 'attachment' or 'inline'

  if (!urlParam) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    let targetUrl = urlParam;
    if (targetUrl.startsWith('//')) {
      targetUrl = 'https:' + targetUrl;
    } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // Forward range header if video streaming inline
    const rangeHeader = req.headers.get('range');
    const fetchHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Referer: 'https://www.tiktok.com/',
      Accept: '*/*',
    };

    if (rangeHeader && mode === 'inline') {
      fetchHeaders['Range'] = rangeHeader;
    }

    const upstreamResponse = await fetch(targetUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
      return new NextResponse(`Upstream returned ${upstreamResponse.status}`, {
        status: upstreamResponse.status,
      });
    }

    // Determine content type
    let contentType = upstreamResponse.headers.get('content-type') || 'application/octet-stream';
    if (type === 'video' && !contentType.includes('video')) {
      contentType = 'video/mp4';
    } else if (type === 'audio' && !contentType.includes('audio')) {
      contentType = 'audio/mpeg';
    } else if (type === 'image' && !contentType.includes('image')) {
      contentType = 'image/jpeg';
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // Force attachment download if requested
    const safeFilename = encodeURIComponent(filename.replace(/[^a-zA-Z0-9._-]/g, '_'));
    if (mode === 'attachment') {
      responseHeaders.set(
        'Content-Disposition',
        `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`
      );
    } else {
      responseHeaders.set('Content-Disposition', 'inline');
    }

    const contentLength = upstreamResponse.headers.get('content-length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }

    const contentRange = upstreamResponse.headers.get('content-range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Cache-Control', 'public, max-age=86400');

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new NextResponse(`Download proxy error: ${msg}`, { status: 502 });
  }
}
