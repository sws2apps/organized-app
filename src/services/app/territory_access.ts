import type { Territory, DoNotCall } from '@definition/territory';
import type {
  TerritoryAccessContext,
  TerritoryServerAccess,
} from '@definition/territory_access';

export const territoryPermissions = (
  territory: Territory,
  context: TerritoryAccessContext
) => {
  const { editor, publisher, access, groupHolder, restricted } = context;
  const held = territory.holderId
    ? territory.holderId === context.publisherId
    : context.legacyIdentitySafe !== false &&
      !!publisher &&
      territory.holder === publisher;
  const requested =
    !!territory.requestedBy &&
    (territory.requestedById
      ? territory.requestedById === context.publisherId
      : context.legacyIdentitySafe !== false &&
        !!publisher &&
        territory.requestedBy === publisher);
  const group = territory.holderGroupId
    ? territory.holderGroupId === context.groupId
    : !!groupHolder &&
      (territory.holderGroup === groupHolder ||
        territory.holder === groupHolder);
  const offered =
    !restricted.types.includes(territory.type) &&
    !territory.categories.some((category) =>
      restricted.categories.includes(category)
    );
  const available = territory.status === 'available';

  return {
    view:
      editor ||
      held ||
      group ||
      requested ||
      territory.assignments.some(
        (assignment) =>
          !!assignment.publisherId &&
          assignment.publisherId === context.publisherId
      ) ||
      (access !== 'own' && available && offered),
    private: editor || held || group,
    request:
      !!publisher &&
      context.eligiblePublisher &&
      access === 'request' &&
      available &&
      !territory.cardLost &&
      offered &&
      !territory.requestedBy &&
      !territory.requestPending,
    cancelRequest: requested,
    return: !available && (editor || (access === 'request' && (held || group))),
    editDoNotCalls: editor || held,
  };
};

const publisherDoNotCalls = (
  current: DoNotCall[],
  next: DoNotCall[],
  publisher: string,
  publisherId?: string
) => {
  const owned = new Set(
    current
      .filter((entry) =>
        entry.addedById
          ? entry.addedById === publisherId
          : entry.addedBy === publisher
      )
      .map((entry) => entry.id)
  );
  const protectedIds = new Set(
    current.filter((entry) => !owned.has(entry.id)).map((entry) => entry.id)
  );
  const entries = new Map<string, DoNotCall>();

  for (const entry of next) {
    if (!entry.id || protectedIds.has(entry.id)) continue;
    if (
      (entry.addedById
        ? entry.addedById !== publisherId
        : entry.addedBy !== publisher) ||
      !entry.address.trim()
    )
      continue;
    entries.set(entry.id, entry);
  }

  return [
    ...current.filter((entry) => protectedIds.has(entry.id)),
    ...entries.values(),
  ];
};

const publisherRequestChanges = (
  current: Territory,
  next: Territory,
  context: TerritoryAccessContext,
  permissions: ReturnType<typeof territoryPermissions>
): Partial<Territory> => {
  const changes: Partial<Territory> = {};
  if (next.requestedBy !== current.requestedBy) {
    if (permissions.request && next.requestedBy === context.publisher) {
      changes.requestedBy = context.publisher;
      if (context.publisherId) changes.requestedById = context.publisherId;
    } else if (permissions.cancelRequest && !next.requestedBy) {
      changes.requestedBy = undefined;
      if (current.requestedById) changes.requestedById = undefined;
      if (current.requestPending) changes.requestPending = false;
    }
  }
  return changes;
};

// A publisher can change their request or their own do-not-call records,
// without replacing the rest of a territory from a stale details form.
export const publisherTerritoryChanges = (
  current: Territory,
  next: Territory,
  context: TerritoryAccessContext
): Partial<Territory> => {
  if (current.id !== next.id) return {};
  const permissions = territoryPermissions(current, context);
  const changes = publisherRequestChanges(current, next, context, permissions);

  if (permissions.editDoNotCalls && next.doNotCalls !== current.doNotCalls) {
    changes.doNotCalls = publisherDoNotCalls(
      current.doNotCalls,
      next.doNotCalls,
      context.publisher,
      context.publisherId
    );
  }

  return changes;
};

export const territoryHistoryForPublisher = (
  territories: Territory[],
  publisher: string,
  publisherId?: string
) =>
  publisher || publisherId
    ? territories.flatMap((territory) => {
        const assignments = territory.assignments.filter((assignment) =>
          assignment.publisherId
            ? assignment.publisherId === publisherId
            : assignment.publisher === publisher
        );
        return assignments.length ? [{ ...territory, assignments }] : [];
      })
    : [];

/** An online snapshot can restrict cached roles immediately, without waiting for the general account backup. */
export const applyTerritoryServerAccess = (
  context: TerritoryAccessContext,
  server?: TerritoryServerAccess
): TerritoryAccessContext => {
  if (!server) return context;
  const groupAllowed =
    !!context.groupId && server.groupIds.includes(context.groupId);
  return {
    ...context,
    editor: context.editor && server.manager,
    eligiblePublisher: context.eligiblePublisher && server.eligible,
    access: server.access,
    groupId: groupAllowed ? context.groupId : undefined,
    groupHolder: groupAllowed ? context.groupHolder : undefined,
    restricted: server.restricted,
  };
};
