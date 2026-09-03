import {useState} from 'react';

export default function Home(){
  const [mode,setMode]=useState('p14');
  return <div style={{position:'fixed',inset:0,background:'#e9e9ee',fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC",sans-serif'}}>
    <div style={{position:'fixed',top:14,left:'50%',transform:'translateX(-50%)',zIndex:20,display:'flex',gap:4,padding:4,borderRadius:14,background:'rgba(255,255,255,.88)',boxShadow:'0 8px 28px rgba(0,0,0,.14)',backdropFilter:'blur(18px)'}}>
      <button onClick={()=>setMode('p14')} style={btn(mode==='p14')}>P14 Web 原型</button>
      <button onClick={()=>setMode('tapflow')} style={btn(mode==='tapflow')}>Tapflow 开源原生运行</button>
    </div>
    {mode==='p14' ?
      <iframe title="P14 prototype" src="/api/prototype" style={frame}/>
      :
      <div style={{position:'absolute',inset:0,padding:'74px 18px 18px',display:'grid',gridTemplateRows:'auto 1fr',gap:12,overflow:'auto'}}>
        <div style={{maxWidth:1040,width:'100%',margin:'0 auto',background:'rgba(255,255,255,.94)',borderRadius:18,padding:'14px 18px',boxShadow:'0 6px 24px rgba(0,0,0,.08)'}}>
          <div style={{fontWeight:750,fontSize:17}}>Tapflow · Self-hosted iOS Simulator Streaming</div>
          <div style={{fontSize:13,color:'#737378',marginTop:4,lineHeight:1.5}}>这里先内嵌 Tapflow 官方真实运行演示，验证它的浏览器体验与我们 Vercel 评论流程是否合适。真正接入 P14 时，这个区域会直接改成你 Mac mini 上 Tapflow Relay 的 Dashboard URL；届时里面运行的是 Mac mini 的 Xcode iOS Simulator 和真正的 SwiftUI P14，而不是网页模拟。</div>
        </div>
        <div style={{maxWidth:1040,width:'100%',height:'100%',minHeight:620,margin:'0 auto',background:'#0b0b0c',borderRadius:26,overflow:'hidden',boxShadow:'0 16px 55px rgba(0,0,0,.18)',display:'grid',placeItems:'center'}}>
          <video title="Tapflow official demo" src="https://www.tapflow.dev/tapflow-demo.mp4" poster="https://www.tapflow.dev/demo-thumbnail.png" controls autoPlay muted loop playsInline style={{width:'100%',height:'100%',objectFit:'contain',background:'#0b0b0c'}} />
        </div>
      </div>
    }
  </div>
}

const frame={position:'fixed',inset:0,width:'100vw',height:'100vh',border:0,background:'#f2f2f7'};
function btn(active){return {border:0,borderRadius:11,padding:'9px 13px',fontSize:13,fontWeight:700,cursor:'pointer',background:active?'#111':'transparent',color:active?'#fff':'#666'}}
