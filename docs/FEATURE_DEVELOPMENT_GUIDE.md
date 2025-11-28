# Feature Development Guide

This guide explains how to add a **new feature** to the Organized app—from planning to implementation, following the project's 4-layer architecture.

> **Audience**: Human developers building new features.
>
> **Related Docs**:
>
> - [AGENTS.md](../AGENTS.md) - AI agent operational guidelines
> - [ARCHITECTURE.md](./ARCHITECTURE.md) - 4-layer architecture patterns
> - [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) - Refactoring existing features

---

## 1. Architecture Overview

The project uses a **strict 4-layer architecture**. Before starting, understand:

- **Layer 1 (Page)**: Layout & composition (50-100 lines)
- **Layer 2 (Page Hook)**: UI orchestration - buttons, dialogs (50-100 lines)
- **Layer 3 (Feature Container)**: Display logic (100-200 lines)
- **Layer 4 (Feature Hook)**: ALL business logic, CRUD, filtering (150-300 lines)

**Critical Rule**: Business logic goes in feature hooks, NOT in page components or page hooks.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed layer responsibilities.

---

## 2. Planning Checklist

Before coding, define:

- [ ] **User problem**: What need does this solve? Which roles (publisher, elder, secretary)?
- [ ] **Core screens**: Browse, create, edit, export, filter?
- [ ] **Data sources**: Local only (IndexedDB)? Synced via API? Derived/computed?
- [ ] **Permissions**: Which role flags gate access? (see `useCurrentUser()`)
- [ ] **Offline behavior**: What works offline? What degrades gracefully?
- [ ] **Performance**: Large datasets? Need Web Worker?
- [ ] **i18n**: New user-visible strings → new keys in English only
- [ ] **Exports**: PDF/Excel generation needed?

**Optional**: Create design note in `docs/architecture/` for new domain concepts.

---

## 3. Directory Structure

Follow the 4-layer architecture pattern:

```
src/
  features/
    congregation/
      <feature_name>/
        index.types.tsx              # Centralized types (create FIRST)
        index.tsx                    # Feature container (Layer 3)
        useFeatureName.tsx           # Feature hook (Layer 4 - business logic)
        create_<entity>/             # Action-based subfolders
          index.tsx
          useCreate<Entity>.tsx
        edit_<entity>/
          index.tsx
          useEdit<Entity>.tsx
        <entity>_item/
          index.tsx

  pages/
    congregation/
      <feature_name>/
        index.tsx                    # Page component (Layer 1)
        use<FeatureName>.tsx         # Page hook (Layer 2)

  states/
    <feature_name>.ts                # Jotai atoms (if needed)

  services/
    app/<feature_name>.ts            # API calls, business services
```

**Reference Implementation**: `src/features/congregation/field_service_groups/`

---

## 4. Step-by-Step Implementation

### Step 1: Create Type Definitions

**Always start here** - types inform the entire implementation.

Create `src/features/congregation/<feature_name>/index.types.tsx`:

```typescript
// Centralized types for the feature
export type Entity = {
  id: string;
  name: string;
  date: string;
  // ... other fields
};

export type EntityFormData = {
  name: string;
  date: string;
};

export type FilterId = 'all' | 'active' | 'archived';

export type EntityOption = {
  value: string;
  label: string;
};
```

### Step 2: Create Feature Hook (Business Logic)

Create `src/features/congregation/<feature_name>/useFeatureName.tsx`:

```typescript
import { useCallback, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import type { TFunction } from 'i18next';
import { entitiesState } from '@states/<feature_name>';
import { db } from '@indexedDb/db';
import { displaySnackNotification } from '@services/states/app';
import type { Entity, EntityFormData } from './index.types';

export const useFeatureName = (t: TFunction) => {
  const entities = useAtomValue(entitiesState);
  const setEntities = useSetAtom(entitiesState);

  // Business logic: filtering
  const activeEntities = useMemo(
    () => entities.filter((e) => e.status === 'active'),
    [entities]
  );

  // CRUD: Create
  const handleCreate = useCallback(
    async (data: EntityFormData) => {
      try {
        await db.entities.add(data);
        displaySnackNotification({
          header: t('tr_saved'),
          severity: 'success',
        });
      } catch (error) {
        displaySnackNotification({
          header: t('tr_error'),
          severity: 'error',
        });
      }
    },
    [t]
  );

  // CRUD: Update, Delete, etc.
  // ... more handlers

  return {
    entities: activeEntities,
    handleCreate,
    // ... other handlers
  };
};
```

