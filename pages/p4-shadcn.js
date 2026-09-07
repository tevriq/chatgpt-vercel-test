import Head from 'next/head'
import {useMemo,useState} from 'react'

const icons={home:'⌂',archive:'▤',author:'◉',settings:'⚙',search:'⌕',more:'⋯',back:'‹',link:'↗'}
const archives=[
 {id:'xhs_1732098765432',platform:'小红书',title:'在小县城，我做了一个「轻量生活实验」',author:'阿北在小县城',time:'2025-11-24 13:40',comments:42,note:'这个想法很有共鸣，我也想在自己的小城市里做一些慢而有意义的尝试。',tone:'xhs'},
 {id:'mp_6012345678901',platform:'公众号',title:'AI 时代的个人知识管理方法论',author:'少数派',time:'2025-11-24 10:30',comments:88,note:'',tone:'wechat'},
 {id:'dy_7293847561234',platform:'抖音',title:'我在东京，租了一个 9㎡ 的房子',author:'小林今天住哪儿',time:'2025-11-23 22:15',comments:63,note:'以后去东京可以参考这个居住尺度。',tone:'douyin'},
 {id:'xhs_1731987654321',platform:'小红书',title:'极简生活的 10 个小习惯',author:'极简生活家',time:'2025-11-23 18:45',comments:26,note:'',tone:'xhs'}
]
const tasks=[
 {s:'排队中',c:'queued',p:'小红书',t:'OOTD｜秋天第一件针织开衫终于到了吧',m:'10:32'},
 {s:'进行中 40%',c:'running',p:'微信公众号',t:'AI 时代的个人知识管理方法论',m:'10:31'},
 {s:'完成',c:'success',p:'抖音',t:'在小县城，我做了一个「轻量生活实验」',m:'10:30'},
 {s:'失败 · 平台限制',c:'risk',p:'小红书',t:'换季穿搭合集｜温柔风毛衣分享',m:'10:29'},
 {s:'失败 · 登录失效',c:'login',p:'微信公众号',t:'为什么说阅读是最好的投资',m:'10:28'}
]
const authors=[
 {n:'阿北在小县城',p:'小红书',count:18},{n:'少数派',p:'微信公众号',count:34},{n:'小林今天住哪儿',p:'抖音',count:12},{n:'极简生活家',p:'小红书',count:9}
]
function Platform({tone,children}){return <span className={'platform '+tone}>{children}</span>}
function Status({c,children}){return <span className={'status '+c}>{children}</span>}
function SectionTitle({title,action}){return <div className="sectionTitle"><h2>{title}</h2>{action&&<button className="linkBtn">{action}</button>}</div>}
function ArchiveCard({item,onOpen}){return <button className="archiveCard" onClick={()=>onOpen(item)}>
  <div className={'thumb '+item.tone}></div>
  <div className="archiveBody">
    <div className="archiveTop"><Platform tone={item.tone}>{item.platform}</Platform><span className="comments">◌ {item.comments}</span><span>{icons.more}</span></div>
    <div className="archiveTitle">{item.title}</div>
    <div className="meta">{item.author} · {item.time}</div>
    {item.note&&<div className="noteLine">“{item.note}”</div>}
  </div>
</button>}
function BottomNav({view,setView}){return <nav className="bottomNav">
  {[['home','收藏'],['archive','档案'],['author','作者'],['settings','设置']].map(([k,l])=><button key={k} className={view===k?'active':''} onClick={()=>setView(k)}><span>{icons[k]}</span><small>{l}</small></button>)}
</nav>}
function DesktopNav({view,setView}){return <div className="desktopNav">
 {[['home','收藏'],['archive','全部归档'],['author','作者'],['settings','设置']].map(([k,l])=><button key={k} className={view===k?'active':''} onClick={()=>setView(k)}>{l}</button>)}
</div>}

