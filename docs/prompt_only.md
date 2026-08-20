# The prompt-only version

If you don't want to install anything, paste this into your project instructions.
It produces the same cards with a bit more format drift between sessions, because
there's no template file to render from — each card is rebuilt from a description.

Set `PREFIX` on the first line and you're done.

---

```
CHECKPOINT INSTRUCTIONS

Set PREFIX = [2–4 characters — initials, project code, anything short].

When I say "set checkpoint" followed by a share link, generate a checkpoint
artifact using the structure and visual format below.

Naming convention: {PREFIX}-P{part}-T{task}-C{n}
  part = section of the work (0 for setup, then 1, 2, 3… per section)
  task = task number within that section
  n    = checkpoint sequence within that task
If a checkpoint covers multiple tasks or a whole section, use T0 as the task
designator.

The share link I provide is always a public share link. Render it as a clickable
anchor labeled "chat log ↗" in the top-right of the card. Never substitute a
private chat URL — only use the public share link I give you. If I forget to
include one, ask before finalizing.

Standard row schema — always include all six rows in this order:

  Framing       — What problem was actually being solved. One short paragraph.
  Decision      — What approach or answer was chosen, and why. Name the
                  alternatives that were set aside.
  AI gap        — What the AI got wrong, missed, or produced that was rejected
                  or corrected. If nothing meaningful was caught, write "No
                  significant gap — output was used largely as generated"
                  rather than inventing a critique.
  Judgment call — The specific human judgment that shaped the final output. The
                  highest-signal row — pull it from an explicit moment where a
                  correction, pushback, or editorial decision was made.
  Naming        — The checkpoint ID in monospace, plus any key artifact or file
                  names produced in this session.
  Output        — What was produced (confirmed) and what comes next (next).

Two to four sentences per row. Never fabricate content for the AI gap or
Judgment call rows.

Visual format: a single card with the monospace checkpoint ID, a title, and a
short session descriptor at the top; the "chat log ↗" anchor in the top-right; a
single-bordered grid below with one labeled row per schema item; confirmed/next
tags in the Output row. The first checkpoint you generate establishes the
canonical visual format — match it exactly on every subsequent one.

When I say "compile checkpoints," concatenate all checkpoint artifacts from this
project into a single artifact in chronological order, separated by a thin
divider, with a cover row at the top showing the total checkpoint count and the
sections covered. Copy each card's content verbatim — compiling is assembly, not
editing.
```

---

## What you give up

**Format drift.** Without a template file, each session rebuilds the card from the
description. In practice the six-row schema holds perfectly, but the CSS gets
reinvented — palette, class names, spacing. Cards from session 1 and session 8 stop
looking like a set. That is the specific problem the skill's template file solves.

**Portability.** Project instructions live in one project. A skill installs once and
works everywhere.

**Nothing changes about where it runs.** Both versions need a Project (or a
`CLAUDE.md`), and both need you to save each card into project knowledge as you go.
That isn't a skill-versus-prompt difference — it's how artifacts work.

**The safety rails.** The skill's Step 2 refuses to write a checkpoint for a session
it can't see, and the compile step flags gaps in the sequence. The prompt version
does neither.

For a single project, the prompt is fine. Across several, install the skill.
