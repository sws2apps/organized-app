import {
  AssignmentAYFOnlyType,
  AssignmentCode,
  AssignmentType,
} from '@definition/assignment';
import { AYF_LABEL_ALIASES } from '@constants/ayf_label_aliases';
import { splitTranslationVariations } from '@utils/i18n';
import logger from '@services/logger';

const remapAssignmentType = (week: string, type: number) => {
  if (week < '2024/01/01') return type;

  switch (type) {
    case 101:
      return 123;
    case 102:
      return 124;
    case 103:
      return 125;
    default:
      return type;
  }
};

export const withAYFLabelAliases = (
  assTypeList: AssignmentAYFOnlyType[],
  sourceLanguage: string
) =>
  assTypeList
    .concat(AYF_LABEL_ALIASES[sourceLanguage] ?? [])
    .sort((a, b) => a.value - b.value);

// MANUALLY ADDED: DO NOT REMOVE
// Import and backup repair must build the same lookup for each source language.
export const getAYFAssignmentTypes = (
  assignmentTypes: AssignmentType[],
  sourceLanguage: string
) => {
  const language = sourceLanguage.toUpperCase();
  const types = assignmentTypes
    .filter((record) => record.type === 'ayf')
    .flatMap((record) =>
      splitTranslationVariations(
        record.assignment_type_name[language] ??
          record.assignment_type_name.E ??
          ''
      ).map((label) => ({ label, value: record.code }))
    );

  return withAYFLabelAliases(types, language);
};

const stripZeroWidthSpaces = (label: string) =>
  label.replaceAll('\u200B', '').trim();

const normalizeAYFLabel = (label: string) =>
  label
    .replaceAll('\u200B', '')
    .replace(/\([^)]{0,1000}\)/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();

export const buildAYFLookup = (assTypeList: AssignmentAYFOnlyType[]) => {
  const exactMap = new Map<string, number>();
  for (const type of assTypeList) {
    const key = stripZeroWidthSpaces(type.label).toLowerCase();
    if (key.length > 0) exactMap.set(key, type.value);
  }

  const prefixList = assTypeList
    .map((type) => ({
      normalized: normalizeAYFLabel(type.label),
      value: type.value,
    }))
    .filter((entry) => entry.normalized.length > 0)
    .sort((a, b) => b.normalized.length - a.normalized.length);

  return { exactMap, prefixList };
};

export type AYFLookup = ReturnType<typeof buildAYFLookup>;

// MANUALLY ADDED: DO NOT REMOVE
// Unknown labels must stay distinct from a recognized Discussion during repair.
export const matchAYFType = (
  lookup: AYFLookup,
  rawLabel: string | undefined | null,
  weekOf: string
): number | undefined => {
  if (!rawLabel?.trim()) return;

  const exactKey = stripZeroWidthSpaces(rawLabel).toLowerCase();
  const exactValue = lookup.exactMap.get(exactKey);
  if (exactValue !== undefined) return remapAssignmentType(weekOf, exactValue);

  const normalizedInput = normalizeAYFLabel(rawLabel);
  if (!normalizedInput) return;

  const prefixMatch = lookup.prefixList.find((type) =>
    normalizedInput.startsWith(type.normalized)
  );
  if (prefixMatch) return remapAssignmentType(weekOf, prefixMatch.value);
};

export const getAssType = (
  lookup: AYFLookup,
  label: string | undefined,
  weekOf: string
) => {
  const type = matchAYFType(lookup, label, weekOf);
  if (type !== undefined) return type;

  logger.warn(
    'sources',
    `AYF type label not recognized, falling back to MM_Discussion: "${label?.slice(0, 100) ?? ''}"`
  );
  return AssignmentCode.MM_Discussion;
};
