import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { addMonths, formatDate, getWeekDate } from '@utils/date';
import { JWLangState, userDataViewState } from '@states/settings';
import { ASSIGNMENT_PATH } from '@constants/index';
import { schedulesGetData } from '@services/app/schedules';
import { AssignmentCongregation } from '@definition/schedules';
import { monthShortNamesState } from '@states/app';
import { sourcesState } from '@states/sources';

const useMidweekContainer = () => {
  const currentWeekVisible = useIntersectionObserver({
    root: '.schedules-view-week-selector .MuiTabs-scroller',
    selector: '.schedules-current-week',
  });

  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const monthNames = useAtomValue(monthShortNamesState);
  const lang = useAtomValue(JWLangState);

  const [value, setValue] = useState<number | boolean>(false);

  const noSchedule = useMemo(() => {
    if (schedules.length === 0) return true;

    let noMeeting = true;

    for (const schedule of schedules) {
      if (schedule.midweek_meeting) {
        noMeeting = false;
        break;
      }
    }

    return noMeeting;
  }, [schedules]);

  const filteredSources = useMemo(() => {
    const minDate = formatDate(addMonths(new Date(), -2), 'yyyy/MM/dd');

    return sources.filter(
      (record) =>
        record.weekOf >= minDate &&
        record.midweek_meeting?.week_date_locale[lang]?.length > 0
    );
  }, [sources, lang]);

  const week = useMemo(() => {
    if (typeof value === 'boolean') return null;

    return filteredSources.at(value)?.weekOf || null;
  }, [value, filteredSources]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const scheduleLastUpdated = useMemo(() => {
    if (!schedule || noSchedule) return;

    const assignments = Object.entries(ASSIGNMENT_PATH);
    const midweekAssignments = assignments.filter(
      (record) =>
        record[0].includes('MM_') && record[0] !== 'MM_CircuitOverseer'
    );

    const dates: string[] = [];
    for (const [, path] of midweekAssignments) {
      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      if (assigned?.updatedAt.length > 0) {
        dates.push(assigned.updatedAt);
      }
    }

    const recentDate = dates.sort((a, b) => b.localeCompare(a)).at(0);
    if (!recentDate) return;

    const d = new Date(recentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const monthName = monthNames[month];

    const dateFormatted = t('tr_longDateWithYearLocale', {
      year,
      month: monthName,
      date,
    });

    return dateFormatted;
  }, [schedule, dataView, monthNames, t, noSchedule]);

  const handleGoCurrent = () => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    const index = filteredSources.findIndex(
      (record) => record.weekOf === weekOf
    );

    setValue(index);
  };

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  return {
    value,
    handleGoCurrent,
    handleValueChange,
    week,
    currentWeekVisible,
    scheduleLastUpdated,
    noSchedule,
    dataView,
  };
};

export default useMidweekContainer;
