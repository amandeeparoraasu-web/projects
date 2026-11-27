/* Exam 1 replaces selected baseline items with multi-fact audit judgments. */
globalThis.AudBenchmark = [
  {
    area:0,index:2,ref:'ET 1.295.030',
    prompt:'A nonissuer audit client asks the firm to draft the inventory reserve workpaper. The controller has suitable expertise and agrees to review the work. The client also asks the audit manager to select the reserve percentage and approve its posting to the ledger. The firm can assign separate staff. Which response best preserves independence?',
    key:'Offer permissible preparation assistance, with the controller selecting the percentage and authorizing the entry.',
    wrong:[
      ['Accept both tasks because the controller will review the work.','Review alone does not prevent the firm from assuming the decision and authorization responsibilities.'],
      ['Allow separate nonaudit staff to select the percentage and approve the entry.','Staff separation does not restore independence when the firm itself assumes a management responsibility.'],
      ['Select the reserve percentage if the audit partner independently reviews it.','Partner review does not transfer the accounting decision back to the client.']
    ],
    why:'Providing assistance can be permissible if the client makes key decisions and meets all safeguards. Setting the reserve and authorizing posting are responsibilities the client must retain.'
  },
  {
    area:0,index:8,ref:'AU-C 220',
    prompt:'An engagement team identified a highly judgmental estimate. Required consultation ended in agreement, but the firm also requires an engagement quality review that has not been completed. The partner has obtained sufficient evidence and management has signed its representations. What should happen next?',
    key:'Complete the required engagement quality review before dating the report.',
    wrong:[
      ['Date the report now and finish the review before archiving the file.','File assembly after issuance does not extend the deadline for completing a required engagement quality review.'],
      ['Issue the report because consultation reached agreement.','Consultation and engagement quality review are separate requirements.'],
      ['Transfer the decision to issue the audit opinion to the reviewer.','The engagement partner retains responsibility for engagement quality and the report.']
    ],
    why:'Completing procedures and representations does not satisfy the separate review requirement. Where a review is required, the report cannot be dated before its completion.'
  },
  {
    area:0,index:12,ref:'AU-C 230',
    prompt:'After the audit report date, while evaluating a subsequent discovery of facts, the auditor performs additional procedures and changes a conclusion. What should the auditor document beyond the work already in the file?',
    key:'The circumstances, additional procedures, evidence and conclusions, effect on the report, and who made and reviewed the changes and when.',
    wrong:[
      ['Only the changed conclusion because the original issue is already documented.','The additional evidence, work and effect on the report are needed to explain the new conclusion.'],
      ['A replacement memo dated as of the original report date.','Backdating hides when the subsequent work and changes actually occurred.'],
      ['Only the final report if it was revised.','The report does not document the circumstances, work or review of changes.']
    ],
    why:'When exceptional circumstances lead to new procedures or conclusions after the report date, documentation must preserve the circumstances, evidence, implications, and change history.'
  },
  {
    area:1,index:4,ref:'AU-C 320',
    prompt:'Overall materiality is $500,000. A lender depends on a separately disclosed covenant ratio and an $80,000 classification error would change the entity from compliant to noncompliant. The controller argues the amount is below overall materiality. Which planning response is best?',
    key:'Consider a lower specific materiality level for the relevant classification or disclosure.',
    wrong:[
      ['Retain $500,000 for all areas because covenant breach is a legal issue.','A covenant effect can influence the financial statement decisions of a lender.'],
      ['Set performance materiality at $80,000 for the whole audit without evaluating user needs.','Performance materiality addresses aggregation risk and does not itself resolve specific materiality.'],
      ['Treat $80,000 as clearly trivial because it is below overall materiality.','Clearly trivial items have a much smaller order of magnitude and the covenant effect is consequential.']
    ],
    why:'The covenant sensitivity means that an error smaller than overall materiality could influence a user’s decision about a particular classification or disclosure.'
  },
  {
    area:1,index:7,ref:'AU-C 330',
    prompt:'A high-volume billing system retains no independently accessible transaction trail. The auditor concludes substantive procedures alone are insufficient. A new IT team operated the system this year, and prior-year audit work supported low risk. Which plan is appropriate?',
    key:'Test relevant controls for the current period, including applicable IT dependencies, and perform responsive substantive procedures.',
    wrong:[
      ['Rely on the prior-year low-risk conclusion because the application name is unchanged.','A change in operation can affect controls. Prior work does not establish current effectiveness in these facts.'],
      ['Inspect the configuration once and conclude the controls operated all year.','Understanding implementation is different from obtaining operating effectiveness evidence over the relevant period.'],
      ['Use management representations as a substitute for tests of controls.','Representations cannot supply the missing evidence of control operation.']
    ],
    why:'Controls testing is required when substantive procedures alone are insufficient. The design must respond to current-period risks and relevant IT dependencies.'
  },
  {
    area:1,index:14,ref:'AU-C 402',
    prompt:'A Type 2 payroll service report covers January through September. The audit is for the year ending December, and the report identifies user reconciliation as a complementary control. The client cannot show that reconciliations were performed. What is the best next step?',
    key:'Assess the October–December evidence gap and the missing user control, then obtain responsive evidence before determining reliance.',
    wrong:[
      ['Rely on the report for the full year because the opinion is unmodified.','The opinion addresses the report’s specified period and objectives.'],
      ['Treat the service auditor’s testing as evidence that the client reconciled payroll.','A complementary control is performed by the user entity.'],
      ['Disregard the service report and infer payroll is materially misstated.','A missed control or limited evidence changes the risk assessment but does not establish a misstatement.']
    ],
    why:'The report’s coverage ends before year-end, and the service control objectives depend on relevant client controls. Both issues require further evaluation and evidence.'
  },
  {
    area:2,index:8,ref:'AU-C 505',
    prompt:'A $320,000 receivable did not get a positive confirmation response. A direct reply is not essential. A January deposit matches the amount exactly, but the remittance lists different invoice numbers. Sales staff say the customer “must have meant” to settle the tested invoice. What is the best response?',
    key:'Investigate the remittance discrepancy and obtain evidence that specifically supports the tested balance.',
    wrong:[
      ['Clear the nonresponse because the deposit amount matches exactly.','Equal amounts do not establish that the deposit relates to the specific invoice.'],
      ['Accept sales staff’s explanation as sufficient corroboration.','An unsupported inquiry response does not resolve conflicting documentary evidence.'],
      ['Conclude that the tested receivable is misstated by $320,000.','A payment mismatch leaves the item unsubstantiated by this procedure. It does not establish the full balance is misstated.']
    ],
    why:'An alternative procedure must address the selected balance. Match payments to remittance details and corroborate the underlying sale or obtain other responsive evidence.'
  },
  {
    area:2,index:13,ref:'AU-C 530',
    prompt:'The auditor observed two approval failures in a sample of 100 purchases. The computed upper deviation limit is 5.8% and tolerable deviation is 5.0%. Both purchases were accurately recorded. Which conclusion should drive the next step?',
    key:'The sample does not support planned reliance. Reassess the response even though the two purchases had no monetary errors.',
    wrong:[
      ['Retain planned reliance because the observed deviation rate was only 2%.','The point estimate omits the allowance for sampling uncertainty.'],
      ['Ignore both exceptions because they did not cause monetary misstatements.','Control deviations and substantive misstatements are evaluated separately.'],
      ['Conclude the control was never implemented.','The sample concerns how the control operated. Deviations do not prove it was never implemented.']
    ],
    why:'The 5.8% upper deviation limit exceeds the 5.0% tolerance. Correct posting of the two purchases does not resolve approval control deviations.'
  },
  {
    area:2,index:17,ref:'AU-C 560',
    prompt:'A material customer entered bankruptcy on January 19 after a fire on January 8. The customer had been current and financially healthy as of December 31. The financial statements have not been issued. What should the auditor evaluate?',
    key:'Whether disclosure is needed for a material nonrecognized subsequent event.',
    wrong:[
      ['Reduce the December 31 receivable automatically because bankruptcy occurred before issuance.','The loss arose from a new post-year-end condition rather than a condition existing at December 31.'],
      ['Ignore the event because it occurred after December 31.','A material nonrecognized event can require disclosure before issuance.'],
      ['Conclude that the fire is evidence of undisclosed December impairment.','The facts place the cause after year-end and do not support preexisting impairment.']
    ],
    why:'The fire created a new condition after year-end. Evaluate whether disclosure is necessary rather than treating the bankruptcy as evidence of impairment existing at the reporting date.'
  },
  {
    area:3,index:0,ref:'AU-C 705',
    prompt:'A required nonissuer related-party disclosure is omitted. The auditor has sufficient evidence about the transaction. The omission is material, limited to one note, and is not fundamental to users’ understanding of the statements as a whole. What should the report contain?',
    key:'A qualified opinion and a Basis for Qualified Opinion section describing the departure.',
    wrong:[
      ['An unmodified opinion with an Emphasis of Matter section.','An emphasis section cannot cure a material misstatement and refers to a properly presented or disclosed matter.'],
      ['A disclaimer because readers cannot see the missing disclosure.','The auditor has evidence of a known departure. Reader access to the note does not create an audit scope limitation.'],
      ['An adverse opinion because the omission involves a related party.','The nature of the relationship may affect materiality, but the stated effects are not pervasive.']
    ],
    why:'Known material and nonpervasive departure calls for qualified reporting. The report explains the departure in the basis section.'
  },
  {
    area:3,index:6,ref:'AU-C 570',
    prompt:'A nonissuer’s projected cash shortfall and pending maturity raise substantial doubt. The lender has declined to refinance, and management’s alternative plan is not sufficiently supported. The statements adequately disclose the uncertainty and otherwise conform to the framework. What is the appropriate report?',
    key:'An unmodified opinion with a separate going concern section.',
    wrong:[
      ['A qualified opinion because management’s plan is unsupported.','The plan’s failure to alleviate doubt calls for separate reporting when disclosures are adequate.'],
      ['An adverse opinion because the cash shortfall is material.','A severe condition does not by itself create a material and pervasive financial statement misstatement.'],
      ['An unmodified opinion with no separate going concern reporting.','Remaining substantial doubt requires separate reporting under the stated nonissuer standard.']
    ],
    why:'Substantial doubt remains after evaluating management’s plans, and adequate disclosures permit an unmodified opinion with separate going concern reporting.'
  }
];

