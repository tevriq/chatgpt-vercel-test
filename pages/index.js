import { useEffect, useMemo, useState } from 'react';

const ITEMS = [
  {
    id: 'purposeful-springy-duo',
    title: 'Springy Duo · onboarding delight',
    repo: 'GetStream/purposeful-ios-animations',
    kind: 'Motion',
    stack: 'SwiftUI',
    note: '用弹性运动给 onboarding 增加“活着”的感觉；值得观察节奏与回弹，而不是照抄造型。',
    image: 'https://raw.githubusercontent.com/GetStream/purposeful-ios-animations/main/MISC/springyDuo.gif',
    url: 'https://github.com/GetStream/purposeful-ios-animations',
  },
  {
    id: 'purposeful-install',
    title: 'Double-click to Install · attention',
    repo: 'GetStream/purposeful-ios-animations',
    kind: 'Motion',
    stack: 'SwiftUI',
    note: '典型 iOS“动效承担提示义务”的案例：不是装饰，而是把下一步动作说清楚。',
    image: 'https://raw.githubusercontent.com/GetStream/purposeful-ios-animations/main/MISC/dbClickInstall.gif',
    url: 'https://github.com/GetStream/purposeful-ios-animations',
  },
  {
    id: 'purposeful-faceid',
    title: 'Face ID Setup · guided motion',
    repo: 'GetStream/purposeful-ios-animations',
    kind: 'Motion',
    stack: 'SwiftUI',
    note: '动效作为“操作指导”，适合我们以后处理录音、同步、扫描一类需要状态反馈的任务。',
    image: 'https://raw.githubusercontent.com/GetStream/purposeful-ios-animations/main/MISC/howToSetUpFaceID.gif',
    url: 'https://github.com/GetStream/purposeful-ios-animations',
  },
  {
    id: 'purposeful-recording',
    title: 'Recording · activity representation',
    repo: 'GetStream/purposeful-ios-animations',
    kind: 'Motion',
    stack: 'SwiftUI',
    note: '和 P14 很直接：如何用极少元素表达“正在录音/正在听”。',
    image: 'https://raw.githubusercontent.com/GetStream/purposeful-ios-animations/main/MISC/recording.gif',
    url: 'https://github.com/GetStream/purposeful-ios-animations',
  },
  {
    id: 'purposeful-twitter-like',
    title: 'Like Reaction · expressive feedback',
    repo: 'GetStream/purposeful-ios-animations',
    kind: 'Motion',
    stack: 'SwiftUI',
    note: '轻量但明确的完成/反馈感，可用来判断我们喜欢“克制”到什么程度。',
    image: 'https://raw.githubusercontent.com/GetStream/purposeful-ios-animations/main/MISC/twitterLike.gif',
    url: 'https://github.com/GetStream/purposeful-ios-animations',
  },
  {
    id: 'shubham-card-shuffle',
    title: 'Cards Shuffle',
    repo: 'Shubham0812/SwiftUI-Animations',
    kind: 'Interaction',
    stack: 'SwiftUI',
    note: '卡片层级与空间连续性；重点看运动路径是否有“系统感”，而不是卡片本身。',
    image: 'https://raw.githubusercontent.com/Shubham0812/SwiftUI-Animations/master/SwiftUI-Animations/GIFs/cards-shuffle.gif',
    url: 'https://github.com/Shubham0812/SwiftUI-Animations',
  },
  {
    id: 'shubham-scratch',
    title: 'Scratch to Reveal',
    repo: 'Shubham0812/SwiftUI-Animations',
    kind: 'Interaction',
    stack: 'SwiftUI',
    note: '手势驱动视觉反馈；适合判断“交互是否应该跟手”。',
    image: 'https://raw.githubusercontent.com/Shubham0812/SwiftUI-Animations/master/SwiftUI-Animations/GIFs/scratch-to-reveal.gif',
    url: 'https://github.com/Shubham0812/SwiftUI-Animations',
  },
  {
    id: 'shubham-chatbar',
    title: 'Chat Bar · morphing control',
    repo: 'Shubham0812/SwiftUI-Animations',
    kind: 'Component',
    stack: 'SwiftUI',
    note: '输入控件状态变化做得是否自然；对 P14 Entry composer 有参考价值。',
    image: 'https://raw.githubusercontent.com/Shubham0812/SwiftUI-Animations/master/SwiftUI-Animations/GIFs/chat-bar.gif',
    url: 'https://github.com/Shubham0812/SwiftUI-Animations',
  },
  {
    id: 'shubham-additem',
    title: 'Add Item · state transition',
    repo: 'Shubham0812/SwiftUI-Animations',
    kind: 'Component',
    stack: 'SwiftUI',
    note: '新增对象后的即时反馈，适合 Entry 创建、完成、撤销等轻状态变化。',
    image: 'https://raw.githubusercontent.com/Shubham0812/SwiftUI-Animations/master/SwiftUI-Animations/GIFs/addView.gif',
    url: 'https://github.com/Shubham0812/SwiftUI-Animations',
  },
  {
    id: 'shubham-login',
    title: 'Animated Login',
    repo: 'Shubham0812/SwiftUI-Animations',
    kind: 'Screen',
    stack: 'SwiftUI',
    note: '完整页面级动效，可用于判断我们对“页面里应该有多少运动”的接受度。',
    image: 'https://raw.githubusercontent.com/Shubham0812/SwiftUI-Animations/master/SwiftUI-Animations/GIFs/login.gif',
    url: 'https://github.com/Shubham0812/SwiftUI-Animations',
  },
  {
    id: 'design-fashion-onboarding',
    title: 'Fashion App Onboarding',
    repo: 'dheerajghub/Design_to_code',
    kind: 'Screen',
    stack: 'SwiftUI / UIKit',
    note: '视觉型 onboarding；用来判断“接近成品的视觉稿”里我们是否接受更强品牌表达。',
    image: 'https://i.imgur.com/S1uPBSs.png',
    url: 'https://github.com/dheerajghub/Design_to_code',
  },
  {
    id: 'design-mail',
    title: 'Mail App Concept',
    repo: 'dheerajghub/Design_to_code',
    kind: 'Screen',
    stack: 'Swift / SwiftUI',
    note: '信息密集型页面，重点看层级、行距、动作密度，而不是视觉噱头。',
    image: 'https://i.imgur.com/ezy06LU.png',
    url: 'https://github.com/dheerajghub/Design_to_code',
  },
  {
    id: 'design-text-editor-a',
    title: 'Text Editor · primary screen',
    repo: 'dheerajghub/Design_to_code',
    kind: 'Screen',
    stack: 'Swift / SwiftUI',
    note: '和 Entry Detail 接近：内容是主角，工具条与 metadata 不能压住正文。',
    image: 'https://i.imgur.com/l6oa8L4.png',
    url: 'https://github.com/dheerajghub/Design_to_code',
  },
  {
    id: 'design-text-editor-b',
    title: 'Text Editor · secondary state',
    repo: 'dheerajghub/Design_to_code',
    kind: 'Screen',
    stack: 'Swift / SwiftUI',
    note: '同一产品第二状态；适合观察界面从浏览到编辑时是否保持连续。',
    image: 'https://i.imgur.com/hsUGAcr.png',
    url: 'https://github.com/dheerajghub/Design_to_code',
  },
  {
    id: 'design-messaging',
    title: 'Messaging App',
    repo: 'dheerajghub/Design_to_code',
    kind: 'Screen',
    stack: 'UIKit',
    note: '大量连续内容的排版与输入区域；适合借鉴密度控制。',
    image: 'https://i.imgur.com/whcp3C0.png',
    url: 'https://github.com/dheerajghub/Design_to_code',
  },
  {
    id: 'ios26-examples',
    title: 'iOS 26 by Examples · native API map',
    repo: 'artemnovichkov/iOS-26-by-Examples',
    kind: 'Native',
    stack: 'SwiftUI · iOS 26',
    note: '不是审美模板，而是当前 iOS 原生能力地图：TabView、Glass、Rich Text、Toolbar、Symbol 动效等。',
    image: 'https://raw.githubusercontent.com/artemnovichkov/iOS-26-by-Examples/main/.github/preview.png',
    url: 'https://github.com/artemnovichkov/iOS-26-by-Examples',
  },
  {
    id: 'yui-transitions',
    title: 'YUI · fluid interactive transitions',
    repo: 'yihui-hu/YUI',
    kind: 'Interaction',
    stack: 'UIKit',
    note: '非常值得收藏候选：Facebook Paper、Instagram shared transition、Path、Twitter swipe 等交互连续性研究。',
    image: 'https://github.com/user-attachments/assets/a785e608-2a5f-4cb7-80a2-542a7902c98a',
    url: 'https://github.com/yihui-hu/YUI',
  },
  {
    id: 'design-md-source',
    title: 'Awesome iOS DESIGN.md · AI-readable references',
    repo: 'pikespeak/awesome-ios-design-md',
    kind: 'Design System',
    stack: 'SwiftUI / DESIGN.md',
    note: '不是直接抄界面；它把 Instagram、Spotify、Airbnb、Uber、Duolingo 等拆成 typography、spacing、motion、haptics 与组件规则。',
    image: 'https://opengraph.githubassets.com/1/pikespeak/awesome-ios-design-md',
    url: 'https://github.com/pikespeak/awesome-ios-design-md',
  },
];

