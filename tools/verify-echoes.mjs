/* ═══════════════════════════════════════════════════════════════
   《公海》回声一致性检查
   ─────────────────────────────────────────────────────────────
   回声 = 「点完一个选项，下一页第一行应一声」。

   它有两种写法，本工具查的就是**有没有用错那一种**：

     ✓ 挂在选项上： { label: '…', to: 'Q', echo: '你说不参加，他就把刀收了回去。' }
     ✗ 写成下一页的条件行：
         选项1 → flag A
         选项2 → flag B
         选项3 → 不设 flag
         Q.text 里 { if: {flag:'A'} } / { if: {flag:'B'} } / { unless: … 兜底 }

   后者有个结构性的坑：**用 unless 当"否则"兜底，它在所有其他分支上
   同时成立**。于是选选项 2，会同时看到"选项 3 的兜底"和"自己的回声"。

   判定规则：
     · Q 里某条条件行，如果它的守卫引用了**上一层节点 P 的选项所设的 flag**，
       那它就是"选项的回应"，应该搬到选项的 echo 上 → 报「该迁移」
     · 一个选项的 echo 多于一条 → 报「重叠」
     · 落点 Q 里也有这种条件行、选项自己又带了 echo → 报「双份」

   用法：node tools/verify-echoes.mjs
   ═══════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILES = [
  'js/engine.js', 'js/story-act1.js', 'js/story-act2.js',
  'js/story-act3.js', 'js/storylets.js', 'js/content.js'
];

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
  for (const f of FILES) {
    const full = path.join(ROOT, f);
    if (!fs.existsSync(full)) { console.error(`✗ 缺少文件：${f}`); process.exit(1); }
    vm.runInContext(fs.readFileSync(full, 'utf8'), sandbox, { filename: f });
  }
  return sandbox;
}

const E = makeSandbox().window.GH.Engine;
const N = E.nodes;
const textOf = (it) => (typeof it === 'string' ? it : it.t);
const guardOf = (it) => (typeof it === 'string' ? null : (it.if || it.unless));
const clip = (s, n = 34) => (String(s).length > n ? String(s).slice(0, n) + '…' : String(s));
const guardSig = (it) => {
  const g = guardOf(it);
  if (!g) return 'plain';
  return (it.if ? 'if:' : 'unless:') + JSON.stringify(g).replace(/[{}"]/g, '');
};

/* 一个选项 effect 里设了哪些 flag（值为真） */
function flagsSetBy(c) {
  const f = (c.effect && c.effect.flags) || {};
  return Object.keys(f).filter((k) => f[k]);
}
/* 一个守卫引用到了哪些 flag */
function flagsIn(g) {
  if (!g) return [];
  const out = [];
  if (g.flag) out.push(g.flag);
  if (g.noFlag) out.push(g.noFlag);
  (g.anyOf || []).forEach((k) => out.push(k));
  (g.noneOf || []).forEach((k) => out.push(k));
  return out;
}

/* ── 扫描 ──────────────────────────────────────────────── */

const problems = [];
const rowsAll = [];

for (const pid of Object.keys(N)) {
  const P = N[pid];
  if (P.storylet || P.ending || P.night || P.route) continue;
  if (!(P.choices || []).length) continue;

  /* 这个节点的**所有**选项合起来设了哪些 flag */
  const anyFlag = new Set();
  P.choices.forEach((c) => flagsSetBy(c).forEach((k) => anyFlag.add(k)));

  P.choices.forEach((c, k) => {
    if (!c.to || !N[c.to]) return;
    const Q = N[c.to];

    /* Q 里哪些条件行的守卫引用了本层选项设的 flag —— 那是"选项的回应" */
    const leftover = (Q.text || []).filter((it) => {
      const g = guardOf(it);
      if (!g) return false;
      return flagsIn(g).some((f) => anyFlag.has(f));
    });

    rowsAll.push({
      pid, k, label: c.label, q: Q.id,
      echo: c.echo || null,
      leftover,
      n: (c.echo ? 1 : 0) + leftover.length
    });

    if (leftover.length) {
      problems.push({
        kind: '该迁移', pid, k, q: Q.id, label: c.label,
        lines: leftover.map((it) => clip(textOf(it)) + '  [' + guardSig(it) + ']'),
        hasEcho: !!c.echo
      });
    }
    if (c.echo && leftover.length) {
      problems.push({
        kind: '双份', pid, k, q: Q.id, label: c.label,
        lines: leftover.map((it) => clip(textOf(it)) + '  [' + guardSig(it) + ']')
      });
    }
  });
}

/* ── 输出 ──────────────────────────────────────────────── */

const withEcho = rowsAll.filter((r) => r.echo).length;
console.log('《公海》回声一致性检查');
console.log('═'.repeat(64));
console.log(`转移总数（选项 → 下一页）：${rowsAll.length}`);
console.log(`带 echo 的选项：${withEcho}  (${((withEcho / rowsAll.length) * 100).toFixed(0)}%)`);
console.log('');
console.log('说明：剩下的那些没有 echo 的转移，是下一页本身就在讲新场景，');
console.log('      不需要回应——只要它没有"该迁移"的旧条件行就算干净。');
console.log('');

const uniq = [...new Set(problems.map((p) => p.kind))];
if (!problems.length) {
  console.log('✓ 回声没有串台：没有旧式条件行、没有重叠、没有双份。');
  process.exit(0);
}

console.log(`✗ 发现 ${problems.length} 处问题（${uniq.join(' / ')}）：\n`);
problems.forEach((p) => {
  console.log(`  ✗ [${p.kind}] ${p.pid} 第 ${p.k + 1} 个选项「${clip(p.label, 22)}」 → ${p.q}`);
  p.lines.forEach((l) => console.log(`        · ${l}`));
});
process.exit(1);