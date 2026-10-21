import useCleaningExportOptions from '@features/activities/hall_cleaning/cleaning_export/useCleaningExportOptions';
import {
  cleaningExportReady,
  cleaningRotationMonthlyRows,
} from '@utils/hall_cleaning_export';
import type { HallCleaningConfig } from '@definition/hall_cleaning';
import type { CleaningExportRange } from '@definition/hall_cleaning_export';
import {
  hallCleaningExportWeeks,
  hallCleaningPublishedConfig,
  hallCleaningExportSlots,
} from '@services/app/hall_cleaning_export';
import {
  hallCleaningConfiguredGroupCount,
  hallCleaningGroupEntries,
} from '@utils/hall_cleaning_groups';
import {
  activeMajorCleanings,
  cleaningActivityLabelKey,
} from '@utils/major_cleaning';
import { useQuery } from '@tanstack/react-query';
import { apiPublicScheduleGet } from '@services/api/schedule';
import {
  congAccountConnectedState,
  dayNamesState,
  monthNamesState,
  monthShortNamesState,
} from '@states/app';
import { useState } from 'react';
import { resolveHallCleaningConfig } from '@utils/hall_cleaning';
import { useAtomValue } from 'jotai';
import { saveAs } from 'file-saver';
import { AssignmentCongregation, SchedWeekType } from '@definition/schedules';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { selectedWeekState } from '@states/schedules';
import { personsState } from '@states/persons';
import {
  fieldGroupsState,
  headerForScheduleState,
} from '@states/field_service_groups';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  settingsState,
  JWLangLocaleState,
  userDataViewState,
} from '@states/settings';
import {
  HallCleaningSlotType,
  schedulesHallCleaningMode,
  schedulesHallCleaningPersons,
  schedulesHallCleaningYearlyDate,
  schedulesHallCleaningGroupName,
  schedulesResolveMeetingDate,
} from '@services/app/schedules';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { getCSSPropertyValue, personGetDisplayName } from '@utils/common';
import {
  addDays,
  formatDate,
  getWeekDate,
  currentServiceYear,
} from '@utils/date';
import {
  HallCleaningExportRowType,
  HallCleaningTurnGroupType,
  HallCleaningTurnType,
} from '@views/activities/hall_cleaning/index.types';
import { renderHallCleaning } from '@views/index';

const ALL_SLOTS: HallCleaningSlotType[] = ['midweek', 'weekend', 'yearly'];

const OTHER_COLOR = '#606D93';