**Key Points**:

- ✅ ALL business logic goes here
- ✅ ALL CRUD operations
- ✅ ALL data filtering/transformations
- ✅ Takes `t` (i18n function) as parameter

### Step 3: Create Feature Container (Display Logic)

Create `src/features/congregation/<feature_name>/index.tsx`:

```typescript
import { useTranslation } from 'react-i18next';
import { useFeatureName } from './useFeatureName';
import { EntityList } from './entity_list';
import { InfoTip } from '@components/info_tip';

export const FeatureContainer = () => {
  const { t } = useTranslation();
  const { entities, handleEdit, handleDelete } = useFeatureName(t);

  if (!entities.length) {
    return <InfoTip>{t('tr_noData')}</InfoTip>;
  }

  return (
    <EntityList
      items={entities}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
```

**Key Points**:

- ✅ Calls feature hook for data and handlers
- ✅ Handles rendering and conditional display
- ❌ NO business logic
- ❌ NO CRUD operations

### Step 4: Create Page Hook (UI Orchestration)

Create `src/pages/congregation/<feature_name>/use<FeatureName>.tsx`:

```typescript
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { IconAdd } from '@components/icons';

export const useFeaturePage = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Button definitions
  const buttons = useMemo(() => (
    <>
      <Button
        startIcon={<IconAdd />}
        onClick={() => setCreateOpen(true)}
      >
        {t('tr_add')}
      </Button>
      <Button onClick={() => setExportOpen(true)}>
        {t('tr_export')}
      </Button>
    </>
  ), [t]);

  const handleCloseCreate = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const handleCloseExport = useCallback(() => {
    setExportOpen(false);
  }, []);

  return {
    buttons,
    createOpen,
    exportOpen,
    handleCloseCreate,
    handleCloseExport,
  };
};
```

**Key Points**:

- ✅ Dialog/modal state only
- ✅ Button definitions
- ❌ NO business logic
- ❌ NO CRUD operations

### Step 5: Create Page Component (Layout)

Create `src/pages/congregation/<feature_name>/index.tsx`:

```typescript
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@components/page_title';
import { useFeaturePage } from './use<FeatureName>';
import { FeatureContainer } from '@features/congregation/<feature_name>';
import { CreateEntityDialog } from '@features/congregation/<feature_name>/create_entity';
import { ExportDialog } from './export_dialog';

const FeaturePage = () => {
  const { t } = useTranslation();
  const {
    buttons,
    createOpen,
    exportOpen,
    handleCloseCreate,
    handleCloseExport,
  } = useFeaturePage();

  return (
    <Box>
      <PageTitle title={t('tr_featureTitle')} buttons={buttons} />
      <FeatureContainer />
      {createOpen && <CreateEntityDialog onClose={handleCloseCreate} />}
      {exportOpen && <ExportDialog onClose={handleCloseExport} />}
    </Box>
  );
};

export default FeaturePage;
```

**Key Points**:

- ✅ Renders PageTitle, dialogs, feature container
- ✅ Simple layout composition
- ❌ NO business logic
- ❌ NO rendering lists or data

### Step 6: Add Routing

In `src/App.tsx`:

```typescript
// Lazy import
const FeaturePage = lazy(
  () => import('@pages/congregation/<feature_name>')
);

// Add route in appropriate permission block
{
  element: <RouteProtected allowed={isPublisher} />,
  children: [
    { path: '/congregation/<feature-name>', element: <FeaturePage /> },
  ],
}
```

**Key Points**:

