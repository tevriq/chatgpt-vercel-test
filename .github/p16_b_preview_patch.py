from pathlib import Path
import re

path = Path('public/p16-s4-cloud-acceptance.html')
text = path.read_text()

# Visual system: B — Balanced Dark Glass.
replacements = {
    ':root{--bg:#0d1a26;--panel:rgba(28,49,65,.86);--panel2:rgba(35,58,74,.9);--rail:rgba(13,28,41,.95);--line:rgba(115,207,240,.19);--text:#edf9ff;--muted:#8da7b8;--cyan:#37cfff;--green:#45e8a0;--amber:#ffc868;--violet:#c2a1ff;--red:#ff7f8e;--shadow:0 22px 60px rgba(2,12,20,.25)}': ':root{--bg:#1b2a38;--panel:rgba(52,70,85,.90);--panel2:rgba(58,75,90,.91);--rail:rgba(20,34,47,.97);--line:rgba(190,219,234,.13);--text:#edf4f8;--muted:#a9bac5;--cyan:#68b9ff;--green:#62d99a;--amber:#efbd69;--violet:#b6a0e8;--red:#ff8490;--shadow:0 20px 54px rgba(5,14,22,.28)}',
    'body{margin:0;background:radial-gradient(circle at 78% 8%,rgba(55,207,255,.14),transparent 28%),radial-gradient(circle at 12% 82%,rgba(194,161,255,.09),transparent 34%),linear-gradient(145deg,#0b1722,#102536 48%,#0c1b28);': 'body{margin:0;background:radial-gradient(circle at 78% 8%,rgba(104,185,255,.075),transparent 30%),radial-gradient(circle at 12% 82%,rgba(98,217,154,.035),transparent 36%),linear-gradient(145deg,#182633,#213446 48%,#1a2b39);',
    'background:rgba(13,29,42,.95);border-bottom:1px solid rgba(255,255,255,.09);': 'background:rgba(27,43,56,.94);border-bottom:1px solid rgba(220,238,247,.09);',
    '.review small{color:#93adbd}': '.review small{color:#a9bac5}',
    '.rail{position:sticky;top:48px;height:calc(100vh - 48px);padding:16px 10px;background:linear-gradient(180deg,var(--rail),rgba(10,23,34,.91));border-right:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:9px;align-items:center}': '.rail{position:sticky;top:48px;height:calc(100vh - 48px);padding:16px 10px;background:linear-gradient(180deg,var(--rail),rgba(27,44,58,.95));border-right:1px solid rgba(220,238,247,.08);display:flex;flex-direction:column;gap:9px;align-items:center}',
    '.logo{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-weight:900;color:#d7f8ff;background:linear-gradient(135deg,rgba(55,207,255,.2),rgba(69,232,160,.11));border:1px solid rgba(55,207,255,.28)}': '.logo{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-weight:900;color:#e4f1f7;background:linear-gradient(135deg,rgba(104,185,255,.15),rgba(98,217,154,.07));border:1px solid rgba(135,194,238,.20)}',
    '.nav{border:1px solid transparent;background:transparent;color:#8ba7b8;border-radius:13px;padding:9px 12px;cursor:pointer;font-size:12px;white-space:nowrap}.nav b{display:inline;margin-right:6px;font-size:15px}.nav.active,.nav:hover{color:#bcefff;background:rgba(55,207,255,.09);border-color:rgba(55,207,255,.2)}': '.nav{width:100%;border:1px solid transparent;background:transparent;color:#9eb1bd;border-radius:13px;padding:9px 4px;cursor:pointer;font-size:11px;white-space:nowrap}.nav b{display:block;margin:0;font-size:18px}.nav.active,.nav:hover{color:#dcecff;background:rgba(104,185,255,.12);border-color:rgba(135,194,238,.18)}',
    '.main{padding:18px 25px 40px;': '.main{padding:22px 25px 40px;',
    '.rail .meta{writing-mode:vertical-rl;transform:rotate(180deg);letter-spacing:.08em}': '.rail .meta{text-align:center;line-height:1.5;color:#91a7b5}',
    '.glass{background:linear-gradient(180deg,var(--panel),rgba(20,39,54,.8));': '.glass{background:linear-gradient(180deg,var(--panel),rgba(42,59,73,.84));',
    '.btn{cursor:pointer;border:1px solid rgba(130,215,247,.22);background:rgba(255,255,255,.055);color:#c5e6f2;': '.btn{cursor:pointer;border:1px solid rgba(190,219,234,.13);background:rgba(255,255,255,.055);color:#c5d6df;',
    '.btn.primary{color:#06202b;background:linear-gradient(135deg,#4bd7ff,#48eca6);': '.btn.primary{color:#10202b;background:linear-gradient(135deg,#75c0ff,#73dda7);',
    '.calendar{padding:14px;border-radius:18px;background:linear-gradient(145deg,rgba(246,251,254,.99),rgba(226,241,248,.97));border:1px solid rgba(131,217,255,.38);color:#173447;box-shadow:0 16px 34px rgba(3,20,30,.18),inset 0 1px 0 #fff}': '.calendar{padding:14px;border-radius:18px;background:linear-gradient(145deg,#edf3f5,#dce7eb);border:1px solid rgba(183,213,226,.42);color:#263e4d;box-shadow:0 14px 34px rgba(7,19,28,.16),inset 0 1px 0 rgba(255,255,255,.72)}',
    '.overviewSupport{background:linear-gradient(180deg,var(--panel2),rgba(25,47,63,.86))}': '.overviewSupport{background:linear-gradient(180deg,var(--panel2),rgba(47,64,79,.86))}',
    '.seg{position:relative;padding:12px;border-radius:15px;background:rgba(20,40,55,.88);border:1px solid rgba(255,255,255,.085)}': '.seg{position:relative;padding:12px;border-radius:15px;background:rgba(45,62,76,.89);border:1px solid rgba(222,238,246,.085)}',
    'background:#173144;border:1px solid rgba(55,207,255,.25);': 'background:#2a3f50;border:1px solid rgba(135,194,238,.20);',
    '.player{position:fixed;right:22px;bottom:22px;width:min(680px,calc(100vw - 30px));background:#102536;border:1px solid rgba(55,207,255,.25);': '.player{position:fixed;right:22px;bottom:22px;width:min(680px,calc(100vw - 30px));background:#223646;border:1px solid rgba(135,194,238,.18);',
    '<span class="candidate">Stage 4 Cloud Acceptance · R4</span>': '<span class="candidate">Stage 4 Cloud Acceptance · B</span>',
    'Human feedback revision：主导航改为同一顶部水平栏 / 评论型 Preview': 'Human-selected B：中性暗色玻璃 / 左侧垂直导航 / 评论型 Preview',
}
for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'missing pattern: {old[:100]}')
    text = text.replace(old, new, 1)

