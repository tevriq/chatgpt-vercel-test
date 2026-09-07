import Head from 'next/head'
import { useMemo, useState } from 'react'
import { Archive, BookOpen, ChevronLeft, ChevronRight, CircleUserRound, ExternalLink, FileText, Home, ImagePlus, MoreHorizontal, RefreshCw, Search, Settings, Share2, Upload, UserRound } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { cn } from '../lib/utils'

const archives=[
 {id:'xhs_1732098765432',platform:'小红书',tone:'xhs',title:'在小县城，我做了一个「轻量生活实验」',author:'阿北在小县城',time:'2026-09-07 10:42',comments:42,note:'这个想法很有共鸣，我也想在自己的小城市里做一些慢而有意义的尝试。'},
 {id:'mp_6012345678901',platform:'公众号',tone:'wechat',title:'AI 时代的个人知识管理方法论',author:'少数派',time:'2026-09-07 09:18',comments:88,note:''},
 {id:'dy_7293847561234',platform:'抖音',tone:'douyin',title:'我在东京，租了一个 9㎡ 的房子',author:'小林今天住哪儿',time:'2026-09-06 22:15',comments:63,note:'以后去东京可以参考这个居住尺度。'},
 {id:'xhs_1731987654321',platform:'小红书',tone:'xhs',title:'极简生活的 10 个小习惯',author:'极简生活家',time:'2026-09-06 18:45',comments:26,note:''}
]
const tasks=[
 {status:'排队中',kind:'neutral',platform:'小红书',title:'OOTD｜秋天第一件针织开衫终于到了',time:'10:32'},
 {status:'进行中 40%',kind:'info',platform:'公众号',title:'AI 时代的个人知识管理方法论',time:'10:31'},
 {status:'完成',kind:'success',platform:'抖音',title:'在小县城，我做了一个「轻量生活实验」',time:'10:30'},
 {status:'失败 · 平台限制',kind:'danger',platform:'小红书',title:'换季穿搭合集｜温柔风毛衣分享',time:'10:29'},
 {status:'失败 · 登录失效',kind:'warning',platform:'公众号',title:'为什么说阅读是最好的投资',time:'10:28'}
]
const authors=[
 {name:'阿北在小县城',platform:'小红书',count:18},
 {name:'少数派',platform:'微信公众号',count:34},
 {name:'小林今天住哪儿',platform:'抖音',count:12},
 {name:'极简生活家',platform:'小红书',count:9}
]

