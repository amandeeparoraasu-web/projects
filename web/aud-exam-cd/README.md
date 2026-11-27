# CPA Audit Mock Exam Suite — CD

A static practice module with five four-hour forms based on the AICPA’s 2026 AUD blueprint. Each form has two 39-question multiple-choice testlets and three task-based testlets containing 2, 3, and 2 simulations.

## Deploy on your portfolio

Publish `aud-exam-cd.html` to a dedicated route, or deploy the modular files together and serve `index.html`. Link to the published URL from your portfolio. The app has no build step or external runtime dependencies. All asset URLs are relative. You can also embed the route in an iframe with an accessible title such as “CPA AUD Exam Simulator.” Use a same-origin iframe to retain browser storage reliably.

For local preview, run `python3 -m http.server 8000` from this directory and visit `http://localhost:8000/`.

## Practice behavior

- The timer uses a saved wall-clock deadline. Navigation, reloads, and time spent away consume the exam time. Returning after the deadline opens the graded results.
- Progress is stored in the browser for each exam. Retaking an exam replaces its previous attempt after confirmation.
- Attempt Exam 1 first as the timed benchmark. Its higher-rigor items and expanded simulations provide more decisions per case.
- The target budgets are 45, 45, 40, 65, and 45 minutes. Aim to reach the simulations with 150 minutes remaining. The scorecard compares actual testlet time to budget and shows where items were left blank.
- Jump freely across testlets during practice. Simulations use exhibit-driven selections and provide partial credit.
- The practice score gives equal weight to multiple-choice and simulation performance. Within each type, each item has equal value. The passing threshold is 75 out of 100. The official exam uses scaled scores.
- The selection page and results identify each form with its author label, CD.
- Optional confidence ratings surface high-confidence items that lost credit and provide a focused review filter.
- Review shows each response, the key, reasoning for every option, and the applicable professional literature. Blueprint-area results show item-level credit within each area.
- The forms contain original educational items. Multiple-choice forms reuse many concepts and choices with alternate prompts. Simulations use shared case frameworks and different exhibits, facts, or outcomes. Difficulty has not been psychometrically calibrated.

## Question bank

`question-bank.json` is the complete expanded bank. Each exam includes its duration and ordered items. Each item includes a stable ID, zero-based blueprint area, testlet, item type, prompt and response parts. Every part includes choices, the correct choice text as its key, reasoning steps and a literature reference. Simulations also include exhibits.

`bank.js`, `variants.js`, `rationales.js`, and `benchmark.js` are the editable authoring sources. After content changes, increment the bank version if item IDs, ordering, or choice order change so that saved attempts remain tied to the correct keys. Refresh the JSON export from this directory with:

```sh
node -e 'require("./variants.js"); require("./rationales.js"); require("./benchmark.js"); require("./bank.js"); console.log(JSON.stringify(AudBank, null, 2))' > question-bank.json
```

The frontend is intended for self-study. Browser-delivered question data includes the keys.

## References

- [AICPA Uniform CPA Examination Blueprints](https://www.aicpa-cima.com/resources/article/learn-what-is-tested-on-the-cpa-exam)
- [AICPA CPA Exam scoring](https://www.aicpa-cima.com/resources/article/learn-more-about-cpa-exam-scoring-and-pass-rates)
