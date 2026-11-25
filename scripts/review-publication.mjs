import {readdirSync,readFileSync,lstatSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const excluded=new Set(['.git','node_modules','dist','.astro','work','.openai','.codex']);
const records=[];const findings=[];
function walk(dir){for(const name of readdirSync(dir)){
 const absolute=path.join(dir,name);const relative=path.relative(root,absolute).replaceAll('\\','/');
 if(excluded.has(name))continue;
 const stat=lstatSync(absolute);
 if(stat.isSymbolicLink()){findings.push(`${relative}: symbolic link needs review`);continue;}
 if(stat.isDirectory()){walk(absolute);continue;}
 if(/^\.env(?:\.|$)/.test(name)&&name!=='.env.example'||/\.(?:pem|key|p12|pfx|zip|docx?|xlsx?|pptx?)$/i.test(name)||['.npmrc','.netrc','.git-credentials','hosts.yml'].includes(name)){findings.push(`${relative}: sensitive or unnecessary file`);continue;}
 if(stat.size>20*1024*1024)findings.push(`${relative}: oversized publication file`);
 records.push({path:relative,bytes:stat.size});
 if(/\.(?:astro|mjs|ts|gs|json|md|yml|yaml|css|txt|example|svg)$/.test(name)||name==='.gitignore'){
  const source=readFileSync(absolute,'utf8');
  const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{30,}\b/,/\bAKIA[A-Z0-9]{16}\b/,/https:\/\/[^\s/]+:[^\s/@]+@/,/\b(?:password|api[_-]?key|client[_-]?secret)\s*[:=]\s*["'][^"']{12,}["']/i];
  if(patterns.some(pattern=>pattern.test(source)))findings.push(`${relative}: possible secret pattern (value withheld)`);
 }
}}
walk(root);
records.sort((a,b)=>a.path.localeCompare(b.path));
console.log(`Publication inventory: ${records.length} files; ${records.reduce((sum,item)=>sum+item.bytes,0)} bytes. Dependencies, build output, caches, work files, credentials, and archives excluded.`);
if(findings.length){console.error(findings.join('\n'));process.exitCode=1;}else console.log('No credential patterns or confidential office documents found in the proposed publication set. Review is heuristic and includes the listed public conference content.');
if(process.env.PUBLICATION_MANIFEST)writeFileSync(process.env.PUBLICATION_MANIFEST,JSON.stringify({root,files:records,findings},null,2));
