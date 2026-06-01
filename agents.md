# AI Agent Instructions for Organized App

This file provides guidance to AI agents when working with code in this repository.

## The Main Flow

Create the following to-do list immediately:

- Analyze user request.
- Analyze solutions and examples from existing codebase.
- Revise execution plan and present it to the user with todo items.
- Once the user accepts, create revised todo items.
- Start work on the task.
- Use skills and commands that may help to solve current task.

## General Principles

- **Analyse and Adapt**: Follow the existing code writing style. Always analyse existing patterns before implementing changes.
- **Local-First**: The app must work in the browser without an internet connection.
- **Autosave Priority**: Data entry and settings changes should save instantly — no "Save" button unless unavoidable.
- **Multi-Language**: Translated strings are often much longer than English. Ensure UI elements handle text overflow gracefully.

## Codebase Conventions

- **Design System**: Use custom wrappers under `@components/` (e.g. `Typography`, `TextField`, `Button`) instead of raw MUI or HTML elements.
- **Constants**: Check `src/constants/index.ts` before hardcoding values or writing inline conditionals.
- **Breakpoints**: Use `useBreakpoints()` from `@hooks/index` for all responsive logic.
- **Path Aliases**: Always use TypeScript path aliases instead of relative paths.
- **Global Styles**: Use CSS variables from `src/global/global.css` (e.g. `var(--accent-300)`, `var(--radius-xl)`) — never hardcode raw values.

## Git & GitHub Workflow

- Work in a dedicated branch per task. Branch names should start with `feat/` for new features or `fix/` for bug fixes and UI improvements.
- Keep your fork in sync with upstream before starting work.
- **Prefer `gh` CLI** for all GitHub-related actions (creating PRs, checking CI status, etc.).

### Creating a Pull Request

Use `gh pr create` and pull the description from the repo's PR template:

```bash
gh pr create --title "fix(scope): your title here" --body-file .github/PULL_REQUEST_TEMPLATE.md
```

The PR title **must** follow [conventional-changelog](https://github.com/semantic-release/semantic-release#commit-message-format) format:

| Prefix            | When to use                               | Example                                            |
| ----------------- | ----------------------------------------- | -------------------------------------------------- |
| `fix(scope)`      | Bug fixes, UI improvements                | `fix(meetings): fix mobile attendance grid layout` |
| `feat(scope)`     | New features                              | `feat(reports): add attendance export to CSV`      |
| `refactor(scope)` | Code refactoring without behavior changes | `refactor(utils): simplify date formatting logic`  |
| `perf(scope)`     | Performance improvements                  | `perf(api): cache source materials response`       |

Common scopes: `meetings`, `reports`, `ui`, `api`, `auth`, `persons`, `settings`.

Fill in the body based on `.github/PULL_REQUEST_TEMPLATE.md`. Delete checklist items that are not relevant.
