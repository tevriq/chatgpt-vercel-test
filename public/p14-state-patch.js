(()=>{
  const $=s=>document.querySelector(s);
  const toolset=$('.toolset');
  if(toolset&&!$('#aiRunBtn')){
    const b=document.createElement('button');
    b.id='aiRunBtn'; b.className='tool'; b.textContent='✦ AI 整理';
    b.onclick=()=>{ if($('#editor')?.textContent.trim()) runAI(); else toast('先输入一些内容') };
    toolset.appendChild(b);
  }
  const syncBtn=$('#syncNow');
  if(syncBtn) syncBtn.onclick=()=>{
    if(offline){
      $('#syncNote').innerHTML='<b style="color:#a75f00">当前离线</b> · 所有修改已经安全保存在本机；联网后会自动继续。';
      toast('当前离线 · 没有丢失任何内容');
      return;
    }
    doSync();
  };
  const overlay=$('#overlay');
  if(overlay) overlay.onclick=()=>{
    if($('#sheet')?.classList.contains('show')) closeSheet(true);
    if($('#detail')?.classList.contains('show')) closeDetail();
    closePanels();
  };
  const editor=$('#editor');
  if(editor) editor.addEventListener('input',()=>{
    if(!editor.classList.contains('processing')) $('#draftLabel').textContent='输入完成后可让 AI 整理，再保存';
  });
})();
