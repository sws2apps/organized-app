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

- **Local-First:** App works offline. Save data instantly (avoid "Save" buttons where possible).
- **Handle Multi-Language:** Build UI that handles text overflow and UX writing gracefully.
- **Accessibility:** Use semantic HTML, ARIA labels, and ensure keyboard navigation and screen reader support.
- **Design System:** For any UI — buttons (primary, secondary, tertiary, small), toggles, badges, checkboxes, tabs, chips, fields — use global components from `@components/` and CSS variables from `src/global/global.css` for all states (default, hover, active, disabled, error). Never invent custom values.
- **Data Flow:** UI → Jotai atom → `@services/app/` → `@services/dexie/` → Dexie (auto-syncs atoms). Never shortcut this chain.
- **Translations:** Use `useAppTranslation()` from `@hooks/index` for all UI strings.
- **State:** Use Jotai atoms from `@states/` (`useAtom`, `useAtomValue`, `useSetAtom`).
- **Breakpoints:** Use `useBreakpoints()` from `@hooks/index` for responsive logic.
- **Path Aliases:** Use TypeScript path aliases, not relative paths.
- **Types:** Check `@definition/` for existing types before defining new ones inline.
- **Services & Utils:** Use `@services/` for business logic and DB writes, `@utils/` for helpers. Don't duplicate.
- **Feature Structure:** Follow `index.tsx` (UI) + `useFeatureName.tsx` (logic) per feature folder.
- **Before PR:** Run `npm run lint`, `npm run dev`, and `npm run build`. Remove unused code, `console.log` statements, and debug comments.

### Ask First

- Before adding new dependencies to `package.json`.
- Before significant architectural changes or altering the IndexedDB schema.

### Never Do

- **Never** use raw MUI or HTML elements when a custom wrapper exists.
- **Never** hardcode values or strings — check `src/constants/index.ts` for values; always translate strings.
- **Never** edit translation files other than `src/locales/en/` (Crowdin handles the rest).
- **Never** use raw CSS values (use variables from `global.css`).
- **Never** mix unrelated changes into one branch/PR (one feature per branch).
- **Never** use `localStorage` or write directly to Dexie — always use `@services/dexie/` to preserve field-level encryption.
- **Never** commit or push temporary files (debug scripts, generated `.yml`, skill files, or unrelated files) in a PR.

## Git & GitHub

- **Branch names:** `feat_scope` for features, `fix_scope` for bugs and UI improvements.
- **Keep fork synced:** Sync with upstream before starting.
- **PR creation:** Prefer `gh` CLI.
  `gh pr create --title "prefix(scope): title" --body-file .github/PULL_REQUEST_TEMPLATE.md`
- **PR title format:** prefix(scope) message. Prefixes: `fix`, `feat`, `refactor`, `perf`. Scope examples: `meetings`, `reports`, `ui`, `api`, `auth`, `persons`, `settings`.
- Delete irrelevant checklist items from the PR description template.
