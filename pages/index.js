import {useState} from 'react';

export default function Home(){
  const [mode,setMode]=useState('interactive');
  return <div style={{position:'fixed',inset:0,background:'#dedee3',fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC",sans-serif'}}>
    <div style={{position:'fixed',top:14,left:'50%',transform:'translateX(-50%)',zIndex:50,display:'flex',gap:4,padding:4,borderRadius:14,background:'rgba(255,255,255,.9)',boxShadow:'0 8px 28px rgba(0,0,0,.14)',backdropFilter:'blur(18px)'}}>
      <button onClick={()=>setMode('interactive')} style={btn(mode==='interactive')}>交互预览</button>
      <button onClick={()=>setMode('gallery')} style={btn(mode==='gallery')}>高保真 UI 图册</button>
    </div>
    <iframe title={mode==='interactive'?'P14 interactive web review':'P14 high fidelity UI gallery'} src={mode==='interactive'?'/api/prototype':'/api/gallery'} style={{position:'fixed',inset:0,width:'100vw',height:'100vh',border:0,background:mode==='interactive'?'#f2f2f7':'#ececf1'}} />
  </div>
}

function btn(active){return {border:0,borderRadius:11,padding:'9px 14px',fontSize:13,fontWeight:720,cursor:'pointer',background:active?'#111':'transparent',color:active?'#fff':'#67676d'}}
