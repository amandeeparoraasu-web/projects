import { replay, reconcile, compareSchemas } from "./engine.mjs";

const streamEvents = [["t1",22,500],["t2",8,1250],["t1",22,500],["t3",91,980],["t4",45,320]];
const ledger = { "TX-104":8500, "TX-105":12750, "TX-106":6200, "TX-108":1200 };
const schema = { id:"string", timestamp:"integer", cents:"integer" };
const demos = {
  stream: {
    title:"Event-time stream replay",
    description:"Replay out-of-order transactions and see how a lateness allowance changes the result.",
    scenarios:["15 seconds allowed","45 seconds allowed"],
    run(index) {
      const result = replay(streamEvents, index ? 45 : 15);
      return { metrics:[[result.rows.length,"Windows"],[result.duplicate,"Duplicates"],[result.late,"Late events"]],
        headers:["Window start (s)","Transactions","Total (cents)"],rows:result.rows };
    }
  },
  ledger: {
    title:"Ledger reconciliation",
    description:"Match internal transactions to an external settlement ledger by reference.",
    scenarios:["Settlement exceptions","All transactions match"],
    run(index) {
      const rows = reconcile(ledger,index ? ledger : {"TX-104":8500,"TX-105":12400,"TX-107":3100,"TX-108":1200});
      const matches = rows.filter(row => row[3] === "Matched").length;
      return { metrics:[[matches,"Matches"],[rows.length-matches,"Exceptions"]],
        headers:["Reference","Internal (cents)","Settlement (cents)","Status"],rows };
    }
  },
  schema: {
    title:"Schema compatibility",
    description:"Compare a candidate schema against the fields downstream consumers expect.",
    scenarios:["Add a field","Change type and remove field"],
    run(index) {
      const rows = compareSchemas(schema,index ? { id:"string", cents:"string" } : {...schema,currency:"string"});
      const breaks = rows.filter(row => ["Removed","Type changed"].includes(row[3])).length;
      return { metrics:[[breaks,"Breaking changes"],[breaks ? "No" : "Yes","Compatible"]],
        headers:["Field","Previous type","Candidate type","Status"],rows };
    }
  }
};
const select = document.querySelector("#scenario");
const results = document.querySelector("#results");
const buttons = document.querySelectorAll("[data-demo]");
let current;
function render() {
  const {metrics,headers,rows} = current.run(select.selectedIndex);
  results.innerHTML = `<div class="metrics">${metrics.map(([value,label]) => `<div class="metric"><strong>${value}</strong>${label}</div>`).join("")}</div>
  <div class="table-wrap"><table><thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join("")}</tr></thead>
  <tbody>${rows.map(row => `<tr>${row.map(value => `<td class="${/missing|mismatch|removed|type changed/i.test(value) ? "warn" : ""}">${value}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function choose(key) {
  current = demos[key];
  for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.demo === key));
  document.querySelector("#demo-title").textContent = current.title;
  document.querySelector("#demo-description").textContent = current.description;
  select.replaceChildren(...current.scenarios.map(label => new Option(label)));
  render();
}
for (const button of buttons) button.addEventListener("click", () => choose(button.dataset.demo));
select.addEventListener("change", render);
document.querySelector("#run").addEventListener("click", render);
choose("stream");
