import { createHash } from 'node:crypto';
import { cp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = new URL('../public/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const hash = createHash('sha256');
const files = await readdir(source, { recursive: true, withFileTypes: true });
const paths = files.filter(file => file.isFile()).map(file => join(file.parentPath, file.name)).sort();
for (const path of paths) {
  hash.update(relative(fileURLToPath(source), path)).update(await readFile(path));
}
await rm(dist, { recursive: true, force: true });
await cp(source, dist, { recursive: true });
const worker = new URL('sw.js', dist);
await writeFile(worker, (await readFile(worker, 'utf8')).replace('__BUILD_HASH__', hash.digest('hex').slice(0, 16)));
console.log('WalletWise built in dist/');
