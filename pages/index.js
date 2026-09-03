import {useState} from 'react';

export default function Home(){
  const [mode,setMode]=useState('p14');
  return <div style={{position:'fixed',inset:0,background:'#e9e9ee',fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC",sans-serif'}}>
    <div style={{position:'fixed',top:14,left:'50%',transform:'translateX(-50%)',zIndex:20,display:'flex',gap:4,padding:4,borderRadius:14,background:'rgba(255,255,255,.88)',boxShadow:'0 8px 28px rgba(0,0,0,.14)',backdropFilter:'blur(18px)'}}>
      <button onClick={()=>setMode('p14')} style={btn(mode==='p14')}>P14 Web 原型</button>
      <button onClick={()=>setMode('native')} style={btn(mode==='native')}>真实 iOS 运行验证</button>
    </div>
    {mode==='p14' ?
      <iframe title="P14 prototype" src="/api/prototype" style={frame}/>
      :
      <div style={{position:'absolute',inset:0,padding:'74px 18px 18px',display:'grid',gridTemplateRows:'auto 1fr',gap:12}}>
        <div style={{maxWidth:960,width:'100%',margin:'0 auto',background:'rgba(255,255,255,.9)',borderRadius:18,padding:'14px 18px',boxShadow:'0 6px 24px rgba(0,0,0,.08)'}}>
          <div style={{fontWeight:750,fontSize:17}}>Appetize 原生 iOS Runtime · 嵌入验证</div>
          <div style={{fontSize:13,color:'#737378',marginTop:4,lineHeight:1.45}}>这里先嵌 Appetize 官方 iOS 示例，验证 Vercel 评论页里能否直接运行真实 iOS Runtime。P14 真 SwiftUI Simulator Build 上传后，只需要把这里替换成 P14 的 buildId。</div>
        </div>
        <div style={{maxWidth:960,width:'100%',height:'100%',margin:'0 auto',background:'#fff',borderRadius:26,overflow:'hidden',boxShadow:'0 16px 55px rgba(0,0,0,.16)'}}>
          <iframe title="Appetize native iOS demo" src="https://samples.appetize.io/product_launch_page_variant_1/launch.html" style={{width:'100%',height:'100%',border:0,background:'#fff'}} allow="clipboard-read; clipboard-write"/>
        </div>
      </div>
    }
  </div>
}

const frame={position:'fixed',inset:0,width:'100vw',height:'100vh',border:0,background:'#f2f2f7'};
function btn(active){return {border:0,borderRadius:11,padding:'9px 13px',fontSize:13,fontWeight:700,cursor:'pointer',background:active?'#111':'transparent',color:active?'#fff':'#666'}}
