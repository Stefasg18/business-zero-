import { cp, mkdir, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const mobileDir = resolve(process.cwd());
const repoRoot = resolve(mobileDir, '..');
const dist = join(mobileDir, 'dist');
const skip = new Set(['.git','.github','mobile','node_modules','android','ios']);

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});

for (const entry of await readdir(repoRoot,{withFileTypes:true})) {
  if (skip.has(entry.name)) continue;
  const src=join(repoRoot,entry.name),dst=join(dist,entry.name);
  if(entry.isDirectory()) await cp(src,dst,{recursive:true});
  else await cp(src,dst);
}

// Store build is a free standalone version: no Telegram login and no purchases.
await cp(join(mobileDir,'store-free-v1.js'),join(dist,'store-free-v1.js'));

const bootPath=join(dist,'boot-v565.js');
let boot=await readFile(bootPath,'utf8');
boot=boot.replace(
  "window.BZ_CONFIG={API_BASE:'https://business-zero-backend.onrender.com',BOT_USERNAME:'BusinessZeroGameBot'}",
  "window.BZ_CONFIG={API_BASE:'',BOT_USERNAME:''};window.BZ_STORE_BUILD=true;window.BZ_STORE_FREE=true"
);
boot=boot.replace(
  "'party-games-v567.js','nav-badges-v568.js'];",
  "'party-games-v567.js','nav-badges-v568.js','store-free-v1.js'];"
);
boot=boot.replace(
  "q('Подключаю Telegram…');try{await loadExternalScript('https://telegram.org/js/telegram-web-app.js?63',5000)}catch(e){remember(e)}if(!await waitForTelegramData(7000))remember('Telegram initData не получен');enforceVersion();",
  "q('Запускаю локальную версию…');enforceVersion();"
);
boot=boot.replace(
  "else if(mode&&txt==='ЗАГРУЗКА'){mode.textContent='TG ERROR';mode.classList.remove('online')}",
  "else if(mode){mode.textContent='ЛОКАЛЬНО';mode.classList.remove('online')}"
);
await writeFile(bootPath,boot,'utf8');

console.log('Business Zero FREE standalone bundle prepared in mobile/dist');
