import { AssignmentCode } from '@definition/assignment';
import useAppTranslation from '@hooks/useAppTranslation';
import { monthNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import {
  midweekMeetingClassCountState,
  midweekMeetingClosingPrayerAutoAssign,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import { sourcesFormattedState, sourcesState } from '@states/sources';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

const useMonthlyView = () => {
  const { t } = useAppTranslation();

  const sources = useRecoilValue(sourcesFormattedState);
  const monthsNames = useRecoilValue(monthNamesState);
  const dataView = useRecoilValue(userDataViewState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const schedules = useRecoilValue(schedulesState);
  // const lang = useRecoilValue(JWLangState);
  const sourceWeeks = useRecoilValue(sourcesState);
  const openingPrayerAuto = useRecoilValue(
    midweekMeetingOpeningPrayerAutoAssign
  );
  const closingPrayerAuto = useRecoilValue(
    midweekMeetingClosingPrayerAutoAssign
  );

  const [openTGW, setOpenTGW] = useState(true);
  const [openAYF, setOpenAYF] = useState(true);
  const [openLC, setOpenLC] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const getWeekLocale = (date, monthName) => {
    return t('tr_longDateNoYearLocale', {
      date,
      month: monthName,
    });
  };

  const currentYear = new Date().getFullYear().toString();

  const getWeeksByMonthAndYear = (year: number, month: number) => {
    let weeks = [];
    sources.forEach((srcYear) => {
      if (srcYear.value == year) {
        weeks = srcYear.months[month].weeks;
      }
    });

    return weeks;
  };

  const hasWeeks = sources.length > 0;

  const handleToggleTGW = () => setOpenTGW((prev) => !prev);

  const handleToggleAYF = () => setOpenAYF((prev) => !prev);

  const handleToggleLC = () => setOpenLC((prev) => !prev);

  const loadWeekTypeByWeekDate = (week: string) => {
    // const weekSource = sourceWeeks.find((record) => record.weekOf === week);
    const schedule = schedules.find((record) => record.weekOf === week);

    // const weekDate = weekSource.midweek_meeting.week_date_locale[lang];

    const weekType = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return weekType.value;
  };

  return {
    currentYear,
    hasWeeks,
    monthsNames,
    getWeekLocale,
    selectedMonth,
    setSelectedMonth,
    getWeeksByMonthAndYear,
    openingPrayerAuto,
    closingPrayerAuto,
    openTGW,
    openAYF,
    openLC,
    handleToggleTGW,
    handleToggleLC,
    handleToggleAYF,
    classCount,
    sourceWeeks,
    loadWeekTypeByWeekDate,
  };
};

export default useMonthlyView;
