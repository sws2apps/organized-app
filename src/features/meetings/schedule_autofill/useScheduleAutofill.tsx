import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { displaySnackNotification } from '@services/recoil/app';
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
  midweekMeetingClosingPrayerAutoAssign,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
} from '@states/settings';
import {
  schedulesAutofillSaveAssignment,
  schedulesBuildHistoryList,
  schedulesSelectRandomPerson,
} from '@services/app/schedules';
import { AssignmentAYFType, SchedWeekType } from '@definition/schedules';
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

const useScheduleAutofill = (
  meeting: ScheduleAutofillType['meeting'],
  onClose: ScheduleAutofillType['onClose']
) => {
  const { isPublicTalkCoordinator, isWeekendEditor } = useCurrentUser();

  const [assignmentsHistory, setAssignmentsHistory] = useRecoilState(
    assignmentsHistoryState
  );

  const persons = useRecoilValue(personsState);
  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const lang = useRecoilValue(JWLangState);
  const sourceLocale = useRecoilValue(JWLangLocaleState);
  const mmOpenPrayerAuto = useRecoilValue(
    midweekMeetingOpeningPrayerAutoAssign
  );
  const mmClosingPrayerAuto = useRecoilValue(
    midweekMeetingClosingPrayerAutoAssign
  );
  const wmOpenPrayerAuto = useRecoilValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const mmDefaultAuxCounselorEnabled = useRecoilValue(
    midweekMeetingAuxCounselorDefaultEnabledState
  );

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleAutofillMidweek = async (weeksList: SchedWeekType[]) => {
    let main = '';
    let selected: PersonType;

    // create a shallow copy of schedules and history to improve autofill speed
    const weeksAutofill = structuredClone(weeksList);
    const historyAutofill = structuredClone(assignmentsHistory);

    // Assign Chairman
    for await (const schedule of weeksAutofill) {
      const weekType =
        schedule.midweek_meeting.week_type.find(
          (record) => record.type === dataView
        ).value || Week.NORMAL;

      const noMeeting =
        weekType === Week.ASSEMBLY ||
        weekType === Week.CONVENTION ||
        weekType === Week.MEMORIAL ||
        weekType === Week.NO_MEETING;

      if (!noMeeting) {
        // Main Hall
        main =
          schedule.midweek_meeting.chairman.main_hall.find(
            (record) => record.type === dataView
          )?.value || '';

        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({
            type: AssignmentCode.MM_Chairman,
            week: schedule.weekOf,
            history: historyAutofill,
          });
          if (selected) {
            await schedulesAutofillSaveAssignment({
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
            selected = await schedulesSelectRandomPerson({
              type: AssignmentCode.MM_AuxiliaryCounselor,
              week: schedule.weekOf,
              history: historyAutofill,
            });
            if (selected) {
              await schedulesAutofillSaveAssignment({
                assignment: 'MM_Chairman_B',
                history: historyAutofill,
                schedule,
                value: selected,
              });
            }
          }
        }
      }
    }

    // Assign CBS Conductor
    for await (const schedule of weeksAutofill) {
      const weekType =
        schedule.midweek_meeting.week_type.find(
          (record) => record.type === dataView
        ).value || Week.NORMAL;

      const noMeeting =
        weekType === Week.ASSEMBLY ||
        weekType === Week.CONVENTION ||
        weekType === Week.MEMORIAL ||
        weekType === Week.NO_MEETING;

      if (!noMeeting && weekType === Week.NORMAL) {
        main =
          schedule.midweek_meeting.lc_cbs.conductor.find(
            (record) => record.type === dataView
          )?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({
            type: AssignmentCode.MM_CBSConductor,
            week: schedule.weekOf,
            history: historyAutofill,
          });
          if (selected) {
            await schedulesAutofillSaveAssignment({
              assignment: 'MM_LCCBSConductor',
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }
      }
    }

    // Assign other parts
    for await (const schedule of weeksAutofill) {
      const weekType =
        schedule.midweek_meeting.week_type.find(
          (record) => record.type === dataView
        ).value || Week.NORMAL;

      const noMeeting =
        weekType === Week.ASSEMBLY ||
        weekType === Week.CONVENTION ||
        weekType === Week.MEMORIAL ||
        weekType === Week.NO_MEETING;

      if (!noMeeting) {
        const source = sources.find(
          (record) => record.weekOf === schedule.weekOf
        );

        // Assign TGW Talk
        main =
          schedule.midweek_meeting.tgw_talk.find(
            (record) => record.type === dataView
          )?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({
            type: AssignmentCode.MM_TGWTalk,
            week: schedule.weekOf,
            history: historyAutofill,
          });
          if (selected) {
            await schedulesAutofillSaveAssignment({
              assignment: 'MM_TGWTalk',
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }

        // Assign TGW Gems
        main =
          schedule.midweek_meeting.tgw_gems.find(
            (record) => record.type === dataView
          )?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({
            type: AssignmentCode.MM_TGWGems,
            week: schedule.weekOf,
            history: historyAutofill,
          });
          if (selected) {
            await schedulesAutofillSaveAssignment({
              assignment: 'MM_TGWGems',
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }

        // Assign LC Part 1
        let lcPart = source.midweek_meeting.lc_part1;
        let titleOverride =
          lcPart.title.override.find((record) => record.type === dataView)
            ?.value || '';
        let titleDefault = lcPart.title.default[lang];
        let title = titleOverride.length > 0 ? titleOverride : titleDefault;
        let descOverride =
          lcPart.desc.override.find((record) => record.type === dataView)
            ?.value || '';
        let descDefault = lcPart.desc.default[lang];
        let desc = titleOverride.length > 0 ? descOverride : descDefault;

        let noAssignLC = true;
        let isElderPart = false;

        if (title.length > 0) {
          noAssignLC = sourcesCheckLCAssignments(title, sourceLocale);

          if (!noAssignLC) {
            main =
              schedule.midweek_meeting.lc_part1.find(
                (record) => record.type === dataView
              )?.value || '';
            isElderPart = sourcesCheckLCElderAssignment(
              title,
              desc,
              sourceLocale
            );

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.MM_LCPart,
                week: schedule.weekOf,
                isElderPart,
                history: historyAutofill,
              });

              if (selected) {
                await schedulesAutofillSaveAssignment({
                  assignment: 'MM_LCPart1',
                  history: historyAutofill,
                  schedule,
                  value: selected,
                });
              }
            }
          }
        }

        // Assign LC Part 2
        lcPart = source.midweek_meeting.lc_part2;

        titleOverride =
          lcPart.title.override.find((record) => record.type === dataView)
            ?.value || '';
        titleDefault = lcPart.title.default[lang] || '';
        title = titleOverride.length > 0 ? titleOverride : titleDefault;
        descOverride =
          lcPart.desc.override.find((record) => record.type === dataView)
            ?.value || '';
        descDefault = lcPart.desc.default[lang];
        desc = titleOverride.length > 0 ? descOverride : descDefault;

        if (title.length > 0) {
          noAssignLC = sourcesCheckLCAssignments(title, sourceLocale);

          if (!noAssignLC) {
            main =
              schedule.midweek_meeting.lc_part2.find(
                (record) => record.type === dataView
              )?.value || '';
            isElderPart = sourcesCheckLCElderAssignment(
              title,
              desc,
              sourceLocale
            );

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.MM_LCPart,
                week: schedule.weekOf,
                isElderPart,
                history: historyAutofill,
              });

              if (selected) {
                await schedulesAutofillSaveAssignment({
                  assignment: 'MM_LCPart2',
                  history: historyAutofill,
                  schedule,
                  value: selected,
                });
              }
            }
          }
        }

        // Assign LC Part 3
        const lcPart3 = source.midweek_meeting.lc_part3;

        title =
          lcPart3.title.find((record) => record.type === dataView)?.value || '';
        desc =
          lcPart3.desc.find((record) => record.type === dataView)?.value || '';

        if (title.length > 0) {
          noAssignLC = sourcesCheckLCAssignments(title, sourceLocale);

          if (!noAssignLC) {
            main =
              schedule.midweek_meeting.lc_part3.find(
                (record) => record.type === dataView
              )?.value || '';
            isElderPart = sourcesCheckLCElderAssignment(
              title,
              desc,
              sourceLocale
            );

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.MM_LCPart,
                week: schedule.weekOf,
                isElderPart,
                history: historyAutofill,
              });

              if (selected) {
                await schedulesAutofillSaveAssignment({
                  assignment: 'MM_LCPart3',
                  history: historyAutofill,
                  schedule,
                  value: selected,
                });
              }
            }
          }
        }

        // Assign CBS Reader
        if (weekType === Week.NORMAL) {
          main =
            schedule.midweek_meeting.lc_cbs.reader.find(
              (record) => record.type === dataView
            )?.value || '';
          if (main.length === 0) {
            selected = await schedulesSelectRandomPerson({
              type: AssignmentCode.MM_CBSReader,
              week: schedule.weekOf,
              history: historyAutofill,
            });
            if (selected) {
              await schedulesAutofillSaveAssignment({
                assignment: 'MM_LCCBSReader',
                history: historyAutofill,
                schedule,
                value: selected,
              });
            }
          }
        }

        // Assign Opening Prayer
        if (!mmOpenPrayerAuto) {
          main =
            schedule.midweek_meeting.opening_prayer.find(
              (record) => record.type === dataView
            )?.value || '';
          if (main.length === 0) {
            selected = await schedulesSelectRandomPerson({
              type: AssignmentCode.MM_Prayer,
              week: schedule.weekOf,
              history: historyAutofill,
            });
            if (selected) {
              await schedulesAutofillSaveAssignment({
                assignment: 'MM_OpeningPrayer',
                history: historyAutofill,
                schedule,
                value: selected,
              });
            }
          }
        }

        // Assign Closing Prayer
        if (!mmClosingPrayerAuto) {
          main =
            schedule.midweek_meeting.closing_prayer.find(
              (record) => record.type === dataView
            )?.value || '';
          if (main.length === 0) {
            selected = await schedulesSelectRandomPerson({
              type: AssignmentCode.MM_Prayer,
              week: schedule.weekOf,
              history: historyAutofill,
            });
            if (selected) {
              await schedulesAutofillSaveAssignment({
                assignment: 'MM_ClosingPrayer',
                history: historyAutofill,
                schedule,
                value: selected,
              });
            }
          }
        }

        // Assign Bible Reading Main Hall
        main =
          schedule.midweek_meeting.tgw_bible_reading.main_hall.find(
            (record) => record.type === dataView
          )?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({
            type: AssignmentCode.MM_BibleReading,
            week: schedule.weekOf,
            classroom: '1',
            history: historyAutofill,
          });
          if (selected) {
            await schedulesAutofillSaveAssignment({
              assignment: 'MM_TGWBibleReading_A',
              history: historyAutofill,
              schedule,
              value: selected,
            });
          }
        }

        // Assign Bible Reading Aux Class
        if (classCount === 2) {
          main = schedule.midweek_meeting.tgw_bible_reading.aux_class_1.value;

          if (weekType === Week.NORMAL && main.length === 0) {
            selected = await schedulesSelectRandomPerson({
              type: AssignmentCode.MM_BibleReading,
              week: schedule.weekOf,
              classroom: '2',
              history: historyAutofill,
            });
            if (selected) {
              await schedulesAutofillSaveAssignment({
                assignment: 'MM_TGWBibleReading_B',
                history: historyAutofill,
                schedule,
                value: selected,
              });
            }
          }
        }

        // Assign AYF Students
        for await (const index of [1, 2, 3, 4]) {
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
                ayfPart.main_hall.student.find(
                  (record) => record.type === dataView
                )?.value || '';
              if (main.length === 0) {
                field = `MM_AYFPart${index}_Student_A` as AssignmentFieldType;

                selected = await schedulesSelectRandomPerson({
                  type,
                  week: schedule.weekOf,
                  isAYFTalk: isTalk,
                  classroom: '1',
                  history: historyAutofill,
                });
                if (selected) {
                  await schedulesAutofillSaveAssignment({
                    assignment: field,
                    history: historyAutofill,
                    schedule,
                    value: selected,
                  });
                }
              }
            }

            // Aux class
            if (classCount === 2) {
              if (validTypesBase.includes(type)) {
                main = ayfPart.aux_class_1.student.value;

                if (weekType === Week.NORMAL && main.length === 0) {
                  field = `MM_AYFPart${index}_Student_B` as AssignmentFieldType;
                  selected = await schedulesSelectRandomPerson({
                    type,
                    week: schedule.weekOf,
                    isAYFTalk: isTalk,
                    classroom: '2',
                    history: historyAutofill,
                  });
                  if (selected) {
                    await schedulesAutofillSaveAssignment({
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
        }

        // Assign AYF Assistants
        for await (const index of [1, 2, 3, 4]) {
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
                ayfPart.main_hall.student.find(
                  (record) => record.type === dataView
                )?.value || '';

              main =
                ayfPart.main_hall.assistant.find(
                  (record) => record.type === dataView
                )?.value || '';

              if (mainStudent.length > 0 && main.length === 0) {
                field = `MM_AYFPart${index}_Assistant_A` as AssignmentFieldType;

                selected = await schedulesSelectRandomPerson({
                  type,
                  week: schedule.weekOf,
                  mainStudent,
                  isAYFTalk: isTalk,
                  classroom: '1',
                  history: historyAutofill,
                });
                if (selected) {
                  await schedulesAutofillSaveAssignment({
                    assignment: field,
                    history: historyAutofill,
                    schedule,
                    value: selected,
                  });
                }
              }
            }

            // Aux class
            if (classCount === 2) {
              if (
                validTypes.includes(type) ||
                (type === AssignmentCode.MM_ExplainingBeliefs && !isTalk)
              ) {
                const mainStudent = ayfPart.aux_class_1.student.value;

                main = ayfPart.aux_class_1.assistant.value;

                if (
                  weekType === Week.NORMAL &&
                  mainStudent.length > 0 &&
                  main.length === 0
                ) {
                  field =
                    `MM_AYFPart${index}_Assistant_B` as AssignmentFieldType;
                  selected = await schedulesSelectRandomPerson({
                    type,
                    week: schedule.weekOf,
                    mainStudent,
                    isAYFTalk: isTalk,
                    classroom: '2',
                    history: historyAutofill,
                  });
                  if (selected) {
                    await schedulesAutofillSaveAssignment({
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
        }
      }
    }

    // save shallow copy to indexeddb
    await dbSchedBulkUpdate(weeksAutofill);

    // update assignments history
    const history = await schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  const handleAutofillWeekend = async (weeksList: SchedWeekType[]) => {
    let main = '';
    let selected: PersonType;

    // create a shallow copy of schedules and history to improve autofill speed
    const weeksAutofill = structuredClone(weeksList);
    const historyAutofill = structuredClone(assignmentsHistory);

    // #region Assign Speakers
    if (isPublicTalkCoordinator) {
      for await (const schedule of weeksAutofill) {
        const weekType =
          schedule.midweek_meeting.week_type.find(
            (record) => record.type === dataView
          ).value || Week.NORMAL;

        const noMeeting =
          weekType === Week.ASSEMBLY ||
          weekType === Week.CONVENTION ||
          weekType === Week.MEMORIAL ||
          weekType === Week.NO_MEETING;

        if (!noMeeting) {
          if (weekType !== Week.CO_VISIT) {
            const talkType =
              schedule.weekend_meeting.public_talk_type.find(
                (record) => record.type === dataView
              ).value || 'localSpeaker';

            if (talkType === 'localSpeaker') {
              // #region Speaker 1
              main =
                schedule.weekend_meeting.speaker.part_1.find(
                  (record) => record.type === dataView
                )?.value || '';

              if (main.length === 0) {
                selected = await schedulesSelectRandomPerson({
                  type: AssignmentCode.WM_SpeakerSymposium,
                  week: schedule.weekOf,
                  history: historyAutofill,
                });

                if (selected) {
                  await schedulesAutofillSaveAssignment({
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
                const speakerSymposium = speaker1.person_data.assignments.find(
                  (record) =>
                    record._deleted === false &&
                    record.code === AssignmentCode.WM_SpeakerSymposium
                );

                if (speakerSymposium) {
                  main =
                    schedule.weekend_meeting.speaker.part_2.find(
                      (record) => record.type === dataView
                    )?.value || '';

                  if (main.length === 0) {
                    selected = await schedulesSelectRandomPerson({
                      type: AssignmentCode.WM_Speaker,
                      week: schedule.weekOf,
                      history: historyAutofill,
                    });

                    if (selected) {
                      await schedulesAutofillSaveAssignment({
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
          }
        }
      }
    }
    // #endregion

    // #region Assign other parts
    if (isWeekendEditor) {
      for await (const schedule of weeksAutofill) {
        const weekType =
          schedule.midweek_meeting.week_type.find(
            (record) => record.type === dataView
          ).value || Week.NORMAL;

        const noMeeting =
          weekType === Week.ASSEMBLY ||
          weekType === Week.CONVENTION ||
          weekType === Week.MEMORIAL ||
          weekType === Week.NO_MEETING;

        if (!noMeeting) {
          // #region Chairman
          main =
            schedule.weekend_meeting.chairman.find(
              (record) => record.type === dataView
            )?.value || '';

          if (main.length === 0) {
            selected = await schedulesSelectRandomPerson({
              type: AssignmentCode.WM_Chairman,
              week: schedule.weekOf,
              history: historyAutofill,
            });

            if (selected) {
              await schedulesAutofillSaveAssignment({
                assignment: 'WM_Chairman',
                history: historyAutofill,
                schedule,
                value: selected,
              });
            }
          }
          // #endregion

          // #region Opening Prayer
          if (!wmOpenPrayerAuto) {
            main =
              schedule.weekend_meeting.opening_prayer.find(
                (record) => record.type === dataView
              )?.value || '';

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.WM_Prayer,
                week: schedule.weekOf,
                history: historyAutofill,
              });

              if (selected) {
                await schedulesAutofillSaveAssignment({
                  assignment: 'WM_OpeningPrayer',
                  history: historyAutofill,
                  schedule,
                  value: selected,
                });
              }
            }
          }
          // #endregion

          // #region Opening Prayer
          if (weekType !== Week.CO_VISIT) {
            main =
              schedule.weekend_meeting.wt_study.reader.find(
                (record) => record.type === dataView
              )?.value || '';

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.WM_WTStudyReader,
                week: schedule.weekOf,
                history: historyAutofill,
              });

              if (selected) {
                await schedulesAutofillSaveAssignment({
                  assignment: 'WM_WTStudy_Reader',
                  history: historyAutofill,
                  schedule,
                  value: selected,
                });
              }
            }
          }
          // #endregion
        }
      }
    }
    // #endregion

    // save shallow copy to indexeddb
    await dbSchedBulkUpdate(weeksAutofill);

    // update assignments history
    const history = await schedulesBuildHistoryList();
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

      await displaySnackNotification({
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
