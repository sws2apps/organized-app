import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  MIDWEEK_FULL,
  MIDWEEK_WITH_CBS,
  MIDWEEK_WITH_LIVING,
  MIDWEEK_WITH_STUDENTS,
  MIDWEEK_WITH_TREASURES_TALKS,
  WEEK_TYPE_NO_MEETING,
  WEEKEND_FULL,
  WEEKEND_WITH_TALKS,
  WEEKEND_WITH_WTSTUDY,
} from '@constants/index';
import { displaySnackNotification } from '@services/states/app';
import { useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { PersonType } from '@definition/person';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
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
} from '@services/app/schedules';
import {
  AssignmentAYFType,
  AssignmentCongregation,
  AssignmentHistoryType,
  SchedWeekType,
} from '@definition/schedules';
import { ScheduleAutofillType } from './index.types';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';
import {
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
  sourcesCheckLCElderAssignment,
} from '@services/app/sources';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';
import { personsState } from '@states/persons';
import { LivingAsChristiansType, SourceWeekType } from '@definition/sources';

const useScheduleAutofill = (
  meeting: ScheduleAutofillType['meeting'],
  onClose: ScheduleAutofillType['onClose']
) => {
  const { isPublicTalkCoordinator, isWeekendEditor } = useCurrentUser();

  const [assignmentsHistory, setAssignmentsHistory] = useAtom(
    assignmentsHistoryState
  );

  const persons = useAtomValue(personsState);
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const lang = useAtomValue(JWLangState);
  const sourceLocale = useAtomValue(JWLangLocaleState);
  const mmOpenPrayerLinked = useAtomValue(
    midweekMeetingOpeningPrayerLinkedState
  );
  const mmClosingPrayerLinked = useAtomValue(
    midweekMeetingClosingPrayerLinkedState
  );
  const wmOpenPrayerAuto = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const mmDefaultAuxCounselorEnabled = useAtomValue(
    midweekMeetingAuxCounselorDefaultEnabledState
  );

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleGetWeekType = (schedule: SchedWeekType) => {
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

      // Aux Class
      if (classCount === 2 && !mmDefaultAuxCounselorEnabled) {
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
    let main = '';
    let selected: PersonType;
    main =
      schedule.midweek_meeting.tgw_talk.find(
        (record) => record.type === dataView
      )?.value || '';

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
    let main = '';
    let selected: PersonType;

    main =
      schedule.midweek_meeting.tgw_gems.find(
        (record) => record.type === dataView
      )?.value ?? '';

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
    let main = '';
    let selected: PersonType;

    let assignPart = true;

    const mainWeekType =
      schedule.midweek_meeting.week_type.find(
        (record) => record.type === 'main'
      ).value || Week.NORMAL;

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
    let main = '';
    let selected: PersonType;

    const weekType = handleGetWeekType(schedule);

    for (const index of [1, 2, 3, 4]) {
      let field: AssignmentFieldType;

      const ayfPart: AssignmentAYFType =
        schedule.midweek_meeting[`ayf_part${index}`];

      const type: AssignmentCode =
        source.midweek_meeting[`ayf_part${index}`].type[lang];

      const ayfSrc: string =
        source.midweek_meeting[`ayf_part${index}`].src[lang];

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
        if (classCount === 2 && validTypesBase.includes(type)) {
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
    let main = '';
    let selected: PersonType;

    const weekType = handleGetWeekType(schedule);

    for (const index of [1, 2, 3, 4]) {
      let field: AssignmentFieldType;
      const ayfPart: AssignmentAYFType =
        schedule.midweek_meeting[`ayf_part${index}`];
      const type: AssignmentCode =
        source.midweek_meeting[`ayf_part${index}`].type[lang];
      const ayfSrc: string =
        source.midweek_meeting[`ayf_part${index}`].src[lang];
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
            ayfPart.main_hall.assistant.find(
              (record) => record.type === dataView
            )?.value || '';

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
          classCount === 2 &&
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

      const source = sources.find(
        (record) => record.weekOf === schedule.weekOf
      );

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
        if (classCount === 2 && weekType === Week.NORMAL) {
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
    setAssignmentsHistory(history);
  };

  const handleWMAssignSpeaker = (
    weeksAutofill: SchedWeekType[],
    historyAutofill: AssignmentHistoryType[]
  ) => {
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
    let main = '';
    let selected: PersonType;

    main =
      schedule.weekend_meeting.chairman.find(
        (record) => record.type === dataView
      )?.value || '';

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
        if (
          assignPart &&
          WEEKEND_FULL.includes(weekType) &&
          !wmOpenPrayerAuto
        ) {
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
    setAssignmentsHistory(history);
  };

  const handleStartAutoFill = async () => {
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      const weeksList = schedules.filter(
        (record) => record.weekOf >= startWeek && record.weekOf <= endWeek
      );

      if (meeting === 'midweek') {
        await handleAutofillMidweek(weeksList);
      }

      if (meeting === 'weekend') {
        await handleAutofillWeekend(weeksList);
      }

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    handleSetStartWeek,
    handleSetEndWeek,
    isProcessing,
    handleStartAutoFill,
  };
};

export default useScheduleAutofill;
