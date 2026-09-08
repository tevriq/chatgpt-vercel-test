const zlib = require('zlib');
const crypto = require('crypto');

const targets = {
  armv7: 'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/openwrt-armv7',
  linux: 'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/linux',
};

function oct(buf, start, len) {
  const s = buf.subarray(start, start + len).toString('utf8').replace(/\0.*$/, '').trim();
  return s ? parseInt(s, 8) || 0 : 0;
}
function cstr(buf, start, len) {
  return buf.subarray(start, start + len).toString('utf8').replace(/\0.*$/, '');
}
function printableStrings(buf, min = 5) {
  const out = [];
  let s = '';
  for (const b of buf) {
    if (b >= 32 && b <= 126) s += String.fromCharCode(b);
    else { if (s.length >= min) out.push(s); s = ''; }
  }
  if (s.length >= min) out.push(s);
  return out;
}
function elfInfo(buf) {
  if (buf.length < 20 || buf[0] !== 0x7f || buf[1] !== 0x45 || buf[2] !== 0x4c || buf[3] !== 0x46) return null;
  const cls = buf[4] === 1 ? 'ELF32' : buf[4] === 2 ? 'ELF64' : String(buf[4]);
  const le = buf[5] === 1;
  const machine = le ? buf.readUInt16LE(18) : buf.readUInt16BE(18);
  const machineNames = {3:'x86',8:'MIPS',40:'ARM',62:'x86_64',183:'AArch64'};
  const strs = printableStrings(buf);
  const interesting = strs.filter(s =>
    /(^|\/)(lib[^/\s]+\.so[^\s]*)|https?:\/\/|mihomo|clash|sing-box|xray|v2ray|tun2socks|hysteria|trojan|wireguard|relayway|flutter|iptables|nft|tproxy|tun/i.test(s)
  );
  return { cls, endian: le ? 'little' : 'big', machine, machineName: machineNames[machine] || 'unknown', interestingStrings: [...new Set(interesting)].slice(0, 300) };
}
function parseTar(buf) {
  const entries = [];
  for (let off = 0; off + 512 <= buf.length;) {
    const h = buf.subarray(off, off + 512);
    if (h.every(b => b === 0)) break;
    let name = cstr(h, 0, 100);
    const prefix = cstr(h, 345, 155);
    if (prefix) name = prefix + '/' + name;
    const size = oct(h, 124, 12);
    const mode = cstr(h, 100, 8);
    const type = String.fromCharCode(h[156] || 48);
    const link = cstr(h, 157, 100);
    const dataStart = off + 512;
    const dataEnd = dataStart + size;
    if (dataEnd > buf.length) break;
    const data = buf.subarray(dataStart, dataEnd);
    const rec = { name, size, mode, type, link: link || undefined };
    if (size > 0) {
      rec.sha256 = crypto.createHash('sha256').update(data).digest('hex');
      const elf = elfInfo(data);
      if (elf) rec.elf = elf;
      const looksText = data.subarray(0, Math.min(data.length, 4096)).every(b => b === 9 || b === 10 || b === 13 || (b >= 32 && b <= 126));
      if (looksText && size <= 200000) rec.text = data.toString('utf8').slice(0, 50000);
    }
    entries.push(rec);
    off = dataStart + Math.ceil(size / 512) * 512;
  }
  return entries;
}

export default async function handler(req, res) {
  const target = String(req.query.target || 'armv7');
  if (!targets[target]) return res.status(400).json({error:'target must be armv7 or linux'});
  try {
    const r = await fetch(targets[target], {redirect:'follow', headers:{'user-agent':'curl/8.0'}});
    if (!r.ok) return res.status(502).json({status:r.status, url:r.url});
    const compressed = Buffer.from(await r.arrayBuffer());
    const tar = zlib.gunzipSync(compressed);
    const entries = parseTar(tar);
    res.setHeader('Cache-Control','no-store');
    res.status(200).json({
      target,
      finalUrl:r.url,
      compressedBytes:compressed.length,
      uncompressedBytes:tar.length,
      archiveSha256:crypto.createHash('sha256').update(compressed).digest('hex'),
      entryCount:entries.length,
      entries,
    });
  } catch (e) {
    res.status(500).json({error:String(e?.stack || e)});
  }
}
