import { HallInfo } from '@definition/hall_attendant';

export const emptyHallInfo = (type: string): HallInfo => ({
  type,
  updatedAt: '',
  notes: [],
  contacts: [],
  instructions: { text: '', updatedAt: '', revision: '' },
});

const latest = <
  T extends { updatedAt: string; revision: string; _deleted?: boolean },
>(
  a: T,
  b: T
): T => {
  if (!!a._deleted !== !!b._deleted) return a._deleted ? a : b;
  if (a.updatedAt !== b.updatedAt) return a.updatedAt > b.updatedAt ? a : b;
  return (a.revision ?? '') >= (b.revision ?? '') ? a : b;
};

const mergeItems = <
  T extends {
    id: string;
    createdAt?: string;
    updatedAt: string;
    revision: string;
    _deleted: boolean;
  },
>(
  a: T[],
  b: T[]
) => {
  const items = new Map<string, T>();
  for (const item of [...a, ...b]) {
    const previous = items.get(item.id);
    items.set(item.id, previous ? latest(previous, item) : item);
  }
  return [...items.values()].sort((a, b) => {
    const first = a.createdAt ?? '';
    const second = b.createdAt ?? '';
    if (first !== second) return first < second ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
};

export const mergeHallInfo = (
  local: HallInfo[] = [],
  remote: HallInfo[] = []
): HallInfo[] => {
  const views = new Map<string, HallInfo>();
  for (const incoming of [...local, ...remote]) {
    const current = views.get(incoming.type) ?? emptyHallInfo(incoming.type);
    views.set(incoming.type, {
      type: incoming.type,
      updatedAt:
        current.updatedAt > incoming.updatedAt
          ? current.updatedAt
          : incoming.updatedAt,
      notes: mergeItems(current.notes, incoming.notes),
      contacts: mergeItems(current.contacts, incoming.contacts),
      instructions: latest(current.instructions, incoming.instructions),
    });
  }
  return structuredClone(
    [...views.values()].sort((a, b) =>
      a.type < b.type ? -1 : a.type > b.type ? 1 : 0
    )
  );
};

export const nextHallTimestamp = (info: HallInfo) =>
  new Date(
    Math.max(
      Date.now(),
      ...[
        info.updatedAt,
        info.instructions.updatedAt,
        ...info.notes.map((item) => item.updatedAt),
        ...info.contacts.map((item) => item.updatedAt),
      ].map((value) => (Date.parse(value) || 0) + 1)
    )
  ).toISOString();