# Remove the rejected horizontal top-nav CSS.
text, n = re.subn(r'\.topnav\{.*?\}\.topnav \.nav\{.*?\}', '', text, count=1, flags=re.S)
if n != 1:
    raise SystemExit('topnav CSS not found')

# Rebuild the primary desktop nav as the original left rail. The horizontal R4
# experiment is deliberately removed, not hidden.
vertical = '''<div class="app"><aside class="rail"><div class="logo">HV</div><button class="nav active" data-page="overview"><b>⌂</b>总览</button><button class="nav" data-page="archive"><b>▣</b>归档</button><button class="nav" data-page="analysis"><b>◫</b>分析</button><button class="nav" data-page="tasks"><b>⇄</b>任务</button><button class="nav" data-page="reviewPage"><b>◇</b>待复核</button><button class="nav" data-page="history"><b>⌁</b>记录</button><div class="spacer"></div><div class="meta">S4 B</div></aside><main class="main">'''
text, n = re.subn(r'<div class="app"><aside class="rail">.*?</aside><main class="main"><nav class="topnav".*?</nav>', vertical, text, count=1, flags=re.S)
if n != 1:
    raise SystemExit('horizontal primary nav DOM not found')

# Tone the calendar day surfaces down slightly to match B instead of near-white.
text = text.replace('background:rgba(255,255,255,.78);padding:7px;', 'background:rgba(255,255,255,.54);padding:7px;', 1)
text = text.replace('.day.unknown{background:rgba(244,248,251,.72);', '.day.unknown{background:rgba(234,240,243,.62);', 1)

assert '<nav class="topnav"' not in text
assert 'grid-template-columns:94px 1fr' in text
assert 'data-page="reviewPage"' in text
assert 'Human-selected B' in text
path.write_text(text)
print('rebuilt P16 Stage 4 helper as B + left vertical navigation')
