import { store } from '@states/index';
import { rootModalOpenState } from '@states/app';
import { PersonType } from '@definition/person';
import { AssignmentCode } from '@definition/assignment';
import {
  FieldServiceGroupMemberType,
  FieldServiceGroupType,
} from '@definition/field_service_groups';
import {
  generateDisplayName,
  getRandomArrayItem,
  getRandomNumber,
} from './common';
import {
  personIsBaptizedPublisher,
  personIsElder,
  personIsEnrollmentActive,
  personIsMidweekStudent,
  personIsMS,
  personIsPublisher,
} from '@services/app/persons';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import {
  addDays,
  addMonths,
  addWeeks,
  createArrayFromMonths,
  currentReportMonth,
  formatDate,
  getWeekDate,
  weeksInMonth,
} from './date';
import {
  SchemaBranchFieldServiceReport,
  congFieldServiceReportSchema,
  meetingAttendanceSchema,
  scheduleSchema,
  sourceSchema,
  userFieldServiceDailyReportSchema,
  speakersCongregationSchema,
  userFieldServiceMonthlyReportSchema,
  vistingSpeakerSchema,
} from '@services/dexie/schema';
import {
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import { schedulesStartAutofill } from '@services/app/autofill';
import { publicTalksState } from '@states/public_talks';
import { sourcesState } from '@states/sources';
import { languageGroupsState } from '@states/field_service_groups';
import { dbSourcesBulkPut } from '@services/dexie/sources';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import PERSON_MOCK from '@constants/person_mock';
import appDb from '@db/appDb';
import { assignmentsHistoryState, schedulesState } from '@states/schedules';
import { Week } from '@definition/week_type';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { dbSchedBulkUpdate } from '@services/dexie/schedules';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
  UpcomingEventType,
} from '@definition/upcoming_events';
import { dbUpcomingEventsBulkSave } from '@services/dexie/upcoming_events';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import { dbUserFieldServiceReportsBulkSave } from '@services/dexie/user_field_service_reports';
import { dbUserBibleStudySave } from '@services/dexie/user_bible_studies';

const getRandomDate = (
  start_date = new Date(1970, 0, 1),
  end_date = new Date(2010, 11, 31)
) => {
  const minValue = start_date.getTime();
  const maxValue = end_date.getTime();
  const timestamp = Math.floor(
    Math.random() * (maxValue - minValue + 1) + minValue
  );

  return formatDate(new Date(timestamp), 'yyyy/MM/dd');
};

