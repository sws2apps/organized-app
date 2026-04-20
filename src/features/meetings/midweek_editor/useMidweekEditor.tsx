import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP } from '@constants/index';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { sourcesFormattedState, sourcesState } from '@states/sources';
import {
  JWLangLocaleState,
  JWLangState,
  midweekMeetingClassCountState,
  midweekMeetingClosingPrayerLinkedState,
  midweekMeetingOpeningPrayerLinkedState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { schedulesGetMeetingDate } from '@services/app/schedules';
import useWeekNavigation from '@features/meetings/hooks/useWeekNavigation';

const useMidweekEditor = () => {
  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const weeksSource = useAtomValue(sourcesFormattedState);
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const dataView = useAtomValue(userDataViewState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const schedules = useAtomValue(schedulesState);
  const sourceLocale = useAtomValue(JWLangLocaleState);
  const settings = useAtomValue(settingsState);
  const openingPrayerLinked = useAtomValue(
    midweekMeetingOpeningPrayerLinkedState
  );
  const closingPrayerLinked = useAtomValue(
    midweekMeetingClosingPrayerLinkedState
  );

  const [isEdit, setIsEdit] = useState(false);

  const [openTGW, setOpenTGW] = useState(true);
  const [openAYF, setOpenAYF] = useState(true);
  const [openLC, setOpenLC] = useState(true);
  const [clearAll, setClearAll] = useState(false);

  const { handleChangeWeekBack, handleChangeWeekNext, showWeekArrows } =
    useWeekNavigation(selectedWeek, setSelectedWeek);

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

  const languageWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const hasSource = useMemo(() => {
    if (!source) return false;

    const weekDate = source.midweek_meeting.week_date_locale[lang];

    return weekDate ? true : false;
  }, [source, lang]);

  const showDoublePerson = useMemo(() => {
    return (
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType)
    );
  }, [classCount, weekType, languageWeekType]);

  const assignFSG = useMemo(() => {
    if (!showDoublePerson) return false;

    return settings.cong_settings.aux_class_fsg?.value ?? false;
  }, [showDoublePerson, settings]);

  const mainWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type === 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const weekDateLocale = useMemo(() => {
    if (selectedWeek.length === 0) return '';

    const meetingDate = schedulesGetMeetingDate({
      week: selectedWeek,
      meeting: 'midweek',
    });

    return meetingDate.locale;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, weekType]);

  const isGroup = useMemo(() => dataView !== 'main', [dataView]);

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
    dataView,
  };
};

export default useMidweekEditor;