globalThis.AudBenchmarkCases = {
  'Client acceptance and independence': {
    exhibit:{title:'Continuance notes',lines:['The firm also provided bookkeeping before the proposed audit. Its staff drafted entries, but the controller selected all accounts, authorized each entry, and accepted responsibility. Assume the work covered the proposed audit period and all other independence requirements for that bookkeeping were satisfied.','The prospective client has a predecessor auditor. Management refuses permission to contact that auditor and provides no reason.']},
    parts:[
      ['Does the bookkeeping, on its stated facts, create a separate impairment?', 'No separate impairment from that service', 'ET 1.295.040', 'The controller retained responsibility and oversight. Evaluate bookkeeping separately from the covered member’s stock holding.',
        ['Yes, preparing draft entries always impairs independence.','Permissible preparation assistance can be provided when management retains responsibilities and all applicable requirements are met.'],
        ['No, so the firm is independent overall.','The separate direct ownership fact still impairs independence.']],
      ['How should the firm evaluate the denied predecessor communication?', 'Ask why authorization was denied and consider the answer in acceptance.', 'AU-C 210', 'A refusal warrants inquiry and consideration of its implications before acceptance.',
        ['Accept if the predecessor issued an unmodified opinion.','A prior opinion does not resolve the reason for refusing predecessor inquiries.'],
        ['Ask the predecessor to provide confidential information without authorization.','The predecessor remains subject to confidentiality obligations.']]
    ]
  },
  'Service organization and payroll risk': {
    exhibit:{title:'Year-end evidence options',lines:['The provider’s Type 1 report is dated December 31. The client has an independently retained employee master file, bank disbursement records and payroll authorizations. Identified risk is payment to fictitious or terminated employees.']},
    parts:[
      ['Which procedure directly tests the identified risk?', 'Vouch selected payroll disbursements to approved personnel records and current employment status.', 'AU-C 330', 'Begin with recorded disbursements and look for support that authorized employees actually received the payments.',
        ['Trace active staff names to the payroll register only.','That direction primarily tests whether valid staff are included rather than whether recorded payroll includes fictitious or terminated staff.'],
        ['Recalculate total payroll tax on the register.','Tax arithmetic does not establish that staff receiving payment were eligible.']],
      ['What evidence would address service control operating effectiveness if the auditor intends to rely on it?', 'Obtain suitable period tests or a relevant Type 2 report and evaluate the user controls and coverage.', 'AU-C 402', 'Reliance requires sufficient operating effectiveness evidence over the relevant period.',
        ['Re-read the Type 1 report’s description and rely for the year.','A point-in-time design report does not provide evidence of operating effectiveness over the year.'],
        ['Treat the bank reconciliation failure as proof the provider’s controls failed.','The user and provider controls are separate, and the user failure does not prove provider failure.']]
    ]
  },
  'Revenue cutoff': {
    exhibit:{title:'Revenue journal and freight terms',lines:['Invoice 131: $96,000. Invoice 132: $125,000. Invoice 133: $89,000.','All three invoices were recognized in December. No returns, offsets, or other adjustments apply. Evaluate revenue only.']},
    parts:[
      ['What is the net overstatement of December revenue for these invoices?', '$214,000', 'AU-C 500', 'Invoices 132 and 133 shipped in January. Add $125,000 and $89,000. Invoice 131 shipped in December.',
        ['$310,000','This includes invoice 131, which shipped in December and was correctly recognized.'],
        ['$125,000','This includes invoice 132 but omits the $89,000 overstatement from invoice 133.'],
        ['$96,000','Invoice 131 shipped in December and does not contribute to the overstatement.']],
      ['Which population would best identify additional December shipments that were not recorded?', 'Select December dispatch records and trace to the revenue journal.', 'AU-C 500', 'Start with evidence of goods shipped and verify that the related revenue was recorded.',
        ['Select entries from the December revenue journal and vouch them to dispatch records.','This direction primarily tests occurrence and may miss unrecorded shipments.'],
        ['Select January billings regardless of shipment date and agree their recorded totals.','That procedure does not define a complete population of December shipments.']]
    ]
  },
  'Review control sample': {
    exhibit:{title:'Exception log',lines:['One invoice omitted evidence of review and was posted $7,400 above the supported amount. Management calls this an isolated clerical error. Assume the sample is a representative dual-purpose sample, and the error has not been corrected.']},
    parts:[
      ['How should the $7,400 item be evaluated?', 'Evaluate the control deviation and monetary error separately, including appropriate substantive projection.', 'AU-C 530', 'The same selection can produce a deviation and a misstatement. Each conclusion serves its separate objective.',
        ['Count the dollar error as the observed control deviation rate.','Dollar misstatement and control failure frequency are different measures.'],
        ['Exclude the monetary error because management calls it isolated.','The auditor needs persuasive support before treating an item as anomalous.']],
      ['Which response best follows the control result?', 'Reassess control reliance and revise the substantive response to the affected assertion.', 'AU-C 330', 'The upper deviation limit is above tolerance, so the current sample does not support the planned reliance.',
        ['Retain reliance solely because the observed rate is 2.5%.','The observed rate omits sampling uncertainty.'],
        ['Withdraw immediately from the audit.','An inadequate sample result ordinarily changes the audit plan and does not by itself require withdrawal.']]
    ]
  },
  'Estimate evaluation': {
    exhibit:{title:'Summary of uncorrected differences',lines:['A separate $20,000 overstatement affects earnings in the same direction. Financial statement materiality is $70,000. Assume both differences remain uncorrected and are measured on a comparable pre-tax basis.']},
    parts:[
      ['What is the aggregate identified overstatement using the nearest-point estimate difference?', '$75,000', 'AU-C 450', 'Subtract $205,000 from $260,000 to obtain $55,000, then add the separate $20,000 overstatement.',
        ['$55,000','This omits the separate uncorrected overstatement.'],
        ['$100,000','This uses the far endpoint of the supported range.'],
        ['$20,000','This omits the amount above the upper supported endpoint.']],
      ['What is the appropriate evaluation before forming the opinion?', 'Request correction and evaluate aggregate and qualitative effects if the errors remain uncorrected.', 'AU-C 450', 'Aggregate errors exceed overall materiality, with a directional pattern that also merits evaluation.',
        ['Accept the differences because neither exceeds $70,000 by itself.','The auditor evaluates differences both individually and in aggregate.'],
        ['Issue an adverse opinion immediately.','The auditor first evaluates the remaining evidence, correction status and pervasiveness.']]
    ]
  },
  'Financial statement opinion': {
    exhibit:{title:'Report review note',lines:['Management has declined to correct the omission before issuance. The auditor has sufficient appropriate evidence to describe the departure. A draft report contains only an Emphasis of Matter section.']},
    parts:[
      ['Which section should explain the omitted disclosure?', 'Basis for Qualified Opinion', 'AU-C 705', 'Use the basis section for a qualified opinion arising from a known material, nonpervasive departure.',
        ['Emphasis of Matter','An emphasis section cannot substitute for a needed modification and concerns information appropriately presented or disclosed.'],
        ['Basis for Disclaimer of Opinion','The facts establish a known departure rather than a pervasive evidence limitation.']],
      ['How should the opinion refer to the qualifying matter?', 'Use “except for” language referring to the effects of the matter.', 'AU-C 705', 'A known misstatement leads to “effects” wording, while a scope limitation uses “possible effects.”',
        ['Refer to the possible effects of a limitation.','This is a known omission and audit evidence is sufficient.'],
        ['State that the financial statements do not present fairly overall.','That conclusion corresponds to an adverse opinion and requires pervasive effects.']]
    ]
  },
  'Designing responsive audit procedures': {
    exhibit:{title:'IT follow-up',lines:['A billing analyst could change the rate table without approval. A new automated check operated only in the final month. Historical change logs are retained.']},
    parts:[
      ['Which additional control area should the auditor prioritize?', 'Access and change controls over the rate table and its historical updates.', 'AU-C 315', 'The automated billing result depends on rate table integrity throughout the period.',
        ['Inventory count instructions at the warehouse.','Inventory count instructions do not address unauthorized billing rates.'],
        ['Approval of petty cash replenishments.','This does not address the billing application’s rate-table exposure.']],
      ['What does testing the final-month check establish by itself?', 'Evidence limited to the covered month, requiring additional evidence for the remaining period.', 'AU-C 330', 'A newly introduced control cannot support operating effectiveness before implementation.',
        ['Operating effectiveness throughout the year because the final-month results were clean.','A clean test does not extend to months when the check did not operate.'],
        ['Sufficient evidence that no unauthorized historical change occurred.','A final-month review alone does not test historical access or changes.']]
    ]
  }
};
