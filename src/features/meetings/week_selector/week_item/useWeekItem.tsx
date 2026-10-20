import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { Week } from '@definition/week_type';
import { ScheduleMeetingType } from '@definition/app';
import { formatDate, formatMediumDateWithFullMonth } from '@utils/date';
import { schedulesState, selectedWeekState } from '@states/schedules';
import {
  schedulesGetMeetingDate,
  schedulesWeekAssignmentsInfo,
} from '@services/app/schedules';
import {
  hallCleaningState,
  meetingDutiesState,
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
  shortDateFormatState,
} from '@states/settings';
import { WeekTypeCongregation } from '@definition/schedules';

const useWeekItem = (week: string) => {
  const location = useLocation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const prayerAutoAssign = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const dutiesConfig = useAtomValue(meetingDutiesState);
  const hallCleaningConfig = useAtomValue(hallCleaningState);
  const shortDateFormat = useAtomValue(shortDateFormatState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const meeting: ScheduleMeetingType = useMemo(() => {
    if (location.pathname === '/meeting-duties') return 'duties';

    if (location.pathname === '/activities/hall-cleaning') return 'cleaning';

    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const isSelected = useMemo(() => {
    return week === selectedWeek;
  }, [week, selectedWeek]);

  const weekType = useMemo(() => {
    if (!schedule || meeting === 'duties' || meeting === 'cleaning') {
      return Week.NORMAL;
    }

    const field = schedule[`${meeting}_meeting`]
      .week_type as WeekTypeCongregation[];

    return (
      field.find((record) => record.type === dataView)?.value ?? Week.NORMAL
    );
  }, [schedule, dataView, meeting]);

  const weekDateLocale = useMemo(() => {
    if (meeting === 'duties' || meeting === 'cleaning') {
      return formatMediumDateWithFullMonth(week);
    }

    const meetingDate = schedulesGetMeetingDate({ week, meeting });

    if (!meetingDate.date) return meetingDate.locale;

    return formatDate(new Date(meetingDate.date), shortDateFormat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, meeting, weekType, shortDateFormat]);

  const { assigned, total } = useMemo(() => {
    const values = { assigned: 0, total: 0 };

    if (!schedule) return values;

    const data = schedulesWeekAssignmentsInfo(schedule.weekOf, meeting);

    values.assigned = data.assigned;
    values.total = data.total;

    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, meeting, prayerAutoAssign, dutiesConfig, hallCleaningConfig]);

  const handleSelectWeek = (value: string) => {
    setSelectedWeek(value);
  };

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