export const importDummyPersons = async (showLoading?: boolean) => {
  const showProgress = showLoading ?? true;

  try {
    if (showProgress) {
      store.set(rootModalOpenState, true);
    }

    await appDb.persons.clear();

    const startDateTemp = formatDate(
      new Date(new Date().getUTCFullYear() - 1, 8, 1),
      'yyyy/MM/dd'
    );

    const formattedData: PersonType[] = PERSON_MOCK.map((user) => {
      const obj = {
        _deleted: { value: false, updatedAt: '' },
        person_uid: crypto.randomUUID(),
        person_data: {
          disqualified: { value: false, updatedAt: new Date().toISOString() },
          female: {
            value: user.gender === 'female',
            updatedAt: new Date().toISOString(),
          },
          male: {
            value: user.gender === 'male',
            updatedAt: new Date().toISOString(),
          },
          archived: { value: false, updatedAt: new Date().toISOString() },
          person_firstname: {
            value: user.firstName,
            updatedAt: new Date().toISOString(),
          },
          person_lastname: {
            value: user.lastName,
            updatedAt: new Date().toISOString(),
          },
          person_display_name: {
            value: generateDisplayName(user.lastName, user.firstName),
            updatedAt: new Date().toISOString(),
          },
          birth_date: {
            value: (() => {
              const [y, m, d] = user.birthDate.split('/');
              return new Date(+y, +m - 1, +d).toISOString();
            })(),
            updatedAt: new Date().toISOString(),
          },
          address: {
            value: user.address,
            updatedAt: new Date().toISOString(),
          },
          email: { value: user.email, updatedAt: new Date().toISOString() },
          phone: { value: user.phone, updatedAt: new Date().toISOString() },
          publisher_baptized: {
            active: { value: false, updatedAt: new Date().toISOString() },
            anointed: { value: false, updatedAt: new Date().toISOString() },
            other_sheep: { value: true, updatedAt: new Date().toISOString() },
            baptism_date: { value: null, updatedAt: new Date().toISOString() },
            history: [],
          },
          publisher_unbaptized: {
            active: { value: false, updatedAt: new Date().toISOString() },
            history: [],
          },
          midweek_meeting_student: {
            active: { value: false, updatedAt: new Date().toISOString() },
            history: [],
          },
          timeAway: [],
          assignments: [],
          privileges: [],
          enrollments: [],
          emergency_contacts: [],
          family_members: { head: false, updatedAt: '', members: [] },
        },
      };

      return obj;
    });

    const cnFemaleMidweek = 5;
    const cnFemaleUnbaptized = 10;
    const cnFemaleAP = 2;
    const cnFemaleFR = 8;
    const cnFemaleFS = 2;
    const cnFemaleFMF = 2;

    let activeFemaleMidweek = 0;
    let activeFemaleUnbaptized = 0;
    let activeFemaleAP = 0;
    let activeFemaleFR = 0;
    let activeFemaleFS = 0;
    let activeFemaleFMF = 0;

    for (const person of formattedData) {
      if (person.person_data.female.value) {
        const femaleArray = [
          'midweek',
          'unbaptized',
          'baptized',
          'AP',
          'FR',
          'FS',
          'FMF',
        ];
        let statusPassed = false;
        let femaleStatus: string;

        do {
          femaleStatus =
            femaleArray[Math.floor(Math.random() * femaleArray.length)];

          if (
            femaleStatus === 'midweek' &&
            activeFemaleMidweek < cnFemaleMidweek
          ) {
            statusPassed = true;
            activeFemaleMidweek++;
          }

          if (
            femaleStatus === 'unbaptized' &&
            activeFemaleUnbaptized < cnFemaleUnbaptized
          ) {
            statusPassed = true;
            activeFemaleUnbaptized++;
          }

          if (femaleStatus === 'baptized') {
            statusPassed = true;
          }

          if (femaleStatus === 'AP' && activeFemaleAP < cnFemaleAP) {
            statusPassed = true;
            activeFemaleAP++;
          }

          if (femaleStatus === 'FR' && activeFemaleFR < cnFemaleFR) {
            statusPassed = true;
            activeFemaleFR++;
          }

          if (femaleStatus === 'FS' && activeFemaleFS < cnFemaleFS) {
            statusPassed = true;
            activeFemaleFS++;
          }

          if (femaleStatus === 'FMF' && activeFemaleFMF < cnFemaleFMF) {
            statusPassed = true;
            activeFemaleFMF++;
          }
        } while (statusPassed === false);

        if (femaleStatus === 'midweek') {
          person.person_data.midweek_meeting_student = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: startDateTemp,
                end_date: null,
              },
            ],
          };

          person.person_data.assignments.push({
            type: 'main',
            values: [AssignmentCode.MM_AssistantOnly],
            updatedAt: new Date().toISOString(),
          });
        }

        if (femaleStatus === 'unbaptized') {
          person.person_data.first_report = {
            value: startDateTemp,
            updatedAt: new Date().toISOString(),
          };

          person.person_data.publisher_unbaptized = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: startDateTemp,
                end_date: null,
              },
            ],
          };

          person.person_data.assignments.push({
            type: 'main',
            updatedAt: new Date().toISOString(),
            values: [
              AssignmentCode.MM_StartingConversation,
              AssignmentCode.MM_FollowingUp,
              AssignmentCode.MM_ExplainingBeliefs,
              AssignmentCode.MM_MakingDisciples,
            ],
          });
        }

        if (
          femaleStatus === 'baptized' ||
          femaleStatus === 'AP' ||
          femaleStatus === 'FR' ||
          femaleStatus === 'FS' ||
          femaleStatus === 'FMF'
        ) {
          const baptismStartDate = new Date(
            new Date(person.person_data.birth_date.value).setFullYear(
              new Date(person.person_data.birth_date.value).getFullYear() + 11
            )
          );

          person.person_data.first_report = {
            value: startDateTemp,
            updatedAt: new Date().toISOString(),
          };

          person.person_data.publisher_baptized = {
            active: { value: true, updatedAt: new Date().toISOString() },
            baptism_date: {
              value: getRandomDate(baptismStartDate),
              updatedAt: new Date().toISOString(),
            },
            other_sheep: { value: true, updatedAt: new Date().toISOString() },
            anointed: { value: false, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: startDateTemp,
                end_date: null,
              },
            ],
          };

          person.person_data.assignments.push({
            type: 'main',
            updatedAt: new Date().toISOString(),
            values: [
              AssignmentCode.MM_StartingConversation,
              AssignmentCode.MM_FollowingUp,
              AssignmentCode.MM_ExplainingBeliefs,
              AssignmentCode.MM_MakingDisciples,
            ],
          });
        }

        if (
          femaleStatus === 'AP' ||
          femaleStatus === 'FR' ||
          femaleStatus === 'FS' ||
          femaleStatus === 'FMF'
        ) {
          person.person_data.enrollments.push({
            id: crypto.randomUUID(),
            _deleted: false,
            updatedAt: new Date().toISOString(),
            enrollment: femaleStatus,
            start_date: startDateTemp,
            end_date: null,
          });
        }

        if (femaleStatus === 'FR') {
          person.person_data.assignments
            .at(0)
            .values.push(AssignmentCode.MINISTRY_HOURS_CREDIT);

          person.person_data.assignments.at(0).updatedAt =
            new Date().toISOString();
        }
      }
    }

    const cnMaleMidweek = 5;
    const cnMaleUnbaptized = 15;
    const cnElder = 9;
    const cnElderFR = 5;
    const cnElderWTConductor = 3;
    const cnMinServ = 4;
    const cnMinServFR = 8;
    const cnMaleFR = 4;
    const cnMaleFS = 2;
    const cnMaleFMF = 2;

    let activeMaleMidweek = 0;
    let activeMaleUnbaptized = 0;
    let activeElder = 0;
    let activeElderFR = 0;
    let activeElderWTConductor = 0;
    let activeMinServ = 0;
    let activeMinServFR = 0;
    let activeMaleFR = 0;
    let activeMaleFS = 0;
    let activeMaleFMF = 0;

    for (const person of formattedData) {
      if (person.person_data.male.value) {
        const maleArray = [
          'midweek',
          'unbaptized',
          'baptized',
          'elder',
          'elderFR',
          'elderWTConductor',
          'minServ',
          'minServFR',
          'FR',
          'FS',
          'FMF',
        ];

        let statusPassed = false;
        let maleStatus: string;

        do {
          maleStatus = maleArray[Math.floor(Math.random() * maleArray.length)];

          if (maleStatus === 'midweek' && activeMaleMidweek < cnMaleMidweek) {
            statusPassed = true;
            activeMaleMidweek++;
          }

          if (
            maleStatus === 'unbaptized' &&
            activeMaleUnbaptized < cnMaleUnbaptized
          ) {
            statusPassed = true;
            activeMaleUnbaptized++;
          }

          if (maleStatus === 'baptized') {
            statusPassed = true;
          }

          if (maleStatus === 'elder' && activeElder < cnElder) {
            statusPassed = true;
            activeElder++;
          }

          if (maleStatus === 'elderFR' && activeElderFR < cnElderFR) {
            statusPassed = true;
            activeElderFR++;
          }

          if (
            maleStatus === 'elderWTConductor' &&
            activeElderWTConductor < cnElderWTConductor
          ) {
            statusPassed = true;
            activeElderWTConductor++;
          }

          if (maleStatus === 'minServ' && activeMinServ < cnMinServ) {
            statusPassed = true;
            activeMinServ++;
          }

          if (maleStatus === 'minServFR' && activeMinServFR < cnMinServFR) {
            statusPassed = true;
            activeMinServFR++;
          }

          if (maleStatus === 'FR' && activeMaleFR < cnMaleFR) {
            statusPassed = true;
            activeMaleFR++;
          }

          if (maleStatus === 'FS' && activeMaleFS < cnMaleFS) {
            statusPassed = true;
            activeMaleFS++;
          }

          if (maleStatus === 'FMF' && activeMaleFMF < cnMaleFMF) {
            statusPassed = true;
            activeMaleFMF++;
          }
        } while (statusPassed === false);

        if (maleStatus === 'midweek') {
          person.person_data.midweek_meeting_student = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: startDateTemp,
                end_date: null,
              },
            ],
          };

          person.person_data.assignments.push({
            type: 'main',
            values: [AssignmentCode.MM_BibleReading],
            updatedAt: new Date().toISOString(),
          });
        }

        if (maleStatus === 'unbaptized') {
          person.person_data.first_report = {
            value: startDateTemp,
            updatedAt: new Date().toISOString(),
          };

          person.person_data.publisher_unbaptized = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: startDateTemp,
                end_date: null,
              },
            ],
          };

          person.person_data.assignments.push({
            type: 'main',
            values: [
              AssignmentCode.MM_BibleReading,
              AssignmentCode.MM_StartingConversation,
              AssignmentCode.MM_FollowingUp,
              AssignmentCode.MM_ExplainingBeliefs,
              AssignmentCode.MM_MakingDisciples,
            ],
            updatedAt: new Date().toISOString(),
          });
        }

        if (
          maleStatus === 'baptized' ||
          maleStatus === 'elder' ||
          maleStatus === 'elderFR' ||
          maleStatus === 'elderWTConductor' ||
          maleStatus === 'minServ' ||
          maleStatus === 'minServFR' ||
          maleStatus === 'FR' ||
          maleStatus === 'FS' ||
          maleStatus === 'FMF'
        ) {
          const baptismStartDate = new Date(
            new Date(person.person_data.birth_date.value).setFullYear(
              new Date(person.person_data.birth_date.value).getFullYear() + 11
            )
          );

          person.person_data.first_report = {
            value: startDateTemp,
            updatedAt: new Date().toISOString(),
          };

          person.person_data.publisher_baptized = {
            active: { value: true, updatedAt: new Date().toISOString() },
            baptism_date: {
              value: getRandomDate(baptismStartDate),
              updatedAt: new Date().toISOString(),
            },
            other_sheep: { value: true, updatedAt: new Date().toISOString() },
            anointed: { value: false, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                _deleted: false,
                updatedAt: new Date().toISOString(),
                start_date: startDateTemp,
                end_date: null,
              },
            ],
          };
        }

        if (maleStatus === 'baptized' || maleStatus === 'FR') {
          person.person_data.assignments.push({
            type: 'main',
            values: [
              AssignmentCode.MM_StartingConversation,
              AssignmentCode.MM_FollowingUp,
              AssignmentCode.MM_ExplainingBeliefs,
              AssignmentCode.MM_MakingDisciples,
              AssignmentCode.MM_Talk,
            ],
            updatedAt: new Date().toISOString(),
          });
        }

        if (
          maleStatus === 'elder' ||
          maleStatus === 'elderFR' ||
          maleStatus === 'elderWTConductor' ||
          maleStatus === 'FS' ||
          maleStatus === 'FMF'
        ) {
          person.person_data.privileges.push({
            id: crypto.randomUUID(),
            _deleted: false,
            updatedAt: new Date().toISOString(),
            privilege: 'elder',
            start_date: startDateTemp,
            end_date: null,
          });

          person.person_data.assignments.push({
            type: 'main',
            updatedAt: new Date().toISOString(),
            values: [
              AssignmentCode.MM_Chairman,
              AssignmentCode.MM_AuxiliaryCounselor,
              AssignmentCode.MM_Prayer,
              AssignmentCode.MM_TGWTalk,
              AssignmentCode.MM_TGWGems,
              AssignmentCode.MM_Discussion,
              AssignmentCode.MM_LCPart,
              AssignmentCode.MM_CBSConductor,
              AssignmentCode.WM_Chairman,
              AssignmentCode.WM_Prayer,
              AssignmentCode.WM_Speaker,
            ],
          });

          person.person_data.assignments.at(0).updatedAt =
            new Date().toISOString();
        }

        if (maleStatus === 'minServ' || maleStatus === 'minServFR') {
          person.person_data.privileges.push({
            id: crypto.randomUUID(),
            _deleted: false,
            updatedAt: new Date().toISOString(),
            privilege: 'ms',
            start_date: startDateTemp,
            end_date: null,
          });

          person.person_data.assignments.push({
            type: 'main',
            updatedAt: new Date().toISOString(),
            values: [
              AssignmentCode.MM_Prayer,
              AssignmentCode.MM_TGWTalk,
              AssignmentCode.MM_TGWGems,
              AssignmentCode.MM_Discussion,
              AssignmentCode.MM_LCPart,
              AssignmentCode.MM_CBSReader,
              AssignmentCode.WM_Chairman,
              AssignmentCode.WM_Prayer,
              AssignmentCode.WM_WTStudyReader,
            ],
          });

          person.person_data.assignments.at(0).updatedAt =
            new Date().toISOString();
        }

        if (maleStatus === 'minServ') {
          person.person_data.assignments
            .at(0)
            .values.push(AssignmentCode.WM_SpeakerSymposium);

          person.person_data.assignments.at(0).updatedAt =
            new Date().toISOString();
        }

        if (maleStatus === 'minServFR') {
          person.person_data.assignments
            .at(0)
            .values.push(AssignmentCode.WM_Speaker);

          person.person_data.assignments.at(0).updatedAt =
            new Date().toISOString();
        }

        if (
          maleStatus === 'elderFR' ||
          maleStatus === 'minServFR' ||
          maleStatus === 'FR'
        ) {
          person.person_data.enrollments.push({
            id: crypto.randomUUID(),
            _deleted: false,
            updatedAt: new Date().toISOString(),
            enrollment: 'FR',
            start_date: startDateTemp,
            end_date: null,
          });
        }

        if (maleStatus === 'FS' || maleStatus === 'FMF') {
          person.person_data.enrollments.push({
            id: crypto.randomUUID(),
            _deleted: false,
            updatedAt: new Date().toISOString(),
            enrollment: maleStatus,
            start_date: startDateTemp,
            end_date: null,
          });
        }

        if (maleStatus === 'elderWTConductor') {
          person.person_data.enrollments.push({
            id: crypto.randomUUID(),
            _deleted: false,
            updatedAt: new Date().toISOString(),
            enrollment: 'FR',
            start_date: startDateTemp,
            end_date: null,
          });

          person.person_data.assignments
            .at(0)
            .values.push(
              AssignmentCode.WM_WTStudyConductor,
              AssignmentCode.MINISTRY_HOURS_CREDIT
            );

          person.person_data.assignments.at(0).updatedAt =
            new Date().toISOString();
        }

        if (maleStatus === 'FR') {
          person.person_data.assignments
            .at(0)
            .values.push(AssignmentCode.MINISTRY_HOURS_CREDIT);

          person.person_data.assignments.at(0).updatedAt =
            new Date().toISOString();
        }
      }
    }

    await appDb.persons.bulkPut(formattedData);

    if (showProgress) store.set(rootModalOpenState, false);
  } catch (err) {
    if (showProgress) store.set(rootModalOpenState, false);
    console.error(err);
  }
};

