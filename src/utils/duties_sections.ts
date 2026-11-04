import { DutiesSectionType } from '@definition/schedules';

export const DUTY_NAME_MAX = 40;
export const normalizeDutyName = (name: string) =>
  name.trim().toLocaleLowerCase();

export const sectionsForView = (
  sections: DutiesSectionType[],
  dataView: string
) =>
  sections
    .filter((section) => !section._deleted && section.dataView === dataView)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
