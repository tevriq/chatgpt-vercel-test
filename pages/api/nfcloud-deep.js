const zlib = require('zlib');
const crypto = require('crypto');

const TARGETS = {
  linux: 'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/linux',
  armv7: 'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/openwrt-armv7',
};

function cstr(buf, start, len) {
  return buf.subarray(start, start + len).toString('utf8').replace(/\0.*$/, '');
}
function oct(buf, start, len) {
  const s = cstr(buf, start, len).trim();
  return s ? (parseInt(s, 8) || 0) : 0;
}
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function isGzip(buf) { return buf && buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b; }
function gunzipMaybe(buf) { return isGzip(buf) ? zlib.gunzipSync(buf) : buf; }
function isElf(buf) { return buf?.length >= 20 && buf[0] === 0x7f && buf[1] === 0x45 && buf[2] === 0x4c && buf[3] === 0x46; }
function elfMeta(buf) {
  if (!isElf(buf)) return null;
  const le = buf[5] === 1;
  const machine = le ? buf.readUInt16LE(18) : buf.readUInt16BE(18);
  const names = {3:'x86',8:'MIPS',40:'ARM',62:'x86_64',183:'AArch64'};
  return {class:buf[4]===1?'ELF32':buf[4]===2?'ELF64':String(buf[4]), endian:le?'little':'big', machine, machineName:names[machine]||'unknown'};
}
function magic(buf) {
  if (!buf || !buf.length) return 'empty';
  if (isElf(buf)) return 'ELF';
  if (isGzip(buf)) return 'gzip';
  if (buf.length >= 4 && buf.subarray(0,4).toString('hex') === '504b0304') return 'zip';
  return buf.subarray(0,16).toString('hex');
}
function looksText(buf) {
  const s = buf.subarray(0, Math.min(buf.length, 4096));
  if (!s.length) return true;
  let good=0;
  for (const b of s) if (b===9||b===10||b===13||(b>=32&&b<=126)) good++;
  return good/s.length > 0.92;
}
function parseTar(buf, keep=true) {
  const entries=[]; const blobs={};
  for (let off=0; off+512<=buf.length;) {
    const h=buf.subarray(off,off+512);
    if (h.every(b=>b===0)) break;
    let name=cstr(h,0,100); const prefix=cstr(h,345,155); if(prefix) name=prefix+'/'+name;
    const size=oct(h,124,12), type=String.fromCharCode(h[156]||48), dataStart=off+512, dataEnd=dataStart+size;
    if (!name || dataEnd>buf.length) break;
    const data=buf.subarray(dataStart,dataEnd);
    entries.push({name,size,type,sha256:size?sha256(data):undefined,magic:size?magic(data):undefined,elf:elfMeta(data)||undefined});
    if (keep && size) blobs[name]=data;
    off=dataStart+Math.ceil(size/512)*512;
  }
  return {entries,blobs};
}

function asciiStrings(buf, min=6, maxStrings=250000) {
  const out=[]; let chars=[];
  const flush=()=>{ if(chars.length>=min && out.length<maxStrings) out.push(String.fromCharCode(...chars)); chars=[]; };
  for(let i=0;i<buf.length;i++) {
    const b=buf[i];
    if(b>=32&&b<=126) { chars.push(b); if(chars.length>4096) flush(); }
    else flush();
  }
  flush(); return out;
}

