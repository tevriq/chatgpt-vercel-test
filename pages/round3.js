import {useEffect,useMemo,useState} from 'react';

const SB='https://reqvofpzdowwdwgmfevr.supabase.co';
const KEY='sb_publishable_GZqZ9q8kYWVWdpUKax9Okw_RwoQmfNw';
const timers={};

const ITEMS=[
  {id:'r3-pull-search',title:'Things-style Pull to Search',repo:'mikelikesdesign/SwiftUI-experiments',kind:'Search',media:'https://github.com/user-attachments/assets/498df2ab-8bb6-4f64-bc08-8c1e3c785183',mediaType:'video',note:'下拉不是刷新，而是自然露出搜索。看“隐藏功能如何被发现”，以及回弹是否像系统原生。'},
  {id:'r3-bob-summary',title:'Bob · AI Summarize',repo:'mikelikesdesign/SwiftUI-experiments',kind:'Text / AI',media:'https://raw.githubusercontent.com/mikelikesdesign/SwiftUI-experiments/main/bob/bob.gif',note:'AI 摘要直接作用在正文上。看 AI 能力是否融进内容，而不是额外塞一个聊天窗口。'},
  {id:'r3-text-alignment',title:'Text Alignment Scrubber',repo:'mikelikesdesign/SwiftUI-experiments',kind:'Text',media:'https://raw.githubusercontent.com/mikelikesdesign/SwiftUI-experiments/main/text%20alignment/text%20alignment.gif',note:'用连续手势调整文本对齐。看“工具控件→直接视觉结果”的即时反馈是否舒服。'},
  {id:'r3-content-ideas',title:'Content Ideas · Rephrase Quadrant',repo:'mikelikesdesign/AI-experiments',kind:'Text / AI',media:'https://raw.githubusercontent.com/mikelikesdesign/AI-experiments/main/content%20ideas/content%20ideas.gif',note:'选中文字后，用二维拖拽在简单/随意/正式/高级之间改写。重点看 AI 参数是否能变成可触摸界面。'},
  {id:'r3-pinch-text',title:'Pinch Text · Reading Depth',repo:'mikelikesdesign/AI-experiments',kind:'Text / AI',media:'https://raw.githubusercontent.com/mikelikesdesign/AI-experiments/main/media/pinch%20text.gif',note:'捏合直接改变内容详略。看连续手势控制“信息密度”是否自然，还是太隐晦。'},
  {id:'r3-word-tap',title:'Word Tap · Inline Rewrite',repo:'mikelikesdesign/AI-experiments',kind:'Text / AI',media:'https://raw.githubusercontent.com/mikelikesdesign/AI-experiments/main/media/word%20tap.gif',note:'长按一个词，其余正文退后并给出替换建议。非常贴近“内容是主角”的 AI 编辑方式。'},
  {id:'r3-pinch-prompts',title:'Pinch Prompts · History Navigator',repo:'mikelikesdesign/AI-experiments',kind:'Navigation',media:'https://raw.githubusercontent.com/mikelikesdesign/AI-experiments/main/pinch%20prompts/pinch%20prompts.gif',note:'把历史导航藏进捏合手势。看空间连续性是否帮助理解，还是增加学习成本。'},
  {id:'r3-quick-camera',title:'Quick Camera · Context Capture',repo:'mikelikesdesign/AI-experiments',kind:'Input',media:'https://raw.githubusercontent.com/mikelikesdesign/AI-experiments/main/media/quick%20camera.gif',note:'快速拍照并作为上下文输入。看“输入附件”怎样做到少一步、不中断当前任务。'},
  {id:'r3-morphing-button',title:'Morphing Button · Loading → Result',repo:'pramod-kumar-ios/SwiftUI-Canvas',kind:'State',media:'https://raw.githubusercontent.com/pramod-kumar-ios/SwiftUI-Canvas/main/SwiftUI-Canvas/GIFs/MorphingButton.gif',note:'按钮在原位置经历 Loader、成功或失败。重点看状态反馈是否有意义，而不是单纯动效。'},
  {id:'r3-staggered-list',title:'Staggered List · Appear',repo:'pramod-kumar-ios/SwiftUI-Canvas',kind:'Motion',media:'https://raw.githubusercontent.com/pramod-kumar-ios/SwiftUI-Canvas/main/SwiftUI-Canvas/GIFs/StaggeredList.gif',note:'列表逐项进入。用来判断你对“列表加载时有多少动效”这一尺度的接受度。'},
  {id:'r3-elastic-list',title:'Elastic List · Stretch Header',repo:'pramod-kumar-ios/SwiftUI-Canvas',kind:'Gesture',media:'https://raw.githubusercontent.com/pramod-kumar-ios/SwiftUI-Canvas/main/SwiftUI-Canvas/GIFs/ElasticListView.gif',note:'下拉时头图伸展并回弹。看这种物理反馈是灵动，还是多余装饰。'},
  {id:'r3-expandable-fab',title:'Expandable FAB · Action Reveal',repo:'pramod-kumar-ios/SwiftUI-Canvas',kind:'Component',media:'https://raw.githubusercontent.com/pramod-kumar-ios/SwiftUI-Canvas/main/SwiftUI-Canvas/GIFs/ExpandableFAB.gif',note:'一个主按钮展开多个操作。看“把次级动作藏起来”是否比常驻工具栏更清爽。'}
];

