# 🤖 Agents Guide for `organized-app`

This document describes how AI coding agents should operate in this repository. It provides explicit rules, conventions, and workflows for safe, reliable automation.

> **Audience**: AI assistants (GitHub Copilot, automation bots).
>
> **For Humans**: See detailed guides in [`docs/`](docs/):
>
> - [FEATURE_DEVELOPMENT_GUIDE.md](docs/FEATURE_DEVELOPMENT_GUIDE.md) - Feature development workflow
> - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architectural patterns and layer responsibilities
> - [REFACTORING_GUIDE.md](docs/REFACTORING_GUIDE.md) - Refactoring existing features

---

## 1. Core Purpose of the Project

`organized-app` is a local-first, secure, end‑to‑end encrypted, multilingual PWA that helps Jehovah's Witnesses congregations manage assignments, schedules, reports, and related congregation data. Performance, privacy, offline-first robustness, and accessibility are important.

---

## 2. Tech Stack Overview

- Runtime: Node.js 22.x (engines enforced) + modern browsers
- Frontend: React 19 + TypeScript + Vite 7
- Routing: react-router v7 (hash-based routing via `createHashRouter`)
- State: Jotai, React Query (@tanstack/react-query v5)
- Styling: MUI (@mui/material, @emotion)
- i18n: i18next + react-i18next (Crowdin sync)
- Persistence: IndexedDB via Dexie (local-first) + encrypted sync through backend API
- PDF/Print: @react-pdf/renderer, react-pdf-html, write-excel-file, jszip
- Scheduling/Parsing: meeting-schedules-parser
- Background Processing: Web Workers (native Worker API, vite-plugin-comlink for build)
- Tooling: ESLint v9 (flat config), Prettier, semantic-release, Workbox for service worker build
- Distribution: PWA (service worker + manifest), Firebase messaging, deployment via CI (GitHub Actions) and test environment

---

## 3. Repository Conventions

- Branching: Main line development on `main`. Feature branches typically named `feat/...` and fixes `fix/...` (PR titles must follow Conventional Commits).
- Commit / PR message format: Conventional Commits (semantic-release). Custom types include `tweak`, `flag` (release = patch). Avoid noise commits.
- Linting: Run `npm run lint` before proposing changes that touch TS/TSX files. Uses ESLint v9 flat config (`eslint.config.js`).
- Build check: `npm run build` must succeed; it runs Vite build + Workbox generation.
- i18n: Don't hardcode strings—add them **only to English locale** (`src/locales/en/`). Other languages are handled automatically by Crowdin.
- Feature flags: Some code paths guarded (in progress); do not remove flags unless feature fully shipped.
- Accessibility: Prefer semantic elements, aria labels where needed, keyboard navigation.
- Routing: Hash-based routing via `createHashRouter` from `react-router` (not `react-router-dom`). Routes registered in `src/App.tsx`.

---

## 4. Agent Behavior Principles

1. Minimal, Atomic Changes: Prefer small, reviewable PRs per feature/fix.
2. Deterministic Output: No speculative API additions; verify existing patterns before extending.
3. Security & Privacy: Never log or expose encryption keys or internal user secrets. Avoid adding analytics without explicit approval.
4. Local-First Respect: Never move core data flows to remote-first design; preserve offline capability.
5. Performance Awareness: Avoid heavy synchronous loops on render paths; leverage React Query caching, suspense patterns carefully.
6. Internationalization: All user-visible text must be internationalized in English locale only (`src/locales/en/`). Crowdin handles other languages automatically.
7. Idempotence: Scripts or migrations must be safe to re-run.

---

## 5. Allowed / Disallowed Actions for Automation

| Action                       | Allowed?              | Notes                                                                    |
| ---------------------------- | --------------------- | ------------------------------------------------------------------------ |
| Modify UI components         | Yes                   | Follow existing folder/filename patterns. Keep props typed.              |
| Add new dependency           | Caution               | Justify necessity. Prefer existing libs. Update lockfile.                |
| Remove dependency            | Caution               | Ensure no transitive usage. Search repo.                                 |
| Adjust build config          | Caution               | Must not break PWA/service worker. Test build.                           |
| Update release config        | Rare                  | Coordinate with maintainers.                                             |
| Generate large refactors     | No (without approval) | Risky for maintainability.                                               |
| Add i18n keys                | Yes                   | Only to English (`src/locales/en/`). Crowdin handles other translations. |
| Commit generated assets      | Only if required      | e.g., tokens, icons after running scripts.                               |
| Touch licensing/legal docs   | No                    | Unless explicitly instructed.                                            |
| Modify encryption/auth flows | No                    | Requires human security review.                                          |

