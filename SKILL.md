---
name: checkpoint
description: >
  Generates a structured checkpoint card at the end of each task in an AI-assisted
  project, capturing framing, decision, AI gap, judgment call, naming, and output,
  with a link to the source chat log. Triggered by "set checkpoint" followed by a
  public share link; "compile checkpoints" concatenates the full set into a single
  chronological log with a cover row. Use for take-home assignments, client work,
  or any project where how you worked with AI is part of the deliverable.
---

# Checkpoint — Instructions

## Purpose

Produce the process documentation *while* the work happens instead of reconstructing
it afterwards from raw transcripts.

A transcript shows everything and explains nothing. Every message is weighted
equally, so the one exchange where the human caught a confident, wrong answer reads
the same as the ten around it. Logs are evidence; they aren't the argument.

A checkpoint is the argument. It answers the four questions a reader actually has —
what was the problem, what was decided, where did the AI fall short, and what human
judgment shaped the result — and links back to the log so every claim on the card is
checkable in one click. Checkpoints sit alongside the raw logs. They never replace
them.

The cards are only valuable as a set. A reader should be able to scan eight of them
and see a consistent shape. That means the visual format is a contract, not a
suggestion: render from `templates/checkpoint_card.html` and fill the tokens. Do
not redesign the card, rename classes, or restyle it, even slightly, and even if a
previous card in the project looks different.

---

## Activation

### Explicit triggers

- `set checkpoint <share link>` — generate one checkpoint card.
- `compile checkpoints` — concatenate all checkpoints into a single log.

Both phrases are unambiguous. Act on them directly.

### Automatic (requires setup)

If the CLAUDE.md snippet is installed (see `templates/claude_md_snippet.md`), the
`PREFIX` and any project-specific conventions are read from there at session start.
Without it, the skill still works — you'll be asked for a `PREFIX` once.

### Do NOT activate for

- General requests to summarize a conversation.
- Mid-task status updates. A checkpoint marks a *completed* unit of work.
- Any message using the word "checkpoint" in an unrelated sense (git checkpoints,
  model checkpoints, save states).

---

## Step 0 — Resolve the PREFIX

The `PREFIX` is a short project tag (2–4 characters) used in every checkpoint ID.

1. If the CLAUDE.md snippet defines one, use it.
2. If earlier checkpoints exist in this project or conversation, reuse their prefix.
3. Otherwise ask once, in one line:

> "What prefix should I use for this project's checkpoint IDs? (2–4 characters —
> initials, a project code, anything short. I'll use `CP` if you have no preference.)"

Never invent a prefix silently, and never change an established one.

---

## Step 1 — Resolve the checkpoint ID

Format: `{PREFIX}-P{part}-T{task}-C{n}`

| Segment | Meaning |
|---------|---------|
| `part` | Section of the work. `0` for setup, then `1`, `2`, `3`… per section. |
| `task` | Task number within that section. Use `T0` when the checkpoint covers multiple tasks or an entire section. |
| `n` | Sequence within that task. `C1` unless a second checkpoint is being set for the same task. |

Infer part and task from the conversation where it's unambiguous. Where it isn't,
ask — one short question, not a form. Do not guess at numbering: a wrong ID
silently corrupts the ordering of the final compiled log.

Increment `n` rather than overwriting when a task is revisited. Two checkpoints on
one task is a legitimate record of rework, not an error to be tidied away.

---

## Step 2 — Identify the source material

The rows describe the actual work, so you need the actual work in front of you.

- **Same conversation** (the usual case): write the rows from this conversation.
- **Different conversation**: if the share link points to work not in context,
  fetch it and write from what it contains.
- **Neither available**: stop and say so. Ask the user to summarize the session or
  to run the checkpoint in the source conversation. Do not reconstruct a plausible
  session from the task name.

---

## Step 3 — Write the six rows

Always all six, always in this order. Full schema and worked guidance in
`docs/schema.md`.

**Framing** — What problem was actually being solved. One short paragraph. Write
the problem as it existed *before* the answer was known, including the ambiguity or
constraint that made it non-trivial. If this row could be copied from the task
prompt, it isn't doing any work.

**Decision** — What approach or answer was chosen, and why. Name the alternatives
that were considered and set aside. A decision with no rejected alternative reads
as the only option available, which is almost never true and wastes the row.

**AI gap** — What the AI got wrong, missed, or produced that was rejected or
corrected. Be specific and factual: what it proposed, why it was wrong, how it was
caught. If nothing meaningful was caught, write exactly:

> No significant gap — output was used largely as generated.

Optionally add one sentence of context. **Never invent a critique to fill this
row.** A manufactured gap is worse than an honest blank one — it is the single
easiest thing for a careful reader to catch, and it discredits every other card in
the set.

**Judgment call** — The specific human judgment that shaped the output. The
highest-signal row. Pull it from an explicit moment: a correction, a pushback, a
rejected suggestion, an editorial call. Quote or paraphrase what actually happened.
If the honest answer is that the human accepted the output as-is, say that here
too — but then this row and the AI gap row are both empty, which usually means the
task wasn't substantial enough to checkpoint.

