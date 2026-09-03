import {useState} from 'react';

export default function Home(){
  const [mode,setMode]=useState('interactive');
  return <div style={{position:'fixed',inset:0,background:'#dedee3',fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC",sans-serif'}}>
    <div style={{position:'fixed',top:14,left:'50%',transform:'translateX(-50%)',zIndex:50,display:'flex',gap:4,padding:4,borderRadius:14,background:'rgba(255,255,255,.9)',boxShadow:'0 8px 28px rgba(0,0,0,.14)',backdropFilter:'blur(18px)'}}>
      <button onClick={()=>setMode('interactive')} style={btn(mode==='interactive')}>交互预览</button>
      <button onClick={()=>setMode('gallery')} style={btn(mode==='gallery')}>高保真 UI 图册</button>
      <button onClick={()=>setMode('motion')} style={btn(mode==='motion')}>动效视频</button>
    </div>
    {mode==='motion' ? <MotionReview/> : <iframe title={mode==='interactive'?'P14 interactive web review':'P14 high fidelity UI gallery'} src={mode==='interactive'?'/api/prototype':'/api/gallery'} style={{position:'fixed',inset:0,width:'100vw',height:'100vh',border:0,background:mode==='interactive'?'#f2f2f7':'#ececf1'}} />}
  </div>
}

function MotionReview(){
  return <div style={{position:'absolute',inset:0,overflow:'auto',padding:'82px 20px 40px',background:'#ececf1'}}>
    <div style={{maxWidth:1080,margin:'0 auto'}}>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:30,fontWeight:780,letterSpacing:'-.7px'}}>P14 Motion Review</div>
        <div style={{marginTop:6,color:'#6f6f75',fontSize:15,lineHeight:1.6}}>同一条 Voice → AI Transform，用视频看节奏，用图册看最终视觉，用交互版验证操作。</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'minmax(280px,420px) minmax(300px,1fr)',gap:18,alignItems:'start'}}>
        <div style={{background:'#111',borderRadius:30,padding:14,boxShadow:'0 20px 60px rgba(0,0,0,.18)'}}>
          <video src="/p14-voice-ai-motion.mp4" autoPlay muted loop playsInline controls style={{display:'block',width:'100%',maxWidth:360,margin:'0 auto',borderRadius:22,background:'#f2f2f7'}} />
        </div>
        <div style={{background:'rgba(255,255,255,.94)',borderRadius:24,padding:22,boxShadow:'0 12px 35px rgba(0,0,0,.08)'}}>
          <div style={{fontSize:18,fontWeight:760}}>Motion Spec · 6 秒</div>
          <div style={{marginTop:16,display:'grid',gap:12}}>
            {[
              ['0.0–1.5s','按住说','红色录音态、波形和实时 transcript 持续反馈。'],
              ['1.5–2.2s','松开 / 锁定','波形收束，文字停止变化，进入短暂稳定态。'],
              ['2.2–4.3s','AI 整理','✦ 状态出现；sweep 掠过文字；冗词淡出并划除。'],
              ['4.3–5.1s','Canonical text','正文重排为「明天处理 P14 同步问题」，保持空间连续。'],
              ['5.1–6.0s','结构补全','Project / AI Tag / Reminder / Audio 依次出现，最后 Save 点亮。']
            ].map(([time,title,body])=><div key={time} style={{display:'grid',gridTemplateColumns:'92px 110px 1fr',gap:10,padding:'11px 0',borderBottom:'1px solid #ececf0'}}><b style={{fontSize:13}}>{time}</b><span style={{fontWeight:700}}>{title}</span><span style={{color:'#696970',lineHeight:1.5}}>{body}</span></div>)}
          </div>
          <div style={{marginTop:16,padding:14,borderRadius:16,background:'#f5f1ff',color:'#6541bb',fontSize:13,lineHeight:1.6}}>这一栏是动效证据，不承担完整交互。完整状态切换仍在「交互预览」，像素与信息层级基准仍在「高保真 UI 图册」。</div>
        </div>
      </div>
    </div>
  </div>
}

function btn(active){return {border:0,borderRadius:11,padding:'9px 14px',fontSize:13,fontWeight:720,cursor:'pointer',background:active?'#111':'transparent',color:active?'#fff':'#67676d'}}
