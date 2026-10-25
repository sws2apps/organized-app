import type { Territory } from '@definition/territory';

export type SelectionAction = { kind: 'assign' | 'return'; count: number };

// selected follows selection insertion order, regardless of the visible sort/filter.
export const selectionActions = (selected: Territory[]): SelectionAction[] => {
  const actions: SelectionAction[] = [];
  for (const territory of selected) {
    let kind: SelectionAction['kind'] | undefined;
    if (territory.status === 'available') kind = 'assign';
    else if (territory.status === 'in_work' || territory.status === 'overdue')
      kind = 'return';
    if (!kind) continue;
    const action = actions.find((item) => item.kind === kind);
    if (action) action.count++;
    else actions.push({ kind, count: 1 });
  }
  return actions;
};
