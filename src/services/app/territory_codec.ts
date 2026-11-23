import { millisecondsInDay } from 'date-fns/constants';
import type {
  Territory,
  TerritoryAssignment,
  TerritoryAssignee,
} from '@definition/territory';
import type {
  TerritoryWireRecord,
  TerritoryWireAssignment,
} from '@definition/territory_sync';
import { encryptData, decryptData } from '@services/encryption';
import { assignmentFromDates, withAssignments } from '@utils/territory_dates';

export class TerritoryIdentityError extends Error {}
export const encryptTerritoryContent = (value: unknown, key: string) =>
  encryptData(JSON.stringify(value), key);
export const decryptTerritoryContent = <T>(value: string, key: string): T =>
  JSON.parse(decryptData(value, key, 'territories'));
export const territoryRemoteId = (view: string, id: string) => {
  if (view.length + id.length > 128)
    throw new TerritoryIdentityError('Territory identifier is too long');
  const value = btoa(
    String.fromCodePoint(...new TextEncoder().encode(`${view}:${id}`))
  )
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
  if (value.length > 128)
    throw new TerritoryIdentityError('Territory identifier is too long');
  return value;
};
export const territoryPersonId = (
  name: string,
  id: string | undefined,
  assignees: TerritoryAssignee[],
  group = false
) => {
  if (id && !id.startsWith('legacy:')) return id;
  const matches = assignees.filter(
    (item) => item.name === name && item.group === group
  );
  if (matches.length !== 1)
    throw new TerritoryIdentityError(
      'Select an unambiguous person or group before synchronizing'
    );
  return matches[0].id;
};
const isoDate = (value: string) => {
  const parts = value.split('.');
  if (parts.length !== 3)
    throw new TerritoryIdentityError('Review the assignment date');
  const date = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;
  if (
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString() !== date
  )
    throw new TerritoryIdentityError('Review the assignment date');
  return date;
};
const historicalPersonId = (
  assignment: TerritoryAssignment,
  assignees: TerritoryAssignee[]
) => {
  try {
    return territoryPersonId(
      assignment.publisher,
      assignment.publisherId,
      assignees
    );
  } catch (error) {
    if (!assignment.returnedOn) throw error;
    return `legacy_${assignment.id}`;
  }
};
const historicalGroupId = (
  assignment: TerritoryAssignment,
  assignees: TerritoryAssignee[]
) => {
  if (!assignment.group) return undefined;
  try {
    return territoryPersonId(
      assignment.group,
      assignment.groupId,
      assignees,
      true
    );
  } catch (error) {
    if (!assignment.returnedOn) throw error;
    return `legacy_${assignment.id}_group`;
  }
};
const doNotCallAuthorId = (
  entry: Territory['doNotCalls'][number],
  assignees: TerritoryAssignee[]
) => {
  if (entry.addedById) return entry.addedById;
  const matches = assignees.filter(
    (person) => !person.group && person.name === entry.addedBy
  );
  return matches.length === 1 ? matches[0].id : `legacy_${entry.id}`;
};
export const encodeTerritoryAssignment = (
  assignment: TerritoryAssignment,
  assignees: TerritoryAssignee[],
  key: string
): TerritoryWireAssignment => ({
  id: assignment.id,
  personId: historicalPersonId(assignment, assignees),
  groupId: historicalGroupId(assignment, assignees),
  campaignId: assignment.campaign?.id,
  assignedAt: isoDate(assignment.assignedOn),
  returnedAt: assignment.returnedOn
    ? isoDate(assignment.returnedOn)
    : undefined,
  completed: assignment.completed,
  card: assignment.card,
  notes: encryptTerritoryContent(assignment.note ?? '', key),
  content: encryptTerritoryContent(
    {
      publisher: assignment.publisher,
      group: assignment.group,
      campaign: assignment.campaign,
    },
    key
  ),
});
export const encodeTerritory = (
  territory: Territory,
  dataView: string,
  assignees: TerritoryAssignee[],
  key: string
) => {
  const {
    assignments,
    doNotCalls,
    holder: _holder,
    holderId: _holderId,
    holderGroup: _holderGroup,
    holderGroupId: _holderGroupId,
    requestedBy,
    requestedById,
    ...content
  } = territory;
  // Holder names and assignment notes must never leak through the generally visible map payload.
  const history = assignments.map((item) =>
    encodeTerritoryAssignment(item, assignees, key)
  );
  const active = history.filter((item) => !item.returnedAt);
  if (active.length > 1)
    throw new TerritoryIdentityError('Review overlapping assignments');
  return {
    details: {
      dataView,
      type: territory.type,
      categories: territory.categories,
      cardLost: territory.cardLost,
      households: territory.households,
      content: encryptTerritoryContent(content, key),
      privateContent: encryptTerritoryContent({}, key),
    },
    assignment: active[0],
    history: history.filter((item) => !!item.returnedAt),
    requestedBy: requestedBy
      ? territoryPersonId(requestedBy, requestedById, assignees)
      : undefined,
    doNotCalls: doNotCalls.map((entry) => ({
      id: entry.id,
      addedBy: doNotCallAuthorId(entry, assignees),
      content: encryptTerritoryContent(entry, key),
    })),
  };
};
const decodeAssignment = (
  assignment: TerritoryWireAssignment,
  assignees: TerritoryAssignee[],
  key: string
): TerritoryAssignment => {
  const names = assignment.content
    ? decryptTerritoryContent<
        Pick<TerritoryAssignment, 'publisher' | 'group' | 'campaign'>
      >(assignment.content, key)
    : { publisher: '' };
  const publisher =
    assignees.find((item) => !item.group && item.id === assignment.personId)
      ?.name ?? names.publisher;
  const group =
    assignees.find((item) => item.group && item.id === assignment.groupId)
      ?.name ?? names.group;
  const date = (value: string) => {
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  return assignmentFromDates(
    {
      ...names,
      id: assignment.id,
      publisherId: assignment.personId,
      groupId: assignment.groupId,
      group,
      card: assignment.card,
      completed: assignment.completed,
      note: assignment.notes
        ? decryptTerritoryContent<string>(assignment.notes, key)
        : undefined,
    } as TerritoryAssignment,
    publisher,
    date(assignment.assignedAt),
    assignment.returnedAt ? date(assignment.returnedAt) : null
  );
};
export const decodeTerritory = (
  record: TerritoryWireRecord,
  assignees: TerritoryAssignee[],
  key: string
): Territory => {
  const content = decryptTerritoryContent<Territory>(record.content, key);
  const assignments = [
    ...record.history,
    ...(record.assignment ? [record.assignment] : []),
  ].map((item) => decodeAssignment(item, assignees, key));
  return withAssignments(
    {
      ...content,
      type: record.type,
      categories: record.categories,
      cardLost: record.cardLost,
      households: record.households ?? content.households,
      requestedById: record.requestedBy,
      assignedElsewhere: !!record.inUse && !record.assignment,
      requestPending: record.requestPending,
      lastReturnedAt: record.lastReturnedAt,
      lastCompletedAt: record.lastCompletedAt,
      daysSinceCovered: record.lastCompletedAt
        ? Math.max(
            0,
            Math.floor(
              (Date.now() - Date.parse(record.lastCompletedAt)) /
                millisecondsInDay
            )
          )
        : content.daysSinceCovered,
      requestedBy: assignees.find((item) => item.id === record.requestedBy)
        ?.name,
      doNotCalls: record.doNotCalls.map((entry) => ({
        ...decryptTerritoryContent<Territory['doNotCalls'][number]>(
          entry.content,
          key
        ),
        id: entry.id,
        addedById: entry.addedBy,
        addedBy:
          assignees.find(
            (person) => !person.group && person.id === entry.addedBy
          )?.name ??
          decryptTerritoryContent<Territory['doNotCalls'][number]>(
            entry.content,
            key
          ).addedBy,
      })),
    },
    assignments
  );
};
