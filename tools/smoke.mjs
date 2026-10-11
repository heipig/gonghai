/* ═══════════════════════════════════════════════════════════════
   《公海》浏览器冒烟测试
   ─────────────────────────────────────────────────────────────
   verify-game.mjs 只测引擎，测不到 DOM。这个用无头 Edge 真的把
   页面打开，真的点按钮，真的走完一局，然后把结果写进 DOM，
   再用 --dump-dom 取回来。

   测的是那些只有真浏览器才暴露的问题：
     · app.js 有没有抛异常
     · 打字机、选项渲染、结局页、浮层能不能正常工作
     · localStorage 在 file:// 下会不会炸
     · 音频初始化失败会不会拖垮整个游戏

   用法：
     node tools/smoke.mjs                          测本地文件
     node tools/smoke.mjs --live                   测线上部署
     node tools/smoke.mjs --live https://x/y/      测指定的线上地址

   测线上时用**线上那一份 index.html**，只把相对资源路径改成绝对
   地址——所以连"服务器上的 HTML 对不对"一起验证了。本地跑通不等于
   线上跑通，这一步不能省。
   ═══════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.join(ROOT, 'tools', '.smoke.html');
const PROFILE = path.join(ROOT, 'tools', '.smoke-profile');

const BROWSERS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

const browser = BROWSERS.find((p) => fs.existsSync(p));
if (!browser) {
  console.error('✗ 找不到 Edge 或 Chrome，跳过浏览器测试');
  process.exit(0);
}

/* ── 决定测哪儿 ─────────────────────────────────────────── */

const li = process.argv.indexOf('--live');
const LIVE_ARG = li !== -1 ? (process.argv[li + 1] || 'https://heipig.github.io/gonghai/') : null;
const BASE = LIVE_ARG ? (LIVE_ARG.endsWith('/') ? LIVE_ARG : LIVE_ARG + '/') : null;

/* --slots：连配图位标记一起测。默认关闭——正常玩家看到的是没有标记的版本，
   这一点本身也要测（标记漏出去就是 bug）。 */
const SLOTS = process.argv.includes('--slots');

let html, target;

