import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { WEEK_TYPE_NO_MEETING } from '@constants/index';
import {
  schedulesState,
  selectedWeekState,
  weekendSongSelectorOpenState,
} from '@states/schedules';
import { Week } from '@definition/week_type';
import {
  JWLangState,
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { personsState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const useWeekendEditor = () => {
  const navigate = useNavigate();

  const selectedWeek = useAtomValue(selectedWeekState);
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);
  const persons = useAtomValue(personsState);
  const autoAssignOpeningPrayer = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const [songSelectorOpen, setSongSelectorOpen] = useAtom(
    weekendSongSelectorOpenState
  );

  const [state, setState] = useState({
    openPublicTalk: true,
    openWTStudy: true,
    openServiceTalk: true,
    showSpeaker2: false,
    clearAll: false,
  });

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [schedules, selectedWeek]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [sources, selectedWeek]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.weekend_meeting.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView]);

  const showEventEditor = useMemo(() => {
    return WEEK_TYPE_NO_MEETING.includes(weekType);
  }, [weekType]);

  const mainWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.weekend_meeting.week_type.find(
        (record) => record.type === 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const weekDateLocale = useMemo(() => {
    if (selectedWeek.length === 0) return '';

    const meetingDate = schedulesGetMeetingDate({
      week: selectedWeek,
      meeting: 'weekend',
    });

    return meetingDate.locale;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, weekType]);

  const wtStudyTitle = useMemo(() => {
    if (!source) return '';

    return source.weekend_meeting.w_study[lang];
  }, [source, lang]);

  const showSpeaker2 = useMemo(() => {
    if (!schedule) return false;

    const speaker1 = schedule.weekend_meeting.speaker.part_1.find(
      (record) => record.type === dataView
    );

    if (!speaker1) return false;

    const person = persons.find(
      (record) => record.person_uid === speaker1.value
    );

    if (!person) return false;

    const showSpeaker2 =
      person.person_data.assignments
        .find((a) => a.type === dataView)
        ?.values.includes(AssignmentCode.WM_SpeakerSymposium) ?? false;

    return showSpeaker2;
  }, [schedule, dataView, persons]);

  const isGroup = useMemo(() => dataView !== 'main', [dataView]);

  const showPartsForGroup = useMemo(() => {
    if (!isGroup) return true;

    return mainWeekType !== Week.CO_VISIT;
  }, [isGroup, mainWeekType]);

  const handleTogglePulicTalk = () =>
    setState((prev) => {
      return { ...prev, openPublicTalk: !prev.openPublicTalk };
    });

  const handleToggleWTStudy = () =>
    setState((prev) => {
      return { ...prev, openWTStudy: !prev.openWTStudy };
    });

  const handleToggleServiceTalk = () =>
    setState((prev) => {
      return { ...prev, openServiceTalk: !prev.openServiceTalk };
    });

  const handleOpenClearAll = () =>
    setState((prev) => {
      return { ...prev, clearAll: true };
    });

  const handleCloseClearAll = () =>
    setState((prev) => {
      return { ...prev, clearAll: false };
    });

  const handleOpenVisitingSpeakers = () => {
    navigate('/visiting-speakers');
  };

  const handleCloseSongSelector = () => setSongSelectorOpen(false);

  return {
    ...state,
    selectedWeek,
    showEventEditor,
    handleTogglePulicTalk,
    handleToggleWTStudy,
    handleToggleServiceTalk,
    handleOpenVisitingSpeakers,
    handleOpenClearAll,
    handleCloseClearAll,
    autoAssignOpeningPrayer,
    songSelectorOpen,
    handleCloseSongSelector,
    weekDateLocale,
    wtStudyTitle,
    showSpeaker2,
    showPartsForGroup,
    weekType,
    dataView,
  };
};

export default useWeekendEditor;
