# Refactoring Guide

This guide provides a systematic approach to refactoring existing features to comply with the project's [architectural patterns](./ARCHITECTURE.md).

> **Audience**: Developers refactoring legacy code or migrating features to the 4-layer architecture.
>
> **For AI Agents**: Use this checklist when asked to refactor features.

---

## Table of Contents

1. [When to Refactor](#when-to-refactor)
2. [Refactoring Checklist](#refactoring-checklist)
3. [Step-by-Step Process](#step-by-step-process)
4. [Common Scenarios](#common-scenarios)
5. [Verification Steps](#verification-steps)

---

## When to Refactor

Refactor a feature when you notice:

- ❌ Business logic in page components (>100 lines)
- ❌ CRUD operations in page hooks
- ❌ Data transformations scattered across files
- ❌ Types defined in multiple places
- ❌ Difficulty testing or reusing components
- ❌ Unclear separation of concerns

**Priority Indicators:**

- 🔴 **High**: Feature has bugs due to tangled logic
- 🟡 **Medium**: Feature works but is hard to modify
- 🟢 **Low**: Feature works well but doesn't match pattern

---

## Refactoring Checklist

Use this checklist when refactoring an existing feature:

### 1. Audit Current Structure

- [ ] Identify where business logic currently lives
- [ ] Check page component line count (target: <100)
- [ ] Check page hook line count (target: <100)
- [ ] Find all CRUD operations
- [ ] Map data flow (atoms → hooks → components)
- [ ] List all type definitions

### 2. Type Centralization

- [ ] Create `index.types.tsx` at feature root (if doesn't exist)
- [ ] Move all type/interface exports to centralized file
- [ ] Update imports across all feature files
- [ ] Remove duplicate type definitions
- [ ] Verify TypeScript compilation (`npm run lint`)

### 3. Business Logic Migration

- [ ] Move all CRUD operations to feature hook
- [ ] Move data filtering logic to feature hook
- [ ] Move data transformations to feature hook
- [ ] Move form state management to feature hook (if applicable)
- [ ] Move computed values (useMemo) to feature hook
- [ ] Update function signatures and returns

### 4. Component Simplification

- [ ] Simplify page component to layout only (render PageTitle + dialogs + feature container)
- [ ] Simplify page hook to UI orchestration only (buttons + modal state)
- [ ] Update feature container to use enhanced feature hook
- [ ] Verify each layer respects architectural boundaries
- [ ] Remove unused imports and state

### 5. Verification

- [ ] Run TypeScript check (`npm run lint`)
- [ ] Run build (`npm run build`)
- [ ] Test all user flows in browser:
  - [ ] Create operation
  - [ ] Edit operation
  - [ ] Delete operation
  - [ ] Filtering/search
  - [ ] Export/publish (if applicable)
  - [ ] Empty states
  - [ ] Error states
- [ ] Verify line counts match targets:
  - [ ] Page component: 50-100 lines
  - [ ] Page hook: 50-100 lines
  - [ ] Feature container: 100-200 lines
  - [ ] Feature hook: 150-300 lines

### 6. Documentation

- [ ] Add JSDoc comments to feature hook
- [ ] Update any related documentation
- [ ] Note breaking changes (if any) in PR description

---

## Step-by-Step Process

### Step 1: Create Type Centralization

**Before:**

```typescript
// meeting_form/index.tsx
type FormData = { date: string; time: string };

// meeting_list/index.tsx
type ListItem = { id: string; date: string };
```

**After:**

```typescript
// index.types.tsx
export type MeetingFormData = { date: string; time: string };
export type MeetingListItem = { id: string; date: string };
export type MeetingFilterId = 'all' | 'upcoming' | 'past';
```

### Step 2: Extract Business Logic to Feature Hook

**Before (Page Hook):**

```typescript
// src/pages/congregation/meetings/useMeetings.tsx
const useMeetings = () => {
  const meetings = useAtomValue(meetingsState);

  // ❌ Business logic in page hook
  const filteredMeetings = useMemo(
    () => meetings.filter((m) => m.date > new Date()),
    [meetings]
  );

  // ❌ CRUD in page hook
  const handleSave = async (data) => {
    await db.meetings.add(data);
  };

  return { filteredMeetings, handleSave };
};
```

**After (Feature Hook):**

```typescript
// src/features/congregation/meetings/useMeetings.tsx
const useMeetings = (t: TFunction) => {
  const meetings = useAtomValue(meetingsState);

  // ✅ Business logic in feature hook
  const upcomingMeetings = useMemo(
    () => meetings.filter((m) => new Date(m.date) > new Date()),
    [meetings]
  );

  // ✅ CRUD in feature hook
  const handleSave = useCallback(
    async (data: MeetingFormData) => {
      try {
        await db.meetings.add(data);
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

  return { upcomingMeetings, handleSave };
};
```

**After (Page Hook - Simplified):**

```typescript
// src/pages/congregation/meetings/useMeetings.tsx
const useMeetings = () => {
  const [createOpen, setCreateOpen] = useState(false);

  // ✅ Only UI orchestration
  const buttons = useMemo(() => (
    <Button onClick={() => setCreateOpen(true)}>
      {t('tr_create')}
    </Button>
  ), []);

  return {
    buttons,
    createOpen,
    handleCloseCreate: () => setCreateOpen(false)
  };
};
```

### Step 3: Simplify Components

**Before (Page Component):**

```typescript
// src/pages/congregation/meetings/index.tsx (270 lines) ❌
const MeetingsPage = () => {
  const { filteredMeetings, handleSave } = useMeetings();

  return (
    <Box>
      <PageTitle title={t('tr_meetings')} />
      {/* Lots of rendering logic here */}
      {filteredMeetings.map(meeting => (
        <MeetingItem key={meeting.id} {...meeting} />
      ))}
    </Box>
  );
};
```

**After (Page Component):**

```typescript
// src/pages/congregation/meetings/index.tsx (60 lines) ✅
const MeetingsPage = () => {
  const { buttons, createOpen, handleCloseCreate } = useMeetings();

  return (
    <Box>
      <PageTitle title={t('tr_meetings')} buttons={buttons} />
      <MeetingsContainer />
      {createOpen && <CreateMeetingDialog onClose={handleCloseCreate} />}
    </Box>
  );
};
```

**After (Feature Container):**

```typescript
// src/features/congregation/meetings/index.tsx (150 lines) ✅
const MeetingsContainer = () => {
  const { t } = useTranslation();
  const { upcomingMeetings, handleEdit, handleDelete } = useMeetings(t);

  if (!upcomingMeetings.length) {
    return <InfoTip>{t('tr_noMeetings')}</InfoTip>;
  }

  return (
    <MeetingsList
      items={upcomingMeetings}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
```

---

## Common Scenarios

### Scenario 1: Feature has no feature hook yet

**Actions:**

1. Create `src/features/<section>/<feature>/useFeatureName.tsx`
2. Move all business logic from page hook to new feature hook
3. Update feature container to call feature hook
4. Simplify page hook to UI-only

### Scenario 2: Types scattered across multiple files

**Actions:**

1. Create `src/features/<section>/<feature>/index.types.tsx`
2. Move all type exports to this file
3. Update imports in all files: `import type { ... } from '../index.types'`
4. Delete type definitions from original files

### Scenario 3: Duplicate files exist (both `component.tsx` and `component/` folder)

**Actions:**

1. Review both implementations
2. Keep folder-based structure (preferred)
3. Merge any unique logic from standalone file into folder version
4. Delete standalone file: `rm component.tsx`
5. Update imports

### Scenario 4: Business logic mixed with rendering

**Actions:**

1. Extract business logic to feature hook
2. Pass computed values as props to components
3. Keep only display logic in components
4. Use `useMemo` for expensive computations in hook

---

## Verification Steps

### Before Committing

1. **Run Linter:**

   ```bash
   npm run lint
   ```

2. **Run Build:**

   ```bash
   npm run build
   ```

3. **Check Line Counts:**

   ```bash
   wc -l src/pages/congregation/<feature>/index.tsx
   wc -l src/pages/congregation/<feature>/use*.tsx
   wc -l src/features/congregation/<feature>/index.tsx
   wc -l src/features/congregation/<feature>/use*.tsx
   ```

4. **Test in Browser:**
   - Create new item
   - Edit existing item
   - Delete item
   - Test filters/search
   - Test empty states
   - Test error handling

### After Refactoring

**Compare Metrics:**

| Metric            | Before    | After     | Target  |
| ----------------- | --------- | --------- | ------- |
| Page Component    | 270 lines | 60 lines  | <100    |
| Page Hook         | 268 lines | 80 lines  | <100    |
| Feature Container | -         | 150 lines | 100-200 |
| Feature Hook      | 54 lines  | 230 lines | 150-300 |
| **Total**         | 592 lines | 520 lines | -       |

**Quality Checks:**

- [ ] Business logic centralized in feature hook
- [ ] No CRUD operations in page layer
- [ ] Types centralized in `index.types.tsx`
- [ ] All tests pass
- [ ] No regressions in functionality

---

## Troubleshooting

### "TypeScript errors after moving types"

**Solution:** Check import paths. Use relative imports within feature:

```typescript
import type { MeetingFormData } from '../index.types';
```

### "Component re-rendering too often"

**Solution:** Ensure proper memoization in feature hook:

```typescript
const filteredData = useMemo(() => /* ... */, [dependencies]);
const handleAction = useCallback(() => /* ... */, [dependencies]);
```

### "Lost functionality after refactoring"

**Solution:**

1. Review git diff to see what changed
2. Check if any handlers were not moved/connected
3. Verify atom subscriptions are correct
4. Test each user flow systematically

### "Unclear where to put specific logic"

**Decision Tree:**

1. Is it UI state (modal open/closed)? → **Page Hook**
2. Is it business logic (filtering/CRUD)? → **Feature Hook**
3. Is it rendering logic? → **Feature Container**
4. Is it layout? → **Page Component**

---

## Reference Implementation

See the `field_service_meetings` feature for a recent refactoring example:

**PR**: [Link to refactoring PR]

**Before:**

- Page component: 270 lines with business logic
- Page hook: 268 lines with CRUD operations
- No centralized types

**After:**

- Page component: 66 lines (layout only)
- Page hook: 80 lines (UI orchestration only)
- Feature container: Updated to use feature hook
- Feature hook: 230 lines (all business logic)
- Centralized types in `index.types.tsx`

**Outcome:**

- ✅ 40% reduction in page layer complexity
- ✅ Clear separation of concerns
- ✅ Feature is now reusable
- ✅ Business logic is testable

---

## Need Help?

If you're stuck during refactoring:

1. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for pattern details
2. Look at `field_service_groups` reference implementation
3. Ask in PR review or team discussion
4. Tag maintainers for architectural guidance

---

**Remember**: Refactoring is incremental. Perfect is the enemy of good. Focus on one layer at a time.
