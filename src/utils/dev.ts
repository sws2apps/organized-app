import { store } from '@states/index';
import { rootModalOpenState } from '@states/app';
import { PersonType } from '@definition/person';
import { AssignmentCode } from '@definition/assignment';
import {
  FieldServiceGroupMemberType,
  FieldServiceGroupType,
} from '@definition/field_service_groups';
import {
  FieldServiceMeetingType,
  FieldServiceMeetingCategory,
  FieldServiceMeetingLocation,
} from '@definition/field_service_meetings';
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
  addMonths,
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
            value: new Date(user.birthDate).toISOString(),
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
        name: i < 4 ? `Group ${i + 1}` : '',
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

export const dbReportsFillRandom = async () => {
  await appDb.cong_field_service_reports.clear();

  const year = new Date().getFullYear();
  const startMonth = `${year - 1}/09`;
  const endMonth = currentReportMonth();

  const monthRange = createArrayFromMonths(startMonth, endMonth);

  const reportsToSave: CongFieldServiceReportType[] = [];

  for await (const month of monthRange) {
    const active_publishers = await getPublishersActive(month);

    for (const person of active_publishers) {
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
          const service = getRandomNumber(20, 40);
          const credit = 55 - service;

          report.report_data.hours.field_service = service;
          report.report_data.hours.credit = { approved: credit, value: 0 };
        }

        if (!reportCredit) {
          report.report_data.hours.field_service = getRandomNumber(50, 60);
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

    branchReport.report_data.submitted = true;
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

  weeksList.forEach((schedule) => {
    const talkMain = getRandomArrayItem(validTalks);

    const main = schedule.weekend_meeting.public_talk.find(
      (record) => record.type === 'main'
    );

    main.value = talkMain.talk_number;
    main.updatedAt = new Date().toISOString();

    const talkGroup = getRandomArrayItem(validTalks);

    schedule.weekend_meeting.public_talk.push({
      type: group.group_id,
      updatedAt: new Date().toISOString(),
      value: talkGroup.talk_number,
    });
  });

  await dbSourcesBulkPut(weeksList);
};

export const dbSchedulesAutoFill = async () => {
  const startWeek = getWeekDate();
  const endWeek = addMonths(startWeek, 3);

  const start = formatDate(startWeek, 'yyyy/MM/dd');
  const end = formatDate(endWeek, 'yyyy/MM/dd');

  await schedulesStartAutofill(start, end, 'midweek');

  await schedulesRandomChooseTalks(start, end);

  await schedulesStartAutofill(start, end, 'weekend');

  // force language group switch
  const groups = store.get(languageGroupsState);
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

  for (let i = 0; i < 2; i++) {
    const targetMonth = (startMonth + i) % 12;
    const targetYear = startYear + Math.floor((startMonth + i) / 12);

    // Last day of the month
    const lastDay = new Date(targetYear, targetMonth + 1, 0);

    const day = lastDay.getDay();
    const diff = lastDay.getDate() - day + (day === 0 ? -6 : 1);
    const monDay = new Date(lastDay.setDate(diff));

    const weekDate = formatDate(monDay, 'yyyy/MM/dd');

    result.push(weekDate);
  }

  for (const week of result) {
    await schedulesStartAutofill(week, week, 'midweek');
  }

  // revert view to main
  await dbAppSettingsUpdate({
    'user_settings.data_view': {
      value: 'main',
      updatedAt: new Date().toISOString(),
    },
  });
};

export const dbFieldServiceMeetingsDummy = async () => {
  const groups = await appDb.field_service_groups.toArray();
  const settings = await appDb.app_settings.get(1);
  const userLocalUid = settings.user_settings.user_local_uid;
  const now = new Date().toISOString();

  console.log('[dbFieldServiceMeetingsDummy] Found groups:', groups.length);

  // Find current user's group
  const userGroup = groups.find((group) =>
    group.group_data.members.some(
      (member) => member.person_uid === userLocalUid
    )
  );
  console.log('[dbFieldServiceMeetingsDummy] User group:', userGroup);

  // Get first day of current week (Monday)
  const firstDayOfWeek = getWeekDate(new Date());

  // Helper to create meeting date within current week
  const createMeetingDate = (dayOfWeek: number) => {
    const start = new Date(firstDayOfWeek);
    start.setDate(firstDayOfWeek.getDate() + dayOfWeek);
    start.setHours(9, 30, 0, 0);

    const end = new Date(start);
    end.setHours(10, 30, 0, 0);

    return { start: start.toISOString(), end: end.toISOString() };
  };

  // Regular Meeting - Kingdom Hall (assigned to current user's group) - Monday
  const { start: start0, end: end0 } = createMeetingDate(2);
  const meeting0: FieldServiceMeetingType = {
    meeting_uid: crypto.randomUUID(),
    _deleted: false,
    updatedAt: now,
    meeting_data: {
      _deleted: false,
      updatedAt: now,
      start: start0,
      end: end0,
      type: userGroup?.group_id || 'main',
      category: FieldServiceMeetingCategory.RegularMeeting,
      conductor: 'John Smith',
      location: FieldServiceMeetingLocation.KingdomHall,
      group_id: userGroup?.group_id,
      address: '123 Kingdom Hall St',
      additionalInfo: 'Bring your iPad',
    },
  };

  // Group Meeting - Publisher home - Wednesday
  const firstGroup = groups.find((g) => !g.group_data.language_group);
  console.log('[dbFieldServiceMeetingsDummy] First group:', firstGroup);
  const { start: start1, end: end1 } = createMeetingDate(4);
  const meeting1: FieldServiceMeetingType = {
    meeting_uid: crypto.randomUUID(),
    _deleted: false,
    updatedAt: now,
    meeting_data: {
      _deleted: false,
      updatedAt: now,
      start: start1,
      end: end1,
      type: firstGroup?.group_id || 'main',
      category: FieldServiceMeetingCategory.GroupMeeting,
      conductor: 'Mary Johnson',
      location: FieldServiceMeetingLocation.Publisher,
      group_id: firstGroup?.group_id,
      address: '456 Publisher Ave',
      additionalInfo: 'Group 1 only',
    },
  };

  // Joint Meeting - Territory - Saturday
  const { start: start2, end: end2 } = createMeetingDate(5);
  const meeting2: FieldServiceMeetingType = {
    meeting_uid: crypto.randomUUID(),
    _deleted: false,
    updatedAt: now,
    meeting_data: {
      _deleted: false,
      updatedAt: now,
      start: start2,
      end: end2,
      type: 'main',
      category: FieldServiceMeetingCategory.JointMeeting,
      conductor: 'David Brown',
      location: FieldServiceMeetingLocation.Territory,
      address: 'Central Park',
      additionalInfo: 'All groups - Special campaign',
    },
  };

  // Service Overseer Meeting - Zoom - Sunday
  const { start: start3, end: end3 } = createMeetingDate(6);
  const meeting3: FieldServiceMeetingType = {
    meeting_uid: crypto.randomUUID(),
    _deleted: false,
    updatedAt: now,
    meeting_data: {
      _deleted: false,
      updatedAt: now,
      start: start3,
      end: end3,
      type: 'main',
      category: FieldServiceMeetingCategory.ServiceOverseerMeeting,
      conductor: 'Service Overseer',
      location: FieldServiceMeetingLocation.Zoom,
      address: 'https://zoom.us/j/123456789',
    },
  };

  await appDb.field_service_meetings.bulkAdd([
    meeting0,
    meeting1,
    meeting2,
    meeting3,
  ]);
};
