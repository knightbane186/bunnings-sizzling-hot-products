# Git Workflow

Use short-lived branches for changes instead of committing directly to `main`.

Suggested branch names:

- `feature/<name>` for normal improvements.
- `fix/<name>` for bug fixes.

Before opening a PR:

```bash
npm run check
```

PR descriptions should include:

- what changed
- why it changed
- how it was tested
- any trade-offs or follow-up work
