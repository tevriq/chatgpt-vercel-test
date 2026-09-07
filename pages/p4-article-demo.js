import Head from 'next/head'
import {useRouter} from 'next/router'
import {Badge} from '../components/ui/badge'

const data={
 '1732098765432':{platform:'小红书',title:'在小县城，我做了一个「轻量生活实验」',author:'阿北在小县城',time:'2026-09-07 10:42',note:'这个想法很有共鸣，我也想在自己的小城市里做一些慢而有意义的尝试。'},
 '6012345678901':{platform:'公众号',title:'AI 时代的个人知识管理方法论',author:'少数派',time:'2026-09-07 09:18',note:''},
 '7293847561234':{platform:'抖音',title:'我在东京，租了一个 9㎡ 的房子',author:'小林今天住哪儿',time:'2026-09-06 22:15',note:'以后去东京可以参考这个居住尺度。'},
 '1731987654321':{platform:'小红书',title:'极简生活的 10 个小习惯',author:'极简生活家',time:'2026-09-06 18:45',note:''}
}
function Platform({p}){const c=p==='小红书'?'border-rose-200 bg-rose-50 text-rose-700':p==='抖音'?'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700':'border-emerald-200 bg-emerald-50 text-emerald-700';return <Badge variant="outline" className={c}>{p}</Badge>}
export default function Article(){
 const r=useRouter()
 const a=data[String(r.query.id||'')]||data['1732098765432']
 const note=typeof r.query.note==='string'?r.query.note:a.note
 return <><Head><title>{a.title}</title><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/></Head><main className="mx-auto max-w-3xl px-5 py-8 text-zinc-800 sm:px-8 sm:py-12">
  <Platform p={a.platform}/>
  <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{a.title}</h1>
  <div className="mt-3 text-sm text-muted-foreground"><span className="font-medium text-foreground">{a.author}</span><span className="mx-2">·</span><span>{a.time}</span></div>
  {note&&<section className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"><div className="mb-1 font-medium">我的评论</div><div>{note}</div></section>}
  <article className="mt-8 space-y-5 text-[16px] leading-8">
   <p>这是独立的归档网页 Demo。正式 P4 继续沿用现网做法：列表进入独立存档页面，阅读页不套管理界面框架。</p>
   <p>正文、图片、视频、来源信息和公开评论会按实际归档内容展示。这里使用固定示例数据，不连接生产档案。</p>
   <h2 className="pt-3 text-xl font-semibold">原始内容</h2>
   <p>归档事实保持只读，不因为首页 UI 调整而改变。</p>
  </article>
  <div className="mt-10 border-t pt-5 text-xs text-muted-foreground">CN 内容档案馆 · 独立存档页 Demo</div>
 </main></>
}
