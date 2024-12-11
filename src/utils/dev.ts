import { promiseSetRecoil } from 'recoil-outside';
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
  personIsMS,
  personIsPublisher,
} from '@services/app/persons';
import PERSON_MOCK from '@constants/person_mock';
import appDb from '@db/appDb';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import {
  createArrayFromMonths,
  currentReportMonth,
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
import { formatDate } from '@services/dateformat';

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
      await promiseSetRecoil(rootModalOpenState, true);
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
          categories: ['main'],
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
            code: AssignmentCode.MM_AssistantOnly,
            updatedAt: new Date().toISOString(),
            _deleted: false,
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

          person.person_data.assignments.push(
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            }
          );
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

          person.person_data.assignments.push(
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            }
          );
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
          person.person_data.assignments.push({
            code: AssignmentCode.MINISTRY_HOURS_CREDIT,
            _deleted: false,
            updatedAt: new Date().toISOString(),
          });
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
            code: AssignmentCode.MM_BibleReading,
            updatedAt: new Date().toISOString(),
            _deleted: false,
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

          person.person_data.assignments.push(
            {
              code: AssignmentCode.MM_BibleReading,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            }
          );
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
          person.person_data.assignments.push(
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_Talk,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            }
          );
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

          person.person_data.assignments.push(
            {
              code: AssignmentCode.MM_Chairman,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_AuxiliaryCounselor,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_TGWTalk,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_TGWGems,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_Discussion,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_LCPart,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_CBSConductor,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.WM_Chairman,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.WM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.WM_Speaker,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            }
          );
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

          person.person_data.assignments.push(
            {
              code: AssignmentCode.MM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_TGWTalk,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_TGWGems,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_Discussion,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_LCPart,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MM_CBSReader,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.WM_Chairman,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.WM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.WM_WTStudyReader,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            }
          );
        }

        if (maleStatus === 'minServ') {
          person.person_data.assignments.push({
            code: AssignmentCode.WM_SpeakerSymposium,
            updatedAt: new Date().toISOString(),
            _deleted: false,
          });
        }

        if (maleStatus === 'minServFR') {
          person.person_data.assignments.push({
            code: AssignmentCode.WM_Speaker,
            updatedAt: new Date().toISOString(),
            _deleted: false,
          });
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

          person.person_data.assignments.push(
            {
              code: AssignmentCode.WM_WTStudyConductor,
              updatedAt: new Date().toISOString(),
              _deleted: false,
            },
            {
              code: AssignmentCode.MINISTRY_HOURS_CREDIT,
              _deleted: false,
              updatedAt: new Date().toISOString(),
            }
          );
        }

        if (maleStatus === 'FR') {
          person.person_data.assignments.push({
            code: AssignmentCode.MINISTRY_HOURS_CREDIT,
            _deleted: false,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    await appDb.persons.bulkPut(formattedData);

    if (showProgress) await promiseSetRecoil(rootModalOpenState, false);
  } catch (err) {
    if (showProgress) await promiseSetRecoil(rootModalOpenState, false);
    console.error(err);
  }
};

export const dbSettingsAssignMainWTStudyConductor = async () => {
  const settings = await appDb.app_settings.toArray();

  const persons = await appDb.persons.toArray();

  const conductor = persons.find((record) =>
    record.person_data.assignments.find(
      (item) =>
        item._deleted === false &&
        item.code === AssignmentCode.WM_WTStudyConductor
    )
  );

  const weekend_meeting = structuredClone(
    settings.at(0).cong_settings.weekend_meeting
  );
  const setting = weekend_meeting.find((record) => record.type === 'main');
  setting.w_study_conductor_default = {
    value: conductor.person_uid,
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

  const publishers = persons.filter((person) => {
    const isBaptized = person.person_data.publisher_baptized.active.value;
    const isUnbaptized = person.person_data.publisher_unbaptized.active.value;

    return isBaptized || isUnbaptized;
  });

  // assign overseers and assistants first
  for (let i = 1; i <= 5; i++) {
    const assigned_members = groups.reduce(
      (acc: FieldServiceGroupMemberType[], current) => {
        acc.push(...current.group_data.members);

        return acc;
      },
      []
    );

    const members: FieldServiceGroupMemberType[] = [];

    const elders = publishers.filter((person) => personIsElder(person));
    const ms = publishers.filter((person) => personIsMS(person));

    // assign overseer
    let assigned: FieldServiceGroupMemberType;
    do {
      const person = getRandomArrayItem(elders);
      const find = assigned_members.some(
        (record) => record.person_uid === person.person_uid
      );

      if (!find) {
        assigned = {
          isAssistant: false,
          isOverseer: true,
          person_uid: person.person_uid,
          sort_index: 0,
        };

        members.push(assigned);
        assigned_members.push(assigned);
      }
    } while (!assigned);

    // assign assistant
    assigned = undefined;
    do {
      const person = getRandomArrayItem(ms);
      const find = assigned_members.some(
        (record) => record.person_uid === person.person_uid
      );

      if (!find) {
        assigned = {
          isAssistant: true,
          isOverseer: false,
          person_uid: person.person_uid,
          sort_index: 1,
        };

        members.push(assigned);
        assigned_members.push(assigned);
      }
    } while (!assigned);

    groups.push({
      group_id: crypto.randomUUID(),
      group_data: {
        _deleted: false,
        updatedAt: new Date().toISOString(),
        name: '',
        sort_index: i - 1,
        members,
      },
    });
  }

  // assign group members
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
      const person = getRandomArrayItem(publishers);

      const find = assigned_members.some(
        (record) => record.person_uid === person.person_uid
      );

      if (!find) {
        const assigned = {
          isAssistant: false,
          isOverseer: false,
          person_uid: person.person_uid,
          sort_index: members.length,
        };

        members.push(assigned);
        assigned_members.push(assigned);
      }
    } while (members.length < length);

    i++;
  }

  await appDb.field_service_groups.bulkPut(groups);
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
        const reportCredit = person.person_data.assignments.some(
          (record) =>
            record._deleted === false &&
            record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
        );

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

      const mainMidweek = weeklyAttendance.midweek.find(
        (record) => record.type === 'main'
      );
      mainMidweek.present = getRandomNumber(95, 110);
      mainMidweek.updatedAt = new Date().toISOString();

      const mainWeekend = weeklyAttendance.weekend.find(
        (record) => record.type === 'main'
      );
      mainWeekend.present = getRandomNumber(105, 130);
      mainWeekend.updatedAt = new Date().toISOString();
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
