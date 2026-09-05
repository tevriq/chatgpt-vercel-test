from pathlib import Path

p = Path('public/p16-s4-cloud-acceptance.html')
text = p.read_text(encoding='utf-8')
old = "function go(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));window.scrollTo({top:0,behavior:'auto'});location.hash=id;if(id==='archive')renderArchive()}"
new = "function go(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));history.replaceState(null,'',`#${id}`);window.scrollTo({top:0,behavior:'auto'});if(id==='archive')renderArchive()}"
if old not in text:
    raise SystemExit('target nav function not found')
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')
print('fixed hash-induced scroll')
