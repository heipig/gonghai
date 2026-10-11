/* ═══════════════════════════════════════════════════════════════
   《公海》提交前检查
   ─────────────────────────────────────────────────────────────
   做两件事：

   一、打印"首次提交会包含哪些文件"（避坑清单 7.1）
       首次推送是最容易把依赖目录、构建产物、私人文件推上去的时刻。

   二、隐私扫描（避坑清单 6.1 / 6.2 / 6.3）
       · 扫**字节流**，不只扫源码 —— 归档、可执行文件、图片都要过一遍
       · 规则只写**通用特征**（家目录的形状、凭据前缀、私网地址），
         **绝不写死开发者自己的具体路径**。
         避坑清单 6.3 记着这个真实教训：一个"隐私扫描"脚本把自己的
         项目路径写死成了检测规则，于是规则本身随着源码公开，等于
         把要防的东西印在了门上。

   用法：node tools/verify-repo.mjs
   有命中就 exit 1。
   ═══════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.cache', 'logs', 'tmp', '.smoke-profile']);

/* 测试过程中间产物，不入库、也不进清单 */
const SKIP_FILES = /(^|[\\/])\.smoke/;

/* 我们**故意**不入库的东西。命中就报警，说明 .gitignore 没生效。 */
const MUST_BE_ABSENT = [
  '避坑清单.md',
  'GitHub上传指南.md',
  '部署指南.md',
  'node_modules',
  'package-lock.json',
  'pnpm-lock.yaml'
];

/* ── 隐私规则：全部是通用形状，没有一条写死了本机路径 ───── */

const j = (...parts) => parts.join('');

