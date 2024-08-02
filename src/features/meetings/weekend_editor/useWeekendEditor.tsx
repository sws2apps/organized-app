import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { JWLangState, monthNamesState } from '@states/app';
import { Week } from '@definition/week_type';
import { userDataViewState } from '@states/settings';
import { sourcesState } from '@states/sources';
import { personsState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';

const useWeekendEditor = () => {
  const { t } = useAppTranslation();

  const selectedWeek = useRecoilValue(selectedWeekState);
  const monthNames = useRecoilValue(monthNamesState);
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);
  const persons = useRecoilValue(personsState);

  const [weekDateLocale, setWeekDateLocale] = useState('');
  const [weekType, setWeekType] = useState(Week.NORMAL);
  const [wtStudyTitle, setWtStudyTitle] = useState('');
  const [openPublicTalk, setOpenPublicTalk] = useState(true);
  const [openWTStudy, setOpenWTStudy] = useState(true);
  const [openServiceTalk, setOpenServiceTalk] = useState(true);
  const [showSpeaker2, setShowSpeaker2] = useState(false);

  const schedule = schedules.find((record) => record.weekOf === selectedWeek);
  const source = sources.find((record) => record.weekOf === selectedWeek);

  const showEventEditor =
    weekType !== Week.NORMAL &&
    weekType !== Week.CO_VISIT &&
    weekType !== Week.SPECIAL_TALK;

  const handleTogglePulicTalk = () => setOpenPublicTalk((prev) => !prev);

  const handleToggleWTStudy = () => setOpenWTStudy((prev) => !prev);

  const handleToggleServiceTalk = () => setOpenServiceTalk((prev) => !prev);

  useEffect(() => {
    if (selectedWeek.length > 0) {
      const weekDate = new Date(selectedWeek);
      const month = weekDate.getMonth();
      const date = weekDate.getDate();
      const year = weekDate.getFullYear();

      const monthName = monthNames[month];

      const weekDateLocale = t('tr_longDateWithYearLocale', {
        date,
        month: monthName,
        year,
      });
      setWeekDateLocale(weekDateLocale);
    }
  }, [t, selectedWeek, monthNames]);

  useEffect(() => {
    setWtStudyTitle('');
    setShowSpeaker2(false);

    if (schedule) {
      const weekType =
        schedule.weekend_meeting.week_type.find(
          (record) => record.type === dataView
        )?.value || Week.NORMAL;
      setWeekType(weekType);

      const wtStudy = source.weekend_meeting.w_study[lang];
      setWtStudyTitle(wtStudy);

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

          setShowSpeaker2(isSymposium ? true : false);
        }
      }
    }
  }, [schedule, dataView, source, lang, persons]);

  return {
    weekDateLocale,
    selectedWeek,
    weekType,
    wtStudyTitle,
    showEventEditor,
    openPublicTalk,
    handleTogglePulicTalk,
    openWTStudy,
    handleToggleWTStudy,
    openServiceTalk,
    handleToggleServiceTalk,
    showSpeaker2,
  };
};

export default useWeekendEditor;
