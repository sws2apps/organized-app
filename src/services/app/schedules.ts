import { UpdateSpec } from 'dexie';
import { promiseGetRecoil } from 'recoil-outside';
import {
  CODisplayNameState,
  COFullnameState,
  displayNameEnableState,
  fullnameOptionState,
  midweekMeetingClassCountState,
  midweekMeetingExactDateState,
  midweekMeetingOpeningPrayerAutoAssign,
  midweekMeetingTimeState,
  midweekMeetingWeekdayState,
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { JWLangState, monthNamesState } from '@states/app';
import { Week, WeekTypeLocale } from '@definition/week_type';
import {
  AssignmentCode,
  AssignmentFieldType,
  AssignmentLocalType,
} from '@definition/assignment';
import {
  ApplyMinistryType,
  LivingAsChristiansType,
  SourceAssignmentType,
  SourceWeekType,
} from '@definition/sources';
import {
  sourcesCBSGetTitle,
  sourcesCheckAYFExplainBeliefsAssignment,
  sourcesCheckLCAssignments,
  sourcesCountLC,
  sourcesLCGetTitle,
  sourcesPartTiming,
  sourcesSongConclude,
} from './sources';
import {
  AssignmentCongregation,
  AssignmentHistoryType,
  MidweekMeetingDataType,
  S89DataType,
  SchedWeekType,
} from '@definition/schedules';
import { getTranslation } from '@services/i18n/translation';
import { formatDate } from '@services/dateformat';
import { ASSIGNMENT_PATH } from '@constants/index';
import { assignmentTypeLocaleState } from '@states/assignment';
import { setAssignmentsHistory } from '@services/recoil/schedules';
import { PersonType } from '@definition/person';
import { dbSchedUpdate } from '@services/dexie/schedules';
import {
  addMonths,
  addWeeks,
  dateFormatFriendly,
  timeAddMinutes,
} from '@utils/date';
import { applyAssignmentFilters, personIsElder } from './persons';
import { personsActiveState } from '@states/persons';
import { personsStateFind } from '@services/recoil/persons';
import { buildPersonFullname } from '@utils/common';
import { sourcesFind } from '@services/recoil/sources';
import { weekTypeLocaleState } from '@states/weekType';

export const schedulesWeekAssignmentsInfo = async (
  week: string,
  meeting: 'midweek' | 'weekend'
) => {
  let total = 0;
  let assigned = 0;

  if (meeting === 'midweek') {
    const data = await schedulesMidweekInfo(week);
    total = data.total;
    assigned = data.assigned;
  }

  if (meeting === 'weekend') {
    const data = await schedulesWeekendInfo(week);
    total = data.total;
    assigned = data.assigned;
  }

  return { total, assigned };
};

export const schedulesMidweekInfo = async (week: string) => {
  const classCount: number = await promiseGetRecoil(
    midweekMeetingClassCountState
  );
  const openingPrayerAutoAssign: boolean = await promiseGetRecoil(
    midweekMeetingOpeningPrayerAutoAssign
  );
  const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
  const schedules: SchedWeekType[] = await promiseGetRecoil(schedulesState);
  const dataView: string = await promiseGetRecoil(userDataViewState);
  const lang: string = await promiseGetRecoil(JWLangState);

  const source = sources.find((record) => record.weekOf === week);
  const schedule = schedules.find((record) => record.weekOf === week);

  let total = 0;
  let assigned = 0;

  const weekType =
    schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    ).value || Week.NORMAL;
  const hasNoMeeting =
    weekType === Week.ASSEMBLY ||
    weekType == Week.CONVENTION ||
    weekType === Week.MEMORIAL ||
    weekType === Week.NO_MEETING;

  if (!hasNoMeeting) {
    // chairman main hall
    total = total + 1;

    let assignment = schedule.midweek_meeting.chairman.main_hall.find(
      (record) => record.type === dataView
    );
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

      assignment = schedule.midweek_meeting.opening_prayer.find(
        (record) => record.type === dataView
      );
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }
    }

    // tgw talk
    total = total + 1;

    assignment = schedule.midweek_meeting.tgw_talk.find(
      (record) => record.type === dataView
    );
    if (assignment && assignment.value.length > 0) {
      assigned = assigned + 1;
    }

    // tgw gems
    total = total + 1;

    assignment = schedule.midweek_meeting.tgw_gems.find(
      (record) => record.type === dataView
    );
    if (assignment && assignment.value.length > 0) {
      assigned = assigned + 1;
    }

    // tgw bible reading
    total = total + 1;

    assignment = schedule.midweek_meeting.tgw_bible_reading.main_hall.find(
      (record) => record.type === dataView
    );
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
      const type: AssignmentCode =
        source.midweek_meeting[`ayf_part${a}`].type[lang];

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
        const ayfPart: ApplyMinistryType =
          source.midweek_meeting[`ayf_part${a}`];
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
      assignment = schedule.midweek_meeting[
        `ayf_part${a}`
      ].main_hall.student.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // assistant main hall
      assignment = schedule.midweek_meeting[
        `ayf_part${a}`
      ].main_hall.assistant.find((record) => record.type === dataView);
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // student aux class
      if (weekType === Week.NORMAL && classCount > 1) {
        assignment =
          schedule.midweek_meeting[`ayf_part${a}`].aux_class_1.student;
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }

        // assistant aux class
        assignment =
          schedule.midweek_meeting[`ayf_part${a}`].aux_class_1.assistant;
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }
    }

    // lc part 1 & 2
    for (let a = 1; a <= 2; a++) {
      const lcPart: LivingAsChristiansType =
        source.midweek_meeting[`lc_part${a}`];

      const titleOverride = lcPart.title.override.find(
        (record) => record.type === dataView
      )?.value;
      const titleDefault = lcPart.title.default[lang];
      const title = titleOverride?.length > 0 ? titleOverride : titleDefault;

      if (title?.length > 0) {
        const noAssign = sourcesCheckLCAssignments(title);

        if (!noAssign) {
          total = total + 1;

          assignment = schedule.midweek_meeting[`lc_part${a}`].find(
            (record) => record.type === dataView
          );
          if (assignment && assignment.value.length > 0) {
            assigned = assigned + 1;
          }
        }
      }
    }

    // lc part 3
    const lcPart = source.midweek_meeting.lc_part3;
    const title =
      lcPart.title.find((record) => record.type === dataView)?.value || '';
    if (title?.length > 0) {
      const noAssign = sourcesCheckLCAssignments(title);

      if (!noAssign) {
        total = total + 1;

        assignment = schedule.midweek_meeting.lc_part3.find(
          (record) => record.type === dataView
        );
        if (assignment && assignment.value.length > 0) {
          assigned = assigned + 1;
        }
      }
    }

    // lc cbs conductor
    total = total + 1;

    assignment = schedule.midweek_meeting.lc_cbs.conductor.find(
      (record) => record.type === dataView
    );
    if (assignment && assignment.value.length > 0) {
      assigned = assigned + 1;
    }

    // lc cbs reader
    if (weekType === Week.NORMAL) {
      total = total + 1;

      assignment = schedule.midweek_meeting.lc_cbs.reader.find(
        (record) => record.type === dataView
      );
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }
    }

    // closing prayer
    total = total + 1;

    assignment = schedule.midweek_meeting.closing_prayer.find(
      (record) => record.type === dataView
    );
    if (assignment && assignment.value.length > 0) {
      assigned = assigned + 1;
    }
  }

  return { total, assigned };
};

