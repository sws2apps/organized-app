import { store } from '@states/index';
import { territoriesState } from '@states/territories';
import {
  DoNotCall,
  Territory,
  TerritoryAssignment,
} from '@definition/territory';
import { withAssignments } from '@features/territories/helpers';

// Undo puts back what was deleted, into the territories as they are now, so
// edits made meanwhile stay. It is written as a new edit and syncs like one.

// at the end when its place is not known
const insert = <T>(list: T[], index: number, item: T) =>
  index < 0
    ? [...list, item]
    : [...list.slice(0, index), item, ...list.slice(index)];

const patch = (id: string, change: (territory: Territory) => Territory) =>
  store.set(territoriesState, (prev) =>
    prev.map((territory) =>
      territory.id === id ? change(territory) : territory
    )
  );

export const restoreTerritory = (territory: Territory, index: number) =>
  store.set(territoriesState, (prev) =>
    insert(
      prev.filter((item) => item.id !== territory.id),
      index,
      territory
    )
  );

export const restoreAssignment = (
  territoryId: string,
  assignment: TerritoryAssignment,
  index: number
) =>
  patch(territoryId, (territory) =>
    withAssignments(
      territory,
      insert(
        territory.assignments.filter((item) => item.id !== assignment.id),
        index,
        assignment
      )
    )
  );

export const restoreDoNotCall = (
  territoryId: string,
  entry: DoNotCall,
  index: number
) =>
  patch(territoryId, (territory) => ({
    ...territory,
    doNotCalls: insert(
      territory.doNotCalls.filter((item) => item.id !== entry.id),
      index,
      entry
    ),
  }));

export const restorePhoneNumber = (
  territoryId: string,
  number: string,
  index: number
) =>
  patch(territoryId, (territory) => {
    const numbers = territory.phoneNumbers ?? [];
    return numbers.includes(number)
      ? territory
      : { ...territory, phoneNumbers: insert(numbers, index, number) };
  });