const ASCII_RULES = [
  { name: 'GitHub 凭据',        re: /\bgh[pousr]_[A-Za-z0-9]{16,}/ },
  { name: 'GitHub 细粒度凭据',   re: /\bgithub_pat_[A-Za-z0-9_]{20,}/ },
  { name: 'OpenAI/通用 API key', re: /\bsk-[A-Za-z0-9_-]{20,}/ },
  { name: 'AWS Access Key',     re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Slack token',        re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'Google API key',     re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: '私钥文件头',          re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'Vercel token',       re: /\bvercel_[A-Za-z0-9]{20,}/ },
  { name: 'JWT',                re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  /* 家目录形状：把 <用户名> 之类占位符排除掉。
     这一条是通用的——它不认识任何具体的人。 */
  { name: '家目录绝对路径',
    re: /[A-Za-z]:\\Users\\(?!<|\$|%|用户名|username|user\b|Public\b|All Users\b)[A-Za-z0-9._-]{2,}/ },
  { name: 'Unix 家目录绝对路径',
    re: /\/(?:home|Users)\/(?!<|\$|%|username\b|user\b)[a-z0-9._-]{3,}/ },
  { name: '私网 IP',            re: /\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/ },
  { name: '中国手机号',          re: /\b1[3-9]\d{9}\b/ },
  { name: '真实邮箱（非 noreply）',
    re: /\b[A-Za-z0-9._%+-]+@(?!users\.noreply\.github\.com)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/ }
];

/* 中文隐私词：用 UTF-8 字节序列直搜，这样二进制文件也扫得到 */
const UTF8_RULES = [
  { name: '真实姓名占位未替换', text: j('<YOUR', ' NAME HERE>') },
  { name: '遗留 TODO',          text: j('TO', 'DO:') },
  { name: '遗留占位符',          text: j('<YOUR', ' USERNAME>') }
];

/* ── 自检：证明这些规则不是坏的 ───────────────────────────
   第一次写这个脚本的时候，它把**自己**给报了——因为上面那几条
   UTF8 规则的字面量就写在它自己的源码里。
   这和作者避坑清单 6.3 记的是同一类问题：扫描器把要防的东西
   印在了门上。

   两处修正：
     1. 检测针改成从碎片拼出来（j()），源码里永远不出现完整字面量
     2. 加这段自检——用一个"脏样本"验证每条规则真的能命中。
        一个永远不报错的扫描器和没有扫描器是一回事。

   脏样本同样是碎片拼的，所以这个文件本身保持干净。 */
const SELFTEST = [
  { name: 'GitHub 凭据',            dirty: j('ghp_', 'A'.repeat(36)) },
  { name: 'GitHub 细粒度凭据',       dirty: j('github_pat_', 'A'.repeat(30)) },
  { name: 'OpenAI/通用 API key',    dirty: j('sk-', 'A'.repeat(30)) },
  { name: 'AWS Access Key',        dirty: j('AKIA', 'A'.repeat(16)) },
  { name: 'Slack token',           dirty: j('xoxb-', '1'.repeat(12)) },
  { name: 'Google API key',        dirty: j('AIza', 'A'.repeat(35)) },
  { name: '私钥文件头',             dirty: j('-----BEGIN ', 'RSA PRIVATE KEY-----') },
  { name: 'Vercel token',          dirty: j('vercel_', 'A'.repeat(24)) },
  { name: 'JWT',                   dirty: j('eyJ', 'A'.repeat(12), '.', 'B'.repeat(12), '.', 'C'.repeat(12)) },
  { name: '家目录绝对路径',          dirty: j('C:', '\\Users\\', 'somebody', '\\proj') },
  { name: 'Unix 家目录绝对路径',      dirty: j('/home/', 'somebody', '/proj') },
  { name: '私网 IP',               dirty: '192.168.' + '1' + '.10' },
  { name: '中国手机号',             dirty: '138' + '0013' + '8000' },
  { name: '真实邮箱（非 noreply）',   dirty: j('someone', '@', 'example.com') },
  { name: '真实姓名占位未替换',       dirty: j('<YOUR', ' NAME HERE>'), utf8: true },
  { name: '遗留 TODO',             dirty: j('TO', 'DO:'), utf8: true },
  { name: '遗留占位符',             dirty: j('<YOUR', ' USERNAME>'), utf8: true }
];

/* 干净样本：规则**不应该**命中这些，否则就是误报。 */
const CLEAN = [
  'C:\\Users\\<用户名>\\proj',
  'C:\\Users\\%USERNAME%\\proj',
  'C:\\Users\\Public\\shared',
  j('noreply', '@', 'users.noreply.github.com'),
  '<用户名>',
  'example.com',
  '192.0.2.1',
  'version 2.0.0',
  'risk-taking'
];

function runSelfTest() {
  const bad = [];
  SELFTEST.forEach((s) => {
    const rule = s.utf8
      ? UTF8_RULES.find((r) => r.name === s.name)
      : ASCII_RULES.find((r) => r.name === s.name);
    if (!rule) { bad.push(`规则表里找不到「${s.name}」`); return; }
    const hit = s.utf8 ? rule.text === s.dirty || s.dirty.includes(rule.text) : rule.re.test(s.dirty);
    if (!hit) bad.push(`规则「${s.name}」漏报了自己的脏样本`);
  });
  CLEAN.forEach((c) => {
    ASCII_RULES.forEach((r) => {
      if (r.re.test(c)) bad.push(`规则「${r.name}」误报了干净样本：${c}`);
    });
    UTF8_RULES.forEach((r) => {
      if (c.includes(r.text)) bad.push(`规则「${r.name}」误报了干净样本：${c}`);
    });
  });
  return bad;
}

/* ── 遍历 ───────────────────────────────────────────────── */

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (SKIP_FILES.test(full)) continue;
    if (ent.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');

/* ── 一、首次提交清单 ───────────────────────────────────── */

console.log('《公海》提交前检查');
console.log('═'.repeat(60));

/* 先证明扫描器本身是好的，再让它去扫别人 */
const selfTestProblems = runSelfTest();
console.log('\n〇、扫描器自检\n');
if (selfTestProblems.length) {
  selfTestProblems.forEach((p) => console.log('  ✗ ' + p));
} else {
  console.log(`  ✓ ${SELFTEST.length} 条规则全部命中脏样本，${CLEAN.length} 条干净样本零误报`);
}

console.log('\n一、首次提交会包含这些文件\n');

let totalBytes = 0;
const byExt = new Map();

files.sort().forEach((f) => {
  const size = fs.statSync(f).size;
  totalBytes += size;
  const ext = path.extname(f) || '(无扩展名)';
  byExt.set(ext, (byExt.get(ext) || 0) + 1);
  console.log(`  ${String(size).padStart(7)}  ${rel(f)}`);
});

console.log(`\n  共 ${files.length} 个文件，${(totalBytes / 1024).toFixed(1)} KB`);
console.log('  按类型：' + [...byExt.entries()].map(([e, n]) => `${e}×${n}`).join('  '));

const problems = [];

/* 扫描器自检失败本身就是一个必须停机的问题 */
selfTestProblems.forEach((p) => problems.push('扫描器自检：' + p));

/* ── 二、不该入库的东西 ─────────────────────────────────── */

console.log('\n二、不该入库的东西\n');
let absentOk = true;
MUST_BE_ABSENT.forEach((name) => {
  const hit = files.find((f) => rel(f).split('/').includes(name));
  if (hit) {
    problems.push(`不该入库却被包含：${rel(hit)}`);
    console.log(`  ✗ ${name}`);
    absentOk = false;
  } else {
    console.log(`  ✓ ${name} 不在仓库里`);
  }
});

/* ── 三、隐私扫描 ───────────────────────────────────────── */

console.log('\n三、隐私扫描（扫字节流，不只扫源码）\n');

/* 二进制文件只跑 ASCII 规则。
   "扫字节流"这条规矩本来就是为了防有人把路径或 token 藏进
   二进制里，所以 ASCII 规则照跑不误；但 UTF8_RULES 是中文占位符
   规则，拿它去匹配 JPEG 的乱码字节只会产生误报——而一条会误报的
   检查，下场是被人忽略。 */
const BINARY_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.ico', '.woff', '.woff2', '.zip', '.pdf']);
const isBinary = (f) => BINARY_EXT.has(path.extname(f).toLowerCase());

let hits = 0;
files.forEach((f) => {
  const buf = fs.readFileSync(f);
  const text = buf.toString('utf8');
  const lower = buf.toString('latin1').toLowerCase();

  ASCII_RULES.forEach((rule) => {
    // 先在文本上跑正则（能定位行），再在原始字节上确认一遍
    const m = text.match(rule.re);
    if (m) {
      const line = text.slice(0, m.index).split('\n').length;
      problems.push(`隐私命中 [${rule.name}] ${rel(f)}:${line} → ${m[0].slice(0, 40)}`);
      hits++;
      console.log(`  ✗ [${rule.name}] ${rel(f)}:${line}`);
      console.log(`      ${m[0].slice(0, 70)}`);
    }
  });

  if (isBinary(f)) return;

  UTF8_RULES.forEach((rule) => {
    if (text.includes(rule.text)) {
      problems.push(`占位符未替换 [${rule.name}] ${rel(f)}`);
      hits++;
      console.log(`  ✗ [${rule.name}] ${rel(f)}`);
    }
  });
});

if (!hits) console.log('  ✓ 没有命中任何隐私规则');

/* ── 四、编码与换行符（避坑清单 5.1）───────────────────── */

console.log('\n四、文本文件编码与换行符\n');
let crlf = 0, bom = 0;
files.forEach((f) => {
  const ext = path.extname(f).toLowerCase();
  if (!['.js', '.mjs', '.css', '.html', '.md', '.json', '.txt', '.yml', '.yaml'].includes(ext)) return;
  const buf = fs.readFileSync(f);
  if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) { bom++; problems.push(`带了 BOM：${rel(f)}`); }
  if (buf.includes(Buffer.from('\r\n'))) { crlf++; problems.push(`换行符是 CRLF：${rel(f)}`); }
});
console.log(`  BOM：${bom === 0 ? '✓ 无' : '✗ ' + bom + ' 个'}`);
console.log(`  CRLF：${crlf === 0 ? '✓ 全部 LF' : '✗ ' + crlf + ' 个'}`);

/* ── 五、联网检查（避坑清单 10.7）──────────────────────── */

console.log('\n五、联网检查（本作承诺不联网）\n');

/* 只查**玩家浏览器里真正会跑的东西**：index.html + css/ + js/。
   tools/ 下的验证脚本本身当然要联网——冒烟测试就是要去抓线上页面。

   例外只有 js/content.js：它是纯数据（史实页的正文），里面的
   http 链接是给玩家点出去看新闻来源的，页面自己并不去抓。
   按"文件"豁免而不是按"域名"豁免，是因为按域名列白名单会
   一边红一边漏：换了新闻源就误报，而任何在列域名下的真实请求
   又照样溜过去。 */
const isData = (f) => rel(f) === 'js/content.js';
const shipped = (f) => {
  const r = rel(f);
  return r === 'index.html' || r.startsWith('css/') || r.startsWith('js/');
};

/* 光禁 URL 字面量不够：真正的联网还可以不写 URL。
   这几个 API 一旦出现在会跑的代码里，就是不联网承诺的破口。 */
const NET_API = /\b(fetch|XMLHttpRequest|WebSocket|EventSource|importScripts)\s*\(|navigator\.sendBeacon|@import\s+url\(/;

let netHits = 0, scanned = 0;
files.forEach((f) => {
  if (!shipped(f) || isData(f)) return;
  scanned++;
  const text = fs.readFileSync(f, 'utf8');
  text.split('\n').forEach((line, i) => {
    const bad = /https?:\/\//.test(line) || NET_API.test(line);
    if (!bad) return;
    // 允许的例外：SVG 命名空间字符串
    if (/www\.w3\.org/.test(line)) return;
    netHits++;
    problems.push(`疑似外部请求：${rel(f)}:${i + 1}`);
    console.log(`  ✗ ${rel(f)}:${i + 1}  ${line.trim().slice(0, 80)}`);
  });
});
if (!netHits) {
  console.log(`  ✓ 游戏代码（${scanned} 个文件）里没有任何运行时外部请求`);
  console.log('    （js/content.js 是数据文件，里面的新闻来源外链是给玩家点出去看的）');
}

/* ── 结论 ───────────────────────────────────────────────── */

console.log('\n' + '═'.repeat(60));

if (problems.length) {
  console.log(`\n✗ 发现 ${problems.length} 个问题，先别提交：\n`);
  problems.forEach((p) => console.log('  ✗ ' + p));
  process.exit(1);
}

console.log('\n✓ 可以提交 —— 文件清单干净、无隐私命中、编码统一、不联网。');