export const dbSettingsAssignMainWTStudyConductor = async () => {
  const settings = await appDb.app_settings.toArray();

  const persons = await appDb.persons.toArray();

  const weekend_meeting = structuredClone(
    settings.at(0).cong_settings.weekend_meeting
  );

  const mainConductor = persons.find(
    (record) =>
      record.person_data.assignments
        .at(0)
        .values.includes(AssignmentCode.WM_WTStudyConductor) &&
      settings.at(0).user_settings.user_local_uid !== record.person_uid
  );

  const mainSetting = weekend_meeting.find((record) => record.type === 'main');

  mainSetting.w_study_conductor_default = {
    value: mainConductor.person_uid,
    updatedAt: new Date().toISOString(),
  };

  await appDb.app_settings.update(1, {
    'cong_settings.weekend_meeting': weekend_meeting,
  });
};

export const dbFieldGroupAutoAssign = async () => {
  await appDb.field_service_groups.clear();

  const groups: FieldServiceGroupType[] = [];
  const persons = await appDb.persons.toArray();
  const settings = await appDb.app_settings.get(1);

  const userLocalUid = settings.user_settings.user_local_uid;

  const publishers = persons.filter((person) => {
    const isBaptized = person.person_data.publisher_baptized.active.value;
    const isUnbaptized = person.person_data.publisher_unbaptized.active.value;

    return isBaptized || isUnbaptized;
  });

  const overseers = [userLocalUid];

  for (let i = 1; i <= 4; i++) {
    const elders = publishers.filter(
      (person) =>
        personIsElder(person) && !overseers.includes(person.person_uid)
    );

    const selected = getRandomArrayItem(elders);

    overseers.unshift(selected.person_uid);
  }

  const assistants: string[] = [];

  for (let i = 1; i <= 5; i++) {
    const ms = publishers.filter(
      (person) => personIsMS(person) && !assistants.includes(person.person_uid)
    );

    const selected = getRandomArrayItem(ms);

    assistants.unshift(selected.person_uid);
  }

  for (let i = 0; i <= 4; i++) {
    groups.push({
      group_id: crypto.randomUUID(),
      group_data: {
        _deleted: false,
        updatedAt: new Date().toISOString(),
        name: '',
        sort_index: i,
        members: [
          {
            isOverseer: true,
            isAssistant: false,
            person_uid: overseers.at(i),
            sort_index: 0,
          },
          {
            isOverseer: false,
            isAssistant: true,
            person_uid: assistants.at(i),
            sort_index: 1,
          },
        ],
      },
    });
  }

  //  assign group members
  let i = 1;
  for (const group of groups) {
    const assigned_members = groups.reduce(
      (acc: FieldServiceGroupMemberType[], current) => {
        acc.push(...current.group_data.members);

        return acc;
      },
      []
    );

    const members = group.group_data.members;

    const length =
      i < 5
        ? getRandomNumber(16, 20)
        : publishers.length - assigned_members.length + 2;

    do {
      const remaining_pubs = publishers.filter(
        (person) =>
          !assigned_members.some(
            (member) => member.person_uid === person.person_uid
          )
      );

      const person = getRandomArrayItem(remaining_pubs);

      const assigned = {
        isAssistant: false,
        isOverseer: false,
        person_uid: person.person_uid,
        sort_index: members.length,
      };

      members.push(assigned);
      assigned_members.push(assigned);
    } while (members.length < length);

    i++;
  }

  // assign language group
  const languageGroup = groups.at(4);
  languageGroup.group_data.name = 'English Group';
  languageGroup.group_data.language_group = true;
  languageGroup.group_data.midweek_meeting = true;
  languageGroup.group_data.weekend_meeting = true;

  const lastSortIndex = languageGroup.group_data.members.length - 1;

  // assign some midweek students to the language group
  const midweekStudents = persons.filter((person) =>
    personIsMidweekStudent(person)
  );

  const selected = midweekStudents
    .map((_, index) => index)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const selectedStudents = selected
    .map((index) => midweekStudents[index].person_uid)
    .map((person, index) => {
      return {
        isAssistant: false,
        isOverseer: false,
        person_uid: person,
        sort_index: lastSortIndex + index + 1,
      };
    });

  languageGroup.group_data.members.push(...selectedStudents);

  await appDb.field_service_groups.bulkPut(groups);

  // duplicate person assignments for language groups
  const personsNew = persons.map((person) => {
    const personAssignments = person.person_data.assignments;

    personAssignments.push({
      type: languageGroup.group_id,
      updatedAt: new Date().toISOString(),
      values: personAssignments.at(0).values,
    });

    return person;
  });

  await appDb.persons.bulkPut(personsNew);

  // update some settings
  settings.cong_settings.cong_circuit.push({
    ...settings.cong_settings.cong_circuit.at(0),
    type: languageGroup.group_id,
  });

  settings.cong_settings.schedule_exact_date_enabled.push({
    ...settings.cong_settings.schedule_exact_date_enabled.at(0),
    type: languageGroup.group_id,
  });

  settings.cong_settings.source_material.language.push({
    ...settings.cong_settings.source_material.language.at(0),
    type: languageGroup.group_id,
  });

  settings.cong_settings.midweek_meeting.push({
    ...settings.cong_settings.midweek_meeting.at(0),
    type: languageGroup.group_id,
    weekday: { value: 1, updatedAt: new Date().toISOString() },
  });

  settings.cong_settings.weekend_meeting.push({
    ...settings.cong_settings.weekend_meeting.at(0),
    type: languageGroup.group_id,
    weekday: { value: 5, updatedAt: new Date().toISOString() },
    w_study_conductor_default: {
      value: userLocalUid,
      updatedAt: new Date().toISOString(),
    },
    opening_prayer_auto_assigned: {
      value: true,
      updatedAt: new Date().toISOString(),
    },
  });

  await appDb.app_settings.put(settings);
};

