import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  schedulesState,
  selectedWeekState,
  weekendSongSelectorOpenState,
} from '@states/schedules';
import { monthNamesState } from '@states/app';
import { Week } from '@definition/week_type';
import {
  JWLangState,
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { personsState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { addDays } from '@utils/date';

const useWeekendEditor = () => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const selectedWeek = useRecoilValue(selectedWeekState);
  const monthNames = useRecoilValue(monthNamesState);
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);
  const persons = useRecoilValue(personsState);
  const autoAssignOpeningPrayer = useRecoilValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const [songSelectorOpen, setSongSelectorOpen] = useRecoilState(
    weekendSongSelectorOpenState
  );
  const weekendDay = useRecoilValue(weekendMeetingWeekdayState);

  const [state, setState] = useState({
    weekDateLocale: '',
    weekType: Week.NORMAL,
    wtStudyTitle: '',
    openPublicTalk: true,
    openWTStudy: true,
    openServiceTalk: true,
    showSpeaker2: false,
    clearAll: false,
  });

  const schedule = schedules.find((record) => record.weekOf === selectedWeek);
  const source = sources.find((record) => record.weekOf === selectedWeek);

  const showEventEditor =
    state.weekType !== Week.NORMAL &&
    state.weekType !== Week.CO_VISIT &&
    state.weekType !== Week.SPECIAL_TALK;

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

  useEffect(() => {
    if (selectedWeek.length === 0) {
      setState((prev) => {
        return { ...prev, weekDateLocale: '' };
      });
    }

    if (selectedWeek.length > 0) {
      const toAdd = weekendDay - 1;
      const weekDate = addDays(selectedWeek, toAdd);

      const month = weekDate.getMonth();
      const date = weekDate.getDate();
      const year = weekDate.getFullYear();

      const monthName = monthNames[month];

      const weekDateLocale = t('tr_longDateWithYearLocale', {
        date,
        month: monthName,
        year,
      });

      setState((prev) => {
        return { ...prev, weekDateLocale };
      });
    }
  }, [t, selectedWeek, monthNames, weekendDay]);

  useEffect(() => {
    setState((prev) => {
      return { ...prev, wtStudyTitle: '', showSpeaker2: false };
    });

    if (schedule) {
      const weekType =
        schedule.weekend_meeting.week_type.find(
          (record) => record.type === dataView
        )?.value || Week.NORMAL;

      setState((prev) => {
        return { ...prev, weekType };
      });

      const wtStudy = source.weekend_meeting.w_study[lang];
      setState((prev) => {
        return { ...prev, wtStudyTitle: wtStudy };
      });

      const speaker1 = schedule.weekend_meeting.speaker.part_1.find(
        (record) => record.type === dataView
      );

      if (speaker1) {
        const person = persons.find(
          (record) => record.person_uid === speaker1.value
        );

        if (person) {
          const isSymposium = person.person_data.assignments
            .filter((assignment) => assignment._deleted === false)
            .find(
              (record) => record.code === AssignmentCode.WM_SpeakerSymposium
            );

          setState((prev) => {
            return { ...prev, showSpeaker2: !!isSymposium };
          });
        }
      }
    }
  }, [schedule, dataView, source, lang, persons]);

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
  };
};

export default useWeekendEditor;
