import { promiseSetRecoil } from 'recoil-outside';
import { rootModalOpenState } from '@states/app';
import { PersonType } from '@definition/person';
import { generateDisplayName } from './common';
import { AssignmentCode } from '@definition/assignment';
import appDb from '@shared/indexedDb/appDb';

export const delay = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getRandomDate = (startDate = new Date(1970, 0, 1), endDate = new Date(2010, 11, 31)) => {
  const minValue = startDate.getTime();
  const maxValue = endDate.getTime();
  const timestamp = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
  return new Date(timestamp).toISOString();
};

export const importDummyPersons = async () => {
  try {
    await promiseSetRecoil(rootModalOpenState, true);

    await appDb.persons.clear();

    const url = 'https://dummyjson.com/users?limit=100';

    const res = await fetch(url);
    const data = await res.json();

    const startDateTemp = new Date(new Date().getUTCFullYear(), new Date().getMonth() - 1, 1).toISOString();

    const formattedData: PersonType[] = data.users.map((user) => {
      const obj = {
        _deleted: null,
        person_uid: crypto.randomUUID(),
        isDisqualified: { value: false, updatedAt: new Date().toISOString() },
        isFemale: { value: user.gender === 'female', updatedAt: new Date().toISOString() },
        isMale: { value: user.gender === 'male', updatedAt: new Date().toISOString() },
        isMoved: { value: false, updatedAt: new Date().toISOString() },
        person_firstname: { value: user.firstName, updatedAt: new Date().toISOString() },
        person_lastname: { value: user.lastName, updatedAt: new Date().toISOString() },
        person_displayName: {
          value: generateDisplayName(user.lastName, user.firstName),
          updatedAt: new Date().toISOString(),
        },
        birthDate: { value: new Date(user.birthDate).toISOString(), updatedAt: new Date().toISOString() },
        address: { value: `${user.address.address} ${user.address.city}`, updatedAt: new Date().toISOString() },
        email: { value: user.email, updatedAt: new Date().toISOString() },
        phone: { value: user.phone, updatedAt: new Date().toISOString() },
        firstMonthReport: { value: null, updatedAt: '' },
        baptizedPublisher: {
          active: { value: false, updatedAt: new Date().toISOString() },
          isAnointed: { value: false, updatedAt: new Date().toISOString() },
          isOtherSheep: { value: true, updatedAt: new Date().toISOString() },
          baptismDate: { value: null, updatedAt: new Date().toISOString() },
          history: [],
        },
        unbaptizedPublisher: {
          active: { value: false, updatedAt: new Date().toISOString() },
          history: [],
        },
        midweekMeetingStudent: {
          active: { value: false, updatedAt: new Date().toISOString() },
          history: [],
        },
        timeAway: [],
        assignments: [],
        privileges: [],
        enrollments: [],
        emergencyContacts: [],
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
      if (person.isFemale.value) {
        const femaleArray = ['midweek', 'unbaptized', 'baptized', 'AP', 'FR', 'FS', 'FMF'];
        let statusPassed = false;
        let femaleStatus: string;

        do {
          femaleStatus = femaleArray[Math.floor(Math.random() * femaleArray.length)];

          if (femaleStatus === 'midweek' && activeFemaleMidweek < cnFemaleMidweek) {
            statusPassed = true;
            activeFemaleMidweek++;
          }

          if (femaleStatus === 'unbaptized' && activeFemaleUnbaptized < cnFemaleUnbaptized) {
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
          person.midweekMeetingStudent = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                startDate: { value: startDateTemp, updatedAt: new Date().toISOString() },
                endDate: { value: null, updatedAt: '' },
                _deleted: null,
              },
            ],
          };

          person.assignments.push({
            code: AssignmentCode.MM_AssistantOnly,
            updatedAt: new Date().toISOString(),
            _deleted: null,
          });
        }

        if (femaleStatus === 'unbaptized') {
          person.firstMonthReport = { value: startDateTemp, updatedAt: new Date().toISOString() };

          person.unbaptizedPublisher = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                startDate: { value: startDateTemp, updatedAt: new Date().toISOString() },
                endDate: { value: null, updatedAt: '' },
                _deleted: null,
              },
            ],
          };

          person.assignments.push(
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: null,
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
          person.firstMonthReport = { value: startDateTemp, updatedAt: new Date().toISOString() };

          const baptismStartDate = new Date(
            new Date(person.birthDate.value).setFullYear(new Date(person.birthDate.value).getFullYear() + 11)
          );

          person.baptizedPublisher = {
            active: { value: true, updatedAt: new Date().toISOString() },
            baptismDate: { value: getRandomDate(baptismStartDate), updatedAt: new Date().toISOString() },
            isOtherSheep: { value: true, updatedAt: new Date().toISOString() },
            isAnointed: { value: false, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                startDate: { value: startDateTemp, updatedAt: new Date().toISOString() },
                endDate: { value: null, updatedAt: '' },
                _deleted: null,
              },
            ],
          };

          person.assignments.push(
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            }
          );
        }

        if (femaleStatus === 'AP' || femaleStatus === 'FR' || femaleStatus === 'FS' || femaleStatus === 'FMF') {
          person.enrollments.push({
            id: crypto.randomUUID(),
            enrollment: { value: femaleStatus, updatedAt: new Date().toISOString() },
            startDate: { value: startDateTemp, updatedAt: new Date().toISOString() },
            endDate: { value: null, updatedAt: new Date().toISOString() },
            _deleted: null,
          });
        }
      }
    }

    const cnMaleMidweek = 5;
    const cnMaleUnbaptized = 15;
    const cnElder = 6;
    const cnElderFR = 3;
    const cnMinServ = 1;
    const cnMinServFR = 3;
    const cnMaleFR = 4;
    const cnMaleFS = 2;
    const cnMaleFMF = 2;

    let activeMaleMidweek = 0;
    let activeMaleUnbaptized = 0;
    let activeElder = 0;
    let activeElderFR = 0;
    let activeMinServ = 0;
    let activeMinServFR = 0;
    let activeMaleFR = 0;
    let activeMaleFS = 0;
    let activeMaleFMF = 0;

    for (const person of formattedData) {
      if (person.isMale.value) {
        const maleArray = [
          'midweek',
          'unbaptized',
          'baptized',
          'elder',
          'elderFR',
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

          if (maleStatus === 'unbaptized' && activeMaleUnbaptized < cnMaleUnbaptized) {
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
          person.midweekMeetingStudent = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                startDate: { value: startDateTemp, updatedAt: new Date().toISOString() },
                endDate: { value: null, updatedAt: '' },
                _deleted: null,
              },
            ],
          };

          person.assignments.push({
            code: AssignmentCode.MM_BibleReading,
            updatedAt: new Date().toISOString(),
            _deleted: null,
          });
        }

        if (maleStatus === 'unbaptized') {
          person.firstMonthReport = { value: startDateTemp, updatedAt: new Date().toISOString() };

          person.unbaptizedPublisher = {
            active: { value: true, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                startDate: { value: startDateTemp, updatedAt: new Date().toISOString() },
                endDate: { value: null, updatedAt: '' },
                _deleted: null,
              },
            ],
          };

          person.assignments.push(
            {
              code: AssignmentCode.MM_BibleReading,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            }
          );
        }

        if (
          maleStatus === 'baptized' ||
          maleStatus === 'elder' ||
          maleStatus === 'elderFR' ||
          maleStatus === 'minServ' ||
          maleStatus === 'minServFR' ||
          maleStatus === 'FR' ||
          maleStatus === 'FS' ||
          maleStatus === 'FMF'
        ) {
          person.firstMonthReport = { value: startDateTemp, updatedAt: new Date().toISOString() };

          const baptismStartDate = new Date(
            new Date(person.birthDate.value).setFullYear(new Date(person.birthDate.value).getFullYear() + 11)
          );

          person.baptizedPublisher = {
            active: { value: true, updatedAt: new Date().toISOString() },
            baptismDate: { value: getRandomDate(baptismStartDate), updatedAt: new Date().toISOString() },
            isOtherSheep: { value: true, updatedAt: new Date().toISOString() },
            isAnointed: { value: false, updatedAt: new Date().toISOString() },
            history: [
              {
                id: crypto.randomUUID(),
                startDate: { value: startDateTemp, updatedAt: new Date().toISOString() },
                endDate: { value: null, updatedAt: '' },
                _deleted: null,
              },
            ],
          };
        }

        if (maleStatus === 'baptized' || maleStatus === 'FR') {
          person.assignments.push(
            {
              code: AssignmentCode.MM_StartingConversation,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_FollowingUp,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_ExplainingBeliefs,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_MakingDisciples,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_Talk,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            }
          );
        }

        if (maleStatus === 'elder' || maleStatus === 'elderFR' || maleStatus === 'FS' || maleStatus === 'FMF') {
          person.privileges.push({
            id: crypto.randomUUID(),
            privilege: { value: 'elder', updatedAt: new Date().toISOString() },
            startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
            endDate: { value: null, updatedAt: new Date().toISOString() },
            _deleted: null,
          });

          person.assignments.push(
            {
              code: AssignmentCode.MM_Chairman,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_AuxiliaryCounselor,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_TGWTalk,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_TGWGems,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_Discussion,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_LCPart,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_CBSConductor,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.WM_Chairman,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.WM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.WM_Speaker,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            }
          );
        }

        if (maleStatus === 'minServ' || maleStatus === 'minServFR') {
          person.privileges.push({
            id: crypto.randomUUID(),
            privilege: { value: 'ms', updatedAt: new Date().toISOString() },
            startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
            endDate: { value: null, updatedAt: new Date().toISOString() },
            _deleted: null,
          });

          person.assignments.push(
            {
              code: AssignmentCode.MM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_TGWTalk,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_TGWGems,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_Discussion,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_LCPart,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.MM_CBSReader,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.WM_Chairman,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.WM_Prayer,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.WM_Speaker,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            },
            {
              code: AssignmentCode.WM_WTStudyReader,
              updatedAt: new Date().toISOString(),
              _deleted: null,
            }
          );
        }

        if (maleStatus === 'elderFR' || maleStatus === 'minServFR' || maleStatus === 'FR') {
          person.enrollments.push({
            id: crypto.randomUUID(),
            enrollment: { value: 'FR', updatedAt: new Date().toISOString() },
            startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
            endDate: { value: null, updatedAt: new Date().toISOString() },
            _deleted: null,
          });
        }

        if (maleStatus === 'FS' || maleStatus === 'FMF') {
          person.enrollments.push({
            id: crypto.randomUUID(),
            enrollment: { value: maleStatus, updatedAt: new Date().toISOString() },
            startDate: { value: new Date().toISOString(), updatedAt: new Date().toISOString() },
            endDate: { value: null, updatedAt: new Date().toISOString() },
            _deleted: null,
          });
        }
      }
    }

    for await (const person of formattedData) {
      await appDb.persons.put(person);
    }

    await promiseSetRecoil(rootModalOpenState, false);
  } catch (err) {
    await promiseSetRecoil(rootModalOpenState, false);
    console.error(err);
  }
};
