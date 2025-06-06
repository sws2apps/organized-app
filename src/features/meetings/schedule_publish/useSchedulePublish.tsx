import { useEffect, useMemo, useState } from 'react';
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
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { SourceWeekType } from '@definition/sources';
import { schedulesState } from '@states/schedules';
import {
  OutgoingTalkExportScheduleType,
  SchedWeekType,
} from '@definition/schedules';
import { incomingSpeakersState } from '@states/visiting_speakers';
import { speakerGetDisplayName, updateObject } from '@utils/common';
import {
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
import { congIDState } from '@states/app';

const useSchedulePublish = ({ type, onClose }: SchedulePublishProps) => {
  const { t } = useAppTranslation();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const { data, refetch } = useQuery({
    queryKey: ['public_schedules'],
    queryFn: apiPublicScheduleGet,
    refetchOnMount: 'always',
  });

  const sources = useAtomValue(sourcesState);
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
  const [publishedItems, setPublishedItems] = useState<string[]>([]);

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

    return base.map((record) => record.weekOf);
  }, [sources, type, lang]);

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
    const result: ScheduleListType[] = baseList.map((record) => {
      return {
        year: record.year,
        months: record.months.map((month) => {
          return {
            month,
            checked: checkedItems.includes(month),
            published: publishedItems.includes(month),
          };
        }),
      };
    });

    return result;
  }, [baseList, checkedItems, publishedItems]);

  const handleCheckedChange = (checked: boolean, value: string) => {
    if (isProcessing) return;

    if (checked) {
      setCheckedItems((prev) => {
        const items = structuredClone(prev);

        if (!value.includes('/')) {
          const data = items.filter((record) => !record.includes(value));

          const months = baseList.find(
            (record) => record.year === value
          ).months;

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
        .filter((item) => typeof item === 'object' && item !== null)
        .filter((item) => !('type' in item) || item.type === dataView)
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
    months: string[]
  ): T[] => {
    const result: T[] = [];

    for (const month of months) {
      const monthSources = data.filter((record) =>
        record.weekOf.includes(month)
      );

      result.push(...monthSources);
    }

    const sectionToDelete =
      type === 'midweek' ? 'weekend_meeting' : 'midweek_meeting';

    const finalData = result.map((record) => {
      const item = filterArraysByDataView(record);
      delete item[sectionToDelete];

      return item;
    });

    return finalData;
  };

  const handleUpdateSchedules = (schedules: SchedWeekType[]) => {
    if (type === 'midweek') return schedules;

    const newSchedules = structuredClone(schedules);

    return newSchedules.map((schedule) => {
      for (const speakerSchedule of schedule.weekend_meeting.speaker.part_1) {
        const talkType = schedule.weekend_meeting.public_talk_type.find(
          (record) => record.type
        )?.value;

        if (speakerSchedule.value.length > 0) {
          if (talkType === 'visitingSpeaker') {
            const speaker = incomingSpeakers.find(
              (record) => record.person_uid === speakerSchedule.value
            );
            speakerSchedule.name = !speaker
              ? ''
              : speakerGetDisplayName(
                  speaker,
                  displayNameEnabled,
                  fullnameOption
                );
          }
        }
      }

      return schedule;
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

      if (!remoteItem) {
        filteredData.push(item);
      }

      if (remoteItem) {
        if (
          remoteItem['midweek_meeting']?.['aux_fsg'] &&
          typeof remoteItem['midweek_meeting']['aux_fsg'] === 'string'
        ) {
          delete remoteItem['midweek_meeting']['aux_fsg'];
        }

        updateObject(remoteItem, item);
      }
    }

    return filteredData;
  };

  const handleGetIncomingTalks = (schedules: SchedWeekType[]) => {
    const talks: OutgoingTalkExportScheduleType[] = [];

    const outgoingTalks = schedules.filter(
      (record) =>
        record.weekend_meeting.public_talk_type.find(
          (item) => item.type === dataView
        )?.value === 'visitingSpeaker'
    );

    for (const schedule of outgoingTalks) {
      const assigned = schedule.weekend_meeting.speaker.part_1.find(
        (record) => record.type === dataView
      );
      const speaker = incomingSpeakers.find(
        (record) => record.person_uid === assigned?.value
      );
      const congregation = congregations.find(
        (record) => record.id === speaker?.speaker_data.cong_id
      );

      if (congregation?.cong_data.cong_id.length > 0) {
        const source = sources.find(
          (record) => record.weekOf === schedule.weekOf
        );

        const obj = {} as OutgoingTalkExportScheduleType;

        obj.weekOf = schedule.weekOf;
        obj.sender = congID;
        obj.recipient = congregation.cong_data.cong_id;
        obj._deleted = false;
        obj.id = assigned.value;
        obj.opening_song = getUserDataView(
          source.weekend_meeting.song_first,
          dataView
        ).value;
        obj.public_talk = getUserDataView(
          source.weekend_meeting.public_talk,
          dataView
        ).value as number;
        obj.synced = true;
        obj.value = assigned.value;
        obj.updatedAt = assigned.updatedAt;
        obj.congregation = {
          address: settings.cong_settings.cong_location.address,
          country: settings.cong_settings.country_code,
          name: settings.cong_settings.cong_name,
          number: settings.cong_settings.cong_number,
          weekday: getUserDataView(
            settings.cong_settings.weekend_meeting,
            dataView
          ).weekday.value,
          time: getUserDataView(
            settings.cong_settings.weekend_meeting,
            dataView
          ).time.value,
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

    const publish = weekend.outgoing_talks_schedule_public.value;

    const result = schedules.map((schedule) => {
      if (!publish) delete schedule.weekend_meeting.outgoing_talks;

      return schedule;
    });

    return result;
  };

  const handlePublishSchedule = async () => {
    if (checkedItems.length === 0 || isProcessing) return;

    try {
      setIsProcessing(true);

      const months = checkedItems.toSorted();

      const sourcesLocalPublish = handleGetMaterials(sources, months);
      const schedulesLocalPublish = handleGetMaterials(schedules, months);

      const { data } = await refetch();

      if (Array.isArray(data?.schedules) && Array.isArray(data?.sources)) {
        const sourcesRemote = data.sources;
        const schedulesRemote = data.schedules;

        const sourcesPublish = handleUpdateMaterialsFromRemote(
          sourcesLocalPublish,
          sourcesRemote
        );

        const schedulesBasePublish = handleUpdateMaterialsFromRemote(
          schedulesLocalPublish,
          schedulesRemote
        );

        const schedulesPrePublish = handleUpdateSchedules(schedulesBasePublish);
        let schedulesPublish = schedulesPrePublish;

        let talksPublish: OutgoingTalkExportScheduleType[] = undefined;

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

        setIsProcessing(false);
        onClose?.();
      }
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (Array.isArray(data?.schedules) && Array.isArray(data?.sources)) {
      const published = data.schedules.reduce((acc: string[], { weekOf }) => {
        const month = weekOf.slice(0, 7);
        if (!acc.includes(month)) {
          acc.push(month);
        }
        return acc;
      }, []);

      setPublishedItems(published);
    }
  }, [data]);

  return {
    schedulesList,
    handleCheckedChange,
    handlePublishSchedule,
    isProcessing,
  };
};

export default useSchedulePublish;