const FEATURES = {
  merlin: /Asuswrt-Merlin|Entware|plain-Linux/i,
  tun: /\/dev\/net\/tun|\bTUN\b|tun mode|tun device/i,
  redirect: /redirect mode|REDIRECT|tproxy/i,
  soMark: /SO_MARK|fwmark|firewall mark/i,
  ipRule: /ip rule|routing table 100|table 100/i,
  iptables: /iptables|ip6tables|netfilter/i,
  nftables: /nftables|\bnft\b/i,
  uci: /\bUCI\b|\/sbin\/uci|\/etc\/config/i,
  fakeIp: /fake[-_ ]?ip/i,
  geoip: /geoip:/i,
  geosite: /geosite:/i,
  dnsmasq: /dnsmasq/i,
  relaywayCore: /relayway[-_]?cored|relayway_cored/i,
  relaywayProxy: /relayway[-_:]?proxy|relayway_proxy/i,
  relaywayTransport: /relayway[-_:]?transport|relayway_transport/i,
  relaywayApp: /relayway[-_:]?app|relayway_app/i,
  flutter: /flutter_assets|libflutter|Flutter/i,
  vless: /\bVLESS\b|vless:/i,
  vmess: /\bVMess\b|vmess:/i,
  trojan: /\bTrojan\b|trojan:/i,
  shadowsocks: /Shadowsocks|SS2022/i,
  hysteria2: /Hysteria2|hy2:/i,
  wireguard: /WireGuard|wireguard:/i,
  anytls: /AnyTLS/i,
  reality: /REALITY/i,
  socks: /SOCKS5|socks5:/i,
  httpProxy: /HTTP proxy|http inbound/i,
  port7654: /7654/,
  bindAll: /0\.0\.0\.0:7654|0\.0\.0\.0/,
  updater: /auto.?update|check.?update|updater|download.?update|update.?url/i,
  telemetry: /telemetry|analytics|sentry|metrics/i,
  shellExec: /execve|Command::new|std::process|popen|\/bin\/sh|system\(/i,
  curlWget: /\bcurl\b|\bwget\b/i,
  jffs: /\/jffs\b/i,
  sshKeys: /\.ssh\/|authorized_keys|id_rsa|id_ed25519/i,
  shadow: /\/etc\/shadow/i,
  cron: /crontab|\/etc\/cron|cron\.d/i,
  rootHome: /\/root\b/i,
};

function scanBlob(buf, sampleLimit=4) {
  const strings=asciiStrings(buf);
  const features={}; const samples={};
  for(const [key,re] of Object.entries(FEATURES)) {
    const hits=[];
    for(const s of strings) if(re.test(s)) { if(hits.length<sampleLimit) hits.push(s.slice(0,500)); }
    features[key]=hits.length>0;
    if(hits.length) samples[key]=hits;
  }
  const urls=[]; const hosts=[];
  const urlRe=/https?:\/\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%-]+/g;
  const hostRe=/(?:[A-Za-z0-9-]+\.)+(?:com|net|org|io|one|pro|cn|dev|app|cloud|me|top|xyz|co|cc)\b/ig;
  for(const s of strings) {
    for(const m of (s.match(urlRe)||[])) if(urls.length<100 && !urls.includes(m.slice(0,300))) urls.push(m.slice(0,300));
    for(const m of (s.match(hostRe)||[])) { const h=m.toLowerCase(); if(hosts.length<150 && !hosts.includes(h)) hosts.push(h); }
  }
  return {stringCount:strings.length,features,samples,urls,hosts};
}

function entropy(buf) {
  if(!buf.length) return 0;
  const cnt=new Uint32Array(256); for(const b of buf) cnt[b]++;
  let h=0; for(const n of cnt) if(n){const p=n/buf.length; h-=p*Math.log2(p);} return +h.toFixed(4);
}

function keyPath(name) {
  return /relayway|flutter|\.so(?:\.|$)|\.bin$|\.json$|\.desktop$|init\.d|\/control$|postinst|preinst|\/etc\/config/i.test(name);
}

function analyzeFiles(files) {
  const summary=[]; const binaries=[]; const textFiles=[]; const dataFiles=[];
  for(const [name,buf] of Object.entries(files)) {
    const meta={name,size:buf.length,sha256:sha256(buf),magic:magic(buf)};
    const elf=elfMeta(buf);
    if(elf) {
      const scan=scanBlob(buf);
      binaries.push({...meta,elf,scan});
    } else if(/(?:rd|rs)\.bin$/i.test(name)) {
      const scan=scanBlob(buf,2);
      dataFiles.push({...meta,entropy:entropy(buf),headHex:buf.subarray(0,64).toString('hex'),scan});
    } else if(looksText(buf) && buf.length<=500000 && /relayway|control|postinst|preinst|\.desktop$|\.json$|\/etc\/config|init\.d/i.test(name)) {
      textFiles.push({...meta,text:buf.toString('utf8').slice(0,30000)});
    }
    if(keyPath(name)) summary.push({...meta,elf:elf||undefined});
  }
  return {keyFiles:summary.slice(0,250),binaries:binaries.slice(0,50),textFiles:textFiles.slice(0,30),dataFiles:dataFiles.slice(0,10)};
}

async function load(target) {
  const r=await fetch(TARGETS[target],{redirect:'follow',headers:{'user-agent':'curl/8.0'}});
  if(!r.ok) throw new Error(`download ${target}: HTTP ${r.status}`);
  const compressed=Buffer.from(await r.arrayBuffer());
  const outer=parseTar(gunzipMaybe(compressed),true);
  let files={};
  if(target==='linux') {
    files=outer.blobs;
  } else {
    for(const [name,data] of Object.entries(outer.blobs)) {
      if(/(?:control|data)\.tar\.gz$/.test(name)) {
        const inner=parseTar(gunzipMaybe(data),true);
        for(const [n,b] of Object.entries(inner.blobs)) files[`${name}::${n}`]=b;
      }
    }
  }
  return {
    target, finalUrl:r.url, compressedBytes:compressed.length, archiveSha256:sha256(compressed),
    outerEntryCount:outer.entries.length,
    outerEntries:outer.entries.filter(e=>keyPath(e.name)).slice(0,250),
    analysis:analyzeFiles(files)
  };
}

export default async function handler(req,res) {
  const target=String(req.query.target||'linux');
  if(!TARGETS[target]) return res.status(400).json({error:'target must be linux or armv7'});
  try {
    const out=await load(target);
    res.setHeader('Cache-Control','no-store');
    res.status(200).json(out);
  } catch(e) { res.status(500).json({error:String(e?.stack||e)}); }
}