---

## 6. Standard Operational Workflows (SOPs)

### 6.1 Add a New UI Component

1. Create folder: `src/components/<component_name>/`
2. Add typed props interface in component file
3. Export via `src/components/index.ts` (Note: Comment says "DO NOT ADD ANY NEW COMPONENTS IN THIS FILE" - export from folder's `index.tsx` instead)
4. Use MUI `styled` or `sx` props for styling
5. Add i18n keys for any user-visible text

### 6.2 Add a New Page

1. Create folder: `src/pages/<section>/<page_name>/`
2. Create `index.tsx` (page component - thin, 50-100 lines max)
3. Create `use<PageName>.tsx` (page hook - UI orchestration only, 50-100 lines max)
4. Add route in `src/App.tsx` (hash-based routing via `createHashRouter`)
5. Use `PageTitle` component with title and buttons

**Page Layer Responsibilities:**

- **Page component**: Layout only (PageTitle + dialogs + feature container)
- **Page hook**: UI orchestration only (buttons, modal state, navigation)
- **NO business logic or CRUD operations in page layer**

### 6.3 Add a New Feature

**Critical**: Follow strict 4-layer architecture. See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

1. Create folder: `src/features/<section>/<feature_name>/`
2. Create **`index.types.tsx`** FIRST (centralized types)
3. Create **`useFeatureName.tsx`** (feature hook - ALL business logic, CRUD, filtering)
4. Create **`index.tsx`** (feature container - display logic only)
5. Add action-based subfolders: `create_*/`, `edit_*/`, `delete_*/`, `*_selector/`

**Architecture Rule**:

- Business logic → Feature hook (150-300 lines)
- Display logic → Feature container (100-200 lines)
- UI orchestration → Page hook (50-100 lines)
- Layout → Page component (50-100 lines)

**Reference**: `src/features/congregation/field_service_groups/`

### 6.4 Add a React Query Data Hook

1. Define fetch logic in `src/services/...` or co-located domain service.
2. Use stable query keys (e.g., `['fieldServiceMeetings', congregationId]`).
3. Handle errors gracefully and expose typed return shape.
4. Provide invalidation triggers after mutations.

### 6.5 Modify IndexedDB Schema

1. Locate schema definitions in `src/indexedDb`.
2. Increment version carefully; add upgrade migration logic.
3. Preserve backward compatibility; test fresh + upgraded DB paths.

### 6.6 Add Translation Keys

1. Add keys **only to English locale** (`src/locales/en/`)
2. Crowdin handles other languages automatically
3. Use i18next interpolation: `{{variableName}}`
4. Check unused keys: `npm run locales:unused`

### 6.7 Jotai Atoms

```typescript
// Primitive atoms
export const myDataState = atom<MyType[]>([]);

// Derived atoms
export const filteredState = atom((get) => {
  const data = get(myDataState);
  return data.filter(/* logic */);
});
```

- Place in `src/states/<domain>.ts`
- Name with `State` suffix
- One atom per concern

### 6.8 Service Functions

Place pure business logic in `src/services/<domain>/`:

```typescript
export const processData = (input: InputType): OutputType => {
  // Pure transformation
  return result;
};
```

### 6.9 User Notifications

```typescript
import { displaySnackNotification } from '@services/states/app';

displaySnackNotification({
  header: t('tr_errorTitle'),
  message: t('tr_errorMessage'),
  severity: 'error', // 'success' | 'error' | 'warning'
});
```

### 6.10 Web Workers

For heavy processing (PDF generation, large data):

```typescript
// src/services/worker/myWorker.ts
const worker = new Worker(new URL('./myAction.ts', import.meta.url), {
  type: 'module',
});

worker.postMessage({ data });
worker.onmessage = (e) => {
  /* handle result */
};
```

---

## 6.11 Reuse Existing Utilities and Helpers

**CRITICAL**: Always search for and reuse existing utilities before creating new ones.

### Where to Find Utilities:

- **`src/utils/`** - Generic utilities (date, common functions)
- **`src/services/i18n/`** - Translation utilities and patterns
- **`src/services/app/`** - Domain-specific helpers and data formatters
- **`src/states/`** - Shared state atoms (localized data, app state)
- **`src/locales/en/`** - Existing translation keys to reuse

### Before Writing New Code:

1. **Search for existing utilities**:

   ```bash
   grep -r "export const" src/utils/
   grep -r "getTranslation" src/services/
   ```

2. **Check similar features** for reusable patterns in `src/services/app/` and `src/features/`

3. **Reuse translation keys** - Search `src/locales/en/` before adding new ones

4. **When to create new utilities**:
   - Only if no existing utility fits the need
   - Place in `src/utils/` (generic) or `src/services/` (domain-specific)
   - Document and export properly

---

## 7. Directory Responsibilities

- `src/components/`: Reusable UI components
- `src/features/`: Feature modules (4-layer architecture - see [ARCHITECTURE.md](docs/ARCHITECTURE.md))
- `src/pages/`: Routable views (thin orchestrators only)
- `src/services/`: API calls, business logic
- `src/states/`: Jotai atoms
- `src/indexedDb/`: Database schemas
- `src/locales/`: i18n translations (English only)
- `src/utils/`: Pure utility functions
- `public/`: Static assets

**Feature Structure Example:**

```
src/features/congregation/field_service_groups/
├── create_group/        # Creation action
├── edit_group/          # Edit action
├── group_item/          # Display component
├── index.tsx            # Feature container (display)
├── index.types.tsx      # Centralized types
└── useFieldServiceGroups.tsx  # Feature hook (business logic)
```

---

## 8. Architecture Rules (Critical)

**4-Layer Separation** (see [ARCHITECTURE.md](docs/ARCHITECTURE.md) for details):

| Layer                 | Purpose          | Size          | What Goes Here                        | What Does NOT Go Here                 |
| --------------------- | ---------------- | ------------- | ------------------------------------- | ------------------------------------- |
| **Page Component**    | Layout only      | 50-100 lines  | PageTitle, dialogs, feature container | Business logic, CRUD, data filtering  |
| **Page Hook**         | UI orchestration | 50-100 lines  | Buttons, modal state, navigation      | CRUD operations, data transformations |
| **Feature Container** | Display logic    | 100-200 lines | Rendering, conditional display        | Business logic, CRUD operations       |
| **Feature Hook**      | Business logic   | 150-300 lines | CRUD, filtering, state, computations  | JSX rendering, layout decisions       |

**Key Rules:**

- ✅ ALL business logic goes in feature hook
- ✅ ALL types go in `index.types.tsx`
- ❌ NO CRUD operations in page layer
- ❌ NO business logic in page hooks

**Refactoring Checklist**: See [REFACTORING_GUIDE.md](docs/REFACTORING_GUIDE.md)

**Reference Implementation**: `src/features/congregation/field_service_groups/`

---

## 9. Anti-Patterns to Avoid

**Architecture Violations** (see [ARCHITECTURE.md](docs/ARCHITECTURE.md)):

- ❌ Business logic in page components or page hooks
- ❌ CRUD operations outside feature hooks
- ❌ Data filtering in components (belongs in feature hooks)
- ❌ Scattered type definitions (use `index.types.tsx`)
- ❌ Duplicate files (`component.tsx` + `component/` folder)

**Code Organization:**

- ❌ Circular imports between features
- ❌ Fetching data without React Query
- ❌ Reading atoms multiple times (read once, pass down)
- ❌ Heavy computations without `useMemo`
- ❌ New callbacks on every render (use `useCallback`)

---

## 10. Quality Gates

Before opening PR, verify:

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] New i18n keys **only in English** (`src/locales/en/`)
- [ ] Commit message follows semantic conventions
- [ ] PR scope is minimal and focused
- [ ] Architecture boundaries respected (if touching features)

---

## 11. Decision Log

| Date       | Topic                            | Decision                                                                              | Context                                                                    |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 2025-09-28 | Introduced Agents Guide          | Adopt structured AGENTS.md                                                            | Enable safe AI automation                                                  |
| 2025-09-30 | Updated Tech Stack & Conventions | Clarified routing, ESLint, types, Web Workers                                         | Align with actual project implementation                                   |
| 2025-10-01 | Architectural Separation         | Formalized 4-layer architecture (Page → Page Hook → Feature Container → Feature Hook) | Ensure consistent separation of concerns, maintainability, and testability |
| 2025-10-01 | Documentation Restructure        | Moved detailed guides to docs/ folder (ARCHITECTURE.md, REFACTORING_GUIDE.md)         | Keep AGENTS.md concise for AI agents, detailed docs for humans             |

---

## 12. Escalation Protocol

If encountering ambiguous situations, open draft PR with questions:

- Ambiguous domain logic or business rules
- Security-sensitive code changes
- Data model migration uncertainty
- Breaking changes affecting multiple features

**Process**: Draft PR → Document uncertainty → Request maintainer review → Wait for guidance

---

Happy contributing! This guide is the source of truth for agent behavior.
