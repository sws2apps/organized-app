import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { weekTypeLocaleState } from '@states/weekType';
import { schedulesState } from '@states/schedules';
import { Week } from '@definition/week_type';
import { userDataViewState } from '@states/settings';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { WeekTypeSelectorType } from './index.types';
import { SchedWeekType, WeekTypeCongregation } from '@definition/schedules';
import { UpdateSpec } from 'dexie';

const useWeekTypeSelector = ({ meeting, week }: WeekTypeSelectorType) => {
  const weekTypeOptions = useAtomValue(weekTypeLocaleState);
  const schedules = useAtomValue(schedulesState);
  const userDataView = useAtomValue(userDataViewState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const options = useMemo(() => {
    return weekTypeOptions.filter((record) => {
      if (!record.meeting.includes(meeting)) return false;

      if (record.language_group) return false;

      if (userDataView !== 'main' && record.id === Week.CO_VISIT) return false;

      return true;
    });
  }, [weekTypeOptions, meeting, userDataView]);

  const options_partial = useMemo(() => {
    return weekTypeOptions.filter(
      (record) => record.meeting.includes(meeting) && record.language_group
    );
  }, [weekTypeOptions, meeting]);

  const weekTypeInitial = useMemo(() => {
    if (week.length === 0) return Week.NORMAL;

    // check if no meeting and exit out early
    if (meeting === 'midweek') {
      const weekType =
        schedule.midweek_meeting.week_type.find(
          (record) => record.type === userDataView
        )?.value ?? Week.NORMAL;

      return weekType;
    }

    if (meeting === 'weekend') {
      const weekType =
        schedule.weekend_meeting.week_type.find(
          (record) => record.type === userDataView
        )?.value ?? Week.NORMAL;

      return weekType;
    }

    return Week.NORMAL;
  }, [meeting, schedule, userDataView, week]);

  const [weekType, setWeekType] = useState(weekTypeInitial);

  const handleWeekTypeChange = async (value: Week) => {
    setWeekType(value);

    const meetingType: WeekTypeCongregation[] = structuredClone(
      schedule[`${meeting}_meeting`].week_type
    );

    const weekTypeRecord = meetingType.find(
      (record) => record.type === userDataView
    );

    if (weekTypeRecord) {
      weekTypeRecord.value = value;
      weekTypeRecord.updatedAt = new Date().toISOString();
    } else {
      meetingType.push({
        type: userDataView,
        value: value,
        updatedAt: new Date().toISOString(),
      });
    }

    const field = `${meeting}_meeting.week_type`;

    const data = {
      [field]: meetingType,
    } as unknown as UpdateSpec<SchedWeekType>;

    await dbSchedUpdate(week, data);

    if (
      value === Week.ASSEMBLY ||
      value === Week.CONVENTION ||
      value === Week.CO_VISIT
    ) {
      const otherMeeting =
        meeting === 'midweek' ? 'weekend_meeting' : 'midweek_meeting';

      const meetingType: WeekTypeCongregation[] = structuredClone(
        schedule[otherMeeting].week_type
      );

      const weekTypeRecord = meetingType.find(
        (record) => record.type === userDataView
      );

      if (weekTypeRecord) {
        weekTypeRecord.value = value;
        weekTypeRecord.updatedAt = new Date().toISOString();
      } else {
        meetingType.push({
          type: userDataView,
          value: value,
          updatedAt: new Date().toISOString(),
        });
      }

      const field = `${otherMeeting}.week_type`;

      const data = {
        [field]: meetingType,
      } as unknown as UpdateSpec<SchedWeekType>;

      await dbSchedUpdate(week, data);
    }
  };

  useEffect(() => {
    setWeekType(weekTypeInitial);
  }, [weekTypeInitial]);

  return { options, weekType, handleWeekTypeChange, options_partial };
};

export default useWeekTypeSelector;
