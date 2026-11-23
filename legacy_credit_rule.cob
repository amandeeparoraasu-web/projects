       identification division.
       program-id. CREDIT-RULE.
       data division.
       working-storage section.
       01 days-past-due pic 9(3).
       01 utilization-pct pic 9(3).
       01 decision pic x(9).
       procedure division.
           accept days-past-due
           accept utilization-pct
           evaluate true
               when days-past-due > 0 move "REVIEW" to decision
               when utilization-pct >= 90 move "HOLD" to decision
               when utilization-pct <= 30 move "ELIGIBLE" to decision
               when other move "UNCHANGED" to decision
           end-evaluate
           display function trim(decision)
           stop run.
