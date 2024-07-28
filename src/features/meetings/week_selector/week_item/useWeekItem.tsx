import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { monthNamesState } from '@states/app';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { useAppTranslation } from '@hooks/index';
import { schedulesWeekAssignmentsInfo } from '@services/app/schedules';

const useWeekItem = (week: string) => {
  const location = useLocation();

  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useRecoilState(selectedWeekState);
  const schedules = useRecoilValue(schedulesState);

  const monthNames = useRecoilValue(monthNamesState);

  const [total, setTotal] = useState(0);
  const [assigned, setAssigned] = useState(0);

  const schedule = schedules.find((record) => record.weekOf === week);

  const weekDate = new Date(week);
  const month = weekDate.getMonth();
  const date = weekDate.getDate();

  const meeting =
    location.pathname === '/midweek-meeting' ? 'midweek' : 'weekend';

  const monthName = monthNames[month];

  const weekDateLocale = t('tr_longDateNoYearLocale', {
    date,
    month: monthName,
  });

  const handleSelectWeek = (value: string) => setSelectedWeek(value);

  const isSelected = week === selectedWeek;

  useEffect(() => {
    const loadWeekDetails = async () => {
      const { total, assigned } = await schedulesWeekAssignmentsInfo(
        schedule.weekOf,
        meeting
      );

      setTotal(total);
      setAssigned(assigned);
    };

    if (schedule) {
      loadWeekDetails();
    }
  }, [schedule, meeting]);

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