export const getPublishersActive = async (month: string) => {
  const persons = await appDb.persons.toArray();

  const result = persons.filter((record) => {
    const isPublisher = personIsPublisher(record, month);
    return isPublisher;
  });

  return result;
};

/**
 * Generate a weighted monthly hour target for FR publishers with credit.
 * Simulates realistic variance: most months near 50h, with occasional
 * high or low months (illness, vacation, extra effort).
 */
const getWeightedMonthlyTarget = (): number => {
  const roll = Math.random() * 100;

  if (roll < 5) return getRandomNumber(25, 35); // 5%: significantly low
  if (roll < 30) return getRandomNumber(40, 48); // 25%: below average
  if (roll < 90) return getRandomNumber(48, 55); // 60%: normal range
  return getRandomNumber(55, 62); // 10%: overperforming
};

/**
 * Generate variable field service hours for non-credit FR publishers.
 * Same weighted distribution principle applied to direct hours.
 */
const getVariableFieldServiceHours = (): number => {
  const roll = Math.random() * 100;

  if (roll < 5) return getRandomNumber(28, 38); // 5%: low month
  if (roll < 30) return getRandomNumber(40, 50); // 25%: below average
  if (roll < 90) return getRandomNumber(48, 58); // 60%: normal
  return getRandomNumber(55, 65); // 10%: above average
};

export const dbReportsFillRandom = async () => {
  await appDb.cong_field_service_reports.clear();

  const year = new Date().getFullYear();
  const startMonth = `${year - 1}/09`;
  const endMonth = currentReportMonth();

  const monthRange = createArrayFromMonths(startMonth, endMonth);

  const reportsToSave: CongFieldServiceReportType[] = [];

  for await (const month of monthRange) {
    const active_publishers = await getPublishersActive(month);
    const isCurrentMonth = month === endMonth;

    for (const person of active_publishers) {
      // For the current month, skip ~18% of publishers to simulate unsubmitted
      if (isCurrentMonth && Math.random() < 0.18) continue;

      const report = structuredClone(congFieldServiceReportSchema);
      report.report_id = crypto.randomUUID();
      report.report_data.person_uid = person.person_uid;
      report.report_data.report_date = month;

      const isAP = personIsEnrollmentActive(person, 'AP', month);
      const isFMF = personIsEnrollmentActive(person, 'FMF', month);
      const isFR = personIsEnrollmentActive(person, 'FR', month);
      const isFS = personIsEnrollmentActive(person, 'FS', month);
      const isBaptized = personIsBaptizedPublisher(person, month);

      if (isFMF || isFS) {
        report.report_data.hours.field_service = getRandomNumber(100, 115);

        if (isFMF) report.report_data.bible_studies = getRandomNumber(20, 30);
        if (isFS) report.report_data.bible_studies = getRandomNumber(15, 20);
      }

      if (isFR) {
        const reportCredit = person.person_data.assignments
          .at(0)
          .values.includes(AssignmentCode.MINISTRY_HOURS_CREDIT);

        if (reportCredit) {
          // Variable monthly target using weighted distribution
          const monthlyTarget = getWeightedMonthlyTarget();
          const service = getRandomNumber(
            Math.max(15, monthlyTarget - 35),
            Math.min(monthlyTarget, 45)
          );
          const credit = Math.max(0, monthlyTarget - service);

          report.report_data.hours.field_service = service;
          report.report_data.hours.credit = { approved: credit, value: 0 };
        }

        if (!reportCredit) {
          report.report_data.hours.field_service =
            getVariableFieldServiceHours();
        }

        report.report_data.bible_studies = getRandomNumber(10, 15);
      }

      if (isAP) {
        report.report_data.hours.field_service = getRandomNumber(30, 40);
        report.report_data.bible_studies = getRandomNumber(5, 10);
      }

      if (!isFMF && !isFS && !isFR && !isAP && isBaptized) {
        report.report_data.bible_studies = getRandomNumber(1, 5);
      }

      report.report_data.shared_ministry = true;
      report.report_data.status = 'confirmed';
      report.report_data.updatedAt = new Date().toISOString();
      reportsToSave.push(report);
    }
  }

  await appDb.cong_field_service_reports.bulkPut(reportsToSave);
};

export const dbMeetingAttendanceFill = async () => {
  await appDb.meeting_attendance.clear();

  const languageGroups = await appDb.field_service_groups.toArray();
  const languageGroup = languageGroups.find(
    (record) => record.group_data.language_group
  )!.group_id;

  const views = ['main', languageGroup];

  const year = new Date().getFullYear();
  const startMonth = `${year - 1}/09`;
  const endMonth = currentReportMonth();

  const monthRange = createArrayFromMonths(startMonth, endMonth);

  const attendances: MeetingAttendanceType[] = [];

  for (const month of monthRange) {
    const attendance = structuredClone(meetingAttendanceSchema);
    attendance.month_date = month;
    const weeks = weeksInMonth(month);

    for (let i = 1; i <= weeks.length; i++) {
      const weeklyAttendance = attendance[`week_${i}`] as WeeklyAttendance;

      for (const view of views) {
        let midweek = weeklyAttendance.midweek.find(
          (record) => record.type === view
        );

        if (!midweek) {
          weeklyAttendance.midweek.push({
            type: view,
            online: undefined,
            present: undefined,
            updatedAt: '',
          });

          midweek = weeklyAttendance.midweek.find(
            (record) => record.type === view
          );
        }

        if (view === 'main') {
          midweek.present = getRandomNumber(95, 110);
        } else {
          midweek.present = getRandomNumber(25, 45);
        }

        midweek.updatedAt = new Date().toISOString();

        let weekend = weeklyAttendance.weekend.find(
          (record) => record.type === view
        );

        if (!weekend) {
          weeklyAttendance.weekend.push({
            type: view,
            online: undefined,
            present: undefined,
            updatedAt: '',
          });

          weekend = weeklyAttendance.weekend.find(
            (record) => record.type === view
          );
        }

        if (view === 'main') {
          weekend.present = getRandomNumber(105, 130);
        } else {
          weekend.present = getRandomNumber(35, 55);
        }

        weekend.updatedAt = new Date().toISOString();
      }
    }

    attendances.push(attendance);
  }

  await appDb.meeting_attendance.bulkPut(attendances);
};

