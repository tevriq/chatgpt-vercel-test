from pathlib import Path

p = Path('public/p16-s4-cloud-acceptance.html')
text = p.read_text(encoding='utf-8')

old_css = ".rail{position:sticky;top:48px;height:calc(100vh - 48px);padding:16px 10px;background:linear-gradient(180deg,var(--rail),rgba(10,23,34,.91));border-right:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:9px;align-items:center}.logo{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-weight:900;color:#d7f8ff;background:linear-gradient(135deg,rgba(55,207,255,.2),rgba(69,232,160,.11));border:1px solid rgba(55,207,255,.28)}.nav{width:100%;border:1px solid transparent;background:transparent;color:#8ba7b8;border-radius:13px;padding:9px 4px;cursor:pointer;font-size:11px}.nav b{display:block;font-size:18px}.nav.active,.nav:hover{color:#bcefff;background:rgba(55,207,255,.09);border-color:rgba(55,207,255,.2)}.spacer{flex:1}.main{padding:22px 25px 40px;max-width:1600px;width:100%;margin:auto}"
new_css = ".rail{position:sticky;top:48px;height:calc(100vh - 48px);padding:16px 10px;background:linear-gradient(180deg,var(--rail),rgba(10,23,34,.91));border-right:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:9px;align-items:center}.logo{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-weight:900;color:#d7f8ff;background:linear-gradient(135deg,rgba(55,207,255,.2),rgba(69,232,160,.11));border:1px solid rgba(55,207,255,.28)}.nav{border:1px solid transparent;background:transparent;color:#8ba7b8;border-radius:13px;padding:9px 12px;cursor:pointer;font-size:12px;white-space:nowrap}.nav b{display:inline;margin-right:6px;font-size:15px}.nav.active,.nav:hover{color:#bcefff;background:rgba(55,207,255,.09);border-color:rgba(55,207,255,.2)}.spacer{flex:1}.main{padding:18px 25px 40px;max-width:1600px;width:100%;margin:auto}.topnav{position:sticky;top:48px;z-index:85;display:flex;gap:6px;align-items:center;overflow-x:auto;margin:-18px -25px 18px;padding:10px 25px;background:rgba(13,29,42,.91);border-bottom:1px solid rgba(255,255,255,.08);backdrop-filter:blur(18px)}.topnav .nav{flex:0 0 auto}.rail .meta{writing-mode:vertical-rl;transform:rotate(180deg);letter-spacing:.08em}"
if old_css not in text:
    raise SystemExit('css anchor not found')
text = text.replace(old_css, new_css, 1)

old_rail = '<div class="app"><aside class="rail"><div class="logo">HV</div><button class="nav active" data-page="overview"><b>⌂</b>总览</button><button class="nav" data-page="archive"><b>▣</b>归档</button><button class="nav" data-page="analysis"><b>◫</b>分析</button><button class="nav" data-page="tasks"><b>⇄</b>任务</button><button class="nav" data-page="reviewPage"><b>◇</b>待复核</button><button class="nav" data-page="history"><b>⌁</b>记录</button><div class="spacer"></div><div class="meta">S4 R2</div></aside><main class="main">'
new_rail = '<div class="app"><aside class="rail"><div class="logo">HV</div><div class="spacer"></div><div class="meta">S4 R4 REVIEW</div></aside><main class="main"><nav class="topnav" aria-label="主导航"><button class="nav active" data-page="overview"><b>⌂</b>总览</button><button class="nav" data-page="archive"><b>▣</b>归档</button><button class="nav" data-page="analysis"><b>◫</b>分析</button><button class="nav" data-page="tasks"><b>⇄</b>任务</button><button class="nav" data-page="reviewPage"><b>◇</b>待复核</button><button class="nav" data-page="history"><b>⌁</b>记录</button></nav>'
if old_rail not in text:
    raise SystemExit('rail anchor not found')
text = text.replace(old_rail, new_rail, 1)

text = text.replace('Stage 4 Cloud Acceptance · R2', 'Stage 4 Cloud Acceptance · R4', 1)
text = text.replace('Human feedback revision：更浅 C 色阶 / 封面 Loading / 播放器大窗+全窗 / 导航回顶', 'Human feedback revision：主导航改为同一顶部水平栏 / 评论型 Preview', 1)

p.write_text(text, encoding='utf-8')
print('patched p16 navigation layout')
