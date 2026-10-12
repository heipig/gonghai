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
const SKIP_DIRS = new Set(['.git', 'node_modules', 'tools', 'notes']);
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

let bad = 0, checked = 0;
const netFail = [];
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex').slice(0, 12);

/* 取一个文件，失败重试几次。
   这是个网络工具，偶发的连接重置很常见。一次抖动就报"内容不一致"，
   和那些会骗人的测试是同一类错误——所以「取不到」和「内容不同」
   必须分开报，前者是**无法判定**，不是失败结论。 */
async function get(url, tries = 3) {
  let last = '未知';
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { redirect: 'follow' });
      if (r.ok) return { res: r };
      last = 'HTTP ' + r.status;
    } catch (e) { last = e.message; }
    await new Promise((s) => setTimeout(s, 1200 * (i + 1)));
  }
  return { err: last };
}

for (const rel of files) {
  const local = fs.readFileSync(path.join(ROOT, rel));
  const got = await get(BASE + rel + '?cb=' + Date.now());
  if (got.err) {
    console.log(`  ? ${rel.padEnd(24)} 取不到（已重试 3 次）：${got.err}`);
    netFail.push(rel);
    continue;
  }
  /* fetch 会自动解 gzip，所以比较的是解压后的真实字节。 */
  const remote = Buffer.from(await got.res.arrayBuffer());
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
  console.log(`✗ ${bad} 个文件内容与本地不一致（通过 ${checked} 个）`);
  process.exit(1);
}
if (netFail.length) {
  console.log(`? ${netFail.length} 个文件取不到 —— **无法判定**，不代表线上不一致：`);
  console.log('  ' + netFail.join('、'));
  console.log('  先重跑一次；持续失败再查 GitHub Pages 状态。');
  process.exit(1);
}
console.log(`✓ 全部 ${checked} 个文件在线上与本地逐字节一致`);
