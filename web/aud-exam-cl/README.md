# CL · CPA AUD Mock Exam

A Prometric-style CPA **Auditing & Attestation (AUD)** practice exam: zero dependencies, drop-in for any site.
Every screen carries the **CL** badge ("Created with Claude (Anthropic)"), and every item has a CL-prefixed ID (e.g. `CL-E6-M04`, `CL-E6-T2`).

## Release 1: Hard Exam (AICPA-style)
- 78 MCQs (blueprint split 16 / 22 / 26 / 14 across Areas I–IV) and 7 TBS with exhibits
- TBS topics: attribute sampling, MUS design and evaluation, COSO principles and deficiency indicators, journal-entry data analytics, AP data analytics (duplicates, three-way match, split purchases), AU-C 265 communications, and an auditor's report document review
- The questions are original. They follow the style and difficulty of AICPA released questions but do not reproduce them.

## Modes
| Mode | What it does |
|---|---|
| **Study mode** (default) | **Check answer** gives instant right/wrong, then **Try again** or **Show answer** with an explanation for every option. TBS: check per task, retry incorrect cells, or show answers. Scored on first attempt. |
| **Exam simulation** | Real-exam conditions: 4:00:00, 5 testlets, locked once submitted, optional 15-min break after Testlet 3 (clock pauses). |
| **Pacing Coach** | Exam conditions plus a live ahead/behind bar per testlet and a nudge after 2:30 on one MCQ. |
| **Timed drills** | Any single testlet against its time budget (MCQ 50 min, TBS 40/55/40 min). |

Every attempt ends with a score report (estimated scaled score, pass/fail at 75, area breakdown), a **time-management report**, and a full answer key with explanations.

> The scaled score is an estimate. The AICPA uses IRT scoring, so 65% weighted raw is mapped to 75 (`AUDExam.config.rawAtPass`).

## Files
```
index.html            demo / release page (loads hard exam only)
dist/index.html       single-file build (everything inlined), easiest to deploy
aud-exam.js / .css    engine + scoped styles (.aud-root)
data/hard_*.js        Hard exam (release 1)
data/exam1a..exam5b   Exams 1–5 (standby; Exam 5 TBS not written yet)
react/AUDExam.jsx     React wrapper
tools/validate.js     node tools/validate.js   → structure / key checks
tools/keycheck.py     confirms every TBS key grades as correct
```

## Embed
```html
<link rel="stylesheet" href="/aud/aud-exam.css">
<div id="aud" style="height:100vh"></div>
<script src="/aud/data/hard_a.js"></script><script src="/aud/data/hard_b.js"></script><script src="/aud/data/hard_c.js"></script>
<script src="/aud/aud-exam.js"></script>
<script>AUDExam.mount(document.getElementById('aud'), { defaultMode: 'study' });</script>
```
To add more exams later, include their data files (e.g. `data/exam1a.js`, `exam1b.js`, `exam1c.js`) before `aud-exam.js`.

Progress is saved in the browser (localStorage), so a refresh resumes the attempt.