export const dbBranchS1ReportsFill = async () => {
  await appDb.branch_field_service_reports.clear();

  const congReports = await appDb.cong_field_service_reports.toArray();
  const persons = await appDb.persons.toArray();
  const attendances = await appDb.meeting_attendance.toArray();

  const year = new Date().getFullYear();
  const startMonth = `${year - 1}/09`;
  const endMonth = currentReportMonth();

  const reportsToSave: BranchFieldServiceReportType[] = [];

  const monthRange = createArrayFromMonths(startMonth, endMonth);

  for (const month of monthRange) {
    // get all confirmed reports
    const reports = congReports.filter(
      (record) =>
        record.report_data.status === 'confirmed' &&
        record.report_data.shared_ministry &&
        record.report_data.report_date === month
    );

    // group reports
    const publishers: CongFieldServiceReportType[] = [];
    const APs: CongFieldServiceReportType[] = [];
    const FRs: CongFieldServiceReportType[] = [];

    for (const report of reports) {
      const person = persons.find(
        (record) => record.person_uid === report.report_data.person_uid
      );

      if (!person) continue;

      const isAP = personIsEnrollmentActive(person, 'AP', month);
      const isFMF = personIsEnrollmentActive(person, 'FMF', month);
      const isFR = personIsEnrollmentActive(person, 'FR', month);
      const isFS = personIsEnrollmentActive(person, 'FS', month);

      // skip SFTS reports
      if (isFMF || isFS) continue;

      if (isAP) {
        APs.push(report);
        continue;
      }

      if (isFR) {
        FRs.push(report);
        continue;
      }

      // default to publishers
      publishers.push(report);
    }

    const branchReport = structuredClone(SchemaBranchFieldServiceReport);
    branchReport.report_date = month;

    const active = await getPublishersActive(month);
    branchReport.report_data.publishers_active = active.length;

    // get weekend total
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    let weekendTotal = 0;
    let weekendCount = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData.weekend;

      const sum = meetingData.reduce((acc, current) => {
        if (current?.present) {
          return acc + current.present;
        }

        return acc;
      }, 0);

      if (sum > 0) weekendCount++;

      weekendTotal += sum;
    }

    const weekendAverage =
      weekendTotal === 0 ? 0 : Math.round(weekendTotal / weekendCount);

    branchReport.report_data.weekend_meeting_average = weekendAverage;

    branchReport.report_data.publishers = {
      report_count: publishers.length,
      bible_studies: publishers.reduce(
        (acc, current) => acc + current.report_data.bible_studies,
        0
      ),
    };

    branchReport.report_data.APs = {
      report_count: APs.length,
      hours: APs.reduce(
        (acc, current) => acc + current.report_data.hours.field_service,
        0
      ),
      bible_studies: APs.reduce(
        (acc, current) => acc + current.report_data.bible_studies,
        0
      ),
    };

    branchReport.report_data.FRs = {
      report_count: FRs.length,
      hours: FRs.reduce(
        (acc, current) => acc + current.report_data.hours.field_service,
        0
      ),
      bible_studies: FRs.reduce(
        (acc, current) => acc + current.report_data.bible_studies,
        0
      ),
    };

    branchReport.report_data.submitted = month !== endMonth;
    branchReport.report_data.updatedAt = new Date().toISOString();

    reportsToSave.push(branchReport);
  }

  await appDb.branch_field_service_reports.bulkPut(reportsToSave);
};

export const schedulesRandomChooseTalks = async (
  start: string,
  end: string
) => {
  const talks = store.get(publicTalksState);
  const sources = store.get(sourcesState);
  const groups = store.get(languageGroupsState);

  const group = groups.at(0);

  const weeksList = sources.filter(
    (record) => record.weekOf >= start && record.weekOf <= end
  );

  const validTalks = talks.filter(
    (record) => !record.talk_title.E.includes('Do not use')
  );

  // Select ~100 talks evenly spread across all valid talks
  const poolSize = Math.min(100, validTalks.length);
  const step = validTalks.length / poolSize;
  const talkPool = Array.from(
    { length: poolSize },
    (_, i) => validTalks[Math.floor(i * step)]
  );

  // Shuffle the pool for natural randomness within even distribution
  for (let i = talkPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [talkPool[i], talkPool[j]] = [talkPool[j], talkPool[i]];
  }

  // Round-robin assignment from the pool
  let poolIndex = 0;

  weeksList.forEach((schedule) => {
    const talkMain = talkPool[poolIndex % talkPool.length];
    poolIndex++;

    const main = schedule.weekend_meeting.public_talk.find(
      (record) => record.type === 'main'
    );

    main.value = talkMain.talk_number;
    main.updatedAt = new Date().toISOString();

    const talkGroup = talkPool[poolIndex % talkPool.length];
    poolIndex++;

    schedule.weekend_meeting.public_talk.push({
      type: group.group_id,
      updatedAt: new Date().toISOString(),
      value: talkGroup.talk_number,
    });
  });

  await dbSourcesBulkPut(weeksList);
};

export const dbSchedulesAutoFill = async () => {
  const groups = store.get(languageGroupsState);
  if (!groups.length) return;
  const startWeek = getWeekDate();
  const endWeek = addMonths(startWeek, 3);

  const start = formatDate(startWeek, 'yyyy/MM/dd');
  const end = formatDate(endWeek, 'yyyy/MM/dd');

  // force language group switch
  const group = groups.at(0);

  await dbAppSettingsUpdate({
    'user_settings.data_view': {
      value: group.group_id,
      updatedAt: new Date().toISOString(),
    },
  });

  await schedulesStartAutofill(start, end, 'weekend');

  // assign only midweek once in a 3 months
  const startDate = new Date(start);
  const result: string[] = [];

  const startMonth = startDate.getMonth();
  const startYear = startDate.getFullYear();

  for (let i = 0; i < 3; i++) {
    const targetMonth = (startMonth + i) % 12;
    const targetYear = startYear + Math.floor((startMonth + i) / 12);

    const lastDay = new Date(targetYear, targetMonth + 1, 0);

    const day = lastDay.getDay();
    const diff = lastDay.getDate() - day + (day === 0 ? -6 : 1);
    const monDay = new Date(lastDay.setDate(diff));

    const weekDate = formatDate(monDay, 'yyyy/MM/dd');

    result.push(weekDate);
  }
  const schedules = structuredClone(store.get(schedulesState));
  const relevantSchedules = schedules.filter(
    (record) => record.weekOf >= start && record.weekOf <= end
  );

  relevantSchedules.forEach((schedule) => {
    if (!result.includes(schedule.weekOf)) {
      const updatedAt = new Date().toISOString();

      const existing = schedule.midweek_meeting.week_type.find(
        (entry) => entry.type === group.group_id
      );

      if (existing) {
        existing.value = Week.NO_MEETING;
        existing.updatedAt = updatedAt;
      } else {
        schedule.midweek_meeting.week_type.push({
          type: group.group_id,
          value: Week.NO_MEETING,
          updatedAt,
        });
      }
    }
  });

  await dbSchedBulkUpdate(relevantSchedules);
  store.set(schedulesState, schedules);

  const newFullHistory = schedulesBuildHistoryList();
  store.set(assignmentsHistoryState, newFullHistory);

  await schedulesStartAutofill(start, end, 'midweek');

  // Add outgoing talk schedule entries
  await dbSchedulesFillOutgoingTalks(start, end);

  const refreshedSchedules = await appDb.sched.toArray();
  store.set(schedulesState, refreshedSchedules);
  store.set(assignmentsHistoryState, schedulesBuildHistoryList());

  // revert view to main
  await dbAppSettingsUpdate({
    'user_settings.data_view': {
      value: 'main',
      updatedAt: new Date().toISOString(),
    },
  });

  await schedulesStartAutofill(start, end, 'midweek');

  await schedulesRandomChooseTalks(start, end);

  await schedulesStartAutofill(start, end, 'weekend');
};

