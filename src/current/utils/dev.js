import { promiseSetRecoil } from 'recoil-outside';
import { rootModalOpenState } from '../states/main';
import appDb from '../../shared/indexedDb/mainDb';
import { Persons } from '../classes/Persons';
import { Setting } from '../classes/Setting';
import { computeYearsDiff } from './app';
import { ServiceYear } from '../classes/ServiceYear';

const generateDisplayName = (name) => {
  const txtArray = name.split(' ');
  if (txtArray.length === 1) {
    return name;
  } else {
    let varDisplay = '';
    for (let i = 0; i < txtArray.length; i++) {
      if (i === txtArray.length - 1) {
        varDisplay += txtArray[i];
      } else {
        varDisplay += txtArray[i].substring(0, 1) + '. ';
      }
    }
    return varDisplay;
  }
};

const getRandomDate = (startDate = new Date(1970, 0, 1), endDate = new Date(2010, 11, 31)) => {
  const minValue = startDate.getTime();
  const maxValue = endDate.getTime();
  const timestamp = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
  return new Date(timestamp);
};

export const importDummyUsers = async () => {
  try {
    await promiseSetRecoil(rootModalOpenState, true);

    await appDb.persons.clear();
    Persons.list.length = 0;

    const url = 'https://dummyjson.com/users?limit=100';

    const res = await fetch(url);
    const data = await res.json();

    const currentMonthReportStr = ServiceYear.currentReportMonth();
    const currentMonthReportDate = new Date(currentMonthReportStr);

    let formattedData = data.users.map((user) => {
      const fullname = `${user.lastName} ${user.firstName}`;

      const assignments = [];
      let spiritualStatus = [];
      let isBaptized = false;
      let immersedDate = null;
      let firstMonthReport = null;
      const birthDate = getRandomDate(undefined, new Date(2006, 11, 31));

      if (user.gender === 'female') {
        [101, 102, 103, 123, 124, 125, 126].forEach((code) => {
          assignments.push({ code });
        });

        const arrayType = ['publisher', 'non-publisher', 'baptized'];
        const status = arrayType[Math.floor(Math.random() * arrayType.length)];

        if (status === 'publisher') {
          const publisherStartDate = new Date(new Date(birthDate).setFullYear(new Date(birthDate).getFullYear() + 9));
          const pubStartDate = getRandomDate(publisherStartDate);
          spiritualStatus = [
            { statusId: window.crypto.randomUUID(), status: 'publisher', startDate: pubStartDate, endDate: null },
          ];
          firstMonthReport = currentMonthReportDate;
        }

        if (status === 'baptized') {
          const baptismStartDate = new Date(new Date(birthDate).setFullYear(new Date(birthDate).getFullYear() + 11));
          isBaptized = true;
          immersedDate = getRandomDate(baptismStartDate);

          const pubStartDate = getRandomDate(birthDate, baptismStartDate);
          spiritualStatus = [
            { statusId: window.crypto.randomUUID(), status: 'publisher', startDate: pubStartDate, endDate: null },
          ];
          firstMonthReport = currentMonthReportDate;
        }
      }

      return {
        isDisqualified: false,
        isFemale: user.gender === 'female',
        isMale: user.gender === 'male',
        isMoved: false,
        person_displayName: generateDisplayName(fullname),
        person_name: fullname,
        timeAway: [],
        assignments,
        address: `${user.address.address} ${user.address.city}`,
        email: user.email,
        phone: user.phone,
        birthDate,
        spiritualStatus,
        isBaptized,
        immersedDate,
        firstMonthReport,
      };
    });

    const cnChairman = 8;
    for (let i = 0; i < cnChairman; i++) {
      let isPassed = false;
      let user;
      let random;

      do {
        random = Math.floor(Math.random() * formattedData.length);
        user = formattedData[random];
        const age = computeYearsDiff(user.birthDate);

        if (user.isMale && user.assignments.length === 0 && age >= 24) {
          isPassed = true;
        }
      } while (isPassed === false);

      [110, 111, 112, 113, 114, 115, 118, 119, 120, 127].forEach((code) => {
        user.assignments.push({ code });
      });

      const elderStartDate = new Date(
        new Date(user.birthDate).setFullYear(new Date(user.birthDate).getFullYear() + 24)
      );

      user.spiritualStatus = [
        { statusId: window.crypto.randomUUID(), status: 'elder', startDate: elderStartDate, endDate: null },
      ];

      const baptismStartDate = new Date(
        new Date(user.birthDate).setFullYear(new Date(user.birthDate).getFullYear() + 9)
      );
      const baptismEndDate = new Date(new Date(elderStartDate).setFullYear(new Date(elderStartDate).getFullYear() - 3));

      user.isBaptized = true;
      user.immersedDate = getRandomDate(baptismStartDate, baptismEndDate);
      user.firstMonthReport = currentMonthReportDate;

      formattedData.splice(random, 1, user);
    }

    const cnBro = 11;
    for (let i = 0; i < cnBro; i++) {
      let isPassed = false;
      let user;
      let random;

      do {
        random = Math.floor(Math.random() * formattedData.length);
        user = formattedData[random];
        const age = computeYearsDiff(user.birthDate);

        if (user.isMale && user.assignments.length === 0 && age >= 18) {
          isPassed = true;
        }
      } while (isPassed === false);

      [111, 112, 113, 114, 118, 119, 126, 127].forEach((code) => {
        user.assignments.push({ code });
      });

      const assignmentAdd = [120, 121, undefined];
      const selected = assignmentAdd[Math.floor(Math.random() * assignmentAdd.length)];

      if (!selected) {
        user.assignments.push({ selected });
      }

      const msStartDate = new Date(new Date(user.birthDate).setFullYear(new Date(user.birthDate).getFullYear() + 17));

      user.spiritualStatus = [
        { statusId: window.crypto.randomUUID(), status: 'ms', startDate: msStartDate, endDate: null },
      ];

      const baptismStartDate = new Date(
        new Date(user.birthDate).setFullYear(new Date(user.birthDate).getFullYear() + 9)
      );
      const baptismEndDate = new Date(new Date(msStartDate).setFullYear(new Date(msStartDate).getFullYear() - 3));

      user.isBaptized = true;
      user.immersedDate = getRandomDate(baptismStartDate, baptismEndDate);
      user.firstMonthReport = currentMonthReportDate;

      formattedData.splice(random, 1, user);
    }

    const cnReader = 6;
    for (let i = 0; i < cnReader; i++) {
      let isPassed = false;
      let user;
      let random;

      do {
        random = Math.floor(Math.random() * formattedData.length);
        user = formattedData[random];
        const age = computeYearsDiff(user.birthDate);

        if (user.isMale && user.assignments.length === 0 && age >= 14) {
          isPassed = true;
        }
      } while (isPassed === false);

      [104, 111, 116, 126].forEach((code) => {
        user.assignments.push({ code });
      });

      const baptismStartDate = new Date(
        new Date(user.birthDate).setFullYear(new Date(user.birthDate).getFullYear() + 11)
      );
      user.isBaptized = true;
      user.immersedDate = getRandomDate(baptismStartDate);
      user.firstMonthReport = currentMonthReportDate;

      const pubStartDate = getRandomDate(user.birthDate, baptismStartDate);
      user.spiritualStatus = [
        { statusId: window.crypto.randomUUID(), status: 'publisher', startDate: pubStartDate, endDate: null },
      ];

      formattedData.splice(random, 1, user);
    }

    const cnRemains = formattedData.filter((user) => user.isMale && user.assignments.length === 0).length;
    for (let i = 0; i < cnRemains; i++) {
      let isMale = false;
      let user;
      let random;

      do {
        random = Math.floor(Math.random() * formattedData.length);
        user = formattedData[random];

        if (user.isMale && user.assignments.length === 0) {
          isMale = true;
        }
      } while (isMale === false);

      [100, 104, 122, 126].forEach((code) => {
        user.assignments.push({ code });
      });

      const arrayType = ['publisher', 'non-publisher', 'baptized'];
      const status = arrayType[Math.floor(Math.random() * arrayType.length)];

      if (status === 'publisher') {
        const publisherStartDate = new Date(
          new Date(user.birthDate).setFullYear(new Date(user.birthDate).getFullYear() + 9)
        );
        const pubStartDate = getRandomDate(publisherStartDate);
        user.spiritualStatus = [
          { statusId: window.crypto.randomUUID(), status: 'publisher', startDate: pubStartDate, endDate: null },
        ];
        user.firstMonthReport = currentMonthReportDate;
      }

      if (status === 'baptized') {
        const baptismStartDate = new Date(
          new Date(user.birthDate).setFullYear(new Date(user.birthDate).getFullYear() + 11)
        );
        user.isBaptized = true;
        user.immersedDate = getRandomDate(baptismStartDate);
        user.firstMonthReport = currentMonthReportDate;

        const pubStartDate = getRandomDate(user.birthDate, baptismStartDate);
        user.spiritualStatus = [
          { statusId: window.crypto.randomUUID(), status: 'publisher', startDate: pubStartDate, endDate: null },
        ];
      }

      formattedData.splice(random, 1, user);
    }

    for await (const user of formattedData) {
      await Persons.preSave(user);
    }

    // save settings
    const obj = { personAssignmentsConverted: false };
    await Setting.update(obj);

    await promiseSetRecoil(rootModalOpenState, false);
  } catch (err) {
    await promiseSetRecoil(rootModalOpenState, false);
    throw new Error(err);
  }
};
