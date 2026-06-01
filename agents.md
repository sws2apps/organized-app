# AI Agent Instructions for Organized App

## The Main Flow

Create the following to-do list immediately:
- Analyze user request.
- Analyze solutions and examples from existing codebase.
- Revise execution plan and present it to the user with todo items.
- Once the user accepts, create revised todo items.
- Start work on the task.
- Use skills and commands that may help to solve current task.

## Rules

- Analyze existing patterns and follow the code style.
- App is local-first. Works offline.
- Data saves instantly. Avoid "Save" buttons.
- Handle text overflow gracefully for multi-language support.
- Always reuse custom wrappers in `@components/` (Typography, TextField, Button). No raw MUI or HTML.
- Always use `styled-components` for custom styling.
- Check `src/constants/index.ts` before hardcoding values.
- Use `useBreakpoints()` from `@hooks/index` for responsive logic.
- Use TypeScript path aliases, not relative paths.
- Use CSS variables from `src/global/global.css` (e.g. `var(--accent-300)`). No raw values.
- One feature per branch and per PR. Do not mix unrelated changes.
- Branch names: `feat/` for features, `fix/` for bugs and UI improvements.
- Keep fork synced with upstream.
- Prefer `gh` CLI.
- PR creation: `gh pr create --title "fix(scope): title" --body-file .github/PULL_REQUEST_TEMPLATE.md`
- PR title format: prefix(scope) message. Prefixes: `fix`, `feat`, `refactor`, `perf`. Scopes: `meetings`, `reports`, `ui`, `api`, `auth`, `persons`, `settings`.
- Delete irrelevant checklist items from the PR description template.
