import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  GenderType,
  PersonOptionsType,
  PersonSelectorType,
} from './index.types';
import { PersonType } from '@definition/person';
import { useRecoilValue } from 'recoil';
import { personsActiveState, personsState } from '@states/persons';
import {
  COScheduleNameState,
  displayNameEnableState,
  fullnameOptionState,
  userDataViewState,
  weekendMeetingWTStudyConductorDefaultState,
} from '@states/settings';
import { personGetDisplayName, speakerGetDisplayName } from '@utils/common';
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
import {
  incomingSpeakersState,
  outgoingSpeakersState,
} from '@states/visiting_speakers';
import { personSchema } from '@services/dexie/schema';
import { speakersCongregationsActiveState } from '@states/speakers_congregations';
import { publicTalksState } from '@states/public_talks';

const usePersonSelector = ({
  type,
  week,
  assignment,
  visitingSpeaker,
  talk,
  circuitOverseer,
  jwStreamRecording,
  freeSoloForce,
  schedule_id,
}: PersonSelectorType) => {
  const timerSource = useRef<NodeJS.Timeout>();

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
  const visitingSpeakers = useRecoilValue(incomingSpeakersState);
  const outgoingSpeakers = useRecoilValue(outgoingSpeakersState);
  const speakersCongregation = useRecoilValue(speakersCongregationsActiveState);
  const talks = useRecoilValue(publicTalksState);
  const coName = useRecoilValue(COScheduleNameState);
  const WTStudyConductorDefault = useRecoilValue(
    weekendMeetingWTStudyConductorDefaultState
  );

  const [optionHeader, setOptionHeader] = useState('');
  const [options, setOptions] = useState<PersonOptionsType[]>([]);
  const [value, setValue] = useState<PersonOptionsType | null | string>(null);
  const [gender, setGender] = useState<GenderType>('male');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [decorator, setDecorator] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [freeSoloText, setFreeSoloText] = useState('');

  const labelBrothers = t('tr_brothers');
  const labelParticipants = t('tr_participants');
  const labelVisitingSpeakers = t('tr_visitingSpeakers');

  const freeSolo =
    visitingSpeaker || circuitOverseer || jwStreamRecording || freeSoloForce;

  const placeHolderIcon = STUDENT_ASSIGNMENT.includes(type) ? (
    <IconPersonPlaceholder />
  ) : (
    <IconMale />
  );

  const isAssistant = assignment.includes('Assistant');

  const schedule = schedules.find((record) => record.weekOf === week);
  const source = sources.find((record) => record.weekOf === week);

  const assignmentsHistory = history.filter(
    (record) =>
      typeof value !== 'string' &&
      record.assignment.person === value?.person_uid
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
      if (freeSolo && typeof option === 'string') {
        return option as unknown as string;
      }

      const result = personGetDisplayName(
        option,
        displayNameEnabled,
        fullnameOption
      );
      return result;
    },
    [displayNameEnabled, fullnameOption, freeSolo]
  );

  const handleGenderUpdate = (
    e: MouseEvent<HTMLLabelElement>,
    value: GenderType
  ) => {
    e.preventDefault();
    setGender(value);
  };

  const handleSaveAssignment = async (value: PersonOptionsType) => {
    if (typeof value === 'object') {
      await schedulesSaveAssignment(schedule, assignment, value, schedule_id);
    }
  };

  const handleFreeSoloTextChange = (text: string) => {
    setFreeSoloText(text);

    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(() => handleSaveSpeaker(text), 1000);
  };

  const handleSaveSpeaker = async (speaker: string) => {
    if (freeSolo) {
      if (speaker.length === 0) {
        await schedulesSaveAssignment(schedule, assignment, null);
      }

      if (speaker.length > 0) {
        // find if text is in options
        const found = options.find(
          (record) =>
            getPersonDisplayName(record).toLowerCase() === speaker.toLowerCase()
        );

        if (found) {
          await schedulesSaveAssignment(schedule, assignment, found);
        }

        if (!found) {
          schedulesSaveAssignment(schedule, assignment, speaker);
        }
      }
    }
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

  // input reset
  useEffect(() => {
    if (circuitOverseer || jwStreamRecording) {
      setOptions([]);
      setFreeSoloText('');
    }
  }, [circuitOverseer, jwStreamRecording]);

  // set selector label
  useEffect(() => {
    if (
      BROTHER_ASSIGNMENT.includes(type) ||
      assignment === 'WM_Speaker_Outgoing'
    ) {
      setOptionHeader(labelBrothers);
    } else {
      setOptionHeader(labelParticipants);
    }
  }, [
    type,
    labelBrothers,
    labelParticipants,
    labelVisitingSpeakers,
    assignment,
  ]);

  // options setter for visiting speakers
  useEffect(() => {
    if (visitingSpeaker) {
      setOptions([]);

      const options: PersonOptionsType[] = [];

      for (const person of visitingSpeakers) {
        if (talk) {
          const activeTalks = person.speaker_data.talks.filter(
            (record) => record._deleted === false && record.talk_number === talk
          );

          if (activeTalks.length === 0) {
            continue;
          }
        }

        const obj: PersonOptionsType = structuredClone(personSchema);

        obj.person_uid = person.person_uid;
        obj.person_data.person_lastname.value =
          person.speaker_data.person_lastname.value;
        obj.person_data.person_firstname.value =
          person.speaker_data.person_firstname.value;
        obj.person_data.male.value = true;

        options.push(obj);
      }

      setOptions(
        options.sort((a, b) =>
          getPersonDisplayName(a).localeCompare(getPersonDisplayName(b))
        )
      );
    }
  }, [
    visitingSpeaker,
    visitingSpeakers,
    speakersCongregation,
    talks,
    talk,
    getPersonDisplayName,
  ]);

  // options setter for outgoing speakers
  useEffect(() => {
    if (assignment === 'WM_Speaker_Outgoing') {
      const options: PersonOptionsType[] = [];

      for (const speaker of outgoingSpeakers) {
        if (talk) {
          const activeTalks = speaker.speaker_data.talks.filter(
            (record) => record._deleted === false && record.talk_number === talk
          );

          if (activeTalks.length === 0) {
            continue;
          }
        }

        const person = personsAll.find(
          (record) => record.person_uid === speaker.person_uid
        );

        options.push(person);
      }

      setOptions(
        options.sort((a, b) =>
          getPersonDisplayName(a).localeCompare(getPersonDisplayName(b))
        )
      );
    }
  }, [assignment, getPersonDisplayName, outgoingSpeakers, talk, personsAll]);

  // options setter for others
  useEffect(() => {
    if (
      !isAssistant &&
      !visitingSpeaker &&
      !jwStreamRecording &&
      assignment !== 'WM_Speaker_Outgoing'
    ) {
      setOptions([]);

      const isMale = gender === 'male';
      const isFemale = gender === 'female';

      if (
        type !== AssignmentCode.MM_LCPart &&
        type !== AssignmentCode.WM_SpeakerSymposium
      ) {
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

      if (type === AssignmentCode.WM_SpeakerSymposium) {
        const persons = personsAll.filter((record) =>
          record.person_data.assignments
            .filter((assignment) => assignment._deleted === false)
            .find(
              (item) =>
                item.code === AssignmentCode.WM_Speaker ||
                item.code === AssignmentCode.WM_SpeakerSymposium
            )
        );

        const options = handleSortOptions(persons);

        setOptions(options);
      }

      if (type === AssignmentCode.MM_LCPart) {
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

        const source = sources.find((record) => record.weekOf === week);
        if (source) {
          const lcParts = ['MM_LCPart1', 'MM_LCPart2'];

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
    visitingSpeaker,
    jwStreamRecording,
  ]);

  // set selected option for outgoing speaker
  useEffect(() => {
    if (week.length > 0 && assignment === 'WM_Speaker_Outgoing') {
      setValue(null);

      const outgoingSchedule = schedule.weekend_meeting.outgoing_talks.find(
        (record) => record.id === schedule_id
      );

      if (outgoingSchedule?.speaker.length > 0) {
        const person = personsAll.find(
          (record) => record.person_uid === outgoingSchedule.speaker
        );
        setValue(person);
      }
    }
  }, [week, schedule, schedule_id, personsAll, assignment]);

  // set selected option for others
  useEffect(() => {
    if (week.length > 0 && assignment !== 'WM_Speaker_Outgoing') {
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
          let assigned: AssignmentCongregation;

          if (Array.isArray(dataSchedule)) {
            assigned = dataSchedule.find((record) => record.type === dataView);
          } else {
            assigned = dataSchedule;
          }

          if (!assigned?.solo) {
            const person = options.find(
              (record) => record.person_uid === assigned?.value
            );

            if (person && person.person_data.female.value) {
              setGender('female');
            }

            if (person && person.person_data.male.value) {
              setGender('male');
            }

            setValue(person || null);
          }

          if (assigned?.solo) {
            setGender('male');
            setValue(assigned.value);
            setFreeSoloText(assigned.value);

            if (circuitOverseer && assigned?.value.length === 0) {
              setValue(coName);
            }
          }
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
    options,
    freeSolo,
    circuitOverseer,
    coName,
  ]);

  // get pre-selected value for assignments
  useEffect(() => {
    if (week.length > 0) {
      // get speaker
      let assigned: AssignmentCongregation;

      if (assignment === 'WM_ClosingPrayer') {
        if (!jwStreamRecording) {
          const closingPrayerPath = ASSIGNMENT_PATH[assignment];
          const scheduleData = schedulesGetData(
            schedule,
            closingPrayerPath
          ) as AssignmentCongregation[];
          const closingPrayer =
            scheduleData.find((record) => record.type === dataView)?.value ||
            '';

          if (closingPrayer.length === 0) {
            const speakerPath = ASSIGNMENT_PATH['WM_Speaker_Part1'];
            const scheduleData = schedulesGetData(
              schedule,
              speakerPath
            ) as AssignmentCongregation[];

            assigned = scheduleData.find((record) => record.type === dataView);
          }
        }
      }

      if (assignment === 'WM_WTStudy_Conductor') {
        const conductorPath = ASSIGNMENT_PATH[assignment];
        const scheduleData = schedulesGetData(
          schedule,
          conductorPath
        ) as AssignmentCongregation[];

        const conductor = scheduleData.find(
          (record) => record.type === dataView
        )?.value;

        if (conductor?.length === 0) {
          const person = personsAll.find(
            (record) => record.person_uid === WTStudyConductorDefault
          );
          setGender('male');
          setValue(person || null);
        }
      }

      if (assigned) {
        if (!assigned.solo) {
          if (!freeSoloForce) {
            const person = options.find(
              (record) => record.person_uid === assigned?.value
            );

            if (person && person.person_data.female.value) {
              setGender('female');
            }

            if (person && person.person_data.male.value) {
              setGender('male');
            }

            setValue(person || null);
            setFreeSoloText('');
          }

          if (freeSoloForce) {
            setFreeSoloText('');

            const person = visitingSpeakers.find(
              (record) => record.person_uid === assigned.value
            );

            if (person) {
              setFreeSoloText(
                speakerGetDisplayName(
                  person,
                  displayNameEnabled,
                  fullnameOption
                )
              );
            }
          }
        }

        if (assigned.solo) {
          setGender('male');
          setValue(assigned.value);
          setFreeSoloText(assigned.value);
        }
      }
    }
  }, [
    week,
    assignment,
    schedule,
    dataView,
    options,
    WTStudyConductorDefault,
    personsAll,
    jwStreamRecording,
    freeSoloForce,
    visitingSpeakers,
    displayNameEnabled,
    fullnameOption,
  ]);

  // checking overlapping assignments
  useEffect(() => {
    const checkAssignments = () => {
      setDecorator(false);
      setHelperText('');

      if (value && week.length > 0) {
        // check week assignments
        const weekAssignments = assignmentsHistory.filter(
          (record) => record.weekOf === week
        );

        if (weekAssignments.length > 1) {
          setDecorator(true);
          setHelperText(t('tr_personAlreadyAssignmentWeek'));

          return;
        }

        const [currentYear, currentMonth] = week.split('/');
        const monthAssignments = assignmentsHistory.filter((record) => {
          const [tmpYear, tmpMonth] = record.weekOf.split('/');

          return tmpYear === currentYear && currentMonth === tmpMonth;
        });

        if (monthAssignments.length > 1) {
          setDecorator(true);
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
    visitingSpeaker,
    freeSolo,
    freeSoloText,
    handleFreeSoloTextChange,
    schedule_id,
  };
};

export default usePersonSelector;
