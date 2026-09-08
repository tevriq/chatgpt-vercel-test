const crypto = require('crypto');

const targets = {
  linux: 'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/linux',
  armv7: 'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/openwrt-armv7',
};

function hex(buf, n = 64) {
  return Buffer.from(buf).subarray(0, n).toString('hex');
}

export default async function handler(req, res) {
  const out = {};
  for (const [name, url] of Object.entries(targets)) {
    try {
      const head = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'curl/8.0' } });
      const ranged = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'curl/8.0', range: 'bytes=0-65535' } });
      const ab = await ranged.arrayBuffer();
      const buf = Buffer.from(ab);
      out[name] = {
        url,
        head: {
          status: head.status,
          finalUrl: head.url,
          contentType: head.headers.get('content-type'),
          contentLength: head.headers.get('content-length'),
          contentDisposition: head.headers.get('content-disposition'),
          acceptRanges: head.headers.get('accept-ranges'),
          etag: head.headers.get('etag'),
          lastModified: head.headers.get('last-modified'),
        },
        range: {
          status: ranged.status,
          finalUrl: ranged.url,
          contentType: ranged.headers.get('content-type'),
          contentLength: ranged.headers.get('content-length'),
          contentRange: ranged.headers.get('content-range'),
          bytesReceived: buf.length,
          first64Hex: hex(buf),
          sha256Received: crypto.createHash('sha256').update(buf).digest('hex'),
        },
      };
    } catch (e) {
      out[name] = { ok: false, error: String(e?.stack || e) };
    }
  }
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(out);
}
