import { store } from '@states/index';
import {
  MIDWEEK_FULL,
  MIDWEEK_WITH_CBS,
  MIDWEEK_WITH_LIVING,
  MIDWEEK_WITH_STUDENTS,
  MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP,
  MIDWEEK_WITH_TREASURES_TALKS,
  WEEK_TYPE_NO_MEETING,
  WEEKEND_FULL,
  WEEKEND_WITH_TALKS,
  WEEKEND_WITH_WTSTUDY,
} from '@constants/index';
import { Week } from '@definition/week_type';
import {
  AssignmentAYFType,
  AssignmentCongregation,
  AssignmentHistoryType,
  SchedWeekType,
} from '@definition/schedules';
import { PersonType } from '@definition/person';
import { LivingAsChristiansType, SourceWeekType } from '@definition/sources';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import {
  assignmentsHistoryState,
  isPublicTalkCoordinatorState,
  isWeekendEditorState,
  schedulesState,
} from '@states/schedules';
import {
  JWLangLocaleState,
  JWLangState,
  midweekMeetingAuxCounselorDefaultEnabledState,
  midweekMeetingClassCountState,
  midweekMeetingClosingPrayerLinkedState,
  midweekMeetingOpeningPrayerLinkedState,
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
} from '@states/settings';
import {
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
  schedulesSelectRandomPerson,
} from './schedules';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
  sourcesCheckLCElderAssignment,
} from './sources';
import { sourcesState } from '@states/sources';
import { personsState } from '@states/persons';

const handleGetWeekType = (schedule: SchedWeekType) => {
  const dataView = store.get(userDataViewState);

  return (
    schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    )?.value ?? Week.NORMAL
  );
};

const handleMMAssignChairman = (
  weeksAutofill: SchedWeekType[],
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);
  const classCount = store.get(midweekMeetingClassCountState);
  const mmDefaultAuxCounselorEnabled = store.get(
    midweekMeetingAuxCounselorDefaultEnabledState
  );

  let main = '';
  let selected: PersonType;

  for (const schedule of weeksAutofill) {
    const weekType = handleGetWeekType(schedule);

    const noMeeting = WEEK_TYPE_NO_MEETING.includes(weekType);

    if (noMeeting) continue;

    // Main Hall
    main =
      schedule.midweek_meeting.chairman.main_hall.find(
        (record) => record.type === dataView
      )?.value ?? '';

    if (main.length === 0) {
      selected = schedulesSelectRandomPerson({
        type: AssignmentCode.MM_Chairman,
        week: schedule.weekOf,
        history: historyAutofill,
      });

      if (selected) {
        schedulesAutofillSaveAssignment({
          assignment: 'MM_Chairman_A',
          history: historyAutofill,
          schedule,
          value: selected,
        });
      }
    }

    const languageWeekType =
      schedule.midweek_meeting.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL;

    const assignAux =
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType);

    // Aux Class
    if (assignAux && !mmDefaultAuxCounselorEnabled) {
      main = schedule.midweek_meeting.chairman.aux_class_1.value;

      if (weekType === Week.NORMAL && main.length === 0) {
        selected = schedulesSelectRandomPerson({
          type: AssignmentCode.MM_AuxiliaryCounselor,
          week: schedule.weekOf,
          history: historyAutofill,
        });

        if (selected) {
          schedulesAutofillSaveAssignment({
            assignment: 'MM_Chairman_B',
            history: historyAutofill,
            schedule,
            value: selected,
          });
        }
      }
    }
  }
};

