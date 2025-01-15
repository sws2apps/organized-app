import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { sourcesState } from '@states/sources';
import {
  sourcesCheckLCElderAssignment,
  sourcesLCGet,
} from '@services/app/sources';
import { personIsElder } from '@services/app/persons';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  JWLangState,
  midweekMeetingAuxCounselorDefaultEnabledState,
  midweekMeetingAuxCounselorDefaultState,
  shortDateFormatState,
  userDataViewState,
  weekendMeetingShowMonthlyWarningState,
  weekendMeetingWTStudyConductorDefaultState,
} from '@states/settings';
import {
  assignmentsHistoryState,
  schedulesState,
  weekendSongSelectorOpenState,
} from '@states/schedules';
import { formatDate } from '@services/dateformat';
import { personGetDisplayName, speakerGetDisplayName } from '@utils/common';
import {
  schedulesGetData,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { AssignmentCongregation } from '@definition/schedules';
import { useAppTranslation } from '@hooks/index';
import { incomingSpeakersState } from '@states/visiting_speakers';
import { appLangState } from '@states/app';

const useBrotherSelector = ({ type, week, assignment }: PersonSelectorType) => {
  const { t } = useAppTranslation();

  const setLocalSongSelectorOpen = useSetRecoilState(
    weekendSongSelectorOpenState
  );

  const persons = useRecoilValue(personsActiveState);
  const incomingSpeakers = useRecoilValue(incomingSpeakersState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);
  const appLang = useRecoilValue(appLangState);
  const assignmentsHistory = useRecoilValue(assignmentsHistoryState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const displayNameEnabled = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const schedules = useRecoilValue(schedulesState);
  const defaultWTConductor = useRecoilValue(
    weekendMeetingWTStudyConductorDefaultState
  );
  const defaultAuxCounselor = useRecoilValue(
    midweekMeetingAuxCounselorDefaultState
  );
  const defaultAuxCounselorEnabled = useRecoilValue(
    midweekMeetingAuxCounselorDefaultEnabledState
  );
  const wmShowMonthlyWarning = useRecoilValue(
    weekendMeetingShowMonthlyWarningState
  );

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFreeSolo, setIsFreeSolo] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const options = useMemo(() => {
    const filteredPersons = persons.filter((record) => {
      const activeAssignments = record.person_data.assignments.filter(
        (assignment) => assignment._deleted === false
      );

      if (
        type !== AssignmentCode.MM_LCPart &&
        type !== AssignmentCode.WM_SpeakerSymposium
      ) {
        return activeAssignments.find((item) => item.code === type);
      }

      if (type === AssignmentCode.WM_SpeakerSymposium) {
        return activeAssignments.find(
          (item) =>
            item.code === AssignmentCode.WM_Speaker ||
            item.code === AssignmentCode.WM_SpeakerSymposium
        );
      }

      const lcType = activeAssignments.find(
        (item) => item.code === AssignmentCode.MM_LCPart
      );

      if (lcType) {
        const source = sources.find((record) => record.weekOf === week);
        if (source) {
          const lcParts = ['MM_LCPart1', 'MM_LCPart2'];

          if (lcParts.includes(assignment)) {
            const path = assignment
              .replace('MM_', '')
              .replace('LC', 'LC_')
              .toLowerCase();

            const part = source.midweek_meeting[path];

            const { src, desc } = sourcesLCGet(part, dataView, lang);
            const isElder = sourcesCheckLCElderAssignment(src, desc, appLang);

            return isElder ? personIsElder(record) : true;
          }

          if (assignment === 'MM_LCPart3') {
            const src = source.midweek_meeting.lc_part3.title.find(
              (record) => record.type === dataView
            )?.value;
            const desc = source.midweek_meeting.lc_part3.desc.find(
              (record) => record.type === dataView
            )?.value;

            const isElder = sourcesCheckLCElderAssignment(src, desc, appLang);
            return isElder ? personIsElder(record) : true;
          }
        }
      }

      return false;
    });

    const newPersons: PersonOptionsType[] = filteredPersons.map((record) => {
      const lastAssignment = assignmentsHistory.find(
        (item) =>
          item.assignment.person === record.person_uid &&
          item.assignment.code === type
      );

      const lastAssignmentFormat = lastAssignment
        ? formatDate(new Date(lastAssignment.weekOf), shortDateFormat)
        : '';

      return {
        ...record,
        last_assignment: lastAssignmentFormat,
        weekOf: lastAssignment?.weekOf || '',
        person_name: personGetDisplayName(
          record,
          displayNameEnabled,
          fullnameOption
        ),
      };
    });

    return newPersons.sort((a, b) => {
      // If both 'weekOf' fields are empty, sort by name
      if (a.weekOf.length === 0 && b.weekOf.length === 0) {
        return a.person_name.localeCompare(b.person_name);
      }

      // If 'weekOf' of 'a' is empty, 'a' should come first
      if (a.weekOf.length === 0) {
        return -1;
      }

      // If 'weekOf' of 'b' is empty, 'b' should come first
      if (b.weekOf.length === 0) {
        return 1;
      }

      // If both 'weekOf' fields are not empty, sort by date

      return new Date(a.weekOf)
        .toISOString()
        .localeCompare(new Date(b.weekOf).toISOString());
    });
  }, [
    persons,
    type,
    sources,
    week,
    assignment,
    lang,
    dataView,
    assignmentsHistory,
    shortDateFormat,
    displayNameEnabled,
    fullnameOption,
    appLang,
  ]);

  const value = useMemo(() => {
    if (week.length === 0) return null;

    const path = ASSIGNMENT_PATH[assignment];

    if (!path) return null;

    const dataSchedule = schedulesGetData(schedule, path);
    let assigned: AssignmentCongregation;

    if (Array.isArray(dataSchedule)) {
      assigned = dataSchedule.find((record) => record.type === dataView);
    } else {
      assigned = dataSchedule;
    }

    let person: PersonOptionsType;

    person = options.find((record) => record.person_uid === assigned?.value);

    // handle default value for some parts
    if (
      !person &&
      assignment === 'MM_Chairman_B' &&
      defaultAuxCounselorEnabled
    ) {
      person = options.find(
        (record) => record.person_uid === defaultAuxCounselor
      );
    }

    if (!person && assignment === 'WM_WTStudy_Conductor') {
      person = options.find(
        (record) => record.person_uid === defaultWTConductor
      );
    }

    if (!person && assignment === 'WM_ClosingPrayer') {
      const path = ASSIGNMENT_PATH['WM_Speaker_Part1'];

      if (!path) return null;

      const dataSchedule = schedulesGetData(schedule, path);
      let assigned: AssignmentCongregation;

      if (Array.isArray(dataSchedule)) {
        assigned = dataSchedule.find((record) => record.type === dataView);
      } else {
        assigned = dataSchedule;
      }

      const talkType = schedule.weekend_meeting.public_talk_type.find(
        (record) => record.type === dataView
      );

      if (!talkType || talkType.value !== 'visitingSpeaker') {
        person = options.find(
          (record) => record.person_uid === assigned?.value
        );
      }
    }

    return person || null;
  }, [
    week,
    assignment,
    dataView,
    schedule,
    options,
    defaultWTConductor,
    defaultAuxCounselor,
    defaultAuxCounselorEnabled,
  ]);

  const personHistory = useMemo(() => {
    if (!value) return [];

    return assignmentsHistory.filter(
      (record) => record.assignment.person === value.person_uid
    );
  }, [value, assignmentsHistory]);

  const helperText = useMemo(() => {
    if (!value || week.length === 0) return '';

    // check week assignments
    const weekAssignments = personHistory.filter(
      (record) => record.weekOf === week
    );

    if (weekAssignments.length > 1) {
      return t('tr_personAlreadyAssignmentWeek');
    }

    if (assignment.startsWith('WM_') && wmShowMonthlyWarning) {
      const [currentYear, currentMonth] = week.split('/');

      const monthAssignments = personHistory.filter((record) => {
        const [tmpYear, tmpMonth] = record.weekOf.split('/');
        return tmpYear === currentYear && currentMonth === tmpMonth;
      });

      if (monthAssignments.length > 1) {
        return t('tr_repeatedMonthlyWarningDesc');
      }
    }

    return '';
  }, [value, week, personHistory, t, wmShowMonthlyWarning, assignment]);

  const talkType = useMemo(() => {
    const type = schedule?.weekend_meeting.public_talk_type.find(
      (record) => record.type === dataView
    )?.value;

    return type || 'localSpeaker';
  }, [schedule, dataView]);

  const defaultInputValue = useMemo(() => {
    if (week.length === 0) return '';

    if (assignment !== 'WM_ClosingPrayer') return '';

    if (talkType !== 'visitingSpeaker') return '';

    const path = ASSIGNMENT_PATH['WM_Speaker_Part1'];

    if (!path) return '';

    const dataSchedule = schedulesGetData(schedule, path);
    let assigned: AssignmentCongregation;

    if (Array.isArray(dataSchedule)) {
      assigned = dataSchedule.find((record) => record.type === dataView);
    } else {
      assigned = dataSchedule;
    }

    const speaker = incomingSpeakers.find(
      (record) => record.person_uid === assigned?.value
    );

    if (speaker) {
      return speakerGetDisplayName(speaker, displayNameEnabled, fullnameOption);
    }

    return assigned?.value || '';
  }, [
    week,
    assignment,
    dataView,
    schedule,
    talkType,
    incomingSpeakers,
    displayNameEnabled,
    fullnameOption,
  ]);

  const handleSaveAssignment = async (value: PersonOptionsType) => {
    await schedulesSaveAssignment(schedule, assignment, value);

    if (assignment === 'WM_Speaker_Part1') {
      setLocalSongSelectorOpen(true);
    }
  };

  const handleOpenHistory = () => setIsHistoryOpen(true);

  const handleCloseHistory = () => setIsHistoryOpen(false);

  const handleValueChange = (value: string) => setInputValue(value);

  useEffect(() => {
    setIsFreeSolo(false);

    if (assignment === 'WM_ClosingPrayer' && talkType === 'visitingSpeaker') {
      setIsFreeSolo(!value);
    }
  }, [assignment, talkType, value]);

  useEffect(() => {
    setInputValue(defaultInputValue);
  }, [defaultInputValue]);

  return {
    options,
    handleSaveAssignment,
    value,
    helperText,
    personHistory,
    isHistoryOpen,
    handleOpenHistory,
    handleCloseHistory,
    isFreeSolo,
    inputValue,
    handleValueChange,
  };
};

export default useBrotherSelector;
