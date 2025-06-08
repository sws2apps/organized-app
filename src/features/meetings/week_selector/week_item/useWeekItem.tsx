import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { Week } from '@definition/week_type';
import { MeetingType } from '@definition/app';
import { formatMediumDateWithFullMonth } from '@utils/date';
import { schedulesState, selectedWeekState } from '@states/schedules';
import {
  schedulesGetMeetingDate,
  schedulesWeekAssignmentsInfo,
} from '@services/app/schedules';
import {
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
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

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const meeting: MeetingType = useMemo(() => {
    if (location.pathname === '/meeting-duties') return 'duties';

    return location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';
  }, [location.pathname]);

  const isSelected = useMemo(() => {
    return week === selectedWeek;
  }, [week, selectedWeek]);

  const weekType = useMemo(() => {
    if (!schedule || meeting === 'duties') return Week.NORMAL;

    const field = schedule[`${meeting}_meeting`]
      .week_type as WeekTypeCongregation[];

    return (
      field.find((record) => record.type === dataView)?.value ?? Week.NORMAL
    );
  }, [schedule, dataView, meeting]);

  const weekDateLocale = useMemo(() => {
    if (meeting === 'duties') {
      return formatMediumDateWithFullMonth(week);
    }

    const meetingDate = schedulesGetMeetingDate({ week, meeting });

    return meetingDate.locale;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, meeting, weekType]);

  const { assigned, total } = useMemo(() => {
    const values = { assigned: 0, total: 0 };

    if (!schedule) return values;

    const data = schedulesWeekAssignmentsInfo(schedule.weekOf, meeting);

    values.assigned = data.assigned;
    values.total = data.total;

    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, meeting, prayerAutoAssign]);

  const handleSelectWeek = (value: string) => {
    setSelectedWeek(value);
  };

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