/**
 * Add outgoing talk schedule entries — 2 speakers assigned to
 * different congregations on separate weeks.
 */
const dbSchedulesFillOutgoingTalks = async (start: string, end: string) => {
  const schedules = await appDb.sched.toArray();
  const congregations = await appDb.speakers_congregations.toArray();
  const persons = await appDb.persons.toArray();
  const settings = await appDb.app_settings.get(1);

  const localCongName = settings.cong_settings.cong_name;

  const outgoingCongs = congregations.filter(
    (c) => c.cong_data.cong_name.value !== localCongName
  );

  if (outgoingCongs.length < 2) return;

  // Find eligible speakers (those with WM_Speaker assignment)
  const speakers = persons.filter((p) =>
    p.person_data.assignments.at(0)?.values.includes(AssignmentCode.WM_Speaker)
  );

  if (speakers.length < 2) return;

  // Pick 2 different speakers
  const speaker1 = speakers[0];
  const speaker2 = speakers.find((s) => s.person_uid !== speaker1.person_uid);

  if (!speaker2) return;

  // Find 2 different weeks within range that have schedules
  const eligibleWeeks = schedules.filter(
    (s) => s.weekOf >= start && s.weekOf <= end && s.weekend_meeting
  );

  if (eligibleWeeks.length < 2) return;

  // Pick the 2nd and 4th week (or last available) for spacing
  const weekIdx1 = Math.min(1, eligibleWeeks.length - 1);
  const rawIdx2 = Math.min(3, eligibleWeeks.length - 1);
  const weekIdx2 =
    rawIdx2 <= weekIdx1 ? (weekIdx1 + 1) % eligibleWeeks.length : rawIdx2;
  const week1 = eligibleWeeks[weekIdx1];
  const week2 = eligibleWeeks[weekIdx2];

  const cong1 = outgoingCongs[0];
  const cong2 = outgoingCongs[1];

  const talks = store.get(publicTalksState);
  const validTalks = talks.filter(
    (t) => !t.talk_title.E.includes('Do not use')
  );

  const talk1 = validTalks[getRandomNumber(0, validTalks.length - 1)];
  const talk2 = validTalks[getRandomNumber(0, validTalks.length - 1)];

  // Create outgoing talk for speaker 1 → congregation 1
  const outgoing1 = {
    _deleted: false,
    updatedAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    synced: false,
    opening_song: '',
    public_talk: talk1.talk_number,
    value: speaker1.person_uid,
    type: 'main',
    congregation: {
      name: cong1.cong_data.cong_name.value,
      number: cong1.cong_data.cong_number.value,
      country: '',
      address: cong1.cong_data.cong_location?.address?.value || '',
      weekday: cong1.cong_data.weekend_meeting?.weekday?.value ?? 6,
      time: cong1.cong_data.weekend_meeting?.time?.value || '10:00',
    },
  };

  // Create outgoing talk for speaker 2 → congregation 2
  const outgoing2 = {
    _deleted: false,
    updatedAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    synced: false,
    opening_song: '',
    public_talk: talk2.talk_number,
    value: speaker2.person_uid,
    type: 'main',
    congregation: {
      name: cong2.cong_data.cong_name.value,
      number: cong2.cong_data.cong_number.value,
      country: '',
      address: cong2.cong_data.cong_location?.address?.value || '',
      weekday: cong2.cong_data.weekend_meeting?.weekday?.value ?? 6,
      time: cong2.cong_data.weekend_meeting?.time?.value || '10:00',
    },
  };

  // Append to the schedule's outgoing_talks arrays
  week1.weekend_meeting.outgoing_talks.push(outgoing1);
  week2.weekend_meeting.outgoing_talks.push(outgoing2);

  await appDb.sched.bulkPut([week1, week2]);
};

const atTime = (date: Date, hours: number, minutes = 0) => {
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);

  return result;
};

const shuffle = <T>(items: T[]) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export const dbPersonsExtrasFill = async () => {
  const persons = await appDb.persons.toArray();
  const updatedAt = new Date().toISOString();
  const today = new Date();

  const active = shuffle(
    persons.filter((record) => !record.person_data.archived.value)
  );

  const timeAway = [
    { from: -3, to: 9, comments: 'Visiting family abroad' },
    { from: 12, to: 26, comments: 'Summer vacation' },
    { from: 30, to: 33, comments: 'Business trip' },
    { from: -45, to: -32, comments: 'Recovering after surgery' },
  ];

  timeAway.forEach((away, index) => {
    active[index].person_data.timeAway.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt,
      start_date: formatDate(addDays(today, away.from), 'yyyy/MM/dd'),
      end_date: formatDate(addDays(today, away.to), 'yyyy/MM/dd'),
      comments: away.comments,
    });
  });

  const relatives = ['Maria', 'John', 'Elena', 'David', 'Sophie', 'Michael'];

  relatives.forEach((name, index) => {
    const person = active[timeAway.length + index];

    person.person_data.emergency_contacts.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt,
      name: `${name} ${person.person_data.person_lastname.value}`,
      contact: `+1 206 555 01${String(index * 7 + 12).padStart(2, '0')}`,
    });
  });

  await appDb.persons.bulkPut(persons);
};

export const dbUpcomingEventsFill = async () => {
  const updatedAt = new Date().toISOString();
  const thisWeek = getWeekDate();

  const createEvent = (
    category: UpcomingEventCategory,
    start: Date,
    end: Date,
    options: { description?: string; custom?: string } = {}
  ): UpcomingEventType => {
    const sameDay = start.toDateString() === end.toDateString();

    return {
      event_uid: crypto.randomUUID(),
      event_data: {
        _deleted: false,
        updatedAt,
        start: start.toISOString(),
        end: end.toISOString(),
        type: 'main',
        category,
        duration: sameDay
          ? UpcomingEventDuration.SingleDay
          : UpcomingEventDuration.MultipleDays,
        description: options.description ?? '',
        custom: options.custom ?? '',
      },
    };
  };

  const coWeek = addWeeks(thisWeek, 5);
  const witnessingDay = addDays(thisWeek, 5);
  const cleaningDay = addDays(addWeeks(thisWeek, 1), 5);
  const assemblyDay = addDays(addWeeks(thisWeek, 3), 6);
  const campaignWeek = addWeeks(thisWeek, 7);
  const conventionDay = addDays(addWeeks(thisWeek, 10), 4);

  const events = [
    createEvent(
      UpcomingEventCategory.PublicWitnessing,
      atTime(witnessingDay, 9),
      atTime(witnessingDay, 12),
      { description: 'Training for the new cart locations downtown' }
    ),
    createEvent(
      UpcomingEventCategory.Custom,
      atTime(cleaningDay, 8, 30),
      atTime(cleaningDay, 11),
      {
        custom: 'Kingdom Hall deep cleaning',
        description: 'Groups 1 and 2, bring gloves',
      }
    ),
    createEvent(
      UpcomingEventCategory.AssemblyWeek,
      atTime(assemblyDay, 9, 40),
      atTime(assemblyDay, 15, 50),
      { description: 'Parking opens at 8:00, bring your own lunch' }
    ),
    createEvent(
      UpcomingEventCategory.CircuitOverseerWeek,
      atTime(addDays(coWeek, 1), 19),
      atTime(addDays(coWeek, 6), 12),
      { description: 'Visit of the circuit overseer A. Olivier' }
    ),
    createEvent(
      UpcomingEventCategory.SpecialCampaignWeek,
      atTime(campaignWeek, 9),
      atTime(addDays(campaignWeek, 6), 18),
      { description: 'Invitations to the regional convention' }
    ),
    createEvent(
      UpcomingEventCategory.ConventionWeek,
      atTime(conventionDay, 9, 20),
      atTime(addDays(conventionDay, 2), 16),
      { description: 'Regional convention, Tacoma Dome' }
    ),
  ];

  await dbUpcomingEventsBulkSave(events);

  const settings = await appDb.app_settings.get(1);
  const weekOf = formatDate(coWeek, 'yyyy/MM/dd');

  await dbAppSettingsUpdate({
    'cong_settings.circuit_overseer.visits': [
      ...settings.cong_settings.circuit_overseer.visits,
      { _deleted: false, id: crypto.randomUUID(), weekOf, updatedAt },
    ],
  });

  const schedule = await appDb.sched.get(weekOf);

  if (!schedule) return;

  for (const weekType of [
    ...schedule.midweek_meeting.week_type,
    ...schedule.weekend_meeting.week_type,
  ]) {
    weekType.value = Week.CO_VISIT;
    weekType.updatedAt = updatedAt;
  }

  await appDb.sched.put(schedule);
};

