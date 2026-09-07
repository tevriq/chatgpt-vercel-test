import Head from 'next/head'
import {useRouter} from 'next/router'

const data={
 '1732098765432':{platform:'小红书',title:'在小县城，我做了一个「轻量生活实验」',author:'阿北在小县城',time:'2026-09-07 10:42',note:'这个想法很有共鸣，我也想在自己的小城市里做一些慢而有意义的尝试。'},
 '6012345678901':{platform:'公众号',title:'AI 时代的个人知识管理方法论',author:'少数派',time:'2026-09-07 09:18',note:''},
 '7293847561234':{platform:'抖音',title:'我在东京，租了一个 9㎡ 的房子',author:'小林今天住哪儿',time:'2026-09-06 22:15',note:'以后去东京可以参考这个居住尺度。'},
 '1731987654321':{platform:'小红书',title:'极简生活的 10 个小习惯',author:'极简生活家',time:'2026-09-06 18:45',note:''}
}
export default function Article(){const r=useRouter();const a=data[String(r.query.id||'')]||data['1732098765432'];return <><Head><title>{a.title}</title><meta name="viewport" content="width=device-width, initial-scale=1"/></Head><main style={{maxWidth:760,margin:'0 auto',padding:'40px 20px 80px',fontFamily:'-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif',color:'#202124',lineHeight:1.8}}><div style={{fontSize:13,color:'#888'}}>{a.platform}</div><h1 style={{fontSize:30,lineHeight:1.35,margin:'8px 0 10px'}}>{a.title}</h1><div style={{fontSize:14,color:'#777',marginBottom:28}}>{a.author} · {a.time}</div><p>这是独立的归档网页 Demo。正式 P4 继续沿用现网做法：列表只负责进入存档页面，阅读页不套后台框架。</p><p>正文、图片、视频、来源信息和公开评论会按实际归档内容展示。这里使用固定示例数据，不连接生产档案。</p><h2 style={{fontSize:20,marginTop:30}}>原始内容</h2><p>归档事实保持只读，不因为首页 UI 重做而改变。</p>{a.note&&<div style={{marginTop:28,padding:'14px 16px',background:'#fff8e8',borderRadius:8}}><b style={{fontSize:14}}>我的评论</b><div style={{marginTop:6,fontSize:14}}>{a.note}</div></div>}<hr style={{border:0,borderTop:'1px solid #eee',margin:'36px 0'}}/><div style={{fontSize:12,color:'#999'}}>CN 内容档案馆 · 独立存档页 Demo</div></main></>}
