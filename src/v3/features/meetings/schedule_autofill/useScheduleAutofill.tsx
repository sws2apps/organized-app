import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { schedulesState } from '@states/schedules';
import { PersonType } from '@definition/person';
import { AssignmentCode } from '@definition/assignment';
import {
  midweekMeetingClassCountState,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import {
  schedulesSaveAssignment,
  schedulesSelectRandomPerson,
  schedulesWeekAssignmentsInfo,
} from '@services/app/schedules';
import { SchedWeekType } from '@definition/schedules';
import { ScheduleAutofillType } from './index.types';
import { Week } from '@definition/week_type';
import { sourcesState } from '@states/sources';
import { JWLangState } from '@states/app';
import { sourcesCheckLCAssignments, sourcesCheckLCElderAssignment } from '@services/app/sources';

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
        const source = sources.find((record) => record.weekOf === schedule.weekOf);

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
