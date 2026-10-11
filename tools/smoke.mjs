/* ═══════════════════════════════════════════════════════════════
   《公海》浏览器冒烟测试
   ─────────────────────────────────────────────────────────────
   verify-game.mjs 只测引擎，测不到 DOM。这个用无头 Edge 真的把
   页面打开，真的点按钮，真的走完一局，然后把结果写进 <title>，
   再用 --dump-dom 取回来。

   测的是那些只有真浏览器才暴露的问题：
     · app.js 有没有抛异常
     · 打字机、选项渲染、结局页、浮层能不能正常工作
     · localStorage 在 file:// 下会不会炸
     · 音频初始化失败会不会拖垮整个游戏

   用法：node tools/smoke.mjs
   ═══════════════════════════════════════════════════════════════ */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.join(ROOT, 'tools', '.smoke.html');

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

/* ── 生成测试页：把 index.html 的路径改一层，再注入测试脚本 ── */

const TEST_SCRIPT = `
<script>
(function () {
  var fail = [], log = [];

  window.addEventListener('error', function (e) {
    fail.push('JS 错误: ' + e.message + ' @ ' + (e.filename || '?') + ':' + e.lineno);
  });
  window.addEventListener('unhandledrejection', function (e) {
    fail.push('未处理的 Promise 拒绝: ' + e.reason);
  });

  function q(s) { return document.querySelector(s); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function screenIs(name) {
    return q('#screen-' + name).classList.contains('is-active');
  }

  window.addEventListener('load', function () {
    setTimeout(run, 60);
  });

  async function run() {
    try {
      // ① 标题页
      if (!screenIs('title')) fail.push('标题页没有激活');
      if (!window.GH || !window.GH.Engine) fail.push('GH.Engine 没有挂上 window');
      if (!window.GH.Content) fail.push('GH.Content 没有挂上 window');
      log.push('标题页 OK');

      // ② 引擎自检
      var rep = window.GH.Engine.audit();
      if (rep.problems.length) fail.push('引擎自检有问题：' + rep.problems.join(' | '));
      log.push('引擎自检 ' + rep.total + ' 节点 / ' + rep.endings.length + ' 结局');

      // ③ 开一局
      q('#input-name').value = '测试';
      q('#btn-start').click();
      await wait(60);
      if (!screenIs('game')) fail.push('点了开始之后游戏页没激活');

      // ④ 浮层：史实页 / 日志 / 设置 都要能开能关
      ['#btn-fact', '#btn-log', '#btn-settings'].forEach(function (sel) {
        q(sel).click();
        if (q('#overlay').hidden) fail.push(sel + ' 打不开浮层');
        if (!q('#overlay-body').innerHTML.trim()) fail.push(sel + ' 浮层是空的');
        q('#overlay-close').click();
        if (!q('#overlay').hidden) fail.push(sel + ' 关不掉浮层');
      });
      log.push('三个浮层都能开能关');

      // ⑤ 走完一局（每次点正文跳过打字机，再点第一个能点的选项）
      var steps = 0, endingsSeen = [];
      for (var run = 0; run < 6; run++) {
        for (var i = 0; i < 400; i++) {
          if (q('#screen-ending').classList.contains('is-active')) break;

          q('#stage').click();          // 跳过打字机
          var btns = Array.prototype.slice.call(
            q('#choices').querySelectorAll('.choice:not([disabled])')
          );
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
        endingsSeen.push(q('#ending-title').textContent);
        log.push('第 ' + (run + 1) + ' 局结局：' + q('#ending-title').textContent);

        // 结局页上的东西
        if (!q('#ending-kind').textContent) fail.push('结局缺少 kind');
        if (!q('#ending-body').textContent.trim()) fail.push('结局正文是空的');
        if (q('#ending-body').querySelectorAll('.ending-stats div').length < 5) {
          fail.push('结局结算面板不完整');
        }
        // 史实页能从结局页打开
        q('#btn-ending-fact').click();
        if (q('#overlay').hidden) fail.push('结局页打不开史实页');
        q('#overlay-close').click();

        // 航海日志：这一局做过的选择应该都记着（重开之后才会清空，
        // 所以必须在重开之前检查）
        q('#btn-log').click();
        var logged = q('#overlay-body').querySelectorAll('.log-list li').length;
        if (logged < 3) fail.push('航海日志没有记录到选择（只有 ' + logged + ' 条）');
        // 关系表和账目也要在
        if (!/贺松/.test(q('#overlay-body').textContent)) fail.push('日志里没有人物关系');
        q('#overlay-close').click();
        log.push('第 ' + (run + 1) + ' 局日志记了 ' + logged + ' 条选择');

        // 重开
        q('#btn-restart').click();
        await wait(30);
        if (!screenIs('title')) fail.push('重开没有回到标题页');
        q('#btn-start').click();
        await wait(40);
        if (!screenIs('game')) fail.push('重开之后开不了新局');
      }

      // ⑥ HUD 有没有真的在动
      var hud = q('#hud-day').textContent;
      if (!/第 \\d+ 天/.test(hud)) fail.push('HUD 的天数没显示：' + hud);
      if (!q('#hand-value').textContent) fail.push('HUD 的手没显示');
      log.push('走完 ' + steps + ' 步，HUD 正常（' + hud + '）');

      // ⑦ 进度存档
      var prog = window.GH.Engine.loadProgress();
      log.push('存档里收集了 ' + prog.endings.length + ' 种结局');

    } catch (err) {
      fail.push('未捕获异常: ' + err.message + ' || ' + (err.stack || '').split('\\n')[1]);
    }

    document.title = 'SMOKE-RESULT:' + JSON.stringify({ ok: fail.length === 0, fail: fail, log: log });
    var d = document.createElement('div');
    d.id = 'smoke-output';
    d.textContent = 'SMOKE-RESULT:' + JSON.stringify({ ok: fail.length === 0, fail: fail, log: log });
    document.body.appendChild(d);
  }
})();
</script>
`;

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
html = html.replace(/href="css\//g, 'href="../css/').replace(/src="js\//g, 'src="../js/');
html = html.replace('</body>', TEST_SCRIPT + '\n</body>');
fs.writeFileSync(TMP, html, 'utf8');

/* ── 跑无头浏览器 ───────────────────────────────────────── */

console.log('《公海》浏览器冒烟测试');
console.log('═'.repeat(60));
console.log(`浏览器：${path.basename(browser)}\n`);

let dom = '';
try {
  dom = execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--allow-file-access-from-files',
    '--user-data-dir=' + path.join(ROOT, 'tools', '.smoke-profile'),
    '--virtual-time-budget=25000',
    '--dump-dom',
    'file:///' + TMP.replace(/\\/g, '/')
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 120000, stdio: ['ignore', 'pipe', 'ignore'] });
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
  console.log(`\n✗ 浏览器里发现 ${result.fail.length} 个问题：\n`);
  result.fail.forEach((f) => console.log('  ✗ ' + f));
  process.exit(1);
}

console.log('\n✓ 浏览器冒烟测试通过 —— 六局连跑，界面、浮层、结局页、日志、存档都正常。');