const handleMMAssignCBSConductor = (
  weeksAutofill: SchedWeekType[],
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  for (const schedule of weeksAutofill) {
    const weekType = handleGetWeekType(schedule);

    const noMeeting = WEEK_TYPE_NO_MEETING.includes(weekType);

    if (noMeeting) continue;

    if (!MIDWEEK_WITH_CBS.includes(weekType)) continue;

    let assignPart = true;

    const mainWeekType =
      schedule.midweek_meeting.week_type.find(
        (record) => record.type === 'main'
      ).value || Week.NORMAL;

    if (dataView !== 'main' && mainWeekType === Week.CO_VISIT) {
      assignPart = false;
    }

    if (!assignPart) continue;

    main =
      schedule.midweek_meeting.lc_cbs.conductor.find(
        (record) => record.type === dataView
      )?.value || '';

    if (main.length === 0) {
      selected = schedulesSelectRandomPerson({
        type: AssignmentCode.MM_CBSConductor,
        week: schedule.weekOf,
        history: historyAutofill,
      });

      if (selected) {
        schedulesAutofillSaveAssignment({
          assignment: 'MM_LCCBSConductor',
          history: historyAutofill,
          schedule,
          value: selected,
        });
      }
    }
  }
};

const handleMMAssignTGWTalk = (
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  main =
    schedule.midweek_meeting.tgw_talk.find((record) => record.type === dataView)
      ?.value || '';

  if (main.length === 0) {
    selected = schedulesSelectRandomPerson({
      type: AssignmentCode.MM_TGWTalk,
      week: schedule.weekOf,
      history: historyAutofill,
    });
    if (selected) {
      schedulesAutofillSaveAssignment({
        assignment: 'MM_TGWTalk',
        history: historyAutofill,
        schedule,
        value: selected,
      });
    }
  }
};

const handleMMAssignTGWGems = (
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  main =
    schedule.midweek_meeting.tgw_gems.find((record) => record.type === dataView)
      ?.value ?? '';

  if (main.length === 0) {
    selected = schedulesSelectRandomPerson({
      type: AssignmentCode.MM_TGWGems,
      week: schedule.weekOf,
      history: historyAutofill,
    });
    if (selected) {
      schedulesAutofillSaveAssignment({
        assignment: 'MM_TGWGems',
        history: historyAutofill,
        schedule,
        value: selected,
      });
    }
  }
};

const handleMMAssignLCStandard = (
  part: number,
  source: SourceWeekType,
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);
  const lang = store.get(JWLangState);
  const sourceLocale = store.get(JWLangLocaleState);

  let main = '';
  let selected: PersonType;

  const lcPart = source.midweek_meeting[
    `lc_part${part}`
  ] as LivingAsChristiansType;

  const titleOverride =
    lcPart.title.override.find((record) => record.type === dataView)?.value ??
    '';

  const titleDefault = lcPart.title.default[lang] ?? '';
  const title = titleOverride.length > 0 ? titleOverride : titleDefault;

  const descOverride =
    lcPart.desc.override.find((record) => record.type === dataView)?.value ??
    '';

  const descDefault = lcPart.desc.default[lang] ?? '';
  const desc = descOverride.length > 0 ? descOverride : descDefault;

  let noAssignLC = true;
  let isElderPart = false;

  if (title.length > 0) {
    noAssignLC = sourcesCheckLCAssignments(title, sourceLocale);

    if (!noAssignLC) {
      const lcAssign = schedule.midweek_meeting[
        `lc_part${part}`
      ] as AssignmentCongregation[];

      main = lcAssign.find((record) => record.type === dataView)?.value ?? '';

      isElderPart = sourcesCheckLCElderAssignment(title, desc, sourceLocale);

      if (main.length === 0) {
        selected = schedulesSelectRandomPerson({
          type: AssignmentCode.MM_LCPart,
          week: schedule.weekOf,
          isElderPart,
          history: historyAutofill,
        });

        if (selected) {
          schedulesAutofillSaveAssignment({
            assignment: `MM_LCPart${part}` as AssignmentFieldType,
            history: historyAutofill,
            schedule,
            value: selected,
          });
        }
      }
    }
  }
};

