// node tools/validate.js  — checks every exam's structure and answer keys
global.window = global; const fs=require('fs'), path=require('path');
const dir=path.join(__dirname,'..','data');
fs.readdirSync(dir).filter(f=>/\.js$/.test(f)).sort().forEach(f=>require(path.join(dir,f)));
require('../aud-exam.js');
let bad=0; const err=m=>{bad++;console.log('  ✖ '+m)};
AUDExam.exams().forEach(e=>{
  const ac={1:0,2:0,3:0,4:0}; e.mcq.forEach((q,i)=>{ac[q.a]++;
    if(!AUDExam.areas[q.a])err(e.id+' mcq'+i+' bad area');
    if(!Array.isArray(q.o)||q.o.length!==4)err(e.id+' mcq'+i+' needs 4 options');
    if(!(q.c>=0&&q.c<q.o.length))err(e.id+' mcq'+i+' bad key');
    if(!q.r||q.r.length!==q.o.length)err(e.id+' mcq'+i+' rationale count');});
  let pts=0; const ta={1:0,2:0,3:0,4:0};
  e.tbs.forEach((t,i)=>{ta[t.a]++;t.rows.forEach((r,j)=>{pts++;
    if(r.type==='num'){if(typeof r.a!=='number')err(e.id+' tbs'+i+' row'+j+' num key');}
    else{const o=r.o||(t.lists||{})[r.list];if(!o)err(e.id+' tbs'+i+' row'+j+' no options');else if(!(r.a>=0&&r.a<o.length))err(e.id+' tbs'+i+' row'+j+' bad key');}
    if(!r.e)err(e.id+' tbs'+i+' row'+j+' no explanation');});});
  const keyDist=[0,0,0,0]; e.mcq.forEach(q=>keyDist[q.c]++);
  console.log(`Exam ${e.id}: MCQ ${e.mcq.length} (areas ${JSON.stringify(ac)}), key spread A-D ${keyDist}, TBS ${e.tbs.length} (${pts} pts, areas ${JSON.stringify(ta)})`);
  if(e.mcq.length!==78)err('exam '+e.id+' MCQ count '+e.mcq.length); if(e.tbs.length!==7)err('exam '+e.id+' TBS count '+e.tbs.length);
});
console.log(bad?bad+' problem(s)':'All checks passed'); process.exit(bad?1:0);
