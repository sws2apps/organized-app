# AI Agent Instructions for Organized App

## The Main Flow

Create the following to-do list immediately:

- Analyze user request.
- Analyze similar solutions and code patterns from existing codebase.
- Revise execution plan and present it to the user with todo items.
- Once the user accepts, create revised todo items.
- Start work on the task.
- Use skills and commands that may help to solve current task.

## Rules

- App is local-first with local data storage and most of the logic written on the frontend.
- Data saves instantly. Avoid "Save" buttons where possible.
- Handle text overflow, UI changes, UX writing gracefully for multi-language support.
- Always reuse custom wrappers in `@components/` (Typography, TextField, Button). No raw MUI or HTML.
- Always use `styled-components` for custom styling.
- Always use `useAppTranslation()` from `@hooks/index` for all UI strings. No hardcoded strings.
- Use Jotai atoms from `@states/` for state management (`useAtom`, `useAtomValue`, `useSetAtom`).
- Use IndexedDB layer in `src/indexedDb/` for local data persistence. No direct localStorage for app data.
- Check `src/constants/index.ts` before hardcoding values.
- Use `useBreakpoints()` from `@hooks/index` for responsive logic.
- Use TypeScript path aliases, not relative paths.
- Use CSS variables from `src/global/global.css` (e.g. `var(--accent-300)`). No raw values.
- One feature per branch and per PR. Do not mix unrelated changes.
- Branch names: `feat_scope` for features, `fix_scope` for bugs and UI improvements.
- Keep fork synced with upstream.
- Prefer `gh` CLI.
- PR creation: `gh pr create --title "fix(scope): title" --body-file .github/PULL_REQUEST_TEMPLATE.md`
- PR title format: prefix(scope) message. Prefixes: `fix`, `feat`, `refactor`, `perf`. Scope examples: `meetings`, `reports`, `ui`, `api`, `auth`, `persons`, `settings`.
- Delete irrelevant checklist items from the PR description template.
- Make sure to clean up the comments, unused code, and temporary files like scripts or skills from the code before creating a PR.
