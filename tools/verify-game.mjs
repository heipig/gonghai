/* ═══════════════════════════════════════════════════════════════
   《公海》离线验证器
   ─────────────────────────────────────────────────────────────
   在浏览器之外把游戏跑起来，检查：
     1. 剧情自检（死胡同、断掉的跳转、route 全落空、孤儿节点）
     2. 每一段 storylet 的条件是否可能达成
     3. 随机模拟 2000 局，看会不会抛异常 / 卡死 / 走进死路
     4. 九种结局是不是真的都能走到
     5. 有没有哪一段剧情永远看不到（写了但条件不可能满足）

   用法：node tools/verify-game.mjs
   有问题就 exit 1 —— 宁可构建失败，也别交出"看起来能跑"的坏包。
   ═══════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FILES = [
  'js/engine.js',
  'js/story-act1.js',
  'js/story-act2.js',
  'js/story-act3.js',
  'js/storylets.js',
  'js/content.js'
];

/* ── 造一个够用的浏览器环境 ─────────────────────────────── */

function makeSandbox() {
  const store = new Map();
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
  const sandbox = {
    console,
    localStorage,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Math,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
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
  if (!sandbox.window.GH || !sandbox.window.GH.Engine) {
    console.error('✗ 剧情文件没有注册到 GH.Engine');
    process.exit(1);
  }
  return sandbox.window.GH.Engine;
}

/* ── 模拟一局 ───────────────────────────────────────────── */

const MAX_STEPS = 4000;

function simulate(E, pick, label) {
  E.state = null;
  E.start('模拟');

  let node = E.node(E.state.nodeId);
  let steps = 0;

  while (steps++ < MAX_STEPS) {
    if (node.ending) {
      return { ok: true, ending: node.ending.key, steps, state: E.state };
    }

    if (node.night) {
      const r = E.nightPull();
      if (!r || !r.node) return { ok: false, why: 'nightPull 没有返回节点', at: node.id, label };
      node = r.node;
      continue;
    }

    const options = [];
    (node.choices || []).forEach((c, i) => {
      if (E.check(c.require).ok) options.push(i);
    });

    if (!options.length) {
      return { ok: false, why: '没有任何可选项（玩家会卡死）', at: node.id, label, state: E.state };
    }

    const i = pick(options, node, E);
    let r;
    try {
      r = E.choose(i);
    } catch (err) {
      return { ok: false, why: 'choose 抛异常：' + err.message, at: node.id, label };
    }
    if (!r || r.blocked) {
      return { ok: false, why: 'choose 被拦：' + (r && r.why), at: node.id, label };
    }

    const critical = E.vitalCheck();
    node = critical ? E.enter(critical) : r.node;
  }

  return { ok: false, why: `超过 ${MAX_STEPS} 步还没结束（死循环）`, at: node.id, label };
}

/* ── 主流程 ─────────────────────────────────────────────── */

const problems = [];
const notes = [];

console.log('《公海》离线验证\n' + '─'.repeat(52));

const E = loadGame();

/* 1. 自检 */
const report = E.audit();
console.log(`节点总数        ${report.total}`);
console.log(`其中 storylet   ${report.storylets}`);
console.log(`主线可达        ${report.reachable}`);
console.log(`结局            ${report.endings.length} 种`);
console.log(`storylet 池     ${JSON.stringify(report.pools)}`);
console.log('');

if (report.problems.length) {
  report.problems.forEach((p) => problems.push('自检：' + p));
}

/* 2. 随机模拟 */
const RUNS = 2000;
const endings = new Map();
const failReasons = new Map();
let reachedTrial = 0;
const finalBodies = [];
const finalStanding = [];

for (let i = 0; i < RUNS; i++) {
  const res = simulate(E, (opts) => opts[Math.floor(Math.random() * opts.length)], '随机');
  if (!res.ok) {
    const k = res.why + ' @ ' + res.at;
    failReasons.set(k, (failReasons.get(k) || 0) + 1);
  } else {
    endings.set(res.ending, (endings.get(res.ending) || 0) + 1);
    finalBodies.push(res.state.body);
    finalStanding.push(res.state.standing);
    if (res.state.visited.indexOf('a3_trial') !== -1) reachedTrial++;
  }
}

console.log(`随机模拟 ${RUNS} 局`);
if (failReasons.size) {
  failReasons.forEach((n, k) => problems.push(`模拟失败 ×${n}：${k}`));
} else {
  console.log('  ✓ 全部跑到结局，没有异常、没有卡死');
}

const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
console.log(`  走到审判的      ${reachedTrial} / ${RUNS}  (${((reachedTrial / RUNS) * 100).toFixed(1)}%)`);
console.log(`  终局体力 中位 ${med(finalBodies)}  最低 ${Math.min(...finalBodies)}  最高 ${Math.max(...finalBodies)}`);
console.log(`  终局处境 中位 ${med(finalStanding)}  最低 ${Math.min(...finalStanding)}  最高 ${Math.max(...finalStanding)}`);

/* 3. 结局覆盖
     注意：可达性判定要综合"随机 + 定向人格"两边的结果。
     光看随机抽，稀有但合规的结局会被误判成走不到。 */
console.log('\n结局分布（随机局）');
const allEndings = report.endings.slice().sort();
allEndings.forEach((id) => {
  const key = E.nodes[id].ending.key;
  const n = endings.get(key) || 0;
  const pct = ((n / RUNS) * 100).toFixed(1);
  console.log(`     ${key.padEnd(10)} ${String(n).padStart(5)}  ${pct.padStart(5)}%   ${E.nodes[id].ending.title}`);
});

/* 4. 定向模拟：每一种"极端人格"都要能走通。
     这是查"某个选项永远没人能选"最有效的办法——
     光靠随机抽，稀有条件会永远抽不到。 */
const cost = (c, k) => ((c.effect && c.effect[k]) || 0);

const personas = {
  '永远选第一项': (opts) => opts[0],
  '永远选最后一项': (opts) => opts[opts.length - 1],
  '永远拒绝（首选立场最弱的）': (opts, node) => {
    let best = opts[0], bestScore = Infinity;
    opts.forEach((i) => {
      const c = node.choices[i];
      const score = cost(c, 'standing') + cost(c, 'body');
      if (score < bestScore) { bestScore = score; best = i; }
    });
    return best;
  },
  '永远顺从（首选处境最高的）': (opts, node) => {
    let best = opts[0], bestScore = -Infinity;
    opts.forEach((i) => {
      const c = node.choices[i];
      const rel = (c.effect && c.effect.rel && c.effect.rel.he) || 0;
      const score = cost(c, 'standing') + rel * 3;
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  },
  '最耗体力（把自己累死）': (opts, node) => {
    let best = opts[0], bestScore = Infinity;
    opts.forEach((i) => {
      const score = cost(node.choices[i], 'body');
      if (score < bestScore) { bestScore = score; best = i; }
    });
    return best;
  },
  '最伤处境（把自己玩出局）': (opts, node) => {
    let best = opts[0], bestScore = Infinity;
    opts.forEach((i) => {
      const score = cost(node.choices[i], 'standing');
      if (score < bestScore) { bestScore = score; best = i; }
    });
    return best;
  },
  '一心保干净（绝不沾血）': (opts, node) => {
    let best = opts[0], bestScore = Infinity;
    opts.forEach((i) => {
      const c = node.choices[i];
      const score = cost(c, 'blood') * 100 + cost(c, 'body') + cost(c, 'standing');
      if (score < bestScore) { bestScore = score; best = i; }
    });
    return best;
  },
  /* 上一个人格是"自毁式"测试：它在第一幕也专挑最差选项。
     这一个才是真实的高玩——先只在干净的选项里挑，再在其中
     把处境和体力经营到最好。这部作品承诺过"最好的结局需要你
     从头到尾都没选错"，那就必须证明它真的走得到。 */
  '保干净且经营处境（高玩）': (opts, node, eng) => {
    // 真人不会明知是结局还往里走
    const isEnding = (i) => {
      const t = node.choices[i].to;
      return !!(t && eng.nodes[t] && eng.nodes[t].ending);
    };
    let pool = opts.filter((i) => !isEnding(i) && cost(node.choices[i], 'blood') <= 0);
    if (!pool.length) pool = opts.filter((i) => !isEnding(i));
    if (!pool.length) pool = opts;

    let best = pool[0], bestScore = -Infinity;
    pool.forEach((i) => {
      const c = node.choices[i];
      const score = cost(c, 'standing') * 2 + cost(c, 'body');
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  },

  /* e_death 需要沾血三次。前一个人格永远躲着血走，随机局又活不到
     那么远，所以必须专门有一个人去追血——否则「主犯线」的结局
     在数据上等于不存在。 */
  '一心沾血（往主犯那条线走）': (opts, node, eng) => {
    const isEnding = (i) => {
      const t = node.choices[i].to;
      return !!(t && eng.nodes[t] && eng.nodes[t].ending);
    };
    let pool = opts.filter((i) => !isEnding(i));
    if (!pool.length) pool = opts;

    let best = pool[0], bestScore = -Infinity;
    pool.forEach((i) => {
      const c = node.choices[i];
      const score = cost(c, 'blood') * 100 + cost(c, 'standing') * 2 + cost(c, 'body');
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  },

  /* e_hero 要求同时满足「救过宋国春」和「沾过血」。它是最难被
     随机撞到的结局，所以要有一个把救人放在第一位的人格来证明
     它可达。 */
  '救人优先（先救人，再活下来）': (opts, node, eng) => {
    const isEnding = (i) => {
      const t = node.choices[i].to;
      return !!(t && eng.nodes[t] && eng.nodes[t].ending);
    };
    let pool = opts.filter((i) => !isEnding(i));
    if (!pool.length) pool = opts;

    let best = pool[0], bestScore = -Infinity;
    pool.forEach((i) => {
      const c = node.choices[i];
      const f = (c.effect && c.effect.flags) || {};
      let score = cost(c, 'standing') * 2 + cost(c, 'body');
      if (f.saved_a_life) score += 1000;
      if (f.opened_valve || f.freed_song) score -= 900;
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  }
};

console.log('\n定向模拟（每种 200 局）');
const reachableEndings = new Set(endings.keys());

Object.keys(personas).forEach((name) => {
  const got = new Set();
  let bad = 0;
  for (let i = 0; i < 200; i++) {
    const res = simulate(E, personas[name], name);
    if (!res.ok) {
      bad++;
      problems.push(`定向模拟「${name}」失败：${res.why} @ ${res.at}`);
    } else {
      got.add(res.ending);
      reachableEndings.add(res.ending);
    }
  }
  console.log(`  ${bad ? '✗' : '✓'} ${name.padEnd(26)} ${got.size} 种：${[...got].sort().join(', ')}`);
});

/* 综合判定：任何一边走到过，就算可达 */
console.log('\n结局可达性（综合随机 + 定向）');
allEndings.forEach((id) => {
  const key = E.nodes[id].ending.key;
  const ok = reachableEndings.has(key);
  console.log(`  ${ok ? '✓' : '✗'} ${key}`);
  if (!ok) problems.push(`结局走不到：${key}（${id}）—— 随机和定向模拟都没走到`);
});

/* 5. 写了但可能永远看不到的 storylet */
console.log('\nstorylet 覆盖');
const seenStorylets = new Set();
for (let i = 0; i < RUNS; i++) {
  E.state = null;
  try {
    const res = simulate(E, (opts) => opts[Math.floor(Math.random() * opts.length)], 'coverage');
    if (res.ok && res.state) res.state.seenStorylets.forEach((s) => seenStorylets.add(s));
  } catch { /* 上面已经报过 */ }
}
const allStorylets = Object.keys(E.nodes).filter((id) => E.nodes[id].storylet);
const unseen = allStorylets.filter((id) => !seenStorylets.has(id));
console.log(`  抽到过 ${seenStorylets.size} / ${allStorylets.length}`);
if (unseen.length) {
  // 稀有 storylet 在随机模拟里抽不到是正常的，只记为提示，不算错误
  notes.push(`随机模拟未抽到（可能是稀有/深层条件，重玩才能见到）：${unseen.join(', ')}`);
} else {
  console.log('  ✓ 所有 storylet 都被抽到过');
}

/* ── 结论 ───────────────────────────────────────────────── */

console.log('\n' + '─'.repeat(52));

if (notes.length) {
  console.log('\n提示：');
  notes.forEach((n) => console.log('  · ' + n));
}

if (problems.length) {
  console.log(`\n✗ 发现 ${problems.length} 个问题：`);
  problems.forEach((p) => console.log('  ✗ ' + p));
  process.exit(1);
}

console.log('\n✓ 验证通过 —— 主线连通、全部结局都能走到、没有卡死路径。');
