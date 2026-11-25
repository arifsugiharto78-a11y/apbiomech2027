import conference from '../data/conference.json';
import type {APIRoute} from 'astro';
export const GET:APIRoute=({site})=>new Response(`User-agent: *\n${conference.launchStatus==='official'?'Allow: /':'Disallow: /'}\nSitemap: ${new URL(`${import.meta.env.BASE_URL.replace(/^\//,'')}sitemap-index.xml`,site).href}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