export const dbUserMinistryFill = async () => {
  const settings = await appDb.app_settings.get(1);
  const persons = await appDb.persons.toArray();
  const userUid = settings.user_settings.user_local_uid;
  const updatedAt = new Date().toISOString();
  const today = new Date();

  const students = shuffle(
    persons.filter((record) => record.person_uid !== userUid)
  )
    .slice(0, 3)
    .map((record) => ({
      person_uid: crypto.randomUUID(),
      person_data: {
        _deleted: false,
        updatedAt,
        person_name: `${record.person_data.person_firstname.value} ${record.person_data.person_lastname.value.at(0)}.`,
      },
    }));

  for (const student of students) {
    await dbUserBibleStudySave(student);
  }

  const studentNames = students.map((record) => record.person_data.person_name);

  const reports: UserFieldServiceReportType[] = [];

  for (let offset = 1; offset >= 0; offset--) {
    const month = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const monthly = structuredClone(userFieldServiceMonthlyReportSchema);

    let minutes = 0;

    for (
      let day = month;
      day <= today && day.getMonth() === month.getMonth();
      day = addDays(day, 1)
    ) {
      const weekday = day.getDay();

      if (weekday !== 3 && weekday !== 6 && weekday !== 0) continue;

      const daily = structuredClone(userFieldServiceDailyReportSchema);
      const studies = weekday === 3 ? studentNames.slice(0, 2) : [];
      const dayMinutes = getRandomNumber(4, 12) * 15;

      minutes += dayMinutes;

      daily.report_date = formatDate(day, 'yyyy/MM/dd');
      daily.report_data.updatedAt = updatedAt;
      daily.report_data.hours.field_service = `${Math.floor(dayMinutes / 60)}:${String(dayMinutes % 60).padStart(2, '0')}`;
      daily.report_data.bible_studies = {
        value: studies.length,
        records: studies,
      };

      reports.push(daily);
    }

    monthly.report_date = formatDate(month, 'yyyy/MM');
    monthly.report_data.updatedAt = updatedAt;
    monthly.report_data.shared_ministry = true;
    monthly.report_data.hours.field_service.daily = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
    monthly.report_data.bible_studies.daily = 2;
    monthly.report_data.bible_studies.records = studentNames.slice(0, 2);
    monthly.report_data.status = offset === 1 ? 'submitted' : 'pending';

    reports.push(monthly);
  }

  for (let offset = 2; offset <= 7; offset++) {
    const month = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const report = structuredClone(userFieldServiceMonthlyReportSchema);

    report.report_date = formatDate(month, 'yyyy/MM');
    report.report_data.updatedAt = updatedAt;
    report.report_data.shared_ministry = true;
    report.report_data.hours.field_service.monthly = `${getRandomNumber(8, 22)}:00`;
    report.report_data.bible_studies.monthly = getRandomNumber(1, 3);
    report.report_data.status = 'confirmed';

    reports.push(report);
  }

  await dbUserFieldServiceReportsBulkSave(reports);
};

export const dbPublicTalksHistoryFill = async () => {
  const talks = store
    .get(publicTalksState)
    .filter((record) => !record.talk_title.E.includes('Do not use'));

  if (talks.length === 0) return;

  const persons = await appDb.persons.toArray();
  const visitors = await appDb.visiting_speakers.toArray();
  const congregations = await appDb.speakers_congregations.toArray();
  const settings = await appDb.app_settings.get(1);
  const updatedAt = new Date().toISOString();

  const localSpeakers = persons.filter((record) =>
    record.person_data.assignments
      .at(0)
      ?.values.includes(AssignmentCode.WM_Speaker)
  );

  const visitingSpeakers = visitors.filter(
    (record) =>
      !record.speaker_data.local.value && record.speaker_data.talks.length > 0
  );

  const otherCongregations = congregations.filter(
    (record) =>
      record.cong_data.cong_name.value !== settings.cong_settings.cong_name
  );

  if (localSpeakers.length === 0) return;

  const talkPool = shuffle(
    [...talks].sort((a, b) => a.talk_number - b.talk_number).slice(0, 36)
  );
  const sources = [];
  const schedules = [];

  let talkIndex = 0;

  for (let week = 1; week <= 52; week++) {
    const weekOf = formatDate(addWeeks(getWeekDate(), -week), 'yyyy/MM/dd');

    const source =
      (await appDb.sources.get(weekOf)) ??
      Object.assign(structuredClone(sourceSchema), { weekOf });

    const schedule =
      (await appDb.sched.get(weekOf)) ??
      Object.assign(structuredClone(scheduleSchema), { weekOf });

    const visitor =
      week % 3 === 0 && visitingSpeakers.length > 0
        ? visitingSpeakers[week % visitingSpeakers.length]
        : undefined;

    const visiting = Boolean(visitor);

    const speakerUid =
      visitor?.person_uid ??
      localSpeakers[week % localSpeakers.length].person_uid;

    const talkNumber = visitor
      ? getRandomArrayItem(visitor.speaker_data.talks).talk_number
      : talkPool[talkIndex++ % talkPool.length].talk_number;

    const publicTalk = source.weekend_meeting.public_talk.find(
      (record) => record.type === 'main'
    );

    publicTalk.value = talkNumber;
    publicTalk.updatedAt = updatedAt;

    const talkType = schedule.weekend_meeting.public_talk_type.find(
      (record) => record.type === 'main'
    );

    talkType.value = visiting ? 'visitingSpeaker' : 'localSpeaker';
    talkType.updatedAt = updatedAt;

    const part = schedule.weekend_meeting.speaker.part_1.find(
      (record) => record.type === 'main'
    );

    part.value = speakerUid;
    part.updatedAt = updatedAt;

    const outgoingSpeaker = localSpeakers[(week + 1) % localSpeakers.length];

    if (week % 4 === 0 && otherCongregations.length > 0) {
      const congregation = otherCongregations[week % otherCongregations.length];

      schedule.weekend_meeting.outgoing_talks.push({
        _deleted: false,
        updatedAt,
        id: crypto.randomUUID(),
        synced: false,
        opening_song: '',
        public_talk: talkPool[talkIndex++ % talkPool.length].talk_number,
        value: outgoingSpeaker.person_uid,
        type: 'main',
        congregation: {
          name: congregation.cong_data.cong_name.value,
          number: congregation.cong_data.cong_number.value,
          country: '',
          address: congregation.cong_data.cong_location?.address?.value || '',
          weekday: congregation.cong_data.weekend_meeting?.weekday?.value ?? 6,
          time: congregation.cong_data.weekend_meeting?.time?.value || '10:00',
        },
      });
    }

    sources.push(source);
    schedules.push(schedule);
  }

  await dbSourcesBulkPut(sources);
  await appDb.sched.bulkPut(schedules);

  store.set(sourcesState, await appDb.sources.toArray());
  store.set(schedulesState, await appDb.sched.toArray());
  store.set(assignmentsHistoryState, schedulesBuildHistoryList());
};