export const schedulesWeekendInfo = async (week: string) => {
  const openingPrayerAutoAssign: boolean = await promiseGetRecoil(
    weekendMeetingOpeningPrayerAutoAssignState
  );
  const schedules: SchedWeekType[] = await promiseGetRecoil(schedulesState);
  const dataView: string = await promiseGetRecoil(userDataViewState);

  const schedule = schedules.find((record) => record.weekOf === week);
  const talkType =
    schedule.weekend_meeting.public_talk_type.find(
      (record) => record.type === dataView
    )?.value || 'localSpeaker';

  let total = 0;
  let assigned = 0;

  const weekType =
    schedule.weekend_meeting.week_type.find(
      (record) => record.type === dataView
    )?.value || Week.NORMAL;
  const hasNoMeeting =
    weekType === Week.ASSEMBLY ||
    weekType == Week.CONVENTION ||
    weekType === Week.MEMORIAL ||
    weekType === Week.NO_MEETING;

  if (!hasNoMeeting) {
    // chairman
    total = total + 1;

    let assignment = schedule.weekend_meeting.chairman.find(
      (record) => record.type === dataView
    );
    if (assignment && assignment.value.length > 0) {
      assigned = assigned + 1;
    }

    // opening prayer
    if (!openingPrayerAutoAssign) {
      total = total + 1;

      assignment = schedule.weekend_meeting.opening_prayer.find(
        (record) => record.type === dataView
      );
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }
    }

    // speakers
    if (weekType !== Week.CO_VISIT && talkType !== 'jwStreamRecording') {
      // speaker 1
      total = total + 1;

      assignment = schedule.weekend_meeting.speaker.part_1.find(
        (record) => record.type === dataView
      );
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }

      // speaker 2
      assignment = schedule.weekend_meeting.speaker.part_2.find(
        (record) => record.type === dataView
      );
      if (assignment && assignment.value.length > 0) {
        total = total + 1;
        assigned = assigned + 1;
      }
    }

    // wt study conductor
    assignment = schedule.weekend_meeting.wt_study.conductor.find(
      (record) => record.type === dataView
    );
    if (assignment && assignment.value.length > 0) {
      total = total + 1;
      assigned = assigned + 1;
    }

    // wt study reader
    if (weekType !== Week.CO_VISIT) {
      total = total + 1;

      assignment = schedule.weekend_meeting.wt_study.reader.find(
        (record) => record.type === dataView
      );
      if (assignment && assignment.value.length > 0) {
        assigned = assigned + 1;
      }
    }

    // closing prayer
    assignment = schedule.weekend_meeting.closing_prayer.find(
      (record) => record.type === dataView
    );

    if (talkType === 'jwStreamRecording') {
      total = total + 1;
    }

    if (assignment && assignment.value.length > 0) {
      assigned = assigned + 1;

      if (talkType !== 'jwStreamRecording') {
        total = total + 1;
      }
    }
  }

  return { total, assigned };
};

export const schedulesGetData = (
  schedule: SchedWeekType,
  path: string,
  dataView?: string
) => {
  const pathParts = path.split('.');
  let current: unknown = schedule;

  for (const part of pathParts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }

  if (dataView) {
    if (Array.isArray(current)) {
      const data = current as AssignmentCongregation[];
      current = data.find((record) => record.type === dataView);
    }

    return current as AssignmentCongregation;
  }

  return current as AssignmentCongregation | AssignmentCongregation[];
};