- Use kebab-case in URLs
- Wrap with appropriate permission check
- Lazy load for code splitting

---

## 5. Data Layer Integration

### Jotai Atoms

Create `src/states/<feature_name>.ts`:

```typescript
import { atom } from 'jotai';
import type { Entity } from '@features/congregation/<feature_name>/index.types';

export const entitiesState = atom<Entity[]>([]);
export const selectedEntityState = atom<Entity | null>(null);
```

**Guidelines**:

- Name with `State` suffix
- One atom per concern
- Use derived atoms for computed values

### IndexedDB (Dexie)

If storing data locally:

1. Add table to `src/indexedDb/schema.ts`
2. Increment version number
3. Add upgrade migration if needed
4. Use `useLiveQuery` for reactive updates

```typescript
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@indexedDb/db';

const entities = useLiveQuery(() => db.entities.toArray()) ?? [];
```

### React Query (API Calls)

For server data:

```typescript
import { useQuery } from '@tanstack/react-query';

export const useEntities = () => {
  return useQuery({
    queryKey: ['entities'],
    queryFn: fetchEntities,
    staleTime: 60_000,
  });
};
```

---

## 6. Internationalization

Add keys **only to English** in `src/locales/en/<domain>.json`:

```json
{
  "tr_featureTitle": "Feature Name",
  "tr_noData": "No items yet",
  "tr_createSuccess": "Created successfully",
  "tr_errorMessage": "Something went wrong"
}
```

**Guidelines**:

- Crowdin handles other languages automatically
- Use interpolation: `{{variableName}}`
- Check unused keys: `npm run locales:unused`

---

## 7. UI Best Practices

### MUI Theming

- Use `sx` prop for theme-based styling
- Consume `theme.palette` for colors (supports dark mode)
- Avoid hardcoded colors or breakpoints

### Accessibility

- Use semantic HTML (`<nav>`, `<ul>`, `<button>`)
- Provide `aria-label` for icon-only buttons
- Ensure keyboard navigation works
- Test with screen reader if possible

### Reusable Components

- Extract repeated patterns to `src/components/`
- Export via folder's `index.tsx`
- Add JSDoc comments for props

---

## 8. Error Handling & Empty States

Provide graceful states for all scenarios:

```typescript
const FeatureContainer = () => {
  const { t } = useTranslation();
  const { entities, isLoading, error, refetch } = useFeature(t);

  if (isLoading) return <LoadingIndicator />;

  if (error) {
    return (
      <ErrorMessage
        message={t('tr_errorLoading')}
        onRetry={refetch}
      />
    );
  }

  if (!entities.length) {
    return (
      <InfoTip illustration="empty">
        {t('tr_noDataYet')}
      </InfoTip>
    );
  }

  return <EntityList items={entities} />;
};
```

**Guidelines**:

- Loading: Use skeletons or spinners
- Error: Provide retry button + helpful message
- Empty: Encourage action (e.g., "Create your first item")
- Reuse existing components where possible

---

## 9. Performance Considerations

### Memoization

```typescript
// Expensive computations
const filteredData = useMemo(() => data.filter((item) => item.active), [data]);

// Callbacks passed to children
const handleAction = useCallback(
  (id: string) => {
    /* ... */
  },
  [dependencies]
);

// Component memoization
const EntityItem = React.memo(({ entity, onEdit }) => {
  // ...
});
```

### Web Workers

For heavy processing (PDF generation, large data parsing):

```typescript
const worker = new Worker(new URL('./processData.ts', import.meta.url), {
  type: 'module',
});

worker.postMessage({ data: largeDataset });
worker.onmessage = (e) => {
  setProcessedData(e.data);
};
```

### Code Splitting

- Routes are already lazy loaded
- Consider dynamic imports for large libraries used in specific features

---

## 10. Feature Flags (Optional)

For large or experimental features:

1. Add flag to feature flags configuration
2. Conditionally render route or component:

```typescript
{
  isFeatureEnabled && {
    path: '/feature-path',
    element: <FeaturePage />,
  }
}
```

