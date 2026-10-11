/* ═══════════════════════════════════════════════════════════════
   《公海》配图清单生成器
   ─────────────────────────────────────────────────────────────
   从剧情数据里读出所有配图状态，生成 tools/image-slots.md：
     · 已经配图的节点，以及图片文件在不在
     · 还没配图的「配图位」，连同节点上下文和该画什么

   清单是**推导出来的**，不是手写的——改了剧情再跑一次就同步了，
   不会出现"文档说的和代码里的不一样"。

   用法：node tools/image-slots.mjs
         node tools/image-slots.mjs --check   # 只检查，有缺图就 exit 1
   ═══════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_ONLY = process.argv.includes('--check');

const FILES = [
  'js/engine.js',
  'js/story-act1.js',
  'js/story-act2.js',
  'js/story-act3.js',
  'js/storylets.js',
  'js/content.js'
];

/* 和 verify-game.mjs 用同一套沙箱，行为保持一致 */
function makeSandbox() {
  const store = new Map();
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear()
    },
    setTimeout, clearTimeout, setInterval, clearInterval,
    Math, Date, JSON, Array, Object, String, Number,
    document: { addEventListener() {}, querySelector: () => null },
    matchMedia: () => ({ matches: false })
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function loadGame() {
  const sandbox = makeSandbox();
  for (const f of FILES) {
    const full = path.join(ROOT, f);
    if (!fs.existsSync(full)) {
      console.error(`✗ 缺少文件：${f}`);
      process.exit(1);
    }
    vm.runInContext(fs.readFileSync(full, 'utf8'), sandbox, { filename: f });
  }
  return sandbox.window.GH.Engine;
}

const E = loadGame();
const ids = Object.keys(E.nodes);

/* 正文第一句拿来做上下文——写配图需求的时候最需要的就是这个 */
function firstLine(node) {
  const t = (node.text || []).find((it) => {
    const s = typeof it === 'string' ? it : it.t;
    return s && s !== '{{log}}' && s.length > 1;
  });
  if (!t) return '';
  const s = typeof t === 'string' ? t : t.t;
  return s.length > 42 ? s.slice(0, 42) + '…' : s;
}

const withImg = [];
const slots = [];
const broken = [];

for (const id of ids) {
  const n = E.nodes[id];
  if (n.img) {
    const rel = n.img;
    const exists = fs.existsSync(path.join(ROOT, rel));
    let kb = 0;
    if (exists) kb = Math.round(fs.statSync(path.join(ROOT, rel)).size / 1024);
    withImg.push({ id, n, rel, exists, kb });
    if (!exists) broken.push(`${id} → ${rel}`);
  }
  if (n.imgSlot) slots.push({ id, n });
}

withImg.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
slots.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

/* 同一张图会被多个节点引用（比如 court.jpg 既在审判、又在死刑结局），
   算总体积要去重，否则报出来的数字是假的。 */
const uniqueFiles = new Map();
withImg.forEach((r) => {
  if (r.exists && !uniqueFiles.has(r.rel)) uniqueFiles.set(r.rel, r.kb);
});
const uniqueKb = [...uniqueFiles.values()].reduce((a, b) => a + b, 0);

/* ── 报告 ──────────────────────────────────────────────── */

console.log('《公海》配图清单');
console.log('─'.repeat(52));
console.log(`已配图节点   ${withImg.length}`);
console.log(`其中独立图片 ${uniqueFiles.size} 张`);
console.log(`待补配图位   ${slots.length}`);
console.log(`图片总体积   ${uniqueKb} KB`);
if (broken.length) {
  console.log('');
  broken.forEach((b) => console.log(`  ✗ 引用了不存在的图：${b}`));
}

/* ── 写清单 ────────────────────────────────────────────── */

const L = [];
L.push('# 《公海》配图清单');
L.push('');
L.push('> 这个文件由 `node tools/image-slots.mjs` 自动生成，**不要手改**。');
L.push('> 改完剧情重跑一次即可同步。');
L.push('');
L.push(`- 已配图：**${uniqueFiles.size} 张**（约 ${uniqueKb} KB），被 ${withImg.length} 个节点引用`);
L.push(`- 待补配图位：**${slots.length} 处**`);
L.push('');
L.push('游戏里在网址后面加 `?slots=1`，就能看到所有待补位置在剧情中的实际样子。');
L.push('');

L.push('## 一、已配图');
L.push('');
L.push('| 节点 | 幕 | 地点 | 日期 | 图片 | 大小 |');
L.push('| --- | --- | --- | --- | --- | --- |');
withImg.forEach(({ n, rel, exists, kb }) => {
  const mark = exists ? '' : ' ⚠️**缺失**';
  L.push(`| \`${n.id}\` | ${n.act || ''} | ${n.place || ''} | ${n.date || ''} | \`${rel}\`${mark} | ${exists ? kb + ' KB' : '—'} |`);
});
L.push('');

L.push('## 二、待补配图位');
L.push('');
L.push('每一处都写清楚了它在剧情里的位置和该画什么。');
L.push('按「这一段在讲什么」排，不按戏份轻重。');
L.push('');
slots.forEach(({ n }, i) => {
  L.push(`### ${i + 1}. \`${n.id}\`${n.img && n.img !== true ? '' : ''}`);
  L.push('');
  L.push(`- **位置**：${[n.act, n.place, n.date].filter(Boolean).join(' · ') || '（无）'}`);
  if (firstLine(n)) L.push(`- **这一段开头是**：${firstLine(n)}`);
  L.push(`- **该画什么**：${n.imgSlot}`);
  L.push('');
});

fs.writeFileSync(path.join(ROOT, 'tools/image-slots.md'), L.join('\n'), 'utf8');
console.log('');
console.log(`→ 已写入 tools/image-slots.md`);

if (CHECK_ONLY && broken.length) process.exit(1);
