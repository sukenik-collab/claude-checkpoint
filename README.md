# Checkpoint

A Claude skill that documents *how* you worked with AI — while you're working,
not reconstructed from transcripts afterwards.

> "Do this assignment without AI, so we can see how well you'll do a job where
> you'll use AI every day."

Hiring is stuck between two bad options. Live exercises don't resemble how anyone
actually works. Take-homes are now suspected of measuring the model instead of the
candidate. The emerging fix is a good one: do the take-home *with* AI, and submit
the chat logs alongside it.

That solves the reviewer's problem and creates yours. Nobody reads twelve
transcripts — and worse, a transcript hides the exact thing being assessed. The
moment you caught a confident, wrong answer looks identical to every other message
in the wall. Someone who accepted everything and typed a lot can read as more
thorough than someone who rejected three bad suggestions in four exchanges.

**Logs are evidence. They aren't the argument.** This skill produces the argument,
one card per task, as a byproduct of doing the work.

At the end of each task you say:

```
set checkpoint https://claude.ai/share/...
```

and get back a card like this:

```
┌──────────────────────────────────────────────────────────────────┐
│  MER-P1-T2-C1                                       chat log ↗   │
│  Overdue-inspection warning placement                            │
│  Part 1, Task 2 — where the compliance warning surfaces          │
├───────────────┬──────────────────────────────────────────────────┤
│ FRAMING       │ What problem was actually being solved           │
│ DECISION      │ What was chosen, and what was rejected           │
│ AI GAP        │ What the AI got wrong or produced that was cut   │
│ JUDGMENT CALL │ The human judgment that shaped the output        │
│ NAMING        │ Checkpoint ID · artifacts produced               │
│ OUTPUT        │ [confirmed] delivered   [next] what follows      │
└───────────────┴──────────────────────────────────────────────────┘
```

At the end of the project, `compile checkpoints` concatenates them into a single
chronological log with a cover row.

See [`examples/`](examples/) for two rendered cards and a compiled log.

---

## Why

The question behind "send me your chat logs" is always the same one: *where was the
human in this?*

A transcript can't answer it. It shows everything and explains nothing — every
message weighted equally, the decisive corrections buried in the middle of long
exchanges. Reconstructing the answer afterwards means re-reading all of it and
recalling your own reasoning from memory, which is exactly when the specific
moments worth showing have already blurred.

The middle two rows are the whole point. **AI gap** and **Judgment call** are what
separate "here's what the AI produced" from "here's how I worked with AI." They're
written at the moment they happen, while you still remember what you rejected and
why.

Checkpoints sit alongside the raw logs — they don't replace them. Every card links
back to its source conversation, so the claim on the card is checkable in one
click. That's what makes it an argument rather than a summary.

**Beyond hiring:** the same shape applies to client work billed on judgment rather
than output, internal reviews where "why this and not that" gets asked six months
later, and any project where the reasoning is worth more than the artifact.

---

## Where to run this

**Use a Project (Claude.ai) or a repo with a `CLAUDE.md` (Claude Code).** Not a
standalone chat. The skill will generate a perfectly good card in a one-off chat,
but the system around it won't hold:

| | Project / CLAUDE.md | Standalone chat |
|---|---|---|
| PREFIX | set once, applies everywhere | re-asked every chat |
| Part / task numbering | inferred from prior cards | you supply it each time |
| Visual consistency | template enforced across sessions | holds within a chat only |
| `compile checkpoints` | works | nothing to collect |

The last row is the one that matters. Compiling requires access to all the cards at
once, and that's the whole payoff.

### The step people miss

**Save each card into project knowledge as you go.** An artifact generated in one
chat is not readable from another — *even inside the same Project*. Cards left in
their originating chats are invisible at compile time, and you find out at the end
of the assignment, which is the worst moment to find out.

So the loop is: finish a task → `set checkpoint <link>` → **save the HTML into the
project files** → next task. Then run `compile checkpoints` in a fresh chat in that
same project.

In Claude Code this is automatic — the cards are already files on disk, and
`scripts/compile.mjs` reads them directly.

---

## Install

### Claude Code

```bash
git clone https://github.com/sukenik-collab/claude-checkpoint.git \
  ~/.claude/skills/checkpoint
```

Then add the snippet from [`templates/claude_md_snippet.md`](templates/claude_md_snippet.md)
to your project's `CLAUDE.md` and set your `PREFIX`.

### Claude.ai

Create a Project, upload the repo contents to its knowledge, and paste the snippet
from [`templates/claude_md_snippet.md`](templates/claude_md_snippet.md) into the
project's custom instructions. Do all the assignment work in chats inside that
project, and save each finished card back into the project files.

### No install

If you'd rather not set anything up, [`docs/prompt_only.md`](docs/prompt_only.md)
is a self-contained prompt that does most of the same thing. It's the right choice
for a single project; the skill is the right choice across several.

---

## Usage

**Set a checkpoint** — at the end of a completed task:

```
set checkpoint https://claude.ai/share/a7dfdd9e-...
```

The link must be a **public share link**. A private `claude.ai/chat/...` URL works
for you and 404s for everyone else — which is exactly the reader the checkpoint
exists for.

**Compile** — at the end of the project:

```
compile checkpoints
```

Or, if your cards are files on disk:

```bash
node scripts/compile.mjs ./checkpoints submission-log.html
```

The script sorts by ID, copies each card verbatim, and warns on duplicates or mixed
prefixes. It's the preferred path when it's available because it can't accidentally
paraphrase a card you already approved.

The cover title defaults to `Process documentation`. Set `CHECKPOINT_TITLE` to give
the compiled log a name of its own:

```bash
CHECKPOINT_TITLE="Meridian Labs take-home — process log" \
  node scripts/compile.mjs ./checkpoints submission-log.html
```

---

## Checkpoint IDs

```
MER-P1-T2-C1
 │   │  │  └── sequence within the task (C2 = the task was revisited)
 │   │  └───── task number within the part
 │   └──────── part: 0 for setup, then 1, 2, 3…  (T0 = covers the whole part)
 └──────────── your PREFIX, set once
```

---

## Repo layout

```
SKILL.md                        the skill: activation, workflow, hard rules
README.md                       this file
templates/
  checkpoint_card.html          the visual contract — fill tokens, don't restyle
  compiled_view.html            cover row + repeating card block
  claude_md_snippet.md          PREFIX and structure config
docs/
  schema.md                     the six rows, with good and bad examples
  prompt_only.md                no-install version
examples/
  MER-P0-T0-C1.html             setup checkpoint (shows the P0/T0 convention)
  MER-P1-T2-C1.html             a task checkpoint
  MER-COMPILED.html             both, compiled
scripts/
  compile.mjs                   deterministic compiler, zero dependencies
```

---

## The three rules that matter

**Never fabricate an AI gap.** If nothing was caught, the row says so. Manufactured
self-awareness is the easiest thing in the world for a careful reader to spot, and
it discredits every other card in the set. One honest "no significant gap" is what
makes the rest credible.

**Never redesign the card.** The template is a contract. Cards are only valuable as
a set, and a set that looks different every session isn't one.

**Never checkpoint work you can't see.** No reconstructing a plausible session from
a task name.

---

## Notes

Examples use **Meridian Labs**, a fictional fleet-maintenance company. The share
links in them are placeholder UUIDs and don't resolve.

MIT licensed. Fork it, change the schema, restyle the card — the six rows are a
starting point that works, not a standard.