const handleMMAssignLCCustom = (
  source: SourceWeekType,
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);
  const sourceLocale = store.get(JWLangLocaleState);

  let main = '';
  let selected: PersonType;

  const lcPart3 = source.midweek_meeting.lc_part3;

  const title =
    lcPart3.title.find((record) => record.type === dataView)?.value ?? '';

  const desc =
    lcPart3.desc.find((record) => record.type === dataView)?.value ?? '';

  if (title.length > 0) {
    const noAssignLC = sourcesCheckLCAssignments(title, sourceLocale);

    if (!noAssignLC) {
      main =
        schedule.midweek_meeting.lc_part3.find(
          (record) => record.type === dataView
        )?.value ?? '';

      const isElderPart = sourcesCheckLCElderAssignment(
        title,
        desc,
        sourceLocale
      );

      if (main.length === 0) {
        selected = schedulesSelectRandomPerson({
          type: AssignmentCode.MM_LCPart,
          week: schedule.weekOf,
          isElderPart,
          history: historyAutofill,
        });

        if (selected) {
          schedulesAutofillSaveAssignment({
            assignment: 'MM_LCPart3',
            history: historyAutofill,
            schedule,
            value: selected,
          });
        }
      }
    }
  }
};

const handleMMAssignCBSReader = (
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  let assignPart = true;

  const mainWeekType =
    schedule.midweek_meeting.week_type.find((record) => record.type === 'main')
      .value || Week.NORMAL;

  if (dataView !== 'main' && mainWeekType === Week.CO_VISIT) {
    assignPart = false;
  }

  if (assignPart) {
    main =
      schedule.midweek_meeting.lc_cbs.reader.find(
        (record) => record.type === dataView
      )?.value ?? '';

    if (main.length === 0) {
      selected = schedulesSelectRandomPerson({
        type: AssignmentCode.MM_CBSReader,
        week: schedule.weekOf,
        history: historyAutofill,
      });

      if (selected) {
        schedulesAutofillSaveAssignment({
          assignment: 'MM_LCCBSReader',
          history: historyAutofill,
          schedule,
          value: selected,
        });
      }
    }
  }
};

const handleMMAssignPrayer = (
  type: 'Opening' | 'Closing',
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  const prayer = schedule.midweek_meeting[
    `${type.toLowerCase()}_prayer`
  ] as AssignmentCongregation[];

  main = prayer.find((record) => record.type === dataView)?.value ?? '';

  if (main.length === 0) {
    selected = schedulesSelectRandomPerson({
      type: AssignmentCode.MM_Prayer,
      week: schedule.weekOf,
      history: historyAutofill,
    });

    if (selected) {
      schedulesAutofillSaveAssignment({
        assignment: `MM_${type}Prayer`,
        history: historyAutofill,
        schedule,
        value: selected,
      });
    }
  }
};

const handleMMAssignBibleReading = (
  classroom: '1' | '2',
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  if (classroom === '1') {
    main =
      schedule.midweek_meeting.tgw_bible_reading.main_hall.find(
        (record) => record.type === dataView
      )?.value ?? '';
  } else {
    main = schedule.midweek_meeting.tgw_bible_reading.aux_class_1.value;
  }

  if (main.length === 0) {
    selected = schedulesSelectRandomPerson({
      type: AssignmentCode.MM_BibleReading,
      week: schedule.weekOf,
      classroom: classroom,
      history: historyAutofill,
    });

    if (selected) {
      const classLabel = classroom === '1' ? 'A' : 'B';

      schedulesAutofillSaveAssignment({
        assignment: `MM_TGWBibleReading_${classLabel}`,
        history: historyAutofill,
        schedule,
        value: selected,
      });
    }
  }
};