3. Document in AGENTS.md when feature is stable enough to remove flag

---

## 11. Testing Strategy

### Manual Testing

Before submitting PR:

- [ ] Navigate to feature route
- [ ] Test all CRUD operations
- [ ] Test with different user roles
- [ ] Test error states (disconnect network)
- [ ] Test empty states
- [ ] Test on mobile viewport

### Cypress E2E (Optional)

Create `cypress/e2e/<feature>.cy.ts`:

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('#/congregation/feature-name');
  });

  it('shows empty state when no data', () => {
    cy.contains('No items yet').should('exist');
  });

  it('creates new item', () => {
    cy.contains('Add').click();
    cy.get('[name="name"]').type('Test Item');
    cy.contains('Save').click();
    cy.contains('Test Item').should('exist');
  });
});
```

---

## 12. Quality Checklist

Before opening PR:

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Architecture boundaries respected:
  - [ ] Business logic in feature hook
  - [ ] Types centralized in `index.types.tsx`
  - [ ] Page component is thin (50-100 lines)
  - [ ] Page hook is UI-only (50-100 lines)
- [ ] i18n keys added to English only
- [ ] Manual testing completed
- [ ] Semantic commit message (e.g., `feat: add congregation announcements`)
- [ ] No secrets or sensitive data committed

---

## 13. Common Pitfalls

| Pitfall                                | Solution                        |
| -------------------------------------- | ------------------------------- |
| Business logic in page hook            | Move to feature hook            |
| CRUD operations in page component      | Move to feature hook            |
| Hardcoded strings                      | Use `t()` with keys             |
| Types scattered across files           | Centralize in `index.types.tsx` |
| Heavy computations without memoization | Use `useMemo`                   |
| New callbacks on every render          | Use `useCallback`               |
| Circular imports                       | Keep dependencies directional   |
| Blocking main thread                   | Use Web Worker                  |

---

## 14. Pull Request Template

```markdown
## Problem

[Describe the user problem this feature solves]

## Solution

- Summary of architecture
- Key components added
- Data model changes (if any)

## Screenshots

[Optional: Add screenshots or screen recordings]

## Testing

- [ ] Manual testing completed
- [ ] Tested with different user roles
- [ ] Tested error states
- [ ] Tested empty states

## Checklist

- [ ] Lint and build pass
- [ ] i18n keys added (English only)
- [ ] Architecture boundaries respected
- [ ] No secrets committed
- [ ] Feature flag added (if applicable)

## Follow-ups

[Items deferred or future improvements]
```

---

## 15. After Merge

If released behind a feature flag:

1. **Gather Feedback**: Monitor usage and bug reports
2. **Iterate**: Make improvements in small PRs
3. **Stabilize**: When ready, enable by default
4. **Clean Up**: Remove flag and update documentation

---

## 16. Getting Help

When to ask for early review:

- 🔴 **Security**: New encryption or auth logic
- 🔴 **Database**: IndexedDB schema version bump uncertainty
- 🟡 **Architecture**: Cross-cutting refactor needed
- 🟡 **Performance**: Potential performance regression with large data

**Process**: Open draft PR → Describe uncertainty → Request review → Wait for guidance

---

## 17. Quick Reference

**File Creation Order**:

1. `index.types.tsx` (types)
2. `useFeatureName.tsx` (feature hook - business logic)
3. `index.tsx` (feature container - display)
4. `use<PageName>.tsx` (page hook - UI orchestration)
5. `index.tsx` (page component - layout)
6. Route in `src/App.tsx`

**Architecture Quick Check**:

- Is it UI state (modal open/close)? → **Page Hook**
- Is it business logic (CRUD/filtering)? → **Feature Hook**
- Is it rendering? → **Feature Container**
- Is it layout? → **Page Component**

**Key References**:

- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Refactoring: [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)
- Agent Rules: [AGENTS.md](../AGENTS.md)
- Example: `src/features/congregation/field_service_groups/`

---

Happy building! 🚀
