(() => {
  'use strict';
  const {exams, areas, version, author} = AudBank;
  const examLabel = exam => 'Exam '+(exams.indexOf(exam)+1)+' ('+exam.author+')';
  const engine = AudEngine;
  const main = document.querySelector('#main');
  const clock = document.querySelector('#clock');
  const status = document.querySelector('#announcement');
  const dialog = document.querySelector('#confirm');
  const storageKey = 'aud-simulator.v' + version;
  let attempts = {};
  let saveError = false;
  let active = null;
  let confirmAction;
  let lastWarning = null;
  const clean = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (!data || typeof data !== 'object' || Array.isArray(data)) return;
      for (const exam of exams) {
        const state = data[exam.id];
        if (state && Number.isFinite(state.deadline) && Number.isInteger(state.index)
            && exam.items[state.index] && state.responses && state.visited && state.flags) attempts[exam.id] = state;
      }
    } catch { saveError = true; }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(attempts)); saveError = false; }
    catch { saveError = true; }
    const warning = document.querySelector('#save-warning');
    if (warning) warning.hidden = !saveError;
  }
  const remember = '<p class="notice" id="save-warning" role="status" hidden>Browser storage is unavailable. Keep this tab open to preserve your attempt.</p>';
  function state() { return attempts[active.id]; }
  function announce(message) { status.textContent = message; }
  function focusHeading() { main.querySelector('h1')?.focus(); }
  function home() {
    active = null;
    clock.hidden = true;
    for (const exam of exams) if (attempts[exam.id] && engine.expire(attempts[exam.id], Date.now())) save();
    main.innerHTML = '<section class="intro"><h1 tabindex="-1">CPA Audit Mock Exam Suite <span class="author">'+clean(author)+'</span></h1><p>Practice Auditing and Attestation under a four-hour timer. Use the suggested checkpoints to protect time for the simulations. Each form includes 78 multiple-choice questions and seven task-based simulations across five testlets.</p><p class="meta">Independent practice module · 2026 AICPA blueprint</p></section>' + remember +
      '<section class="grid" aria-label="Practice exams">' + exams.map(exam => {
        const attempt = attempts[exam.id];
        const completed = attempt?.completed;
        const progress = attempt && exam.items.filter(item => engine.isComplete(item,attempt)).length;
        return '<article class="card"><div><div class="meta">'+clean(examLabel(exam))+'</div><h2>'+clean(exam.title)+'</h2>'+ (exam===exams[0]?'<p>Start here for a timed benchmark with more involved cases.</p>':'')+'<p class="meta">'+(completed?'Completed · Practice score '+engine.grade(exam,attempt).score:attempt?progress+' of 85 complete':'85 items · 240 minutes')+'</p></div><button class="primary" data-open="'+exam.id+'">'+(completed?'View results':attempt?'Resume exam':'Start exam')+'</button></article>';
      }).join('')+'</section><footer class="meta">Forms revisit the same blueprint concepts through alternate prompts and case exhibits. Timing continues when you leave an attempt. <a href="https://www.aicpa-cima.com/resources/article/learn-what-is-tested-on-the-cpa-exam">AICPA CPA Exam blueprint</a></footer>';
    document.querySelector('#save-warning').hidden = !saveError;
    document.title = 'CPA Audit Mock Exam Suite — '+author;
    focusHeading();
  }
  function tick() {
    if (!active || state().completed) return;
    const now = Date.now();
    if (engine.expire(state(), now)) {
      save();
      if (dialog.open) dialog.close('cancel');
      result();
      focusHeading();
      announce('Time expired. The exam was submitted.');
      return;
    }
    const seconds = Math.max(0,Math.ceil((state().deadline-now)/1000));
    const display = [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(number => String(number).padStart(2,'0')).join(':');
    if (clock.textContent !== display) clock.textContent = display;
    clock.dataset.urgent = seconds<=300;
    const target = document.querySelector('#checkpoint');
    if (target) {
      const testlet = active.items[state().index].testlet;
      const targetLeft = seconds-(240-engine.deadlines[testlet-1])*60;
      const copy = (targetLeft>=0?'Time to checkpoint: ':'Past checkpoint by: ')+formatDuration(Math.abs(targetLeft));
      if (target.textContent!==copy) target.textContent=copy;
      target.classList.toggle('result-bad',targetLeft<0);
    }
    const warning = seconds<=60?1:seconds<=300?5:null;
    if (warning && lastWarning !== warning) announce(warning+' minute'+(warning===1?'':'s')+' or less remaining.');
    lastWarning = warning;
  }
  function formatDuration(seconds) {
    const total = Math.floor(seconds);
    return Math.floor(total/60)+':'+String(total%60).padStart(2,'0');
  }
  function paceReport(grade) {
    const actual = state().pacing?.seconds;
    if (!actual) return '';
    return '<section class="confidence"><h2>Testlet pacing</h2><p>Use the five time budgets as practice checkpoints. Time away counts toward the last active testlet.</p>'+
      '<div class="table-wrap"><table><thead><tr><th scope="col">Testlet</th><th scope="col">Budget</th><th scope="col">Time used</th><th scope="col">Blank items</th><th scope="col">Flagged</th></tr></thead><tbody>'+
      engine.pacing.map((minutes,i)=>{
        const rows=grade.rows.filter(row=>row.item.testlet===i+1);
        const blanks=rows.filter(({item})=>!engine.hasAnswer(item,state())).length;
        const flags=rows.filter(({item})=>state().flags[item.id]).length;
        return '<tr><th scope="row">'+(i+1)+'</th><td>'+minutes+' min</td><td class="'+(actual[i]>minutes*60?'result-bad':'')+'">'+formatDuration(actual[i])+'</td><td>'+blanks+'</td><td>'+flags+'</td></tr>';
      }).join('')+'</tbody></table></div></section>';
  }
  function palette() {
    const current = state();
    const question = active.items[current.index];
    return active.items.map((item,i) => {
      if (item.testlet !== question.testlet) return '';
      const complete = engine.isComplete(item,current);
      const partial = engine.hasAnswer(item,current);
      const description = complete?'answered':partial?'partially answered':current.visited[item.id]?'visited, unanswered':'unvisited';
      const flag = current.flags[item.id];
      const stateName = complete?'answered':current.visited[item.id]?'visited':'unvisited';
      return '<button data-go="'+i+'" data-status="'+stateName+'" aria-label="Item '+(i+1)+', '+description+(flag?', flagged':'')+'" '+(i===current.index?'aria-current="true"':'')+'>'+(i+1)+(flag?'<span class="flag" aria-hidden="true"> ⚑</span>':complete?'<span aria-hidden="true"> ✓</span>':partial?'<span aria-hidden="true"> ◐</span>':current.visited[item.id]?'<span aria-hidden="true"> ·</span>':'')+'</button>';
    }).join('');
  }
  function refreshProgress() {
    const current = state();
    document.querySelector('#palette').innerHTML = palette();
    document.querySelector('#progress').textContent = active.items.filter(item => engine.isComplete(item,current)).length+' of '+active.items.length+' items complete';
  }
  function exhibits(item) {
    return (item.exhibits||[]).map(exhibit => '<section class="exhibit"><h3>'+clean(exhibit.title)+'</h3><ul>'+exhibit.lines.map(line=>'<li>'+clean(line)+'</li>').join('')+'</ul></section>').join('');
  }
  function question(focus=true) {
    const current = state();
    if (current.completed || engine.expire(current, Date.now())) {
      save(); result(); focusHeading(); return;
    }
    const item = active.items[current.index];
    if (!current.pacing) engine.track(current,item.testlet,Date.now());
    const selected = current.responses[item.id] || {};
    const isFlagged = Boolean(current.flags[item.id]);
    const type = item.kind==='mcq'?'Multiple choice':'Task-based simulation';
    clock.hidden = false;
    document.title = active.title+' · '+author+' AUD';
    main.innerHTML = '<nav class="toolbar" aria-label="Exam controls"><button data-home>All exams</button>'+
      Array.from({length:5},(_,i)=>'<button data-testlet="'+(i+1)+'" '+(item.testlet===i+1?'aria-current="step" disabled':'')+'>Testlet '+(i+1)+'</button>').join('')+
      '<button class="primary push" data-submit>Submit exam</button></nav>'+remember+
      '<div class="workspace"><section class="panel question"><div class="meta">'+clean(active.title)+' · '+type+'</div><div class="actions"><h1 tabindex="-1">Item '+(current.index+1)+'</h1><button class="push" data-flag aria-pressed="'+isFlagged+'"><span aria-hidden="true">⚑</span> Flag item</button></div>'+
      (item.title?'<h2>'+clean(item.title)+'</h2>':'')+(item.context?'<p class="meta">'+clean(item.context)+'</p>':'')+
      '<p>'+clean(item.prompt)+'</p>'+exhibits(item)+
      item.parts.map((part,i)=> item.kind==='mcq'
        ? '<fieldset><legend>'+clean(part.prompt)+'</legend>'+part.options.map((option,j)=>'<label class="option"><input type="radio" name="part-'+i+'" data-part="'+i+'" value="'+j+'" '+(selected[i]===j?'checked':'')+'><span><strong>'+String.fromCharCode(65+j)+'.</strong> '+clean(option)+'</span></label>').join('')+'</fieldset>'
        : '<label class="part"><strong>'+clean(part.prompt)+'</strong><select data-part="'+i+'"><option value="">Choose an answer</option>'+part.options.map((option,j)=>'<option value="'+j+'" '+(selected[i]===j?'selected':'')+'>'+clean(option)+'</option>').join('')+'</select></label>').join('')+
      '<div class="actions confidence"><label for="item-confidence">Confidence</label><select id="item-confidence"><option value="">Optional</option>'+
      ['Low','Medium','High'].map(level=>'<option '+(current.confidence?.[item.id]===level?'selected':'')+'>'+level+'</option>').join('')+'</select></div>'+
      '<div class="actions question-foot"><button data-go="'+(current.index-1)+'" '+(!current.index?'disabled':'')+'>Previous</button><button class="primary" data-go="'+(current.index+1)+'" '+(current.index===active.items.length-1?'disabled':'')+'>Next</button><button data-clear class="push" '+(!engine.hasAnswer(item,current)?'disabled':'')+'>Clear responses</button></div></section>'+
      '<aside class="panel" aria-label="Question status"><h2>Testlet '+item.testlet+'</h2><div class="pacing"><p><strong id="checkpoint"></strong><br><span class="meta">Budget '+engine.pacing[item.testlet-1]+' min · target '+(240-engine.deadlines[item.testlet-1])+' min left overall</span></p><p class="meta">'+(item.kind==='mcq'?'Aim for about 69 seconds per question.':'Divide the budget across the cases in this testlet.')+' Flag, make your best choice, and move on when a question is taking too long.</p></div><p class="meta" id="progress"></p><nav class="palette" id="palette" aria-label="Jump to an item"></nav><div class="legend"><span>✓ Answered</span><span>· Visited</span><span>◐ Partial</span><span>Plain number · unvisited</span><span>⚑ Flagged</span></div></aside></div>';
    document.querySelector('#save-warning').hidden = !saveError;
    refreshProgress();
    tick();
    if (focus) focusHeading();
  }
  function result() {
    clock.hidden = true;
    const grade = engine.grade(active,state());
    document.title = 'Results · '+examLabel(active);
    const confident = grade.rows.filter(({item})=>state().confidence?.[item.id]==='High' && engine.hasAnswer(item,state()));
    const strongMisses = confident.filter(row=>row.earned<1).length;
    main.innerHTML = '<nav class="toolbar" aria-label="Results controls"><button data-home>All exams</button><button data-retake>Retake exam</button></nav>'+remember+
      '<section class="panel summary"><div class="meta">'+clean(examLabel(active))+' · '+clean(active.title)+'</div><h1 tabindex="-1">Exam results</h1><p class="score">'+grade.score.toFixed(2)+' <span class="'+(grade.pass?'result-good':'result-bad')+'">'+(grade.pass?'Pass':'Fail')+'</span></p><p>Practice score out of 100 · Passing threshold 75'+(state().completed.reason==='time'?' · Submitted when time expired':'')+'</p><p class="meta">The practice score weights multiple choice and simulations equally, with partial credit by simulation response. The official CPA Exam uses scaled scoring. <a href="https://www.aicpa-cima.com/resources/article/learn-more-about-cpa-exam-scoring-and-pass-rates">AICPA scoring methodology</a></p><h2>Performance by blueprint area</h2><ul class="area-list">'+
      grade.areas.map((area,i)=>'<li><strong>'+Math.round(100*area.earned/area.total)+'%</strong> '+clean(areas[i])+'</li>').join('')+'</ul><div class="confidence"><h2>Confidence review</h2><p>'+(confident.length?strongMisses+' of '+confident.length+' high-confidence items lost credit. Use the review filter to revisit them.':'Rate your confidence while answering to see which high-confidence items lost credit.')+'</p></div>'+paceReport(grade)+'</section>'+
      '<div class="toolbar"><label for="filter">Review items</label><select id="filter"><option value="all">All items</option><option value="missed">Incorrect or incomplete</option><option value="flagged">Flagged items</option><option value="confidence">High-confidence misses</option></select><span class="meta" id="review-count" role="status"></span></div><div id="review">'+
      grade.rows.map(({item,parts,earned},i)=>'<details class="panel review" data-missed="'+(earned<1)+'" data-flagged="'+Boolean(state().flags[item.id])+'" data-confidence="'+(earned<1 && confident.some(row=>row.item===item))+'"><summary>Item '+(i+1)+' · '+clean(item.title || 'Multiple choice')+' · <span class="'+(earned===1?'result-good':'result-bad')+'">'+(earned===1?'Correct':earned>0?'Partial credit':'Incorrect or unanswered')+'</span></summary><article><p class="meta">'+clean(areas[item.area])+'</p>'+(item.context?'<p class="meta">'+clean(item.context)+'</p>':'')+'<p>'+clean(item.prompt)+'</p>'+exhibits(item)+
      item.parts.map((part,j)=>'<section class="review-line"><h3>'+clean(part.prompt)+'</h3><p><strong>Your answer</strong> · '+clean(parts[j].selected??'Unanswered')+'</p><p><strong>Correct answer</strong> · '+clean(part.key)+'</p><ol>'+part.steps.map(step=>'<li>'+clean(step)+'</li>').join('')+'</ol><h4>Why each option is right or wrong</h4><ul>'+part.options.map(option=>'<li><strong>'+clean(option)+'</strong> · '+clean(part.optionReasons[option])+'</li>').join('')+'</ul><a href="'+clean(part.source.url)+'">Professional literature · '+clean(part.source.ref)+'</a></section>').join('')+'</article></details>').join('')+'</div>';
    document.querySelector('#save-warning').hidden = !saveError;
    filterReview('all');
  }
  function filterReview(value) {
    let count = 0;
    for (const row of document.querySelectorAll('.review')) {
      row.hidden = value !== 'all' && row.dataset[value] !== 'true';
      if (!row.hidden) count++;
    }
    document.querySelector('#review-count').textContent = count+' items';
  }
  function ask(title, copy, action) {
    dialog.querySelector('h2').textContent = title;
    dialog.querySelector('p').textContent = copy;
    dialog.returnValue = 'cancel';
    confirmAction = action;
    dialog.showModal();
  }
  dialog.addEventListener('close', () => {
    const action = confirmAction;
    confirmAction = null;
    if (dialog.returnValue === 'accept') action?.();
  });
  main.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    const {open, go, testlet} = target.dataset;
    if ('home' in target.dataset) { home(); return; }
    if (open) {
      active = exams.find(exam=>exam.id===open);
      if (!attempts[open]) {
        attempts[open] = engine.create(active,Date.now());
        save();
      }
      lastWarning = null;
      question();
      return;
    }
    if (!active) return;
    const current = state();
    if ('retake' in target.dataset) {
      ask('Start a new attempt?', 'This replaces the saved result for this exam.', () => {
        attempts[active.id] = engine.create(active,Date.now());
        save(); question();
      });
      return;
    }
    tick();
    if (current.completed) return;
    const item = active.items[current.index];
    if (go !== undefined || testlet !== undefined) {
      const next = go !== undefined ? Number(go) : active.items.findIndex(row=>row.testlet===Number(testlet));
      if (!active.items[next]) return;
      engine.track(current,active.items[next].testlet,Date.now());
      current.index = next;
      current.visited[active.items[next].id] = true;
      save(); question();
    } else if ('flag' in target.dataset) {
      current.flags[item.id] = !current.flags[item.id];
      target.setAttribute('aria-pressed',current.flags[item.id]);
      save(); refreshProgress();
      announce(current.flags[item.id]?'Item flagged.':'Flag removed.');
    } else if ('clear' in target.dataset) {
      delete current.responses[item.id];
      save(); question();
      announce('Item responses cleared.');
    } else if ('submit' in target.dataset) {
      const pending = active.items.filter(row=>!engine.isComplete(row,current)).length;
      ask('Submit this exam?', pending ? pending+' items have unanswered responses. Submitting ends the attempt.' : 'Submitting ends the attempt and opens the answer review.', () => {
        const now = Date.now();
        if (!engine.expire(current,now)) {
          engine.track(current,active.items[current.index].testlet,now);
          current.completed = {reason:'manual',at:now};
        }
        save(); result(); focusHeading();
      });
    }
  });
  main.addEventListener('change', event => {
    const target = event.target;
    if (target.id === 'filter') { filterReview(target.value); return; }
    if (!active || state().completed) return;
    if (target.id === 'item-confidence') {
      tick();
      const current = state();
      if (current.completed) return;
      const values = current.confidence ||= {};
      const id = active.items[current.index].id;
      if (target.value) values[id] = target.value;
      else delete values[id];
      save();
      return;
    }
    if (target.dataset.part === undefined) return;
    tick();
    const current = state();
    if (current.completed) return;
    const item = active.items[current.index];
    const values = current.responses[item.id] ||= {};
    if (target.value === '') delete values[target.dataset.part];
    else values[target.dataset.part] = Number(target.value);
    save(); refreshProgress();
    document.querySelector('[data-clear]').disabled = !engine.hasAnswer(item,current);
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  window.addEventListener('pageshow', tick);
  setInterval(tick,250);
  load(); home();
})();
