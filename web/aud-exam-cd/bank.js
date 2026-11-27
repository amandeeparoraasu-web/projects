/* Original educational items. Authoring fields: source | scenario and task | key | three distractors | application. */
(() => {
  'use strict';
  const sas = 'https://www.aicpa-cima.com/resources/download/aicpa-statements-on-auditing-standards-currently-effective/';
  const ssars = 'https://www.aicpa-cima.com/resources/landing/preparation-compilation-and-review-standards';
  const code = 'https://pub.aicpa.org/codeofconduct/Ethics.aspx';
  const pcaob = 'https://pcaobus.org/oversight/standards/auditing-standards';
  const areas = [
    'Ethics, professional responsibilities and general principles',
    'Assessing risk and developing a planned response',
    'Performing further procedures and obtaining evidence',
    'Forming conclusions and reporting'
  ];
  const groups = [
`ET 1.240.010|A covered member discovers a directly owned shareholding in the audit client. Which conclusion applies while the shares are held?|Independence is impaired regardless of the amount invested.|Independence is impaired only if the investment is material.|Disclosure to the audit committee preserves independence.|An independent partner review cures the ownership interest.|Direct interests of covered members create an independence impairment even when financially insignificant.
ET 1.245.010|The spouse of a member on the audit team becomes the client’s controller. What is the effect?|The member’s independence is impaired.|Independence depends solely on whether the spouse owns shares.|The team can retain the member by disclosing the relationship.|Employment is evaluated as an ordinary non-key position.|A spouse is immediate family and a controller is in a key position with influence over financial reporting.
ET 1.295.030|A nonissuer audit client asks the firm to authorize adjusting entries on its behalf. Which response is appropriate?|Decline to assume the authorization responsibility.|Authorize the entries if the total dollar amount is immaterial.|Authorize the entries if a separate partner reviews them.|Authorize the entries after receiving general approval for the engagement.|Authorizing transactions is a management responsibility and creates an independence impairment.
ET 1.295.040|An audit client wants the firm to provide permissible bookkeeping assistance. What must the client agree to do?|Oversee the service through a suitably capable individual and accept responsibility for its results.|Delegate oversight entirely to the engagement team.|Hire a licensed CPA to repeat all the bookkeeping work.|Assign the audit firm responsibility for deciding which entries to post.|Management must oversee and evaluate the service and retain responsibility. Its designee needs suitable ability, not necessarily a CPA license.
ET 1.510.001|A firm auditing a client is offered a commission to recommend a vendor’s product to that client. Which response complies with the Code?|Decline the commission.|Accept it if the audit client consents in writing.|Accept it if another partner receives the payment.|Accept it if no recommendation appears in the audit report.|The commission prohibition applies when the member or firm performs covered services such as an audit for the client.
ET 1.520.001|A firm performs a financial statement audit for a client. The client offers to pay the audit fee only if financing closes. How should the firm respond?|Decline the contingent audit fee arrangement.|Accept the fee if the financing outcome is outside the firm’s control.|Accept if the audit committee agrees to the terms.|Accept if the base fee is disclosed in the engagement letter.|A fee whose payment depends on an outcome is contingent. The Code prohibits this arrangement for an audit.
ET 1.700.001|A valid, enforceable subpoena requires audit workpapers containing confidential client information. What may the auditor do?|Comply with the subpoena without obtaining client consent.|Require consent before complying with any subpoena.|Release the workpapers publicly before responding.|Disregard the subpoena because workpapers belong to the auditor.|The confidentiality rule allows compliance with a valid and enforceable subpoena.
ET 1.100.001|A supervisor asks an auditor to conceal a known material misstatement from the engagement partner. What is the appropriate response?|Refuse and escalate the matter through appropriate channels.|Comply if the supervisor takes responsibility in writing.|Omit the matter if the financial statements are still in draft.|Wait until after report issuance to raise the matter.|Integrity and objectivity prohibit knowingly misrepresenting facts or subordinating professional judgment.
AU-C 200|Which engagement objective reflects the assurance provided by a financial statement audit?|Obtain reasonable assurance that the statements as a whole are free of material misstatement.|Obtain absolute assurance about every transaction.|Certify that the entity will remain solvent.|Guarantee that all internal fraud has been detected.|Audit evidence and inherent limitations make reasonable assurance a high level of assurance short of certainty.
AU-C 210|Management refuses to acknowledge its responsibility for providing unrestricted access to relevant persons. What should the auditor ordinarily do before accepting the engagement?|Decline the engagement unless required by law or regulation.|Accept and plan to qualify the opinion automatically.|Accept if management signs a standard representation letter later.|Transfer management’s access responsibility to those charged with governance.|Agreement on management’s responsibilities is a precondition for an audit.
AU-C 210|In an initial audit, a prospective client refuses to authorize the predecessor to respond to inquiries. What should the auditor do?|Ask why and consider the implications for acceptance.|Accept immediately if the prior report was unmodified.|Ask the predecessor to disclose confidential details regardless.|Treat the refusal as proof of fraudulent reporting.|Communications with the predecessor inform acceptance. A refusal calls for investigating the reasons and evaluating the implications.
AU-C 220|An experienced associate performs the bulk of fieldwork. Who retains overall responsibility for managing and achieving engagement quality?|The engagement partner.|The associate with the most recorded hours.|The client’s chief financial officer.|The engagement quality reviewer.|The engagement partner retains responsibility even when engagement activities are assigned to others.
AU-C 230|Which file would best allow an experienced auditor with no prior connection to understand how a significant estimate was audited?|A file describing procedures, evidence, significant judgments and conclusions.|A sign-off showing only that the estimate was reviewed.|A copy of the final financial statements alone.|An oral explanation stored outside the audit file.|Documentation must show what was performed, what was found, and how significant judgments and conclusions were reached.
AU-C 260|Which matter is ordinarily appropriate to communicate to those charged with governance during a financial statement audit?|Significant qualitative aspects of accounting practices, including significant estimates.|Every individual transaction selected for testing.|The engagement team’s confidential compensation data.|An assurance that no immaterial error exists.|Governance communications include significant qualitative aspects that inform oversight of financial reporting.
AU-C 265|During the audit, a material weakness is identified. How should the auditor communicate it to those charged with governance?|In writing on a timely basis.|Only through an oral conversation with the controller.|Only if the financial statement opinion is modified.|Through the management representation letter.|Identified significant deficiencies and material weaknesses require written communication to governance on a timely basis.
AS 1000|In an issuer audit, management insists that the auditor accept an estimate because it has never been challenged before. What approach is appropriate?|Maintain a questioning mind and critically assess evidence.|Presume the estimate is valid because prior auditors accepted it.|Reject all management evidence as inherently false.|Accept oral assurances as conclusive evidence.|Professional skepticism entails a questioning mind and critical assessment, including when management has a credible history.`,
`AU-C 315|Management overrides approvals across multiple locations, potentially affecting many accounts. Where should the auditor first assess this pervasive risk?|At the financial statement level.|Only at the assertion level for revenue.|Only at the level of the largest transaction.|Only after tests of controls are complete.|A pervasive condition can affect the financial statements as a whole and influence many assertions.
AU-C 315|A new product warranty requires estimating claims for designs with no history. What inherent risk factor is most directly illustrated?|Estimation uncertainty.|Detection risk.|The effectiveness of an approval control.|Sampling risk.|A lack of relevant historical data increases uncertainty in the underlying estimate before considering controls.
AU-C 315|The auditor performs a walkthrough of a purchasing control by tracing one transaction and corroborating staff explanations. What can this directly support?|Understanding the control’s design and whether it was implemented.|Concluding the control operated effectively throughout the year.|Quantifying projected accounts payable misstatement.|Eliminating substantive testing for purchases.|A walkthrough can establish design and implementation. Period-wide operating effectiveness requires evidence responsive to that objective.
AU-C 315|Which procedure belongs in risk assessment for an initial audit?|Compare unexpected relationships in preliminary financial and nonfinancial data.|Require every customer to confirm an account balance.|Obtain the final management representation letter.|Issue a qualified opinion for each unexplained variance.|Preliminary analytical procedures help identify unusual relationships and risks for further investigation.
AU-C 320|A lender’s covenant depends on a small expense category. Why might the auditor establish a lower materiality level for that category?|A smaller misstatement could influence users’ decisions about compliance.|All account balances must use the same percentage threshold.|Materiality is determined solely by transaction volume.|Management dictates specific materiality at account level.|User sensitivity can justify a lower threshold for particular transaction classes, balances or disclosures.
AU-C 320|Why does the auditor set performance materiality below financial statement materiality?|To reduce the chance that aggregate uncorrected and undetected misstatements exceed materiality.|To prevent management from recording any audit adjustments.|To establish a minimum value below which errors never matter.|To set a legally permissible error amount.|Performance materiality addresses aggregation risk when planning and performing procedures.
AU-C 330|After obtaining new information, the auditor increases assessed risk for inventory valuation. What response is appropriate?|Obtain more persuasive substantive evidence for valuation.|Reduce substantive work because the risk is higher.|Use a higher detection risk and depend on management’s explanation.|Move all testing to an earlier date without further work.|Higher risk calls for more persuasive evidence and a lower acceptable level of detection risk.
AU-C 330|A financial application processes transactions entirely electronically, and substantive procedures alone cannot provide sufficient appropriate evidence. What is required?|Test the operating effectiveness of relevant controls.|Use only a larger sample of paper invoices.|Set control risk low based on design alone.|Replace controls testing with written representations.|When substantive procedures alone are insufficient, relevant controls must be tested.
AU-C 330|A nonissuer auditor does not intend to rely on controls for an inventory assertion and substantive procedures alone can provide sufficient appropriate evidence. What is the appropriate plan?|Design substantive procedures responsive to the assessed risk.|Assign low control risk without testing controls.|Eliminate substantive procedures because the controls were documented.|Test all controls over inventory regardless of the planned response.|A substantive approach is available under the stated facts, with procedures responsive to assessed risk.
AU-C 240|Management states that unusually high performance bonuses create a risk of misstating earnings. Which fraud risk factor is illustrated?|Incentive or pressure.|Opportunity.|Rationalization.|Detection risk.|A payout tied to results can create an incentive to manipulate reported earnings.
AU-C 240|Which procedure specifically responds to the risk of management override?|Test journal entries and other adjustments made in preparing the statements.|Obtain only an oral assertion that override never occurred.|Inspect one approved routine invoice and stop.|Ask the chief financial officer to select entries for the auditor.|Journal-entry and adjustment testing is a required response to management override risk.
AU-C 240|An auditor concludes that the presumed fraud risk relating to revenue recognition is inapplicable in the circumstances. What should the auditor do?|Document the reasons for the conclusion.|Ignore the presumption without recording a rationale.|Automatically issue a qualified opinion.|Obtain a waiver from management instead of documenting the judgment.|If the auditor rebuts the presumption, the rationale must be documented.
AU-C 250|A regulation directly determines the amount of a material tax liability. What does the auditor do in relation to that regulation?|Obtain sufficient appropriate evidence regarding compliance with its relevant provisions.|Limit all work to asking management whether the regulator has contacted them.|Treat the regulation as relevant solely to operations.|Disregard compliance if the calculation was outsourced.|Laws with direct effects on material amounts and disclosures warrant evidence about compliance with relevant provisions.
AU-C 402|A payroll service auditor’s Type 1 report is available. What does it support on its own?|Understanding relevant controls and their design at a specified date.|Reliance on operating effectiveness over the audit year.|A conclusion about operating effectiveness at every user entity.|Substitution for all user-auditor procedures on payroll.|A Type 1 report addresses the system description and design at a point in time. Operating effectiveness over a period is a Type 2 objective.
AU-C 402|A service report assumes user entities reconcile transmitted transactions. What should the user auditor do before relying on the report for that objective?|Determine whether the complementary user control is relevant and evaluate it at the user entity as appropriate.|Assume the service organization performs reconciliation for each user.|Disregard the reconciliation if the service report has an unmodified opinion.|Rely on the report without reviewing its control assumptions.|Complementary controls are performed by the user entity and may need evaluation or testing there.
AU-C 300|When a preliminary understanding reveals a newly acquired location with material operations, what planning action is appropriate?|Revise the strategy and plan to address the acquisition.|Keep the plan fixed after partner approval.|Defer the matter until after report issuance.|Use the prior-year plan without modification.|Audit planning is iterative. New developments affect the nature, timing and extent of work.
AU-C 550|A significant transaction outside the normal course of business involves an undisclosed related party. Which action is most appropriate?|Investigate the business purpose and evaluate accounting and disclosure.|Assume the transaction is arm’s length if a signed invoice exists.|Rely on management’s explanation without corroboration.|Exclude it because the other party is a separate legal entity.|The nature of a related-party transaction, especially outside ordinary operations, calls for focused investigation and evaluation.
AU-C 570|Operating losses and accelerating loan maturities indicate potential substantial doubt about continuing as a going concern. What should the auditor evaluate?|Management’s plans and whether they are feasible and likely to mitigate the conditions.|Whether to automatically liquidate the entity for accounting purposes.|Only the amount of the current-year loss.|Whether a prior unmodified opinion removes the current concern.|The auditor evaluates the conditions and, where relevant, management’s plans and their expected mitigating effect.
AS 2201|In an integrated issuer audit, how should the auditor start selecting controls to test using a top-down approach?|Begin at the financial statement level and consider entity-level controls and significant accounts and assertions.|Select controls solely by frequency across all departments.|Start by selecting the largest expense transactions regardless of risk.|Select only controls that management has already found ineffective.|Top-down selection links overall risk and entity-level controls to relevant assertions and responsive controls.
AU-C 315|An automated control rejects sales beyond approved credit limits. Unauthorized access permits staff to change those limits. Which additional area warrants attention?|General IT controls over access and changes affecting the automated control.|The wording of the audit opinion before assessing risk.|Only the physical location of the sales department.|The number of printed sales invoices.|General IT controls can protect automated controls and the data on which they depend.
AU-C 315|The company records inventory held on consignment from a supplier as its own. Which assertion is primarily at risk?|Rights and obligations.|Completeness.|Mathematical accuracy of inventory extensions.|Occurrence of cash receipts.|Physical possession does not establish ownership. The issue is whether the entity has rights to the recorded goods.
AU-C 315|A payables clerk leaves unmatched year-end receiving reports out of the accrual process. Which assertion is primarily threatened?|Completeness of accounts payable.|Existence of cash.|Rights to recorded inventory.|Valuation of share capital.|Omitted receipts can represent liabilities that should be recorded.
AU-C 330|A dual-purpose sample of sales invoices tests both approval and transaction accuracy. How should the results be evaluated?|Evaluate control deviations and substantive misstatements against their separate objectives.|Treat all approval failures as equal-dollar misstatements.|Ignore substantive discrepancies when the approval control passes.|Use the sample to assess only one objective after seeing results.|Each test retains its purpose and needs separate evaluation even when applied to the same selections.
AU-C 240|A manager explains that recording an unsupported entry is acceptable because the company will reverse it next month. Which fraud risk factor is illustrated?|Attitude or rationalization.|Opportunity.|Incentive or pressure.|Nonsampling risk.|The manager is justifying an improper act, which is rationalization.`,
`AU-C 500|Which combination describes appropriateness of audit evidence?|Relevance and reliability.|Quantity and materiality.|Timing and sample size.|Coverage and budget.|Appropriateness concerns evidence quality. Sufficiency concerns quantity.
AU-C 500|The auditor uses a company-produced report to select balances for testing. What should the auditor evaluate?|Whether the report is sufficiently reliable, including accuracy and completeness as necessary.|Only whether the report was exported to a spreadsheet.|Whether the file name matches the audit program.|Only whether the total agrees to management’s expectation.|The quality of evidence used to select and test items depends on reliable population data.
AU-C 500|The auditor independently repeats the client’s daily reconciliation from source records. Which procedure is performed?|Reperformance.|Observation.|External confirmation.|Inquiry.|Reperformance means independently executing the control or procedure originally performed by the entity.
AU-C 500|The auditor independently checks the arithmetic on a depreciation worksheet without re-executing the company’s review control. What is this procedure?|Recalculation.|Confirmation.|Observation.|Inquiry.|Checking mathematical accuracy is recalculation.
AU-C 500|An auditor watches a cashier count the cash drawer. What limitation applies most directly?|The evidence concerns the observed point in time and observation may affect behavior.|Physical observation establishes ownership for all cash accounts.|Observation establishes operating effectiveness for the entire year.|Evidence from observation is equivalent to a bank confirmation.|Observation is point-in-time evidence and the action observed may change in the auditor’s presence.
AU-C 501|Inventory is material and physically counted by management. What should the auditor ordinarily do unless attendance is impracticable?|Attend the count and perform observation, inspection and test counts.|Replace attendance with a representation from the warehouse manager.|Count only items already written off.|Rely exclusively on perpetual inventory records.|Attendance allows evaluation of instructions, observation of procedures, inspection and independent test counts.
AU-C 501|What is the usual direct source of evidence about litigation identified by management as potentially material?|The entity’s external legal counsel responding directly to the auditor.|A vendor confirming the entity’s current credit limit.|The public relations department’s internal talking points.|The client’s insurance salesperson describing coverage generally.|A direct response from counsel can corroborate management’s information about relevant litigation, claims and assessments.
AU-C 505|Who should control sending external confirmation requests and receipt of responses?|The auditor.|The audit client’s sales staff.|The audit committee as intermediary.|The confirming party’s customer service team on behalf of both parties.|Auditor control helps preserve the integrity and reliability of the confirmation process.
AU-C 505|A positive receivables confirmation receives no reply. A response was not determined essential. What is an appropriate alternative?|Inspect subsequent receipts and corroborate the receipts against the specific balance and supporting sales records.|Treat silence as agreement.|Ask management to prepare a replacement confirmation.|Confirm only the customer’s postal address.|Alternative procedures may address the same assertion through corroborated payment and transaction evidence.
AU-C 505|A negative confirmation is mailed to a population with large individually risky balances. What is the most defensible conclusion?|Negative confirmations alone are inappropriate as the sole substantive procedure for the assessed risk.|Each nonresponse provides the same evidence as a positive response.|Large balances offset the need for a low assessed risk.|Management may collect the replies if they are infrequent.|Negative confirmations provide less persuasive evidence and have restricted use as the sole substantive test.
AU-C 520|To use a substantive analytical procedure on revenue, which step improves the procedure’s ability to detect a material misstatement?|Develop a sufficiently precise expectation using reliable data.|Set the expected value equal to recorded revenue.|Ignore differences below total revenue.|Choose the acceptable difference after viewing the result.|Reliable inputs and precision let the comparison detect differences relevant to the audit objective.
AU-C 520|A difference exceeds the threshold in a substantive analytical procedure. Management offers a plausible explanation. What should the auditor do?|Corroborate the explanation and perform additional procedures as needed.|Accept it as sufficient solely because it is plausible.|Increase the threshold retroactively to avoid investigating it.|Automatically record the full difference as an error.|Material unexpected differences require investigation and appropriate evidence supporting explanations.
AU-C 530|What is the effect of reducing the tolerable misstatement while holding other sampling factors constant?|The required sample size generally increases.|The required sample size generally decreases.|Sampling risk is eliminated.|The population must be stratified into exactly two groups.|A lower tolerance calls for greater precision, typically obtained with a larger sample.
AU-C 530|A controls sample has an observed deviation rate below tolerable deviation, but its upper deviation limit exceeds tolerance. What is the appropriate conclusion?|The sample does not support the planned reliance at the selected assurance level.|The control can be relied on solely because the observed rate is below tolerance.|Every deviation must be a monetary error.|The control was never implemented.|Sampling uncertainty is reflected in the upper limit. An excessive limit undermines planned reliance.
AU-C 530|An auditor finds monetary misstatements in a representative sample of transactions. What should be done when evaluating the sample?|Project sampled misstatements to the population and evaluate sampling risk.|Assume only tested transactions contain misstatements.|Automatically write off the entire population.|Replace the identified errors with the tolerable misstatement amount.|Projection estimates the broader population effect, which must be considered with sampling risk.
AU-C 540|Management values slow-moving inventory using a forecast. Which action directly tests the assumptions used?|Compare expected future sales with recent demand, order data and contrary evidence.|Verify that the spreadsheet opens successfully.|Confirm the quantity on hand and conclude on all valuation assumptions.|Agree the forecast total to the number management posted.|Testing assumptions requires assessing whether available evidence supports them, including contradictory information.
AU-C 540|Several individually reasonable estimates consistently favor higher earnings. What should the auditor consider?|Whether the pattern indicates possible management bias.|Whether a favorable pattern proves each estimate is materially misstated.|Whether individually reasonable values eliminate bias considerations.|Whether an unmodified report prevents further evaluation.|A directional pattern can signal bias even when individual estimates fall within a reasonable range.
AU-C 560|A customer bankruptcy shortly after year-end corroborates severe financial distress already present at year-end. What is the audit implication?|Evaluate whether the year-end allowance needs adjustment.|Ignore the event because the filing occurred after year-end.|Treat it only as a nonrecognized subsequent event regardless of prior facts.|Adjust current-year cash collections instead of the allowance.|Subsequent evidence about an existing year-end condition can affect the year-end measurement.
AU-C 580|When should the usual written representations for a nonissuer audit be dated?|As of the date of the auditor’s report.|As of the first day of the period under audit.|Immediately after the financial statements are distributed.|As of the engagement acceptance date.|Representations cover relevant periods through the report date and are obtained before the report is released.
AU-C 580|Does obtaining written management representations eliminate the need for other evidence on a material estimate?|No. Obtain other evidence responsive to the estimate risk.|Yes, if signed by both the chief executive and chief financial officers.|Yes, if the estimate is consistently prepared.|Yes, if the representation is notarized.|Written representations supplement the audit evidence. They cannot by themselves establish that a material estimate is reasonable.
AU-C 610|Which factors matter before using internal audit work in a nonissuer external audit?|Objectivity, competence and a systematic and disciplined approach.|Only whether the department has a large staff.|Only how long the chief auditor has worked there.|Whether management will release the external auditor from responsibility.|The external auditor evaluates these characteristics and retains responsibility for the opinion.
AU-C 620|When using an auditor’s specialist to test a complex valuation, what remains the auditor’s responsibility?|Evaluate whether the specialist’s work is adequate for the auditor’s purposes.|Delegate the overall audit opinion to the specialist.|Accept the specialist’s conclusion without reviewing assumptions.|Avoid documenting agreements about roles and scope.|A specialist provides expertise. The auditor evaluates the work and retains responsibility for the opinion.
AS 1105|An independent source contradicts evidence obtained from management. What is the appropriate response?|Perform procedures to resolve the inconsistency and assess any further effects.|Choose the evidence most consistent with the engagement budget.|Average the two conclusions without further work.|Ignore any evidence received after management’s response.|Contradictory evidence can affect the reliability of conclusions and may require broader procedures.
AU-C 450|Management corrects one of several accumulated errors. How should the auditor evaluate the remaining errors?|Consider them individually and collectively, including qualitative circumstances.|Exclude all uncorrected items once one adjustment is posted.|Consider only those above total financial statement materiality individually.|Evaluate only the absolute value of the largest error.|A combination of errors may be material and qualitative factors can change the conclusion.
AU-C 500|To test completeness of recorded sales, where should selections ordinarily originate?|Shipping records for goods dispatched.|Invoices already recorded in the sales journal.|Only the trial balance total.|Management’s list of corrected errors.|Starting with source shipping records can identify shipments missing from accounting records.
AU-C 500|To test occurrence of recorded sales, which direction is ordinarily appropriate?|From recorded sales entries to supporting shipping and order records.|From shipments exclusively to the sales journal.|From a list of unrecorded transactions to the general ledger.|From current-year payroll payments to sales invoices.|Beginning with recorded entries and vouching to evidence addresses whether those entries represent real transactions.
AU-C 510|The current auditor is auditing a nonissuer for the first time. What is the objective of procedures on opening balances?|Obtain evidence about opening misstatements affecting the current period and consistent accounting policies.|Automatically rely on last year’s published opinion without further evaluation.|Reissue the predecessor’s report under the current auditor’s name.|Test only current-year transactions because opening balances are excluded.|Opening balances and accounting policy consistency can materially affect the current financial statements.`,
`AU-C 705|A known GAAP departure is material and confined to one disclosure without pervasive effects. Which opinion is appropriate?|Qualified opinion.|Adverse opinion.|Disclaimer of opinion.|Unmodified opinion with an emphasis paragraph only.|A known material misstatement with nonpervasive effects leads to a qualified opinion.
AU-C 705|Omitting controlled subsidiaries causes known material and pervasive departures from GAAP. Which opinion is appropriate?|Adverse opinion.|Qualified opinion.|Disclaimer of opinion.|Unmodified opinion.|A material and pervasive known misstatement calls for an adverse opinion.
AU-C 705|Records were destroyed and alternatives cannot yield evidence. Possible effects are material and pervasive. Which opinion is appropriate?|Disclaimer of opinion.|Adverse opinion.|Qualified opinion.|Unmodified opinion with an emphasis paragraph.|A pervasive inability to obtain sufficient appropriate evidence calls for a disclaimer.
AU-C 705|The auditor cannot obtain evidence about a material isolated balance. Possible effects are not pervasive. Which opinion is appropriate?|Qualified opinion.|Adverse opinion.|Disclaimer of opinion.|Unmodified opinion.|A material, nonpervasive scope limitation calls for qualification based on possible effects.
AU-C 706|A matter is appropriately disclosed, fundamental to users’ understanding and warrants drawing attention under AU-C 706. It does not require modification or key audit matter treatment. What section is appropriate?|Emphasis of Matter.|Basis for Adverse Opinion.|Other Matter.|Disclaimer of Opinion.|An emphasis section draws attention to a matter appropriately presented or disclosed in the statements.
AU-C 706|A matter outside the financial statements is relevant to understanding the audit and disclosure in the report is permitted. No other standard requires a dedicated section. What may be appropriate?|Other Matter section.|Emphasis of Matter section.|Adverse Opinion section.|Management’s Responsibilities section.|Other Matter addresses relevant matters outside those presented or disclosed in the statements.
AU-C 570|Substantial doubt remains after evaluating management’s plans, and related disclosures are adequate. What is the reporting response if the statements otherwise merit an unmodified opinion?|Use an unmodified opinion with a separate going concern section.|Issue a disclaimer solely because doubt exists.|Issue an adverse opinion solely because doubt exists.|Use an unmodified opinion and omit all mention of the doubt.|Adequately disclosed remaining substantial doubt requires separate reporting and does not by itself modify the opinion.
AS 3101|Which matter meets the definition of a critical audit matter in an issuer audit subject to CAM reporting?|A matter communicated or required to be communicated to the audit committee, relating to material accounts or disclosures and involving especially challenging, subjective or complex judgment.|Every deficiency communicated to management regardless of account materiality.|Every significant account without regard to auditor judgment.|Any issue first identified after the report was issued.|The CAM definition combines audit committee communication, material accounts or disclosures, and the nature of the auditor’s judgment.
AR-C 70|What assurance does an engagement to prepare financial statements provide?|No assurance.|Limited assurance.|Reasonable assurance.|An audit opinion on departures only.|A preparation engagement is a nonassurance service under SSARS.
AR-C 80|A CPA lacks independence and undertakes a financial statement compilation. What is required in the compilation report?|Disclose lack of independence.|Issue an adverse audit opinion.|Provide limited assurance on independence alone.|Omit a report because compilation requires independence.|A compilation permits lack of independence with disclosure in the report.
AR-C 90|Which procedures are ordinarily central to a review of nonissuer financial statements under SSARS?|Inquiry and analytical procedures.|Detailed testing of all journal entries.|Positive confirmation of every receivable.|An audit of internal control.|A review primarily uses inquiry and analytical procedures to obtain limited assurance, with additional procedures when warranted.`
  ];
  const urlFor = ref => ref.startsWith('ET') ? code : ref.startsWith('AR-C') ? ssars : ref.startsWith('AT-C') ? attestation :
    ref === 'AS 1000' ? pcaob + '/details/as-1000--general-responsibilities-of-the-auditor-in-conducting-an-audit' :
    ref.startsWith('AS ') ? pcaob + '/details/as' + ref.slice(3) : sas;
  const source = ref => ({ ref, url: urlFor(ref) });
  const alternate = [
    [
      'ET 1.600.010|A firm advertises that it can guarantee a favorable audit opinion for any paying client. How should the firm evaluate the advertisement?|It is misleading because the result cannot be guaranteed.|It is permissible when the fees are stated.|It is permissible when used only for new clients.|It is acceptable when competitors use the same wording.|The advertisement creates an unjustified expectation about results and conflicts with the Code’s advertising interpretation.'
    ],
    [
      'AU-C 600|Work is assigned to a component auditor in a nonissuer group audit, and the group report makes no reference to that auditor. Who is responsible for the group audit opinion?|The group auditor.|The component auditor alone.|The two auditors through separately issued group opinions.|The group chief financial officer.|When the report does not refer to the component auditor, the group auditor remains responsible for the group opinion.'
    ],
    [
      'AU-C 330|A control was tested at an interim date and the team wants to rely on it through year-end. How should the auditor address the remaining period?|Evaluate changes after interim testing and determine the additional evidence needed.|Automatically extend interim results without further consideration.|Move the report date back to the interim testing date.|Rely solely on management’s written assurance that the control remained effective.|Interim evidence covers a limited period. The auditor evaluates changes and determines what additional evidence is needed for the rest of the period.'
    ],
    [
      'AT-C 215|Specified procedures were performed for an agreed-upon procedures engagement. What should the practitioner report?|The procedures performed and related findings.|An opinion on the subject matter as a whole.|Limited assurance that no material issues came to attention.|A guarantee that the procedures were sufficient for every possible purpose.|An agreed-upon procedures engagement reports procedures and findings without expressing an opinion or conclusion.'
    ]
  ];
  const attestation = 'https://www.aicpa-cima.com/resources/download/aicpa-ssaes-currently-effective';
  const profiles = [
    { title:'Timed benchmark · Financial statement audit', company:'Alder Components', cutoff:[-1,2,4], sampling:[120,3,4.8,4], estimate:[260,180,205], reporting:0, risk:0, independence:0, service:0 },
    { title:'Controls and assurance', company:'Bayside Medical Supply', cutoff:[3,-2,-1], sampling:[90,1,3.7,5], estimate:[170,180,205], reporting:1, risk:1, independence:1, service:1 },
    { title:'Evidence and evaluation', company:'Cobalt Lighting', cutoff:[0,-1,1], sampling:[80,2,5.2,5], estimate:[190,180,205], reporting:2, risk:2, independence:2, service:2 },
    { title:'Risk and professional judgment', company:'Driftwood Packaging', cutoff:[1,2,-3], sampling:[150,2,3.9,4], estimate:[310,250,285], reporting:3, risk:0, independence:1, service:2 },
    { title:'Audit completion and reporting', company:'Elmstone Instruments', cutoff:[-2,1,0], sampling:[100,4,7.6,6], estimate:[220,240,265], reporting:1, risk:2, independence:0, service:1 }
  ];
  function order(items, seed) {
    const output = items.slice();
    for (let i = output.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [output[i], output[j]] = [output[j], output[i]];
    }
    return output;
  }
  function part(prompt, key, alternatives, apply, ref, principle) {
    const options = [key, ...alternatives];
    return { prompt, options, key, optionReasons: { [key]: apply }, steps:[principle, apply, 'Conclusion · ' + key], source:source(ref) };
  }
  function caseItem(area, title, prompt, exhibits, parts) {
    return { area, title, prompt, exhibits, parts, kind:'tbs' };
  }
  function simulations(p, n) {
    const cutoffDays = ['Dec 28','Dec 29','Dec 30','Dec 31','Jan 1','Jan 2','Jan 3','Jan 4'];
    const [size, deviations, upper, tolerance] = p.sampling;
    const rate = (100 * deviations / size).toFixed(1) + '%';
    const [recorded, low, high] = p.estimate;
    const difference = Math.max(low - recorded, recorded - high, 0);
    const opinions = ['Qualified','Adverse','Disclaimer','Unmodified'];
    const reports = [
      ['Management omitted a required disclosure. The known departure is material and confined to one note.', 'Known material misstatement', 'A known material misstatement with nonpervasive effects leads to qualification.', 0],
      ['Management excluded a major subsidiary. The known departure is material and pervasive across the statements.', 'Known material misstatement', 'Pervasive known departures lead to an adverse opinion.', 1],
      ['The ledger was destroyed. Alternatives failed and the possible effects are material and pervasive.', 'Inability to obtain evidence', 'A pervasive evidence limitation leads to a disclaimer.', 2],
      ['A material inventory location could not be observed. Alternatives failed, but possible effects are confined and nonpervasive.', 'Inability to obtain evidence', 'A material, nonpervasive evidence limitation leads to qualification.', 0]
    ];
    const [report, cause, reportReason, opinion] = reports[p.reporting];
    const riskMemos = [
      ['A new billing application produces no independently accessible transaction trail. The team has concluded substantive procedures alone cannot provide sufficient appropriate evidence.', 'Test relevant controls', 'Substantive procedures alone cannot provide sufficient appropriate evidence.'],
      ['Goods from a vendor are held on consignment, included in inventory and material. The contract says the vendor retains title.', 'Inspect contracts and obtain vendor evidence about ownership', 'The recorded goods may not be owned by the entity.'],
      ['Accounts payable omitted goods received before close when the related supplier invoices arrived in January. The auditor has assessed completeness risk as high.', 'Trace pre-close receiving records to the payables ledger and accrual', 'Valid year-end obligations may have been omitted.']
    ];
    const [riskMemo, response, riskReason] = riskMemos[p.risk];
    const independence = [
      ['A covered member directly owns client stock.','Impaired','ET 1.240.010','A covered member’s direct financial interest impairs independence regardless of materiality.'],
      ['An engagement team member’s spouse is the client controller.','Impaired','ET 1.245.010','A controller occupies a key position, and a spouse is immediate family.'],
      ['The client requests bookkeeping. A capable finance director oversees it, makes all decisions, evaluates results and accepts responsibility. All other safeguards and requirements are met.','Permissible under stated facts','ET 1.295.040','Permissible bookkeeping can coexist with independence when management retains all responsibilities and applicable requirements are met.']
    ];
    const [relationship, effect, ethics, ethicsReason] = independence[p.independence];
    const serviceEvidence = [
      ['A Type 1 report at December 31 describes and evaluates design of controls.','Design at a point in time','A Type 1 report provides point-in-time evidence about description and design.'],
      ['A Type 2 report covers January through December and includes tests and results.','Operating effectiveness over a period','A Type 2 report addresses design and operating effectiveness over a specified period.'],
      ['The provider sent an unsigned marketing summary. No service auditor report or other corroboration is available.','Neither conclusion is supported','Marketing material is insufficient evidence of relevant control design or operating effectiveness.']
    ];
    const [serviceDoc, coverage, serviceReason] = serviceEvidence[p.service];
    return [
      caseItem(0,'Client acceptance and independence', 'You are documenting whether the firm may proceed with a nonissuer audit. Evaluate the relationship and the engagement preconditions.', [
        { title:'Acceptance notes', lines:[relationship, 'Management declines to give the auditor unrestricted access to relevant staff. No statute requires acceptance.'] }
      ], [
        part('Evaluate independence based on the relationship.',effect,['Impaired','Permissible under stated facts','Independence is irrelevant'].filter(option=>option!==effect),ethicsReason,ethics,'Evaluate who has the interest or performs the role, and whether management retains decision-making authority.'),
        part('How should the partner respond to the access restriction?', 'Decline the audit', ['Accept and plan to rely on inquiry only','Disregard the restriction','Accept and issue an unmodified opinion'], 'Management has declined a required premise and no law mandates acceptance.', 'AU-C 210','Identify whether management acknowledges the responsibilities needed for an audit.')
      ]),
      caseItem(1,'Service organization and payroll risk', 'The entity uses a third party to process payroll. Determine the effect of the exhibits on the audit plan.', [
        { title:'Provider documentation', lines:[serviceDoc] },
        { title:'User responsibilities', lines:['The entity is expected to reconcile the provider’s payroll register to its bank disbursements. The controller says this was never done.'] }
      ], [
        part('What assurance evidence does the provider document address?',coverage, ['Design at a point in time','Operating effectiveness over a period','Neither conclusion is supported'].filter(option=>option!==coverage),serviceReason,'AU-C 402','Identify the report type and the period or date it covers.'),
        part('How should the auditor respond to the missing user control?', 'Assess the resulting risk and obtain responsive evidence', ['Assume the provider performed it','Treat the user control as effective','Exclude payroll from the audit'], 'The control is assigned to the entity and evidence shows it did not operate.', 'AU-C 402','Consider relevant complementary user entity controls when evaluating evidence from a provider.')
      ]),
      caseItem(2,'Revenue cutoff', 'Terms transfer control at shipment. Select the correct recognition period for each selected invoice.', [
        { title:'Shipment log', lines:p.cutoff.map((day,i)=>'Invoice '+(n*100+31+i)+' · Shipped '+cutoffDays[day+3]+' · Recorded in December') }
      ], p.cutoff.map((day,i)=>part('Invoice '+(n*100+31+i)+' recognition period',day<=0?'December':'January',[day<=0?'January':'December'],'The shipment date is '+cutoffDays[day+3]+'. Compare it to the December 31 cutoff.','AU-C 500','Use the shipment record as evidence of when the invoice meets the stated transfer condition.'))),
      caseItem(2,'Review control sample', 'A planned reliance strategy depends on a review control applied to batches of transactions. Evaluate the sample at the specified assurance level.', [
        { title:'Sampling worksheet', lines:[`Selections: ${size}`,`Observed deviations: ${deviations}`,`Computed upper deviation limit: ${upper}%`,`Tolerable deviation rate: ${tolerance}%`] }
      ], [
        part('Observed deviation rate, rounded to one decimal place',rate,[((deviations+1)/size*100).toFixed(1)+'%',upper.toFixed(1)+'%',tolerance.toFixed(1)+'%'].filter(x=>x!==rate),`Divide ${deviations} by ${size} and multiply by 100.`,'AU-C 530','Calculate the point estimate from the observed deviations.'),
        part('Does the sample support planned reliance?',upper<=tolerance?'Yes, based on the stated rates':'No, based on the stated rates',[upper<=tolerance?'No, based on the stated rates':'Yes, based on the stated rates','Ignore the upper deviation limit'],`Compare the upper deviation limit of ${upper}% with tolerance of ${tolerance}%.`,'AU-C 530','Use the upper deviation limit to account for sampling risk.')
      ]),
      caseItem(2,'Estimate evaluation', 'The auditor developed a range supported by sufficient appropriate evidence. Quantify any identified misstatement and consider possible management bias.', [
        { title:'Estimate workpaper', lines:[`Management’s recorded amount: $${recorded},000`,`Auditor-supported range: $${low},000 to $${high},000`, 'Management selected assumptions favorable to earnings on several other estimates.'] }
      ], [
        part('Amount outside the supported range',`$${difference},000`.replace('$0,000','$0'), difference===0?['$1,000','$5,000','$10,000']:['$0',`$${difference+5},000`,`$${difference+10},000`],`Compare $${recorded},000 to both range endpoints and, if outside, use the nearest endpoint.`,'AU-C 540','For a supported auditor’s range, a point estimate outside the range is misstated by at least the difference to the nearest endpoint.'),
        part('What merits further consideration across the estimates?', 'Possible management bias', ['Automatic finding of fraud','No common risk across estimates','Opinion modification without further evaluation'], 'A pattern of earnings-favorable assumptions can indicate bias.', 'AU-C 540','Evaluate management’s estimate judgments collectively as well as individually.')
      ]),
      caseItem(3,'Financial statement opinion', 'You are finalizing a nonissuer audit. Evaluate the issue and select the report outcome.', [
        { title:'Engagement partner memo', lines:[report,'Assume no withdrawal and no other reporting issues.'] }
      ], [
        part('Classify the issue.',cause,['Known material misstatement','Inability to obtain evidence','Other information inconsistency'].filter(x=>x!==cause),reportReason,'AU-C 705','Distinguish a known departure from uncertainty caused by an evidence limitation.'),
        part('Select the opinion.',opinions[opinion],opinions.filter((_,i)=>i!==opinion),reportReason,'AU-C 705','Evaluate materiality and pervasiveness after identifying the nature of the issue.')
      ]),
      caseItem(1,'Designing responsive audit procedures', 'Review the planning memo and select a procedure that targets the assessed risk.', [
        { title:'Planning memo',lines:[riskMemo, 'The engagement is a nonissuer financial statement audit.'] }
      ], [
        part('Which fact is the primary driver of the response?',riskReason,riskMemos.filter((_,i)=>i!==p.risk).map(row=>row[2]),riskMemo,'AU-C 315','Identify the condition that changes the assessment or constrains the evidence available.'),
        part('Which audit response best addresses this issue?',response,riskMemos.filter((_,i)=>i!==p.risk).map(row=>row[1]),riskReason,'AU-C 330','Link the procedure to the specific assertion or to the stated limitation on substantive evidence.')
      ])
    ].map((item, index) => {
      const independenceReasons = {
        'Impaired': 'The stated bookkeeping facts preserve management responsibility and satisfy the applicable safeguards.',
        'Permissible under stated facts': 'The direct financial interest or immediate family key position impairs independence.',
        'Independence is irrelevant': 'Independence is required for the audit.'
      };
      const accessReasons = {
        'Accept and plan to rely on inquiry only': 'Inquiry cannot replace the required unrestricted access.',
        'Disregard the restriction': 'The refusal affects a required precondition before acceptance.',
        'Accept and issue an unmodified opinion': 'An opinion requires sufficient appropriate evidence, and acceptance is unsupported here.'
      };
      const caseReasons = [
        [option=>independenceReasons[option], option=>accessReasons[option]],
        [option=>serviceEvidence.find(row=>row[1]===option)[2]+' That does not match the document in this exhibit.',
          option=>({
            'Assume the provider performed it':'The exhibit assigns the reconciliation to the user entity.',
            'Treat the user control as effective':'The controller confirms it did not operate.',
            'Exclude payroll from the audit':'Outsourcing and control failure require a responsive approach, not exclusion.'
          })[option]],
        p.cutoff.map(day=>option=>'The shipment occurred on '+cutoffDays[day+3]+', '+(day<=0?'on or before':'after')+' the December close. The stated transfer terms therefore rule out '+option+'.'),
        [option=>option+' is not the result of '+deviations+' observed deviations divided by '+size+' selections.',
          option=>option==='Ignore the upper deviation limit'?'The upper limit accounts for sampling risk and is required for the stated comparison.': 'The upper deviation limit of '+upper+'% '+(upper<=tolerance?'does not exceed':'exceeds')+' the tolerance of '+tolerance+'%.'],
        [option=>option+' does not match the gap between the recorded amount and the nearest boundary of the supported range, or zero when the amount is inside.',
          option=>({
            'Automatic finding of fraud':'A directional pattern is an indicator requiring evaluation. It does not establish intent.',
            'No common risk across estimates':'The earnings-favorable direction is a common pattern across the estimates.',
            'Opinion modification without further evaluation':'The auditor must first evaluate evidence, misstatements and their implications.'
          })[option]],
        [option=>({
          'Known material misstatement':'The evidence is insufficient to identify a known misstatement. The concern is the possible effect of the limitation.',
          'Inability to obtain evidence':'The exhibit describes an established departure, so the issue is a known misstatement.',
          'Other information inconsistency':'The issue concerns the audited statements or the evidence supporting them, rather than accompanying other information.'
        })[option],
          option=>({
            Qualified:'Qualification is insufficient when the effects or possible effects are pervasive.',
            Adverse:'An adverse opinion requires a known material and pervasive departure.',
            Disclaimer:'The facts do not establish a material and pervasive evidence limitation.',
            Unmodified:'The material known or possible effects require a modified opinion.'
          })[option]],
        [option=>riskMemos.find(row=>row[2]===option)[0]+' The exhibit describes a different fact pattern.',
          option=>riskMemos.find(row=>row[1]===option)[2]+' The selected procedure targets that different risk.']
      ];
      item.parts.forEach((answer, j) => {
        for (const option of answer.options) {
          if (option !== answer.key) answer.optionReasons[option] = caseReasons[index][j](option);
        }
      });
      return item;
    });
  }
  const variantRationales = AudRationales.map(group => group.split('\n').map(row => row.split('|')));
  const alternateRationales = [
    ['Stating a price does not make the guarantee supportable.', 'The rule applies regardless of whether a prospect is a new client.', 'Competitors’ conduct does not establish compliance.'],
    ['The component auditor is responsible for assigned work but does not issue the group opinion.', 'The group report expresses one opinion under the responsibility of its issuing auditor.', 'Management is responsible for the statements, not the audit opinion.'],
    ['Interim results do not establish operation through year-end without evaluating the remaining period.', 'The report date depends on completion of the overall audit, not the date of interim control testing.', 'Management’s statement alone is insufficient evidence of control effectiveness.'],
    ['An opinion is associated with an examination rather than agreed-upon procedures.', 'Limited assurance is associated with an attestation review rather than agreed-upon procedures.', 'The report describes factual findings and does not make a suitability guarantee.']
  ];
  const alternatePrompts = AudVariants.map(group => group.split('\n').map(row => row.split('|')));
  const replacementIndexes = [7, 3, 4, 8];
  const benchmark = new Map(AudBenchmark.map(row=>[row.area+':'+row.index,row]));
  const bank = profiles.map((profile, examIndex) => {
    const seed = 11281 + examIndex * 72314;
    const mcqs = groups.flatMap((group, area) => group.split('\n').map((row, i) => {
      const rigorous = examIndex===0 ? benchmark.get(area+':'+i) : undefined;
      if (rigorous) {
        const answer = part('Select one answer',rigorous.key,rigorous.wrong.map(row=>row[0]),rigorous.why,
          rigorous.ref,'Identify the decisive fact in the scenario, then apply '+rigorous.ref+'.');
        for (const [option,reason] of rigorous.wrong) answer.optionReasons[option] = reason;
        return { area, kind:'mcq', prompt:rigorous.prompt, context:'Assume a U.S. nonissuer audit under GAAS and the AICPA Code.', parts:[answer] };
      }
      const replacement = examIndex === area+1 && i === replacementIndexes[area] ? alternate[area][0] : null;
      const [ref, originalPrompt, key, ...rest] = (replacement ?? row).split('|');
      const application = rest.pop();
      const prompt = (examIndex === 0 || replacement) ? originalPrompt : alternatePrompts[area][i][examIndex-1];
      const context = ref.startsWith('AS ') ? 'Assume PCAOB standards apply.' :
        ref.startsWith('AU-C') ? 'Assume a U.S. nonissuer audit under GAAS.' :
        ref.startsWith('AR-C') ? 'Assume an engagement under SSARS.' :
        ref.startsWith('AT-C') ? 'Assume an engagement under SSAE.' : 'Apply the AICPA Code of Professional Conduct.';
      const answer = part('Select one answer',key,rest,application,ref,'Apply '+ref+' to the facts given.');
      const explanations = replacement ? alternateRationales[area] : variantRationales[area][i];
      rest.forEach((option, j) => { answer.optionReasons[option] = explanations[j]; });
      return { area, kind:'mcq', prompt, context, parts:[answer] };
    }));
    const ordered = order(mcqs, seed);
    const cases = simulations(profile, examIndex+1);
    if (examIndex===0) {
      for (const item of cases) {
        const extra = AudBenchmarkCases[item.title];
        item.exhibits.push(extra.exhibit);
        for (const [prompt,key,ref,why,...wrong] of extra.parts) {
          const answer=part(prompt,key,wrong.map(row=>row[0]),why,ref,'Use the additional exhibit and apply '+ref+'.');
          for (const [option,reason] of wrong) answer.optionReasons[option]=reason;
          item.parts.push(answer);
        }
      }
    }
    const items = [...ordered,...order(cases, seed + 50).map(item => ({...item, prompt: profile.company + " · " + item.prompt}))].map((item, i) => ({
      ...item, id:`aud-${examIndex+1}-q${i+1}`,
      testlet:i<39?1:i<78?2:i<80?3:i<83?4:5,
      parts:item.parts.map((row, j) => ({...row, options:order([...new Set(row.options)], seed+i*1907+j*101)}))
    }));
    return { id:`aud-${examIndex+1}`, author:"CD", title:profile.title, entity:profile.company, minutes:240, items };
  });
  globalThis.AudBank = { version:2, author:'CD', blueprint:2026, areas, exams:bank };
})();
