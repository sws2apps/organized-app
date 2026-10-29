import {
  DutiesMeetingType,
  DutiesSectionTemplateType,
  DutiesSectionType,
} from '@definition/schedules';
import { sectionsForView } from '@utils/duties_sections';

export const DUTY_SECTION_RULES = {
  midweek: [
    'tgw_talk',
    'tgw_gems',
    'tgw_bible_reading',
    'ayf_all',
    'lc_all',
    'lc_cbs',
  ],
  weekend: ['public_talk', 'w_study'],
} as const;

/** One current setup per meeting; older stored revisions remain readable. */
export const currentSectionTemplate = (
  templates: DutiesSectionTemplateType[],
  meeting: 'midweek' | 'weekend'
) =>
  templates
    .filter((item) => item.meeting === meeting)
    .sort(
      (a, b) =>
        b.updatedAt.localeCompare(a.updatedAt) || b.id.localeCompare(a.id)
    )[0];

/** Linked sections follow the meeting program; unlinked sections keep their relative order. */
export const sortSectionsByParts = <T extends { parts: string[] }>(
  sections: T[],
  partKeys: readonly string[]
): T[] => {
  const position = (section: T) => {
    const indices = section.parts
      .map((key) => partKeys.indexOf(key))
      .filter((index) => index >= 0);
    return indices.length ? Math.min(...indices) : Number.MAX_SAFE_INTEGER;
  };
  return [...sections].sort((a, b) => position(a) - position(b));
};

export const hasSavedSections = (
  duties: Pick<DutiesMeetingType, 'sections' | 'section_overrides'>,
  dataView: string
) =>
  duties.section_overrides?.some((item) => item.type === dataView) ||
  duties.sections.some((item) => item.dataView === dataView);

const containsAssignment = (value: unknown, dataView: string): boolean => {
  if (Array.isArray(value))
    return value.some((entry) => containsAssignment(entry, dataView));
  if (!value || typeof value !== 'object') return false;
  if (
    'type' in value &&
    value.type === dataView &&
    'value' in value &&
    typeof value.value === 'string' &&
    value.value.length > 0
  )
    return true;
  return Object.values(value).some((entry) =>
    containsAssignment(entry, dataView)
  );
};

/** Resolve defaults without writing on navigation. Saved weeks, including empty overrides, win. */
export const resolveRecurringSections = ({
  duties,
  templates,
  meeting,
  dataView,
  partKeys,
}: {
  duties: Pick<DutiesMeetingType, 'sections' | 'section_overrides'> &
    Partial<DutiesMeetingType>;
  templates: DutiesSectionTemplateType[];
  meeting: 'midweek' | 'weekend';
  dataView: string;
  partKeys: string[];
}): DutiesSectionType[] => {
  if (hasSavedSections(duties, dataView))
    return sortSectionsByParts(
      sectionsForView(duties.sections, dataView),
      partKeys
    );
  if (containsAssignment(duties, dataView)) return [];
  const template = currentSectionTemplate(templates, meeting);
  if (!template) return [];
  return sortSectionsByParts(
    template.sections,
    DUTY_SECTION_RULES[meeting]
  ).flatMap((section, order) => {
    const parts = partKeys.filter((key) =>
      section.parts.some((rule) => {
        if (rule === 'ayf_all') return /^ayf_part\d+$/.test(key);
        if (rule === 'lc_all') return /^lc_part\d+$/.test(key);
        return rule === key;
      })
    );
    // A linked shift with no matching part is absent, never a whole-meeting shift.
    if (section.parts.length && !parts.length) return [];
    return [
      {
        ...section,
        id: `recurring-${template.id}-${section.id}`,
        dataView,
        parts,
        order,
        updatedAt: template.updatedAt,
        _deleted: false,
      },
    ];
  });
};

/** Snapshot at the first assignment or deliberate customization, preserving other views. */
export const snapshotRecurringSections = (
  duties: DutiesMeetingType,
  resolved: DutiesSectionType[],
  dataView: string,
  updatedAt: string
): DutiesMeetingType => {
  if (hasSavedSections(duties, dataView)) return duties;
  return {
    ...duties,
    sections: [...duties.sections, ...resolved],
    section_overrides: [
      ...(duties.section_overrides ?? []),
      { type: dataView, updatedAt },
    ],
  };
};
