import { promiseGetRecoil } from 'recoil-outside';
import {
  midweekMeetingClassCountState,
  midweekMeetingOpeningPrayerAutoAssign,
  userDataViewState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { JWLangState } from '@states/app';
import { Week } from '@definition/week_type';
import { AssignmentCode, AssignmentFieldType, AssignmentLocalType } from '@definition/assignment';
import { ApplyMinistryType, LivingAsChristiansType, SourceWeekType } from '@definition/sources';
import { sourcesCheckAYFExplainBeliefsAssignment, sourcesCheckLCAssignments } from './sources';
import { AssignmentCongregation, AssignmentHistoryType, SchedWeekType } from '@definition/schedules';
import { getTranslation } from '@services/i18n/translation';
import { formatDate } from '@services/dateformat';
import { ASSIGNMENT_PATH } from '@constants/index';
import { assignmentTypeLocaleState } from '@states/assignment';
import { setAssignmentsHistory } from '@services/recoil/schedules';

export const schedulesWeekAssignmentsInfo = async (week: string, meeting: 'midweek' | 'weekend') => {
  const classCount: number = await promiseGetRecoil(midweekMeetingClassCountState);
  const openingPrayerAutoAssign: boolean = await promiseGetRecoil(midweekMeetingOpeningPrayerAutoAssign);
  const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
  const schedules: SchedWeekType[] = await promiseGetRecoil(schedulesState);
  const dataView: string = await promiseGetRecoil(userDataViewState);
  const lang: string = await promiseGetRecoil(JWLangState);

  let total = 0;
  let assigned = 0;

  const source = sources.find((record) => record.weekOf === week);
  const schedule = schedules.find((record) => record.weekOf === week);

  if (meeting === 'midweek') {
    const hasNoMeeting = schedule.midweek_meeting.canceled.find((record) => record.type === dataView)?.value ?? false;
    const weekType = schedule.week_type.find((record) => record.type === dataView)?.value || Week.NORMAL;

    if (!hasNoMeeting) {
      // chairman main hall
      total = total + 1;

      let assignment = schedule.midweek_meeting.chairman.main_hall.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // chairman aux class
      if (weekType === Week.NORMAL && classCount > 1) {
        total = total + 1;

        assignment = schedule.midweek_meeting.chairman.aux_class_1;
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // opening prayer
      if (!openingPrayerAutoAssign) {
        total = total + 1;

        assignment = schedule.midweek_meeting.opening_prayer.find((record) => record.type === dataView);
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // tgw talk
      total = total + 1;

      assignment = schedule.midweek_meeting.tgw_talk.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // tgw gems
      total = total + 1;

      assignment = schedule.midweek_meeting.tgw_gems.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // tgw bible reading
      total = total + 1;

      assignment = schedule.midweek_meeting.tgw_bible_reading.main_hall.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // tgw bible reading aux class
      if (weekType === Week.NORMAL && classCount > 1) {
        total = total + 1;

        assignment = schedule.midweek_meeting.tgw_bible_reading.aux_class_1;
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // ayf
      for (let a = 1; a <= 4; a++) {
        const type: AssignmentCode = source.midweek_meeting[`ayf_part${a}`].type[lang];

        // discussion part
        if (type === AssignmentCode.MM_Discussion) {
          total = total + 1;
        }

        // student discussion part
        if (
          type === AssignmentCode.MM_InitialCall ||
          type === AssignmentCode.MM_ReturnVisit ||
          type === AssignmentCode.MM_BibleStudy ||
          type === AssignmentCode.MM_Memorial ||
          type === AssignmentCode.MM_StartingConversation ||
          type === AssignmentCode.MM_FollowingUp ||
          type === AssignmentCode.MM_MakingDisciples ||
          (type >= 140 && type < 170) ||
          (type >= 170 && type < 200)
        ) {
          total = total + 2;

          // aux class
          if (weekType === Week.NORMAL && classCount > 1) {
            total = total + 2;
          }
        }

        // talk part
        if (type === AssignmentCode.MM_Talk) {
          total = total + 1;

          // aux class
          if (weekType === Week.NORMAL && classCount > 1) {
            total = total + 1;
          }
        }

        // explain beliefs part
        if (type === AssignmentCode.MM_ExplainingBeliefs) {
          const ayfPart: ApplyMinistryType = source.midweek_meeting[`ayf_part${a}`];
          const src = ayfPart.src[lang];

          const isTalk = sourcesCheckAYFExplainBeliefsAssignment(src);

          if (isTalk) {
            total = total + 1;

            // aux class
            if (weekType === Week.NORMAL && classCount > 1) {
              total = total + 1;
            }
          }

          if (!isTalk) {
            total = total + 2;

            // aux class
            if (weekType === Week.NORMAL && classCount > 1) {
              total = total + 2;
            }
          }
        }

        // student main hall
        assignment = schedule.midweek_meeting[`ayf_part${a}`].main_hall.student.find(
          (record) => record.type === dataView
        );
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }

        // assistant main hall
        assignment = schedule.midweek_meeting[`ayf_part${a}`].main_hall.assistant.find(
          (record) => record.type === dataView
        );
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }

        // student aux class
        if (weekType === Week.NORMAL && classCount > 1) {
          assignment = schedule.midweek_meeting[`ayf_part${a}`].aux_class_1.student;
          if (assignment && assignment.value.length > 0) {
            assigned = assigned + 1;
          }

          // assistant aux class
          assignment = schedule.midweek_meeting[`ayf_part${a}`].aux_class_1.assistant;
          if (assignment && assignment.value.length > 0) {
            assigned = assigned + 1;
          }
        }
      }

      // lc part 1 & 2
      for (let a = 1; a <= 2; a++) {
        const lcPart: LivingAsChristiansType = source.midweek_meeting[`lc_part${a}`];

        const titleOverride = lcPart.title.override.find((record) => record.type === dataView)?.value;
        const titleDefault = lcPart.title.default[lang];
        const title = titleOverride?.length > 0 ? titleOverride : titleDefault;

        if (title?.length > 0) {
          const noAssign = sourcesCheckLCAssignments(title);

          if (!noAssign) {
            total = total + 1;

            assignment = schedule.midweek_meeting[`lc_part${a}`].find((record) => record.type === dataView);
            if (assignment && assignment.value.length > 0) {
              assigned = assigned + 1;
            }
          }
        }
      }

      // lc part 3
      const lcPart = source.midweek_meeting.lc_part3;
      const title = lcPart.title.find((record) => record.type === dataView)?.value || '';
      if (title?.length > 0) {
        const noAssign = sourcesCheckLCAssignments(title);

        if (!noAssign) {
          total = total + 1;

          assignment = schedule.midweek_meeting.lc_part3.find((record) => record.type === dataView);
          if (assignment && assignment.value.length > 0) {
            assigned = assigned + 1;
          }
        }
      }

      // lc cbs conductor
      total = total + 1;

      assignment = schedule.midweek_meeting.lc_cbs.conductor.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // lc cbs reader
      if (weekType === Week.NORMAL) {
        total = total + 1;

        assignment = schedule.midweek_meeting.lc_cbs.reader.find((record) => record.type === dataView);
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }

      // closing prayer
      total = total + 1;

      assignment = schedule.midweek_meeting.closing_prayer.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }
    }
  }

  return { total, assigned };
};

export const schedulesGetData = (schedule: SchedWeekType, path: string) => {
  const pathParts = path.split('.');
  let current: unknown = schedule;

  for (const part of pathParts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }

  return current as AssignmentCongregation | AssignmentCongregation[];
};

export const schedulesGetHistoryDetails = ({
  schedule,
  source,
  assigned,
  assignment,
  lang,
  assignmentOptions,
}: {
  schedule: SchedWeekType;
  source: SourceWeekType;
  assigned: AssignmentCongregation;
  assignment: AssignmentFieldType;
  lang: string;
  assignmentOptions: AssignmentLocalType[];
}) => {
  const history = {} as AssignmentHistoryType;

  history.id = crypto.randomUUID();
  history.weekOf = schedule.weekOf;
  history.weekOfFormatted = formatDate(new Date(schedule.weekOf), getTranslation({ key: 'tr_shortDateFormat' }));
  history.assignment = {} as AssignmentHistoryType['assignment'];

  history.assignment.category = assigned.type;
  history.assignment.person = assigned.value;
  history.assignment.key = assignment;

  if (assignment.endsWith('_A')) {
    history.assignment.classroom = '1';
  }

  if (assignment.endsWith('_B')) {
    history.assignment.classroom = '2';
  }

  if (assignment.includes('MM_Chairman')) {
    history.assignment.code = AssignmentCode.MM_Chairman;
  }

  if (assignment === 'MM_Chairman_A') {
    history.assignment.title = getTranslation({ key: 'tr_chairmanMidwekMeetingHistory' });
  }

  if (assignment === 'MM_Chairman_B') {
    history.assignment.title = getTranslation({ key: 'tr_auxClassroom' });
  }

  if (assignment.startsWith('MM_') && assignment.endsWith('Prayer')) {
    history.assignment.code = AssignmentCode.MM_Prayer;
    history.assignment.title = getTranslation({ key: 'tr_prayer' });
  }

  if (assignment === 'MM_TGWTalk') {
    history.assignment.code = AssignmentCode.MM_TGWTalk;
    history.assignment.title = getTranslation({ key: 'tr_tgw10TalkHistory' });
    history.assignment.src = source.midweek_meeting.tgw_gems.title[lang];
  }

  if (assignment === 'MM_TGWGems') {
    history.assignment.code = AssignmentCode.MM_TGWGems;
    history.assignment.title = getTranslation({ key: 'tr_tgwGems' });
  }

  if (assignment.startsWith('MM_TGWBibleReading')) {
    history.assignment.code = AssignmentCode.MM_BibleReading;
    history.assignment.title = getTranslation({ key: 'tr_bibleReading' });
    history.assignment.src = source.midweek_meeting.tgw_bible_reading.src[lang];
  }

  if (assignment.includes('AYFPart')) {
    const partNum = assignment.match(/\d+\.?\d*/g).at(0);
    const code: AssignmentCode = source.midweek_meeting[`ayf_part${partNum}`].type[lang];
    const src: string = source.midweek_meeting[`ayf_part${partNum}`].src[lang];
    const title = assignmentOptions.find((record) => record.value === code).label;

    history.assignment.src = src;
    history.assignment.ayf = {};

    if (assignment.includes('Student')) {
      const assistantFld = assignment.replace('Student', 'Assistant');
      const assistantValue = schedulesGetData(schedule, ASSIGNMENT_PATH[assistantFld]);
      const asistants = Array.isArray(assistantValue) ? assistantValue : [assistantValue];

      history.assignment.title = title;
      history.assignment.code = code;
      history.assignment.ayf.assistant = asistants.find((record) => record.type === assigned.type)?.value;
    }

    if (assignment.includes('Assistant')) {
      const studentFld = assignment.replace('Assistant', 'Student');
      const studentValue = schedulesGetData(schedule, ASSIGNMENT_PATH[studentFld]);
      const students = Array.isArray(studentValue) ? studentValue : [studentValue];

      history.assignment.title = `${getTranslation({ key: 'tr_assistant' })} (${title})`;
      history.assignment.code = AssignmentCode.MM_AssistantOnly;
      history.assignment.ayf.student = students.find((record) => record.type === assigned.type)?.value;
    }
  }

  if (assignment.startsWith('MM_LCPart')) {
    history.assignment.code = AssignmentCode.MM_LCPart;
    history.assignment.title = getTranslation({ key: 'tr_lcPart' });
  }

  if (assignment.startsWith('MM_LCPart') && assignment !== 'MM_LCPart3') {
    const partNum = assignment.match(/\d+\.?\d*/g).at(0);
    const lcPart: LivingAsChristiansType = source.midweek_meeting[`lc_part${partNum}`];

    const srcOverride = lcPart.title.override.find((record) => record.type === assigned.type)?.value;
    const srcDefault = lcPart.title.default[lang];
    const src = srcOverride?.length > 0 ? srcOverride : srcDefault;

    const descOverride = lcPart.desc.override.find((record) => record.type === assigned.type)?.value;
    const descDefault = lcPart.desc.default[lang];
    const desc = descOverride?.length > 0 ? descOverride : descDefault;

    history.assignment.src = src;
    history.assignment.desc = desc;
  }

  if (assignment === 'MM_LCPart3') {
    const lcPart = source.midweek_meeting.lc_part3;

    const src = lcPart.title.find((record) => record.type === assigned.type)?.value || '';
    const desc = lcPart.desc.find((record) => record.type === assigned.type)?.value || '';

    history.assignment.src = src;
    history.assignment.desc = desc;
  }

  if (assignment.startsWith('MM_LCCBS')) {
    history.assignment.src = source.midweek_meeting.lc_cbs.src[lang];
  }

  if (assignment === 'MM_LCCBSConductor') {
    history.assignment.code = AssignmentCode.MM_CBSConductor;
    history.assignment.title = getTranslation({ key: 'tr_congregationBibleStudyConductor' });
  }

  if (assignment === 'MM_LCCBSReader') {
    history.assignment.code = AssignmentCode.MM_CBSReader;
    history.assignment.title = getTranslation({ key: 'tr_congregationBibleStudyReader' });
  }

  return history;
};

export const schedulesBuildHistoryList = async () => {
  const result: AssignmentHistoryType[] = [];
  const schedules: SchedWeekType[] = await promiseGetRecoil(schedulesState);
  const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
  const assignmentOptions: AssignmentLocalType[] = await promiseGetRecoil(assignmentTypeLocaleState);
  const lang: string = await promiseGetRecoil(JWLangState);

  for (const schedule of schedules) {
    const source = sources.find((record) => record.weekOf === schedule.weekOf);

    for (const [key, value] of Object.entries(ASSIGNMENT_PATH)) {
      const record = schedulesGetData(schedule, value);
      const assignments = Array.isArray(record) ? record : [record];

      for (const assigned of assignments) {
        if (assigned.value !== '') {
          const history = schedulesGetHistoryDetails({
            assigned,
            assignment: key as AssignmentFieldType,
            assignmentOptions,
            lang,
            schedule,
            source,
          });

          result.push(history);
        }
      }
    }
  }

  return result.sort((a, b) => new Date(b.weekOf).toISOString().localeCompare(new Date(a.weekOf).toISOString()));
};

export const schedulesUpdateHistory = async (
  week: string,
  assignment: AssignmentFieldType,
  assigned: AssignmentCongregation
) => {
  const history: AssignmentHistoryType[] = await promiseGetRecoil(assignmentsHistoryState);

  const historyStale = structuredClone(history);

  // remove record from history
  const previousIndex = historyStale.findIndex(
    (record) => record.weekOf === week && record.assignment.key === assignment
  );
  if (previousIndex !== -1) historyStale.splice(previousIndex, 1);

  if (assigned.value !== '') {
    const schedules: SchedWeekType[] = await promiseGetRecoil(schedulesState);
    const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
    const assignmentOptions: AssignmentLocalType[] = await promiseGetRecoil(assignmentTypeLocaleState);
    const lang: string = await promiseGetRecoil(JWLangState);

    const schedule = schedules.find((record) => record.weekOf === week);
    const source = sources.find((record) => record.weekOf === week);

    const historyDetails = schedulesGetHistoryDetails({
      assigned,
      assignment,
      assignmentOptions,
      lang,
      schedule,
      source,
    });

    historyStale.push(historyDetails);
  }

  historyStale.sort((a, b) => new Date(b.weekOf).toISOString().localeCompare(new Date(a.weekOf).toISOString()));

  await setAssignmentsHistory(historyStale);
};
