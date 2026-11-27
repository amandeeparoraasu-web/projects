(() => {
  'use strict';
  const hasAnswer = (item, state) => item.parts.some((_, i) => state.responses[item.id]?.[i] != null);
  const isComplete = (item, state) => item.parts.every((_, i) => state.responses[item.id]?.[i] != null);
  const pacing = [45,45,40,65,45];
  const deadlines = pacing.map((_, i) => pacing.slice(0, i+1).reduce((sum, minutes) => sum+minutes, 0));
  function track(state, testlet, now) {
    state.pacing ||= { seconds:[0,0,0,0,0], testlet, since:now };
    const active = state.pacing;
    const stop = Math.min(now,state.deadline);
    active.seconds[active.testlet-1] += Math.max(0,stop-active.since)/1000;
    active.testlet = testlet;
    active.since = stop;
  }
  function create(exam, now) {
    return { started:now, deadline:now+exam.minutes*60000, index:0, responses:{}, confidence:{}, pacing:{seconds:[0,0,0,0,0],testlet:1,since:now}, flags:{}, visited:{[exam.items[0].id]:true}, completed:null };
  }
  function expire(state, now) {
    if (!state.completed && now >= state.deadline) {
      track(state, state.pacing?.testlet ?? 1, state.deadline);
      state.completed = { reason:'time', at:state.deadline };
      return true;
    }
    return false;
  }
  function grade(exam, state) {
    const types = { mcq:{earned:0,total:0}, tbs:{earned:0,total:0} };
    const areas = AudBank.areas.map(() => ({earned:0,total:0}));
    const rows = exam.items.map(item => {
      const parts = item.parts.map((part, i) => {
        const selected = part.options[state.responses[item.id]?.[i]];
        return { selected, correct:selected === part.key };
      });
      const earned = parts.filter(part => part.correct).length / parts.length;
      for (const bucket of [types[item.kind], areas[item.area]]) {
        bucket.earned += earned;
        bucket.total++;
      }
      return { item, parts, earned };
    });
    const score = Math.round(50*(types.mcq.earned/types.mcq.total + types.tbs.earned/types.tbs.total)*100)/100;
    return { score, pass:score>=75, areas, rows };
  }
  globalThis.AudEngine = { hasAnswer, isComplete, create, expire, grade, pacing, deadlines, track };
})();
