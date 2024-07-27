import { MouseEvent, useCallback, useEffect, useState } from 'react';
import {
  GenderType,
  PersonOptionsType,
  PersonSelectorType,
} from './index.types';
import { PersonType } from '@definition/person';
import { useRecoilValue } from 'recoil';
import { personsActiveState, personsState } from '@states/persons';
import {
  displayNameEnableState,
  fullnameOptionState,
  userDataViewState,
} from '@states/settings';
import { personGetDisplayName } from '@utils/common';
import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation } from '@hooks/index';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/app';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCElderAssignment,
} from '@services/app/sources';
import { personIsElder } from '@services/app/persons';
import {
  AssignmentCongregation,
  AssignmentHistoryType,
} from '@definition/schedules';
import { LivingAsChristiansType } from '@definition/sources';
import { formatDate } from '@services/dateformat';
import {
  ASSIGNMENT_PATH,
  ASSISTANT_ASSIGNMENT,
  BROTHER_ASSIGNMENT,
  STUDENT_ASSIGNMENT,
} from '@constants/index';
import {
  schedulesGetData,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { IconMale, IconPersonPlaceholder } from '@components/icons';

const usePersonSelector = ({ type, week, assignment }: PersonSelectorType) => {
  const { t } = useAppTranslation();

  const personsAll = useRecoilValue(personsActiveState);
  const displayNameEnabled = useRecoilValue(displayNameEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const persons = useRecoilValue(personsState);
  const lang = useRecoilValue(JWLangState);
  const history = useRecoilValue(assignmentsHistoryState);

  const [optionHeader, setOptionHeader] = useState('');
  const [options, setOptions] = useState<PersonOptionsType[]>([]);
  const [value, setValue] = useState<PersonOptionsType | null>(null);
  const [gender, setGender] = useState<GenderType>('male');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [decorator, setDecorator] = useState<'error' | 'warning'>(null);
  const [helperText, setHelperText] = useState('');

  const labelBrothers = t('tr_brothers');
  const labelParticipants = t('tr_participants');

  const placeHolderIcon = STUDENT_ASSIGNMENT.includes(type) ? (
    <IconPersonPlaceholder />
  ) : (
    <IconMale />
  );

  const isAssistant = assignment.includes('Assistant');

  const schedule = schedules.find((record) => record.weekOf === week);
  const source = sources.find((record) => record.weekOf === week);

  const assignmentsHistory = history.filter(
    (record) => record.assignment.person === value?.person_uid
  );

  const checkGenderSelector = () => {
    const validType = [
      AssignmentCode.MM_StartingConversation,
      AssignmentCode.MM_FollowingUp,
      AssignmentCode.MM_MakingDisciples,
    ];

    if (validType.includes(type)) {
      return true;
    }

    if (type === AssignmentCode.MM_ExplainingBeliefs) {
      if (source) {
        const partKeys = ['AYFPart1', 'AYFPart2', 'AYFPart3', 'AYFPart4'];
        for (const partKey of partKeys) {
          if (assignment.includes(partKey)) {
            const src =
              source.midweek_meeting[`ayf_part${partKey.slice(-1)}`].src[lang];
            const isTalk = sourcesCheckAYFExplainBeliefsAssignment(src);
            return !isTalk;
          }
        }
      }
    }
  };

  const getPersonDisplayName = useCallback(
    (option: PersonOptionsType) => {
      const result = personGetDisplayName(
        option,
        displayNameEnabled,
        fullnameOption
      );
      return result;
    },
    [displayNameEnabled, fullnameOption]
  );

  const handleGenderUpdate = (
    e: MouseEvent<HTMLLabelElement>,
    value: GenderType
  ) => {
    e.preventDefault();
    setGender(value);
  };

  const handleSaveAssignment = async (value: PersonOptionsType) => {
    await schedulesSaveAssignment(schedule, assignment, value);
  };

  const handleFormatDate = useCallback(
    (value: string) => {
      return formatDate(new Date(value), t('tr_shortDateFormat'));
    },
    [t]
  );

  const handleSortOptions = useCallback(
    (options: PersonOptionsType[]) => {
      const newPersons = options.map((record) => {
        let lastAssignment: AssignmentHistoryType;

        if (!STUDENT_ASSIGNMENT.includes(type)) {
          lastAssignment = history.find(
            (item) =>
              item.assignment.person === record.person_uid &&
              item.assignment.code === type
          );
        }

        if (STUDENT_ASSIGNMENT.includes(type)) {
          lastAssignment = history.find(
            (item) =>
              item.assignment.person === record.person_uid &&
              STUDENT_ASSIGNMENT.includes(item.assignment.code)
          );
        }

        const lastAssignmentFormat = lastAssignment
          ? handleFormatDate(lastAssignment.weekOf)
          : '';

        const lastAssistant = history.find(
          (item) => item.assignment.ayf?.assistant === record.person_uid
        );
        const lastAssistantFormat = lastAssistant
          ? handleFormatDate(lastAssistant.weekOf)
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
          hall,
        };
      });

      newPersons.sort((a, b) => {
        // If both 'last_assignment' fields are empty, sort by name
        if (a.last_assignment.length === 0 && b.last_assignment.length === 0) {
          return getPersonDisplayName(a).localeCompare(getPersonDisplayName(b));
        }

        // If 'last_assignment' of 'a' is empty, 'a' should come first
        if (a.last_assignment.length === 0) {
          return -1;
        }

        // If 'last_assignment' of 'b' is empty, 'b' should come first
        if (b.last_assignment.length === 0) {
          return 1;
        }

        // If both 'last_assignment' fields are not empty, sort by date

        return new Date(a.last_assignment)
          .toISOString()
          .localeCompare(new Date(b.last_assignment).toISOString());
      });

      return newPersons;
    },
    [handleFormatDate, history, t, getPersonDisplayName, type]
  );

  const handleOpenHistory = () => setIsHistoryOpen(true);

  const handleCloseHistory = () => setIsHistoryOpen(false);

  useEffect(() => {
    if (BROTHER_ASSIGNMENT.includes(type)) {
      setOptionHeader(labelBrothers);
    } else {
      setOptionHeader(labelParticipants);
    }
  }, [type, labelBrothers, labelParticipants]);

  useEffect(() => {
    if (!isAssistant) {
      const isMale = gender === 'male';
      const isFemale = gender === 'female';

      const getLCSources = (part: LivingAsChristiansType) => {
        const srcOverride = part.title.override.find(
          (record) => record.type === dataView
        );
        const srcDefault = part.title.default[lang];
        const src =
          srcOverride?.value.length > 0 ? srcOverride.value : srcDefault;

        const descOverride = part.desc.override.find(
          (record) => record.type === dataView
        );
        const descDefault = part.desc.default[lang];
        const desc =
          descOverride?.value.length > 0 ? descOverride.value : descDefault;

        return { src, desc };
      };

      const getPersons = (isElder: boolean) => {
        let persons = personsAll.filter((record) =>
          record.person_data.assignments
            .filter((assignment) => assignment._deleted === false)
            .find((item) => item.code === type)
        );

        if (isElder) {
          persons = persons.filter((record) => personIsElder(record));
        }

        return persons;
      };

      if (type !== AssignmentCode.MM_LCPart) {
        const persons = personsAll.filter(
          (record) =>
            record.person_data.male.value === isMale &&
            record.person_data.female.value === isFemale &&
            record.person_data.assignments
              .filter((assignment) => assignment._deleted === false)
              .find((item) => item.code === type)
        );

        const options = handleSortOptions(persons);

        setOptions(options);
      }

      if (type === AssignmentCode.MM_LCPart) {
        const source = sources.find((record) => record.weekOf === week);
        if (source) {
          const lcParts = ['MM_LCPart1', 'MM_LCPart2'];

          if (lcParts.includes(assignment)) {
            const path = assignment
              .replace('MM_', '')
              .replace('LC', 'LC_')
              .toLowerCase();
            const part = source.midweek_meeting[path];

            const { src, desc } = getLCSources(part);
            const isElder = sourcesCheckLCElderAssignment(src, desc);
            const persons = getPersons(isElder);

            const options = handleSortOptions(persons);
            setOptions(options);
          }

          if (assignment === 'MM_LCPart3') {
            const src = source.midweek_meeting.lc_part3.title.find(
              (record) => record.type === dataView
            )?.value;
            const desc = source.midweek_meeting.lc_part3.desc.find(
              (record) => record.type === dataView
            )?.value;

            const isElder = sourcesCheckLCElderAssignment(src, desc);
            const persons = getPersons(isElder);

            const options = handleSortOptions(persons);
            setOptions(options);
          }
        }
      }
    }
  }, [
    type,
    personsAll,
    gender,
    isAssistant,
    week,
    assignment,
    dataView,
    lang,
    sources,
    history,
    handleFormatDate,
    handleSortOptions,
  ]);

  useEffect(() => {
    if (week.length > 0) {
      const path = ASSIGNMENT_PATH[assignment];

      if (path) {
        setGender('male');

        let mainStudent: PersonType;

        if (isAssistant) {
          setValue(null);
          setOptions([]);

          const pathMainStudent =
            ASSIGNMENT_PATH[assignment.replace('Assistant', 'Student')];
          const data = schedulesGetData(
            schedule,
            pathMainStudent
          ) as AssignmentCongregation[];

          const mainPerson = data.find(
            (record) => record.type === dataView
          )?.value;
          mainStudent = persons.find(
            (record) => record.person_uid === mainPerson
          );

          if (mainStudent) {
            const gender = mainStudent.person_data.male.value
              ? 'male'
              : 'female';
            setGender(gender);

            const isMale = mainStudent.person_data.male.value;
            const isFemale = mainStudent.person_data.female.value;

            const newPersons = personsAll.filter(
              (record) =>
                record.person_data.male.value === isMale &&
                record.person_data.female.value === isFemale &&
                record.person_data.assignments
                  .filter((assignment) => assignment._deleted === false)
                  .some((assignment) =>
                    ASSISTANT_ASSIGNMENT.includes(assignment.code)
                  )
            );

            const options = handleSortOptions(newPersons);
            setOptions(options);
          }
        }

        if (!isAssistant || (isAssistant && mainStudent)) {
          const dataSchedule = schedulesGetData(schedule, path);
          let person_uid: string;

          if (Array.isArray(dataSchedule)) {
            person_uid = dataSchedule.find(
              (record) => record.type === dataView
            )?.value;
          } else {
            person_uid = dataSchedule.value;
          }

          const person = persons.find(
            (record) => record.person_uid === person_uid
          );

          if (person && person.person_data.female.value) {
            setGender('female');
          }

          if (person && person.person_data.male.value) {
            setGender('male');
          }

          setValue(person || null);
        }
      }
    }
  }, [
    week,
    schedule,
    dataView,
    persons,
    assignment,
    personsAll,
    isAssistant,
    handleFormatDate,
    history,
    handleSortOptions,
  ]);

  useEffect(() => {
    const checkAssignments = () => {
      setDecorator(null);
      setHelperText('');

      if (value && week.length > 0) {
        // check week assignments
        const weekAssignments = assignmentsHistory.filter(
          (record) => record.weekOf === week
        );

        if (weekAssignments.length > 1) {
          setDecorator('error');
          setHelperText(t('tr_personAlreadyAssignmentWeek'));

          return;
        }

        const [currentYear, currentMonth] = week.split('/');
        const monthAssignments = assignmentsHistory.filter((record) => {
          const [tmpYear, tmpMonth] = record.weekOf.split('/');

          return tmpYear === currentYear && currentMonth === tmpMonth;
        });

        if (monthAssignments.length > 1) {
          setDecorator('error');
          setHelperText(t('tr_repeatedMonthlyWarningDesc'));

          return;
        }
      }
    };

    checkAssignments();
  }, [value, week, assignmentsHistory, t]);

  return {
    options,
    getPersonDisplayName,
    optionHeader,
    value,
    handleSaveAssignment,
    showGenderSelector: checkGenderSelector(),
    gender,
    handleGenderUpdate,
    isAssistant,
    type,
    handleOpenHistory,
    isHistoryOpen,
    handleCloseHistory,
    assignmentsHistory,
    placeHolderIcon,
    decorator,
    helperText,
  };
};

export default usePersonSelector;
