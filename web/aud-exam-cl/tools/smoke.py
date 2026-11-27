import sys, pathlib
from playwright.sync_api import sync_playwright
root = pathlib.Path(sys.argv[1]).resolve()
errs=[]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width':1366,'height':820})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(root.as_uri())
    pg.screenshot(path='/tmp/shots/1_start.png')
    pg.click('[data-act=begin]')
    pg.click('.aud-opt >> nth=1'); pg.click('[data-act=flag]')
    pg.screenshot(path='/tmp/shots/2_mcq.png')
    pg.click('[data-act=calc]'); 
    for k in ['1','2','*','3','=']: pg.click(f'[data-k="{k}"]')
    print('calc:', pg.inner_text('.aud-calc-d .v'))
    pg.click('.aud-hdr [data-act=review]'); pg.screenshot(path='/tmp/shots/3_review.png'); pg.click('.aud-modal-f [data-act=close]')
    pg.click('.aud-calc-h [data-act=calc]')
    for t in range(2):
        pg.click('[data-act=confirmSubmit]'); pg.click('.aud-modal [data-act=submit]')
    pg.select_option('select[data-row="0"]', '0')
    pg.screenshot(path='/tmp/shots/4_tbs.png')
    pg.click('[data-act=confirmSubmit]'); pg.click('.aud-modal [data-act=submit]')
    pg.screenshot(path='/tmp/shots/5_break.png')
    pg.click('.aud-modal [data-act=takeBreak]'); pg.click('[data-act=endBreak]')
    pg.locator('input[data-row]').first.fill('30') if pg.locator('input[data-row]').count() else None
    for t in range(2):
        pg.click('[data-act=confirmSubmit]'); pg.click('.aud-modal [data-act=submit]')
    pg.screenshot(path='/tmp/shots/6_results.png', full_page=False)
    print('result header:', pg.inner_text('.aud-big'))
    pg.reload(); print('after reload phase ok:', pg.locator('.aud-big').count()==1)
    b.close()
print('page errors:', errs)
