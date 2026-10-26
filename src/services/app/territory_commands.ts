import { territoryPublisherCommandChanges } from '@utils/territory_sync_queue';
import type { TerritoryAssignee } from '@definition/territory';
import type {
  TerritoryCommand,
  TerritoryPendingChange,
} from '@definition/territory_sync';
import {
  encodeTerritory,
  encodeTerritoryAssignment,
  encryptTerritoryContent,
  TerritoryIdentityError,
} from '@services/app/territory_codec';

export const prepareTerritoryCommands = (
  change: TerritoryPendingChange,
  manager: boolean,
  assignees: TerritoryAssignee[],
  key: string
): TerritoryCommand[] => {
  const { before, after, baseRevision: expectedRevision } = change;
  if (manager) {
    if (!after) return [{ action: 'delete', expectedRevision }];
    return [
      {
        action: 'reconcile',
        expectedRevision,
        ...encodeTerritory(after, change.dataView, assignees, key),
      },
    ];
  }
  if (!before || !after)
    throw new TerritoryIdentityError(
      'A manager must import or delete territories'
    );
  const commands: TerritoryCommand[] = [];
  const add = (command: TerritoryCommand) =>
    commands.push({
      ...command,
      expectedRevision: expectedRevision + commands.length,
    });
  const plan = territoryPublisherCommandChanges(before, after);
  if (plan.request) add({ action: plan.request, expectedRevision });
  if (plan.assignment?.action === 'return') {
    const updated = plan.assignment.value;
    const assignment = encodeTerritoryAssignment(updated, assignees, key);
    add({
      action: 'return',
      expectedRevision,
      returnedAt: assignment.returnedAt,
      completed: updated.completed !== false,
      notes: assignment.notes,
      households: after.households,
    });
  } else if (plan.assignment) {
    add({
      action: 'assignment_note',
      expectedRevision,
      notes: encryptTerritoryContent(plan.assignment.value.note ?? '', key),
    });
  }
  for (const entry of plan.doNotCalls)
    add({
      action: 'do_not_call',
      expectedRevision,
      entryId: entry.id,
      content: entry.value
        ? encryptTerritoryContent(entry.value, key)
        : undefined,
    });
  if (!commands.length)
    throw new TerritoryIdentityError('This change requires a manager');
  return commands;
};
