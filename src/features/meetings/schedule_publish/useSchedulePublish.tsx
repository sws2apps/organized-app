import {
  projectScheduleMonth,
  schedulePublicationState,
} from '@utils/schedule_publication';
import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { addMonths, formatDate, getWeekDate, isMondayDate } from '@utils/date';
import { sourcesState } from '@states/sources';
import {
  ScheduleListType,
  SchedulePublishProps,
  YearGroupType,
} from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  schedulesWeekAssignmentsInfo,
  schedulesHallCleaningForPublish,
  schedulesHallCleaningInfo,
} from '@services/app/schedules';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { SourceWeekType } from '@definition/sources';
import { schedulesState } from '@states/schedules';
import {
  AssignmentCongregation,
  OutgoingTalkExportScheduleType,
  SchedWeekType,
} from '@definition/schedules';
import { incomingSpeakersState } from '@states/visiting_speakers';
import { schedulesStampVisitingSpeakers, updateObject } from '@utils/common';
import {
  hallCleaningState,
  congIDState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  JWLangState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import {
  apiPublicScheduleGet,
  apiPublishSchedule,
} from '@services/api/schedule';
import { speakersCongregationsState } from '@states/speakers_congregations';
import { getUserDataView } from '@services/app';

// Cleaning positions of one data view share the same type, and
// updateObject matches array entries by type before id, so it would fold
// every slot into the first remote one: merge them by id here instead
const mergeCleaningAssignments = (
  remote: AssignmentCongregation[] | undefined,
  local: AssignmentCongregation[]
) => {
  const merged = structuredClone(remote ?? []);

  for (const entry of local) {
    const index = merged.findIndex(
      (record) => record.id === entry.id && record.type === entry.type
    );

    if (index === -1) {
      merged.push(entry);
    } else if (entry.updatedAt > merged[index].updatedAt) {
      merged[index] = entry;
    }
  }

  return merged;
};

type ScheduleWithCleaning = {
  hall_cleaning?: SchedWeekType['hall_cleaning'];
};

type HallCleaningLists = Record<string, AssignmentCongregation[] | undefined>;

const HALL_CLEANING_LISTS = [
  ...(['midweek', 'weekend', 'yearly'] as const).flatMap((slot) =>
    ['group', 'persons'].map((field) => ({ slot, field }))
  ),
  { slot: 'yearly' as const, field: 'date' },
];

// applies a local schedule onto its remote copy, keeping the dynamic duty
// slots of both sides instead of letting updateObject collapse them
const mergeScheduleIntoRemote = <T extends { weekOf: string }>(
  remoteItem: T,
  item: T
) => {
  const legacyMidweek = (
    remoteItem as T & { midweek_meeting?: { aux_fsg?: unknown } }
  ).midweek_meeting;
  if (typeof legacyMidweek?.aux_fsg === 'string') delete legacyMidweek.aux_fsg;

  const localItem = structuredClone(item) as T & ScheduleWithCleaning;
  const remoteSchedule = remoteItem as T & ScheduleWithCleaning;

  // hall cleaning keeps a group per data view and publishers per position
  const cleaningMerged = HALL_CLEANING_LISTS.flatMap(({ slot, field }) => {
    const localSlot = localItem.hall_cleaning?.[slot] as
      HallCleaningLists | undefined;
    const local = localSlot?.[field];

    if (!localSlot || !local) return [];

    delete localSlot[field];

    const remoteSlot = remoteSchedule.hall_cleaning?.[slot] as
      HallCleaningLists | undefined;

    return [
      {
        slot,
        field,
        list: mergeCleaningAssignments(remoteSlot?.[field], local),
      },
    ];
  });

  const localEvents = localItem.hall_cleaning?.events;
  const events = new Map(
    (remoteSchedule.hall_cleaning?.events ?? []).map((event) => [
      `${event.type}:${event.id}`,
      event,
    ])
  );
  for (const event of localEvents ?? []) {
    const key = `${event.type}:${event.id}`;
    const previous = events.get(key);
    if (!previous || event.updatedAt >= previous.updatedAt)
      events.set(key, event);
  }
  if (localItem.hall_cleaning) delete localItem.hall_cleaning.events;
  updateObject(remoteItem, localItem);
  if (localEvents && remoteSchedule.hall_cleaning)
    remoteSchedule.hall_cleaning.events = [...events.values()];

  for (const { slot, field, list } of cleaningMerged) {
    remoteSchedule.hall_cleaning = {
      midweek: {},
      weekend: {},
      yearly: {},
      ...remoteSchedule.hall_cleaning,
    };

    remoteSchedule.hall_cleaning[slot] = {
      ...remoteSchedule.hall_cleaning[slot],
      [field]: list,
    };
  }
};

const useSchedulePublish = ({ type, onClose }: SchedulePublishProps) => {
  const { t } = useAppTranslation();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const { data, refetch, isFetching, isError } = useQuery({
    queryKey: ['public_schedules'],
    queryFn: apiPublicScheduleGet,
    refetchOnMount: 'always',
  });

  const sources = useAtomValue(sourcesState);
  const cleaningConfig = useAtomValue(hallCleaningState);
  const schedules = useAtomValue(schedulesState);
  const incomingSpeakers = useAtomValue(incomingSpeakersState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const dataView = useAtomValue(userDataViewState);
  const congregations = useAtomValue(speakersCongregationsState);
  const settings = useAtomValue(settingsState);
  const congID = useAtomValue(congIDState);
  const lang = useAtomValue(JWLangState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const publicationAvailable =
    !isFetching &&
    !isError &&
    data?.status === 200 &&
    Array.isArray(data.schedules) &&
    Array.isArray(data.sources);
  const section = (
    {
      midweek: 'midweek_meeting',
      weekend: 'weekend_meeting',
      cleaning: 'hall_cleaning',
    } as const
  )[type];
  const selectedGaps = schedules
    .filter((week) => checkedItems.includes(week.weekOf.slice(0, 7)))
    .reduce((total, week) => {
      const info = schedulesWeekAssignmentsInfo(week.weekOf, type);
      return total + Math.max(0, info.total - info.assigned);
    }, 0);

  const sourcesList = useMemo(() => {
    const weekDate = getWeekDate();
    const pastDate = addMonths(weekDate, -3);

    let base = sources.filter(
      (record) =>
        isMondayDate(record.weekOf) && new Date(record.weekOf) >= pastDate
    );

    if (type === 'midweek') {
      base = base.filter(
        (record) =>
          record.midweek_meeting.weekly_bible_reading[lang]?.length > 0
      );
    }

    // Cleaning weeks qualify when either meeting exists.
    if (type === 'cleaning') {
      base = base.filter(
        (record) =>
          record.midweek_meeting.weekly_bible_reading[lang]?.length > 0 ||
          record.weekend_meeting.w_study[lang]?.length > 0
      );
    }

    const weeks = base.map((record) => record.weekOf);
    if (type === 'cleaning') {
      weeks.push(
        ...schedules
          .filter(
            (week) =>
              new Date(week.weekOf) >= pastDate &&
              schedulesHallCleaningInfo(week.weekOf, cleaningConfig).assigned >
                0
          )
          .map((week) => week.weekOf),
        ...(data?.schedules ?? [])
          .filter(
            (week) =>
              new Date(week.weekOf) >= pastDate &&
              (week.hall_cleaning?.configuration?.some(
                (entry) => entry.type === dataView
              ) ||
                week.hall_cleaning?.events?.some(
                  (entry) => entry.type === dataView
                ) ||
                ['midweek', 'weekend', 'yearly'].some((slot) => {
                  const cleaning =
                    week.hall_cleaning?.[
                      slot as 'midweek' | 'weekend' | 'yearly'
                    ];
                  return [
                    ...(cleaning?.group ?? []),
                    ...(cleaning?.persons ?? []),
                  ].some((entry) => entry.type === dataView);
                }))
          )
          .map((week) => week.weekOf)
      );
    }
    return [...new Set(weeks)].sort((a, b) => a.localeCompare(b));
  }, [
    sources,
    schedules,
    type,
    lang,
    cleaningConfig,
    data?.schedules,
    dataView,
  ]);

  const baseList = useMemo(() => {
    const groupedData = sourcesList.reduce((acc: YearGroupType[], week) => {
      const [year, month] = week.split('/').slice(0, 2);
      let yearGroup = acc.find((y) => y.year === year);

      if (!yearGroup) {
        yearGroup = { year: year, months: [] };
        acc.push(yearGroup);
      }

      let monthGroup = yearGroup.months.find((m) => m === `${year}/${month}`);

      if (!monthGroup) {
        monthGroup = `${year}/${month}`;
        yearGroup.months.push(monthGroup);
      }

      return acc;
    }, []);

    return groupedData;
  }, [sourcesList]);

  const schedulesList = useMemo(() => {
    const project = (
      month: string,
      weeks: SchedWeekType[],
      material: SourceWeekType[],
      local: boolean
    ) =>
      projectScheduleMonth(
        weeks.filter((week) => sourcesList.includes(week.weekOf)),
        material,
        month,
        section,
        local && type === 'cleaning'
          ? schedulesHallCleaningForPublish
          : undefined
      );

    const monthStatus = (month: string) => {
      const remote = project(
        month,
        data?.schedules ?? [],
        data?.sources ?? [],
        false
      );
      return schedulePublicationState(
        project(month, schedules, sources, true),
        remote.length ? remote : undefined,
        dataView,
        publicationAvailable
      );
    };

    const result: ScheduleListType[] = baseList.map((record) => {
      return {
        year: record.year,
        months: record.months.map((month) => {
          return {
            month,
            checked: checkedItems.includes(month),
            status: monthStatus(month),
          };
        }),
      };
    });

    return result;
  }, [
    baseList,
    checkedItems,
    schedules,
    sources,
    data,
    dataView,
    publicationAvailable,
    section,
    type,
    sourcesList,
  ]);

  const handleCheckedChange = (checked: boolean, value: string) => {
    if (isProcessing) return;

    if (checked) {
      setCheckedItems((prev) => {
        const items = structuredClone(prev);

        if (!value.includes('/')) {
          const data = items.filter((record) => !record.includes(value));

          const months =
            baseList.find((record) => record.year === value)?.months ?? [];

          data.push(...months);

          return data;
        }

        items.push(value);

        return items;
      });
    }

    if (!checked) {
      setCheckedItems((prev) => {
        const items = structuredClone(prev);

        const data = items.filter((record) => !record.includes(value));
        return data;
      });
    }
  };

  const filterArraysByDataView = <T extends object>(
    obj: T,
    parentKey?: string
  ): T => {
    if (Array.isArray(obj)) {
      // Skip filtering if the parent key is "outgoing_talks"
      if (parentKey === 'outgoing_talks') {
        return obj;
      }

      return obj
        .filter(
          (item) =>
            !item ||
            typeof item !== 'object' ||
            !('type' in item) ||
            item.type === dataView
        )
        .map((item) => filterArraysByDataView(item)) as T;
    } else if (typeof obj === 'object' && obj !== null) {
      const result = {} as T;

      for (const key in obj) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[key] = filterArraysByDataView(obj[key] as any, key);
      }

      return result;
    }

    return obj;
  };

  const handleGetMaterials = <T extends SchedWeekType | SourceWeekType>(
    data: T[],
    months: string[],
    keysToDelete: string[]
  ): T[] => {
    const result: T[] = [];

    for (const month of months) {
      const monthSources = data.filter((record) =>
        record.weekOf.includes(month)
      );

      result.push(...monthSources);
    }

    const finalData = result.map((record) => {
      const item = filterArraysByDataView(record);

      for (const key of keysToDelete) {
        delete item[key as keyof T];
      }

      return item;
    });

    return finalData;
  };

  const handleUpdateSchedules = (
    schedules: SchedWeekType[],
    published: SchedWeekType[]
  ) => {
    // only weekend resolves visiting-speaker display names
    if (type !== 'weekend') return schedules;

    return schedulesStampVisitingSpeakers({
      schedules: structuredClone(schedules),
      speakers: incomingSpeakers,
      congregations,
      displayNameEnabled,
      fullnameOption,
      published,
    });
  };

  const handleUpdateMaterialsFromRemote = <T extends { weekOf: string }>(
    local: T[],
    remote: T[]
  ) => {
    const now = getWeekDate();
    const lastDate = formatDate(addMonths(now, -3), 'yyyy/MM/dd');

    const filteredData = remote.filter((record) => record.weekOf >= lastDate);

    for (const item of local) {
      const remoteItem = filteredData.find(
        (record) => record.weekOf === item.weekOf
      );

      if (remoteItem) {
        mergeScheduleIntoRemote(remoteItem, item);
      } else {
        filteredData.push(item);
      }
    }

    return filteredData;
  };

  const handleGetIncomingTalks = (schedules: SchedWeekType[]) => {
    const talks: OutgoingTalkExportScheduleType[] = [];

    const outgoingTalks = schedules.filter((record) => {
      if (!record.weekend_meeting) return false;

      return (
        record.weekend_meeting.public_talk_type.find(
          (item) => item.type === dataView
        )?.value === 'visitingSpeaker'
      );
    });

    for (const schedule of outgoingTalks) {
      const assigned = schedule.weekend_meeting?.speaker.part_1.find(
        (record) => record.type === dataView
      );

      const speaker = incomingSpeakers.find(
        (record) => record.person_uid === assigned?.value
      );

      const congregation = congregations.find(
        (record) => record.id === speaker?.speaker_data.cong_id
      );

      if (congregation?.cong_data.cong_id && assigned) {
        const source = sources.find(
          (record) => record.weekOf === schedule.weekOf
        );

        const meeting = settings.cong_settings.weekend_meeting.find(
          (record) => record.type === dataView
        );
        if (!source || !meeting) continue;
        const openingSong = getUserDataView(
          source.weekend_meeting.song_first,
          dataView
        );
        const publicTalk = getUserDataView(
          source.weekend_meeting.public_talk,
          dataView
        );
        if (!openingSong || !publicTalk) continue;

        const obj = {} as OutgoingTalkExportScheduleType;

        obj.weekOf = schedule.weekOf;
        obj.sender = congID;
        obj.recipient = congregation.cong_data.cong_id;
        obj._deleted = false;
        obj.id = assigned.value;
        obj.opening_song = openingSong.value;
        obj.public_talk = publicTalk.value as number;
        obj.synced = true;
        obj.value = assigned.value;
        obj.updatedAt = assigned.updatedAt;
        obj.congregation = {
          address: settings.cong_settings.cong_location.address,
          country: settings.cong_settings.country_code,
          name: settings.cong_settings.cong_name,
          number: settings.cong_settings.cong_number.value,
          weekday: meeting.weekday.value,
          time: meeting.time.value,
        };

        talks.push(obj);
      }
    }

    return talks;
  };

  const handleFilterOutgoingTalks = (schedules: SchedWeekType[]) => {
    const weekend = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    const publish = weekend?.outgoing_talks_schedule_public.value ?? false;

    const result = schedules.map((schedule) => {
      if (!publish && schedule.weekend_meeting) {
        const meeting: Partial<SchedWeekType['weekend_meeting']> =
          schedule.weekend_meeting;
        delete meeting.outgoing_talks;
      }

      return schedule;
    });

    return result;
  };

  const handlePublishSchedule = async () => {
    if (
      checkedItems.length === 0 ||
      isProcessing ||
      !publicationAvailable ||
      !reviewing
    )
      return;

    try {
      setIsProcessing(true);

      const months = checkedItems.toSorted();

      // Each publish carries its own sections and the sources needed for dates.
      const scheduleKeysToDelete = {
        midweek: ['weekend_meeting', 'hall_cleaning'],
        weekend: ['midweek_meeting', 'hall_cleaning'],
        cleaning: ['midweek_meeting', 'weekend_meeting'],
      }[type];

      const sourceKeysToDelete = {
        midweek: ['weekend_meeting'],
        weekend: ['midweek_meeting'],
        cleaning: [],
      }[type];

      const sourcesLocalPublish = handleGetMaterials(
        sources,
        months,
        sourceKeysToDelete
      );
      // groups from the turns are worked out, not stored: publish them, from
      // the full weeks, since working them out needs the meetings
      const schedulesLocalPublish = handleGetMaterials(
        type === 'cleaning'
          ? schedules.map((week) => schedulesHallCleaningForPublish(week))
          : schedules,
        months,
        scheduleKeysToDelete
      );

      const refreshed = await refetch();
      const data = refreshed.data;
      if (
        refreshed.error ||
        data?.status !== 200 ||
        !Array.isArray(data.schedules) ||
        !Array.isArray(data.sources)
      ) {
        throw new Error('error_app_generic-desc');
      }

      if (Array.isArray(data?.schedules) && Array.isArray(data?.sources)) {
        const sourcesRemote = structuredClone(data.sources);
        const schedulesRemote = structuredClone(data.schedules);

        // clone before the merge below: it mutates the matched remote records
        const schedulesPublished = structuredClone(schedulesRemote);

        const sourcesPublish = handleUpdateMaterialsFromRemote(
          sourcesLocalPublish,
          sourcesRemote
        );

        const schedulesBasePublish = handleUpdateMaterialsFromRemote(
          schedulesLocalPublish,
          schedulesRemote
        );

        const schedulesPrePublish = handleUpdateSchedules(
          schedulesBasePublish,
          schedulesPublished
        );
        let schedulesPublish = schedulesPrePublish;

        let talksPublish: OutgoingTalkExportScheduleType[] | undefined;

        if (isPublicTalkCoordinator && type === 'weekend') {
          schedulesPublish = handleFilterOutgoingTalks(schedulesPrePublish);
          talksPublish = handleGetIncomingTalks(schedulesPublish);
        }

        const { status, message } = await apiPublishSchedule(
          sourcesPublish,
          schedulesPublish,
          talksPublish
        );

        if (status !== 200) {
          throw new Error(message);
        }

        displaySnackNotification({
          header: t('tr_successfullyPublished'),
          message: t('tr_successfullyPublishedDesc'),
          severity: 'success',
        });

        await refetch();
        setIsProcessing(false);
        onClose?.();
      }
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : 'error_app_generic-desc'
        ),
        severity: 'error',
      });
    }
  };

  return {
    schedulesList,
    handleCheckedChange,
    handlePublishSchedule,
    isProcessing,
    reviewing,
    setReviewing,
    selectedGaps,
    canPublish:
      publicationAvailable && checkedItems.length > 0 && !isProcessing,
    publicationAvailable,
  };
};

export default useSchedulePublish;