export default function Demo(){
 const [view,setView]=useState('home'); const [detail,setDetail]=useState(null); const [expanded,setExpanded]=useState(false); const [saved,setSaved]=useState(false); const [q,setQ]=useState(''); const [filter,setFilter]=useState('全部')
 const filtered=useMemo(()=>archives.filter(a=>(filter==='全部'||a.platform===filter)&&(!q||[a.title,a.author,a.platform].join(' ').toLowerCase().includes(q.toLowerCase()))),[q,filter])
 const open=(a)=>{setDetail(a);setView('detail')}; const go=(v)=>{setView(v);setDetail(null)}
 return <><Head><title>P4 · shadcn UI demo</title><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/></Head>
 <div className="app">
  <header className="topbar"><div><div className="brand">CN 内容档案馆 <span className="env">生产环境</span></div><div className="sub">P4 · Personal Internet Archive</div></div><button className="icon" onClick={()=>go('settings')}>{icons.settings}</button></header>
  <DesktopNav view={view} setView={go}/>
  <main>
   {view==='home'&&<>
    <section className="card collect">
      <div className="cardHead"><div><h1>收藏新内容</h1><p>保持现网能力，只换一套更稳的界面。</p></div></div>
      <div className="tabs"><button className="selected">链接</button><button>文字</button><button>文字 + 图片</button><button>文字 + 文件</button><button>我的评论</button></div>
      <textarea placeholder={'粘贴链接地址，每行一个\n支持公众号 / 小红书 / 抖音 / 抖音直播 / 本地路径'} />
      <button className="secondary expand" onClick={()=>setExpanded(!expanded)}>＋ 我的评论与配图（可选） <span>{expanded?'收起':'展开'}</span></button>
      {expanded&&<div className="noteBox"><label>我的评论</label><textarea className="smallText" placeholder="记录你当时的想法、感受或备注…"/><label>评论配图</label><div className="upload">＋ 选择图片 <span>最多 9 张 · JPG / PNG / WebP</span></div></div>}
      <button className="primary" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),1800)}}>{saved?'✓ 已加入队列':'保存到档案'}</button>
    </section>
    <div className="desktopGrid">
      <section><SectionTitle title="今日任务" action="刷新"/><div className="taskList">{tasks.map((t,i)=><div className="task" key={i}><div><Status c={t.c}>{t.s}</Status><span className="taskPlatform">{t.p}</span></div><div className="taskTitle">{t.t}</div><time>{t.m}</time></div>)}</div></section>
      <section><SectionTitle title="最近归档" action="查看全部"/><div>{archives.slice(0,3).map(a=><ArchiveCard key={a.id} item={a} onOpen={open}/>)}</div></section>
    </div>
   </>}
   {view==='archive'&&<>
    <div className="pageTitle"><div><h1>全部归档</h1><p>搜索标题、作者和平台</p></div><span className="count">1247 条</span></div>
    <div className="search"><span>{icons.search}</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索标题 / 作者 / 平台…"/></div>
    <div className="chips">{['全部','微信公众号','小红书','抖音'].map(x=><button key={x} onClick={()=>setFilter(x)} className={filter===x?'on':''}>{x}</button>)}</div>
    <div>{filtered.map(a=><ArchiveCard key={a.id} item={a} onOpen={open}/>)}</div>
   </>}
   {view==='author'&&<>
    <div className="pageTitle"><div><h1>作者</h1><p>按来源作者浏览已归档内容</p></div></div>
    <div className="authorList">{authors.map((a,i)=><button key={i} className="authorRow"><div className="avatar">{a.n.slice(0,1)}</div><div><b>{a.n}</b><span>{a.p} · {a.count} 条归档</span></div><span className="chev">›</span></button>)}</div>
   </>}
   {view==='settings'&&<>
    <div className="pageTitle"><div><h1>设置</h1><p>沿用现网真实配置入口</p></div></div>
    <div className="settingsCard">
      {[['当前环境','生产环境'],['本地存储','CN_ARCHIVE_DATA'],['小红书登录','已登录'],['抖音登录','已登录'],['最大并发任务','3'],['MCP','本地 · 已启用']].map(([a,b],i)=><button className="settingRow" key={i}><span>{a}</span><b>{b}</b><em>›</em></button>)}
    </div>
    <div className="callout">这是纯 UI Demo：不连接生产数据、不读取 Cookie、不修改现网服务。</div>
   </>}
   {view==='detail'&&detail&&<>
    <button className="back" onClick={()=>go('archive')}>{icons.back} 返回</button>
    <article className="detailCard">
      <Platform tone={detail.tone}>{detail.platform}</Platform>
      <h1>{detail.title}</h1><div className="meta">{detail.author} · {detail.time}</div>
      <div className="hero"></div>
      <div className="detailTabs"><button className="selected">正文</button><button>图片 9</button><button>评论 {detail.comments}</button></div>
      <div className="bodyText"><p>这里展示抓取后的原文内容。现网中的标题、作者、发布时间、来源 URL、正文、媒体和公开评论仍然保留。</p><p>新的界面只改变阅读和操作体验，不改变归档事实和底层数据。</p></div>
      <h3>原始评论</h3><div className="publicComment">小鹿在路上 <span>IP：广东</span><p>写得太好了！我也在做类似的尝试。</p></div><div className="publicComment">生活研究所 <span>IP：浙江</span><p>很有启发，感谢分享。</p></div>
      <div className="myNote"><b>我的评论</b><p>{detail.note||'这个条目暂时没有个人评论。'}</p><div className="notePics"><i></i><i></i></div></div>
      <button className="secondary full">{icons.link} 打开来源链接</button>
    </article>
   </>}
  </main>
  {view!=='detail'&&<BottomNav view={view} setView={go}/>} 
 </div>
 <style jsx global>{`
 :root{--bg:#fafafa;--card:#fff;--fg:#18181b;--muted:#71717a;--line:#e4e4e7;--soft:#f4f4f5;--primary:#18181b;--radius:14px}
 *{box-sizing:border-box}html,body,#__next{margin:0;min-height:100%;background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif}button,input,textarea{font:inherit}button{cursor:pointer}.app{max-width:720px;margin:auto;padding:0 14px 92px}.topbar{height:68px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:rgba(250,250,250,.92);backdrop-filter:blur(14px);z-index:20;border-bottom:1px solid rgba(228,228,231,.7)}.brand{font-size:16px;font-weight:750}.sub{font-size:11px;color:var(--muted);margin-top:2px}.env{font-size:10px;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;padding:2px 6px;border-radius:999px;margin-left:5px}.icon{width:36px;height:36px;border:1px solid var(--line);background:var(--card);border-radius:10px}.desktopNav{display:none}.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.02)}.collect{margin-top:14px}.cardHead h1,.pageTitle h1{font-size:20px;margin:0 0 4px}.cardHead p,.pageTitle p{color:var(--muted);font-size:12px;margin:0}.tabs{display:flex;gap:4px;overflow:auto;margin:16px -4px 12px;padding:0 4px 2px}.tabs button,.detailTabs button{white-space:nowrap;border:0;background:transparent;color:var(--muted);padding:8px 10px;border-radius:9px;font-size:12px}.tabs .selected,.detailTabs .selected{background:var(--soft);color:var(--fg);font-weight:650}textarea{width:100%;min-height:128px;border:1px solid var(--line);border-radius:10px;padding:12px;resize:vertical;background:#fff;color:var(--fg);outline:none}textarea:focus,input:focus{border-color:#a1a1aa;box-shadow:0 0 0 3px #e4e4e755}.smallText{min-height:76px}.primary{width:100%;border:0;border-radius:10px;background:var(--primary);color:#fff;padding:12px 14px;font-weight:650;margin-top:12px}.secondary{border:1px solid var(--line);background:#fff;border-radius:10px;padding:10px 12px;color:var(--fg)}.expand{width:100%;display:flex;justify-content:space-between;margin-top:9px}.expand span{color:var(--muted);font-size:12px}.noteBox{margin-top:10px;padding:12px;border:1px solid var(--line);border-radius:10px;background:#fafafa}.noteBox label{display:block;font-size:12px;font-weight:650;margin:7px 0}.upload{border:1px dashed #d4d4d8;border-radius:10px;padding:12px;background:#fff;font-size:12px}.upload span{display:block;color:var(--muted);margin-top:4px}.sectionTitle{display:flex;justify-content:space-between;align-items:center;margin:22px 2px 10px}.sectionTitle h2{font-size:15px;margin:0}.linkBtn{border:0;background:transparent;color:var(--muted);font-size:12px}.taskList{display:flex;flex-direction:column;gap:7px}.task{position:relative;background:#fff;border:1px solid var(--line);border-radius:12px;padding:11px 70px 11px 11px}.taskTitle{font-size:12px;margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.task time{position:absolute;right:11px;top:13px;color:var(--muted);font-size:11px}.taskPlatform{font-size:10px;color:var(--muted);margin-left:7px}.status,.platform{display:inline-flex;border-radius:999px;padding:2px 7px;font-size:10px;font-weight:650;border:1px solid}.status.queued{background:#f4f4f5;color:#52525b;border-color:#e4e4e7}.status.running{background:#eff6ff;color:#2563eb;border-color:#bfdbfe}.status.success{background:#f0fdf4;color:#15803d;border-color:#bbf7d0}.status.risk{background:#fef2f2;color:#dc2626;border-color:#fecaca}.status.login{background:#fff7ed;color:#c2410c;border-color:#fed7aa}.platform.xhs{background:#fff1f2;color:#e11d48;border-color:#fecdd3}.platform.wechat{background:#f0fdf4;color:#15803d;border-color:#bbf7d0}.platform.douyin{background:#f4f4f5;color:#18181b;border-color:#d4d4d8}.archiveCard{width:100%;display:flex;text-align:left;background:#fff;border:1px solid var(--line);border-radius:13px;padding:10px;margin-bottom:8px;color:inherit}.thumb{width:76px;height:76px;border-radius:10px;flex:0 0 76px;background:linear-gradient(135deg,#e4e4e7,#a1a1aa)}.thumb.xhs{background:linear-gradient(135deg,#fde68a,#fb7185)}.thumb.wechat{background:linear-gradient(135deg,#bbf7d0,#67e8f9)}.thumb.douyin{background:linear-gradient(135deg,#d4d4d8,#71717a)}.archiveBody{min-width:0;flex:1;padding-left:10px}.archiveTop{display:flex;align-items:center;gap:6px}.comments{margin-left:auto;font-size:11px;color:var(--muted)}.archiveTitle{font-size:13px;font-weight:700;line-height:1.35;margin-top:6px}.meta{font-size:11px;color:var(--muted);margin-top:5px}.noteLine{font-size:11px;color:#854d0e;background:#fffbeb;padding:5px 7px;border-radius:7px;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pageTitle{display:flex;align-items:flex-end;justify-content:space-between;margin:18px 2px 14px}.count{font-size:12px;color:var(--muted)}.search{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:11px;padding:0 11px;margin-bottom:10px}.search input{border:0;outline:0;width:100%;height:40px;background:transparent}.chips{display:flex;gap:7px;overflow:auto;margin-bottom:12px}.chips button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:7px 11px;font-size:11px;color:var(--muted);white-space:nowrap}.chips .on{background:#18181b;color:white;border-color:#18181b}.authorList,.settingsCard{background:#fff;border:1px solid var(--line);border-radius:13px;overflow:hidden}.authorRow,.settingRow{width:100%;display:flex;align-items:center;border:0;border-bottom:1px solid var(--line);background:#fff;padding:12px;text-align:left}.authorRow:last-child,.settingRow:last-child{border-bottom:0}.avatar{width:38px;height:38px;border-radius:50%;background:#f4f4f5;display:grid;place-items:center;font-weight:700;margin-right:10px}.authorRow b{display:block;font-size:13px}.authorRow span:not(.chev){display:block;color:var(--muted);font-size:11px;margin-top:3px}.chev{margin-left:auto;color:#a1a1aa}.settingRow span{font-size:13px}.settingRow b{margin-left:auto;font-size:11px;color:var(--muted);font-weight:550}.settingRow em{font-style:normal;color:#a1a1aa;margin-left:10px}.callout{margin-top:12px;border:1px dashed #d4d4d8;background:#fff;padding:12px;border-radius:11px;color:var(--muted);font-size:11px;line-height:1.6}.back{border:0;background:transparent;padding:14px 0;color:var(--muted)}.detailCard{background:#fff;border:1px solid var(--line);border-radius:15px;padding:16px}.detailCard h1{font-size:22px;line-height:1.35;margin:10px 0 0}.hero{height:210px;border-radius:12px;background:linear-gradient(135deg,#fde68a,#fb7185);margin:16px 0}.detailTabs{display:flex;border-bottom:1px solid var(--line);padding-bottom:8px}.bodyText{font-size:14px;line-height:1.8;color:#3f3f46}.detailCard h3{font-size:14px;margin-top:20px}.publicComment{padding:11px 0;border-top:1px solid var(--line);font-size:12px;font-weight:650}.publicComment span{font-weight:400;color:var(--muted);margin-left:6px}.publicComment p{font-weight:400;margin:6px 0 0;line-height:1.6}.myNote{background:#fafafa;border:1px solid var(--line);border-radius:11px;padding:12px;margin-top:15px}.myNote b{font-size:12px}.myNote p{font-size:12px;line-height:1.6;color:#52525b}.notePics{display:flex;gap:7px}.notePics i{width:56px;height:56px;border-radius:8px;background:linear-gradient(135deg,#e7e5e4,#a8a29e)}.full{width:100%;margin-top:12px}.bottomNav{position:fixed;bottom:0;left:0;right:0;height:66px;padding-bottom:env(safe-area-inset-bottom);background:rgba(255,255,255,.95);backdrop-filter:blur(14px);border-top:1px solid var(--line);display:flex;z-index:30}.bottomNav button{flex:1;border:0;background:transparent;color:#a1a1aa;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}.bottomNav button span{font-size:20px}.bottomNav small{font-size:10px}.bottomNav .active{color:#18181b}.desktopGrid{display:block}
 @media(min-width:800px){.app{max-width:1040px;padding:0 24px 60px}.bottomNav{display:none}.topbar{height:76px}.desktopNav{display:flex;gap:6px;border-bottom:1px solid var(--line);padding:0 0 12px}.desktopNav button{border:0;background:transparent;color:var(--muted);padding:8px 12px;border-radius:9px}.desktopNav .active{background:#fff;color:var(--fg);box-shadow:0 0 0 1px var(--line)}.collect{max-width:720px;margin-left:auto;margin-right:auto}.desktopGrid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.pageTitle{margin-top:24px}.archiveCard{min-height:96px}.thumb{width:86px;height:86px;flex-basis:86px}.detailCard{max-width:760px;margin:auto}.authorList,.settingsCard,.callout{max-width:720px;margin-left:auto;margin-right:auto}}
 `}</style></>
}