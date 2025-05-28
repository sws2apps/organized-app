import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';
import { sourcesFormattedState, sourcesState } from '@states/sources';
import {
  JWLangLocaleState,
  JWLangState,
  meetingExactDateState,
  midweekMeetingClassCountState,
  midweekMeetingClosingPrayerLinkedState,
  midweekMeetingOpeningPrayerLinkedState,
  midweekMeetingWeekdayState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { addDays } from '@utils/date';

const useMidweekEditor = () => {
  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const weeksSource = useAtomValue(sourcesFormattedState);
  const monthNames = useAtomValue(monthNamesState);
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const schedules = useAtomValue(schedulesState);
  const sourceLocale = useAtomValue(JWLangLocaleState);
  const openingPrayerLinked = useAtomValue(
    midweekMeetingOpeningPrayerLinkedState
  );
  const closingPrayerLinked = useAtomValue(
    midweekMeetingClosingPrayerLinkedState
  );
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const settings = useAtomValue(settingsState);

  const [isEdit, setIsEdit] = useState(false);

  const [openTGW, setOpenTGW] = useState(true);
  const [openAYF, setOpenAYF] = useState(true);
  const [openLC, setOpenLC] = useState(true);
  const [clearAll, setClearAll] = useState(false);
  const [showWeekArrows, setShowWeeksArrows] = useState({
    back: false,
    next: false,
  });

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [sources, selectedWeek]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [schedules, selectedWeek]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView]);

  const hasSource = useMemo(() => {
    if (!source) return false;

    const weekDate = source.midweek_meeting.week_date_locale[lang];

    return weekDate ? true : false;
  }, [source, lang]);

  const showDoublePerson = useMemo(() => {
    return classCount === 2 && weekType !== Week.CO_VISIT;
  }, [classCount, weekType]);

  const assignFSG = useMemo(() => {
    if (!showDoublePerson) return false;

    return settings.cong_settings.aux_class_fsg?.value ?? false;
  }, [showDoublePerson, settings]);

  const weekDateLocale = useMemo(() => {
    if (selectedWeek.length === 0) return '';

    const toAdd = meetingExactDate ? midweekDay - 1 : 0;
    const weekDate = addDays(selectedWeek, toAdd);
    const month = weekDate.getMonth();
    const date = weekDate.getDate();

    const monthName = monthNames[month];

    const weekDateLocale = t('tr_longDateNoYearLocale', {
      date,
      month: monthName,
    });

    return weekDateLocale;
  }, [selectedWeek, meetingExactDate, midweekDay, monthNames, t]);

  const isGroup = useMemo(() => dataView !== 'main', [dataView]);

  const mainWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type === 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const showCBSForGroup = useMemo(() => {
    if (!isGroup) return true;

    return mainWeekType !== Week.CO_VISIT;
  }, [isGroup, mainWeekType]);

  const handleEditAssignments = () => setIsEdit(false);

  const handleEditParts = () => setIsEdit(true);

  const handleToggleTGW = () => setOpenTGW((prev) => !prev);

  const handleToggleAYF = () => setOpenAYF((prev) => !prev);

  const handleToggleLC = () => setOpenLC((prev) => !prev);

  const handleOpenClearAll = () => setClearAll(true);

  const handleCloseClearAll = () => setClearAll(false);

  const getAllWeeks = useCallback(() => {
    return weeksSource
      .flatMap((year) => year.months.flatMap((month) => month.weeks))
      .sort();
  }, [weeksSource]);

  const handleChangeWeekBack = () => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex > 0) {
      setSelectedWeek(allWeeks[selectedWeekIndex - 1]);
    }
  };

  const handleChangeWeekNext = () => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex < allWeeks.length - 1) {
      setSelectedWeek(allWeeks[selectedWeekIndex + 1]);
    }
  };

  useEffect(() => {
    const allWeeks = getAllWeeks();
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex !== -1) {
      setShowWeeksArrows({
        back: selectedWeekIndex !== 0,
        next: selectedWeekIndex + 1 !== allWeeks.length,
      });
    }
  }, [getAllWeeks, selectedWeek]);

  return {
    isEdit,
    handleEditAssignments,
    handleEditParts,
    weekDateLocale,
    selectedWeek,
    hasSource,
    showDoublePerson,
    weekType,
    handleToggleTGW,
    handleToggleAYF,
    handleToggleLC,
    openTGW,
    openAYF,
    openLC,
    clearAll,
    handleOpenClearAll,
    handleCloseClearAll,
    openingPrayerLinked,
    closingPrayerLinked,
    sourceLocale,
    handleChangeWeekBack,
    handleChangeWeekNext,
    showWeekArrows,
    assignFSG,
    showCBSForGroup,
  };
};

export default useMidweekEditor;