export const schedulesWeekGetAssigned = async ({
  schedule,
  assignment,
  dataView,
}: {
  schedule: SchedWeekType;
  dataView: string;
  assignment: AssignmentFieldType;
}) => {
  const path = ASSIGNMENT_PATH[assignment];
  const assigned = schedulesGetData(
    schedule,
    path,
    dataView
  ) as AssignmentCongregation;

  let result: string;

  if (assigned.value?.length > 0) {
    const person = await personsStateFind(assigned.value);
    const fullnameOption = await promiseGetRecoil(fullnameOptionState);

    result = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }

  return result;
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
  history.weekOfFormatted = formatDate(
    new Date(schedule.weekOf),
    getTranslation({ key: 'tr_shortDateFormat' })
  );
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
    history.assignment.title = getTranslation({
      key: 'tr_chairmanMidwekMeetingHistory',
    });
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
    const code: AssignmentCode =
      source.midweek_meeting[`ayf_part${partNum}`].type[lang];
    if (code) {
      const src: string =
        source.midweek_meeting[`ayf_part${partNum}`].src[lang];
      const title = assignmentOptions.find(
        (record) => record.value === code
      ).label;

      history.assignment.src = src;
      history.assignment.ayf = {};

      if (assignment.includes('Student')) {
        const assistantFld = assignment.replace('Student', 'Assistant');
        const assistantValue = schedulesGetData(
          schedule,
          ASSIGNMENT_PATH[assistantFld]
        );
        const asistants = Array.isArray(assistantValue)
          ? assistantValue
          : [assistantValue];

        history.assignment.title = title;
        history.assignment.code = code;
        history.assignment.ayf.assistant = asistants.find(
          (record) => record.type === assigned.type
        )?.value;
      }

      if (assignment.includes('Assistant')) {
        const studentFld = assignment.replace('Assistant', 'Student');
        const studentValue = schedulesGetData(
          schedule,
          ASSIGNMENT_PATH[studentFld]
        );
        const students = Array.isArray(studentValue)
          ? studentValue
          : [studentValue];

        history.assignment.title = `${getTranslation({ key: 'tr_assistant' })} (${title})`;
        history.assignment.code = AssignmentCode.MM_AssistantOnly;
        history.assignment.ayf.student = students.find(
          (record) => record.type === assigned.type
        )?.value;
      }
    }
  }

  if (assignment.startsWith('MM_LCPart')) {
    history.assignment.code = AssignmentCode.MM_LCPart;
    history.assignment.title = getTranslation({ key: 'tr_lcPart' });
  }

  if (assignment.startsWith('MM_LCPart') && assignment !== 'MM_LCPart3') {
    const partNum = assignment.match(/\d+\.?\d*/g).at(0);
    const lcPart: LivingAsChristiansType =
      source.midweek_meeting[`lc_part${partNum}`];

    const srcOverride = lcPart.title.override.find(
      (record) => record.type === assigned.type
    )?.value;
    const srcDefault = lcPart.title.default[lang];
    const src = srcOverride?.length > 0 ? srcOverride : srcDefault;

    const descOverride = lcPart.desc.override.find(
      (record) => record.type === assigned.type
    )?.value;
    const descDefault = lcPart.desc.default[lang];
    const desc = descOverride?.length > 0 ? descOverride : descDefault;

    history.assignment.src = src;
    history.assignment.desc = desc;
  }

  if (assignment === 'MM_LCPart3') {
    const lcPart = source.midweek_meeting.lc_part3;

    const src =
      lcPart.title.find((record) => record.type === assigned.type)?.value || '';
    const desc =
      lcPart.desc.find((record) => record.type === assigned.type)?.value || '';

    history.assignment.src = src;
    history.assignment.desc = desc;
  }

  if (assignment.startsWith('MM_LCCBS')) {
    history.assignment.src = source.midweek_meeting.lc_cbs.src[lang];
  }

  if (assignment === 'MM_LCCBSConductor') {
    history.assignment.code = AssignmentCode.MM_CBSConductor;
    history.assignment.title = getTranslation({
      key: 'tr_congregationBibleStudyConductor',
    });
  }

  if (assignment === 'MM_LCCBSReader') {
    history.assignment.code = AssignmentCode.MM_CBSReader;
    history.assignment.title = getTranslation({
      key: 'tr_congregationBibleStudyReader',
    });
  }

  if (assignment === 'WM_Chairman') {
    history.assignment.code = AssignmentCode.WM_Chairman;
    history.assignment.title = getTranslation({
      key: 'tr_chairmanWeekendMeetingHistory',
    });
  }

  if (assignment.startsWith('WM_') && assignment.endsWith('Prayer')) {
    history.assignment.code = AssignmentCode.WM_Prayer;
    history.assignment.title = getTranslation({ key: 'tr_prayer' });
  }

  if (assignment.includes('WM_Speaker_Part')) {
    history.assignment.code = AssignmentCode.WM_Speaker;
    history.assignment.title = getTranslation({ key: 'tr_speaker' });
  }

  if (assignment === 'WM_WTStudy_Conductor') {
    history.assignment.code = AssignmentCode.WM_WTStudyConductor;
    history.assignment.title = getTranslation({
      key: 'tr_watchtowerStudyConductor',
    });
  }

  if (assignment === 'WM_WTStudy_Reader') {
    history.assignment.code = AssignmentCode.WM_WTStudyReader;
    history.assignment.title = getTranslation({
      key: 'tr_watchtowerStudyReader',
    });
  }

  return history;
};

export const schedulesBuildHistoryList = async () => {
  const result: AssignmentHistoryType[] = [];
  const schedules: SchedWeekType[] = await promiseGetRecoil(schedulesState);
  const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
  const assignmentOptions: AssignmentLocalType[] = await promiseGetRecoil(
    assignmentTypeLocaleState
  );
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

  return result.sort((a, b) =>
    new Date(b.weekOf)
      .toISOString()
      .localeCompare(new Date(a.weekOf).toISOString())
  );
};