if (BASE) {
  const res = await fetch(BASE, { redirect: 'follow' });
  if (!res.ok) {
    console.error(`✗ 取不到线上首页：${BASE} → HTTP ${res.status}`);
    process.exit(1);
  }
  html = await res.text();
  target = `线上 ${BASE}`;
  html = html.replace(/href="css\//g, `href="${BASE}css/`)
             .replace(/src="js\//g, `src="${BASE}js/`);
} else {
  html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  target = '本地 index.html';
  html = html.replace(/href="css\//g, 'href="../css/')
             .replace(/src="js\//g, 'src="../js/');
}

/* ── 注入的测试脚本 ─────────────────────────────────────── */

const TEST_SCRIPT = `
<script>
 window.GH_FORCE_SLOTS = ${SLOTS ? 'true' : 'false'};
</script>
<script>
(function () {
  var fail = [], log = [];

  // 这一次运行期望看到配图位标记吗？（--slots 打开时才期望）
  var wantSlots = window.GH_FORCE_SLOTS === true;
  var sawSlot = false;

  window.addEventListener('error', function (e) {
    fail.push('JS 错误: ' + e.message + ' @ ' + (e.filename || '?') + ':' + e.lineno);
  });
  window.addEventListener('unhandledrejection', function (e) {
    fail.push('未处理的 Promise 拒绝: ' + e.reason);
  });

  function q(s) { return document.querySelector(s); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function screenIs(name) { return q('#screen-' + name).classList.contains('is-active'); }

  window.addEventListener('load', function () { setTimeout(run, 80); });

  async function run() {
    try {
      if (!screenIs('title')) fail.push('标题页没有激活');
      if (!window.GH || !window.GH.Engine) fail.push('GH.Engine 没有挂上 window');
      if (!window.GH.Content) fail.push('GH.Content 没有挂上 window');
      if (!window.GH.Audio) fail.push('GH.Audio 没有挂上 window');
      log.push('四个脚本都加载了，标题页正常');

      var rep = window.GH.Engine.audit();
      if (rep.problems.length) fail.push('引擎自检有问题：' + rep.problems.join(' | '));
      log.push('引擎自检 ' + rep.total + ' 节点 / ' + rep.endings.length + ' 结局');

      // 样式真的加载了吗？直接问 styleSheets，别去猜某个 class 有没有背景色。
      // 第一版这里拿 .hud 当探针——页面上根本没有 .hud 这个类（是 #hud），
      // 而且 #hud 用的是 linear-gradient，backgroundColor 本来就是透明的。
      // 结果线上本地一起误报，差点把"CSS 没加载"这个不存在的 bug 当成真问题。
      var sheets = Array.prototype.slice.call(document.styleSheets);
      var readable = 0, ruleCount = 0;
      sheets.forEach(function (s) {
        // 跨域样式表读 cssRules 会抛 SecurityError。测线上时 CSS 来自
        // https://… 而页面是 file://，就属于这种情况——读不到不等于没加载。
        try { ruleCount += s.cssRules.length; readable++; } catch (e) {}
      });
      if (!sheets.length) fail.push('没有任何样式表被加载');
      if (readable > 0 && ruleCount < 50) {
        fail.push('样式表只有 ' + ruleCount + ' 条规则，疑似 CSS 没加载');
      }
      // 这条才是"CSS 到底有没有生效"的直接证据：跨域也读得到计算样式。
      var bodyBg = getComputedStyle(document.body).backgroundColor;
      if (!bodyBg || bodyBg === 'rgba(0, 0, 0, 0)' || bodyBg === 'transparent') {
        fail.push('body 没有背景色，疑似 CSS 没生效：' + bodyBg);
      }
      log.push('样式已加载（' + sheets.length + ' 张表，' +
               (readable ? ruleCount + ' 条规则可读' : '跨域/规则数不可读') +
               '，body 背景 ' + bodyBg + '）');

      q('#input-name').value = '测试';
      q('#btn-start').click();
      await wait(80);
      if (!screenIs('game')) fail.push('点了开始之后游戏页没激活');

      ['#btn-fact', '#btn-log', '#btn-settings'].forEach(function (sel) {
        q(sel).click();
        if (q('#overlay').hidden) fail.push(sel + ' 打不开浮层');
        if (!q('#overlay-body').innerHTML.trim()) fail.push(sel + ' 浮层是空的');
        q('#overlay-close').click();
        if (!q('#overlay').hidden) fail.push(sel + ' 关不掉浮层');
      });
      log.push('三个浮层都能开能关');

      var steps = 0;
      // 配图是这一版新加的东西，静态检查看不出 img 有没有真的渲染出来，
      // 只有真浏览器能证明：#figure 里到底有没有 <img>，图有没有加载成功。
      var sawFigure = false, brokenImg = 0;
      for (var run = 0; run < 6; run++) {
        for (var i = 0; i < 400; i++) {
          if (q('#screen-ending').classList.contains('is-active')) break;
          q('#stage').click();
          var figImg = q('#figure img');
          if (figImg) {
            sawFigure = true;
            if (figImg.complete && figImg.naturalWidth === 0) brokenImg++;
          }
          if (q('#figure .img-slot')) sawSlot = true;
          var btns = Array.prototype.slice.call(q('#choices').querySelectorAll('.choice:not([disabled])'));
          if (!btns.length) {
            fail.push('第 ' + i + ' 步没有可选项 @ ' + window.GH.Engine.state.nodeId);
            break;
          }
          btns[(run + i) % Math.min(btns.length, 3)].click();
          steps++;
        }
        if (!q('#screen-ending').classList.contains('is-active')) {
          fail.push('第 ' + (run + 1) + ' 局没有走到结局');
          break;
        }
        if (!q('#ending-kind').textContent) fail.push('结局缺少 kind');
        if (!q('#ending-body').textContent.trim()) fail.push('结局正文是空的');
        if (q('#ending-body').querySelectorAll('.ending-stats div').length < 5) fail.push('结局结算面板不完整');

        q('#btn-log').click();
        var logged = q('#overlay-body').querySelectorAll('.log-list li').length;
        if (logged < 3) fail.push('航海日志没有记录到选择（只有 ' + logged + ' 条）');
        if (!/刘贵夺/.test(q('#overlay-body').textContent)) fail.push('日志里没有人物关系');
        q('#overlay-close').click();

        q('#btn-ending-fact').click();
        if (q('#overlay').hidden) fail.push('结局页打不开史实页');
        q('#overlay-close').click();

        log.push('第 ' + (run + 1) + ' 局：' + q('#ending-title').textContent + '（' + logged + ' 条记录）');

        q('#btn-restart').click();
        await wait(40);
        if (!screenIs('title')) fail.push('重开没有回到标题页');
        q('#btn-start').click();
        await wait(60);
        if (!screenIs('game')) fail.push('重开之后开不了新局');
      }

      var prog = window.GH.Engine.loadProgress();
      if (!sawFigure) fail.push('六局都没有渲染出任何配图（#figure 一直是空的）');
      if (brokenImg) fail.push('有 ' + brokenImg + ' 次配图加载失败（img 的 naturalWidth 为 0）');
      log.push('配图渲染：' + (sawFigure ? '出现过' : '从未出现') + (brokenImg ? '，坏图 ' + brokenImg + ' 次' : '，无坏图'));

      // 配图位标记必须双向正确：开了要有，没开就不能漏出来。
      // 只测正向的话，一个"永远显示标记"的实现也能通过——
      // 那意味着玩家会在正式版里看到一堆"［配图位］"。
      if (wantSlots && !sawSlot) fail.push('开了 --slots，但整局都没有出现配图位标记');
      if (!wantSlots && sawSlot) fail.push('没有开 --slots，配图位标记却漏到了玩家视角');
      log.push('配图位标记：' + (wantSlots ? '本次打开' : '本次关闭') + '，实际' + (sawSlot ? '出现' : '未出现'));

      log.push('走完 ' + steps + ' 步；存档里收集了 ' + prog.endings.length + ' 种结局');
    } catch (err) {
      fail.push('未捕获异常: ' + err.message + ' || ' + (err.stack || '').split('\\n')[1]);
    }

    var payload = 'SMOKE-RESULT:' + JSON.stringify({ ok: fail.length === 0, fail: fail, log: log });
    var d = document.createElement('div');
    d.id = 'smoke-output';
    d.textContent = payload;
    document.body.appendChild(d);
  }
})();
</script>
`;

html = html.replace('</body>', TEST_SCRIPT + '\n</body>');
fs.writeFileSync(TMP, html, 'utf8');

/* ── 跑无头浏览器 ───────────────────────────────────────── */

console.log('《公海》浏览器冒烟测试');
console.log('═'.repeat(60));
console.log(`测试目标：${target}`);
console.log(`浏览器：  ${path.basename(browser)}\n`);

let dom = '';
try {
  dom = execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--allow-file-access-from-files',
    '--user-data-dir=' + PROFILE,
    '--virtual-time-budget=30000',
    '--dump-dom',
    'file:///' + TMP.replace(/\\/g, '/')
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 180000, stdio: ['ignore', 'pipe', 'ignore'] });
} catch (err) {
  console.error('✗ 浏览器执行失败：' + err.message);
  process.exit(1);
}

/* ── 解析结果 ───────────────────────────────────────────── */

const m = dom.match(/id="smoke-output">SMOKE-RESULT:([^<]*)<\/div>/);
if (!m) {
  console.error('✗ 页面没有产出测试结果——很可能是 JS 在初始化阶段就崩了。');
  console.error('  DOM 长度 ' + dom.length + '，前 600 字：\n' + dom.slice(0, 600));
  process.exit(1);
}

let result;
try {
  result = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
} catch (e) {
  console.error('✗ 结果解析失败：' + m[1].slice(0, 400));
  process.exit(1);
}

result.log.forEach((l) => console.log('  · ' + l));
console.log('\n' + '─'.repeat(60));

if (!result.ok) {
  console.log(`\n✗ 发现 ${result.fail.length} 个问题：\n`);
  result.fail.forEach((f) => console.log('  ✗ ' + f));
  process.exit(1);
}

console.log(`\n✓ 通过 —— 六局连跑，界面、浮层、结局页、日志、存档都正常。`);