const useCleaningExport = (onClose: VoidFunction) => {
  const { t } = useAppTranslation();

  const { isGroup } = useCurrentUser();

  const connected = useAtomValue(congAccountConnectedState);
  const version = 'published' as const;
  const {
    data: published,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['public_schedules'],
    queryFn: apiPublicScheduleGet,
    enabled: connected,
    refetchOnMount: 'always',
  });
  const schedules =
    published?.status === 200 ? (published.schedules ?? []) : [];
  const versionAvailable =
    connected &&
    !isFetching &&
    !isError &&
    published?.status === 200 &&
    Array.isArray(published.schedules);
  const persons = useAtomValue(personsState);
  const groups = useAtomValue(fieldGroupsState);
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const config = hallCleaningPublishedConfig(schedules, dataView);
  const congregation = useAtomValue(headerForScheduleState);
  const sourceLang = useAtomValue(JWLangLocaleState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const monthNames = useAtomValue(monthShortNamesState);
  const fullMonthNames = useAtomValue(monthNamesState);
  const dayNames = useAtomValue(dayNamesState);

  const selectedWeek = useAtomValue(selectedWeekState);
  const currentWeek = formatDate(getWeekDate(), 'yyyy/MM/dd');
  const options = useCleaningExportOptions(selectedWeek, currentWeek);
  const {
    startWeek,
    endWeek,
    exportDetailed,
    exportRotation,
    rotationYear,
    rotationRange,
    layout,
    rangeValid,
    rotationRangeValid,
  } = options;
  const years = [
    ...new Set([
      rotationYear,
      Number(currentServiceYear()),
      Number(currentServiceYear()) + 1,
      new Date(currentWeek).getFullYear(),
      new Date(currentWeek).getFullYear() + 1,
      ...schedules.map((week) => new Date(week.weekOf).getFullYear()),
    ]),
  ].sort((a, b) => a - b);
  const [isProcessing, setIsProcessing] = useState(false);

  const personName = (uid: string) => {
    const person = persons.find((record) => record.person_uid === uid);

    if (!person) return '';

    return personGetDisplayName(person, displayNameEnabled, fullnameOption);
  };

  const groupColor = (groupId: string) => {
    const group = groups.find((record) => record.group_id === groupId);

    if (!group) return OTHER_COLOR;

    return getCSSPropertyValue(
      `--group-${(group.group_data.sort_index % 10) + 1}`
    );
  };

  const shortDate = (month: number, date: string | number) =>
    t('tr_longDateNoYearLocale', { month: monthNames[month], date });

  const slotDate = (schedule: SchedWeekType, slot: HallCleaningSlotType) => {
    const publishedDate = schedule.hall_cleaning?.publication
      ?.find((entry) => entry.type === dataView)
      ?.slots.find((entry) => entry.slot === slot)?.date;
    if (publishedDate) {
      const day = new Date(publishedDate);
      return {
        date: publishedDate,
        locale: shortDate(day.getMonth(), day.getDate()),
      };
    }

    if (slot === 'yearly') {
      const date = schedulesHallCleaningYearlyDate(schedule);
      const day = new Date(date);

      return { date, locale: shortDate(day.getMonth(), day.getDate()) };
    }

    const week = schedule.weekOf;

    let meeting: 'midweek' | 'weekend' | 'cleaning' = 'cleaning';

    if (slot === 'weekend') meeting = 'weekend';
    if (
      slot === 'midweek' &&
      resolveHallCleaningConfig(schedule, config)?.period.value === 'meeting'
    ) {
      meeting = 'midweek';
    }

    const day =
      meeting === 'cleaning'
        ? addDays(week, 1)
        : schedulesResolveMeetingDate({
            settings,
            schedule,
            meeting,
            dataView,
          });
    return {
      date: formatDate(day, 'yyyy/MM/dd'),
      locale: shortDate(day.getMonth(), day.getDate()),
    };
  };

  const selectedRange: CleaningExportRange = { start: startWeek, end: endWeek };
  const weeksInRange = (range: CleaningExportRange = selectedRange) =>
    hallCleaningExportWeeks(schedules, range);
  const exportSlots = (schedule: SchedWeekType) =>
    hallCleaningExportSlots(schedule, config);

  const monthLabel = (date: string) => {
    if (!date) return undefined;
    const day = new Date(date);
    return t('tr_monthYear', {
      month: fullMonthNames[day.getMonth()],
      year: day.getFullYear(),
    });
  };

  // Published data is already materialized; never recalculate it from today's rotation.
  const slotGroups = (schedule: SchedWeekType, slot: HallCleaningSlotType) => {
    const weekConfig = resolveHallCleaningConfig(schedule, config);
    if (!weekConfig || schedulesHallCleaningMode(weekConfig) === 'persons')
      return [];
    const entries = hallCleaningGroupEntries(
      schedule.hall_cleaning?.[slot]?.group,
      dataView,
      hallCleaningConfiguredGroupCount(weekConfig)
    );
    if (entries[0]?.value.startsWith('cong:')) return [entries[0]];
    return entries.filter(
      (entry): entry is AssignmentCongregation => !!entry?.value
    );
  };

  const missingForSlot = (
    schedule: SchedWeekType,
    slot: HallCleaningSlotType,
    weekConfig: HallCleaningConfig
  ) => {
    const assignedGroups = slotGroups(schedule, slot);
    if (assignedGroups[0]?.value.startsWith('cong:')) return 0;
    const mode = schedulesHallCleaningMode(weekConfig);
    const needsGroup =
      mode === 'group' || (mode === 'group_persons' && slot !== 'yearly');
    const groupMissing = needsGroup
      ? Math.max(
          0,
          hallCleaningConfiguredGroupCount(weekConfig) - assignedGroups.length
        )
      : 0;
    const peopleMissing = schedulesHallCleaningPersons(slot, weekConfig).filter(
      (field) =>
        !schedule.hall_cleaning?.[slot]?.persons?.some(
          (entry) =>
            entry.type === dataView &&
            entry.id === field.schedule_id &&
            entry.value
        )
    ).length;
    return groupMissing + peopleMissing;
  };

  const cleaningRows = (
    range: CleaningExportRange = selectedRange
  ): HallCleaningExportRowType[] => {
    const rows = weeksInRange(range).flatMap((schedule) =>
      ALL_SLOTS.filter((slot) => exportSlots(schedule).includes(slot)).flatMap(
        (slot) => {
          const weekConfig = resolveHallCleaningConfig(schedule, config);
          if (!weekConfig) return [];
          const data = schedule.hall_cleaning?.[slot];

          const assignedGroups = slotGroups(schedule, slot);
          const group = assignedGroups[0];

          const activeIds = new Set(
            schedulesHallCleaningPersons(slot, weekConfig).map(
              (field) => field.schedule_id
            )
          );

          const assigned = (data?.persons ?? [])
            .filter(
              (record) =>
                record.type === dataView &&
                record.value &&
                activeIds.has(record.id)
            )
            .sort((a, b) => Number(a.id) - Number(b.id));

          const lead = assigned.find((record) => record.id === '1');
          const responsible = lead?.name || personName(lead?.value ?? '');

          const others = assigned
            .filter((record) => record.id !== '1')
            .map((record) => record.name || personName(record.value))
            .filter(Boolean);

          const missing = missingForSlot(schedule, slot, weekConfig);
          if (missing)
            others.push(t('tr_scheduleMissingAssignments', { count: missing }));

          const date = slotDate(schedule, slot);

          const row: HallCleaningExportRowType = {
            id: `${schedule.weekOf}_${slot}`,
            date: date.locale,
            dateKey: date.date,
            weekday: dayNames[new Date(date.date).getDay()],
            month: monthLabel(date.date),
            label: slot === 'yearly' ? t('tr_yearlyCleaning') : undefined,
            isMajor: slot === 'yearly',
            group: group?.value
              ? { name: group.name, color: groupColor(group.value) }
              : undefined,
            groups: assignedGroups.map((entry) => ({
              name: entry.name,
              color: groupColor(entry.value),
            })),
            responsible: responsible || undefined,
            persons: others,
          };

          return { sortDate: date.date, row };
        }
      )
    );

    for (const schedule of weeksInRange(range)) {
      for (const event of activeMajorCleanings(
        schedule.hall_cleaning?.events,
        dataView
      )) {
        if (
          event.date < (range.firstDate ?? range.start) ||
          event.date >
            (range.lastDate ??
              formatDate(addDays(new Date(range.end), 6), 'yyyy/MM/dd'))
        )
          continue;
        const day = new Date(event.date);
        rows.push({
          sortDate: event.date,
          row: {
            id: `${event.type}:${event.id}`,
            date: shortDate(day.getMonth(), day.getDate()),
            dateKey: event.date,
            weekday: dayNames[day.getDay()],
            month: monthLabel(event.date),
            label: t(cleaningActivityLabelKey(event.activity)),
            isMajor: true,
            participants: event.participants.map((entry) => entry.name),
            responsible: event.coordinator || undefined,
            persons: [
              ...(!event.participants.length
                ? [t('tr_scheduleMissingAssignments', { count: 1 })]
                : []),
            ],
          },
        });
      }
    }

    return rows
      .filter(
        ({ row, sortDate }) =>
          !row.isMajor ||
          (sortDate >= (range.firstDate ?? range.start) &&
            sortDate <=
              (range.lastDate ??
                formatDate(addDays(new Date(range.end), 6), 'yyyy/MM/dd')))
      )
      .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
      .map(({ row }) => row);
  };

  const turnLabel = (start: Date, end: Date) => {
    if (start.getTime() === end.getTime())
      return [shortDate(start.getMonth(), start.getDate())];
    if (start.getFullYear() !== end.getFullYear()) {
      const dateWithYear = (day: Date) =>
        t('tr_longDateWithYearLocale', {
          month: monthNames[day.getMonth()],
          date: day.getDate(),
          year: day.getFullYear(),
        });
      return [`${dateWithYear(start)} –`, dateWithYear(end)];
    }
    if (start.getMonth() === end.getMonth()) {
      return [
        shortDate(start.getMonth(), `${start.getDate()}–${end.getDate()}`),
      ];
    }

    return [
      `${shortDate(start.getMonth(), start.getDate())} –`,
      shortDate(end.getMonth(), end.getDate()),
    ];
  };

  const rotationWeeks = weeksInRange(rotationRange);
  const rotationEntries = rotationWeeks.map((schedule) => ({
    week: schedule.weekOf,
    slots: exportSlots(schedule)
      .filter((slot) => slot !== 'yearly')
      .map((slot) => ({
        meeting: slot as 'midweek' | 'weekend',
        date: slotDate(schedule, slot).date,
        groups: slotGroups(schedule, slot)
          .filter((entry) => !entry.value.startsWith('cong:'))
          .map((entry) => entry.value),
      })),
  }));
  const rotationRanges = cleaningRotationMonthlyRows(
    rotationEntries,
    rotationRange
  );
  const turns: HallCleaningTurnType[] = rotationRanges.map((turn) => ({
    id: turn.id,
    startDate: turn.start,
    weekLabel:
      'weekNumber' in turn
        ? t('tr_weekNumber', { weekNumber: turn.weekNumber })
        : undefined,
    groups: turn.groups,
    month: monthLabel(turn.start),
    label: [
      ...(turn.meeting
        ? [t(turn.meeting === 'midweek' ? 'tr_midweek' : 'tr_weekend')]
        : []),
      ...('fullMonth' in turn && turn.fullMonth
        ? []
        : turnLabel(new Date(turn.start), new Date(turn.end))),
    ],
  }));
  const turnsAvailable = !isGroup && turns.length > 0;

  const turnGroups = (turns: HallCleaningTurnType[]) => {
    const used = new Set(turns.flatMap((turn) => turn.groups));
    const order = config?.rotation_groups?.value ?? [];

    const position = (groupId: string) => {
      const index = order.indexOf(groupId);
      return index === -1 ? order.length : index;
    };

    const names = new Map(
      rotationWeeks
        .flatMap((week) =>
          ALL_SLOTS.filter((slot) => slot !== 'yearly').flatMap((slot) =>
            slotGroups(week, slot)
          )
        )
        .map((entry) => [entry.value, entry.name])
    );
    return [...used]
      .sort((a, b) => position(a) - position(b) || a.localeCompare(b))
      .map<HallCleaningTurnGroupType>((id) => ({
        id,
        name: names.get(id) || schedulesHallCleaningGroupName(id),
        color: groupColor(id),
        leaders: [],
      }));
  };

  const detailRows = rangeValid ? cleaningRows() : [];
  const rotationRows = rotationRangeValid
    ? cleaningRows(rotationRange).filter((row) => row.isMajor)
    : [];
  const canExport = cleaningExportReady({
    connected,
    publishedAvailable: versionAvailable,
    cleaning: {
      selected: exportDetailed,
      rangeValid,
      hasAssignments: detailRows.length > 0,
    },
    rotation: {
      selected: exportRotation,
      rangeValid: rotationRangeValid,
      hasAssignments: turnsAvailable,
    },
  });
  const handleExport = async () => {
    if (!canExport || isProcessing) return;

    try {
      setIsProcessing(true);

      // Finish both documents before initiating downloads, so a rendering failure cannot produce a partial export.
      const outputs: { blob: Blob; name: string }[] = [];
      if (exportDetailed)
        outputs.push({
          blob: await renderHallCleaning({
            congregation,
            lang: sourceLang,
            layout,
            version,
            rows: detailRows,
            groups: [],
            turns: [],
          }),
          name: `HC_Detailed_${startWeek.replaceAll('/', '')}-${endWeek.replaceAll('/', '')}.pdf`,
        });
      if (exportRotation)
        outputs.push({
          blob: await renderHallCleaning({
            congregation,
            lang: sourceLang,
            layout: 'rotation',
            version,
            rows: rotationRows,
            groups: turnGroups(turns),
            turns,
          }),
          name: `HC_Groups_${rotationRange.start.replaceAll('/', '')}-${rotationRange.end.replaceAll('/', '')}.pdf`,
        });
      for (const output of outputs) saveAs(output.blob, output.name);

      setIsProcessing(false);
      onClose();
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    }
  };

  return {
    ...options,
    years,
    rotationYearLabel: (year: number) =>
      options.rotationPeriod === 'service_year'
        ? `${year} (${monthNames[8]} ${year - 1}–${monthNames[7]} ${year})`
        : String(year),
    turnsAvailable,
    handleExport,
    isProcessing,
    version,
    connected,
    versionAvailable,
    isLoading: isFetching,
    canExport,
  };
};

export default useCleaningExport;