export const dbReportsLateFill = async () => {
  const reportMonth = currentReportMonth();
  const previousMonth = formatDate(
    addMonths(`${reportMonth}/01`, -1),
    'yyyy/MM'
  );
  const updatedAt = new Date().toISOString();

  const reports = await appDb.cong_field_service_reports.toArray();

  const monthReports = shuffle(
    reports.filter((record) => record.report_data.report_date === reportMonth)
  );

  const received = monthReports.slice(0, 6);

  for (const report of received) {
    report.report_data.status = 'received';
    report.report_data.updatedAt = updatedAt;
  }

  const reported = new Set(
    monthReports.map((record) => record.report_data.person_uid)
  );

  const publishers = await getPublishersActive(reportMonth);

  const late = publishers
    .filter((person) => !reported.has(person.person_uid))
    .slice(0, 2)
    .map((person) => person.person_uid);

  const lateReports = reports.filter(
    (record) =>
      record.report_data.report_date === previousMonth &&
      late.includes(record.report_data.person_uid)
  );

  await appDb.cong_field_service_reports.bulkPut(received);
  await appDb.cong_field_service_reports.bulkDelete(
    lateReports.map((record) => record.report_id)
  );
};

const CATALOG_CONGREGATIONS = [
  {
    name: 'Ballard - Seattle WA',
    number: '11402',
    circuit: 'WA- 5',
    address: '2515 NW 65th St Seattle WA  98117-6039',
    lat: 47.676,
    lng: -122.389,
    midweek: { weekday: 1, time: '19:00' },
    weekend: { weekday: 6, time: '10:00' },
    coordinator: 'Richard Hayes',
    talkCoordinator: 'Owen Mitchell',
    speakers: [
      { first: 'Owen', last: 'Mitchell', elder: true },
      { first: 'Peter', last: 'Lindqvist', elder: true },
      { first: 'Caleb', last: 'Turner', elder: false },
    ],
  },
  {
    name: 'Renton Highlands - Renton WA',
    number: '11587',
    circuit: 'WA- 8-B',
    address: '1100 Union Ave NE Renton WA  98059-4604',
    lat: 47.494,
    lng: -122.179,
    midweek: { weekday: 3, time: '19:30' },
    weekend: { weekday: 5, time: '17:00' },
    coordinator: 'Marcus Reed',
    talkCoordinator: 'Victor Nguyen',
    speakers: [
      { first: 'Victor', last: 'Nguyen', elder: true },
      {
        first: 'Samuel',
        last: 'Okafor',
        elder: true,
        note: 'Only available on the first Sunday of the month',
      },
    ],
  },
  {
    name: 'Beacon Hill Spanish - Seattle WA',
    number: '11711',
    circuit: 'WA- 20-S',
    address: '3025 S Hanford St Seattle WA  98144-6937',
    lat: 47.576,
    lng: -122.294,
    midweek: { weekday: 2, time: '19:00' },
    weekend: { weekday: 6, time: '13:00' },
    coordinator: 'Javier Morales',
    talkCoordinator: 'Andrés Castillo',
    speakers: [
      { first: 'Andrés', last: 'Castillo', elder: true },
      { first: 'Miguel', last: 'Herrera', elder: true },
      { first: 'Luis', last: 'Ortega', elder: false },
      {
        first: 'Diego',
        last: 'Ramírez',
        elder: true,
        note: 'Gives talks in English and Spanish',
      },
    ],
  },
  {
    name: 'Kent Russian - Kent WA',
    number: '11846',
    circuit: 'WA- 31-R',
    address: '25404 104th Ave SE Kent WA  98030-7508',
    lat: 47.371,
    lng: -122.201,
    midweek: { weekday: 3, time: '19:00' },
    weekend: { weekday: 6, time: '11:30' },
    coordinator: 'Andrei Volkov',
    talkCoordinator: 'Mikhail Sokolov',
    speakers: [
      { first: 'Mikhail', last: 'Sokolov', elder: true },
      { first: 'Pavel', last: 'Kuznetsov', elder: false },
    ],
  },
  {
    name: 'Everett Portuguese - Everett WA',
    number: '11923',
    circuit: 'WA- 27-P',
    address: '6320 Evergreen Way Everett WA  98203-4531',
    lat: 47.945,
    lng: -122.221,
    midweek: { weekday: 1, time: '19:30' },
    weekend: { weekday: 6, time: '09:30' },
    coordinator: 'Tiago Almeida',
    talkCoordinator: 'Rafael Costa',
    speakers: [
      { first: 'Rafael', last: 'Costa', elder: true },
      { first: 'Bruno', last: 'Santos', elder: true },
      { first: 'Lucas', last: 'Pereira', elder: false },
    ],
  },
];

export const dbSpeakersCatalogFill = async () => {
  const updatedAt = new Date().toISOString();
  const field = <T>(value: T) => ({ value, updatedAt });

  const talkNumbers = Array.from({ length: 194 }, (_, index) => index + 1);
  const songNumbers = Array.from({ length: 160 }, (_, index) => index + 1);

  const congregations = [];
  const speakers = [];

  for (const [index, data] of CATALOG_CONGREGATIONS.entries()) {
    const congregation = structuredClone(speakersCongregationSchema);
    const email = (name: string) =>
      `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@fakemail.com`;
    const phone = (offset: number) =>
      `+1 206 555 0${String(140 + index * 4 + offset).padStart(3, '0')}`;

    congregation.id = crypto.randomUUID();
    congregation._deleted.updatedAt = updatedAt;
    congregation.cong_data.cong_name = field(data.name);
    congregation.cong_data.cong_number = field(data.number);
    congregation.cong_data.cong_circuit = field(data.circuit);
    congregation.cong_data.cong_location = {
      address: field(data.address),
      lat: data.lat,
      lng: data.lng,
    };
    congregation.cong_data.midweek_meeting = {
      weekday: field(data.midweek.weekday),
      time: field(data.midweek.time),
    };
    congregation.cong_data.weekend_meeting = {
      weekday: field(data.weekend.weekday),
      time: field(data.weekend.time),
    };
    congregation.cong_data.coordinator = {
      name: field(data.coordinator),
      email: field(email(data.coordinator)),
      phone: field(phone(0)),
    };
    congregation.cong_data.public_talk_coordinator = {
      name: field(data.talkCoordinator),
      email: field(email(data.talkCoordinator)),
      phone: field(phone(1)),
    };
    congregation.cong_data.request_status = 'approved';

    congregations.push(congregation);

    for (const [speakerIndex, speakerData] of data.speakers.entries()) {
      const speaker = structuredClone(vistingSpeakerSchema);
      const name = `${speakerData.first} ${speakerData.last}`;

      speaker.person_uid = crypto.randomUUID();
      speaker._deleted = field(false);
      speaker.speaker_data = {
        ...speaker.speaker_data,
        cong_id: congregation.id,
        person_firstname: field(speakerData.first),
        person_lastname: field(speakerData.last),
        person_display_name: field(
          generateDisplayName(speakerData.last, speakerData.first)
        ),
        person_notes: field(speakerData.note ?? ''),
        person_email: field(email(name)),
        person_phone: field(phone(2 + speakerIndex)),
        elder: field(speakerData.elder),
        ministerial_servant: field(!speakerData.elder),
        local: field(false),
        talks: shuffle(talkNumbers)
          .slice(0, getRandomNumber(3, 8))
          .sort((a, b) => a - b)
          .map((talk_number) => ({
            _deleted: false,
            updatedAt,
            talk_number,
            talk_songs: shuffle(songNumbers).slice(0, getRandomNumber(1, 2)),
          })),
      };

      speakers.push(speaker);
    }
  }

  await appDb.speakers_congregations.bulkAdd(congregations);
  await appDb.visiting_speakers.bulkAdd(speakers);
};
