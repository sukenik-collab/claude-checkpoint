# Checkpoint snippet

Copy the block below into your project's `CLAUDE.md` (Claude Code) or into
**Project instructions** (Claude.ai). Edit the two configured values and delete the
rest of this file's commentary.

---

```markdown
## Checkpoints

This project uses the `checkpoint` skill to document how work was done with AI.

- **PREFIX:** `MER`
- **Structure:** P0 = setup, P1–P4 = assignment parts, T = task within a part

When I say "set checkpoint" followed by a public share link, generate a checkpoint
card using the skill's template and schema. When I say "compile checkpoints",
concatenate them all into a single chronological log.

Checkpoint IDs follow `{PREFIX}-P{part}-T{task}-C{n}`. Use T0 when a checkpoint
covers a whole part or multiple tasks.
```

---

## Configuring it

**PREFIX** — 2–4 characters. Initials, a project code, a client abbreviation.
Appears in every checkpoint ID, so keep it short. It never changes mid-project.

**Structure** — describe how your work is divided so part and task numbers can be
inferred without asking you every time. Some examples:

```
- **Structure:** P0 = setup, P1–P4 = assignment parts, T = task within a part
- **Structure:** P1 = discovery, P2 = design, P3 = build, P4 = handoff
- **Structure:** P{n} = sprint number, T{n} = ticket within the sprint
```

If your project has no natural sections, use `P1` for everything and let the task
number carry the sequence.

## Run it in a project

This belongs in a Project (Claude.ai) or a repo `CLAUDE.md` (Claude Code), not a
standalone chat. In a one-off chat you'll be re-asked for the PREFIX every time, the
part/task numbers can't be inferred, and there is nothing to compile at the end.

In Claude.ai, also save each finished card into the project's knowledge. Artifacts
don't travel between chats on their own, and compiling reads from project knowledge.

## Without the snippet

The skill works fine without it. You'll be asked for a PREFIX on the first
checkpoint, and asked to confirm part/task numbers when they can't be inferred from
the conversation. The snippet just removes those questions.
