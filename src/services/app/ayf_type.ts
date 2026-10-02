import { AssignmentAYFOnlyType, AssignmentCode } from '@definition/assignment';
import { AYF_LABEL_ALIASES } from '@constants/ayf_label_aliases';
import logger from '@services/logger';

const remapAssignmentType = (week: string, type: number) => {
  if (week < '2024/01/01') {
    return type;
  }

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
) => {
  return assTypeList
    .concat(AYF_LABEL_ALIASES[sourceLanguage] ?? [])
    .sort((a, b) => {
      return a.value > b.value ? 1 : -1;
    });
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

type NormalizedAYFType = {
  normalized: string;
  value: number;
};

export const buildAYFLookup = (assTypeList: AssignmentAYFOnlyType[]) => {
  const exactMap = new Map<string, number>();
  for (const type of assTypeList) {
    const key = stripZeroWidthSpaces(type.label).toLowerCase();
    if (key.length > 0) {
      exactMap.set(key, type.value);
    }
  }

  const prefixList: NormalizedAYFType[] = assTypeList
    .map((type) => ({
      normalized: normalizeAYFLabel(type.label),
      value: type.value,
    }))
    .filter((entry) => entry.normalized.length > 0)
    .sort((a, b) => b.normalized.length - a.normalized.length);

  return { exactMap, prefixList };
};

export type AYFLookup = ReturnType<typeof buildAYFLookup>;

const inferAYFTypeFromLabel = (
  rawLabel: string | undefined | null,
  lookup: AYFLookup
): number => {
  if (!rawLabel?.trim()) {
    logger.warn(
      'sources',
      'AYF type label is empty or missing, falling back to MM_Discussion'
    );
    return AssignmentCode.MM_Discussion;
  }

  const exactKey = stripZeroWidthSpaces(rawLabel).toLowerCase();
  const exactValue = lookup.exactMap.get(exactKey);
  if (exactValue !== undefined) return exactValue;

  const normalizedInput = normalizeAYFLabel(rawLabel);

  if (!normalizedInput) {
    logger.warn(
      'sources',
      `AYF type label reduced to empty after normalization, falling back to MM_Discussion: "${rawLabel.slice(0, 100)}"`
    );
    return AssignmentCode.MM_Discussion;
  }

  const prefixMatch = lookup.prefixList.find((type) =>
    normalizedInput.startsWith(type.normalized)
  );
  if (prefixMatch) return prefixMatch.value;

  logger.warn(
    'sources',
    `AYF type label not recognized, falling back to MM_Discussion: "${rawLabel.slice(0, 100)}"`
  );
  return AssignmentCode.MM_Discussion;
};

export const getAssType = (
  lookup: AYFLookup,
  label: string,
  weekOf: string
) => {
  const assType = inferAYFTypeFromLabel(label, lookup);

  return remapAssignmentType(weekOf, assType);
};
