import {
  AssignmentCongregation,
  DutiesSectionType,
} from '@definition/schedules';

export const DUTY_NAME_MAX = 40;
export const normalizeDutyName = (name: string) =>
  name.trim().toLocaleLowerCase();

export const sectionsForView = (
  sections: DutiesSectionType[],
  dataView: string
) =>
  sections
    .filter(
      (section) =>
        !section._deleted &&
        (!section.dataView || section.dataView === dataView)
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/** Preserve the formerly shared layout and assignments independently in every view. */
export const isolateLegacySections = (
  sections: DutiesSectionType[],
  dynamic: AssignmentCongregation[],
  views: string[]
) => {
  const result = structuredClone({ sections, dynamic });
  const updatedAt = new Date().toISOString();
  const allViews = [
    ...new Set(['main', ...views, ...dynamic.map((entry) => entry.type)]),
  ];
  result.sections = sections.flatMap((section, order) => {
    if (section.dataView) return [structuredClone(section)];
    return allViews.map((dataView) => {
      const id =
        dataView === 'main'
          ? section.id
          : `${section.id}~${encodeURIComponent(dataView)}`;
      for (const entry of result.dynamic) {
        if (entry.type === dataView && entry.id?.startsWith(`${section.id}_`)) {
          const slot = `${id}${entry.id.slice(section.id.length)}`;
          if (slot !== entry.id) {
            // Retain a timestamped clear for the old ID so published copies
            // cannot keep a hidden assignment after the group gets its own ID.
            result.dynamic.push({ ...entry, id: slot, updatedAt });
            entry.value = '';
          }
          entry.updatedAt = updatedAt;
        }
      }
      return {
        ...structuredClone(section),
        id,
        legacyId: section.id,
        dataView,
        updatedAt,
        order: section.order ?? order,
      };
    });
  });
  return result;
};

/** An already-open picker can still hold the pre-isolation slot ID. */
export const resolveSectionSlot = (
  sections: DutiesSectionType[],
  dataView: string,
  slot?: string
) => {
  if (!slot) return slot;
  const split = slot.lastIndexOf('_');
  const id = slot.slice(0, split);
  const section = sections.find(
    (section) => section.dataView === dataView && section.legacyId === id
  );
  return section ? `${section.id}${slot.slice(split)}` : slot;
};

export const validateDutyName = (
  name: string,
  others: { id: string; name: string; _deleted?: boolean }[],
  id?: string
) => {
  if (!name.trim()) return 'tr_fillRequiredField';
  if (name.trim().length > DUTY_NAME_MAX) return 'tr_dutyNameTooLong';
  if (
    others.some(
      (item) =>
        !item._deleted &&
        item.id !== id &&
        normalizeDutyName(item.name) === normalizeDutyName(name)
    )
  )
    return 'tr_sectionNameTaken';
};

export const uniqueDutyName = (
  base: string,
  others: { id: string; name: string; _deleted?: boolean }[]
) => {
  const trimmed = base.trim().slice(0, DUTY_NAME_MAX);
  let name = trimmed;
  let index = 2;
  while (
    others.some(
      (item) =>
        !item._deleted &&
        normalizeDutyName(item.name) === normalizeDutyName(name)
    )
  ) {
    const suffix = ` (${index++})`;
    name = `${trimmed.slice(0, DUTY_NAME_MAX - suffix.length)}${suffix}`;
  }
  return name;
};
