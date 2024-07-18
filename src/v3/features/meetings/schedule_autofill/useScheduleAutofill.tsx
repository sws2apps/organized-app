import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { schedulesState } from '@states/schedules';
import { PersonType } from '@definition/person';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { midweekMeetingClassCountState, midweekMeetingOpeningPrayerAutoAssign, userDataViewState } from '@states/settings';
import { schedulesSaveAssignment, schedulesSelectRandomPerson, schedulesWeekAssignmentsInfo } from '@services/app/schedules';
import { AssignmentAYFType, SchedWeekType } from '@definition/schedules';
import { ScheduleAutofillType } from './index.types';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/app';
import { sourcesCheckAYFExplainBeliefsAssignment, sourcesCheckLCAssignments, sourcesCheckLCElderAssignment } from '@services/app/sources';
import { dbSchedGet } from '@services/dexie/schedules';

const useScheduleAutofill = (meeting: ScheduleAutofillType['meeting'], onClose: ScheduleAutofillType['onClose']) => {
  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);
  const sources = useRecoilValue(sourcesState);
  const dataView = useRecoilValue(userDataViewState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const mmOpenPrayerAuto = useRecoilValue(midweekMeetingOpeningPrayerAutoAssign);
  const lang = useRecoilValue(JWLangState);

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [assignmentsTotal, setAssignmentsTotal] = useState(0);
  const [assignmentsCurrent, setAssignmentsCurrent] = useState(0);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleAutofillMidweek = async (weeksList: SchedWeekType[]) => {
    let main = '';
    let selected: PersonType;

    // Assign Chairman
    for await (const schedule of weeksList) {
      const noMeeting = schedule.midweek_meeting.canceled.find((record) => record.type === dataView)?.value ?? false;

      if (!noMeeting) {
        // Main Hall
        main = schedule.midweek_meeting.chairman.main_hall.find((record) => record.type === dataView)?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_Chairman, week: schedule.weekOf });
          if (selected) {
            await schedulesSaveAssignment(schedule, 'MM_Chairman_A', selected);
            setAssignmentsCurrent((prev) => prev + 1);
          }
        }

        // Aux Class
        if (classCount === 2) {
          const weekType = schedule.week_type.find((record) => record.type === dataView)?.value ?? Week.NORMAL;
          main = schedule.midweek_meeting.chairman.aux_class_1.value;

          if (weekType === Week.NORMAL && main.length === 0) {
            selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_Chairman, week: schedule.weekOf });
            if (selected) {
              await schedulesSaveAssignment(schedule, 'MM_Chairman_B', selected);
              setAssignmentsCurrent((prev) => prev + 1);
            }
          }
        }
      }
    }

    // Assign CBS Conductor
    for await (const schedule of weeksList) {
      const noMeeting = schedule.midweek_meeting.canceled.find((record) => record.type === dataView)?.value ?? false;
      const weekType = schedule.week_type.find((record) => record.type === dataView)?.value ?? Week.NORMAL;

      if (!noMeeting && weekType === Week.NORMAL) {
        main = schedule.midweek_meeting.lc_cbs.conductor.find((record) => record.type === dataView)?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_CBSConductor, week: schedule.weekOf });
          if (selected) {
            await schedulesSaveAssignment(schedule, 'MM_LCCBSConductor', selected);
            setAssignmentsCurrent((prev) => prev + 1);
          }
        }
      }
    }

    for await (const schedule of weeksList) {
      const noMeeting = schedule.midweek_meeting.canceled.find((record) => record.type === dataView)?.value ?? false;

      if (!noMeeting) {
        const weekType = schedule.week_type.find((record) => record.type === dataView)?.value ?? Week.NORMAL;
        const source = sources.find((record) => record.weekOf === schedule.weekOf);

        // Assign TGW Talk
        main = schedule.midweek_meeting.tgw_talk.find((record) => record.type === dataView)?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_TGWTalk, week: schedule.weekOf });
          if (selected) {
            await schedulesSaveAssignment(schedule, 'MM_TGWTalk', selected);
            setAssignmentsCurrent((prev) => prev + 1);
          }
        }

        // Assign TGW Gems
        main = schedule.midweek_meeting.tgw_gems.find((record) => record.type === dataView)?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_TGWGems, week: schedule.weekOf });
          if (selected) {
            await schedulesSaveAssignment(schedule, 'MM_TGWGems', selected);
            setAssignmentsCurrent((prev) => prev + 1);
          }
        }

        // Assign LC Part 1
        let lcPart = source.midweek_meeting.lc_part1;
        let titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value || '';
        let titleDefault = lcPart.title.default[lang];
        let title = titleOverride.length > 0 ? titleOverride : titleDefault;
        let descOverride = lcPart.desc.override.find((record) => record.type === dataView)?.value || '';
        let descDefault = lcPart.desc.default[lang];
        let desc = titleOverride.length > 0 ? descOverride : descDefault;

        let noAssignLC = true;
        let isElderPart = false;

        if (title.length > 0) {
          noAssignLC = sourcesCheckLCAssignments(title);

          if (!noAssignLC) {
            main = schedule.midweek_meeting.lc_part1.find((record) => record.type === dataView)?.value || '';
            isElderPart = sourcesCheckLCElderAssignment(title, desc);

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.MM_LCPart,
                week: schedule.weekOf,
                isElderPart,
              });

              if (selected) {
                await schedulesSaveAssignment(schedule, 'MM_LCPart1', selected);
                setAssignmentsCurrent((prev) => prev + 1);
              }
            }
          }
        }

        // Assign LC Part 2
        lcPart = source.midweek_meeting.lc_part2;

        titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value || '';
        titleDefault = lcPart.title.default[lang] || '';
        title = titleOverride.length > 0 ? titleOverride : titleDefault;
        descOverride = lcPart.desc.override.find((record) => record.type === dataView)?.value || '';
        descDefault = lcPart.desc.default[lang];
        desc = titleOverride.length > 0 ? descOverride : descDefault;

        if (title.length > 0) {
          noAssignLC = sourcesCheckLCAssignments(title);

          if (!noAssignLC) {
            main = schedule.midweek_meeting.lc_part2.find((record) => record.type === dataView)?.value || '';
            isElderPart = sourcesCheckLCElderAssignment(title, desc);

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.MM_LCPart,
                week: schedule.weekOf,
                isElderPart,
              });

              if (selected) {
                await schedulesSaveAssignment(schedule, 'MM_LCPart2', selected);
                setAssignmentsCurrent((prev) => prev + 1);
              }
            }
          }
        }

        // Assign LC Part 3
        const lcPart3 = source.midweek_meeting.lc_part3;

        title = lcPart3.title.find((record) => record.type === dataView)?.value || '';
        desc = lcPart3.desc.find((record) => record.type === dataView)?.value || '';

        if (title.length > 0) {
          noAssignLC = sourcesCheckLCAssignments(title);

          if (!noAssignLC) {
            main = schedule.midweek_meeting.lc_part3.find((record) => record.type === dataView)?.value || '';
            isElderPart = sourcesCheckLCElderAssignment(title, desc);

            if (main.length === 0) {
              selected = await schedulesSelectRandomPerson({
                type: AssignmentCode.MM_LCPart,
                week: schedule.weekOf,
                isElderPart,
              });

              if (selected) {
                await schedulesSaveAssignment(schedule, 'MM_LCPart3', selected);
                setAssignmentsCurrent((prev) => prev + 1);
              }
            }
          }
        }

        // Assign CBS Reader
        if (weekType === Week.NORMAL) {
          main = schedule.midweek_meeting.lc_cbs.reader.find((record) => record.type === dataView)?.value || '';
          if (main.length === 0) {
            selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_CBSReader, week: schedule.weekOf });
            if (selected) {
              await schedulesSaveAssignment(schedule, 'MM_LCCBSReader', selected);
              setAssignmentsCurrent((prev) => prev + 1);
            }
          }
        }

        // Assign Opening Prayer
        if (!mmOpenPrayerAuto) {
          main = schedule.midweek_meeting.opening_prayer.find((record) => record.type === dataView)?.value || '';
          if (main.length === 0) {
            selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_Prayer, week: schedule.weekOf });
            if (selected) {
              await schedulesSaveAssignment(schedule, 'MM_OpeningPrayer', selected);
              setAssignmentsCurrent((prev) => prev + 1);
            }
          }
        }

        // Assign Closing Prayer
        main = schedule.midweek_meeting.closing_prayer.find((record) => record.type === dataView)?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_Prayer, week: schedule.weekOf });
          if (selected) {
            await schedulesSaveAssignment(schedule, 'MM_ClosingPrayer', selected);
            setAssignmentsCurrent((prev) => prev + 1);
          }
        }

        // Assign Bible Reading Main Hall
        main = schedule.midweek_meeting.tgw_bible_reading.main_hall.find((record) => record.type === dataView)?.value || '';
        if (main.length === 0) {
          selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_BibleReading, week: schedule.weekOf, classroom: '1' });
          if (selected) {
            await schedulesSaveAssignment(schedule, 'MM_TGWBibleReading_A', selected);
            setAssignmentsCurrent((prev) => prev + 1);
          }
        }

        // Assign Bible Reading Aux Class
        if (classCount === 2) {
          const weekType = schedule.week_type.find((record) => record.type === dataView)?.value ?? Week.NORMAL;
          main = schedule.midweek_meeting.tgw_bible_reading.aux_class_1.value;

          if (weekType === Week.NORMAL && main.length === 0) {
            selected = await schedulesSelectRandomPerson({ type: AssignmentCode.MM_BibleReading, week: schedule.weekOf, classroom: '2' });
            if (selected) {
              await schedulesSaveAssignment(schedule, 'MM_TGWBibleReading_B', selected);
              setAssignmentsCurrent((prev) => prev + 1);
            }
          }
        }

        // Assign AYF Students
        for await (const index of [1, 2, 3, 4]) {
          let field: AssignmentFieldType;
          const ayfPart: AssignmentAYFType = schedule.midweek_meeting[`ayf_part${index}`];
          const type: AssignmentCode = source.midweek_meeting[`ayf_part${index}`].type[lang];
          const ayfSrc: string = source.midweek_meeting[`ayf_part${index}`].src[lang];
          const isTalk = type === AssignmentCode.MM_ExplainingBeliefs ? sourcesCheckAYFExplainBeliefsAssignment(ayfSrc) : undefined;

          if (type) {
            const validTypesBase = [
              AssignmentCode.MM_StartingConversation,
              AssignmentCode.MM_FollowingUp,
              AssignmentCode.MM_MakingDisciples,
              AssignmentCode.MM_ExplainingBeliefs,
              AssignmentCode.MM_Talk,
            ];

            const validTypesMainHall = [...validTypesBase, AssignmentCode.MM_Discussion];

            // Main Hall
            if (validTypesMainHall.includes(type)) {
              main = ayfPart.main_hall.student.find((record) => record.type === dataView)?.value || '';
              if (main.length === 0) {
                field = `MM_AYFPart${index}_Student_A` as AssignmentFieldType;

                selected = await schedulesSelectRandomPerson({ type, week: schedule.weekOf, isAYFTalk: isTalk, classroom: '1' });
                if (selected) {
                  await schedulesSaveAssignment(schedule, field, selected);
                  setAssignmentsCurrent((prev) => prev + 1);
                }
              }
            }

            // Aux class
            if (classCount === 2) {
              if (validTypesBase.includes(type)) {
                const weekType = schedule.week_type.find((record) => record.type === dataView)?.value ?? Week.NORMAL;
                main = ayfPart.aux_class_1.student.value;

                if (weekType === Week.NORMAL && main.length === 0) {
                  field = `MM_AYFPart${index}_Student_B` as AssignmentFieldType;
                  selected = await schedulesSelectRandomPerson({ type, week: schedule.weekOf, isAYFTalk: isTalk, classroom: '2' });
                  if (selected) {
                    await schedulesSaveAssignment(schedule, field, selected);
                    setAssignmentsCurrent((prev) => prev + 1);
                  }
                }
              }
            }
          }
        }

        // Assign AYF Assistants
        for await (const index of [1, 2, 3, 4]) {
          let field: AssignmentFieldType;
          const ayfPart: AssignmentAYFType = schedule.midweek_meeting[`ayf_part${index}`];
          const type: AssignmentCode = source.midweek_meeting[`ayf_part${index}`].type[lang];
          const ayfSrc: string = source.midweek_meeting[`ayf_part${index}`].src[lang];
          const isTalk = type === AssignmentCode.MM_ExplainingBeliefs ? sourcesCheckAYFExplainBeliefsAssignment(ayfSrc) : undefined;
          const recentSchedules = await dbSchedGet(schedule.weekOf);
          const recentAyfPart: AssignmentAYFType = recentSchedules.midweek_meeting[`ayf_part${index}`];

          if (type) {
            const validTypes = [AssignmentCode.MM_StartingConversation, AssignmentCode.MM_FollowingUp, AssignmentCode.MM_MakingDisciples];

            // Main Hall
            if (validTypes.includes(type) || (type === AssignmentCode.MM_ExplainingBeliefs && !isTalk)) {
              const mainStudent = recentAyfPart.main_hall.student.find((record) => record.type === dataView)?.value || '';

              main = ayfPart.main_hall.assistant.find((record) => record.type === dataView)?.value || '';

              if (mainStudent.length > 0 && main.length === 0) {
                field = `MM_AYFPart${index}_Assistant_A` as AssignmentFieldType;

                selected = await schedulesSelectRandomPerson({ type, week: schedule.weekOf, mainStudent, isAYFTalk: isTalk, classroom: '1' });
                if (selected) {
                  await schedulesSaveAssignment(schedule, field, selected);
                  setAssignmentsCurrent((prev) => prev + 1);
                }
              }
            }

            // Aux class
            if (classCount === 2) {
              if (validTypes.includes(type) || (type === AssignmentCode.MM_ExplainingBeliefs && isTalk)) {
                const weekType = schedule.week_type.find((record) => record.type === dataView)?.value ?? Week.NORMAL;
                const mainStudent = recentAyfPart.aux_class_1.student.value;

                main = ayfPart.aux_class_1.assistant.value;

                if (weekType === Week.NORMAL && mainStudent.length > 0 && main.length === 0) {
                  field = `MM_AYFPart${index}_Assistant_B` as AssignmentFieldType;
                  selected = await schedulesSelectRandomPerson({ type, week: schedule.weekOf, mainStudent, isAYFTalk: isTalk, classroom: '2' });
                  if (selected) {
                    await schedulesSaveAssignment(schedule, field, selected);
                    setAssignmentsCurrent((prev) => prev + 1);
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const handleStartAutoFill = async () => {
    setAssignmentsTotal(0);

    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      const weeksList = schedules.filter((record) => record.weekOf >= startWeek && record.weekOf <= endWeek);
      for await (const { weekOf } of weeksList) {
        const { total, assigned } = await schedulesWeekAssignmentsInfo(weekOf, meeting);
        setAssignmentsTotal((prev) => prev + total - assigned);
      }

      if (meeting === 'midweek') {
        await handleAutofillMidweek(weeksList);
      }

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      await displaySnackNotification({
        header: t('tr_errorTitle'),
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
    assignmentsTotal,
    assignmentsCurrent,
  };
};

export default useScheduleAutofill;
