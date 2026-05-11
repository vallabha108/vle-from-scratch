# Contributing

This repo is primarily a teaching artefact. Contributions are welcome but
they must respect the lesson-tag structure.

## Rules

1. **Never force-push a `lesson-N` tag.** If a lesson needs fixing, ship a
   `lesson-N.1` tag and update `docs/COMPARISON.md`.
2. **One concept per lesson.** If your PR touches >1 conceptual area, split it.
3. **Every code change must update at least one of:** the lesson README,
   the exercises, or the comparison log.
4. **No secrets.** Use `.env.example`. Pre-commit hooks (added lesson-09)
   will reject anything that looks like a key.
5. **Match the production sibling.** If you diverge from `vallabha_vle` in
   a way not already recorded in `docs/COMPARISON.md`, add a row.

## PR template

```
Lesson affected: lesson-NN
Type: [content | code | infra | docs | fix]
Comparison-log updated: yes/no/N/A
```
