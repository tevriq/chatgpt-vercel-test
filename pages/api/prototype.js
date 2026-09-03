import fs from 'fs';
import path from 'path';

export default function handler(req,res){
  const file=path.join(process.cwd(),'index.html');
  const bars='<i></i>'.repeat(24);
  const html=fs.readFileSync(file,'utf8')
    .replace("${'<i></i>'.repeat(24)}", bars)
    .replace('</body>','<script src="/p14-state-patch.js"></script></body>');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.status(200).send(html);
}
