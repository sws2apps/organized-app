# Architecture Guide

This document describes the architectural patterns and separation of concerns used in the `organized-app` project.

> **Audience**: Human developers who want to understand the system architecture in depth.
>
> **For AI Agents**: See [AGENTS.md](../AGENTS.md) for concise operational guidelines.

---

## Table of Contents

1. [Four-Layer Architecture](#four-layer-architecture)
2. [Layer Responsibilities](#layer-responsibilities)
3. [Data Flow](#data-flow)
4. [Reference Implementation](#reference-implementation)

---

## Four-Layer Architecture

The project follows a **strict four-layer architecture** for features. Each layer has specific responsibilities and must NOT contain logic from other layers.

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Page Component                                 │
│ Purpose: Layout & composition (50-100 lines)            │
│ Location: src/pages/<section>/<feature>/index.tsx      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Page Hook                                      │
│ Purpose: UI orchestration (50-100 lines)                │
│ Location: src/pages/<section>/<feature>/use*.tsx       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Feature Container                              │
│ Purpose: Display logic (100-200 lines)                  │
│ Location: src/features/<section>/<feature>/index.tsx   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Feature Hook                                   │
│ Purpose: Business logic (150-300+ lines)                │
│ Location: src/features/<section>/<feature>/use*.tsx    │
└─────────────────────────────────────────────────────────┘
```

---

## Layer Responsibilities

### Layer 1: Page Component

**Purpose**: Thin orchestrator for layout and composition only.

**File Location**: `src/pages/<section>/<feature>/index.tsx`

**Allowed:**

- ✅ Render `PageTitle` with title and buttons
- ✅ Render dialogs/modals (Export, Publish, etc.)
- ✅ Render feature container component
- ✅ Basic layout structure (Box, Stack, etc.)

**NOT Allowed:**

- ❌ Business logic
- ❌ Data filtering or transformations
- ❌ CRUD operations
- ❌ Form state management
- ❌ Direct atom reads (except via page hook)

**Target Size**: 50-100 lines maximum

**Example:**

```typescript
const FeaturePage = () => {
  const { buttons, exportOpen, handleCloseExport } = useFeaturePage();

  return (
    <Box>
      <PageTitle title={t('tr_title')} buttons={buttons} />
      <FeatureContainer />
      {exportOpen && <ExportDialog onClose={handleCloseExport} />}
    </Box>
  );
};
```

---

### Layer 2: Page Hook

**Purpose**: UI orchestration—manages dialogs, buttons, navigation.

**File Location**: `src/pages/<section>/<feature>/useFeaturePage.tsx`

**Allowed:**

- ✅ Dialog/modal open/close state
- ✅ Button definitions (memoized JSX)
- ✅ UI-only event handlers
- ✅ Navigation triggers

**NOT Allowed:**

- ❌ Business logic
- ❌ CRUD operations
- ❌ Data filtering or transformations
- ❌ Form state management
- ❌ Database operations

**Target Size**: 50-100 lines maximum

**Example:**

```typescript
const useFeaturePage = () => {
  const [exportOpen, setExportOpen] = useState(false);

  const buttons = useMemo(() => (
    <>
      <Button onClick={() => setExportOpen(true)}>
        {t('tr_export')}
      </Button>
    </>
  ), [t]);

  const handleCloseExport = useCallback(() => {
    setExportOpen(false);
  }, []);

  return {
    buttons,
    exportOpen,
    handleCloseExport
  };
};
```

**What belongs in page hooks:**

- Button definitions (memoized JSX components)
- Dialog/modal open/close state
- UI-only event handlers (e.g., opening dialogs)
- Navigation triggers

**What does NOT belong in page hooks:**

- ❌ CRUD operations (create, update, delete)
- ❌ Data filtering or transformations
- ❌ Business logic
- ❌ Form state management
- ❌ API calls or database operations

---

### Layer 3: Feature Container

**Purpose**: Display logic and rendering—uses feature hook for data/logic.

**File Location**: `src/features/<section>/<feature>/index.tsx`

**Allowed:**

- ✅ Call feature hook to get data and handlers
- ✅ Render lists, items, empty states
- ✅ Conditional rendering based on data
- ✅ Pass data to child components
- ✅ Layout and styling

**NOT Allowed:**

- ❌ Business logic implementation
- ❌ Direct CRUD operations
- ❌ Data transformations (get from feature hook)
- ❌ Complex state management

**Target Size**: 100-200 lines

**Example:**

```typescript
const FeatureContainer = () => {
  const { t } = useTranslation();
  const {
    midweekItems,
    weekendItems,
    handleEdit,
    handleDelete
  } = useFeature(t);

  if (!midweekItems.length && !weekendItems.length) {
    return <InfoTip>{t('tr_noData')}</InfoTip>;
  }

  return (
    <>
      {midweekItems.length > 0 && (
        <FeatureList
          header="Midweek"
          items={midweekItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {weekendItems.length > 0 && (
        <FeatureList
          header="Weekend"
          items={weekendItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
```

---

### Layer 4: Feature Hook

**Purpose**: ALL business logic, CRUD operations, data transformations, state management.

**File Location**: `src/features/<section>/<feature>/useFeatureName.tsx`

**Allowed:**

- ✅ CRUD operations (create, read, update, delete)
- ✅ Data filtering and transformations
- ✅ Business logic and validations
- ✅ Atom reads and writes
- ✅ Form state management
- ✅ Computed values (useMemo)
- ✅ Event handlers (useCallback)
- ✅ IndexedDB operations

**NOT Allowed:**

- ❌ JSX rendering (except for simple returns)
- ❌ Layout decisions
- ❌ Direct UI component usage

**Target Size**: 150-300 lines (can be larger for complex features)

**Example:**

```typescript
const useFeature = (t: TFunction) => {
  const allItems = useRecoilValue(itemsState);
  const setItems = useSetRecoilState(itemsState);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Business logic: filtering
  const midweekItems = useMemo(
    () =>
      allItems.filter((item) =>
        [1, 2, 3, 4, 5].includes(new Date(item.date).getDay())
      ),
    [allItems]
  );

  const weekendItems = useMemo(
    () =>
      allItems.filter((item) => [0, 6].includes(new Date(item.date).getDay())),
    [allItems]
  );

  // CRUD: Save
  const handleSave = useCallback(
    async (data: ItemData) => {
      try {
        await db.items.add(data);
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

  // CRUD: Edit
  const handleEdit = useCallback((item: Item) => {
    setEditingItem(item);
  }, []);

  // CRUD: Delete
  const handleDelete = useCallback(async (id: string) => {
    await db.items.delete(id);
  }, []);

  return {
    midweekItems,
    weekendItems,
    editingItem,
    handleSave,
    handleEdit,
    handleDelete,
  };
};
```

---

## Data Flow

### Typical Request Flow

```
User Action (click button)
        ↓
Page Component detects event
        ↓
Page Hook handles UI state (open dialog)
        ↓
Feature Container renders form/content
        ↓
Feature Hook provides data & handlers
        ↓
User submits form
        ↓
Feature Hook executes CRUD operation
        ↓
IndexedDB updated
        ↓
Atom state updated (via Jotai)
        ↓
Feature Hook recomputes derived data
        ↓
Feature Container re-renders with new data
```

### State Management Flow

```
IndexedDB (source of truth)
        ↓
Dexie useLiveQuery (reactive)
        ↓
Jotai Atoms (app state)
        ↓
Feature Hook (business logic)
        ↓
Feature Container (display)
        ↓
UI Components
```

---

## Reference Implementation

See `src/features/congregation/field_service_groups/` for a well-structured example following all architectural patterns:

```
field_service_groups/
├── create_group/
│   ├── index.tsx           # Creation dialog component
│   └── useCreateGroup.tsx  # Creation business logic
├── edit_group/
│   ├── index.tsx           # Edit dialog component
│   └── useEditGroup.tsx    # Edit business logic
├── group_item/
│   └── index.tsx           # Individual group display
├── index.tsx               # Feature container (display)
├── index.types.tsx         # Centralized types
└── useFieldServiceGroups.tsx  # Feature hook (business logic)
```

**Key Files to Review:**

1. **Page**: `src/pages/congregation/field_service_groups/index.tsx` (~60 lines)
   - Shows minimal page component pattern

2. **Page Hook**: `src/pages/congregation/field_service_groups/useFieldServiceGroups.tsx` (~80 lines)
   - Shows UI orchestration only

3. **Feature Container**: `src/features/congregation/field_service_groups/index.tsx` (~150 lines)
   - Shows display logic pattern

4. **Feature Hook**: `src/features/congregation/field_service_groups/useFieldServiceGroups.tsx` (~200 lines)
   - Shows business logic centralization

---

## Common Violations and How to Fix Them

### ❌ Business Logic in Page Component

**Problem:**

```typescript
// src/pages/congregation/meetings/index.tsx (WRONG)
const MeetingsPage = () => {
  const meetings = useAtomValue(meetingsState);
  const filteredMeetings = meetings.filter(m => m.active); // ❌ Business logic!

  return <MeetingsList items={filteredMeetings} />;
};
```

**Solution:**

```typescript
// Move filtering to feature hook
const MeetingsPage = () => {
  return <MeetingsContainer />; // ✅ Just composition
};
```

### ❌ CRUD Operations in Page Hook

**Problem:**

```typescript
// src/pages/congregation/meetings/useMeetings.tsx (WRONG)
const useMeetings = () => {
  const handleSave = async (data) => {
    await db.meetings.add(data); // ❌ CRUD in page hook!
  };

  return { handleSave };
};
```

**Solution:**

```typescript
// Move CRUD to feature hook
const useMeetings = () => {
  const [createOpen, setCreateOpen] = useState(false);

  const buttons = useMemo(() => (
    <Button onClick={() => setCreateOpen(true)}>Create</Button>
  ), []);

  return { buttons, createOpen }; // ✅ UI orchestration only
};
```

### ❌ Scattered Type Definitions

**Problem:**

```typescript
// Types defined in multiple files
// meeting_form/index.tsx
type FormData = { ... };

// meeting_list/index.tsx
type ListItem = { ... };
```

**Solution:**

```typescript
// src/features/congregation/meetings/index.types.tsx
export type MeetingFormData = { ... };
export type MeetingListItem = { ... };
export type MeetingFilterType = 'all' | 'active' | 'archived';

// Single source of truth ✅
```

---

## Migration Strategy

When you encounter code that doesn't follow this architecture:

1. **Don't panic** - Incremental refactoring is fine
2. **Start with types** - Centralize in `index.types.tsx`
3. **Extract business logic** - Move to feature hook
4. **Simplify components** - Make page/container thin
5. **Test thoroughly** - Verify behavior unchanged

See [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) for detailed migration checklist.

---

## Why This Architecture?

**Benefits:**

- ✅ **Testability**: Business logic isolated in hooks (easy to unit test)
- ✅ **Reusability**: Feature containers can be used anywhere
- ✅ **Maintainability**: Clear boundaries prevent logic drift
- ✅ **Performance**: Easier to optimize when concerns are separated
- ✅ **Collaboration**: Multiple developers can work on different layers

**Trade-offs:**

- More files per feature (but better organized)
- Learning curve for new developers (but documented here)
- Requires discipline to maintain boundaries

---

## Questions?

If you're unsure where code belongs, ask:

1. **Is it about UI state?** → Page Hook
2. **Is it about business logic?** → Feature Hook
3. **Is it about rendering?** → Feature Container
4. **Is it about layout?** → Page Component

**Still unsure?** Look at `field_service_groups` reference implementation or ask in PR review.
