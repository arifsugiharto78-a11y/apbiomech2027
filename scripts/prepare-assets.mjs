import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
const config = JSON.parse(readFileSync('src/data/conference.json', 'utf8'));
const input = `public/${config.banner}`;
mkdirSync('src/generated', {recursive:true});
let hero = null;
if (existsSync(input)) {
  const {width,height} = await sharp(input).metadata();
  await sharp(input).webp({quality:92}).toFile(input.replace(/\.png$/i,'.webp'));
  hero = {width,height,webp:config.banner.replace(/\.png$/i,'.webp')};
} else if (config.launchStatus === 'official') { throw new Error('Official launch requires the original committee-supplied conference banner.'); } else console.warn('Official banner not supplied. Showing an explicitly labelled text preview; no substitute banner is used.');
writeFileSync('src/generated/assets.json', JSON.stringify({hero}, null, 2));
