/*!
 * AUD Mock Exam Engine — framework-agnostic, zero dependencies.
 * Usage:  AUDExam.mount(document.getElementById('aud'), { fullscreen:false });
 * Data:   load data/exam*.js before or after this file (they push into window.AUD_DATA).
 */
(function (global) {
  'use strict';

  var CFG = {
    totalSeconds: 4 * 60 * 60,      // official AUD seat time: 4 hours
    breakSeconds: 15 * 60,          // standardized break (clock paused), offered after Testlet 3
    passScore: 75,
    mcqWeight: 0.5, tbsWeight: 0.5, // AICPA AUD score weighting: 50% MCQ / 50% TBS
    tbsSplit: [2, 3, 2],            // TBS per testlet (Testlets 3–5)
    // Raw % -> estimated scaled score. The AICPA uses IRT scaling, so this is an approximation:
    // ~65% weighted raw maps to 75.
    rawAtPass: 0.65,
    // Differentiator / provenance label shown on every screen and in every item ID
    // Pacing plan (minutes per testlet) = 235 min + 5 min buffer. MCQ target ≈ 75 sec each.
    pace: [50, 50, 40, 55, 40],
    mcqTargetSec: 75, mcqNudgeSec: 150,
    brandTag: 'CL',
    brandLabel: 'Created with Claude (Anthropic)'
  };
  function badge() { return '<span class="aud-cl" title="' + CFG.brandLabel + '">' + CFG.brandTag + '</span>'; }

  var AREAS = {
    1: 'Ethics, Professional Responsibilities & General Principles',
    2: 'Assessing Risk & Developing a Planned Response',
    3: 'Performing Further Procedures & Obtaining Evidence',
    4: 'Forming Conclusions & Reporting'
  };
  var AREA_W = { 1: '15–25%', 2: '25–35%', 3: '30–40%', 4: '10–20%' };
  var L = ['A', 'B', 'C', 'D', 'E', 'F'];

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(root, sel) { return root.querySelector(sel); }
  function $all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(arr, seed) { var a = arr.slice(), r = rng(seed); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; }
  function fmt(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; }
  function pct(n, d) { return d ? Math.round(n / d * 1000) / 10 : 0; }
  function num(v) { if (v == null) return NaN; var s = String(v).replace(/[$,%\s]/g, ''); if (/^\(.*\)$/.test(s)) s = '-' + s.slice(1, -1); return s === '' ? NaN : Number(s); }
  var FLAG_SVG = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h1v14H3zM5 2h8l-2 3 2 3H5z"/></svg>';

  // ---------- data ----------
  function buildExams() {
    var raw = global.AUD_DATA || [], map = {};
    raw.forEach(function (chunk) {
      var e = map[chunk.exam] || (map[chunk.exam] = { id: chunk.exam, title: CFG.brandTag + ' AUD Mock Exam ' + chunk.exam, mcq: [], tbs: [] });
      if (chunk.title) e.title = CFG.brandTag + ' ' + chunk.title;
      if (chunk.tag) e.tag = chunk.tag;
      if (chunk.mcq) e.mcq = e.mcq.concat(chunk.mcq);
      if (chunk.tbs) e.tbs = e.tbs.concat(chunk.tbs);
    });
    return Object.keys(map).sort(function (a, b) { return a - b; }).map(function (k) {
      var e = map[k];
      e.code = CFG.brandTag + '-E' + e.id;
      e.mcq.forEach(function (q, i) {
        q.id = q.id || (e.code + '-M' + (i < 9 ? '0' : '') + (i + 1));
        // Deterministic option shuffle (keeps answer letters balanced; same order on every load).
        if (!q._sh && !q.fixed) {
          var perm = shuffle(q.o.map(function (_, k) { return k; }), hash(q.id + '|' + q.q.length));
          q.o = perm.map(function (k) { return q.o[k]; });
          if (q.r) { var rr = q.r; q.r = perm.map(function (k) { return rr[k]; }); }
          q.c = perm.indexOf(q.c); q._sh = true;
        }
      });
      e.tbs.forEach(function (t, i) { t.id = t.id || (e.code + '-T' + (i + 1)); });
      return e;
    });
  }

  function rowOptions(t, r) { return r.o || (t.lists && t.lists[r.list]) || []; }
  function rowCorrect(t, r, v) {
    if (v == null || v === '') return false;
    if (r.type === 'num') { var n = num(v); return !isNaN(n) && Math.abs(n - r.a) <= (r.tol != null ? r.tol : 0.5); }
    return Number(v) === r.a;
  }
  function rowAnswerText(t, r) { return r.type === 'num' ? (r.fmt ? r.fmt : Number(r.a).toLocaleString()) : rowOptions(t, r)[r.a]; }
  function rowUserText(t, r, v) {
    if (v == null || v === '') return '<em>No response</em>';
    return r.type === 'num' ? esc(v) : esc(rowOptions(t, r)[Number(v)]);
  }

  // ---------- engine ----------
  function Exam(root, opts) {
    this.root = root; this.opts = opts || {};
    this.key = this.opts.storageKey || 'aud-mock-exam-v1';
    this.exams = buildExams();
    var tagged = this.exams.filter(function (x) { return x.tag; })[0];
    this.ui = { modal: null, calc: false, filter: 'all', tab: 0, sel: tagged ? tagged.id : (this.exams.length ? this.exams[0].id : null), mode: this.opts.defaultMode || 'exam' };
    this.calc = { cur: '0', prev: null, op: null, mem: 0, fresh: true, expr: '' };
    root.classList.add('aud-root');
    if (this.opts.fullscreen) root.classList.add('aud-full');
    this.load();
    this.bind();
    this.render();
    var self = this;
    this.tick = setInterval(function () { self.onTick(); }, 1000);
  }

  Exam.prototype.exam = function () { var id = this.s && this.s.examId; return this.exams.filter(function (e) { return e.id === id; })[0]; };

  Exam.prototype.load = function () {
    this.s = null;
    try { var j = global.localStorage && localStorage.getItem(this.key); if (j) this.s = JSON.parse(j); } catch (e) { this.s = null; }
    if (this.s && !this.exam()) this.s = null;
    if (!this.s) this.s = { phase: 'start' };
    if (this.s.phase === 'exam' || this.s.phase === 'break') this.s.paused = true; // resume on demand after reload
  };
  Exam.prototype.save = function () { try { localStorage.setItem(this.key, JSON.stringify(this.s)); } catch (e) { /* storage unavailable: in-memory only */ } };

  Exam.prototype.testlets = function () {
    var e = this.exam(), s = this.s; if (!e) return [];
    var order = s.order.map(function (i) { return e.mcq[i]; });
    var half = Math.ceil(order.length / 2), out = [];
    out.push({ kind: 'mcq', items: order.slice(0, half) });
    out.push({ kind: 'mcq', items: order.slice(half) });
    var k = 0;
    CFG.tbsSplit.forEach(function (n, gi) {
      var take = gi === CFG.tbsSplit.length - 1 ? e.tbs.length - k : n;
      out.push({ kind: 'tbs', items: e.tbs.slice(k, k + take) }); k += take;
    });
    return out;
  };
  Exam.prototype.cur = function () { return this.testlets()[this.s.testlet]; };
  Exam.prototype.item = function () { var t = this.cur(); return t && t.items[this.s.idx]; };
  Exam.prototype.itemKey = function (it, kind) { return (kind === 'tbs' ? 't:' : 'm:') + it.id; };

  Exam.prototype.status = function (it, kind) {
    var a = this.s.answers;
    if (kind === 'mcq') return a['m:' + it.id] != null ? 'ans' : 'un';
    var n = 0; it.rows.forEach(function (r, i) { var v = a['t:' + it.id + ':' + i]; if (v != null && v !== '') n++; });
    return n === 0 ? 'un' : (n === it.rows.length ? 'ans' : 'part');
  };

  Exam.prototype.start = function (examId, mode, drill) {
    var e = this.exams.filter(function (x) { return x.id === examId; })[0];
    var seed = (Date.now() ^ (Math.random() * 1e9)) | 0;
    drill = drill == null ? null : Number(drill);
    this.s = {
      phase: 'exam', examId: examId, seed: seed, mode: mode || 'exam', drill: drill,
      order: shuffle(e.mcq.map(function (_, i) { return i; }), seed),
      testlet: drill == null ? 0 : drill, idx: 0,
      timeLeft: drill == null ? CFG.totalSeconds : CFG.pace[drill] * 60,
      answers: {}, flags: {}, strikes: {}, fb: {}, itemTime: {}, testletTime: [0, 0, 0, 0, 0], visits: {},
      breakLeft: CFG.breakSeconds, breakTaken: false, paused: false, startedAt: Date.now()
    };
    this.ui.tab = 0; this.save(); this.render();
  };

  Exam.prototype.onTick = function () {
    var s = this.s;
    if (s.paused) return;
    if (s.phase === 'exam') {
      s.timeLeft -= 1;
      var ci = this.item(), ct = this.cur();
      if (ci && !this.ui.modal) { var ck = this.itemKey(ci, ct.kind); s.itemTime[ck] = (s.itemTime[ck] || 0) + 1; }
      s.testletTime[s.testlet] = (s.testletTime[s.testlet] || 0) + 1;
      this.updatePace();
      if (s.timeLeft === 15 * 60 || s.timeLeft === 5 * 60) this.toast('Time remaining: ' + fmt(s.timeLeft));
      if (s.timeLeft <= 0) { s.timeLeft = 0; this.finish(true); return; }
      if (s.drill == null && s.mode === 'coach') { var tgt = CFG.pace[s.testlet] * 60, used = s.testletTime[s.testlet]; if (used === tgt) this.toast('Testlet ' + (s.testlet + 1) + ' target time (' + CFG.pace[s.testlet] + ' min) reached: finish up and submit'); }
      var t = $(this.root, '.aud-timer'); if (t) { t.lastChild.nodeValue = fmt(s.timeLeft); t.classList.toggle('warn', s.timeLeft <= 15 * 60); }
      if (s.timeLeft % 5 === 0) this.save();
    } else if (s.phase === 'break') {
      s.breakLeft -= 1;
      var b = $(this.root, '.aud-break-t'); if (b) b.textContent = fmt(s.breakLeft);
      if (s.breakLeft <= 0) { s.breakLeft = 0; this.endBreak(); }
      if (s.breakLeft % 5 === 0) this.save();
    }
  };

  Exam.prototype.toast = function (msg) {
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;top:56px;left:50%;transform:translateX(-50%);background:#b71c1c;color:#fff;padding:8px 16px;border-radius:4px;z-index:80;font-weight:bold';
    d.textContent = msg; this.root.appendChild(d); setTimeout(function () { d.remove(); }, 4000);
  };

  Exam.prototype.go = function (i) { var t = this.cur(); if (i < 0 || i >= t.items.length) return; this.s.idx = i; this.ui.tab = 0; this.ui.modal = null; this.save(); this.render(); };

  Exam.prototype.submitTestlet = function () {
    var s = this.s, n = this.testlets().length;
    this.ui.modal = null;
    if (s.testlet >= n - 1 || s.drill != null) { this.finish(false); return; }
    s.testlet += 1; s.idx = 0; this.ui.tab = 0;
    if (s.testlet === 3 && !s.breakTaken) { this.ui.modal = 'break'; }
    this.save(); this.render();
  };
  Exam.prototype.takeBreak = function () { this.s.phase = 'break'; this.s.breakTaken = true; this.ui.modal = null; this.save(); this.render(); };
  Exam.prototype.endBreak = function () { this.s.phase = 'exam'; this.save(); this.render(); };
  Exam.prototype.finish = function (timeout) {
    this.s.phase = 'results'; this.s.timedOut = !!timeout; this.s.finishedAt = Date.now();
    this.s.result = this.grade(); this.ui.modal = null; this.ui.calc = false; this.ui.filter = 'all';
    this.save(); this.render();
    if (this.opts.onComplete) try { this.opts.onComplete(this.s.result); } catch (e) { }
  };

  Exam.prototype.grade = function () {
    var e = this.exam(), a = this.s.answers, area = {}, self = this, inc = this.included();
    [1, 2, 3, 4].forEach(function (k) { area[k] = { c: 0, t: 0 }; });
    var fb = this.s.fb || {}, study = this.s.mode === 'study';
    var mc = 0, mt = 0; e.mcq.forEach(function (q) { if (!inc[q.id]) return; mt++; var f0 = fb['m:' + q.id]; var ok = study && f0 && f0.first != null ? f0.first : a['m:' + q.id] === q.c; if (ok) mc++; area[q.a].t++; if (ok) area[q.a].c++; });
    var tc = 0, tt = 0;
    e.tbs.forEach(function (t) { if (!inc[t.id]) return; t.rows.forEach(function (r, i) { var f1 = fb['t:' + t.id]; var ok = study && f1 && f1.first && f1.first[i] != null ? f1.first[i] : rowCorrect(t, r, a['t:' + t.id + ':' + i]); tt++; area[t.a].t++; if (ok) { tc++; area[t.a].c++; } }); });
    var mRaw = mt ? mc / mt : 0, tRaw = tt ? tc / tt : 0;
    var raw = !mt ? tRaw : !tt ? mRaw : CFG.mcqWeight * mRaw + CFG.tbsWeight * tRaw;
    var scaled = raw <= CFG.rawAtPass ? raw / CFG.rawAtPass * 75 : 75 + (raw - CFG.rawAtPass) / (1 - CFG.rawAtPass) * 24;
    scaled = Math.max(0, Math.min(99, Math.round(scaled)));
    var used = (self.s.drill == null ? CFG.totalSeconds : CFG.pace[self.s.drill] * 60) - self.s.timeLeft;
    return { mc: mc, mt: mt, tc: tc, tt: tt, mRaw: mRaw, tRaw: tRaw, raw: raw, scaled: scaled, pass: scaled >= CFG.passScore, area: area, used: used };
  };

  Exam.prototype.included = function () {
    var inc = {}, s = this.s, ts = this.testlets();
    ts.forEach(function (t, i) { if (s.drill == null || s.drill === i) t.items.forEach(function (it) { inc[it.id] = 1; }); });
    return inc;
  };

  // ---------- pacing ----------
  Exam.prototype.paceInfo = function () {
    var s = this.s, t = this.cur(), self = this, n = t.items.length;
    var done = t.items.filter(function (it) { return self.status(it, t.kind) === 'ans'; }).length;
    var tgt = CFG.pace[s.testlet] * 60, used = s.testletTime[s.testlet] || 0;
    var expected = done / n * tgt, diff = Math.round(expected - used); // + ahead, - behind
    return { done: done, n: n, tgt: tgt, used: used, diff: diff };
  };
  Exam.prototype.vPace = function () {
    var s = this.s; if (s.mode !== 'coach') return '';
    return '<div class="aud-pace"></div>';
  };
  Exam.prototype.updatePace = function () {
    var s = this.s, el = $(this.root, '.aud-pace'); if (!el || s.mode !== 'coach') return;
    var p = this.paceInfo(), it = this.item(), t = this.cur(), k = this.itemKey(it, t.kind), onIt = s.itemTime[k] || 0;
    var w = Math.min(100, p.used / p.tgt * 100), wd = p.done / p.n * 100;
    var state = p.diff >= 0 ? 'ok' : p.diff > -180 ? 'mid' : 'bad';
    var label = p.diff >= 0 ? fmt(p.diff).replace(/^0:/, '') + ' ahead' : fmt(-p.diff).replace(/^0:/, '') + ' behind';
    var nudge = '';
    if (t.kind === 'mcq' && onIt >= CFG.mcqNudgeSec) nudge = '<span class="aud-nudge">⏱ ' + fmt(onIt).replace(/^0:/, '') + ' on this question: pick your best answer, flag it, and move on.</span>';
    else if (t.kind === 'tbs' && onIt >= p.tgt / p.n + 120) nudge = '<span class="aud-nudge">⏱ Over this task\'s time budget (' + Math.round(p.tgt / p.n / 60) + ' min). Fill every remaining cell with your best guess, then move on.</span>';
    el.className = 'aud-pace ' + state;
    el.innerHTML = '<span><b>Pacing Coach</b> · Testlet budget ' + CFG.pace[s.testlet] + ':00 · used ' + fmt(p.used).replace(/^0:/, '') + ' · answered ' + p.done + '/' + p.n + '</span>' +
      '<span class="aud-pace-bars"><i class="t" style="width:' + w + '%"></i><i class="d" style="width:' + wd + '%"></i></span><b class="aud-pace-s">' + label + '</b>' +
      '<span class="aud-muted" style="font-size:12px">This item: ' + fmt(onIt).replace(/^0:/, '') + '</span>' + nudge;
  };

  // ---------- rendering ----------
  Exam.prototype.render = function () {
    var s = this.s, h;
    if (!this.exams.length) { this.root.innerHTML = '<div class="aud-page"><h1>No exam data loaded</h1><p>Include the data/exam*.js files.</p></div>'; return; }
    if (s.phase === 'start') h = this.vStart();
    else if (s.phase === 'break') h = this.vBreak();
    else if (s.phase === 'results') h = this.vResults();
    else h = this.vExam();
    this.root.innerHTML = h + (this.ui.calc ? this.vCalc() : '') + this.vModal();
    this.afterRender();
    if (s.phase === 'exam' && !s.paused) this.updatePace();
  };

  Exam.prototype.vHeader = function (extra) {
    var s = this.s, e = this.exam(), n = this.testlets().length;
    return '<div class="aud-hdr">'+badge()+'<span class="aud-title">AUD</span><span class="aud-testlet">' + esc(e.title) + ' &nbsp;|&nbsp; Testlet ' + (s.testlet + 1) + ' of ' + n + (s.drill != null ? ' &nbsp;|&nbsp; <b>TIMED DRILL</b>' : '') + (s.mode === 'coach' ? ' &nbsp;|&nbsp; Coach' : s.mode === 'study' ? ' &nbsp;|&nbsp; Study' : '') + '</span><span class="aud-spacer"></span>' +
      (extra || '') +
      '<button class="aud-tool" data-act="calc" title="Calculator">&#128425; <span class="lbl">Calculator</span></button>' +
      '<button class="aud-tool" data-act="review" title="Item review">&#9638; <span class="lbl">Review</span></button>' +
      '<button class="aud-tool" data-act="help" title="Help">? <span class="lbl">Help</span></button>' +
      '<span class="aud-timer' + (s.timeLeft <= 900 ? ' warn' : '') + '"><small>Time Remaining</small>' + fmt(s.timeLeft) + '</span>' +
      '<button class="aud-tool" data-act="exit" title="Exit">Exit</button></div>';
  };

  Exam.prototype.vStart = function () {
    var self = this, saved = null;
    try { saved = JSON.parse(localStorage.getItem(this.key + ':last') || 'null'); } catch (e) { }
    var cards = this.exams.map(function (e) {
      return '<button class="aud-card' + (self.ui.sel === e.id ? ' on' : '') + '" data-act="pick" data-id="' + e.id + '"><b>' + esc(e.title) + (e.tag ? ' <span class="aud-tag r">' + esc(e.tag) + '</span>' : '') + '</b><span>' + e.mcq.length + ' MCQ · ' + e.tbs.length + ' TBS</span></button>';
    }).join('');
    return '<div class="aud-hdr">'+badge()+'<span class="aud-title">AUD</span><span class="aud-testlet">Auditing and Attestation — Mock Examination</span><span class="aud-spacer"></span></div>' +
      '<div class="aud-body"><div class="aud-page">' +
      '<h1>CPA Auditing and Attestation (AUD) — Mock Exam</h1><p class="aud-muted">Practice exams built to the current AICPA AUD blueprint, with the same structure, timing and tools as the real exam.</p>' +
      '<div class="aud-instr" style="display:flex;gap:10px;align-items:center">' + badge() + '<span><b>' + CFG.brandLabel + '.</b> Every exam and item in this version carries a <b>' + CFG.brandTag + '</b> label and ID (for example ' + CFG.brandTag + '-E1-M07). These are original practice questions written by an AI, not released AICPA questions.</span></div>' +
      (saved ? '<p class="aud-muted">Last attempt: ' + esc(saved.title) + ': estimated score <b>' + saved.scaled + '</b> (' + (saved.pass ? 'Pass' : 'Fail') + ')</p>' : '') +
      '<h2>Select an exam</h2><div class="aud-cards">' + cards + '</div>' +
      '<h2>Practice mode</h2><div class="aud-cards">' +
      '<button class="aud-card' + (self.ui.mode !== 'coach' ? ' on' : '') + '" data-act="mode" data-v="exam"><b>Exam simulation</b><span>Same conditions as the real exam: no pace hints. Time-management report at the end.</span></button>' +
      '<button class="aud-card' + (self.ui.mode === 'coach' ? ' on' : '') + '" data-act="mode" data-v="coach"><b>Pacing Coach</b><span>Live ahead/behind pace bar per testlet, a nudge after 2:30 on one MCQ, and a budget alert per testlet.</span></button>' +
      '<button class="aud-card' + (self.ui.mode === 'study' ? ' on' : '') + '" data-act="mode" data-v="study"><b>Study mode</b><span>Check each answer right away, try again, or show the answer with the full explanation. Scored on first attempts.</span></button></div>' +
      '<h2>Session</h2><div class="aud-cards">' +
      '<button class="aud-card' + (self.ui.drill == null ? ' on' : '') + '" data-act="drill" data-v=""><b>Full exam</b><span>5 testlets · 4:00:00</span></button>' +
      [0, 1, 2, 3, 4].map(function (i) { return '<button class="aud-card' + (self.ui.drill === i ? ' on' : '') + '" data-act="drill" data-v="' + i + '"><b>Drill: Testlet ' + (i + 1) + '</b><span>' + (i < 2 ? 'MCQ' : 'TBS') + ' only · ' + CFG.pace[i] + ':00 timer</span></button>'; }).join('') + '</div>' +
      '<h2>Time budget (use this on exam day)</h2><table class="aud-info"><tr><th>Testlet</th><th>Content</th><th>Target</th><th>Clock should read ≈ at end</th></tr>' +
      (function () { var left = 240, out = ''; [0, 1, 2, 3, 4].forEach(function (i) { left -= CFG.pace[i]; out += '<tr><td>' + (i + 1) + '</td><td>' + (i < 2 ? '39 MCQ (~75 sec each)' : (i === 3 ? '3 TBS (~18 min each)' : '2 TBS (~20 min each)')) + '</td><td>' + CFG.pace[i] + ' min</td><td>' + fmt(left * 60) + (i === 2 ? ' (then take the break, which pauses the clock)' : '') + '</td></tr>'; }); return out; })() +
      '</table><p class="aud-muted" style="font-size:13px">Rule of thumb: never spend more than 2:30 on one MCQ. Flag it, guess, and move on. Every TBS cell left blank is a guaranteed zero, so fill all cells before submitting.</p>' +
      '<h2>Exam structure</h2><table class="aud-info"><tr><th>Testlet</th><th>Content</th><th>Notes</th></tr>' +
      '<tr><td>1</td><td>MCQ (half of total)</td><td rowspan="2">MCQ = 50% of score</td></tr><tr><td>2</td><td>MCQ (half of total)</td></tr>' +
      '<tr><td>3</td><td>2 task-based simulations</td><td rowspan="3">TBS = 50% of score. You can take an optional 15-minute break after Testlet 3 (the clock pauses)</td></tr><tr><td>4</td><td>3 task-based simulations</td></tr><tr><td>5</td><td>2 task-based simulations</td></tr></table>' +
      '<table class="aud-info"><tr><th>Blueprint area</th><th>Weight</th></tr>' + [1, 2, 3, 4].map(function (k) { return '<tr><td>Area ' + ['I', 'II', 'III', 'IV'][k - 1] + ': ' + AREAS[k] + '</td><td>' + AREA_W[k] + '</td></tr>'; }).join('') + '</table>' +
      '<h2>Instructions</h2><ul><li>Total testing time: <b>4 hours</b>. The timer runs continuously except during the standardized break.</li>' +
      '<li>You can move freely between questions <b>within</b> a testlet. Once you submit a testlet, you can\'t return to it.</li>' +
      '<li>Use <b>Flag for Review</b> to mark items, and open <b>Review</b> to see answered, unanswered and flagged items.</li>' +
      '<li>Right-click an answer option to strike it out. The calculator is in the toolbar.</li>' +
      '<li>Passing score is <b>75</b>. Scores are estimated from weighted raw performance (the AICPA uses IRT scaling, so treat the score as an approximation).</li>' +
      '<li>Your progress is saved in this browser automatically.</li></ul>' +
      '<p style="margin-top:22px"><button class="aud-btn" data-act="begin">Begin ' + esc((this.exams.filter(function (e) { return e.id === self.ui.sel; })[0] || {}).title || '') + (self.ui.drill != null ? ': Testlet ' + (self.ui.drill + 1) + ' drill' : '') + (self.ui.mode === 'coach' ? ' (Pacing Coach)' : self.ui.mode === 'study' ? ' (Study mode)' : '') + '</button></p>' +
      '</div></div>';
  };

  Exam.prototype.vExam = function () {
    var s = this.s, t = this.cur(), it = this.item(), kind = t.kind;
    if (s.paused) {
      return this.vHeader() + '<div class="aud-body"><div class="aud-page" style="text-align:center;padding-top:80px"><h1>Exam paused</h1><p class="aud-muted">Your session was restored. Time remaining: <b>' + fmt(s.timeLeft) + '</b></p><button class="aud-btn" data-act="resume">Resume exam</button> <button class="aud-btn sec" data-act="exit">Exit options</button></div></div>';
    }
    var fk = this.itemKey(it, kind), flagged = !!s.flags[fk];
    var sub = '<div class="aud-sub"><button class="aud-nav-btn" data-act="prev" ' + (s.idx === 0 ? 'disabled' : '') + '>&#9664;</button>' +
      '<span class="aud-qof">' + (kind === 'tbs' ? 'Task ' : 'Question ') + (s.idx + 1) + ' of ' + t.items.length + '</span>' +
      '<button class="aud-nav-btn" data-act="next" ' + (s.idx >= t.items.length - 1 ? 'disabled' : '') + '>&#9654;</button>' +
      '<button class="aud-flag' + (flagged ? ' on' : '') + '" data-act="flag">' + FLAG_SVG + (flagged ? 'Flagged' : 'Flag for Review') + '</button>' +
      '<span class="aud-spacer" style="flex:1"></span><span class="aud-muted" style="font-size:12px">' + (kind === 'tbs' ? esc(it.title) + ' · ' : '') + 'Item ID: ' + esc(it.id) + '</span></div>';
    var body = kind === 'mcq' ? this.vMcq(it) : this.vTbs(it);
    var last = s.idx >= t.items.length - 1;
    var ftr = '<div class="aud-ftr"><button class="aud-btn sec" data-act="prev" ' + (s.idx === 0 ? 'disabled' : '') + '>Previous</button>' +
      '<button class="aud-btn sec" data-act="next" ' + (last ? 'disabled' : '') + '>Next</button><span style="flex:1;text-align:center" class="aud-brandline">' + badge() + ' ' + CFG.brandLabel + '</span>' +
      '<button class="aud-btn sec" data-act="review">Review Testlet</button>' +
      '<button class="aud-btn warn" data-act="confirmSubmit">' + (s.testlet === this.testlets().length - 1 || s.drill != null ? 'Submit Exam' : 'Submit Testlet') + '</button></div>';
    return this.vHeader() + sub + this.vPace() + '<div class="aud-body">' + body + '</div>' + ftr;
  };

  Exam.prototype.vMcq = function (q) {
    var s = this.s, sel = s.answers['m:' + q.id], strikes = s.strikes['m:' + q.id] || [];
    var opts = q.o.map(function (o, i) {
      var st = strikes.indexOf(i) >= 0;
      return '<li class="aud-opt' + (sel === i ? ' sel' : '') + (st ? ' strike' : '') + '" data-act="choose" data-i="' + i + '"><input type="radio" name="aud-q" ' + (sel === i ? 'checked' : '') + ' tabindex="-1"><span class="aud-opt-letter">' + L[i] + '.</span><span class="aud-opt-txt">' + o + '</span></li>';
    }).join('');
    return '<div class="aud-mcq"><div class="aud-stem">' + q.q + '</div><ul class="aud-opts">' + opts + '</ul>' + (s.mode === 'study' ? this.vStudyMcq(q) : '') + '<div class="aud-hint">Select one answer. Right-click an option to strike it out.</div></div>';
  };

  Exam.prototype.vStudyMcq = function (q) {
    var s = this.s, f = (s.fb || {})['m:' + q.id] || {}, sel = s.answers['m:' + q.id];
    if (f.shown) {
      return '<div class="aud-fb show"><b>Answer: ' + L[q.c] + '.</b> ' + (f.first === true ? '(You got it right on your first try.)' : '') +
        q.o.map(function (o, i) { return '<div class="aud-ko ' + (i === q.c ? 'correct' : (i === sel ? 'picked' : '')) + '"><b>' + L[i] + '.</b> ' + o + (i === q.c ? ' <span class="aud-tag g">Correct answer</span>' : '') + (q.r && q.r[i] ? '<span class="why">' + q.r[i] + '</span>' : '') + '</div>'; }).join('') +
        (q.ref ? '<div class="aud-ref">Reference: ' + esc(q.ref) + '</div>' : '') + '</div>';
    }
    if (f.last === 'right') return '<div class="aud-fb ok"><b>✔ Correct!</b>' + (f.tries > 1 ? ' (after ' + f.tries + ' tries)' : '') + '<div class="why">' + (q.r ? q.r[q.c] : '') + '</div><button class="aud-btn sec" data-act="reveal">Show full explanation</button></div>';
    if (f.last === 'wrong') return '<div class="aud-fb no"><b>✖ Incorrect.</b> Try again, or show the answer.<div style="margin-top:8px"><button class="aud-btn" data-act="retry">Try again</button> <button class="aud-btn sec" data-act="reveal">Show answer</button></div></div>';
    return '<div class="aud-fb"><button class="aud-btn" data-act="check" ' + (sel == null ? 'disabled' : '') + '>Check answer</button> <button class="aud-btn sec" data-act="reveal">Show answer</button></div>';
  };

  Exam.prototype.vTbs = function (t) {
    var s = this.s, tab = Math.min(this.ui.tab, (t.exhibits || []).length - 1);
    var tabs = (t.exhibits || []).map(function (x, i) { return '<button class="aud-tab' + (i === tab ? ' on' : '') + '" data-act="tab" data-i="' + i + '">' + esc(x.title) + '</button>'; }).join('');
    var ex = t.exhibits && t.exhibits[tab] ? t.exhibits[tab].html : '<p>No exhibits.</p>';
    var rows = t.rows.map(function (r, i) {
      var v = s.answers['t:' + t.id + ':' + i], cell;
      if (r.type === 'num') cell = '<input type="text" inputmode="decimal" data-row="' + i + '" value="' + esc(v == null ? '' : v) + '" class="' + (v != null && v !== '' ? 'filled' : '') + '" placeholder="Enter amount">';
      else cell = '<select data-row="' + i + '" class="' + (v != null && v !== '' ? 'filled' : '') + '"><option value="">— Select —</option>' + rowOptions(t, r).map(function (o, j) { return '<option value="' + j + '"' + (String(v) === String(j) ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
      var f = (s.fb || {})['t:' + t.id] || {}, extra = '';
      if (s.mode === 'study') {
        if (f.shown) extra = '<div class="aud-rowans"><b>Answer: ' + esc(rowAnswerText(t, r)) + '</b>' + (rowCorrect(t, r, v) ? ' <span class="aud-row-ok">✔</span>' : ' <span class="aud-row-no">✖</span>') + '<div class="why">' + (r.e || '') + '</div></div>';
        else extra = '<span class="aud-mk" data-mk="' + i + '">' + (f.last && f.last[i] === true ? '<span class="aud-row-ok">✔ Correct</span>' : f.last && f.last[i] === false ? (v == null || v === '' ? '<span class="aud-row-no">— Not answered</span>' : '<span class="aud-row-no">✖ Incorrect</span>') : '') + '</span>';
      }
      return '<tr><td>' + (i + 1) + '</td><td>' + r.p + '</td><td class="aud-cell">' + cell + extra + '</td></tr>';
    }).join('');
    var sb = '';
    if (s.mode === 'study') {
      var ff = (s.fb || {})['t:' + t.id] || {}, nw = ff.last ? ff.last.filter(function (x) { return x === false; }).length : 0;
      sb = '<div class="aud-fb" style="margin:0 0 12px">' + (ff.shown ? '<b>Answers shown.</b> ' : '<button class="aud-btn" data-act="tcheck">Check task</button> ' + (nw ? '<button class="aud-btn" data-act="tretry">Try again (clear ' + nw + ' incorrect)</button> ' : '') + '<button class="aud-btn sec" data-act="treveal">Show answers</button>') +
        (ff.last && !ff.shown ? ' <span style="margin-left:8px">' + ff.last.filter(function (x) { return x === true; }).length + ' / ' + t.rows.length + ' correct</span>' : '') + '</div>';
    }
    var w = this.ui.split || 50;
    return '<div class="aud-tbs"><div class="aud-left aud-pane" style="flex-basis:' + w + '%"><div class="aud-tabs">' + tabs + '</div><div class="aud-exhibit">' + ex + '</div></div><div class="aud-split" data-split></div>' +
      '<div class="aud-right aud-pane"><div class="aud-instr"><h3>' + esc(t.title) + '</h3>' + t.instr + '</div>' +
      sb + '<table class="aud-resp"><tr><th>#</th><th>Item</th><th>Response</th></tr>' + rows + '</table></div></div>';
  };

  Exam.prototype.vBreak = function () {
    return '<div class="aud-hdr">'+badge()+'<span class="aud-title">AUD</span><span class="aud-testlet">Standardized Break</span><span class="aud-spacer"></span><span class="aud-timer"><small>Exam clock paused at</small>' + fmt(this.s.timeLeft) + '</span></div>' +
      '<div class="aud-body"><div class="aud-page" style="text-align:center;padding-top:70px"><h1>Standardized Break</h1><p class="aud-muted">The exam clock is paused. Break time remaining:</p><p class="aud-break-t" style="font-size:44px;font-weight:bold;font-family:Courier New,monospace;color:#13294b">' + fmt(this.s.breakLeft) + '</p><button class="aud-btn" data-act="endBreak">Return to exam</button></div></div>';
  };

  Exam.prototype.vModal = function () {
    var m = this.ui.modal; if (!m) return '';
    var s = this.s, self = this, title = '', body = '', foot = '';
    if (m === 'review') {
      var t = this.cur(), kind = t.kind, cnt = { ans: 0, un: 0, part: 0, flag: 0 };
      var cells = t.items.map(function (it, i) {
        var st = self.status(it, kind), fl = s.flags[self.itemKey(it, kind)];
        cnt[st]++; if (fl) cnt.flag++;
        return '<button class="aud-cellq ' + st + (i === s.idx ? ' cur' : '') + '" data-act="jump" data-i="' + i + '">' + (i + 1) + (fl ? '<span class="f">&#9873;</span>' : '') + '</button>';
      }).join('');
      title = 'Review: Testlet ' + (s.testlet + 1);
      body = '<div class="aud-legend"><span><i class="aud-sw" style="background:#dbe9fb;border-color:#8fb3e3"></i>Answered</span><span><i class="aud-sw"></i>Unanswered</span>' + (kind === 'tbs' ? '<span><i class="aud-sw" style="background:linear-gradient(135deg,#dbe9fb 50%,#fff 50%)"></i>Partially answered</span>' : '') + '<span><i class="aud-sw" style="background:#e67e22;border-radius:50%"></i>Flagged</span></div>' +
        '<div class="aud-grid">' + cells + '</div><div class="aud-tstat"><span>Answered: <b>' + cnt.ans + '</b></span>' + (kind === 'tbs' ? '<span>Partial: <b>' + cnt.part + '</b></span>' : '') + '<span>Unanswered: <b>' + cnt.un + '</b></span><span>Flagged: <b>' + cnt.flag + '</b></span></div>' +
        '<p class="aud-muted" style="font-size:13px">Select a number to go to that item.</p>';
      foot = '<button class="aud-btn sec" data-act="close">Close</button>';
    } else if (m === 'confirm') {
      var tt = this.cur(), un = tt.items.filter(function (it) { return self.status(it, tt.kind) !== 'ans'; }).length;
      var fl = tt.items.filter(function (it) { return s.flags[self.itemKey(it, tt.kind)]; }).length;
      var lastT = s.testlet === this.testlets().length - 1 || s.drill != null;
      title = lastT ? 'Submit Exam' : 'Submit Testlet';
      body = '<p>' + (un ? '<b style="color:#c62828">' + un + ' item(s) are not fully answered.</b> ' : 'All items in this testlet are answered. ') + (fl ? fl + ' item(s) are flagged for review.' : '') + '</p><p>' + (lastT ? 'Submitting ends the exam and shows your score report.' : 'After you submit, you <b>can\'t return</b> to this testlet.') + '</p>';
      foot = '<button class="aud-btn sec" data-act="close">Return to testlet</button><button class="aud-btn warn" data-act="submit">' + title + '</button>';
    } else if (m === 'break') {
      title = 'Standardized Break';
      body = '<p>You have finished Testlet 3. You can take an optional <b>15-minute standardized break</b> now. The exam clock pauses during the break.</p>';
      foot = '<button class="aud-btn sec" data-act="close">Continue without break</button><button class="aud-btn" data-act="takeBreak">Take break</button>';
    } else if (m === 'exit') {
      title = 'Exit Exam';
      body = '<p>Choose an option:</p><ul><li><b>Save &amp; pause</b>: progress is kept in this browser and the clock pauses.</li><li><b>End &amp; score now</b>: submits all remaining testlets as they are.</li><li><b>Abandon</b>: discards this attempt.</li></ul>';
      foot = '<button class="aud-btn sec" data-act="close">Cancel</button><button class="aud-btn sec" data-act="abandon">Abandon</button><button class="aud-btn sec" data-act="pause">Save &amp; pause</button><button class="aud-btn warn" data-act="endNow">End &amp; score now</button>';
    } else if (m === 'help') {
      title = 'Help';
      body = '<ul><li><b>Navigation:</b> use Previous/Next, the arrows, or Review to move within the current testlet.</li><li><b>Flag for Review:</b> marks an item. Flags appear in the review grid.</li><li><b>Strikeout:</b> right-click (long-press on touch) an option to cross it out.</li><li><b>TBS:</b> exhibits are on the left. Drag the divider to resize. Enter responses on the right. For numeric cells, enter numbers only (commas and $ are ignored; use a minus sign or parentheses for negatives).</li><li><b>Keyboard:</b> A–D selects an option, ←/→ moves between questions, F flags.</li><li><b>Submitting</b> a testlet is final.</li></ul>';
      foot = '<button class="aud-btn" data-act="close">Close</button>';
    }
    return '<div class="aud-modal-bg" data-act="bg"><div class="aud-modal" role="dialog"><div class="aud-modal-h"><span>' + title + '</span><button data-act="close">&times;</button></div><div class="aud-modal-b">' + body + '</div><div class="aud-modal-f">' + foot + '</div></div></div>';
  };

  Exam.prototype.vCalc = function () {
    var c = this.calc, p = this.ui.calcPos || {};
    var keys = [['MC', 'mc'], ['MR', 'mr'], ['M+', 'm+'], ['M-', 'm-'], ['&larr;', 'bs'],
      ['7', '7'], ['8', '8'], ['9', '9'], ['&divide;', '/'], ['CE', 'ce'],
      ['4', '4'], ['5', '5'], ['6', '6'], ['&times;', '*'], ['C', 'c'],
      ['1', '1'], ['2', '2'], ['3', '3'], ['&minus;', '-'], ['&radic;', 'sqrt'],
      ['0', '0'], ['.', '.'], ['&plusmn;', 'neg'], ['+', '+'], ['%', '%']];
    var k = keys.map(function (x) { var op = /^[\/*\-+]$|^(mc|mr|m\+|m-|bs|ce|c|sqrt|neg|%)$/.test(x[1]); return '<button data-k="' + x[1] + '" class="' + (op ? 'op' : '') + '">' + x[0] + '</button>'; }).join('');
    return '<div class="aud-calc" style="' + (p.x != null ? 'left:' + p.x + 'px;top:' + p.y + 'px;right:auto' : '') + '"><div class="aud-calc-h" data-drag><span>Calculator' + (c.mem ? ' · M' : '') + '</span><button data-act="calc">&times;</button></div>' +
      '<div class="aud-calc-d"><small>' + esc(c.expr) + '</small><span class="v">' + esc(c.cur) + '</span></div><div class="aud-calc-k">' + k + '<button data-k="=" class="eq" style="grid-column:span 5">=</button></div></div>';
  };

  Exam.prototype.calcKey = function (k) {
    var c = this.calc, v = parseFloat(c.cur);
    function out(n) { if (!isFinite(n)) return 'Error'; var s = String(Math.round(n * 1e10) / 1e10); return s.length > 16 ? n.toExponential(8) : s; }
    function apply() { if (c.op == null || c.prev == null) return v; var a = c.prev, b = v; return c.op === '+' ? a + b : c.op === '-' ? a - b : c.op === '*' ? a * b : b === 0 ? NaN : a / b; }
    if (/^[0-9]$/.test(k)) { c.cur = (c.fresh || c.cur === '0') ? k : c.cur + k; c.fresh = false; }
    else if (k === '.') { if (c.fresh) { c.cur = '0.'; c.fresh = false; } else if (c.cur.indexOf('.') < 0) c.cur += '.'; }
    else if (k === 'bs') { if (!c.fresh) c.cur = c.cur.length > 1 ? c.cur.slice(0, -1) : '0'; }
    else if (k === 'ce') { c.cur = '0'; c.fresh = true; }
    else if (k === 'c') { c.cur = '0'; c.prev = null; c.op = null; c.fresh = true; c.expr = ''; }
    else if (k === 'neg') { c.cur = out(-v); }
    else if (k === 'sqrt') { c.cur = out(Math.sqrt(v)); c.fresh = true; }
    else if (k === '%') { c.cur = out(c.prev != null ? c.prev * v / 100 : v / 100); c.fresh = true; }
    else if (/^[\/*\-+]$/.test(k)) { if (c.op && !c.fresh) { c.prev = apply(); c.cur = out(c.prev); } else c.prev = v; c.op = k; c.fresh = true; c.expr = out(c.prev) + ' ' + ({ '/': '÷', '*': '×', '-': '−', '+': '+' })[k]; }
    else if (k === '=') { if (c.op) { var r = apply(); c.expr = out(c.prev) + ' ' + ({ '/': '÷', '*': '×', '-': '−', '+': '+' })[c.op] + ' ' + out(v) + ' ='; c.cur = out(r); c.prev = null; c.op = null; c.fresh = true; } }
    else if (k === 'mc') c.mem = 0; else if (k === 'mr') { c.cur = out(c.mem); c.fresh = true; } else if (k === 'm+') { c.mem += v; c.fresh = true; } else if (k === 'm-') { c.mem -= v; c.fresh = true; }
    var d = $(this.root, '.aud-calc-d'); if (d) d.innerHTML = '<small>' + esc(c.expr) + '</small><span class="v">' + esc(c.cur) + '</span>';
    var h = $(this.root, '.aud-calc-h span'); if (h) h.textContent = 'Calculator' + (c.mem ? ' · M' : '');
  };

  Exam.prototype.vResults = function () {
    var s = this.s, e = this.exam(), r = s.result || this.grade(), self = this, f = this.ui.filter;
    var areaRows = [1, 2, 3, 4].map(function (k) { var a = r.area[k], p = pct(a.c, a.t); return '<div class="aud-stat"><span>Area ' + ['I', 'II', 'III', 'IV'][k - 1] + ': ' + AREAS[k] + '</span><b>' + p + '%</b><span>' + a.c + ' / ' + a.t + ' scored points</span><div class="aud-bar"><i class="' + (p < 65 ? 'low' : '') + '" style="width:' + p + '%"></i></div></div>'; }).join('');
    var chips = [['all', 'All items'], ['wrong', 'Incorrect / unanswered'], ['flag', 'Flagged'], ['mcq', 'MCQ only'], ['tbs', 'TBS only'], ['a1', 'Area I'], ['a2', 'Area II'], ['a3', 'Area III'], ['a4', 'Area IV']]
      .map(function (c) { return '<button class="aud-chip' + (f === c[0] ? ' on' : '') + '" data-act="filter" data-f="' + c[0] + '">' + c[1] + '</button>'; }).join('');
    var a = s.answers, out = [], n = 0;
    // MCQ in the order the candidate saw them
    var inc = this.included();
    s.order.forEach(function (qi, pos) {
      var q = e.mcq[qi]; if (!inc[q.id]) return; var pick = a['m:' + q.id], ok = pick === q.c, fl = s.flags['m:' + q.id];
      n++;
      if (f === 'wrong' && ok) return; if (f === 'flag' && !fl) return; if (f === 'tbs') return; if (/^a\d$/.test(f) && 'a' + q.a !== f) return;
      var opts = q.o.map(function (o, i) {
        var cls = i === q.c ? 'correct' : (i === pick ? 'picked' : '');
        var tag = i === q.c ? ' <span class="aud-tag g">Correct answer</span>' : '';
        if (i === pick) tag += ' <span class="aud-tag ' + (ok ? 'g' : 'r') + '">Your answer</span>';
        return '<div class="aud-ko ' + cls + '"><b>' + L[i] + '.</b> ' + o + tag + (q.r && q.r[i] ? '<span class="why">' + q.r[i] + '</span>' : '') + '</div>';
      }).join('');
      out.push('<div class="aud-key"><div class="aud-key-h"><b>MCQ ' + (pos + 1) + '</b><span class="aud-tag">' + esc(q.id) + '</span><span class="aud-tag">Testlet ' + (pos < Math.ceil(s.order.length / 2) ? 1 : 2) + '</span><span class="aud-tag">Area ' + ['I', 'II', 'III', 'IV'][q.a - 1] + '</span>' + (fl ? '<span class="aud-tag o">Flagged</span>' : '') + '<span class="aud-tag' + ((s.itemTime || {})['m:' + q.id] > CFG.mcqNudgeSec ? ' r' : '') + '">⏱ ' + fmt((s.itemTime || {})['m:' + q.id] || 0).replace(/^0:/, '') + '</span><span style="flex:1"></span><span class="res ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✔ Correct' : pick == null ? '✖ Unanswered' : '✖ Incorrect') + '</span></div>' +
        '<div class="aud-key-b"><div class="aud-stem" style="margin-bottom:10px">' + q.q + '</div>' + opts + (q.ref ? '<div class="aud-ref">Reference: ' + esc(q.ref) + '</div>' : '') + '</div></div>');
    });
    e.tbs.forEach(function (t, ti) {
      if (!inc[t.id] || f === 'mcq') return; if (/^a\d$/.test(f) && 'a' + t.a !== f) return;
      var fl = s.flags['t:' + t.id]; if (f === 'flag' && !fl) return;
      var earned = 0, rows = t.rows.map(function (rw, i) {
        var v = a['t:' + t.id + ':' + i], ok = rowCorrect(t, rw, v); if (ok) earned++;
        if (f === 'wrong' && ok) return '';
        return '<tr><td>' + (i + 1) + '</td><td>' + rw.p + '</td><td>' + rowUserText(t, rw, v) + '<br><span class="' + (ok ? 'aud-row-ok' : 'aud-row-no') + '">' + (ok ? '✔' : '✖') + '</span></td><td><b>' + esc(rowAnswerText(t, rw)) + '</b>' + (rw.e ? '<div class="why" style="font-size:13px;color:#3d4955;margin-top:4px">' + rw.e + '</div>' : '') + '</td></tr>';
      }).join('');
      if (f === 'wrong' && earned === t.rows.length) return;
      var exh = (t.exhibits || []).map(function (x) { return '<details class="aud-ex"><summary>Exhibit: ' + esc(x.title) + '</summary><div class="aud-exhibit">' + x.html + '</div></details>'; }).join('');
      out.push('<div class="aud-key"><div class="aud-key-h"><b>TBS ' + (ti + 1) + ': ' + esc(t.title) + '</b><span class="aud-tag">' + esc(t.id) + '</span><span class="aud-tag">Area ' + ['I', 'II', 'III', 'IV'][t.a - 1] + '</span>' + (fl ? '<span class="aud-tag o">Flagged</span>' : '') + '<span style="flex:1"></span><span class="res ' + (earned === t.rows.length ? 'ok' : 'no') + '">' + earned + ' / ' + t.rows.length + ' points</span></div>' +
        '<div class="aud-key-b"><div class="aud-instr">' + t.instr + '</div>' + exh + '<table class="aud-resp" style="margin-top:10px"><tr><th>#</th><th>Item</th><th>Your response</th><th>Correct response &amp; explanation</th></tr>' + rows + '</table>' + (t.ref ? '<div class="aud-ref">Reference: ' + esc(t.ref) + '</div>' : '') + '</div></div>');
    });
    try { localStorage.setItem(this.key + ':last', JSON.stringify({ title: e.title, scaled: r.scaled, pass: r.pass })); } catch (x) { }
    return '<div class="aud-hdr">'+badge()+'<span class="aud-title">AUD</span><span class="aud-testlet">' + esc(e.title) + ' — Score Report</span><span class="aud-spacer"></span><button class="aud-tool" data-act="home">Exam menu</button></div>' +
      '<div class="aud-body"><div class="aud-page"><h1>Score Report: ' + esc(e.title) + '</h1><p class="aud-muted">' + badge() + ' ' + CFG.brandLabel + ' · Exam code ' + esc(e.code) + '</p>' +
      (s.mode === 'study' ? '<p class="aud-muted"><b>Study mode:</b> each item is scored on your <b>first</b> checked attempt. Items you revealed before answering correctly count as incorrect.</p>' : '') + (s.timedOut ? '<p style="color:#c62828"><b>Time expired.</b> Your remaining testlets were submitted automatically.</p>' : '') +
      '<div class="aud-score"><div class="aud-big ' + (r.pass ? 'pass' : 'fail') + '"><div class="l">Estimated scaled score</div><div class="n">' + r.scaled + '</div><div class="s">' + (r.pass ? 'PASS' : 'FAIL') + '</div><div class="l">Passing score: 75</div></div>' +
      '<div class="aud-stats"><div class="aud-stat"><span>Multiple-choice (50%)</span><b>' + pct(r.mc, r.mt) + '%</b><span>' + r.mc + ' of ' + r.mt + ' correct</span><div class="aud-bar"><i style="width:' + pct(r.mc, r.mt) + '%"></i></div></div>' +
      '<div class="aud-stat"><span>Task-based simulations (50%)</span><b>' + pct(r.tc, r.tt) + '%</b><span>' + r.tc + ' of ' + r.tt + ' scorable responses</span><div class="aud-bar"><i style="width:' + pct(r.tc, r.tt) + '%"></i></div></div>' +
      '<div class="aud-stat"><span>Weighted raw score</span><b>' + Math.round(r.raw * 1000) / 10 + '%</b><span>About 65% weighted raw maps to a scaled 75</span></div>' +
      '<div class="aud-stat"><span>Time used</span><b>' + fmt(r.used) + '</b><span>of 4:00:00 allowed</span></div></div></div>' +
      this.vTimeReport(r) +
      '<h2>Performance by blueprint area</h2><div class="aud-stats" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">' + areaRows + '</div>' +
      '<p style="margin-top:16px"><button class="aud-btn" data-act="retake">Retake this exam</button> <button class="aud-btn sec" data-act="home">Choose another exam</button></p>' +
      '<h2>Answer key &amp; explanations</h2><div class="aud-filter">' + chips + '</div>' + (out.join('') || '<p class="aud-muted">No items match this filter.</p>') +
      '</div></div>';
  };

  Exam.prototype.vTimeReport = function (r) {
    var s = this.s, e = this.exam(), ts = this.testlets(), it = s.itemTime || {}, tt = s.testletTime || [], a = s.answers, self = this, inc = this.included();
    var rows = ts.map(function (t, i) {
      if (s.drill != null && s.drill !== i) return '';
      var used = tt[i] || 0, tgt = CFG.pace[i] * 60, over = used - tgt;
      var blank = t.items.filter(function (x) { return self.status(x, t.kind) !== 'ans'; }).length;
      return '<tr><td>Testlet ' + (i + 1) + ' (' + (t.kind === 'mcq' ? 'MCQ' : 'TBS') + ')</td><td>' + fmt(tgt) + '</td><td>' + fmt(used) + '</td><td style="color:' + (over > 60 ? '#c62828' : '#1e8e3e') + ';font-weight:bold">' + (over > 0 ? '+' + fmt(over) + ' over' : fmt(-over) + ' under') + '</td><td>' + (blank ? '<b style="color:#c62828">' + blank + '</b>' : '0') + '</td></tr>';
    }).join('');
    var mq = e.mcq.filter(function (q) { return inc[q.id] && it['m:' + q.id] != null; });
    var secs = mq.map(function (q) { return it['m:' + q.id]; }), avg = secs.length ? Math.round(secs.reduce(function (x, y) { return x + y; }, 0) / secs.length) : 0;
    var slow = mq.filter(function (q) { return it['m:' + q.id] > CFG.mcqNudgeSec; });
    var slowOk = slow.filter(function (q) { return a['m:' + q.id] === q.c; }).length;
    var fast = mq.filter(function (q) { return it['m:' + q.id] <= CFG.mcqNudgeSec; });
    var fastOk = fast.filter(function (q) { return a['m:' + q.id] === q.c; }).length;
    var unans = e.mcq.filter(function (q) { return inc[q.id] && a['m:' + q.id] == null; }).length;
    var tips = [];
    if (avg > CFG.mcqTargetSec + 15) tips.push('Your MCQ average (' + avg + 's) is above the 75-second target. Over 78 questions that costs about ' + Math.round((avg - CFG.mcqTargetSec) * 78 / 60) + ' minutes that should go to the simulations.');
    if (slow.length) tips.push(slow.length + ' MCQ(s) took more than 2:30, and you got ' + slowOk + ' of them right (' + pct(slowOk, slow.length) + '%) compared with ' + pct(fastOk, fast.length) + '% on the rest. Extra minutes on hard questions rarely pay off: flag, guess, and move on.');
    ts.forEach(function (t, i) { var over = (tt[i] || 0) - CFG.pace[i] * 60; if ((s.drill == null || s.drill === i) && over > 120) tips.push('Testlet ' + (i + 1) + ' ran ' + Math.round(over / 60) + ' min over budget. Check the clock against the “should read” column of the time budget.'); });
    if (unans) tips.push(unans + ' MCQ(s) were left blank. There is no penalty for guessing, so never submit a blank.');
    if (s.timedOut) tips.push('You ran out of time. Practice the full exam in Pacing Coach mode, then in Exam simulation mode.');
    if (!tips.length) tips.push('Pacing was on target. Keep doing full timed simulations so this pace feels normal on exam day.');
    return '<h2>Time management report</h2><table class="aud-info"><tr><th>Testlet</th><th>Budget</th><th>Used</th><th>vs. budget</th><th>Items not fully answered</th></tr>' + rows + '</table>' +
      '<div class="aud-stats" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));margin-top:10px">' +
      '<div class="aud-stat"><span>Average time per MCQ</span><b>' + avg + 's</b><span>Target: ' + CFG.mcqTargetSec + 's</span></div>' +
      '<div class="aud-stat"><span>MCQs over 2:30</span><b>' + slow.length + '</b><span>' + slowOk + ' answered correctly</span></div>' +
      '<div class="aud-stat"><span>Accuracy: quick vs. slow MCQs</span><b>' + pct(fastOk, fast.length) + '% / ' + pct(slowOk, slow.length) + '%</b><span>≤2:30 vs. >2:30</span></div></div>' +
      '<div class="aud-instr" style="margin-top:12px"><b>Coaching notes</b><ul style="margin:6px 0 0">' + tips.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
  };

  // ---------- events ----------
  Exam.prototype.bind = function () {
    var self = this, root = this.root;
    root.addEventListener('click', function (ev) {
      var kEl = ev.target.closest('[data-k]'); if (kEl && root.contains(kEl)) { self.calcKey(kEl.getAttribute('data-k')); return; }
      var el = ev.target.closest('[data-act]'); if (!el || !root.contains(el)) return;
      var act = el.getAttribute('data-act'), s = self.s;
      if (act === 'bg') { if (ev.target === el && self.ui.modal !== 'break') { self.ui.modal = null; self.render(); } return; }
      switch (act) {
        case 'pick': self.ui.sel = Number(el.getAttribute('data-id')); self.render(); break;
        case 'begin': if (self.ui.sel != null) self.start(self.ui.sel, self.ui.mode, self.ui.drill); break;
        case 'mode': self.ui.mode = el.getAttribute('data-v'); self.render(); break;
        case 'drill': { var dv = el.getAttribute('data-v'); self.ui.drill = dv === '' ? null : Number(dv); self.render(); break; }
        case 'choose': {
          var q = self.item(), i = Number(el.getAttribute('data-i')); s.answers['m:' + q.id] = i;
          if (s.mode === 'study') { var cf = s.fb['m:' + q.id]; if (cf && !cf.shown) cf.last = null; }
          self.save(); self.render(); break;
        }
        case 'check': {
          var qc = self.item(), kc = 'm:' + qc.id, okc = s.answers[kc] === qc.c, fc = s.fb[kc] || (s.fb[kc] = { tries: 0 });
          fc.tries++; if (fc.first == null) fc.first = okc; fc.last = okc ? 'right' : 'wrong'; self.save(); self.render(); break;
        }
        case 'retry': { var qr = self.item(); delete s.answers['m:' + qr.id]; s.fb['m:' + qr.id].last = null; self.save(); self.render(); break; }
        case 'reveal': { var qv = self.item(), fv = s.fb['m:' + qv.id] || (s.fb['m:' + qv.id] = { tries: 0 }); if (fv.first == null) fv.first = false; fv.shown = true; self.save(); self.render(); break; }
        case 'tcheck': case 'treveal': {
          var tt = self.item(), kt = 't:' + tt.id, ft = s.fb[kt] || (s.fb[kt] = {});
          var res = tt.rows.map(function (r, j) { return rowCorrect(tt, r, s.answers[kt + ':' + j]); });
          if (!ft.first) ft.first = res; ft.last = res; if (act === 'treveal') ft.shown = true; self.save(); self.render(); break;
        }
        case 'tretry': {
          var t2 = self.item(), k2 = 't:' + t2.id, f2 = s.fb[k2];
          if (f2 && f2.last) f2.last.forEach(function (ok, j) { if (ok === false) { delete s.answers[k2 + ':' + j]; f2.last[j] = null; } });
          self.save(); self.render(); break;
        }
        case 'prev': self.go(s.idx - 1); break;
        case 'next': self.go(s.idx + 1); break;
        case 'jump': self.go(Number(el.getAttribute('data-i'))); break;
        case 'flag': { var it = self.item(), k = self.itemKey(it, self.cur().kind); if (s.flags[k]) delete s.flags[k]; else s.flags[k] = 1; self.save(); self.render(); break; }
        case 'tab': self.ui.tab = Number(el.getAttribute('data-i')); self.render(); break;
        case 'review': self.ui.modal = 'review'; self.render(); break;
        case 'help': self.ui.modal = 'help'; self.render(); break;
        case 'exit': self.ui.modal = 'exit'; self.render(); break;
        case 'close': self.ui.modal = null; self.render(); break;
        case 'confirmSubmit': self.ui.modal = 'confirm'; self.render(); break;
        case 'submit': self.submitTestlet(); break;
        case 'takeBreak': self.takeBreak(); break;
        case 'endBreak': self.endBreak(); break;
        case 'calc': self.ui.calc = !self.ui.calc; self.render(); break;
        case 'resume': s.paused = false; self.save(); self.render(); break;
        case 'pause': s.paused = true; self.ui.modal = null; self.save(); self.render(); break;
        case 'endNow': self.finish(false); break;
        case 'abandon': self.s = { phase: 'start' }; self.ui.modal = null; self.save(); self.render(); break;
        case 'filter': self.ui.filter = el.getAttribute('data-f'); self.render(); break;
        case 'retake': self.start(s.examId, s.mode, s.drill); break;
        case 'home': self.ui.sel = s.examId || self.ui.sel; self.s = { phase: 'start' }; self.save(); self.render(); break;
      }
    });
    root.addEventListener('contextmenu', function (ev) {
      var el = ev.target.closest('.aud-opt'); if (!el) return; ev.preventDefault();
      var q = self.item(), i = Number(el.getAttribute('data-i')), k = 'm:' + q.id, a = self.s.strikes[k] || [];
      var p = a.indexOf(i); if (p >= 0) a.splice(p, 1); else a.push(i); self.s.strikes[k] = a; self.save(); self.render();
    });
    var onInput = function (ev) {
      var el = ev.target; if (!el.hasAttribute || !el.hasAttribute('data-row')) return;
      var t = self.item(), k = 't:' + t.id + ':' + el.getAttribute('data-row');
      if (el.value === '') delete self.s.answers[k]; else self.s.answers[k] = el.tagName === 'SELECT' ? Number(el.value) : el.value;
      el.classList.toggle('filled', el.value !== '');
      if (self.s.mode === 'study') { var tf = self.s.fb['t:' + t.id], ri = Number(el.getAttribute('data-row')); if (tf && tf.last && !tf.shown) { tf.last[ri] = null; var mk = $(self.root, '[data-mk="' + ri + '"]'); if (mk) mk.innerHTML = ''; } }
      self.save();
    };
    root.addEventListener('change', onInput); root.addEventListener('input', onInput);
    root.addEventListener('keydown', function (ev) {
      var s = self.s; if (s.phase !== 'exam' || s.paused || self.ui.modal) return;
      if (/INPUT|SELECT|TEXTAREA/.test(ev.target.tagName)) return;
      var t = self.cur(); if (!t) return;
      if (ev.key === 'ArrowRight') { self.go(s.idx + 1); ev.preventDefault(); }
      else if (ev.key === 'ArrowLeft') { self.go(s.idx - 1); ev.preventDefault(); }
      else if (/^[fF]$/.test(ev.key)) { var it = self.item(), k = self.itemKey(it, t.kind); if (s.flags[k]) delete s.flags[k]; else s.flags[k] = 1; self.save(); self.render(); }
      else if (t.kind === 'mcq' && /^[a-dA-D]$/.test(ev.key)) { var q = self.item(), i = ev.key.toUpperCase().charCodeAt(0) - 65; if (i < q.o.length) { s.answers['m:' + q.id] = i; if (s.mode === 'study' && s.fb['m:' + q.id] && !s.fb['m:' + q.id].shown) s.fb['m:' + q.id].last = null; self.save(); self.render(); } }
    });
    if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '0');
    // drag: calculator + splitter
    root.addEventListener('mousedown', function (ev) {
      var h = ev.target.closest('[data-drag]'), sp = ev.target.closest('[data-split]');
      if (h && !ev.target.closest('button')) {
        var c = h.parentNode, rb = root.getBoundingClientRect(), cb = c.getBoundingClientRect(), dx = ev.clientX - cb.left, dy = ev.clientY - cb.top;
        var mv = function (e) { var x = Math.max(0, Math.min(rb.width - cb.width, e.clientX - rb.left - dx)), y = Math.max(0, Math.min(rb.height - 40, e.clientY - rb.top - dy)); c.style.left = x + 'px'; c.style.top = y + 'px'; c.style.right = 'auto'; self.ui.calcPos = { x: x, y: y }; };
        var up = function () { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
        document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up); ev.preventDefault();
      } else if (sp) {
        var wrap = sp.parentNode, left = sp.previousElementSibling, wb = wrap.getBoundingClientRect();
        var mv2 = function (e) { var p = Math.max(20, Math.min(80, (e.clientX - wb.left) / wb.width * 100)); left.style.flexBasis = p + '%'; self.ui.split = p; };
        var up2 = function () { document.removeEventListener('mousemove', mv2); document.removeEventListener('mouseup', up2); };
        document.addEventListener('mousemove', mv2); document.addEventListener('mouseup', up2); ev.preventDefault();
      }
    });
    // long-press strikeout for touch
    var lp; root.addEventListener('touchstart', function (ev) { var el = ev.target.closest('.aud-opt'); if (!el) return; lp = setTimeout(function () { el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true })); }, 600); }, { passive: true });
    root.addEventListener('touchend', function () { clearTimeout(lp); });
  };

  Exam.prototype.afterRender = function () { var b = $(this.root, '.aud-body'); if (b && this._lastPos !== this.s.testlet + ':' + this.s.idx) { b.scrollTop = 0; this._lastPos = this.s.testlet + ':' + this.s.idx; } };
  Exam.prototype.destroy = function () { clearInterval(this.tick); this.root.innerHTML = ''; };

  global.AUDExam = {
    config: CFG, areas: AREAS,
    mount: function (el, opts) { return new Exam(el, opts); },
    exams: function () { return buildExams(); },
    _grade: { rowCorrect: rowCorrect }
  };
})(typeof window !== 'undefined' ? window : this);
