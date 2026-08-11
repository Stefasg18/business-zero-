import { cp, mkdir, readdir, rm } from 'node:fs/promises';
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
console.log('Business Zero web bundle prepared in mobile/dist');
