/* ═══════════════════════════════════════════════════════════════
   《公海》线上内容校验
   ─────────────────────────────────────────────────────────────
   为什么需要这个，而不是直接用 smoke.mjs --live：

   无头浏览器在受限网络环境下**连不上外网**。这时候 --live 会报
   「GH.Engine 没有挂上 window」——听起来像线上 JS 坏了，其实只是
   浏览器出不去。这个假警报足够让人去改本来没坏的代码。

   所以线上验证拆成两件互不依赖的事：

     · smoke.mjs            本地无头浏览器 → 验**行为**（DOM、存档、结局页）
     · verify-live.mjs      本文件         → 验**部署内容**（逐个字节）

   两件都过，才有资格说"线上是好的"。浏览器能不能上网不该影响第二件。

   用法：
     node tools/verify-live.mjs [url]
   默认 url 是 https://heipig.github.io/gonghai/
   ═══════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'https://heipig.github.io/gonghai/').replace(/\/?$/, '/');

/* 只校验真正会被浏览器取的文件。.git / 临时文件 / 开发工具里的 md 不算。 */
const SKIP_DIRS = new Set(['.git', 'node_modules', 'tools']);
const SKIP_FILES = new Set(['.smoke.html', 'tools/image-slots.md']);

function walk(dir, rel = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      out.push(...walk(path.join(dir, e.name), r));
    } else {
      if (SKIP_FILES.has(r)) continue;
      if (e.name.startsWith('.') && e.name !== '.nojekyll') continue;
      out.push(r);
    }
  }
  return out;
}

/* tools/ 整个跳过了，但 tools/image-slots.md 是产物也不发布，正好。
   注意 README/DEVELOPING 是要发布的——Pages 会把它们当静态文件送出去。 */
const files = walk(ROOT).sort();

console.log('《公海》线上内容校验');
console.log('═'.repeat(60));
console.log(`线上：${BASE}`);
console.log(`本地：${ROOT}`);
console.log(`待校验：${files.length} 个文件\n`);

let bad = 0, checked = 0, skipped = 0;
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 12);

for (const rel of files) {
  const local = fs.readFileSync(path.join(ROOT, rel));
  let res;
  try {
    res = await fetch(BASE + rel + '?cb=' + Date.now(), { redirect: 'follow' });
  } catch (e) {
    console.log(`  ✗ ${rel.padEnd(24)} 取不到：${e.message}`);
    bad++;
    continue;
  }
  if (!res.ok) {
    console.log(`  ✗ ${rel.padEnd(24)} HTTP ${res.status}`);
    bad++;
    continue;
  }
  /* fetch 会自动解 gzip，所以比较的是解压后的真实字节。 */
  const remote = Buffer.from(await res.arrayBuffer());
  if (remote.equals(local)) {
    checked++;
    console.log(`  ✓ ${rel.padEnd(24)} ${String(local.length).padStart(7)} B  ${sha(local)}`);
  } else {
    bad++;
    console.log(`  ✗ ${rel.padEnd(24)} 本地 ${local.length} B / 远端 ${remote.length} B` +
                `  ${sha(local)} vs ${sha(remote)}`);
    /* 二进制被当成文本存，是这里最容易出的事故，单独点出来。 */
    const looksB64 = remote.length > local.length &&
                     /^[A-Za-z0-9+/=\r\n]+$/.test(remote.slice(0, 400).toString('latin1'));
    if (looksB64) console.log('      ↑ 远端像是 base64 文本，不是原始二进制');
  }
}

console.log('\n' + '─'.repeat(60));
if (bad) {
  console.log(`✗ ${bad} 个文件与本地不一致（通过 ${checked} 个）`);
  process.exit(1);
}
console.log(`✓ 全部 ${checked} 个文件在线上与本地逐字节一致`);
