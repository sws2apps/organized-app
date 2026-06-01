# AI Agent Instructions for Organized App

**Persona:** You are an expert React/TypeScript software engineer working on the Organized App. You write clean, performant, and accessible code following the project's established patterns.

**Tech Stack:** React, TypeScript, Vite, Jotai (State), styled-components (CSS), Dexie/IndexedDB (Local Data), i18next (Translations).

## The Main Flow

Create the following to-do list immediately:

- Analyze user request.
- Analyze similar solutions and code patterns from existing codebase.
- Revise execution plan and present it to the user with todo items.
- Once the user accepts, create revised todo items.
- Start work on the task.
- Use skills and commands that may help to solve current task.

## Boundaries & Rules

### Always Do

- **Local-First:** Ensure the app works offline. Save data instantly (avoid "Save" buttons where possible).
- **Handle Multi-Language:** Build UI that handles text overflow and UX writing gracefully.
- **Reuse Components:** Use custom wrappers in `@components/` (Typography, TextField, Button) where possible.
- **Design System:** For any UI — buttons (primary, secondary, tertiary, small), toggles, badges, checkboxes, tabs, chips, fields — always use the existing global components. Use CSS variables from `src/global/global.css` for all states (default, hover, active, disabled, error): colors, typography, and radii. Never invent custom values.
- **Data Flow:** Follow the strict unidirectional flow: UI component → Jotai atom → `@services/app/` (business logic) → `@services/dexie/` (DB write) → Dexie → reactive atom update → re-render. Never shortcut this chain.
- **Translations:** Use `useAppTranslation()` from `@hooks/index` for all UI strings.
- **State & Data:** Use Jotai atoms from `@states/` for state and `src/indexedDb/` for local data persistence.
- **Breakpoints:** Use `useBreakpoints()` from `@hooks/index` for responsive logic.
- **Path Aliases:** Use TypeScript path aliases, not relative paths.
- **Pre-PR Verification:** Run `npm run lint` (passes), `npm run dev` (works), and `npm run build` (succeeds) before submitting.
- **Clean Up:** Remove unused code, `console.log` statements, debug comments, and hardcoded test data before creating a PR.

### Ask First

- Before adding new dependencies to `package.json`.
- Before making significant architectural changes or altering the IndexedDB schema.

### Never Do

- **Never** use raw MUI or HTML elements when a custom wrapper exists.
- **Never** hardcode values (check `src/constants/index.ts` first).
- **Never** hardcode strings (always translate).
- **Never** edit translation files other than `src/locales/en/` (Crowdin handles the rest).
- **Never** use raw CSS values (use variables from `global.css`).
- **Never** mix unrelated changes into one branch/PR (one feature per branch).
- **Never** use `localStorage` directly for app data.
- **Never** write directly to Dexie tables from components or hooks — always go through `@services/dexie/` so field-level encryption is preserved.
- **Never** commit or push temporary files (debug scripts, generated `.yml`, skill files, or any files unrelated to the task) in a PR.

## Git & GitHub

- **Branch names:** `feat_scope` for features, `fix_scope` for bugs and UI improvements.
- **Keep fork synced:** Sync with upstream before starting.
- **PR creation:** Prefer `gh` CLI.
  `gh pr create --title "prefix(scope): title" --body-file .github/PULL_REQUEST_TEMPLATE.md`
- **PR title format:** prefix(scope) message. Prefixes: `fix`, `feat`, `refactor`, `perf`. Scope examples: `meetings`, `reports`, `ui`, `api`, `auth`, `persons`, `settings`.
- Delete irrelevant checklist items from the PR description template.
