import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { IconError } from '@components/icons';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import { personsActiveState, personsByViewState } from '@states/persons';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { sourcesState } from '@states/sources';
import {
  sourcesCheckLCElderAssignment,
  sourcesLCGet,
} from '@services/app/sources';
import { personIsAway, personIsElder } from '@services/app/persons';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  JWLangLocaleState,
  JWLangState,
  midweekMeetingAuxCounselorDefaultEnabledState,
  midweekMeetingAuxCounselorDefaultState,
  midweekMeetingClosingPrayerLinkedState,
  midweekMeetingOpeningPrayerLinkedState,
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
import { personGetDisplayName, speakerGetDisplayName } from '@utils/common';
import {
  schedulesGetData,
  schedulesGetMeetingDate,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { AssignmentCongregation } from '@definition/schedules';
import { useAppTranslation } from '@hooks/index';
import { incomingSpeakersState } from '@states/visiting_speakers';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { formatDate } from '@utils/date';
import { languageGroupsState } from '@states/field_service_groups';

const useBrotherSelector = ({ type, week, assignment }: PersonSelectorType) => {
  const location = useLocation();

  const { t } = useAppTranslation();

  const openingPrayerLinked = useAtomValue(
    midweekMeetingOpeningPrayerLinkedState
  );

  const closingPrayerLinked = useAtomValue(
    midweekMeetingClosingPrayerLinkedState
  );

  const setLocalSongSelectorOpen = useSetAtom(weekendSongSelectorOpenState);

  const persons = useAtomValue(personsActiveState);
  const personsByView = useAtomValue(personsByViewState);
  const languageGroups = useAtomValue(languageGroupsState);
  const incomingSpeakers = useAtomValue(incomingSpeakersState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);
  const sourceLocale = useAtomValue(JWLangLocaleState);
  const assignmentsHistory = useAtomValue(assignmentsHistoryState);
  const shortDateFormat = useAtomValue(shortDateFormatState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const schedules = useAtomValue(schedulesState);
  const defaultWTConductor = useAtomValue(
    weekendMeetingWTStudyConductorDefaultState
  );
  const defaultAuxCounselor = useAtomValue(
    midweekMeetingAuxCounselorDefaultState
  );
  const defaultAuxCounselorEnabled = useAtomValue(
    midweekMeetingAuxCounselorDefaultEnabledState
  );
  const wmShowMonthlyWarning = useAtomValue(
    weekendMeetingShowMonthlyWarningState
  );

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFreeSolo, setIsFreeSolo] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [isLinkedPart, setIsLinkedPart] = useState(false);

  useEffect(() => {
    if (
      (assignment === 'MM_OpeningPrayer' && openingPrayerLinked !== '') ||
      (assignment === 'MM_ClosingPrayer' && closingPrayerLinked !== '')
    ) {
      setIsLinkedPart(true);
    }
  }, [assignment, openingPrayerLinked, closingPrayerLinked]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const talkType = useMemo(() => {
    const type = schedule?.weekend_meeting.public_talk_type.find(
      (record) => record.type === dataView
    )?.value;

    return type ?? 'localSpeaker';
  }, [schedule, dataView]);

  const personsList = useMemo(() => {
    if (
      assignment !== 'WM_Speaker_Part1' &&
      assignment !== 'WM_Speaker_Part2'
    ) {
      return personsByView;
    }

    if (
      (assignment === 'WM_Speaker_Part1' ||
        assignment === 'WM_Speaker_Part2') &&
      talkType !== 'group' &&
      talkType !== 'host'
    ) {
      return personsByView;
    }

    const personsInGroups = persons.filter((record) =>
      languageGroups.some((group) =>
        group.group_data.members.some(
          (member) => member.person_uid === record.person_uid
        )
      )
    );

    if (talkType === 'group') {
      return personsInGroups;
    }

    if (talkType === 'host') {
      return persons.filter(
        (record) =>
          !personsInGroups.some(
            (person) => person.person_uid === record.person_uid
          )
      );
    }
  }, [assignment, personsByView, talkType, persons, languageGroups]);

  const options = useMemo(() => {
    const filteredPersons = personsList.filter((record) => {
      const activeAssignments =
        record.person_data.assignments.find((a) => {
          if (
            assignment !== 'WM_Speaker_Part1' &&
            assignment !== 'WM_Speaker_Part2'
          ) {
            return a.type === dataView;
          }

          if (talkType === 'group') {
            return a.type !== 'main';
          }

          if (talkType === 'host') {
            return a.type === 'main';
          }

          return a.type === dataView;
        })?.values ?? [];

      if (
        type !== AssignmentCode.MM_LCPart &&
        type !== AssignmentCode.WM_SpeakerSymposium
      ) {
        return activeAssignments.includes(type);
      }

      if (type === AssignmentCode.WM_SpeakerSymposium) {
        if (talkType === 'group' || talkType === 'host') {
          return activeAssignments.includes(AssignmentCode.WM_Speaker);
        }

        return (
          activeAssignments.includes(AssignmentCode.WM_Speaker) ||
          activeAssignments.includes(AssignmentCode.WM_SpeakerSymposium)
        );
      }

      const lcType = activeAssignments.includes(AssignmentCode.MM_LCPart);

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
            const isElder = sourcesCheckLCElderAssignment(
              src,
              desc,
              sourceLocale
            );

            return isElder ? personIsElder(record) : true;
          }

          if (assignment === 'MM_LCPart3') {
            const src = source.midweek_meeting.lc_part3.title.find(
              (record) => record.type === dataView
            )?.value;
            const desc = source.midweek_meeting.lc_part3.desc.find(
              (record) => record.type === dataView
            )?.value;

            const isElder = sourcesCheckLCElderAssignment(
              src,
              desc,
              sourceLocale
            );
            return isElder ? personIsElder(record) : true;
          }
        }
      }

      return false;
    });

    const newPersons: PersonOptionsType[] = filteredPersons.map((record) => {
      const lastAssignment = assignmentsHistory.find((item) => {
        if (item.assignment.person !== record.person_uid) return false;

        if (type === AssignmentCode.WM_SpeakerSymposium) {
          return (
            item.assignment.code === AssignmentCode.WM_Speaker ||
            item.assignment.code === AssignmentCode.WM_SpeakerSymposium
          );
        }

        return item.assignment.code === type;
      });

      const lastAssignmentFormat = lastAssignment
        ? formatDate(new Date(lastAssignment.weekOf), shortDateFormat)
        : '';

      return {
        ...record,
        last_assignment: lastAssignmentFormat,
        weekOf: lastAssignment?.weekOf ?? '',
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
    personsList,
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
    sourceLocale,
    talkType,
  ]);

  const value = useMemo(() => {
    if (week.length === 0) return null;

    let linkedAssigment: AssignmentFieldType;

    if (assignment === 'MM_OpeningPrayer' && openingPrayerLinked !== '') {
      linkedAssigment = openingPrayerLinked;
    }

    if (assignment === 'MM_ClosingPrayer' && closingPrayerLinked !== '') {
      linkedAssigment = closingPrayerLinked;
    }

    const path = ASSIGNMENT_PATH[linkedAssigment || assignment];

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

      if (
        !talkType ||
        (talkType.value !== 'visitingSpeaker' &&
          talkType.value !== 'host' &&
          talkType.value !== 'group')
      ) {
        person = options.find(
          (record) => record.person_uid === assigned?.value
        );
      }
    }

    return person ?? null;
  }, [
    week,
    assignment,
    dataView,
    schedule,
    options,
    defaultWTConductor,
    defaultAuxCounselor,
    defaultAuxCounselorEnabled,
    openingPrayerLinked,
    closingPrayerLinked,
  ]);

  const personHistory = useMemo(() => {
    if (!value) return [];

    return assignmentsHistory.filter(
      (record) => record.assignment.person === value.person_uid
    );
  }, [value, assignmentsHistory]);

  const meetingDate = useMemo(() => {
    const meeting = location.pathname.includes('midweek')
      ? 'midweek'
      : 'weekend';

    const date = schedulesGetMeetingDate({ week, meeting });

    return date.date;
  }, [location.pathname, week]);

  const helperText = useMemo(() => {
    if (!value || week.length === 0) return '';

    // check for person time away
    const person = persons.find(
      (record) => record.person_uid === value.person_uid
    );

    const timeAwayNotice = personIsAway(person, meetingDate);

    if (timeAwayNotice) {
      return timeAwayNotice;
    }

    // check week assignments
    const weekAssignments = personHistory.filter(
      (record) => record.weekOf === week
    );

    if (weekAssignments.length > 1) {
      return t('tr_personAlreadyAssignmentWeek');
    }

    // check monthly assignments
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

    // check if part is linked to another part
    if (isLinkedPart) {
      return t('tr_linkedAssignmentWarning');
    }

    return '';
  }, [
    value,
    week,
    personHistory,
    t,
    wmShowMonthlyWarning,
    assignment,
    isLinkedPart,
    persons,
    meetingDate,
  ]);

  const defaultInputValue = useMemo(() => {
    if (week.length === 0) return '';

    if (assignment !== 'WM_ClosingPrayer') return '';

    if (
      talkType !== 'visitingSpeaker' &&
      talkType !== 'group' &&
      talkType !== 'host'
    ) {
      return '';
    }

    const path = ASSIGNMENT_PATH['WM_Speaker_Part1'];

    if (!path) return '';

    const dataSchedule = schedulesGetData(schedule, path);
    let assigned: AssignmentCongregation;

    if (Array.isArray(dataSchedule)) {
      assigned = dataSchedule.find((record) => record.type === dataView);
    } else {
      assigned = dataSchedule;
    }

    if (talkType === 'group' || talkType === 'host') {
      const speaker = persons.find(
        (record) => record.person_uid === assigned?.value
      );

      if (speaker) {
        return personGetDisplayName(
          speaker,
          displayNameEnabled,
          fullnameOption
        );
      }
    }

    const speaker = incomingSpeakers.find(
      (record) => record.person_uid === assigned?.value
    );

    if (speaker) {
      return speakerGetDisplayName(speaker, displayNameEnabled, fullnameOption);
    }

    return assigned?.value ?? '';
  }, [
    week,
    assignment,
    dataView,
    schedule,
    talkType,
    incomingSpeakers,
    displayNameEnabled,
    fullnameOption,
    persons,
  ]);

  const handleSaveAssignment = async (value: PersonOptionsType) => {
    try {
      await schedulesSaveAssignment(schedule, assignment, value);

      if (assignment === 'WM_Speaker_Part1') {
        setLocalSongSelectorOpen(true);
      }
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleOpenHistory = () => setIsHistoryOpen(true);

  const handleCloseHistory = () => setIsHistoryOpen(false);

  const handleValueChange = (value: string) => setInputValue(value);

  useEffect(() => {
    setIsFreeSolo(false);

    if (
      assignment === 'WM_ClosingPrayer' &&
      (talkType === 'visitingSpeaker' ||
        talkType === 'host' ||
        talkType === 'group')
    ) {
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
    isLinkedPart,
  };
};

export default useBrotherSelector;