export const schedulesUpdateHistory = async (
  week: string,
  assignment: AssignmentFieldType,
  assigned: AssignmentCongregation
) => {
  const history: AssignmentHistoryType[] = await promiseGetRecoil(
    assignmentsHistoryState
  );

  const historyStale = structuredClone(history);

  // remove record from history
  const previousIndex = historyStale.findIndex(
    (record) => record.weekOf === week && record.assignment.key === assignment
  );
  if (previousIndex !== -1) historyStale.splice(previousIndex, 1);

  if (assigned.value !== '') {
    const schedules: SchedWeekType[] = await promiseGetRecoil(schedulesState);
    const sources: SourceWeekType[] = await promiseGetRecoil(sourcesState);
    const assignmentOptions: AssignmentLocalType[] = await promiseGetRecoil(
      assignmentTypeLocaleState
    );
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

  historyStale.sort((a, b) =>
    new Date(b.weekOf)
      .toISOString()
      .localeCompare(new Date(a.weekOf).toISOString())
  );

  await setAssignmentsHistory(historyStale);
};

export const schedulesSaveAssignment = async (
  schedule: SchedWeekType,
  assignment: AssignmentFieldType,
  value: PersonType | string
) => {
  const dataView = await promiseGetRecoil(userDataViewState);

  const toSave = value
    ? typeof value === 'string'
      ? value
      : value.person_uid
    : '';

  const path = ASSIGNMENT_PATH[assignment];
  const fieldUpdate = structuredClone(schedulesGetData(schedule, path));

  let assigned: AssignmentCongregation;

  if (Array.isArray(fieldUpdate)) {
    assigned = fieldUpdate.find((record) => record.type === dataView);
    assigned.value = toSave;
    assigned.updatedAt = new Date().toISOString();
    if (typeof value === 'string') {
      assigned.solo = true;
    }
  } else {
    assigned = fieldUpdate;
    fieldUpdate.value = toSave;
    fieldUpdate.updatedAt = new Date().toISOString();
    if (typeof value === 'string') {
      assigned.solo = true;
    }
  }

  const dataDb = {
    [path]: fieldUpdate,
  } as unknown as UpdateSpec<SchedWeekType>;

  await dbSchedUpdate(schedule.weekOf, dataDb);

  // update history
  await schedulesUpdateHistory(schedule.weekOf, assignment, assigned);
};

export const schedulesPersonNoPart = ({
  persons,
  history,
}: {
  persons: PersonType[];
  history: AssignmentHistoryType[];
}) => {
  let selected: PersonType;

  for (const person of persons) {
    const assignments = history.filter(
      (record) => record.assignment.person === person.person_uid
    );

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
  const classCount: number = await promiseGetRecoil(
    midweekMeetingClassCountState
  );

  let selected: PersonType;

  const currentDate = new Date(week);
  const lastMonth = addMonths(currentDate, -1);
  const nextMonth = addMonths(currentDate, 1);

  for (const person of persons) {
    const assignments = history.filter((record) => {
      const tmpDate = new Date(record.weekOf);

      return (
        tmpDate > lastMonth &&
        tmpDate < nextMonth &&
        record.assignment.person === person.person_uid
      );
    });

    if (assignments.length === 0) {
      const lastAssignment = history.find((record) => {
        const tmpDate = new Date(record.weekOf);

        return (
          tmpDate < currentDate &&
          record.assignment.person === person.person_uid
        );
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

        if (
          lastAssignmentType !== type &&
          (!hasAux || (hasAux && lastAssignmentClassroom !== classroom))
        ) {
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
  const classCount: number = await promiseGetRecoil(
    midweekMeetingClassCountState
  );

  let selected: PersonType;

  const currentDate = new Date(week);

  const last2Weeks = addWeeks(currentDate, -2);
  const next2Weeks = addWeeks(currentDate, 2);

  for (const person of persons) {
    const assignments = history.filter((record) => {
      const tmpDate = new Date(record.weekOf);

      return (
        tmpDate > last2Weeks &&
        tmpDate < next2Weeks &&
        record.assignment.person === person.person_uid
      );
    });

    if (assignments.length === 0) {
      const lastAssignment = history.find((record) => {
        const tmpDate = new Date(record.weekOf);

        return (
          tmpDate < currentDate &&
          record.assignment.person === person.person_uid
        );
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

        if (
          lastAssignmentType !== type &&
          (!hasAux || (hasAux && lastAssignmentClassroom !== classroom))
        ) {
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
  const classCount: number = await promiseGetRecoil(
    midweekMeetingClassCountState
  );

  let selected: PersonType;

  const currentDate = new Date(week);

  for (const person of persons) {
    const assignments = history.filter((record) => {
      return (
        week === record.weekOf && record.assignment.person === person.person_uid
      );
    });

    if (assignments.length === 0) {
      const lastAssignment = history.find((record) => {
        const tmpDate = new Date(record.weekOf);

        return (
          tmpDate < currentDate &&
          record.assignment.person === person.person_uid
        );
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

        if (
          lastAssignmentType !== type &&
          (!hasAux || (hasAux && lastAssignmentClassroom !== classroom))
        ) {
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
    const lastAssignment = history.find(
      (record) => record.assignment.person === person.person_uid
    );

    if (lastAssignment?.assignment.code !== type) {
      if (classroom) {
        const hasAux = classCount === 2;

        if (
          !hasAux ||
          (hasAux && lastAssignment.assignment.classroom !== classroom)
        ) {
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

export const schedulesPersonLatest = ({
  persons,
  type,
  history,
}: {
  persons: PersonType[];
  type: AssignmentCode;
  history: AssignmentHistoryType[];
  classroom?: string;
}) => {
  const filteredHistory = history.filter(
    (record) => record.assignment.code === type
  );
  const last = filteredHistory.at(0);

  const selected = persons.find(
    (record) => record.person_uid === last.assignment.person
  );

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
    personsElligible = personsElligible.filter((record) =>
      personIsElder(record)
    );
  }

  if (data.isAYFTalk) {
    personsElligible = personsElligible.filter(
      (record) => record.person_data.male.value
    );
  }

  if (data.mainStudent && data.mainStudent.length > 0) {
    const mainPerson = await personsStateFind(data.mainStudent);
    personsElligible = personsElligible.filter(
      (record) =>
        record.person_data.male.value === mainPerson.person_data.male.value
    );
  }

  if (personsElligible.length > 0) {
    // 1st rule: no part
    selected = await schedulesPersonNoPart({
      persons: personsElligible,
      history: data.history,
    });

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

    //  6th rule: pick the latest
    if (!selected) {
      selected = schedulesPersonLatest({
        persons: personsElligible,
        type: data.type,
        history: data.history,
      });
    }
  }

  return selected;
};

export const schedulesRemoveAssignment = async (
  schedule: SchedWeekType,
  assignment: AssignmentFieldType
) => {
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

export const scheduleDeleteMidweekWeekAssignments = async (
  schedule: SchedWeekType
) => {
  const dataDb = {
    [ASSIGNMENT_PATH['MM_Chairman_A']]: await schedulesRemoveAssignment(
      schedule,
      'MM_Chairman_A'
    ),
    [ASSIGNMENT_PATH['MM_Chairman_B']]: await schedulesRemoveAssignment(
      schedule,
      'MM_Chairman_B'
    ),
    [ASSIGNMENT_PATH['MM_OpeningPrayer']]: await schedulesRemoveAssignment(
      schedule,
      'MM_OpeningPrayer'
    ),
    [ASSIGNMENT_PATH['MM_TGWTalk']]: await schedulesRemoveAssignment(
      schedule,
      'MM_TGWTalk'
    ),
    [ASSIGNMENT_PATH['MM_TGWGems']]: await schedulesRemoveAssignment(
      schedule,
      'MM_TGWGems'
    ),
    [ASSIGNMENT_PATH['MM_TGWBibleReading_A']]: await schedulesRemoveAssignment(
      schedule,
      'MM_TGWBibleReading_A'
    ),
    [ASSIGNMENT_PATH['MM_TGWBibleReading_B']]: await schedulesRemoveAssignment(
      schedule,
      'MM_TGWBibleReading_B'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart1_Student_A']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart1_Student_A'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart1_Assistant_A']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart1_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart1_Student_B']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart1_Student_B'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart1_Assistant_B']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart1_Assistant_B'),
    [ASSIGNMENT_PATH['MM_AYFPart2_Student_A']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart2_Student_A'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart2_Assistant_A']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart2_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart2_Student_B']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart2_Student_B'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart2_Assistant_B']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart2_Assistant_B'),
    [ASSIGNMENT_PATH['MM_AYFPart3_Student_A']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart3_Student_A'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart3_Assistant_A']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart3_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart3_Student_B']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart3_Student_B'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart3_Assistant_B']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart3_Assistant_B'),
    [ASSIGNMENT_PATH['MM_AYFPart4_Student_A']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart4_Student_A'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart4_Assistant_A']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart4_Assistant_A'),
    [ASSIGNMENT_PATH['MM_AYFPart4_Student_B']]: await schedulesRemoveAssignment(
      schedule,
      'MM_AYFPart4_Student_B'
    ),
    [ASSIGNMENT_PATH['MM_AYFPart4_Assistant_B']]:
      await schedulesRemoveAssignment(schedule, 'MM_AYFPart4_Assistant_B'),
    [ASSIGNMENT_PATH['MM_LCPart1']]: await schedulesRemoveAssignment(
      schedule,
      'MM_LCPart1'
    ),
    [ASSIGNMENT_PATH['MM_LCPart2']]: await schedulesRemoveAssignment(
      schedule,
      'MM_LCPart2'
    ),
    [ASSIGNMENT_PATH['MM_LCPart3']]: await schedulesRemoveAssignment(
      schedule,
      'MM_LCPart3'
    ),
    [ASSIGNMENT_PATH['MM_LCCBSConductor']]: await schedulesRemoveAssignment(
      schedule,
      'MM_LCCBSConductor'
    ),
    [ASSIGNMENT_PATH['MM_LCCBSReader']]: await schedulesRemoveAssignment(
      schedule,
      'MM_LCCBSReader'
    ),
    [ASSIGNMENT_PATH['MM_ClosingPrayer']]: await schedulesRemoveAssignment(
      schedule,
      'MM_ClosingPrayer'
    ),
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
  const previousIndex = history.findIndex(
    (record) =>
      record.weekOf === schedule.weekOf && record.assignment.key === assignment
  );
  if (previousIndex !== -1) history.splice(previousIndex, 1);

  if (assigned.value !== '') {
    const assignmentOptions: AssignmentLocalType[] = await promiseGetRecoil(
      assignmentTypeLocaleState
    );
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

  history.sort((a, b) =>
    new Date(b.weekOf)
      .toISOString()
      .localeCompare(new Date(a.weekOf).toISOString())
  );
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
  await schedulesAutofillUpdateHistory({
    schedule,
    assignment,
    assigned,
    history,
  });
};

export const schedulesWeekNoMeeting = (week: Week) => {
  return (
    week === Week.ASSEMBLY ||
    week === Week.CONVENTION ||
    week === Week.MEMORIAL ||
    week === Week.NO_MEETING
  );
};

export const schedulesS89Data = async (
  schedule: SchedWeekType,
  dataView: string
) => {
  const fullnameOption = await promiseGetRecoil(fullnameOptionState);

  const result: S89DataType[] = [];

  const assignments: AssignmentFieldType[] = [
    'MM_TGWBibleReading_A',
    'MM_TGWBibleReading_B',
    'MM_AYFPart1_Student_A',
    'MM_AYFPart1_Student_B',
    'MM_AYFPart2_Student_A',
    'MM_AYFPart2_Student_B',
    'MM_AYFPart3_Student_A',
    'MM_AYFPart3_Student_B',
    'MM_AYFPart4_Student_A',
    'MM_AYFPart4_Student_B',
  ];

  for (const assignment of assignments) {
    const path = ASSIGNMENT_PATH[assignment];
    const assigned = schedulesGetData(
      schedule,
      path,
      dataView
    ) as AssignmentCongregation;

    if (assigned.value?.length > 0) {
      const person = await personsStateFind(assigned.value);

      const obj = <S89DataType>{};

      obj.id = crypto.randomUUID();
      obj.weekOf = schedule.weekOf;
      obj.student_name = buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      );

      if (assignment.includes('AYFPart')) {
        const assistant = assignment.replace('Student', 'Assistant');
        const path = ASSIGNMENT_PATH[assistant];
        const assistantAssigned = schedulesGetData(
          schedule,
          path,
          dataView
        ) as AssignmentCongregation;

        if (assistantAssigned?.value.length > 0) {
          const assistantPerson = await personsStateFind(
            assistantAssigned.value
          );

          obj.assistant_name = buildPersonFullname(
            assistantPerson.person_data.person_lastname.value,
            assistantPerson.person_data.person_firstname.value,
            fullnameOption
          );
        }
      }

      obj.assignment_date = dateFormatFriendly(schedule.weekOf);

      if (assignment.includes('TGWBibleReading')) {
        obj.part_number = '3';
      }

      if (assignment.includes('Part1')) {
        obj.part_number = '4';
      }

      if (assignment.includes('Part2')) {
        obj.part_number = '5';
      }

      if (assignment.includes('Part3')) {
        obj.part_number = '6';
      }

      if (assignment.includes('Part4')) {
        obj.part_number = '7';
      }

      if (assignment.includes('_A')) {
        obj.main_hall = true;
      }

      if (assignment.includes('_B')) {
        obj.aux_class_1 = true;
      }

      result.push(obj);
    }
  }

  return result;
};

export const schedulesMidweekGetTiming = ({
  schedule,
  source,
  dataView,
  lang,
  pgmStart,
}: {
  schedule: SchedWeekType;
  source: SourceWeekType;
  dataView: string;
  lang: string;
  pgmStart: string;
}) => {
  const timing = <MidweekMeetingDataType['timing']>{};

  timing.pgm_start = pgmStart;

  timing.opening_comments = timeAddMinutes(timing.pgm_start, 5);

  timing.tgw_talk = timeAddMinutes(timing.opening_comments, 1);

  let time = sourcesPartTiming(source, 'tgw_talk', dataView, lang);
  timing.tgw_gems = timeAddMinutes(timing.tgw_talk, time);

  time = sourcesPartTiming(source, 'tgw_gems', dataView, lang);
  timing.tgw_bible_reading = timeAddMinutes(timing.tgw_gems, time);

  timing.ayf_part1 = timeAddMinutes(timing.tgw_bible_reading, 5);

  time = sourcesPartTiming(source, 'ayf_part1', dataView, lang);
  const ayf_part1 = source.midweek_meeting.ayf_part1.type[lang];

  if (ayf_part1 && ayf_part1 === AssignmentCode.MM_Discussion) {
    timing.ayf_part2 = timeAddMinutes(timing.ayf_part1, time);
  } else {
    timing.ayf_part2 = timeAddMinutes(timing.ayf_part1, time + 1);
  }

  time = sourcesPartTiming(source, 'ayf_part2', dataView, lang);
  const ayf_part2 = source.midweek_meeting.ayf_part2.type[lang];

  if (!ayf_part2) {
    timing.ayf_part3 = timing.ayf_part2;
  } else {
    if (ayf_part2 === AssignmentCode.MM_Discussion) {
      timing.ayf_part3 = timeAddMinutes(timing.ayf_part2, time);
    } else {
      timing.ayf_part3 = timeAddMinutes(timing.ayf_part2, time + 1);
    }
  }

  time = sourcesPartTiming(source, 'ayf_part3', dataView, lang);
  const ayf_part3 = source.midweek_meeting.ayf_part3.type[lang];

  if (!ayf_part3) {
    timing.ayf_part4 = timing.ayf_part3;
  } else {
    if (ayf_part3 === AssignmentCode.MM_Discussion) {
      timing.ayf_part4 = timeAddMinutes(timing.ayf_part3, time);
    } else {
      timing.ayf_part4 = timeAddMinutes(timing.ayf_part3, time + 1);
    }
  }

  time = sourcesPartTiming(source, 'ayf_part4', dataView, lang);
  const ayf_part4 = source.midweek_meeting.ayf_part4.type[lang];

  if (!ayf_part4) {
    timing.lc_middle_song = timing.ayf_part4;
  } else {
    if (ayf_part4 === AssignmentCode.MM_Discussion) {
      timing.lc_middle_song = timeAddMinutes(timing.ayf_part4, time);
    } else {
      timing.lc_middle_song = timeAddMinutes(timing.ayf_part4, time + 1);
    }
  }

  timing.lc_part1 = timeAddMinutes(timing.lc_middle_song, 5);

  time = sourcesPartTiming(source, 'lc_part1', dataView, lang);
  timing.lc_part2 = timeAddMinutes(timing.lc_part1, time);

  time = sourcesPartTiming(source, 'lc_part2', dataView, lang);
  if (time > 0) {
    timing.lc_part3 = timeAddMinutes(timing.lc_part2, time);
  } else {
    timing.lc_part3 = timing.lc_part2;
  }

  const week_type =
    schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    )?.value || Week.NORMAL;

  if (week_type === Week.NORMAL) {
    time = sourcesPartTiming(source, 'lc_part3', dataView, lang);
    if (time > 0) {
      timing.cbs = timeAddMinutes(timing.lc_part3, time);
    } else {
      timing.cbs = timing.lc_part3;
    }

    time = sourcesPartTiming(source, 'lc_cbs', dataView, lang);
    timing.concluding_comments = timeAddMinutes(timing.cbs, time);

    timing.pgm_end = timeAddMinutes(timing.concluding_comments, 3);
  }

  if (week_type === Week.CO_VISIT) {
    time = sourcesPartTiming(source, 'lc_part3', dataView, lang);
    if (time > 0) {
      timing.concluding_comments = timeAddMinutes(timing.lc_part3, time);
    } else {
      timing.concluding_comments = timing.lc_part3;
    }

    timing.co_talk = timeAddMinutes(timing.concluding_comments, 3);

    timing.pgm_end = timeAddMinutes(timing.co_talk, 30);
  }

  return timing;
};

export const schedulesMidweekData = async (
  schedule: SchedWeekType,
  dataView: string,
  lang: string
) => {
  const source = await sourcesFind(schedule.weekOf);
  const useExactDate: boolean = await promiseGetRecoil(
    midweekMeetingExactDateState
  );
  const months: string[] = await promiseGetRecoil(monthNamesState);
  const class_count: number = await promiseGetRecoil(
    midweekMeetingClassCountState
  );
  const openingPrayerAuto: boolean = await promiseGetRecoil(
    midweekMeetingOpeningPrayerAutoAssign
  );
  const useDisplayName: boolean = await promiseGetRecoil(
    displayNameEnableState
  );

  const minLabel = getTranslation({ key: 'tr_minLabel' });

  const result = <MidweekMeetingDataType>{};

  // get meeting parts timing
  const pgmStart = await promiseGetRecoil(midweekMeetingTimeState);
  result.timing = schedulesMidweekGetTiming({
    schedule,
    source,
    dataView,
    lang,
    pgmStart,
  });

  // get other data
  result.weekOf = schedule.weekOf;

  let scheduleDate = '';

  if (useExactDate) {
    const meetingDay = await promiseGetRecoil(midweekMeetingWeekdayState);
    const [year, month, day] = schedule.weekOf.split('/');
    const newDate = new Date(+year, +month - 1, +day + +meetingDay - 1);

    const meetingDate = newDate.getDate();
    const meetingMonth = months[newDate.getMonth()];
    const meetingYear = newDate.getFullYear();

    scheduleDate = getTranslation({
      key: 'tr_longDateWithYearLocale',
      params: { month: meetingMonth, date: meetingDate, year: meetingYear },
    });
  } else {
    scheduleDate = source.midweek_meeting.week_date_locale[lang];
  }

  result.schedule_title =
    scheduleDate + ' | ' + source.midweek_meeting.weekly_bible_reading[lang];

  const week_type = schedule.midweek_meeting.week_type.find(
    (record) => record.type === dataView
  ).value;

  result.week_type = week_type;
  result.no_meeting = schedulesWeekNoMeeting(week_type);

  if (week_type !== Week.NORMAL) {
    const event_name = source.midweek_meeting.event_name.value;

    if (event_name.length > 0) {
      result.week_type_name = event_name;
    } else {
      const weekTypes: WeekTypeLocale[] =
        await promiseGetRecoil(weekTypeLocaleState);
      const name = weekTypes.find(
        (record) => record.id === week_type
      ).week_type_name;

      result.week_type_name = name;
    }
  }

  result.chairman_A_name = await schedulesWeekGetAssigned({
    schedule,
    dataView,
    assignment: 'MM_Chairman_A',
  });

  if (week_type !== Week.CO_VISIT && class_count === 2) {
    result.chairman_B_name = await schedulesWeekGetAssigned({
      schedule,
      dataView,
      assignment: 'MM_Chairman_B',
    });
  }

  result.song_first =
    getTranslation({ key: 'tr_song' }) +
    ' ' +
    source.midweek_meeting.song_first[lang];

  if (openingPrayerAuto) {
    result.opening_prayer_name = result.chairman_A_name;
  } else {
    result.opening_prayer_name = await schedulesWeekGetAssigned({
      schedule,
      dataView,
      assignment: 'MM_OpeningPrayer',
    });
  }

  result.tgw_talk_name = await schedulesWeekGetAssigned({
    schedule,
    dataView,
    assignment: 'MM_TGWTalk',
  });
  result.tgw_talk_src = source.midweek_meeting.tgw_talk.src[lang];
  result.tgw_talk_time =
    sourcesPartTiming(source, 'tgw_talk', dataView, lang) + ' ' + minLabel;

  result.tgw_gems_name = await schedulesWeekGetAssigned({
    schedule,
    dataView,
    assignment: 'MM_TGWGems',
  });
  result.tgw_gems_src = source.midweek_meeting.tgw_gems.title[lang];
  result.tgw_gems_time =
    sourcesPartTiming(source, 'tgw_gems', dataView, lang) + ' ' + minLabel;

  result.tgw_bible_reading_A_name = await schedulesWeekGetAssigned({
    schedule,
    dataView,
    assignment: 'MM_TGWBibleReading_A',
  });
  result.tgw_bible_reading_src =
    source.midweek_meeting.tgw_bible_reading.title[lang];

  if (class_count === 2) {
    result.tgw_bible_reading_B_name = await schedulesWeekGetAssigned({
      schedule,
      dataView,
      assignment: 'MM_TGWBibleReading_B',
    });
  }

  for (let i = 1; i < 5; i++) {
    const baseName = `ayf_part${i}`;
    const assignment = baseName as SourceAssignmentType;
    const fieldType = `${baseName}_type`;
    const fieldTypeName = `${baseName}_type_name`;
    const fieldTime = `${baseName}_time`;
    const fieldLabel = `${baseName}_label`;
    const fieldNameA = `${baseName}_A_name`;
    const fieldStudentNameA = `${baseName}_A_student_name`;
    const fieldAssistantNameA = `${baseName}_A_assistant_name`;
    const fieldNameB = `${baseName}_B_name`;
    const fieldStudentNameB = `${baseName}_B_student_name`;
    const fieldAssistantNameB = `${baseName}_B_assistant_name`;
    const fieldStudentA = `MM_AYFPart${i}_Student_A` as AssignmentFieldType;
    const fieldStudentB = `MM_AYFPart${i}_Student_A` as AssignmentFieldType;
    const fieldAssistantA = `MM_AYFPart${i}_Assistant_A` as AssignmentFieldType;
    const fieldAssistantB = `MM_AYFPart${i}_Assistant_A` as AssignmentFieldType;

    const ayfSource: ApplyMinistryType = source.midweek_meeting[baseName];

    const ayfTitle = ayfSource.title[lang];

    if (ayfTitle?.length > 0) {
      const ayfType = ayfSource.type[lang];

      result[fieldType] = ayfType;
      result[fieldTypeName] = ayfSource.title[lang];
      result[fieldTime] =
        sourcesPartTiming(source, assignment, dataView, lang) + ' ' + minLabel;

      const src = ayfSource.src[lang];
      const isTalk =
        ayfType === AssignmentCode.MM_ExplainingBeliefs
          ? sourcesCheckAYFExplainBeliefsAssignment(src)
          : false;

      if (
        ayfType === AssignmentCode.MM_Talk ||
        (ayfType === AssignmentCode.MM_ExplainingBeliefs && isTalk)
      ) {
        result[fieldLabel] = getTranslation({ key: 'tr_student' }) + ':';
      } else {
        if (useDisplayName) {
          result[fieldLabel] =
            getTranslation({ key: 'tr_student' }) +
            '/' +
            getTranslation({ key: 'tr_assistantS89' }) +
            ':';
        }

        if (!useDisplayName) {
          result[fieldLabel] =
            getTranslation({ key: 'tr_student' }) +
            ':' +
            '\u000A' +
            getTranslation({ key: 'tr_assistant' }) +
            ':';
        }
      }

      result[fieldNameA] = await schedulesWeekGetAssigned({
        schedule,
        dataView,
        assignment: fieldStudentA,
      });

      result[fieldStudentNameA] = result[fieldNameA];

      let assistant = await schedulesWeekGetAssigned({
        schedule,
        dataView,
        assignment: fieldAssistantA,
      });

      if (assistant?.length > 0) {
        result[fieldNameA] += useDisplayName ? '/' : '\u000A';
        result[fieldNameA] += assistant;

        result[fieldAssistantNameA] = assistant;
      }

      if (week_type !== Week.CO_VISIT && class_count === 2) {
        result[fieldNameB] = await schedulesWeekGetAssigned({
          schedule,
          dataView,
          assignment: fieldStudentB,
        });

        result[fieldStudentNameB] = result[fieldNameB];

        assistant = await schedulesWeekGetAssigned({
          schedule,
          dataView,
          assignment: fieldAssistantB,
        });

        if (assistant?.length > 0) {
          result[fieldNameB] += useDisplayName ? '/' : '\u000A';
          result[fieldNameB] += assistant;

          result[fieldAssistantNameB] = assistant;
        }
      }
    }
  }

  result.lc_middle_song =
    getTranslation({ key: 'tr_song' }) +
    ' ' +
    source.midweek_meeting.song_middle[lang];

  result.lc_count = sourcesCountLC(source, dataView, lang);

  for (let i = 1; i < 3; i++) {
    const baseName = `lc_part${i}`;
    const assignment = baseName as SourceAssignmentType;
    const fieldSrc = `${baseName}_src`;
    const fieldTime = `${baseName}_time`;
    const fieldName = `${baseName}_name`;
    const fieldAssignment = `MM_LCPart${i}` as AssignmentFieldType;

    const lcPart: LivingAsChristiansType = source.midweek_meeting[baseName];
    const lcSrc = sourcesLCGetTitle(lcPart, dataView, lang);

    if (lcSrc?.length > 0) {
      result[fieldSrc] = sourcesLCGetTitle(lcPart, dataView, lang);
      result[fieldTime] =
        sourcesPartTiming(source, assignment, dataView, lang) + ' ' + minLabel;
      result[fieldName] = await schedulesWeekGetAssigned({
        schedule,
        dataView,
        assignment: fieldAssignment,
      });
    }
  }

  const lcPart3 = source.midweek_meeting.lc_part3;
  const lcPart3_title =
    lcPart3.title.find((record) => record.type === dataView)?.value || '';

  if (lcPart3_title.length > 0) {
    result.lc_part3_src = lcPart3_title;
    result.lc_part3_time =
      sourcesPartTiming(source, 'lc_part3', dataView, lang) + ' ' + minLabel;
    result.lc_part3_name = await schedulesWeekGetAssigned({
      schedule,
      dataView,
      assignment: 'MM_LCPart3',
    });
  }

  if (week_type === Week.NORMAL) {
    result.lc_cbs_title = sourcesCBSGetTitle(
      source.midweek_meeting.lc_cbs,
      dataView,
      lang
    );
    result.lc_cbs_time =
      sourcesPartTiming(source, 'lc_cbs', dataView, lang) + ' ' + minLabel;

    if (useDisplayName) {
      result.lc_cbs_label =
        getTranslation({ key: 'tr_cbsConductor' }) +
        '/' +
        getTranslation({ key: 'tr_cbsReader' }) +
        ':';
    }

    if (!useDisplayName) {
      result.lc_cbs_label =
        getTranslation({ key: 'tr_cbsConductor' }) +
        ':' +
        '\u000A' +
        getTranslation({ key: 'tr_cbsReader' }) +
        ':';
    }

    result.lc_cbs_name = await schedulesWeekGetAssigned({
      schedule,
      dataView,
      assignment: 'MM_LCCBSConductor',
    });

    result.lc_cbs_conductor_name = result.lc_cbs_name;

    const reader = await schedulesWeekGetAssigned({
      schedule,
      dataView,
      assignment: 'MM_LCCBSReader',
    });

    if (reader?.length > 0) {
      result.lc_cbs_name += useDisplayName ? '/' : '\u000A';
      result.lc_cbs_name += reader;

      result.lc_cbs_reader_name = reader;
    }
  }

  if (week_type === Week.CO_VISIT) {
    const COFullname = await promiseGetRecoil(COFullnameState);
    const CODisplayName = await promiseGetRecoil(CODisplayNameState);

    result.lc_co_talk = source.midweek_meeting.co_talk_title.src;
    result.co_name = useDisplayName ? CODisplayName : COFullname;
  }

  const concluding_song = sourcesSongConclude({
    meeting: 'midweek',
    source,
    dataView,
    lang,
  });
  const isSongText = isNaN(+concluding_song);

  result.lc_concluding_song = isSongText
    ? concluding_song
    : getTranslation({ key: 'tr_song' }) + ' ' + concluding_song;

  result.lc_concluding_prayer = await schedulesWeekGetAssigned({
    schedule,
    dataView,
    assignment: 'MM_ClosingPrayer',
  });

  return result;
};