const handleMMAssignAYFStudent = (
  source: SourceWeekType,
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);
  const lang = store.get(JWLangState);
  const sourceLocale = store.get(JWLangLocaleState);
  const classCount = store.get(midweekMeetingClassCountState);

  let main = '';
  let selected: PersonType;

  const weekType = handleGetWeekType(schedule);

  const languageWeekType =
    schedule.midweek_meeting.week_type.find((record) => record.type !== 'main')
      ?.value ?? Week.NORMAL;

  const assignAux =
    classCount === 2 &&
    weekType !== Week.CO_VISIT &&
    !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType);

  for (const index of [1, 2, 3, 4]) {
    let field: AssignmentFieldType;

    const ayfPart: AssignmentAYFType =
      schedule.midweek_meeting[`ayf_part${index}`];

    const type: AssignmentCode =
      source.midweek_meeting[`ayf_part${index}`].type[lang];

    const ayfSrc: string = source.midweek_meeting[`ayf_part${index}`].src[lang];

    const isTalk =
      type === AssignmentCode.MM_ExplainingBeliefs
        ? sourcesCheckAYFExplainBeliefsAssignment(ayfSrc, sourceLocale)
        : undefined;

    if (type) {
      const validTypesBase = [
        AssignmentCode.MM_StartingConversation,
        AssignmentCode.MM_FollowingUp,
        AssignmentCode.MM_MakingDisciples,
        AssignmentCode.MM_ExplainingBeliefs,
        AssignmentCode.MM_Talk,
      ];

      const validTypesMainHall = [
        ...validTypesBase,
        AssignmentCode.MM_Discussion,
      ];

      // Main Hall
      if (validTypesMainHall.includes(type)) {
        main =
          ayfPart.main_hall.student.find((record) => record.type === dataView)
            ?.value || '';

        if (main.length === 0) {
          field = `MM_AYFPart${index}_Student_A` as AssignmentFieldType;

          selected = schedulesSelectRandomPerson({
            type,
            week: schedule.weekOf,
            isAYFTalk: isTalk,
            classroom: '1',
            history: historyAutofill,
          });

          if (selected) {
            schedulesAutofillSaveAssignment({
              assignment: field,
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }
      }

      // Aux class
      if (assignAux && validTypesBase.includes(type)) {
        main = ayfPart.aux_class_1.student.value;

        if (weekType === Week.NORMAL && main.length === 0) {
          field = `MM_AYFPart${index}_Student_B` as AssignmentFieldType;
          selected = schedulesSelectRandomPerson({
            type,
            week: schedule.weekOf,
            isAYFTalk: isTalk,
            classroom: '2',
            history: historyAutofill,
          });

          if (selected) {
            schedulesAutofillSaveAssignment({
              assignment: field,
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }
      }
    }
  }
};

const handleMMAssignAYFAssistant = (
  source: SourceWeekType,
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);
  const lang = store.get(JWLangState);
  const sourceLocale = store.get(JWLangLocaleState);
  const classCount = store.get(midweekMeetingClassCountState);

  let main = '';
  let selected: PersonType;

  const weekType = handleGetWeekType(schedule);

  const languageWeekType =
    schedule.midweek_meeting.week_type.find((record) => record.type !== 'main')
      ?.value ?? Week.NORMAL;

  const assignAux =
    classCount === 2 &&
    weekType !== Week.CO_VISIT &&
    !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType);

  for (const index of [1, 2, 3, 4]) {
    let field: AssignmentFieldType;
    const ayfPart: AssignmentAYFType =
      schedule.midweek_meeting[`ayf_part${index}`];
    const type: AssignmentCode =
      source.midweek_meeting[`ayf_part${index}`].type[lang];
    const ayfSrc: string = source.midweek_meeting[`ayf_part${index}`].src[lang];
    const isTalk =
      type === AssignmentCode.MM_ExplainingBeliefs
        ? sourcesCheckAYFExplainBeliefsAssignment(ayfSrc, sourceLocale)
        : undefined;

    if (type) {
      const validTypes = [
        AssignmentCode.MM_StartingConversation,
        AssignmentCode.MM_FollowingUp,
        AssignmentCode.MM_MakingDisciples,
      ];

      // Main Hall
      if (
        validTypes.includes(type) ||
        (type === AssignmentCode.MM_ExplainingBeliefs && !isTalk)
      ) {
        const mainStudent =
          ayfPart.main_hall.student.find((record) => record.type === dataView)
            ?.value || '';

        main =
          ayfPart.main_hall.assistant.find((record) => record.type === dataView)
            ?.value || '';

        if (mainStudent.length > 0 && main.length === 0) {
          field = `MM_AYFPart${index}_Assistant_A` as AssignmentFieldType;

          selected = schedulesSelectRandomPerson({
            type,
            week: schedule.weekOf,
            mainStudent,
            isAYFTalk: isTalk,
            classroom: '1',
            history: historyAutofill,
          });
          if (selected) {
            schedulesAutofillSaveAssignment({
              assignment: field,
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }
      }

      // Aux class
      if (
        assignAux &&
        (validTypes.includes(type) ||
          (type === AssignmentCode.MM_ExplainingBeliefs && !isTalk))
      ) {
        const mainStudent = ayfPart.aux_class_1.student.value;

        main = ayfPart.aux_class_1.assistant.value;

        if (
          weekType === Week.NORMAL &&
          mainStudent.length > 0 &&
          main.length === 0
        ) {
          field = `MM_AYFPart${index}_Assistant_B` as AssignmentFieldType;

          selected = schedulesSelectRandomPerson({
            type,
            week: schedule.weekOf,
            mainStudent,
            isAYFTalk: isTalk,
            classroom: '2',
            history: historyAutofill,
          });

          if (selected) {
            schedulesAutofillSaveAssignment({
              assignment: field,
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }
      }
    }
  }
};

const handleAutofillMidweek = async (weeksList: SchedWeekType[]) => {
  const sources = store.get(sourcesState);
  const assignmentsHistory = store.get(assignmentsHistoryState);
  const mmOpenPrayerLinked = store.get(midweekMeetingOpeningPrayerLinkedState);
  const mmClosingPrayerLinked = store.get(
    midweekMeetingClosingPrayerLinkedState
  );
  const classCount = store.get(midweekMeetingClassCountState);

  // create a shallow copy of schedules and history to improve autofill speed
  const weeksAutofill = structuredClone(weeksList);
  const historyAutofill = structuredClone(assignmentsHistory);

  // Assign Chairman
  handleMMAssignChairman(weeksAutofill, historyAutofill);

  // Assign CBS Conductor
  handleMMAssignCBSConductor(weeksAutofill, historyAutofill);

  // Assign other parts
  for (const schedule of weeksAutofill) {
    const weekType = handleGetWeekType(schedule);

    const noMeeting = WEEK_TYPE_NO_MEETING.includes(weekType);

    if (noMeeting) continue;

    const languageWeekType =
      schedule.midweek_meeting.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL;

    const assignAux =
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType);

    const source = sources.find((record) => record.weekOf === schedule.weekOf);

    if (MIDWEEK_WITH_TREASURES_TALKS.includes(weekType)) {
      // Assign TGW Talk
      handleMMAssignTGWTalk(schedule, historyAutofill);

      // Assign TGW Gems
      handleMMAssignTGWGems(schedule, historyAutofill);
    }

    if (MIDWEEK_WITH_LIVING.includes(weekType)) {
      // Assign LC Part 1
      handleMMAssignLCStandard(1, source, schedule, historyAutofill);

      // Assign LC Part 2
      handleMMAssignLCStandard(2, source, schedule, historyAutofill);

      // Assign LC Part 3
      handleMMAssignLCCustom(source, schedule, historyAutofill);
    }

    // Assign CBS Reader
    if (MIDWEEK_WITH_CBS.includes(weekType)) {
      handleMMAssignCBSReader(schedule, historyAutofill);
    }

    // Assign Opening Prayer
    if (MIDWEEK_FULL.includes(weekType) && mmOpenPrayerLinked === '') {
      handleMMAssignPrayer('Opening', schedule, historyAutofill);
    }

    // Assign Closing Prayer
    if (MIDWEEK_FULL.includes(weekType) && mmClosingPrayerLinked === '') {
      handleMMAssignPrayer('Closing', schedule, historyAutofill);
    }

    if (MIDWEEK_WITH_STUDENTS.includes(weekType)) {
      // Assign Bible Reading Main Hall
      handleMMAssignBibleReading('1', schedule, historyAutofill);

      // Assign Bible Reading Aux Class
      if (assignAux) {
        handleMMAssignBibleReading('2', schedule, historyAutofill);
      }

      // Assign AYF Students
      handleMMAssignAYFStudent(source, schedule, historyAutofill);

      // Assign AYF Assistants
      handleMMAssignAYFAssistant(source, schedule, historyAutofill);
    }
  }

  // save shallow copy to indexeddb
  await dbSchedBulkUpdate(weeksAutofill);

  // update assignments history
  const history = schedulesBuildHistoryList();
  store.set(assignmentsHistoryState, history);
};

const handleWMAssignSpeaker = (
  weeksAutofill: SchedWeekType[],
  historyAutofill: AssignmentHistoryType[]
) => {
  const isPublicTalkCoordinator = store.get(isPublicTalkCoordinatorState);
  const dataView = store.get(userDataViewState);
  const persons = store.get(personsState);

  let main = '';
  let selected: PersonType;

  if (!isPublicTalkCoordinator) return;

  for (const schedule of weeksAutofill) {
    const weekType = handleGetWeekType(schedule);

    const noMeeting = WEEK_TYPE_NO_MEETING.includes(weekType);

    if (noMeeting) continue;

    if (!WEEKEND_WITH_TALKS.includes(weekType)) continue;

    if (weekType === Week.CO_VISIT) continue;

    let assignPart = true;

    if (dataView !== 'main') {
      const mainWeekType =
        schedule.midweek_meeting.week_type.find(
          (record) => record.type === 'main'
        )?.value ?? Week.NORMAL;

      assignPart = mainWeekType !== Week.CO_VISIT;
    }

    if (!assignPart) continue;

    const talkType =
      schedule.weekend_meeting.public_talk_type.find(
        (record) => record.type === dataView
      )?.value ?? 'localSpeaker';

    if (talkType !== 'localSpeaker') continue;

    // #region Speaker 1
    main =
      schedule.weekend_meeting.speaker.part_1.find(
        (record) => record.type === dataView
      )?.value ?? '';

    if (main.length === 0) {
      selected = schedulesSelectRandomPerson({
        type: AssignmentCode.WM_SpeakerSymposium,
        week: schedule.weekOf,
        history: historyAutofill,
      });

      if (selected) {
        schedulesAutofillSaveAssignment({
          assignment: 'WM_Speaker_Part1',
          history: historyAutofill,
          schedule,
          value: selected,
        });
      }
    }
    // #endregion

    // #region Speaker 2
    if (selected) {
      const speaker1 = persons.find(
        (record) => record.person_uid === selected.person_uid
      );

      const speakerSymposium = speaker1.person_data.assignments
        .find((a) => a.type === dataView)
        ?.values.includes(AssignmentCode.WM_SpeakerSymposium);

      if (speakerSymposium) {
        main =
          schedule.weekend_meeting.speaker.part_2.find(
            (record) => record.type === dataView
          )?.value ?? '';

        if (main.length === 0) {
          selected = schedulesSelectRandomPerson({
            type: AssignmentCode.WM_Speaker,
            week: schedule.weekOf,
            history: historyAutofill,
          });

          if (selected) {
            schedulesAutofillSaveAssignment({
              assignment: 'WM_Speaker_Part2',
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }
      }
    }

    // #endregion
  }
};

const handleWMAssignChairman = (
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  main =
    schedule.weekend_meeting.chairman.find((record) => record.type === dataView)
      ?.value || '';

  if (main.length === 0) {
    selected = schedulesSelectRandomPerson({
      type: AssignmentCode.WM_Chairman,
      week: schedule.weekOf,
      history: historyAutofill,
    });

    if (selected) {
      schedulesAutofillSaveAssignment({
        assignment: 'WM_Chairman',
        history: historyAutofill,
        schedule,
        value: selected,
      });
    }
  }
};

const handleWMAssignPrayer = (
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  main =
    schedule.weekend_meeting.opening_prayer.find(
      (record) => record.type === dataView
    )?.value ?? '';

  if (main.length === 0) {
    selected = schedulesSelectRandomPerson({
      type: AssignmentCode.WM_Prayer,
      week: schedule.weekOf,
      history: historyAutofill,
    });

    if (selected) {
      schedulesAutofillSaveAssignment({
        assignment: 'WM_OpeningPrayer',
        history: historyAutofill,
        schedule,
        value: selected,
      });
    }
  }
};

const handleWMStudyReader = (
  schedule: SchedWeekType,
  historyAutofill: AssignmentHistoryType[]
) => {
  const dataView = store.get(userDataViewState);

  let main = '';
  let selected: PersonType;

  main =
    schedule.weekend_meeting.wt_study.reader.find(
      (record) => record.type === dataView
    )?.value ?? '';

  if (main.length === 0) {
    selected = schedulesSelectRandomPerson({
      type: AssignmentCode.WM_WTStudyReader,
      week: schedule.weekOf,
      history: historyAutofill,
    });

    if (selected) {
      schedulesAutofillSaveAssignment({
        assignment: 'WM_WTStudy_Reader',
        history: historyAutofill,
        schedule,
        value: selected,
      });
    }
  }
};

const handleAutofillWeekend = async (weeksList: SchedWeekType[]) => {
  const assignmentsHistory = store.get(assignmentsHistoryState);
  const isWeekendEditor = store.get(isWeekendEditorState);
  const dataView = store.get(userDataViewState);
  const wmOpenPrayerAuto = store.get(
    weekendMeetingOpeningPrayerAutoAssignState
  );

  // create a shallow copy of schedules and history to improve autofill speed
  const weeksAutofill = structuredClone(weeksList);
  const historyAutofill = structuredClone(assignmentsHistory);

  // assign Speakers
  handleWMAssignSpeaker(weeksAutofill, historyAutofill);

  // Assign other parts
  if (isWeekendEditor) {
    for (const schedule of weeksAutofill) {
      const weekType = handleGetWeekType(schedule);

      const noMeeting = WEEK_TYPE_NO_MEETING.includes(weekType);

      if (noMeeting) continue;

      let assignPart = true;

      if (dataView !== 'main') {
        const mainWeekType =
          schedule.midweek_meeting.week_type.find(
            (record) => record.type === 'main'
          )?.value ?? Week.NORMAL;

        assignPart = mainWeekType !== Week.CO_VISIT;
      }

      if (!assignPart) continue;

      // chairman
      if (assignPart && WEEKEND_WITH_TALKS.includes(weekType)) {
        handleWMAssignChairman(schedule, historyAutofill);
      }

      // opening prayer
      if (assignPart && WEEKEND_FULL.includes(weekType) && !wmOpenPrayerAuto) {
        handleWMAssignPrayer(schedule, historyAutofill);
      }

      // wt study reader
      if (
        assignPart &&
        WEEKEND_WITH_WTSTUDY.includes(weekType) &&
        weekType !== Week.CO_VISIT
      ) {
        handleWMStudyReader(schedule, historyAutofill);
      }
    }
  }

  // save shallow copy to indexeddb
  await dbSchedBulkUpdate(weeksAutofill);

  // update assignments history
  const history = schedulesBuildHistoryList();
  store.set(assignmentsHistoryState, history);
};

export const schedulesStartAutofill = async (
  start: string,
  end: string,
  meeting: 'midweek' | 'weekend'
) => {
  try {
    if (start.length === 0 || end.length === 0) return;

    const schedules = store.get(schedulesState);
    const sources = store.get(sourcesState);
    const lang = store.get(JWLangState);

    const weeksList = schedules.filter((schedule) => {
      const isValid = schedule.weekOf >= start && schedule.weekOf <= end;

      if (!isValid) return false;

      const source = sources.find((src) => src.weekOf === schedule.weekOf)!;

      if (meeting === 'midweek') {
        if (!source.midweek_meeting.week_date_locale[lang]) return false;
      }

      if (meeting === 'weekend') {
        if (!source.weekend_meeting.w_study[lang]) return false;
      }

      return isValid;
    });

    if (meeting === 'midweek') {
      await handleAutofillMidweek(weeksList);
    }

    if (meeting === 'weekend') {
      await handleAutofillWeekend(weeksList);
    }
  } catch (error) {
    throw new Error(`autofill error: ${error.message}`);
  }
};