const statusLabel = { unrated: '未评', keep: '收藏', pass: 'Pass' };

export default function Home() {
  const [ratings, setRatings] = useState({});
  const [status, setStatus] = useState('unrated');
  const [kind, setKind] = useState('全部');
  const [repo, setRepo] = useState('全部');
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ios-ui-reference-ratings') || '{}');
      setRatings(saved);
    } catch (_) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('ios-ui-reference-ratings', JSON.stringify(ratings));
  }, [ratings, ready]);

  const kinds = useMemo(() => ['全部', ...Array.from(new Set(ITEMS.map(i => i.kind)))], []);
  const repos = useMemo(() => ['全部', ...Array.from(new Set(ITEMS.map(i => i.repo)))], []);

  const filtered = useMemo(() => ITEMS.filter(item => {
    const r = ratings[item.id] || {};
    const itemStatus = r.status || 'unrated';
    const statusOK = status === 'all' || itemStatus === status;
    const kindOK = kind === '全部' || item.kind === kind;
    const repoOK = repo === '全部' || item.repo === repo;
    const hay = `${item.title} ${item.repo} ${item.kind} ${item.note}`.toLowerCase();
    const queryOK = !query.trim() || hay.includes(query.trim().toLowerCase());
    return statusOK && kindOK && repoOK && queryOK;
  }), [ratings, status, kind, repo, query]);

  const counts = ITEMS.reduce((acc, item) => {
    const s = ratings[item.id]?.status || 'unrated';
    acc[s] += 1;
    return acc;
  }, { unrated: 0, keep: 0, pass: 0 });

  function update(id, patch) {
    setRatings(prev => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));
  }

  function exportJSON() {
    const decisions = ITEMS.map(item => ({
      id: item.id,
      title: item.title,
      repo: item.repo,
      kind: item.kind,
      status: ratings[item.id]?.status || 'unrated',
      score: ratings[item.id]?.score || 0,
      source: item.url,
    }));
    const blob = new Blob([JSON.stringify(decisions, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = 'ios-ui-reference-ratings.json';
    a.click();
    URL.revokeObjectURL(href);
  }

  return (
    <>
      <main>
        <header className="hero">
          <div>
            <div className="eyebrow">IOS DESIGN REFERENCE · ROUND 01</div>
            <h1>看真的界面，再决定什么值得进入我们的设计记忆。</h1>
            <p>第一批只放 iOS / SwiftUI / UIKit 的页面、交互和动效。你的评分只保存在当前浏览器；收藏和 Pass 都不会修改原仓库。</p>
          </div>
          <button className="export" onClick={exportJSON}>导出评分 JSON</button>
        </header>

        <section className="summary">
          <button className={status === 'unrated' ? 'summaryCard active' : 'summaryCard'} onClick={() => setStatus('unrated')}><strong>{counts.unrated}</strong><span>未评</span></button>
          <button className={status === 'keep' ? 'summaryCard active' : 'summaryCard'} onClick={() => setStatus('keep')}><strong>{counts.keep}</strong><span>收藏</span></button>
          <button className={status === 'pass' ? 'summaryCard active' : 'summaryCard'} onClick={() => setStatus('pass')}><strong>{counts.pass}</strong><span>Pass</span></button>
          <button className={status === 'all' ? 'summaryCard active' : 'summaryCard'} onClick={() => setStatus('all')}><strong>{ITEMS.length}</strong><span>全部</span></button>
        </section>

        <section className="toolbar">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索：录音 / transition / Entry / UIKit…" />
          <select value={kind} onChange={e => setKind(e.target.value)}>{kinds.map(x => <option key={x}>{x}</option>)}</select>
          <select value={repo} onChange={e => setRepo(e.target.value)}>{repos.map(x => <option key={x}>{x}</option>)}</select>
        </section>

        <div className="sectionTitle"><span>{filtered.length} 个参考</span><small>建议先不看 GitHub star，只凭第一眼与产品判断打分。</small></div>

        <section className="grid">
          {filtered.map(item => {
            const rating = ratings[item.id] || {};
            const itemStatus = rating.status || 'unrated';
            return (
              <article className={`card ${itemStatus}`} key={item.id}>
                <div className="media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="badges"><span>{item.kind}</span><span>{item.stack}</span></div>
                </div>
                <div className="body">
                  <div className="repo">{item.repo}</div>
                  <h2>{item.title}</h2>
                  <p>{item.note}</p>
                  <div className="stars" aria-label="score">
                    {[1,2,3,4,5].map(n => <button key={n} onClick={() => update(item.id, { score: n })} className={(rating.score || 0) >= n ? 'on' : ''}>★</button>)}
                  </div>
                  <div className="actions">
                    <button className={itemStatus === 'keep' ? 'keep selected' : 'keep'} onClick={() => update(item.id, { status: itemStatus === 'keep' ? 'unrated' : 'keep' })}>收藏</button>
                    <button className={itemStatus === 'pass' ? 'pass selected' : 'pass'} onClick={() => update(item.id, { status: itemStatus === 'pass' ? 'unrated' : 'pass' })}>Pass</button>
                    <a href={item.url} target="_blank" rel="noreferrer">源码 ↗</a>
                  </div>
                  <div className={`state ${itemStatus}`}>{statusLabel[itemStatus]}{rating.score ? ` · ${rating.score}/5` : ''}</div>
                </div>
              </article>
            );
          })}
        </section>

        {!filtered.length && <div className="empty">这个筛选条件下没有参考。</div>}

        <footer>Round 01 · 先建立你的 iOS 审美样本，再决定哪些规则进入 PC / Design Memory。</footer>
      </main>
      <style jsx global>{`
        *{box-sizing:border-box}html,body,#__next{margin:0;min-height:100%;background:#f5f5f7;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",system-ui,sans-serif}button,input,select{font:inherit}button{cursor:pointer}a{color:inherit;text-decoration:none}
        main{max-width:1500px;margin:0 auto;padding:40px 34px 80px}.hero{display:flex;gap:32px;align-items:flex-end;justify-content:space-between;margin-bottom:28px}.hero>div{max-width:900px}.eyebrow{font-size:12px;font-weight:700;letter-spacing:.12em;color:#6e6e73;margin-bottom:13px}.hero h1{font-size:clamp(36px,5vw,70px);line-height:.98;letter-spacing:-.045em;margin:0 0 18px;max-width:1050px}.hero p{font-size:16px;line-height:1.6;color:#6e6e73;max-width:780px;margin:0}.export{border:1px solid #d2d2d7;border-radius:999px;background:#fff;padding:12px 18px;white-space:nowrap}.export:hover{background:#eeeef0}
        .summary{display:grid;grid-template-columns:repeat(4,minmax(100px,1fr));gap:10px;margin:34px 0 16px}.summaryCard{border:1px solid #dedee3;background:#fff;border-radius:18px;padding:16px 18px;text-align:left;transition:.18s ease}.summaryCard:hover,.summaryCard.active{border-color:#1d1d1f;transform:translateY(-1px)}.summaryCard strong{display:block;font-size:30px;letter-spacing:-.04em}.summaryCard span{font-size:13px;color:#6e6e73}
        .toolbar{display:grid;grid-template-columns:minmax(240px,1fr) 190px minmax(260px,360px);gap:10px;margin:10px 0 28px}.toolbar input,.toolbar select{height:46px;border-radius:14px;border:1px solid #dedee3;background:#fff;padding:0 14px;outline:none}.toolbar input:focus,.toolbar select:focus{border-color:#86868b}.sectionTitle{display:flex;align-items:baseline;justify-content:space-between;gap:20px;margin-bottom:14px}.sectionTitle span{font-weight:700}.sectionTitle small{color:#86868b}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}.card{background:#fff;border:1px solid #e3e3e8;border-radius:24px;overflow:hidden;min-width:0;transition:.2s ease}.card:hover{transform:translateY(-2px);box-shadow:0 18px 45px rgba(0,0,0,.07)}.card.keep{box-shadow:0 0 0 2px rgba(52,199,89,.24)}.card.pass{opacity:.55}.media{position:relative;background:#ececef;aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;overflow:hidden}.media img{width:100%;height:100%;object-fit:contain;background:#f2f2f4}.badges{position:absolute;left:12px;top:12px;display:flex;gap:6px;flex-wrap:wrap}.badges span{font-size:11px;font-weight:650;padding:6px 9px;border-radius:999px;background:rgba(255,255,255,.86);backdrop-filter:blur(10px);box-shadow:0 2px 12px rgba(0,0,0,.08)}.body{padding:18px}.repo{font-size:11px;color:#86868b;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.body h2{font-size:20px;line-height:1.15;letter-spacing:-.02em;margin:0 0 9px}.body p{font-size:14px;line-height:1.55;color:#6e6e73;margin:0;min-height:66px}.stars{display:flex;gap:3px;margin:16px 0 14px}.stars button{border:0;background:none;color:#d2d2d7;padding:0 2px;font-size:21px}.stars button.on{color:#ff9f0a}.actions{display:grid;grid-template-columns:1fr 1fr auto;gap:8px}.actions button,.actions a{height:39px;border-radius:12px;border:1px solid #d8d8dd;background:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:650}.actions .keep:hover,.actions .keep.selected{background:#eaf9ee;border-color:#8edba0}.actions .pass:hover,.actions .pass.selected{background:#f1f1f3;border-color:#b8b8bd}.actions a{padding:0 12px;color:#0066cc}.state{margin-top:11px;font-size:11px;color:#86868b}.state.keep{color:#248a3d}.state.pass{color:#6e6e73}.empty{padding:80px 20px;text-align:center;color:#86868b}footer{padding:50px 0 0;text-align:center;color:#86868b;font-size:12px}
        @media(max-width:800px){main{padding:24px 16px 60px}.hero{display:block}.export{margin-top:18px}.summary{grid-template-columns:repeat(2,1fr)}.toolbar{grid-template-columns:1fr}.sectionTitle{display:block}.sectionTitle small{display:block;margin-top:5px}.grid{grid-template-columns:1fr}.media{aspect-ratio:1/1.08}.body p{min-height:0}}
      `}</style>
    </>
  );
}
