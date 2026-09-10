const zlib=require('zlib');
const crypto=require('crypto');
const TARGETS={linux:'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/linux',armv7:'https://backendoss.trafficmanager.net/api/v1/app/get/nfcloud/openwrt-armv7'};
function cs(b,s,l){return b.subarray(s,s+l).toString('utf8').replace(/\0.*$/,'')}
function oc(b,s,l){const x=cs(b,s,l).trim();return x?(parseInt(x,8)||0):0}
function gz(b){return b[0]===0x1f&&b[1]===0x8b?zlib.gunzipSync(b):b}
function tar(b){const o={};for(let p=0;p+512<=b.length;){const h=b.subarray(p,p+512);if(h.every(x=>x===0))break;let n=cs(h,0,100),pre=cs(h,345,155);if(pre)n=pre+'/'+n;const z=oc(h,124,12),a=p+512,e=a+z;if(!n||e>b.length)break;if(z)o[n]=b.subarray(a,e);p=a+Math.ceil(z/512)*512}return o}
function strings(b,min=5){const out=[];let a=[];const f=()=>{if(a.length>=min)out.push(Buffer.from(a).toString('ascii'));a=[]};for(const x of b){if(x>=32&&x<=126){a.push(x);if(a.length>8192)f()}else f()}f();return out}
function uniqMatches(ss,re,limit=500){const s=new Set();for(const x of ss){let m;re.lastIndex=0;while((m=re.exec(x))){s.add(m[0]);if(s.size>=limit)return [...s].sort();if(!re.global)break}}return [...s].sort()}
function sh(b){return crypto.createHash('sha256').update(b).digest('hex')}
function surface(b){const ss=strings(b);return {
 sha256:sh(b),bytes:b.length,
 relaywayCrates:uniqMatches(ss,/(?:src\/)?crates\/relayway-[A-Za-z0-9_-]+\/src\/[A-Za-z0-9_./-]+\.rs/g,300),
 env:uniqMatches(ss,/RELAYWAY_[A-Z0-9_]{3,}/g,300),
 api:uniqMatches(ss,/\/(?:api\/v[12]|consumer)\/[A-Za-z0-9_./:{}-]+/g,400),
 flags:uniqMatches(ss,/--(?:listen|config|dat-dir|tun|supervise|restore-openwrt-state-and-exit|reset-admin-password-from-stdin-and-exit|help|version)[A-Za-z0-9-]*/g,100),
 privilegedPaths:uniqMatches(ss,/\/(?:etc|root|jffs|proc|sys|dev|tmp)\/[A-Za-z0-9_./-]{2,}/g,300),
 vendorHosts:uniqMatches(ss,/(?:[A-Za-z0-9-]+\.)+(?:trafficmanager\.net|cniw4-dcc3vq\.com|unxn\.cn|relaywayx\.com|relayway\.io|relayway\.cn)/gi,100),
 securityTerms:uniqMatches(ss,/(?:HMAC|admin password|Unauthorized|anti-CSRF|DNS-rebinding|allowed_hosts|Bearer|token-gated|local admin authentication|kill switch|signature_file|source_provenance)/gi,100)
}}
async function load(t){const r=await fetch(TARGETS[t],{redirect:'follow',headers:{'user-agent':'curl/8.0'}});if(!r.ok)throw Error('http '+r.status);const outer=tar(gz(Buffer.from(await r.arrayBuffer())));if(t==='linux'){
 const core=outer['bundle/data/nfx-rt/libnfxcore.so'];const app=outer['bundle/lib/libapp.so'];const web=Object.entries(outer).filter(([n])=>/flutter_assets\/(?:AssetManifest|version)|assets\/icons\/app_icon/.test(n)).map(([n,b])=>({name:n,bytes:b.length,sha256:sh(b)}));return {target:t,core:surface(core),app:surface(app),selectedAssets:web};
 }
 let files={};for(const [n,b] of Object.entries(outer))if(/(?:control|data)\.tar\.gz$/.test(n)){for(const [x,y] of Object.entries(tar(gz(b))))files[x]=y}
 const core=files['./usr/bin/relayway-cored'];const js=files['./usr/share/relayway-cored/www/main.dart.js'];const init=files['./etc/init.d/relayway-cored']?.toString('utf8')||'';const web=Object.entries(files).filter(([n])=>/www\/assets\/(?:AssetManifest|FontManifest)|www\/assets\/assets\/icons\/app_icon|www\/version\.json/.test(n)).map(([n,b])=>({name:n,bytes:b.length,sha256:sh(b)}));
 return {target:t,core:surface(core),webApi:js?surface(js):null,initSecurityLines:init.split('\n').filter(x=>/HMAC|unauth|listen|allowed_hosts|CSRF|DNS-rebinding|token-gated|0\.0\.0\.0/.test(x)).slice(0,80),selectedAssets:web};
}
export default async function handler(req,res){try{const [l,a]=await Promise.all([load('linux'),load('armv7')]);const lc=new Set(l.core.relaywayCrates),ac=new Set(a.core.relaywayCrates);const le=new Set(l.core.env),ae=new Set(a.core.env);const la=new Set(l.core.api),aa=new Set(a.core.api);res.setHeader('Cache-Control','no-store');res.status(200).json({linux:l,armv7:a,comparison:{sharedRelaywayCrates:[...lc].filter(x=>ac.has(x)).sort(),sharedEnv:[...le].filter(x=>ae.has(x)).sort(),sharedApi:[...la].filter(x=>aa.has(x)).sort(),counts:{linuxCrates:lc.size,armCrates:ac.size,sharedCrates:[...lc].filter(x=>ac.has(x)).length,linuxEnv:le.size,armEnv:ae.size,sharedEnv:[...le].filter(x=>ae.has(x)).length,linuxApi:la.size,armApi:aa.size,sharedApi:[...la].filter(x=>aa.has(x)).length}}});}catch(e){res.status(500).json({error:String(e.stack||e)})}}
