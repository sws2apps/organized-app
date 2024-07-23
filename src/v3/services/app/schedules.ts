import { UpdateSpec } from 'dexie';
import { promiseGetRecoil } from 'recoil-outside';
import { midweekMeetingClassCountState, midweekMeetingOpeningPrayerAutoAssign, userDataViewState } from '@states/settings';
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
import { PersonType } from '@definition/person';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { addMonths, addWeeks } from '@utils/date';
import { applyAssignmentFilters, personIsElder } from './persons';
import { personsActiveState } from '@states/persons';
import { personsStateFind } from '@services/recoil/persons';

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
    const weekType = schedule.midweek_meeting.week_type.find((record) => record.type === dataView).value || Week.NORMAL;
    const hasNoMeeting = weekType === Week.ASSEMBLY || weekType == Week.CONVENTION || weekType === Week.MEMORIAL || weekType === Week.NO_MEETING;

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
        assignment = schedule.midweek_meeting[`ayf_part${a}`].main_hall.student.find((record) => record.type === dataView);
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }

        // assistant main hall
        assignment = schedule.midweek_meeting[`ayf_part${a}`].main_hall.assistant.find((record) => record.type === dataView);
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
    if (code) {
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

export const schedulesUpdateHistory = async (week: string, assignment: AssignmentFieldType, assigned: AssignmentCongregation) => {
  const history: AssignmentHistoryType[] = await promiseGetRecoil(assignmentsHistoryState);

  const historyStale = structuredClone(history);

  // remove record from history
  const previousIndex = historyStale.findIndex((record) => record.weekOf === week && record.assignment.key === assignment);
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

export const schedulesSaveAssignment = async (schedule: SchedWeekType, assignment: AssignmentFieldType, value: PersonType) => {
  const dataView = await promiseGetRecoil(userDataViewState);

  const toSave = value ? value.person_uid : '';
  const path = ASSIGNMENT_PATH[assignment];
  const fieldUpdate = structuredClone(schedulesGetData(schedule, path));

  let assigned: AssignmentCongregation;

  if (Array.isArray(fieldUpdate)) {
    assigned = fieldUpdate.find((record) => record.type === dataView);
    assigned.value = toSave;
    assigned.updatedAt = new Date().toISOString();
  } else {
    assigned = fieldUpdate;
    fieldUpdate.value = toSave;
    fieldUpdate.updatedAt = new Date().toISOString();
  }

  const dataDb = { [path]: fieldUpdate } as unknown as UpdateSpec<SchedWeekType>;

  await dbSchedUpdate(schedule.weekOf, dataDb);

  // update history
  await schedulesUpdateHistory(schedule.weekOf, assignment, assigned);
};

export const schedulesPersonNoPart = ({ persons, history }: { persons: PersonType[]; history: AssignmentHistoryType[] }) => {
  let selected: PersonType;

  for (const person of persons) {
    const assignments = history.filter((record) => record.assignment.person === person.person_uid);

    if (assignments.length === 0) {
      selected = person;
      break;
    }
  }

  return selected;
};

export const schedulesPersonNoPartWithinMonth = async ({
  persons,
  type,
  week,
  classroom,
  history,
}: {
  persons: PersonType[];
  type: AssignmentCode;
  week: string;
  classroom?: string;
  history: AssignmentHistoryType[];
}) => {
  const classCount: number = await promiseGetRecoil(midweekMeetingClassCountState);

  let selected: PersonType;

  const currentDate = new Date(week);
  const lastMonth = addMonths(currentDate, -1);
  const nextMonth = addMonths(currentDate, 1);

  for (const person of persons) {
    const assignments = history.filter((record) => {
      const tmpDate = new Date(record.weekOf);

      return tmpDate > lastMonth && tmpDate < nextMonth && record.assignment.person === person.person_uid;
    });

    if (assignments.length === 0) {
      const lastAssignment = history.find((record) => {
        const tmpDate = new Date(record.weekOf);

        return tmpDate < currentDate && record.assignment.person === person.person_uid;
      });

      if (!classroom) {
        const lastAssignmentType = lastAssignment?.assignment.code;

        if (lastAssignmentType !== type) {
          selected = person;
          break;
        }
      }

      if (classroom) {
        const lastAssignmentType = lastAssignment?.assignment.code;
        const lastAssignmentClassroom = lastAssignment?.assignment.classroom;
        const hasAux = classCount === 2;

        if (lastAssignmentType !== type && (!hasAux || (hasAux && lastAssignmentClassroom !== classroom))) {
          selected = person;
          break;
        }
      }
    }
  }

  return selected;
};

export const schedulesPersonNoPartWithin2Weeks = async ({
  persons,
  type,
  week,
  classroom,
  history,
}: {
  persons: PersonType[];
  type: AssignmentCode;
  week: string;
  classroom?: string;
  history: AssignmentHistoryType[];
}) => {
  const classCount: number = await promiseGetRecoil(midweekMeetingClassCountState);

  let selected: PersonType;

  const currentDate = new Date(week);

  const last2Weeks = addWeeks(currentDate, -2);
  const next2Weeks = addWeeks(currentDate, 2);

  for (const person of persons) {
    const assignments = history.filter((record) => {
      const tmpDate = new Date(record.weekOf);

      return tmpDate > last2Weeks && tmpDate < next2Weeks && record.assignment.person === person.person_uid;
    });

    if (assignments.length === 0) {
      const lastAssignment = history.find((record) => {
        const tmpDate = new Date(record.weekOf);

        return tmpDate < currentDate && record.assignment.person === person.person_uid;
      });

      if (!classroom) {
        const lastAssignmentType = lastAssignment?.assignment.code;

        if (lastAssignmentType !== type) {
          selected = person;
          break;
        }
      }

      if (classroom) {
        const lastAssignmentClassroom = lastAssignment?.assignment.classroom;
        const lastAssignmentType = lastAssignment?.assignment.code;
        const hasAux = classCount === 2;

        if (lastAssignmentType !== type && (!hasAux || (hasAux && lastAssignmentClassroom !== classroom))) {
          selected = person;
          break;
        }
      }
    }
  }

  return selected;
};

export const schedulesPersonNoPartSameWeek = async ({
  persons,
  type,
  week,
  classroom,
  history,
}: {
  persons: PersonType[];
  type: AssignmentCode;
  week: string;
  classroom?: string;
  history: AssignmentHistoryType[];
}) => {
  const classCount: number = await promiseGetRecoil(midweekMeetingClassCountState);

  let selected: PersonType;

  const currentDate = new Date(week);

  for (const person of persons) {
    const assignments = history.filter((record) => {
      return week === record.weekOf && record.assignment.person === person.person_uid;
    });

    if (assignments.length === 0) {
      const lastAssignment = history.find((record) => {
        const tmpDate = new Date(record.weekOf);

        return tmpDate < currentDate && record.assignment.person === person.person_uid;
      });

      if (!classroom) {
        const lastAssignmentType = lastAssignment?.assignment.code;

        if (lastAssignmentType !== type) {
          selected = person;
          break;
        }
      }

      if (classroom) {
        const lastAssignmentClassroom = lastAssignment?.assignment.classroom;
        const lastAssignmentType = lastAssignment?.assignment.code;
        const hasAux = classCount === 2;

        if (lastAssignmentType !== type && (!hasAux || (hasAux && lastAssignmentClassroom !== classroom))) {
          selected = person;
          break;
        }
      }
    }
  }

  return selected;
};

export const schedulesPersonNoConsecutivePart = async ({
  persons,
  type,
  classroom,
  history,
}: {
  persons: PersonType[];
  type: AssignmentCode;
  history: AssignmentHistoryType[];
  classroom?: string;
}) => {
  let selected: PersonType;

  const classCount = await promiseGetRecoil(midweekMeetingClassCountState);

  for (const person of persons) {
    const lastAssignment = history.find((record) => record.assignment.person === person.person_uid);

    if (lastAssignment?.assignment.code !== type) {
      if (classroom) {
        const hasAux = classCount === 2;

        if (!hasAux || (hasAux && lastAssignment.assignment.classroom !== classroom)) {
          selected = person;
          break;
        }
      }

      if (!classroom) {
        selected = person;
        break;
      }
    }
  }

  return selected;
};

export const schedulesSelectRandomPerson = async (data: {
  type: AssignmentCode;
  week: string;
  isAYFTalk?: boolean;
  classroom?: string;
  isLC?: boolean;
  isElderPart?: boolean;
  mainStudent?: string;
  history: AssignmentHistoryType[];
}) => {
  let selected: PersonType;

  const persons = await promiseGetRecoil(personsActiveState);

  let personsElligible = applyAssignmentFilters(persons, [data.type]);

  if (data.isElderPart) {
    personsElligible = personsElligible.filter((record) => personIsElder(record));
  }

  if (data.isAYFTalk) {
    personsElligible = personsElligible.filter((record) => record.person_data.male.value);
  }

  if (data.mainStudent && data.mainStudent.length > 0) {
    const mainPerson = await personsStateFind(data.mainStudent);
    personsElligible = personsElligible.filter((record) => record.person_data.male.value === mainPerson.person_data.male.value);
  }

  if (personsElligible.length > 0) {
    // 1st rule: no part
    selected = await schedulesPersonNoPart({ persons: personsElligible, history: data.history });

    // 2nd rule: no part within month
    if (!selected) {
      selected = await schedulesPersonNoPartWithinMonth({
        persons: personsElligible,
        type: data.type,
        week: data.week,
        classroom: data.classroom,
        history: data.history,
      });
    }

    // 3rd rule: no part within 2 weeks
    if (!selected) {
      selected = await schedulesPersonNoPartWithin2Weeks({
        persons: personsElligible,
        type: data.type,
        week: data.week,
        classroom: data.classroom,
        history: data.history,
      });
    }

    // 4th rule: no part same week
    if (!selected) {
      selected = await schedulesPersonNoPartSameWeek({
        persons: personsElligible,
        type: data.type,
        week: data.week,
        classroom: data.classroom,
        history: data.history,
      });
    }
    // 5th rule: no same part
    if (!selected) {
      selected = await schedulesPersonNoConsecutivePart({
        persons: personsElligible,
        type: data.type,
        classroom: data.classroom,
        history: data.history,
      });
    }
  }

  return selected;
};

export const schedulesRemoveAssignment = async (schedule: SchedWeekType, assignment: AssignmentFieldType) => {
  const dataView = await promiseGetRecoil(userDataViewState);
  const path = ASSIGNMENT_PATH[assignment];
  const fieldUpdate = structuredClone(schedulesGetData(schedule, path));

  let assigned: AssignmentCongregation;

  if (Array.isArray(fieldUpdate)) {
    assigned = fieldUpdate.find((record) => record.type === dataView);
    assigned.value = '';
    assigned.updatedAt = new Date().toISOString();
  } else {
    assigned = fieldUpdate;
    fieldUpdate.value = '';
    fieldUpdate.updatedAt = new Date().toISOString();
  }

  return fieldUpdate;
};

export const scheduleDeleteMidweekWeekAssignments = async (schedule: SchedWeekType) => {
  const dataDb = {
    [ASSIGNMENT_PATH['MM_Chairman_A']]: await schedulesRemoveAssignment(schedule, 'MM_Chairman_A'),
    [ASSIGNMENT_PATH['MM_Chairman_B']]: await schedulesRemoveAssignment(schedule, 'MM_Chairman_B'),
    [ASSIGNMENT_PATH['MM_OpeningPrayer']]: await schedulesRemoveAssignment(schedule, 'MM_OpeningPrayer'),
    [ASSIGNMENT_PATH['MM_TGWTalk']]: await schedulesRemoveAssignment(schedule, 'MM_TGWTalk'),
    [ASSIGNMENT_PATH['MM_TGWGems']]: await schedulesRemoveAssignment(schedule, 'MM_TGWGems'),
    [ASSIGNMENT_PATH['MM_TGWBibleReading_A']]: await schedulesRemoveAssignment(schedule, 'MM_TGWBibleReading_A'),
    [ASSIGNMENT_PATH['MM_TGWBibleReading_B']]: await schedulesRemoveAssignment(schedule, 'MM_TGWBibleReading_B'),
    [ASSIGNMENT_PATH['MM_AYFPart1_Student_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart1_Student_A'),
    [ASSIGNMENT_PATH['MM_AYFPart1_Assistant_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart1_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart1_Student_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart1_Student_B'),
    [ASSIGNMENT_PATH['MM_AYFPart1_Assistant_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart1_Assistant_B'),
    [ASSIGNMENT_PATH['MM_AYFPart2_Student_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart2_Student_A'),
    [ASSIGNMENT_PATH['MM_AYFPart2_Assistant_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart2_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart2_Student_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart2_Student_B'),
    [ASSIGNMENT_PATH['MM_AYFPart2_Assistant_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart2_Assistant_B'),
    [ASSIGNMENT_PATH['MM_AYFPart3_Student_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart3_Student_A'),
    [ASSIGNMENT_PATH['MM_AYFPart3_Assistant_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart3_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart3_Student_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart3_Student_B'),
    [ASSIGNMENT_PATH['MM_AYFPart3_Assistant_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart3_Assistant_B'),
    [ASSIGNMENT_PATH['MM_AYFPart4_Student_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart4_Student_A'),
    [ASSIGNMENT_PATH['MM_AYFPart4_Assistant_A']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart4_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart4_Student_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart4_Student_B'),
    [ASSIGNMENT_PATH['MM_AYFPart4_Assistant_B']]: await schedulesRemoveAssignment(schedule, 'MM_AYFPart4_Assistant_B'),
    [ASSIGNMENT_PATH['MM_LCPart1']]: await schedulesRemoveAssignment(schedule, 'MM_LCPart1'),
    [ASSIGNMENT_PATH['MM_LCPart2']]: await schedulesRemoveAssignment(schedule, 'MM_LCPart2'),
    [ASSIGNMENT_PATH['MM_LCPart3']]: await schedulesRemoveAssignment(schedule, 'MM_LCPart3'),
    [ASSIGNMENT_PATH['MM_LCCBSConductor']]: await schedulesRemoveAssignment(schedule, 'MM_LCCBSConductor'),
    [ASSIGNMENT_PATH['MM_LCCBSReader']]: await schedulesRemoveAssignment(schedule, 'MM_LCCBSReader'),
    [ASSIGNMENT_PATH['MM_ClosingPrayer']]: await schedulesRemoveAssignment(schedule, 'MM_ClosingPrayer'),
  } as unknown as UpdateSpec<SchedWeekType>;

  await dbSchedUpdate(schedule.weekOf, dataDb);
};

export const schedulesAutofillUpdateHistory = async ({
  schedule,
  assignment,
  assigned,
  history,
}: {
  schedule: SchedWeekType;
  assignment: AssignmentFieldType;
  assigned: AssignmentCongregation;
  history: AssignmentHistoryType[];
}) => {
  // remove record from history
  const previousIndex = history.findIndex((record) => record.weekOf === schedule.weekOf && record.assignment.key === assignment);
  if (previousIndex !== -1) history.splice(previousIndex, 1);

  if (assigned.value !== '') {
    const assignmentOptions: AssignmentLocalType[] = await promiseGetRecoil(assignmentTypeLocaleState);
    const lang: string = await promiseGetRecoil(JWLangState);

    const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
    const source = sources.find((record) => record.weekOf === schedule.weekOf);

    const historyDetails = schedulesGetHistoryDetails({
      assigned,
      assignment,
      assignmentOptions,
      lang,
      schedule,
      source,
    });

    history.push(historyDetails);
  }

  history.sort((a, b) => new Date(b.weekOf).toISOString().localeCompare(new Date(a.weekOf).toISOString()));
};

export const schedulesAutofillSaveAssignment = async ({
  assignment,
  schedule,
  value,
  history,
}: {
  schedule: SchedWeekType;
  assignment: AssignmentFieldType;
  value: PersonType;
  history: AssignmentHistoryType[];
}) => {
  const dataView = await promiseGetRecoil(userDataViewState);

  const toSave = value ? value.person_uid : '';
  const path = ASSIGNMENT_PATH[assignment];
  const fieldUpdate = schedulesGetData(schedule, path);

  let assigned: AssignmentCongregation;

  if (Array.isArray(fieldUpdate)) {
    assigned = fieldUpdate.find((record) => record.type === dataView);
    assigned.value = toSave;
    assigned.updatedAt = new Date().toISOString();
  } else {
    assigned = fieldUpdate;
    fieldUpdate.value = toSave;
    fieldUpdate.updatedAt = new Date().toISOString();
  }

  // update history
  await schedulesAutofillUpdateHistory({ schedule, assignment, assigned, history });
};
