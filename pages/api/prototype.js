import fs from 'fs';
import path from 'path';

export default function handler(req,res){
  const file=path.join(process.cwd(),'index.html');
  const html=fs.readFileSync(file,'utf8');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.status(200).send(html);
}
