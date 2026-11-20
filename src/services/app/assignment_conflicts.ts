import type { AssignmentConflictContext } from '@definition/assignment_conflicts';
import type { SchedWeekType } from '@definition/schedules';
import type { SourceAssignmentType, SourceWeekType } from '@definition/sources';
import { store } from '@states/index';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/settings';
import { sourcesPartTiming } from '@services/app/sources';
import { getTranslation } from '@services/i18n/translation';
import { collectAssignmentConflicts } from '@utils/assignment_conflicts';

export const getAssignmentConflicts = (
  options: Omit<AssignmentConflictContext, 'minutes'> & {
    schedule?: SchedWeekType;
    source?: SourceWeekType;
  }
) => {
  const source =
    options.source ??
    store.get(sourcesState).find((week) => week.weekOf === options.week);
  const lang = store.get(JWLangState);
  const minutes: Record<string, number> = {};
  if (source) {
    for (const key of [
      'tgw_talk',
      'tgw_gems',
      'ayf_part1',
      'ayf_part2',
      'ayf_part3',
      'ayf_part4',
      'lc_part1',
      'lc_part2',
      'lc_part3',
      'lc_cbs',
    ] as SourceAssignmentType[]) {
      if (!source.midweek_meeting[key]) continue;
      const value = sourcesPartTiming(source, key, options.dataView, lang);
      if (value !== undefined && value > 0) minutes[key] = value;
    }
  }
  return collectAssignmentConflicts({
    ...options,
    // History names may already include a fixed duration. Conflict labels use
    // the current source timing, with the shared part name shown only once.
    history: options.history.map((entry) =>
      entry.assignment.key === 'MM_TGWTalk'
        ? {
            ...entry,
            assignment: {
              ...entry.assignment,
              title: getTranslation({ key: 'tr_treasuresShort' }),
            },
          }
        : entry
    ),
    minutes,
  });
};
