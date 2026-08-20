# Checkpoint schema

Six rows, fixed order, every card. The order is deliberate — see the end of
`SKILL.md` for why.

Examples below use **Meridian Labs**, a fictional fleet-maintenance SaaS company,
as the project context.

---

## 1. Framing

*What problem was actually being solved.* One short paragraph.

Write the problem as it existed before the answer was known. Include the constraint
or ambiguity that made it non-obvious.

✅ "The brief asked for an overdue-inspection warning but didn't say where it
lives. The obvious placement is a compliance dashboard, but dispatchers never open
one — they work from the assignment queue. The real question was which surface puts
the warning in front of the person at the moment they can still act on it."

❌ "Design the overdue-inspection warning for Meridian's fleet product."
*(That's the task prompt, restated. It tells the reader nothing they couldn't read
themselves.)*

---

## 2. Decision

*What approach or answer was chosen, and why.*

Name what was set aside. Rejected options are content, not clutter — they show the
decision had a shape.

✅ "Surfaced the warning inline in the assignment queue, on the vehicle row, at the
moment of dispatch. Rejected a dedicated compliance dashboard (correct data, wrong
audience — dispatchers don't open it) and a push notification (assumes a
notification infrastructure the brief doesn't establish)."

❌ "Decided to show the warning in the assignment queue."
*(True, but a decision with no alternative reads as the only option available.)*

---

## 3. AI gap

*What the AI got wrong, missed, or produced that was rejected or corrected.*

Be specific and factual. What did it propose, why was it wrong, how was it caught?

✅ "Claude's first pass built the warning as a notification-center pattern,
assuming a push and inbox layer that doesn't exist in the brief. Rejected — it
imported an architecture from adjacent products rather than reading the constraints
given."

✅ (Honest blank) "No significant gap — output was used largely as generated."

❌ "Claude's tone was slightly too formal and needed light editing."
*(A manufactured gap. It reads as filler and undermines the credibility of every
other card.)*

**Rule:** if nothing meaningful was caught, use the blank phrasing verbatim.
Optionally add one sentence of context. Never invent a critique.

---

## 4. Judgment call

*The specific human judgment that shaped the final output.* The highest-signal row.

Pull it from an explicit moment — a correction, a pushback, a rejected suggestion,
an editorial call. This row is what separates "here's what the AI produced" from
"here's how I worked with AI."

✅ "The dashboard option was rejected on audience grounds, not data grounds — the
call was that a warning nobody sees isn't a warning. That reframing came from
knowing dispatcher behavior, which isn't in the brief and wasn't going to come from
the model."

❌ "Reviewed the output and made improvements."
*(No decision is visible. Nothing here could have gone the other way.)*

If the honest answer is that the output was accepted as-is, say so. But when both
this row and the AI gap row are empty, the task probably wasn't substantial enough
to checkpoint.

---

## 5. Naming

*The checkpoint ID plus artifacts produced.* Monospace, separated by ` · `.

```
MER-P1-T2-C1 · P1-T2_Warning_Placement.md · queue-row-spec.png
```

Include live URLs where they exist. This row is what makes the compiled log
navigable — it's the index.

---

## 6. Output

*What was produced, and what comes next.* Two tagged lines, both always present.

```
confirmed   Placement decision documented with the two rejected alternatives and
            the dispatcher-behavior rationale. Spec handed to design.
next        Task 3 — empty and error states for the queue row.
```

When the project is finished, the `next` line says so: "Part 4 complete — run
'compile checkpoints'."

---

## Length

Two to four sentences per row. Framing gets one paragraph. Judgment call may run
slightly longer — it earns it.

The card has to stay scannable. A reader looking at eight of these should be able
to read one in about twenty seconds and the whole set in three minutes.

---

## When to set a checkpoint

At the end of a completed unit of work — a task, not a message.

Good moments: a decision was made and defended; something the AI produced was
rejected or reshaped; an artifact was finalized.

Poor moments: mid-exploration; a mechanical step with no decision in it; a session
where you'd be inventing content for the middle two rows.

Fewer, denser checkpoints beat a card for every exchange.
