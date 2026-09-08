export default async function handler(req, res) {
  const targets = {
    linux: 'https://backendoss.trafficmanager.net/builds/install/nfcloud-linux.sh',
    openwrt: 'https://backendoss.trafficmanager.net/builds/install/nfcloud-openwrt.sh',
  };

  const out = {};
  for (const [name, url] of Object.entries(targets)) {
    try {
      const r = await fetch(url, {
        redirect: 'follow',
        headers: {
          'user-agent': 'curl/8.0',
          'accept': '*/*',
        },
      });
      const text = await r.text();
      const urls = [...new Set(text.match(/https?:\/\/[^\s'\"<>]+/g) || [])];
      out[name] = {
        ok: r.ok,
        status: r.status,
        finalUrl: r.url,
        contentType: r.headers.get('content-type'),
        contentLength: r.headers.get('content-length'),
        bytes: Buffer.byteLength(text),
        urls,
        body: text,
      };
    } catch (e) {
      out[name] = { ok: false, error: String(e?.stack || e) };
    }
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(out);
}
