/* ═══════════════════════════════════════════════════════════════
   《公海》音效引擎
   ─────────────────────────────────────────────────────────────
   全部用 Web Audio API 现场合成，不加载任何音频文件。
   这样做的三个理由：
     1. 不联网（避坑清单 10.7）：没有 CDN、没有远程资源
     2. 离线双击 index.html 就能有声音（file:// 下加载音频文件会被 CORS 拦）
     3. 仓库体积为零 —— 几十 KB 的代码顶替了若干 MB 的音频素材

   浏览器要求音频必须由用户手势启动，所以 init() 挂在「开始航行」的点击上。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var GH = (window.GH = window.GH || {});

  var Audio = {
    ctx: null,
    master: null,
    enabled: true,
    ready: false,
    _noiseBuf: null,
    _layers: {},        // 当前正在响的环境层
    _beatTimer: null,
    _target: 'sea',
    volume: 0.55
  };

  /* ── 初始化（必须由用户手势调用）───────────────────────── */

  Audio.init = function () {
    if (this.ready) { this.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { this.enabled = false; return; }

    try {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.enabled ? this.volume : 0;
      this.master.connect(this.ctx.destination);
      this._noiseBuf = this._makeNoise(3);
      this.ready = true;
      this.ambience(this._target);
    } catch (e) {
      this.enabled = false;
    }
  };

  Audio.resume = function () {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  };

  Audio.setEnabled = function (on) {
    this.enabled = !!on;
    if (!this.ready) return;
    var t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.linearRampToValueAtTime(on ? this.volume : 0, t + 0.35);
    if (!on) this._stopBeat();
  };

  /* ── 基础素材 ──────────────────────────────────────────── */

  Audio._makeNoise = function (seconds) {
    var len = Math.floor(this.ctx.sampleRate * seconds);
    var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    var d = buf.getChannelData(0);
    var last = 0;
    for (var i = 0; i < len; i++) {
      var white = Math.random() * 2 - 1;
      // 棕噪声：低频更重，听起来像水而不是"沙沙"的电子噪声
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.2;
    }
    return buf;
  };

  Audio._noise = function (loop) {
    var s = this.ctx.createBufferSource();
    s.buffer = this._noiseBuf;
    s.loop = !!loop;
    return s;
  };

  Audio._gain = function (v) {
    var g = this.ctx.createGain();
    g.gain.value = v;
    return g;
  };

  /* 缓慢起伏，让环境音不会听起来像一条死线 */
  Audio._lfo = function (freq, depth, target, base) {
    var osc = this.ctx.createOscillator();
    var amp = this.ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    amp.gain.value = depth;
    osc.connect(amp);
    amp.connect(target);
    if (base !== undefined) target.value = base;
    osc.start();
    return osc;
  };

  /* ── 环境层 ────────────────────────────────────────────── */

  Audio._buildLayer = function (kind) {
    var ctx = this.ctx;
    var out = this._gain(0);
    out.connect(this.master);

    if (kind === 'sea' || kind === 'sea-tense' || kind === 'deep') {
      var n = this._noise(true);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = kind === 'deep' ? 190 : 420;
      lp.Q.value = 0.7;
      var ng = this._gain(kind === 'deep' ? 0.16 : 0.1);
      n.connect(lp); lp.connect(ng); ng.connect(out);
      n.start();
      // 涌浪：滤波和音量一起缓慢起伏
      this._lfo(kind === 'deep' ? 0.045 : 0.085, kind === 'deep' ? 70 : 170, lp.frequency);
      this._lfo(kind === 'deep' ? 0.06 : 0.11, kind === 'deep' ? 0.05 : 0.045, ng.gain, ng.gain.value);
    }

    if (kind === 'sea' || kind === 'sea-tense' || kind === 'wind') {
      var w = this._noise(true);
      var hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 900;
      var wg = this._gain(kind === 'wind' ? 0.055 : 0.022);
      w.connect(hp); hp.connect(wg); wg.connect(out);
      w.start();
      this._lfo(0.07, 0.02, wg.gain, wg.gain.value);
    }

    if (kind === 'engine' || kind === 'sea-tense') {
      // 主机：两个略微失谐的锯齿波，压到很低
      var eg = this._gain(kind === 'engine' ? 0.055 : 0.022);
      var elp = ctx.createBiquadFilter();
      elp.type = 'lowpass';
      elp.frequency.value = 165;
      [46, 69].forEach(function (f) {
        var o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = f;
        o.detune.value = (f === 46 ? 6 : -9);
        o.connect(elp);
        o.start();
      });
      elp.connect(eg); eg.connect(out);
      this._lfo(0.19, 1.6, elp.frequency);
    }

    if (kind === 'sea-tense') {
      // 一根几乎听不见的高弦，只负责让人不舒服
      var o2 = ctx.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = 118;
      var g2 = this._gain(0.018);
      o2.connect(g2); g2.connect(out);
      o2.start();
      this._lfo(0.035, 0.008, g2.gain, 0.018);
    }

    return out;
  };

  /* 切换环境音（交叉淡入淡出，不会硬切）*/
  Audio.ambience = function (kind) {
    kind = kind || 'sea';
    this._target = kind;
    if (!this.ready || !this.enabled) return;
    if (this._layers[kind]) return;

    var t = this.ctx.currentTime;

    Object.keys(this._layers).forEach(function (k) {
      var g = this._layers[k];
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + 1.8);
      var self = this;
      setTimeout(function () {
        try { g.disconnect(); } catch (e) { /* 已断开 */ }
        delete self._layers[k];
      }, 2200);
    }, this);

    var layer = this._buildLayer(kind);
    this._layers[kind] = layer;
    layer.gain.setValueAtTime(0, t);
    layer.gain.linearRampToValueAtTime(1, t + 2.2);

    if (kind === 'sea-tense') this._startBeat(2400);
    else this._stopBeat();
  };

  /* ── 一次性音效 ────────────────────────────────────────── */

  Audio.hit = function (kind) {
    if (!this.ready || !this.enabled) return;
    var ctx = this.ctx, t = ctx.currentTime;

    if (kind === 'heartbeat') {
      [0, 0.26].forEach(function (off, i) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(64, t + off);
        o.frequency.exponentialRampToValueAtTime(38, t + off + 0.2);
        g.gain.setValueAtTime(0, t + off);
        g.gain.linearRampToValueAtTime(i ? 0.5 : 0.72, t + off + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + off + 0.3);
        o.connect(g); g.connect(this.master);
        o.start(t + off); o.stop(t + off + 0.34);
      }, this);
      return;
    }

    if (kind === 'splash') {
      var n = this._noise(false);
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(2400, t);
      lp.frequency.exponentialRampToValueAtTime(180, t + 0.75);
      var g = this._gain(0);
      g.gain.setValueAtTime(0.6, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      n.connect(lp); lp.connect(g); g.connect(this.master);
      n.start(t); n.stop(t + 1);
      return;
    }

    if (kind === 'metal') {
      var n2 = this._noise(false);
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 2650;
      bp.Q.value = 9;
      var g2 = this._gain(0);
      g2.gain.setValueAtTime(0.34, t);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      n2.connect(bp); bp.connect(g2); g2.connect(this.master);
      n2.start(t); n2.stop(t + 0.25);
      return;
    }

    if (kind === 'impact') {
      var o3 = ctx.createOscillator();
      var g3 = this._gain(0);
      o3.type = 'sine';
      o3.frequency.setValueAtTime(96, t);
      o3.frequency.exponentialRampToValueAtTime(32, t + 0.3);
      g3.gain.setValueAtTime(0.55, t);
      g3.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      o3.connect(g3); g3.connect(this.master);
      o3.start(t); o3.stop(t + 0.45);
      return;
    }

    if (kind === 'bell') {
      [196, 294, 441].forEach(function (f, i) {
        var o4 = ctx.createOscillator();
        var g4 = this._gain(0);
        o4.type = 'sine';
        o4.frequency.value = f;
        g4.gain.setValueAtTime(0.2 / (i + 1), t);
        g4.gain.exponentialRampToValueAtTime(0.001, t + 4.2);
        o4.connect(g4); g4.connect(this.master);
        o4.start(t); o4.stop(t + 4.4);
      }, this);
      return;
    }

    if (kind === 'horn') {
      var o5 = ctx.createOscillator();
      var g5 = this._gain(0);
      o5.type = 'sawtooth';
      o5.frequency.setValueAtTime(148, t);
      o5.frequency.linearRampToValueAtTime(112, t + 1.6);
      var lp5 = ctx.createBiquadFilter();
      lp5.type = 'lowpass';
      lp5.frequency.value = 640;
      g5.gain.setValueAtTime(0.001, t);
      g5.gain.linearRampToValueAtTime(0.3, t + 0.25);
      g5.gain.setValueAtTime(0.3, t + 1.1);
      g5.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
      o5.connect(lp5); lp5.connect(g5); g5.connect(this.master);
      o5.start(t); o5.stop(t + 2.3);
    }
  };

  /* ── 心跳节拍器（紧张时自动跳）─────────────────────────── */

  Audio._startBeat = function (ms) {
    this._stopBeat();
    var self = this;
    this._beatTimer = setInterval(function () {
      if (self.enabled) self.hit('heartbeat');
    }, ms || 2400);
  };

  Audio._stopBeat = function () {
    if (this._beatTimer) { clearInterval(this._beatTimer); this._beatTimer = null; }
  };

  /* 页面切到后台就停，别在用户看不到的时候耗电 */
  document.addEventListener('visibilitychange', function () {
    if (!Audio.ready) return;
    if (document.hidden) { Audio._stopBeat(); if (Audio.ctx) Audio.ctx.suspend(); }
    else { Audio.resume(); }
  });

  GH.Audio = Audio;
})();
