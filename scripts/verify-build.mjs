import {readFileSync,readdirSync,existsSync,statSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const base=`/${(process.env.BASE_PATH||'/apbiomech2027/').split('/').filter(Boolean).join('/')}/`.replace('//','/');
const root=path.resolve('dist');
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
const files=walk(root);const html=files.filter(file=>file.endsWith('.html'));const errors=[];
const config=JSON.parse(readFileSync('src/data/conference.json','utf8'));
for(const file of html){
 const source=readFileSync(file,'utf8');
 if(!/<html[^>]*lang="en"/.test(source))errors.push(`${file}: missing English language attribute`);
 if((source.match(/<h1[\s>]/g)||[]).length!==1)errors.push(`${file}: expected one semantic h1`);
 if(config.launchStatus!=='official'&&!/name="robots" content="noindex, nofollow"/.test(source))errors.push(`${file}: missing preview noindex`);
 if(config.launchStatus!=='official'&&config.preview?.enabled&&!source.includes(config.preview.message))errors.push(`${file}: missing committee-review notification`);
 for(const match of source.matchAll(/\b(?:href|src|srcset)="([^"]+)"/g)){
   const value=match[1];if(!value||/^(?:https?:|mailto:|tel:|data:|#)/.test(value))continue;
   for(const item of value.split(',')){
     const link=item.trim().split(/\s+/)[0];
     if(link.startsWith('/')&&!link.startsWith(base)){errors.push(`${file}: ignores base path: ${link}`);continue;}
     const bare=decodeURIComponent(link.split(/[?#]/)[0]);
     const target=bare.startsWith('/')?path.join(root,bare.slice(base.length)):path.resolve(path.dirname(file),bare);
     if(!existsSync(target)||statSync(target).isDirectory()&&!existsSync(path.join(target,'index.html')))errors.push(`${file}: missing local target: ${link}`);
     const hash=link.includes('#')?link.split('#')[1]:null;
     if(hash&&existsSync(target)){const targetFile=statSync(target).isDirectory()?path.join(target,'index.html'):target;if(targetFile.endsWith('.html')&&!readFileSync(targetFile,'utf8').includes(`id="${hash}"`))errors.push(`${file}: missing anchor: ${link}`);}
   }
 }
 for(const match of source.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g))if(match[1]==='#')errors.push(`${file}: dummy href`);
}
for(const file of files.filter(file=>file.endsWith('.css'))){
 const css=readFileSync(file,'utf8');
 for(const match of css.matchAll(/url\((["']?)([^"')]+)\1\)/g)){
  const url=match[2];if(/^(?:data:|https?:)/.test(url))continue;
  if(url.startsWith('/')&&!url.startsWith(base)){errors.push(`${file}: CSS URL ignores base: ${url}`);continue;}
  const bare=decodeURIComponent(url.split(/[?#]/)[0]);
  const target=bare.startsWith('/')?path.join(root,bare.slice(base.length)):path.resolve(path.dirname(file),bare);
  if(!existsSync(target))errors.push(`${file}: missing CSS font/image: ${url}`);
 }
}
if(!existsSync('dist/sitemap-index.xml'))errors.push('Missing sitemap index');
if(!existsSync('dist/404.html'))errors.push('Missing GitHub Pages custom 404');
const sitemap=readFileSync('dist/sitemap-0.xml','utf8');
for(const file of html.filter(f=>!f.endsWith('404.html'))){const relative=path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,'');if(!sitemap.includes(`${base}${relative}`))errors.push(`Missing sitemap route ${relative}`);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Verified ${html.length} static HTML pages: internal links, assets, anchors, base paths, headings, preview noindex, sitemap, and 404.`);
if(process.env.VERIFICATION_REPORT)writeFileSync(process.env.VERIFICATION_REPORT,JSON.stringify({pages:html.length,base,passed:true},null,2));
