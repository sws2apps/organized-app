import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { addMonths, getWeekDate } from '@utils/date';
import { sourcesState } from '@states/sources';
import {
  ScheduleListType,
  SchedulePublishProps,
  YearGroupType,
} from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import { SourceWeekType } from '@definition/sources';
import { schedulesState } from '@states/schedules';
import { SchedWeekType } from '@definition/schedules';
import { incomingSpeakersState } from '@states/visiting_speakers';
import { speakerGetDisplayName } from '@utils/common';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';

const useSchedulePublish = ({ type, onClose }: SchedulePublishProps) => {
  const { t } = useAppTranslation();

  const sources = useRecoilValue(sourcesState);
  const schedules = useRecoilValue(schedulesState);
  const incomingSpeakers = useRecoilValue(incomingSpeakersState);
  const displayNameEnabled = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [publishedItems, setPublishedItems] = useState<string[]>([]);

  const sourcesList = useMemo(() => {
    const weekDate = getWeekDate();
    const pastDate = addMonths(weekDate, -3);

    let base = sources.filter((record) => new Date(record.weekOf) >= pastDate);

    if (type === 'midweek') {
      base = base.filter(
        (record) => record.midweek_meeting.weekly_bible_reading['E']?.length > 0
      );
    }

    return base.map((record) => record.weekOf);
  }, [sources, type]);

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

    return result;
  };

  const handleUpdateSchedules = (schedules: SchedWeekType[]) => {
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

  const handlePublishSchedule = async () => {
    if (checkedItems.length === 0 || isProcessing) return;

    try {
      setIsProcessing(true);

      const months = checkedItems.toSorted();

      const sourcesPublish = handleGetMaterials(sources, months);
      const schedulesBasePublish = handleGetMaterials(schedules, months);
      const schedulesPublish = handleUpdateSchedules(schedulesBasePublish);

      console.log({ sources: sourcesPublish, schedules: schedulesPublish });

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    // fetch published schedules from server
    setPublishedItems(['2024/05', '2024/11']);
  }, []);

  return { schedulesList, handleCheckedChange, handlePublishSchedule };
};

export default useSchedulePublish;
