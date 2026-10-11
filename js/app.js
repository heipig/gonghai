/* ═══════════════════════════════════════════════════════════════
   《公海》界面层
   ─────────────────────────────────────────────────────────────
   三个手感上的决定，都有理由：

   1. **每个选择之后显示数值变化**（体力 −8 · 处境 +10）
      参考 StoryNexus 的做法：把机制摊开给玩家看，玩家才会有
      控制感。藏起来（像 80 Days）也能work，但那是当数值不是
      核心玩法的时候。这里数值就是玩法。

   2. **条件不满足的选项灰掉、并写出原因**（"你下不去手"）
      Emily Short 说的：灰掉的选项是在告诉玩家"这里本来有别的
      可能"。这部作品的整个主题就是这个——你要能看见自己关掉
      了哪扇门。

   3. **极少数选项完全隐藏**（secret: true）
      只给重玩解锁。比如海底总阀那条路：不知道阀在哪儿的人，
      连这个选项都不该看见。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var GH = window.GH, E = GH.Engine, A = GH.Audio, C = GH.Content;

  var $ = function (s) { return document.querySelector(s); };

  var screens = {
    title: $('#screen-title'),
    game: $('#screen-game'),
    ending: $('#screen-ending')
  };

  var REL_NAME = {
    liu: '刘贵夺', ma: '马玉超', zhao: '赵木成',
    cui: '崔勇', huang: '黄金波', captain: '李承权'
  };

  function relLabel(v) {
    if (v <= -3) return '敌对';
    if (v <= -1) return '冷淡';
    if (v === 0)  return '一般';
    if (v <= 2)   return '信你';
    return '交心';
  }

  function handLabel() {
    var b = E.state ? E.state.blood : 0;
    return b === 0 ? '干净' : '沾血 ' + b;
  }

  var typing = null;   // 当前打字任务的 token
  var pendingNode = null;

  /* 配图位模式：?slots=1 打开。
     未配图的节点会显示一个虚线框，里面是这张图该画什么。
     这样后面补图的时候不用翻源码找位置。 */
  var showSlots = /[?&]slots=1/.test(location.search);

  /* ── 配图 ──────────────────────────────────────────────── */

  function renderFigure(node) {
    var box = $('#figure');
    box.innerHTML = '';
    box.hidden = true;

    if (node.img) {
      var fig = document.createElement('figure');
      fig.className = 'scene';
      var im = document.createElement('img');
      im.src = node.img;
      im.alt = node.imgAlt || '';
      im.loading = 'eager';
      im.decoding = 'async';
      // 图没生成出来也不至于开个天窗
      im.onerror = function () { fig.remove(); box.hidden = true; };
      fig.appendChild(im);
      box.appendChild(fig);
      box.hidden = false;
      return;
    }

    if (node.imgSlot && showSlots) {
      var slot = document.createElement('div');
      slot.className = 'img-slot';
      slot.textContent = '［配图位］' + node.imgSlot;
      box.appendChild(slot);
      box.hidden = false;
    }
  }

  /* ── 屏幕切换 ──────────────────────────────────────────── */

  function show(which) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle('is-active', k === which);
    });
    if (which !== 'game') stopTyping();
  }

  /* ── 打字机 ────────────────────────────────────────────── */

  function stopTyping() {
    typing = null;
    $('#skip-hint').hidden = true;
  }

  function makePara(item) {
    var t = (typeof item === 'string') ? item : item.t;
    var cls = (typeof item === 'string') ? '' : (item.cls || '');

    // {{log}}：把玩家的航海日志原样排出来。审判那场戏要用。
    if (t === '{{log}}') {
      var ul = document.createElement('ul');
      ul.className = 'log-list';
      var log = (E.state && E.state.log) || [];
      if (!log.length) {
        var li0 = document.createElement('li');
        li0.className = 'log-empty';
        li0.textContent = '（本子上是空的。）';
        ul.appendChild(li0);
      } else {
        log.forEach(function (row) {
          var li = document.createElement('li');
          var w = document.createElement('span');
          w.className = 'when';
          w.textContent = row.when;
          var s = document.createElement('span');
          s.textContent = row.what;
          li.appendChild(w); li.appendChild(s);
          ul.appendChild(li);
        });
      }
      return ul;
    }

    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = t;
    return p;
  }

  /* 逐段、逐字显示。点任意处可一次显示完。*/
  function typeOut(container, items, done) {
    container.innerHTML = '';

    var token = {};
    typing = token;

    if (!E.settings.typewriter || E.settings.reduceMotion) {
      items.forEach(function (it) { container.appendChild(makePara(it)); });
      stopTyping();
      done();
      return;
    }

    var nodes = items.map(function (it) { return { item: it, el: null }; });
    var idx = 0;

    function nextPara() {
      if (typing !== token) return;
      if (idx >= nodes.length) { stopTyping(); done(); return; }

      var cur = nodes[idx];
      var el = makePara(cur.item);
      cur.el = el;
      container.appendChild(el);

      // {{log}} 和空行不逐字打
      var text = el.textContent || '';
      if (el.tagName !== 'P' || text.length < 2) {
        idx++; setTimeout(nextPara, 260); return;
      }

      el.textContent = '';
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      el.appendChild(cursor);

      var chars = Array.from(text);
      var i = 0;
      var speed = 26;

      (function step() {
        if (typing !== token) return;
        if (i >= chars.length) {
          cursor.remove();
          idx++;
          setTimeout(nextPara, 210);
          return;
        }
        // 中文标点后多停一下，读起来有呼吸
        var ch = chars[i++];
        cursor.insertAdjacentText('beforebegin', ch);
        var pause = speed;
        if ('。！？'.indexOf(ch) >= 0) pause = 340;
        else if ('，、；：'.indexOf(ch) >= 0) pause = 150;
        setTimeout(step, pause);
      })();
    }

    nextPara();
    $('#skip-hint').hidden = false;
  }

  /* 把当前节点一次性打完全部文字 */
  function finishTyping() {
    if (!typing) return false;
    var node = pendingNode;
    typing = null;
    var container = $('#text');
    container.innerHTML = '';
    (node.text || []).forEach(function (it) { container.appendChild(makePara(it)); });
    $('#skip-hint').hidden = true;
    // 必须和 renderNode 的分支保持一致：
    // 夜航节点没有 choices，它的按钮是 renderNightContinue 生成的。
    // 漏了这一句，玩家在夜里按空格跳过打字就会卡死。
    if (node.night) renderNightContinue(node);
    else renderChoices(node);
    return true;
  }

  /* ── HUD ───────────────────────────────────────────────── */

  function fillClass(v) {
    if (v <= 20) return 'meter-fill critical';
    if (v <= 45) return 'meter-fill low';
    return 'meter-fill';
  }

  function updateHUD() {
    var s = E.state;
    if (!s) return;

    $('#hud-day').textContent = '第 ' + s.day + ' 天';

    var bodyM = document.querySelector('[data-meter="body"]');
    var standM = document.querySelector('[data-meter="standing"]');

    bodyM.querySelector('.meter-fill').className = fillClass(s.body);
    bodyM.querySelector('.meter-fill').style.width = s.body + '%';
    standM.querySelector('.meter-fill').className = fillClass(s.standing);
    standM.querySelector('.meter-fill').style.width = s.standing + '%';

    var hand = $('#hand-value');
    hand.textContent = handLabel();
    hand.className = 'meter-value ' + (s.blood > 0 ? 'blood' : 'clean');
  }

  /* ── 气氛 ──────────────────────────────────────────────── */

  function applyMood(node) {
    document.body.classList.remove('mood-calm', 'mood-tense', 'mood-blood', 'shake');
    document.body.classList.add('mood-' + (node.mood || 'calm'));

    var v = $('#vignette');
    var on = node.mood === 'tense' || node.mood === 'blood';
    v.classList.toggle('on', on);
    v.classList.toggle('blood', node.mood === 'blood');

    if (node.ambience) A.ambience(node.ambience);
  }

  function shake() {
    if (E.settings.reduceMotion) return;
    document.body.classList.remove('shake');
    void document.body.offsetWidth;   // 强制重排，让动画能重复触发
    document.body.classList.add('shake');
    setTimeout(function () { document.body.classList.remove('shake'); }, 600);
  }

  /* ── 数值变化提示 ──────────────────────────────────────── */

  function deltaText(effect) {
    if (!effect) return [];
    var out = [];
    var sign = function (n) { return (n > 0 ? '+' : '') + n; };

    if (effect.body)     out.push('体力 ' + sign(effect.body));
    if (effect.standing) out.push('处境 ' + sign(effect.standing));
    if (effect.smokes)   out.push('烟 ' + sign(effect.smokes));
    if (effect.blood)    out.push('手上沾了血');
    if (effect.rel) {
      Object.keys(effect.rel).forEach(function (k) {
        out.push((REL_NAME[k] || k) + ' ' + sign(effect.rel[k]));
      });
    }
    return out;
  }

  function flashDeltas(effect) {
    var parts = deltaText(effect);
    if (!parts.length) return;

    var box = document.createElement('div');
    box.textContent = parts.join('  ·  ');
    box.style.cssText =
      'position:fixed;left:50%;bottom:1.6rem;transform:translateX(-50%);z-index:30;' +
      'font-family:var(--sans);font-size:.78rem;letter-spacing:.1em;' +
      'color:#9fb6c2;background:rgba(6,11,15,.92);border:1px solid var(--line);' +
      'padding:.5rem 1rem;border-radius:2px;white-space:nowrap;pointer-events:none;' +
      'transition:opacity .5s,transform .5s;';

    document.body.appendChild(box);
    requestAnimationFrame(function () { box.style.transform = 'translateX(-50%) translateY(-6px)'; });
    setTimeout(function () {
      box.style.opacity = '0';
      setTimeout(function () { box.remove(); }, 600);
    }, 2600);
  }

  /* ── 渲染一个节点 ──────────────────────────────────────── */

  function renderNode(node) {
    pendingNode = node;
    updateHUD();
    applyMood(node);

    $('#chapter-label').textContent =
      [node.act, node.place].filter(Boolean).join('  ·  ');

    var stage = $('#stage');
    stage.scrollTop = 0;

    renderFigure(node);
    $('#choices').innerHTML = '';
    typeOut($('#text'), node.text || [], function () {
      if (node.night) return renderNightContinue(node);
      renderChoices(node);
    });
  }

  /* 夜航节点的开场白之后，只有一个"往下走"的按钮 */
  function renderNightContinue(node) {
    var box = $('#choices');
    box.innerHTML = '';
    var b = document.createElement('button');
    b.className = 'choice';
    var num = document.createElement('span');
    num.className = 'num';
    num.textContent = '›';
    b.appendChild(num);
    b.appendChild(document.createTextNode(
      E.state.nightDone ? '天亮了。' : '这一夜，船上有人来找你。'
    ));
    b.onclick = function () { pullNight(); };
    box.appendChild(b);
  }

  function pullNight() {
    var r = E.nightPull();
    advance(r);
  }

  /* ── 选项 ──────────────────────────────────────────────── */

  function renderChoices(node) {
    var box = $('#choices');
    box.innerHTML = '';

    var list = node.choices || [];
    var visible = [];

    list.forEach(function (c, i) {
      var gate = E.check(c.require);
      // secret：条件不满足就完全不给看（重玩解锁用）
      if (c.secret && !gate.ok) return;
      visible.push({ c: c, i: i, gate: gate });
    });

    visible.forEach(function (row, n) {
      var c = row.c;
      var b = document.createElement('button');
      b.className = 'choice' + (c.tone ? ' ' + c.tone : '') + (row.gate.ok ? '' : ' is-locked');
      b.disabled = !row.gate.ok;
      b.style.animationDelay = (n * 70) + 'ms';

      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = (n + 1);
      b.appendChild(num);
      b.appendChild(document.createTextNode(c.label));

      if (!row.gate.ok) {
        var why = document.createElement('span');
        why.className = 'why';
        why.textContent = '——' + row.gate.why;
        b.appendChild(why);
      }

      if (row.gate.ok) {
        b.onclick = function () { choose(row.i); };
      }
      box.appendChild(b);
    });
  }

  function choose(index) {
    if (typing) { finishTyping(); return; }

    var node = pendingNode;
    var effect = (node.choices[index] || {}).effect;
    var tone = (node.choices[index] || {}).tone;

    var r;
    try {
      r = E.choose(index);
    } catch (err) {
      console.error(err);
      return;
    }

    if (r.blocked) { flashDeltas(null); return; }

    flashDeltas(effect);
    if (tone === 'blood') { shake(); A.hit('impact'); }

    advance(r);
  }

  /* 走一步之后的统一处理：先看有没有暴死，再看是不是结局 */
  function advance(result) {
    if (!result || !result.node) return;

    var critical = E.vitalCheck();
    var node = critical ? E.enter(critical) : result.node;

    if (node.ending) { showEnding(node.ending); return; }
    renderNode(node);
  }

  /* ── 结局 ──────────────────────────────────────────────── */

  function showEnding(ending) {
    stopTyping();
    A.ambience('deep');
    setTimeout(function () { A.hit('bell'); }, 400);

    var prog = E.recordEnding(ending.key);
    var all = E.totalEndings();

    $('#ending-kind').textContent = ending.kind || '结局';
    $('#ending-title').textContent = ending.title || '';

    var body = $('#ending-body');
    body.innerHTML = '';
    (ending.body || []).forEach(function (it) { body.appendChild(makePara(it)); });

    // 结算面板
    var s = E.state;
    var stats = document.createElement('div');
    stats.className = 'ending-stats';
    var rows = [
      ['你的名字', s.name],
      ['航程', '第 ' + s.day + ' 天'],
      ['做过的选择', s.choicesMade + ' 次'],
      ['手上', s.blood === 0 ? '干净的' : '沾血 ' + s.blood + ' 次'],
      ['体力剩余', s.body + ' / 100'],
      ['处境剩余', s.standing + ' / 100'],
      ['结局收集', prog.endings.length + ' / ' + all]
    ];
    rows.forEach(function (r) {
      var d = document.createElement('div');
      var k = document.createElement('span'); k.className = 'k'; k.textContent = r[0];
      var v = document.createElement('span'); v.className = 'v'; v.textContent = r[1];
      d.appendChild(k); d.appendChild(v);
      stats.appendChild(d);
    });
    body.appendChild(stats);

    if (prog.endings.length >= all) {
      var note = document.createElement('p');
      note.className = 'beat';
      note.textContent = '你已经走完了这条船上所有可能的结局。人物表里多了一行。';
      body.appendChild(note);
    }

    show('ending');
    screens.ending.scrollTop = 0;
  }

  /* ── 浮层 ──────────────────────────────────────────────── */

  function openOverlay(kind) {
    var title = '', html = '';

    if (kind === 'fact')          { title = C.fact.title;  html = C.fact.html; }
    else if (kind === 'about')    { title = C.about.title; html = C.about.html; }
    else if (kind === 'cast')     { title = C.cast.title;  html = C.cast.html; }
    else if (kind === 'settings') { title = C.settings.title; html = C.settings.html + settingsHTML(); }
    else if (kind === 'log')      { title = '航海日志'; html = logHTML(); }

    $('#overlay-title').textContent = title;
    $('#overlay-body').innerHTML = html;
    $('#overlay').hidden = false;

    if (kind === 'settings') wireSettings();
    if (kind === 'cast') applyCastSecret();
  }

  function closeOverlay() { $('#overlay').hidden = true; }

  function settingsHTML() {
    var s = E.settings;
    return [
      row('sound', '音效', '海浪、心跳、落水声全部由浏览器现场合成，不加载任何音频文件。', s.sound ? '开' : '关'),
      row('typewriter', '逐字显示', '关掉之后文字一次全部出现。', s.typewriter ? '开' : '关'),
      row('reduceMotion', '减少动效', '关闭背景漂移、画面抖动和文字动画。', s.reduceMotion ? '开' : '关')
    ].join('');

    function row(key, name, desc, state) {
      return '<div class="setting-row"><div>' + name +
        '<span class="desc">' + desc + '</span></div>' +
        '<button class="toggle' + (state === '开' ? ' on' : '') + '" data-toggle="' + key + '">' + state + '</button></div>';
    }
  }

  function wireSettings() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-toggle]'), function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-toggle');
        E.settings[k] = !E.settings[k];
        E.saveSettings();
        if (k === 'sound') A.setEnabled(E.settings.sound);
        if (k === 'reduceMotion') document.body.classList.toggle('reduce-motion', E.settings.reduceMotion);
        openOverlay('settings');
      };
    });
  }

  function logHTML() {
    var s = E.state;
    if (!s) return '<p class="log-empty">还没有开始航行。</p>';

    var out = ['<h3>船上的人怎么看你</h3>'];
    E.people.forEach(function (p) {
      var v = s.rel[p] || 0;
      if (v === 0 && !s.log.length) return;
      out.push('<div class="setting-row"><div>' + REL_NAME[p] +
        '<span class="desc">' + relLabel(v) + '</span></div><div style="color:var(--ink-faint);font-size:.8rem">' +
        (v > 0 ? '+' : '') + v + '</div></div>');
    });

    out.push('<h3>你的账</h3>');
    out.push('<div class="setting-row"><div>体力<span class="desc">归零你就死在海上</span></div><div>' + s.body + '</div></div>');
    out.push('<div class="setting-row"><div>处境<span class="desc">归零你就被出局</span></div><div>' + s.standing + '</div></div>');
    out.push('<div class="setting-row"><div>手<span class="desc">唯一一条不可逆的线</span></div><div style="color:' +
      (s.blood ? 'var(--blood-lit)' : 'var(--sea)') + '">' + handLabel() + '</div></div>');
    out.push('<div class="setting-row"><div>烟<span class="desc">船上的硬通货</span></div><div>' + s.smokes + ' 条</div></div>');

    out.push('<h3>你做过的选择</h3>');
    if (!s.log.length) {
      out.push('<p class="log-empty">还没有。</p>');
    } else {
      out.push('<ul class="log-list">');
      s.log.forEach(function (row) {
        out.push('<li><span class="when">' + row.when + '</span><span>' + row.what + '</span></li>');
      });
      out.push('</ul>');
    }
    return out.join('');
  }

  /* 集齐九种结局，人物表多一行 */
  function applyCastSecret() {
    var node = document.getElementById('cast-secret');
    if (!node) return;
    var prog = E.loadProgress();
    if (prog.endings.length >= E.totalEndings()) {
      node.style.color = 'var(--sea)';
      node.style.fontStyle = 'normal';
      node.textContent = '——还有一个人。你从来没在船上见过他。他是写这个游戏的人。' +
        '他在十四年之后听说了这条船，然后花了很长时间想：如果当时我在船上，我会怎么做。' +
        '他没有答案。所以他把它做成了九道题，留给你。';
    }
  }

  /* ── 标题页 ────────────────────────────────────────────── */

  function wireTitle() {
    var hasSave = E.hasSave();
    $('#btn-continue').hidden = !hasSave;

    $('#btn-start').onclick = function () {
      A.init();
      A.setEnabled(E.settings.sound);
      var name = $('#input-name').value;
      E.start(name);
      if (!hasSave) { /* 新局，不需要确认 */ }
      else { E.clearSave(); }
      E.state = E.newState(name);
      E.enter('p_dock');
      E.save();
      show('game');
      renderNode(E.node('p_dock'));
    };

    $('#btn-continue').onclick = function () {
      A.init();
      A.setEnabled(E.settings.sound);
      var s = E.load();
      if (!s) { alert('存档读不出来了，只能重新开始。'); return; }
      show('game');
      var node;
      if (E.inNight()) {
        var r = E.nightPull();
        node = r.node;
      } else {
        node = E.node(s.nodeId);
      }
      if (node.ending) { showEnding(node.ending); return; }
      renderNode(node);
    };

    Array.prototype.forEach.call(document.querySelectorAll('[data-open]'), function (b) {
      b.onclick = function () { openOverlay(b.getAttribute('data-open')); };
    });
  }

  /* ── 全局事件 ──────────────────────────────────────────── */

  function wireGlobal() {
    $('#btn-log').onclick = function () { openOverlay('log'); };
    $('#btn-fact').onclick = function () { openOverlay('fact'); };
    $('#btn-settings').onclick = function () { openOverlay('settings'); };
    $('#overlay-close').onclick = closeOverlay;

    $('#overlay').addEventListener('click', function (e) {
      if (e.target === $('#overlay')) closeOverlay();
    });

    $('#btn-restart').onclick = function () {
      E.clearSave();
      show('title');
      $('#btn-continue').hidden = !E.hasSave();
    };

    $('#btn-ending-fact').onclick = function () { openOverlay('fact'); };

    // 点正文区域可以跳过打字
    $('#stage').addEventListener('click', function (e) {
      if (e.target.closest('#choices')) return;
      finishTyping();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeOverlay(); return; }
      if ($('#overlay').hidden === false) return;

      if (e.key === ' ' || e.key === 'Enter') {
        if (finishTyping()) { e.preventDefault(); return; }
        // 夜航节点没有选项，空格就是继续
        var only = $('#choices').querySelector('.choice');
        if (only && $('#choices').children.length === 1 && pendingNode && pendingNode.night) {
          e.preventDefault(); only.click();
        }
        return;
      }

      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9) {
        var buttons = $('#choices').querySelectorAll('.choice:not([disabled])');
        if (buttons[n - 1]) { e.preventDefault(); buttons[n - 1].click(); }
      }
    });
  }

  /* ── 启动 ──────────────────────────────────────────────── */

  function init() {
    E.loadSettings();
    document.body.classList.toggle('reduce-motion', E.settings.reduceMotion);

    wireTitle();
    wireGlobal();

    // 把 authoring 的错误在控制台里喊出来，别让玩家替你发现
    var report = E.audit();
    if (report.problems.length) {
      console.group('%c《公海》剧情自检发现问题', 'color:#d4564a;font-weight:bold');
      report.problems.forEach(function (p) { console.warn(p); });
      console.groupEnd();
    } else {
      console.log('%c《公海》自检通过 — ' + report.total + ' 个节点，其中 storylet ' +
        report.storylets + ' 段，结局 ' + report.endings.length + ' 种',
        'color:#4fa8b8');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