function Media({item}){
  if(item.mediaType==='video') return <video src={item.media} autoPlay muted loop playsInline controls preload="metadata"/>;
  return <img src={item.media} alt={item.title}/>;
}

export default function Round3(){
  const [ratings,setRatings]=useState({});
  const [status,setStatus]=useState('unrated');
  const [kind,setKind]=useState('全部');
  const [query,setQuery]=useState('');
  const [busy,setBusy]=useState('');

  useEffect(()=>{
    fetch(`${SB}/rest/v1/ios_ui_reference_ratings?select=*`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}})
      .then(r=>r.json())
      .then(rows=>{const map={};(rows||[]).forEach(x=>map[x.item_id]={status:x.status,custom_note:x.custom_note||''});setRatings(map)})
      .catch(()=>{});
  },[]);

  async function save(item,patch){
    const next={...(ratings[item.id]||{}),...patch};
    setRatings(prev=>({...prev,[item.id]:{...(prev[item.id]||{}),...patch}}));
    setBusy(item.id);
    try{
      await fetch(`${SB}/rest/v1/ios_ui_reference_ratings?on_conflict=item_id`,{
        method:'POST',
        headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},
        body:JSON.stringify({item_id:item.id,title:item.title,repo:item.repo,kind:item.kind,status:next.status||'unrated',custom_note:next.custom_note||'',source:item.repo})
      });
    }catch(_){}
    setBusy('');
  }

  function editNote(item,value){
    setRatings(prev=>({...prev,[item.id]:{...(prev[item.id]||{}),custom_note:value}}));
    clearTimeout(timers[item.id]);
    timers[item.id]=setTimeout(()=>save(item,{custom_note:value}),700);
  }

  const counts=ITEMS.reduce((a,item)=>{a[ratings[item.id]?.status||'unrated']++;return a},{unrated:0,keep:0,pass:0});
  const kinds=['全部',...new Set(ITEMS.map(x=>x.kind))];
  const filtered=useMemo(()=>ITEMS.filter(item=>{
    const s=ratings[item.id]?.status||'unrated';
    const hay=`${item.title} ${item.repo} ${item.kind} ${item.note} ${ratings[item.id]?.custom_note||''}`.toLowerCase();
    return (status==='all'||s===status)&&(kind==='全部'||item.kind===kind)&&(!query||hay.includes(query.toLowerCase()));
  }),[ratings,status,kind,query]);

  return <main>
    <header>
      <div className="eyebrow">IOS DESIGN REFERENCE · ROUND 03</div>
      <h1>这一轮，只看更接近真实产品的交互。</h1>
      <p>根据前两轮结果收窄：文字与 AI、搜索/输入、状态反馈、列表和手势。全部是具体 Demo，不评价仓库本身。</p>
      <a href="/">← Round 02</a>
    </header>

    <nav>
      {[
        ['unrated','未评',counts.unrated],['keep','收藏',counts.keep],['pass','Pass',counts.pass],['all','全部',ITEMS.length]
      ].map(x=><button key={x[0]} className={status===x[0]?'active':''} onClick={()=>setStatus(x[0])}><b>{x[2]}</b><span>{x[1]}</span></button>)}
    </nav>

    <div className="filters">
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索具体交互或你的备注…"/>
      <select value={kind} onChange={e=>setKind(e.target.value)}>{kinds.map(x=><option key={x}>{x}</option>)}</select>
    </div>

    <section>
      {filtered.map(item=>{
        const r=ratings[item.id]||{};
        return <article key={item.id} className={r.status||''}>
          <div className="media"><Media item={item}/><span>{item.kind}</span></div>
          <div className="body">
            <small>{item.repo}</small>
            <h2>{item.title}</h2>
            <p>{item.note}</p>
            <textarea rows="2" value={r.custom_note||''} onChange={e=>editNote(item,e.target.value)} placeholder="补充说明：喜欢哪里 / 为什么 Pass / 哪部分值得借鉴…"/>
            <div className="actions">
              <button className={r.status==='keep'?'selected keepBtn':''} onClick={()=>save(item,{status:r.status==='keep'?'unrated':'keep'})}>收藏</button>
              <button className={r.status==='pass'?'selected passBtn':''} onClick={()=>save(item,{status:r.status==='pass'?'unrated':'pass'})}>Pass</button>
              <em>{busy===item.id?'保存中…':'自动保存'}</em>
            </div>
          </div>
        </article>
      })}
    </section>

    <style jsx global>{`
      *{box-sizing:border-box} body{margin:0;background:#f5f5f7;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif}
      main{max-width:1450px;margin:0 auto;padding:42px 30px 90px}
      header{max-width:920px}.eyebrow{font-size:12px;letter-spacing:.14em;font-weight:700;color:#6e6e73}h1{font-size:clamp(42px,5vw,70px);line-height:.98;letter-spacing:-.055em;margin:12px 0 18px}header p{font-size:17px;line-height:1.55;color:#6e6e73;max-width:760px}header a{display:inline-block;margin-top:4px;color:#515154;text-decoration:none;font-size:14px}
      nav{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:34px 0 14px}nav button{border:1px solid #ddd;background:#fff;border-radius:18px;padding:14px 16px;text-align:left;cursor:pointer}nav button.active{border-color:#1d1d1f;box-shadow:0 0 0 1px #1d1d1f}nav b{display:block;font-size:30px;letter-spacing:-.03em}nav span{color:#6e6e73}
      .filters{display:grid;grid-template-columns:1fr 220px;gap:10px;margin-bottom:20px}.filters>*{height:46px;border:1px solid #ddd;background:#fff;border-radius:14px;padding:0 14px;font:inherit}
      section{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:18px}article{background:#fff;border:1px solid #e1e1e5;border-radius:24px;overflow:hidden;transition:.15s}article.keep{box-shadow:0 0 0 2px #34c75955}article.pass{opacity:.48}.media{height:390px;background:#ececef;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}.media img,.media video{width:100%;height:100%;object-fit:contain;background:#ececef}.media span{position:absolute;left:12px;top:12px;background:#ffffffea;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:600;backdrop-filter:blur(12px)}
      .body{padding:18px}.body small{color:#86868b;font-size:11px}.body h2{font-size:21px;letter-spacing:-.025em;margin:7px 0 8px}.body p{color:#6e6e73;line-height:1.48;min-height:66px;margin:0 0 12px;font-size:14px}.body textarea{width:100%;min-height:44px;max-height:130px;resize:vertical;border:1px solid #dedee3;background:#fafafa;border-radius:12px;padding:10px 11px;font:inherit;font-size:13px;line-height:1.45;outline:none}.body textarea:focus{background:#fff;border-color:#86868b;min-height:72px}.body textarea::placeholder{color:#a1a1a6}
      .actions{display:flex;align-items:center;gap:8px;margin-top:10px}.actions button{height:38px;border:1px solid #d8d8dd;background:#fff;border-radius:12px;padding:0 17px;font:inherit;cursor:pointer}.actions .keepBtn{background:#eaf9ee;border-color:#93d6a3}.actions .passBtn{background:#f2f2f4;border-color:#b6b6bb}.actions em{margin-left:auto;color:#86868b;font-style:normal;font-size:11px}
      @media(max-width:700px){main{padding:24px 16px 70px}nav{grid-template-columns:repeat(2,1fr)}.filters{grid-template-columns:1fr}.media{height:360px}section{grid-template-columns:1fr}}
    `}</style>
  </main>
}
