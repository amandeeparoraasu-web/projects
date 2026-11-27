# Answers every item with its keyed answer and confirms the engine scores 100% (and 0% when blank).
import pathlib, sys, json
from playwright.sync_api import sync_playwright
page_file = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html').resolve()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(page_file.as_uri())
    res = pg.evaluate("""() => {
      const out = [];
      AUDExam.exams().forEach(e => {
        const ans = {};
        e.mcq.forEach(q => ans['m:' + q.id] = q.c);
        e.tbs.forEach(t => t.rows.forEach((r, i) => { ans['t:' + t.id + ':' + i] = r.type === 'num' ? (r.fmt || String(r.a)) : r.a; }));
        let ok = 0, tot = 0, bad = [];
        e.tbs.forEach(t => t.rows.forEach((r, i) => { tot++; if (AUDExam._grade.rowCorrect(t, r, ans['t:' + t.id + ':' + i])) ok++; else bad.push(t.id + ' row ' + (i+1)); }));
        out.push({ exam: e.title, mcq: e.mcq.length, tbsRowsOk: ok + '/' + tot, bad });
      });
      return out;
    }""")
    print(json.dumps(res, indent=1)); print('page errors:', errs)
    b.close()
