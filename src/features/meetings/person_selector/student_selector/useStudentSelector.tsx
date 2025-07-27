import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import { personsByViewState } from '@states/persons';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  JWLangLocaleState,
  JWLangState,
  midweekMeetingAssigFSGState,
  midweekMeetingClassCountState,
  shortDateFormatState,
  userDataViewState,
} from '@states/settings';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { personGetDisplayName } from '@utils/common';
import { ASSIGNMENT_PATH, ASSISTANT_ASSIGNMENT } from '@constants/index';
import { useAppTranslation } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import { Gender } from './index.types';
import {
  schedulesGetData,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { AssignmentCongregation } from '@definition/schedules';
import { sourcesState } from '@states/sources';
import { ApplyMinistryType } from '@definition/sources';
import { sourcesCheckAYFExplainBeliefsAssignment } from '@services/app/sources';
import { Week } from '@definition/week_type';
import { fieldGroupsState } from '@states/field_service_groups';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { formatDate } from '@utils/date';
import { personIsAway } from '@services/app/persons';

const useStudentSelector = ({ type, assignment, week }: PersonSelectorType) => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsByViewState);
  const assignmentsHistory = useAtomValue(assignmentsHistoryState);
  const shortDateFormat = useAtomValue(shortDateFormatState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);
  const sourceLocale = useAtomValue(JWLangLocaleState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const serviceGroups = useAtomValue(fieldGroupsState);
  const congAssignFSG = useAtomValue(midweekMeetingAssigFSGState);

  const [gender, setGender] = useState<Gender>('male');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [groupChecked, setGroupChecked] = useState(false);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === week);
  }, [sources, week]);

  const isAssistant = useMemo(() => {
    return assignment.includes('Assistant');
  }, [assignment]);

  const assignedFSG = useMemo(() => {
    if (!schedule) return '';

    return schedule.midweek_meeting.aux_fsg?.value || '';
  }, [schedule]);

  const showGroupToggle = useMemo(() => {
    if (!congAssignFSG) return false;

    if (assignment.endsWith('_B') === false) return false;

    if (!schedule) return false;

    const weekType = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    )?.value;

    if (classCount < 2 || weekType !== Week.NORMAL) return false;

    return assignedFSG.length > 0;
  }, [congAssignFSG, assignment, schedule, classCount, dataView, assignedFSG]);

  const options = useMemo(() => {
    const filteredPersons = persons.filter((record) => {
      if (showGroupToggle && groupChecked) {
        const findInGroup = serviceGroups.find((g) =>
          g.group_data.members.some((m) => m.person_uid === record.person_uid)
        );

        if (!findInGroup) return false;

        if (findInGroup.group_id !== assignedFSG) return false;
      }

      const activeAssignments =
        record.person_data.assignments.find((a) => a.type === dataView)
          ?.values ?? [];

      if (!isAssistant) {
        return (
          activeAssignments.includes(type) &&
          ((gender === 'male' && record.person_data.male.value) ||
            (gender === 'female' && record.person_data.female.value))
        );
      }

      if (isAssistant) {
        const pathMainStudent =
          ASSIGNMENT_PATH[assignment.replace('Assistant', 'Student')];

        const dataSchedule = schedulesGetData(schedule, pathMainStudent);

        let assigned: AssignmentCongregation;

        if (Array.isArray(dataSchedule)) {
          assigned = dataSchedule.find((record) => record.type === dataView);
        } else {
          assigned = dataSchedule;
        }

        const mainStudent = persons.find(
          (record) => record.person_uid === assigned?.value
        );

        if (mainStudent) {
          const assignment = activeAssignments.some((assignment) =>
            ASSISTANT_ASSIGNMENT.includes(assignment)
          );

          const isMale = mainStudent.person_data.male.value;
          const isFemale = mainStudent.person_data.female.value;

          const isFamilyMembers =
            mainStudent.person_data.family_members?.members.includes(
              record.person_uid
            );

          const isFamilyHead =
            record.person_data.family_members?.members.includes(
              mainStudent.person_uid
            );

          const isFamily = isFamilyMembers || isFamilyHead;

          return (
            assignment &&
            (isFamily ||
              (record.person_data.male.value === isMale &&
                record.person_data.female.value === isFemale))
          );
        }

        return false;
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

      const lastAssistant = assignmentsHistory.find(
        (item) => item.assignment.ayf?.assistant === record.person_uid
      );

      const lastAssistantFormat = lastAssistant
        ? formatDate(new Date(lastAssistant.weekOf), shortDateFormat)
        : '';

      const classroom = lastAssignment?.assignment.classroom;
      const hall =
        classroom === '1'
          ? t('tr_hallA')
          : classroom === '2'
            ? t('tr_hallB')
            : '';

      return {
        ...record,
        last_assignment: lastAssignmentFormat,
        last_assistant: lastAssistantFormat,
        last_assistant_weekOf: lastAssistant?.weekOf || '',
        weekOf: lastAssignment?.weekOf || '',
        hall,
        person_name: personGetDisplayName(
          record,
          displayNameEnabled,
          fullnameOption
        ),
      };
    });

    return newPersons.sort((a, b) => {
      // If both 'weekOf' fields are empty, sort by last assistant first then by name
      if (a.weekOf.length === 0 && b.weekOf.length === 0) {
        if (
          a.last_assistant_weekOf.length === 0 &&
          b.last_assistant_weekOf.length === 0
        ) {
          return a.person_name.localeCompare(b.person_name);
        }

        if (a.last_assistant_weekOf.length === 0) {
          return -1;
        }

        if (b.last_assistant_weekOf.length === 0) {
          return 1;
        }

        return new Date(a.last_assistant_weekOf)
          .toISOString()
          .localeCompare(new Date(b.last_assistant_weekOf).toISOString());
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
    assignmentsHistory,
    shortDateFormat,
    displayNameEnabled,
    fullnameOption,
    t,
    isAssistant,
    gender,
    assignment,
    dataView,
    schedule,
    assignedFSG,
    showGroupToggle,
    groupChecked,
    serviceGroups,
  ]);

  const personAssigned = useMemo(() => {
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

    const person = persons.find(
      (record) => record.person_uid === assigned?.value
    );

    return person || null;
  }, [week, assignment, dataView, schedule, persons]);

  const showGenderSelector = useMemo(() => {
    if (isAssistant) return false;

    const validType = [
      AssignmentCode.MM_StartingConversation,
      AssignmentCode.MM_FollowingUp,
      AssignmentCode.MM_MakingDisciples,
    ];

    if (validType.includes(type)) {
      return true;
    }

    if (!source) return false;

    if (type === AssignmentCode.MM_ExplainingBeliefs) {
      let part = assignment.split('_')[1];
      part = part.replace('AYFP', 'ayf_p');

      const ayfPart = source.midweek_meeting[part] as ApplyMinistryType;
      const srcLang = ayfPart.src[lang];

      const isTalk = sourcesCheckAYFExplainBeliefsAssignment(
        srcLang,
        sourceLocale
      );
      return !isTalk;
    }

    return false;
  }, [isAssistant, type, source, assignment, lang, sourceLocale]);

  const showHeader = useMemo(
    () => showGenderSelector || showGroupToggle,
    [showGenderSelector, showGroupToggle]
  );

  const value = useMemo(() => {
    if (!personAssigned) return null;

    const person = options.find(
      (record) => record.person_uid === personAssigned.person_uid
    );

    return person || null;
  }, [options, personAssigned]);

  const personHistory = useMemo(() => {
    if (!value) return [];

    return assignmentsHistory.filter(
      (record) => record.assignment.person === value.person_uid
    );
  }, [value, assignmentsHistory]);

  const helperText = useMemo(() => {
    if (!value || week.length === 0) return '';

    // check for person time away
    const person = persons.find(
      (record) => record.person_uid === value.person_uid
    );

    const timeAwayNotice = personIsAway(person, week);

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

    const [currentYear, currentMonth] = week.split('/');

    const monthAssignments = personHistory.filter((record) => {
      const [tmpYear, tmpMonth] = record.weekOf.split('/');
      return tmpYear === currentYear && currentMonth === tmpMonth;
    });

    if (monthAssignments.length > 1) {
      return t('tr_repeatedMonthlyWarningDesc');
    }

    return '';
  }, [persons, value, week, personHistory, t]);

  const handleGenderChange = (
    e: MouseEvent<HTMLLabelElement>,
    value: Gender
  ) => {
    e.preventDefault();
    setGender(value);
  };

  const handleToggleGroup = (e: MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setGroupChecked((prev) => !prev);
  };

  const handleSaveAssignment = async (value: PersonOptionsType) => {
    try {
      await schedulesSaveAssignment(schedule, assignment, value);
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

  useEffect(() => {
    if (personAssigned?.person_data.female.value) {
      setGender('female');
    }

    if (personAssigned?.person_data.male.value) {
      setGender('male');
    }
  }, [personAssigned]);

  return {
    options,
    showGenderSelector,
    showGroupToggle,
    showHeader,
    isAssistant,
    handleGenderChange,
    gender,
    value,
    handleSaveAssignment,
    isHistoryOpen,
    handleOpenHistory,
    handleCloseHistory,
    personHistory,
    helperText,
    handleToggleGroup,
    groupChecked,
  };
};

export default useStudentSelector;
