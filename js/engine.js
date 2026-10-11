/* ═══════════════════════════════════════════════════════════════
   《公海》游戏引擎 v2
   ─────────────────────────────────────────────────────────────
   设计上抄了两份作业（都是被市场验证过的模型）：

   ● Fallen London / StoryNexus 的 QBN（quality-based narrative）
     剧情不是一棵树，而是一个**池子**。每段小内容（storylet）
     带着"解锁条件"，条件全部由玩家状态表达。引擎每次从当前
     合格的 storylet 里抽。
     为什么这个模型对我重要：想写一段"如果你手上沾过血"的戏，
     QBN 里我只需要写**一个新 storylet**；树结构里我得把整棵树
     分叉一遍。这是作者产能和玩家自由度的双赢。

   ● Reigns 的"多仪表 + 双向暴死"
     每个选择同时推动多根仪表，任何一根顶到上限或下限都会
     提前终结这一局。让"什么都不做"和"做太多"一样危险。

   还加了两条自己的：
   ● 关系是**逐人**的，不是单一好感度。贺松信不信任你，和
     大勇信不信任你，是两件事，而且经常互相冲突。
   ● 你做的每个选择都进了航海日志。靠岸之后，这份日志就是
     你的口供——法庭只看它。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var GH = (window.GH = window.GH || {});

  var SAVE_KEY = 'gonghai.save.v3';
  var SETTINGS_KEY = 'gonghai.settings.v1';
  var PROGRESS_KEY = 'gonghai.progress.v1';

  /* 船上你会在意的那几个人。关系值域 -5 .. +5。
     全部是真实姓名——这一版不再虚构化。 */
  var PEOPLE = ['liu', 'ma', 'zhao', 'cui', 'huang', 'captain'];

  var Engine = {
    nodes: {},
    state: null,
    people: PEOPLE
  };

  /* ── 剧情注册 ──────────────────────────────────────────── */

  Engine.register = function (map) {
    Object.keys(map).forEach(function (k) {
      if (Engine.nodes[k]) throw new Error('剧情节点 id 重复：' + k);
      Engine.nodes[k] = map[k];
    });
  };

  Engine.node = function (id) {
    var n = this.nodes[id];
    if (!n) throw new Error('找不到剧情节点：' + id);
    return n;
  };

  /* ── 状态 ──────────────────────────────────────────────── */

  Engine.newState = function (name) {
    var rel = {};
    PEOPLE.forEach(function (p) { rel[p] = 0; });
    return {
      name: (name || '阿生').trim().slice(0, 8) || '阿生',
      nodeId: 'p_dock',
      day: 1,
      body: 100,        // 体力
      standing: 50,     // 处境：这条船上还有没有人拿你当自己人
      blood: 0,         // 沾血次数。0 = 手是干净的
      kills: 0,
      smokes: 5,        // 烟。船上的硬通货
      rel: rel,         // 逐人关系 -5..+5
      flags: {},
      visited: [],
      seenStorylets: [],
      log: [],
      choicesMade: 0,
      nightQueue: [],
      nightDone: 0,
      nightActive: false,
      nightThen: null,
      run: 1,
      startedAt: Date.now()
    };
  };

  Engine.start = function (name) {
    var prev = Engine.loadProgress();
    this.state = this.newState(name);
    this.state.run = (prev.runs || 0) + 1;
    this.enter('p_dock');
    this.save();
    return this.state;
  };

  /* ── 进入节点 ──────────────────────────────────────────── */

  /* route：按顺序找第一个条件成立的出口，自动分发。
     审判那场戏要用——同一句「听判决」，沾血三次和手上干净的
     人听到的必须是两句话。用 route 就不用在选项里塞三个同名按钮。 */
  var routeDepth = 0;

  Engine.enter = function (id) {
    var n = this.node(id);

    if (n.route && routeDepth < 12) {
      routeDepth++;
      try {
        for (var i = 0; i < n.route.length; i++) {
          if (this.check(n.route[i].require).ok) {
            return this.enter(n.route[i].to);
          }
        }
      } finally {
        routeDepth--;
      }
      // 一条都不匹配：说明剧情写漏了，宁可炸出来也别让玩家卡死
      throw new Error('route 节点没有任何分支命中：' + id);
    }

    this.state.nodeId = id;
    if (this.state.visited.indexOf(id) === -1) this.state.visited.push(id);
    if (n.day) this.state.day = n.day;
    if (n.onEnter) this.apply(n.onEnter);
    // 夜航阶段：进节点时就把这一夜要抽的 storylet 排好队
    if (n.night) this.beginNight(n);
    return n;
  };

  /* ── 应用效果 ──────────────────────────────────────────── */

  Engine.clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };

  /* 第一幕是铺垫，不该被仪表盘杀掉。
     玩家还没搞清自己在玩什么就暴死，那不是难度，是设计事故。
     从劫船那一刻（第 172 天）起，命才是真的会丢的。 */
  Engine.GRACE_UNTIL_DAY = 172;
  Engine.GRACE_FLOOR = 14;

  /* 关于数值平衡：
     这里**没有**全局缩放系数。第一版试过加一个，结果是"要么全活、
     要么全死"——因为各选项之间的体力花费只差 1.3 倍，任何线性
     缩放都只是把整条曲线上下平移，改变不了方差。

     真正管用的是两件事：夜航节点的固定恢复量（见各 act 的 onEnter），
     以及"轻松选项"和"硬选项"之间要拉开差距。要调手感，调这两个。 */

  Engine.floorFor = function () {
    var s = this.state;
    return (s && s.day < this.GRACE_UNTIL_DAY) ? this.GRACE_FLOOR : 0;
  };

  Engine.apply = function (e) {
    if (!e) return;
    var s = this.state;
    var floor = this.floorFor();

    if (e.body)     s.body     = this.clamp(s.body + e.body, floor, 100);
    if (e.standing) s.standing = this.clamp(s.standing + e.standing, floor, 100);
    if (e.blood)    s.blood    = Math.max(0, s.blood + e.blood);
    if (e.kills)    s.kills    = Math.max(0, s.kills + e.kills);
    if (e.smokes)   s.smokes   = Math.max(0, s.smokes + e.smokes);

    if (e.rel) {
      Object.keys(e.rel).forEach(function (k) {
        if (s.rel[k] === undefined) s.rel[k] = 0;
        s.rel[k] = Engine.clamp(s.rel[k] + e.rel[k], -5, 5);
      });
    }
    if (e.flags) {
      Object.keys(e.flags).forEach(function (k) {
        if (e.flags[k]) s.flags[k] = true; else delete s.flags[k];
      });
    }
    if (e.unflags) e.unflags.forEach(function (k) { delete s.flags[k]; });
  };

  /* ── 条件判定 ──────────────────────────────────────────── */

  Engine.check = function (req) {
    if (!req) return { ok: true };
    var s = this.state, f = s.flags;
    var why = req.why || '你做不到';
    var fail = function () { return { ok: false, why: why }; };

    if (req.bodyMin     !== undefined && s.body     < req.bodyMin)     return fail();
    if (req.bodyMax     !== undefined && s.body     > req.bodyMax)     return fail();
    if (req.standingMin !== undefined && s.standing < req.standingMin) return fail();
    if (req.standingMax !== undefined && s.standing > req.standingMax) return fail();
    if (req.bloodMin    !== undefined && s.blood    < req.bloodMin)    return fail();
    if (req.bloodMax    !== undefined && s.blood    > req.bloodMax)    return fail();
    if (req.smokesMin   !== undefined && s.smokes   < req.smokesMin)   return fail();
    if (req.flag        !== undefined && !f[req.flag])                 return fail();
    if (req.noFlag      !== undefined &&  f[req.noFlag])               return fail();
    if (req.anyOf  && !req.anyOf.some(function (k) { return f[k]; }))   return fail();
    if (req.noneOf &&  req.noneOf.some(function (k) { return f[k]; }))  return fail();

    if (req.rel) {
      var bad = Object.keys(req.rel).some(function (k) {
        var v = s.rel[k] || 0, r = req.rel[k];
        if (r.min !== undefined && v < r.min) return true;
        if (r.max !== undefined && v > r.max) return true;
        return false;
      });
      if (bad) return fail();
    }
    return { ok: true };
  };

  /* ── 做选择 ────────────────────────────────────────────── */

  Engine.choose = function (index) {
    var n = this.node(this.state.nodeId);
    var c = n.choices[index];
    if (!c) throw new Error('无效的选项下标：' + index);

    var gate = this.check(c.require);
    if (!gate.ok) return { blocked: true, why: gate.why };

    // 花钱的选项先扣账，扣不起就不给选
    if (c.cost && c.cost.smokes) {
      if (this.state.smokes < c.cost.smokes) {
        return { blocked: true, why: '你拿不出这么多烟' };
      }
      this.state.smokes -= c.cost.smokes;
    }

    this.state.choicesMade++;
    this.state.log.push({ when: '第' + this.state.day + '天', what: c.label, tone: c.tone || '' });

    this.apply(c.effect);

    // 夜航里做的选择不跳转，由队列推着走
    if (this.state.nightActive) return this.nightPull();

    return { node: this.enter(c.to) };
  };

  /* ── QBN：storylet 抽取 ────────────────────────────────── */

  /* 当前所有"合格"的 storylet */
  Engine.eligible = function (pool) {
    var s = this.state;
    return Object.keys(this.nodes).filter(function (id) {
      var n = Engine.nodes[id];
      if (!n.storylet) return false;
      if (pool && n.pool !== pool) return false;
      if (n.once && s.seenStorylets.indexOf(id) !== -1) return false;
      return Engine.check(n.require).ok;
    });
  };

  /* 加权随机抽 n 个，不重复 */
  Engine.pickStorylets = function (pool, n) {
    var s = this.state;
    var picked = [];
    var avail = this.eligible(pool);

    for (var k = 0; k < n; k++) {
      if (!avail.length) break;
      // 刚看过的降权，免得连着两晚同一个人来找你
      var weights = avail.map(function (id) {
        var w = Engine.nodes[id].weight || 1;
        var recency = s.seenStorylets.indexOf(id);
        if (recency !== -1 && recency >= s.seenStorylets.length - 3) w *= 0.25;
        return w;
      });
      var total = weights.reduce(function (a, b) { return a + b; }, 0);
      var roll = Math.random() * total, idx = 0;
      for (var i = 0; i < avail.length; i++) {
        roll -= weights[i];
        if (roll <= 0) { idx = i; break; }
        idx = i;
      }
      picked.push(avail[idx]);
      avail.splice(idx, 1);
    }
    return picked;
  };

  /* 开始一夜。
     注意：这里**不**立刻跳进第一个 storylet——夜航节点自己的开场白
     要先给玩家看（"那一夜，船上的人一个接一个来找你"）。
     app 显示完开场白，玩家点一下，才调 nightPull()。 */
  Engine.beginNight = function (node) {
    var s = this.state;
    var draws = node.night.draws || 2;

    // 体力很低的时候那一夜只抽一个——你昏睡过去了
    if (s.body < 25) draws = Math.max(1, draws - 1);

    s.nightQueue = this.pickStorylets(node.night.pool, draws);
    s.nightDone = 0;
    s.nightThen = node.night.then;
    s.nightActive = true;
    return node;
  };

  /* 抽出这一夜的下一段（或收尾进入主线）*/
  Engine.nightPull = function () {
    var s = this.state;

    if (!s.nightActive) return { node: this.node(s.nodeId) };

    if (!s.nightQueue.length) {
      var then = s.nightThen;
      s.nightActive = false;
      s.nightThen = null;
      s.nightQueue = [];
      this.save();
      return { node: this.enter(then) };
    }

    var id = s.nightQueue.shift();
    s.nightDone++;
    if (s.seenStorylets.indexOf(id) === -1) s.seenStorylets.push(id);
    s.day++;
    var n = this.nodes[id];
    s.nodeId = id;
    // storylet 自己也能带一个 onEnter，但通常用选项来改数值
    if (n.onEnter) this.apply(n.onEnter);
    this.save();
    return { node: n };
  };

  Engine.inNight = function () {
    return !!(this.state && this.state.nightActive);
  };

  /* ── 暴死判定（Reigns 式双向）──────────────────────────── */

  Engine.vitalCheck = function () {
    var s = this.state;
    if (s.day < this.GRACE_UNTIL_DAY) return null;   // 第一幕免死
    if (s.body <= 0) return 'e_body';
    if (s.standing <= 0) return 'e_standing';
    return null;
  };

  /* ── 存档 ──────────────────────────────────────────────── */

  Engine.storageOK = function () {
    try {
      window.localStorage.setItem('__gh_t', '1');
      window.localStorage.removeItem('__gh_t');
      return true;
    } catch (e) { return false; }
  };

  Engine.save = function () {
    if (!this.state || !this.storageOK()) return;
    var s = this.state;
    var snap = {};
    Object.keys(s).forEach(function (k) { if (k !== 'nightThen') snap[k] = s[k]; });
    try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { /* 忽略 */ }
  };

  Engine.load = function () {
    if (!this.storageOK()) return null;
    try {
      var raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || !s.nodeId || !this.nodes[s.nodeId]) return null;
      var base = this.newState(s.name);
      Object.keys(base).forEach(function (k) {
        if (s[k] === undefined) s[k] = base[k];
      });
      // 关系表补全，老存档不丢
      PEOPLE.forEach(function (p) { if (s.rel[p] === undefined) s.rel[p] = 0; });
      if (s.blood > 0) s.run = s.run || 1;
      this.state = s;
      return s;
    } catch (e) { return null; }
  };

  Engine.hasSave = function () {
    if (!this.storageOK()) return false;
    try { return !!window.localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
  };

  Engine.clearSave = function () {
    try { window.localStorage.removeItem(SAVE_KEY); } catch (e) { /* 忽略 */ }
  };

  /* ── 跨周目进度：结局图鉴 ──────────────────────────────── */

  Engine.loadProgress = function () {
    var d = { runs: 0, endings: [], flags: [] };
    try {
      var raw = window.localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.endings) d = o;
      }
    } catch (e) { /* 用默认值 */ }
    return d;
  };

  Engine.saveProgress = function (p) {
    try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch (e) { /* 忽略 */ }
  };

  Engine.recordEnding = function (key) {
    var p = this.loadProgress();
    p.runs = this.state ? this.state.run : (p.runs + 1);
    if (p.endings.indexOf(key) === -1) p.endings.push(key);
    // 把这一局用到的关键标记也存下来，供二周目解锁隐藏内容
    if (this.state) {
      Object.keys(this.state.flags).forEach(function (k) {
        if (p.flags.indexOf(k) === -1) p.flags.push(k);
      });
    }
    this.saveProgress(p);
    return p;
  };

  Engine.hasEnding = function (key) {
    return this.loadProgress().endings.indexOf(key) !== -1;
  };

  Engine.totalEndings = function () {
    return Object.keys(this.nodes).filter(function (id) { return !!Engine.nodes[id].ending; }).length;
  };

  /* ── 设置 ──────────────────────────────────────────────── */

  Engine.settings = { sound: true, typewriter: true, reduceMotion: false };

  Engine.loadSettings = function () {
    try {
      var raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        Object.keys(this.settings).forEach(function (k) {
          if (typeof o[k] === 'boolean') Engine.settings[k] = o[k];
        });
      }
    } catch (e) { /* 默认值 */ }
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.settings.reduceMotion = true;
      }
    } catch (e) { /* 忽略 */ }
    return this.settings;
  };

  Engine.saveSettings = function () {
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)); } catch (e) { /* 忽略 */ }
  };

  /* ── 离线自检 ──────────────────────────────────────────── */

  Engine.audit = function () {
    var problems = [], endings = [], ids = Object.keys(this.nodes), reachable = {};

    ids.forEach(function (id) {
      var n = Engine.nodes[id];
      if (n.ending) endings.push(id);
      // 结局的正文在 ending.body 里，不在 text 里
      var hasText = (n.text && n.text.length) ||
                    (n.ending && n.ending.body && n.ending.body.length);
      if (!hasText) problems.push(id + '：没有正文');
      if (!n.ending && !n.night && !n.route && (!n.choices || !n.choices.length)) {
        problems.push(id + '：既没有选项、也不是结局、也不是夜航/分发节点（死胡同）');
      }
      if (n.route) {
        n.route.forEach(function (r, i) {
          if (!Engine.nodes[r.to]) {
            problems.push(id + ' 的分支 ' + (i + 1) + ' 指向不存在的节点：' + r.to);
          }
        });
        // 最后一个分支必须是无条件的，否则可能一条都不命中
        var last = n.route[n.route.length - 1];
        if (last.require) problems.push(id + '：最后一个 route 分支带了条件，可能全部落空');
      }
      if (n.night && !Engine.nodes[n.night.then]) {
        problems.push(id + '：夜航的 then 指向不存在的节点 ' + n.night.then);
      }
      (n.choices || []).forEach(function (c, i) {
        // 夜航里的选项由队列接管，storylet 也一样——两者都不写 to
        if (n.night || n.storylet) return;
        if (!c.to) problems.push(id + ' 的第 ' + (i + 1) + ' 个选项没有 to');
        else if (!Engine.nodes[c.to]) problems.push(id + ' 的第 ' + (i + 1) + ' 个选项指向不存在的节点：' + c.to);
      });
    });

    // 只沿"主线"做可达性：storylet 是靠池子抽的，不参与遍历。
    // e_body / e_standing 是 vitalCheck 的落点，没有入边，得当作种子。
    var stack = ['p_dock', 'e_body', 'e_standing'];
    while (stack.length) {
      var cur = stack.pop();
      if (reachable[cur] || !Engine.nodes[cur]) continue;
      reachable[cur] = true;
      var n = Engine.nodes[cur];
      if (n.night) stack.push(n.night.then);
      else if (n.route) n.route.forEach(function (r) { stack.push(r.to); });
      else (n.choices || []).forEach(function (c) { if (c.to) stack.push(c.to); });
    }
    ids.forEach(function (id) {
      if (!reachable[id] && !Engine.nodes[id].storylet) {
        problems.push('主线走不到的孤儿节点：' + id);
      }
    });

    // storylet 池子检查：某一夜可能抽不满
    var pools = {};
    ids.forEach(function (id) {
      var n = Engine.nodes[id];
      if (n.storylet) pools[n.pool || 'default'] = (pools[n.pool || 'default'] || 0) + 1;
    });

    return {
      total: ids.length,
      storylets: ids.filter(function (i) { return !!Engine.nodes[i].storylet; }).length,
      endings: endings,
      reachable: Object.keys(reachable).length,
      pools: pools,
      problems: problems
    };
  };

  GH.Engine = Engine;
})();
