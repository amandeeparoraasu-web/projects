(window.AUD_DATA = window.AUD_DATA || []).push({
exam: 2,
tbs: [
{a:1,title:"System of Quality Management Components",
instr:"<p>Halvorsen LLP is designing its system of quality management under SQMS No. 1. For each policy or activity in the exhibit, select the <b>component</b> of the system it most directly relates to. A component may be used once, more than once, or not at all.</p>",
exhibits:[{title:"Firm Policies",html:"<ol><li>The managing partner's performance evaluation and compensation explicitly depend on quality-related outcomes.</li><li>Before engaging a new client, the firm obtains background checks on the owners and inquires of the predecessor auditor.</li><li>All personnel annually confirm compliance with the firm's independence policies.</li><li>Engagement teams must consult the national office on complex revenue matters, and conclusions are documented and implemented.</li><li>The firm inspects a selection of completed engagements and performs root-cause analysis on findings.</li><li>The firm licenses and maintains audit methodology software and data analytics tools.</li><li>The firm shares inspection results with engagement teams and reports quality matters to its network.</li><li>The firm sets quality objectives and assesses how a growing number of cryptocurrency clients affects its quality risks.</li></ol>"}],
lists:{qm:["Governance and leadership","The firm's risk assessment process","Relevant ethical requirements","Acceptance and continuance of client relationships and specific engagements","Engagement performance","Resources","Information and communication","Monitoring and remediation process"]},
rows:[
{p:"Policy 1",list:"qm",a:0,e:"Leadership accountability and a culture that values quality fall under governance and leadership."},
{p:"Policy 2",list:"qm",a:3,e:"Evaluating client integrity before acceptance is part of acceptance and continuance."},
{p:"Policy 3",list:"qm",a:2,e:"Independence confirmations address relevant ethical requirements."},
{p:"Policy 4",list:"qm",a:4,e:"Consultation on difficult or contentious matters is part of engagement performance."},
{p:"Policy 5",list:"qm",a:7,e:"Inspections and root-cause analysis are monitoring and remediation activities."},
{p:"Policy 6",list:"qm",a:5,e:"Technological and intellectual resources (methodology, tools) fall under resources."},
{p:"Policy 7",list:"qm",a:6,e:"Communicating quality information internally and externally falls under information and communication."},
{p:"Policy 8",list:"qm",a:1,e:"Establishing objectives and identifying and assessing quality risks is the firm's risk assessment process."}
],ref:"SQMS No. 1 (QM 10)"},

{a:2,title:"Fraud Risk Factors",
instr:"<p>During planning for <b>Brightline Retail, Inc.</b>, the team identified the conditions in the exhibit. For each, select the fraud triangle element and the type of fraud it most directly relates to.</p>",
exhibits:[{title:"Conditions Noted",html:"<ol><li>Brightline must maintain a minimum current ratio of 1.5 under a new loan agreement; the ratio is currently 1.52.</li><li>The CEO dominates management, and the board rarely challenges her decisions.</li><li>Store managers handle large cash receipts, and no one reconciles daily register tapes to deposits.</li><li>The CFO has repeatedly argued that “everyone in retail” stretches inventory reserve assumptions.</li><li>Several warehouse employees have been told they will be laid off next quarter.</li><li>Inventory of small, high-value electronics is kept in an unlocked area.</li></ol>"}],
lists:{tri:["Incentive / pressure","Opportunity","Attitude / rationalization"],typ:["Fraudulent financial reporting","Misappropriation of assets"]},
rows:[
{p:"Condition 1: element",list:"tri",a:0,e:"Debt covenant thresholds create pressure to manipulate results."},
{p:"Condition 1: type",list:"typ",a:0,e:"Covenant pressure relates to misstating financial results."},
{p:"Condition 2: element",list:"tri",a:1,e:"Domination by a single person with ineffective board oversight creates opportunity."},
{p:"Condition 3: element",list:"tri",a:1,e:"Lack of reconciliation over cash creates opportunity."},
{p:"Condition 3: type",list:"typ",a:1,e:"Unreconciled cash receipts enable theft of cash."},
{p:"Condition 4: element",list:"tri",a:2,e:"Justifying aggressive estimates because “everyone does it” is rationalization."},
{p:"Condition 5: element",list:"tri",a:0,e:"Known or anticipated layoffs create pressure or grievances (an AU-C 240 misappropriation factor), often combined with attitude."},
{p:"Condition 6: type",list:"typ",a:1,e:"Small, high-value, unsecured items are susceptible to theft."}
],ref:"AU-C 240 Appendix A"},

{a:3,title:"Interbank Transfers and Cash Cutoff",
instr:"<p>Ferris Co. maintains accounts at <b>First Bank</b> and <b>City Bank</b>. Year-end is December 31. Using the bank transfer schedule, evaluate each transfer and compute the requested amounts. Enter whole dollars.</p>",
exhibits:[{title:"Bank Transfer Schedule",html:"<table><tr><th rowspan='2'>Check #</th><th rowspan='2' class='num'>Amount</th><th colspan='2'>Disbursing (First Bank)</th><th colspan='2'>Receiving (City Bank)</th></tr><tr><th>Per books</th><th>Per bank</th><th>Per books</th><th>Per bank</th></tr><tr><td>501</td><td class='num'>40,000</td><td>Dec 31</td><td>Jan 3</td><td>Dec 31</td><td>Dec 31</td></tr><tr><td>502</td><td class='num'>25,000</td><td>Jan 2</td><td>Jan 4</td><td>Dec 30</td><td>Dec 31</td></tr><tr><td>503</td><td class='num'>15,000</td><td>Dec 30</td><td>Jan 3</td><td>Jan 2</td><td>Jan 3</td></tr><tr><td>504</td><td class='num'>30,000</td><td>Dec 31</td><td>Dec 31</td><td>Dec 31</td><td>Jan 2</td></tr></table><p>The First Bank reconciliation lists check 501 as outstanding. The City Bank reconciliation lists check 504 as a deposit in transit.</p>"}],
lists:{tr:["Properly recorded: appears as an outstanding check on the disbursing bank reconciliation","Properly recorded: appears as a deposit in transit on the receiving bank reconciliation","Cash overstated: receipt recorded before disbursement (possible kiting)","Cash understated: disbursement recorded before receipt"]},
rows:[
{p:"Check 501",list:"tr",a:0,e:"Both sides were recorded in December. The check had not cleared First Bank until January, so it is properly listed as outstanding."},
{p:"Check 502",list:"tr",a:2,e:"The receipt was recorded December 30 but the disbursement not until January 2. The $25,000 is counted in both accounts at year-end, overstating cash. This is a classic kiting pattern."},
{p:"Check 503",list:"tr",a:3,e:"The disbursement was recorded in December and the receipt in January. The funds appear in neither account, understating cash."},
{p:"Check 504",list:"tr",a:1,e:"Both sides were recorded December 31. City Bank received it January 2, so it is properly a deposit in transit."},
{p:"Adjustment required to correct the overstatement from check 502 (decrease to cash)",type:"num",a:25000,tol:0,fmt:"25,000",e:"Record the $25,000 First Bank disbursement in December (credit First Bank cash). The City Bank receipt is already recorded, so this removes the double count."},
{p:"Net overstatement (understatement shown as negative) of total book cash at December 31 before adjustments",type:"num",a:10000,tol:0,fmt:"10,000",e:"Overstatement $25,000 (502) − understatement $15,000 (503) = net $10,000 overstated."}
],ref:"Cash cutoff and kiting procedures"},

{a:3,title:"Monetary Unit Sampling Evaluation",
instr:"<p>The auditor tested <b>accounts receivable</b> of Vesper Co. (recorded amount $900,000) using MUS with a sampling interval of <b>$15,000</b> and a 5% risk of incorrect acceptance. Tolerable misstatement is <b>$50,000</b>. Use the exhibits to complete the evaluation. Enter whole dollars.</p>",
exhibits:[{title:"Misstatements Found",html:"<table><tr><th>Item</th><th class='num'>Recorded amount</th><th class='num'>Audited amount</th></tr><tr><td>A</td><td class='num'>3,000</td><td class='num'>2,400</td></tr><tr><td>B</td><td class='num'>20,000</td><td class='num'>18,500</td></tr><tr><td>C</td><td class='num'>600</td><td class='num'>300</td></tr></table><p>All other sampled items had no misstatement.</p>"},{title:"Reliability Factors (5%)",html:"<table><tr><th>Number of overstatements</th><th class='num'>Reliability factor</th></tr><tr><td>0</td><td class='num'>3.00</td></tr><tr><td>1</td><td class='num'>4.75</td></tr><tr><td>2</td><td class='num'>6.30</td></tr><tr><td>3</td><td class='num'>7.76</td></tr></table><p>Incremental allowance factor for the <i>n</i>th ranked tainting = (RF<sub>n</sub> − RF<sub>n−1</sub>) − 1.0. Rank taintings of items smaller than the interval from largest to smallest.</p>"}],
rows:[
{p:"Projected misstatement: Item A",type:"num",a:3000,tol:0,fmt:"3,000",e:"Tainting 600 ÷ 3,000 = 20% × $15,000 interval = $3,000."},
{p:"Projected misstatement: Item B",type:"num",a:1500,tol:0,fmt:"1,500",e:"Item B exceeds the interval, so the actual misstatement ($1,500) is used, with no projection."},
{p:"Projected misstatement: Item C",type:"num",a:7500,tol:0,fmt:"7,500",e:"Tainting 300 ÷ 600 = 50% × $15,000 = $7,500."},
{p:"Basic precision",type:"num",a:45000,tol:0,fmt:"45,000",e:"RF(0) 3.00 × $15,000 = $45,000."},
{p:"Incremental allowance for sampling risk",type:"num",a:7275,tol:0,fmt:"7,275",e:"Rank C (7,500) then A (3,000). C: (4.75 − 3.00 − 1) = 0.75 × 7,500 = 5,625. A: (6.30 − 4.75 − 1) = 0.55 × 3,000 = 1,650. Total $7,275. Item B (≥ interval) gets no allowance."},
{p:"Upper misstatement limit",type:"num",a:64275,tol:0,fmt:"64,275",e:"Projected 12,000 + basic precision 45,000 + incremental 7,275 = $64,275."},
{p:"Conclusion",o:["The recorded amount is not materially misstated; accept","The upper misstatement limit exceeds tolerable misstatement; the auditor cannot conclude the balance is fairly stated and should take further action","Increase the sampling interval and re-evaluate","Projected misstatement is below tolerable, so accept"],a:1,e:"$64,275 > $50,000 tolerable misstatement. The auditor should request adjustment, perform additional procedures, or consider the effect on the opinion. Comparing only projected misstatement ignores sampling risk."}
],ref:"AICPA Audit Sampling Guide (MUS)"},

{a:3,title:"Inventory Procedures and Assertions",
instr:"<p>For each procedure performed during the audit of <b>Mallory Manufacturing's</b> inventory, select the <b>primary assertion</b> tested.</p>",
exhibits:[{title:"Procedures",html:"<ol><li>Select items from the warehouse floor and trace them to the count sheets.</li><li>Select items from the final inventory listing and trace them to count tags and then to the floor.</li><li>Examine vendor invoices for a sample of items to verify unit costs used.</li><li>Inspect consignment agreements and confirm goods held by Mallory for others.</li><li>Review the inventory note for disclosure of costing method and pledged inventory.</li><li>Compare subsequent sales prices of slow-moving items to their carrying amounts.</li><li>Obtain the last receiving and shipping document numbers at the count and test transactions around them.</li></ol>"}],
lists:{as:["Existence","Completeness","Rights and obligations","Accuracy, valuation and allocation","Cutoff","Presentation"]},
rows:[
{p:"Procedure 1",list:"as",a:1,e:"Floor to records tests that all items on hand are recorded."},
{p:"Procedure 2",list:"as",a:0,e:"Records to floor tests that recorded items exist."},
{p:"Procedure 3",list:"as",a:3,e:"Verifying unit costs tests valuation."},
{p:"Procedure 4",list:"as",a:2,e:"Goods held for others are not owned. This tests rights."},
{p:"Procedure 5",list:"as",a:5,e:"Disclosure of method and pledges relates to presentation."},
{p:"Procedure 6",list:"as",a:3,e:"Comparing NRV to cost tests valuation (lower of cost and NRV)."},
{p:"Procedure 7",list:"as",a:4,e:"Capturing document numbers at the count tests recording in the proper period."}
],ref:"AU-C 501; assertions"},

{a:4,title:"Determining the Appropriate Auditor's Report",
instr:"<p>For each independent situation involving audits of nonissuers, select the <b>most appropriate</b> report. Assume each matter is material and all other matters are satisfactory.</p>",
exhibits:[{title:"Situations",html:"<ol><li>The entity changed from the weighted-average to the FIFO inventory method; the change is justified and properly applied retrospectively.</li><li>The client refused to provide written representations required by AU-C 580.</li><li>A lawsuit with a material but not pervasive possible effect could not be evaluated because counsel refused to respond; no alternative evidence exists.</li><li>Leases were not recognized on the balance sheet; the effect is material but not pervasive.</li><li>Substantial doubt about going concern exists and is adequately disclosed.</li><li>The client omitted the statement of cash flows.</li><li>The auditor wants to note that the prior-year statements were audited by a predecessor whose report is not presented.</li><li>Multiple significant misstatements make the statements as a whole misleading.</li></ol>"}],
lists:{rp:["Unmodified","Unmodified + emphasis-of-matter paragraph","Unmodified + other-matter paragraph","Unmodified + going concern section","Qualified","Adverse","Disclaimer"]},
rows:[
{p:"Situation 1",list:"rp",a:1,e:"A justified change in accounting principle requires an EOM paragraph (AU-C 708)."},
{p:"Situation 2",list:"rp",a:6,e:"Refusal to provide required representations leads to a disclaimer (or withdrawal) under AU-C 580."},
{p:"Situation 3",list:"rp",a:4,e:"A scope limitation that is material but not pervasive results in a qualified opinion."},
{p:"Situation 4",list:"rp",a:4,e:"A material but not pervasive GAAP departure results in a qualified opinion."},
{p:"Situation 5",list:"rp",a:3,e:"A “Substantial Doubt About the Entity's Ability to Continue as a Going Concern” section is required."},
{p:"Situation 6",list:"rp",a:4,e:"Omission of the cash flow statement is a departure from GAAP. AU-C 705 indicates a qualified opinion (the auditor is not required to prepare the statement)."},
{p:"Situation 7",list:"rp",a:2,e:"Reference to a predecessor whose report is not presented goes in an other-matter paragraph."},
{p:"Situation 8",list:"rp",a:5,e:"Material and pervasive misstatement results in an adverse opinion."}
],ref:"AU-C 570, 700, 705, 706, 708"},

{a:1,title:"SSARS Engagement Requirements",
instr:"<p>A client of Pine &amp; Oak, CPAs is deciding among a <b>preparation</b> engagement (AR-C 70), a <b>compilation</b> (AR-C 80), and a <b>review</b> (AR-C 90). For each requirement or characteristic, select the engagement type(s) to which it applies.</p>",
exhibits:[{title:"Engagement Overview",html:"<p>The client is a privately held distributor that needs financial statements for its bank. It is considering which SSARS service to request. Pine &amp; Oak's tax partner has a material direct financial interest in the client.</p>"}],
lists:{ss:["Preparation only","Compilation only","Review only","Compilation and review","Preparation and compilation","All three"]},
rows:[
{p:"Independence is required.",list:"ss",a:2,e:"Only a review requires independence. A compilation may be performed with disclosure of the lack of independence. Preparation requires no independence determination."},
{p:"An accountant's report is required.",list:"ss",a:3,e:"Compilations and reviews require a report. Preparation engagements do not."},
{p:"Limited assurance is obtained.",list:"ss",a:2,e:"Only a review provides limited assurance."},
{p:"A statement that “no assurance is provided” must be included on each page of the financial statements (when no report is issued).",list:"ss",a:0,e:"AR-C 70 requires the legend on each page (or a disclaimer)."},
{p:"An engagement letter or other written agreement signed by the accountant and management is required.",list:"ss",a:5,e:"All three SSARS engagements require a written agreement."},
{p:"Inquiry and analytical procedures must be performed to obtain evidence.",list:"ss",a:2,e:"Those are the primary review procedures."},
{p:"A management representation letter is required.",list:"ss",a:2,e:"Only a review requires written representations."},
{p:"Financial statements may omit substantially all disclosures required by the framework.",list:"ss",a:4,e:"Preparation and compilation engagements permit omission (disclosed). A review does not."}
],ref:"AR-C 70, 80, 90"}
]});