**Naming** — The checkpoint ID first, then any artifact names, file references, or
live URLs produced in the session, separated by ` · `. Rendered in monospace.

**Output** — Two lines. `confirmed`: what was produced and delivered. `next`: what
comes next. Both tags always appear; if the project is finished, the next line says
so.

### Length

Two to four sentences per row. Long enough to carry the reasoning, short enough
that the card stays scannable at a glance. Framing gets one paragraph. Judgment
call may run slightly longer than the others — it earns it.

---

## Step 4 — Render the card

1. Read `templates/checkpoint_card.html`.
2. Replace every `{{TOKEN}}`. Delete the guide comment at the top.
3. Change nothing else. Not the CSS, not the class names, not the row order, not
   the markup structure.
4. Output as a standalone HTML file (or artifact) named `{CHECKPOINT_ID}.html`.
5. **Tell the user to save the file into project knowledge before leaving the
   session.** An artifact generated in one chat is not readable from another, even
   within the same project. A card that stays in its originating chat is invisible
   at compile time, and that is discovered at the end of the project — the worst
   possible moment. One line is enough: "Save this into the project files so it's
   available when you compile."

   Skip this only in Claude Code or another filesystem environment, where the file
   is already written to disk.

Tokens: `{{CHECKPOINT_ID}}`, `{{TITLE}}`, `{{SESSION_DESCRIPTOR}}`, `{{SHARE_URL}}`,
`{{FRAMING}}`, `{{DECISION}}`, `{{AI_GAP}}`, `{{JUDGMENT_CALL}}`, `{{NAMING}}`,
`{{OUTPUT_CONFIRMED}}`, `{{OUTPUT_NEXT}}`.

`{{TITLE}}` is a short descriptive name for the session — five words or fewer.
`{{SESSION_DESCRIPTOR}}` is the one-line locator: `Part 2, Task 1 — funnel drop-off
analysis`.

---

## Step 5 — Confirm

Report the ID and one line on what the next checkpoint is expected to cover. Keep
it to two lines. The card is the output; don't restate its contents in prose.

---

## The share link

Every card links to its source conversation. The rules are absolute:

- Use **only** the public share link the user provides.
- Never substitute a private chat URL (`claude.ai/chat/...`). It resolves for the
  author and 404s for everyone else — which is exactly the reader the checkpoint
  exists for.
- Never fabricate, guess, or reconstruct a link. If none was provided, ask for it.
- Render it as an anchor labeled `chat log ↗` in the header, top right.

If the user says to set a checkpoint but omits the link, generate everything else
and ask for the link before finalizing. Do not ship a card with a dead anchor.

---

## Compile checkpoints

On `compile checkpoints`:

1. Collect every checkpoint in the project. In Claude.ai this means the cards saved
   into project knowledge — **not** artifacts still sitting in other chats, which
   aren't readable from here. In Claude Code, read them from disk.

   Run the compile in a fresh session. A long working chat is the wrong context to
   assemble twelve cards in, and starting clean makes it obvious which cards were
   actually saved and which were lost.
2. Sort chronologically by ID: part, then task, then sequence.
3. Read `templates/compiled_view.html`. Fill the cover row: `{{TOTAL_COUNT}}`,
   `{{PARTS_COVERED}}` (e.g. `P0–P4`), `{{COMPILED_DATE}}`,
   `{{COMPILATION_TITLE}}`.
4. Repeat the card block once per checkpoint, in order, with
   `<div class="divider"></div>` between each. No divider after the last card.
5. Output as one standalone HTML file.

If the checkpoint files exist on disk, `scripts/compile.mjs` does steps 1–4
deterministically and is the preferred path — it cannot paraphrase a card by
accident. Where checkpoints only exist as chat artifacts, rebuild them into the
template manually, copying each card's row content **verbatim**. Compiling is
assembly, not editing. Do not improve, shorten, or harmonize the wording of a card
that was already approved.

Before finalizing, state the count and flag any gap in the sequence (e.g. a missing
`P2-T2`). A gap means one of two things: a task the user forgot to log, or a card
that was generated but never saved out of its chat. Say which you suspect and name
the missing ID. If the card exists in another conversation, it can be recovered —
open that chat, re-render it, save it, and compile again. Do not rewrite a missing
card from scratch to fill the hole.

---

## Hard rules

1. Never fabricate an AI gap or a judgment call.
2. Never use a private chat URL in place of a public share link.
3. Never redesign the card. The template is the format.
4. Never write a checkpoint for work you cannot see.
5. Never silently renumber or overwrite an existing checkpoint.

---

## Why the rows are ordered this way

Framing and Decision establish that a real problem was solved. AI gap and Judgment
call are the two rows a reader actually came for — they separate the human's
contribution from the tool's. Naming and Output make the card navigable as part of
a set rather than a standalone document.

A checkpoint that is strong on the first two rows and empty on the middle two is a
status report. The middle two are the point.