function PlatformBadge({platform}){
 const cls=platform==='小红书'?'border-rose-200 bg-rose-50 text-rose-700':platform==='抖音'?'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700':'border-emerald-200 bg-emerald-50 text-emerald-700'
 return <Badge variant="outline" className={cls}>{platform}</Badge>
}
function StatusBadge({kind,children}){
 const variant=kind==='success'?'success':kind==='danger'?'danger':kind==='warning'?'warning':'secondary'
 return <Badge variant={variant}>{children}</Badge>
}
function Header({go}){
 return <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
  <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
   <div className="flex min-w-0 flex-1 items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-950 text-white"><Archive className="h-5 w-5"/></div><div className="min-w-0"><div className="flex items-center gap-2"><b className="truncate text-[15px]">CN 内容档案馆</b><Badge variant="success" className="hidden xs:inline-flex">生产环境</Badge></div><p className="truncate text-xs text-muted-foreground">P4 · Personal Internet Archive</p></div></div>
   <Button variant="ghost" size="icon" aria-label="设置" onClick={()=>go('settings')}><Settings className="h-5 w-5"/></Button>
  </div>
 </header>
}
function DesktopNav({view,go}){
 const nav=[['home','收藏',Home],['archive','全部归档',Archive],['author','作者',UserRound],['settings','设置',Settings]]
 return <nav className="mx-auto hidden max-w-5xl gap-1 px-6 py-3 md:flex">{nav.map(([key,label,Icon])=><Button key={key} variant={view===key?'secondary':'ghost'} onClick={()=>go(key)}><Icon className="mr-2 h-4 w-4"/>{label}</Button>)}</nav>
}
function BottomNav({view,go}){
 const nav=[['home','收藏',Home],['archive','档案',Archive],['author','作者',CircleUserRound],['settings','设置',Settings]]
 return <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"><div className="mx-auto grid max-w-md grid-cols-4">{nav.map(([key,label,Icon])=><button key={key} onClick={()=>go(key)} className={cn('flex min-h-16 flex-col items-center justify-center gap-1 text-xs text-muted-foreground',view===key&&'text-foreground')}><Icon className={cn('h-5 w-5',view===key&&'stroke-[2.4]')}/><span>{label}</span></button>)}</div></nav>
}
function PageTitle({title,desc,right}){return <div className="mb-4 flex items-end justify-between gap-3"><div><h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>{desc&&<p className="mt-1 text-sm text-muted-foreground">{desc}</p>}</div>{right}</div>}
function ArchiveCard({item,onOpen}){
 return <Card className="overflow-hidden shadow-none transition hover:bg-muted/30"><button onClick={()=>onOpen(item)} className="w-full text-left"><CardContent className="p-4 sm:p-5"><div className="flex items-start gap-3"><div className={cn('mt-0.5 hidden h-14 w-14 shrink-0 rounded-lg sm:block',item.tone==='xhs'?'bg-rose-100':item.tone==='douyin'?'bg-fuchsia-100':'bg-emerald-100')}/><div className="min-w-0 flex-1"><div className="mb-2 flex items-center gap-2"><PlatformBadge platform={item.platform}/><span className="text-xs text-muted-foreground">{item.comments} 评论</span><MoreHorizontal className="ml-auto h-4 w-4 text-muted-foreground"/></div><h3 className="line-clamp-2 text-[15px] font-medium leading-6">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.author} · {item.time}</p>{item.note&&<p className="mt-2 line-clamp-2 rounded-md bg-amber-50 px-2.5 py-2 text-xs leading-5 text-amber-900">“{item.note}”</p>}</div></div></CardContent></button></Card>
}
function CollectView({openArchive}){
 const [more,setMore]=useState(false);const [saved,setSaved]=useState(false)
 return <>
  <Card className="shadow-none"><CardHeader className="pb-4"><CardTitle className="text-lg">收藏新内容</CardTitle><CardDescription>沿用现网入口，优先把手机操作做顺手。</CardDescription></CardHeader><CardContent className="space-y-4">
   <Tabs defaultValue="link"><div className="-mx-1 overflow-x-auto px-1 pb-1"><TabsList className="w-max"><TabsTrigger value="link">链接</TabsTrigger><TabsTrigger value="text">文字</TabsTrigger><TabsTrigger value="image">文字 + 图片</TabsTrigger><TabsTrigger value="file">文字 + 文件</TabsTrigger></TabsList></div><TabsContent value="link"><Textarea className="min-h-32 resize-y" placeholder={'粘贴链接地址，每行一个\n支持微信公众号 / 小红书 / 抖音 / 抖音直播 / 本地路径'}/></TabsContent><TabsContent value="text"><Textarea className="min-h-32" placeholder="输入要保存的文字内容"/></TabsContent><TabsContent value="image"><Textarea className="min-h-24" placeholder="输入文字说明"/></TabsContent><TabsContent value="file"><Textarea className="min-h-24" placeholder="输入文字说明"/></TabsContent></Tabs>
   <Button variant="outline" className="w-full justify-between" onClick={()=>setMore(v=>!v)}><span className="flex items-center gap-2"><ImagePlus className="h-4 w-4"/>我的评论与配图（可选）</span><span className="text-xs text-muted-foreground">{more?'收起':'展开'}</span></Button>
   {more&&<div className="space-y-3 rounded-lg border bg-muted/30 p-3"><div><label className="mb-1.5 block text-xs font-medium">我的评论</label><Textarea className="min-h-20 bg-background" placeholder="记录你当时的想法、感受或备注…"/></div><div><label className="mb-1.5 block text-xs font-medium">评论配图</label><Button variant="outline" className="w-full justify-start bg-background"><Upload className="mr-2 h-4 w-4"/>选择图片 <span className="ml-auto text-xs text-muted-foreground">最多 9 张</span></Button></div></div>}
   <Button className="w-full" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),1600)}}>{saved?'✓ 已加入队列':'保存到档案'}</Button>
  </CardContent></Card>
  <div className="mt-6 grid gap-6 lg:grid-cols-2"><section><PageTitle title="今日任务" right={<Button variant="ghost" size="sm"><RefreshCw className="mr-1.5 h-4 w-4"/>刷新</Button>}/><div className="space-y-2">{tasks.map((t,i)=><Card key={i} className="shadow-none"><CardContent className="p-4"><div className="flex items-center gap-2"><StatusBadge kind={t.kind}>{t.status}</StatusBadge><span className="text-xs text-muted-foreground">{t.platform}</span><span className="ml-auto text-xs text-muted-foreground">{t.time}</span></div><p className="mt-2 line-clamp-1 text-sm">{t.title}</p></CardContent></Card>)}</div></section><section><PageTitle title="最近归档" right={<Button variant="ghost" size="sm">查看全部<ChevronRight className="ml-1 h-4 w-4"/></Button>}/><div className="space-y-2">{archives.slice(0,3).map(a=><ArchiveCard key={a.id} item={a} onOpen={openArchive}/>)}</div></section></div>
 </>
}
function ArchiveView({openArchive}){
 const [q,setQ]=useState('');const [filter,setFilter]=useState('全部');const filtered=useMemo(()=>archives.filter(a=>(filter==='全部'||a.platform===filter)&&(!q||`${a.title} ${a.author}`.toLowerCase().includes(q.toLowerCase()))),[q,filter])
 return <><PageTitle title="全部归档" desc="搜索标题、作者和内容" right={<Badge variant="secondary">1247 条</Badge>}/><div className="mb-3 relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground"/><Input value={q} onChange={e=>setQ(e.target.value)} className="pl-9" placeholder="搜索归档…"/></div><div className="mb-4 flex gap-2 overflow-x-auto pb-1">{['全部','公众号','小红书','抖音'].map(x=><Button key={x} variant={filter===x?'secondary':'outline'} size="sm" onClick={()=>setFilter(x)}>{x}</Button>)}</div><div className="space-y-2">{filtered.map(a=><ArchiveCard key={a.id} item={a} onOpen={openArchive}/>)}</div></>
}
function AuthorView(){return <><PageTitle title="作者" desc="按来源作者浏览归档"/><Card className="shadow-none"><CardContent className="divide-y p-0">{authors.map((a,i)=><button key={i} className="flex min-h-16 w-full items-center gap-3 px-4 text-left hover:bg-muted/30"><div className="grid h-10 w-10 place-items-center rounded-full bg-muted font-medium">{a.name.slice(0,1)}</div><div className="min-w-0 flex-1"><b className="block truncate text-sm">{a.name}</b><span className="text-xs text-muted-foreground">{a.platform} · {a.count} 条归档</span></div><ChevronRight className="h-4 w-4 text-muted-foreground"/></button>)}</CardContent></Card></>}
function SettingsView(){const rows=[['当前环境','生产环境'],['本地存储','CN_ARCHIVE_DATA'],['小红书登录','已登录'],['抖音登录','已登录'],['最大并发任务','3'],['MCP','本地 · 已启用']];return <><PageTitle title="设置" desc="保留现网已有配置入口"/><Card className="shadow-none"><CardContent className="divide-y p-0">{rows.map(([a,b])=><button key={a} className="flex min-h-14 w-full items-center gap-3 px-4 text-left hover:bg-muted/30"><span className="flex-1 text-sm">{a}</span><span className="max-w-[55%] truncate text-xs text-muted-foreground">{b}</span><ChevronRight className="h-4 w-4 text-muted-foreground"/></button>)}</CardContent></Card><Card className="mt-4 border-dashed bg-muted/30 shadow-none"><CardContent className="p-4 text-xs leading-5 text-muted-foreground">UI Demo 不连接生产数据、不读取 Cookie、不修改现网服务。</CardContent></Card></>}
function DetailView({item,back}){return <><Button variant="ghost" className="mb-3 px-2" onClick={back}><ChevronLeft className="mr-1 h-4 w-4"/>返回</Button><Card className="shadow-none"><CardHeader><div className="mb-2"><PlatformBadge platform={item.platform}/></div><CardTitle className="text-xl leading-8 sm:text-2xl">{item.title}</CardTitle><CardDescription>{item.author} · {item.time}</CardDescription></CardHeader><CardContent className="space-y-5"><div className="aspect-[16/9] rounded-xl bg-muted"/><Tabs defaultValue="body"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="body">正文</TabsTrigger><TabsTrigger value="images">图片 9</TabsTrigger><TabsTrigger value="comments">评论 {item.comments}</TabsTrigger></TabsList><TabsContent value="body" className="space-y-4 text-[15px] leading-7"><p>这里展示抓取后的原文内容。标题、作者、发布时间、来源 URL、正文、媒体和公开评论仍然按现网 P4 的归档逻辑保存。</p><p>这一版只更换交互和组件体系，不改变归档事实。</p></TabsContent><TabsContent value="images"><div className="grid grid-cols-3 gap-2">{Array.from({length:6}).map((_,i)=><div key={i} className="aspect-square rounded-lg bg-muted"/>)}</div></TabsContent><TabsContent value="comments" className="space-y-3"><div className="rounded-lg border p-3 text-sm"><b>小鹿在路上</b><p className="mt-1 text-muted-foreground">写得太好了！我也在做类似的尝试。</p></div><div className="rounded-lg border p-3 text-sm"><b>生活研究所</b><p className="mt-1 text-muted-foreground">很有启发，感谢分享。</p></div></TabsContent></Tabs><div className="rounded-xl border bg-amber-50 p-4"><b className="text-sm">我的评论</b><p className="mt-2 text-sm leading-6 text-amber-950">{item.note||'这个条目暂时没有个人评论。'}</p></div><div className="grid grid-cols-2 gap-2"><Button variant="outline"><Share2 className="mr-2 h-4 w-4"/>分享</Button><Button variant="outline"><ExternalLink className="mr-2 h-4 w-4"/>来源链接</Button></div></CardContent></Card></>}

export default function P4ShadcnV2(){
 const [view,setView]=useState('home');const [detail,setDetail]=useState(null)
 const go=v=>{setView(v);if(v!=='detail')setDetail(null)}; const openArchive=item=>{setDetail(item);setView('detail')}
 return <><Head><title>P4 · shadcn/ui Demo v2</title><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/></Head><div className="min-h-screen bg-zinc-50/50"><Header go={go}/><DesktopNav view={view} go={go}/><main className="mx-auto max-w-5xl px-4 pb-24 pt-4 sm:px-6 md:pb-10 md:pt-2">{view==='home'&&<CollectView openArchive={openArchive}/>} {view==='archive'&&<ArchiveView openArchive={openArchive}/>} {view==='author'&&<AuthorView/>} {view==='settings'&&<SettingsView/>} {view==='detail'&&detail&&<DetailView item={detail} back={()=>go('archive')}/>}</main>{view!=='detail'&&<BottomNav view={view} go={go}/>}</div></>
}
