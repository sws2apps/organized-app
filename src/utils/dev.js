import { promiseSetRecoil } from 'recoil-outside';
import { format } from 'date-fns';
import { rootModalOpenState } from '../states/main';
import { dbSavePersonExp } from '../indexedDb/dbPersons';
import appDb from '../indexedDb/mainDb';

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

export const importDummyUsers = async () => {
  await promiseSetRecoil(rootModalOpenState, true);

  await appDb.persons.clear();

  const url = 'https://dummyjson.com/users?limit=100';

  const res = await fetch(url);
  const data = await res.json();

  let formattedData = data.users.map((user) => {
    const fullname = `${user.lastName} ${user.firstName}`;

    const assignments = [];
    if (user.gender === 'female') {
      [101, 102, 103].forEach((code) => {
        assignments.push({
          assignmentId: window.crypto.randomUUID(),
          code,
          startDate: format(new Date(), 'MM/dd/yyyy'),
          endDate: null,
          comments: '',
        });
      });
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
    };
  });

  const cnChairman = 13;
  for (let i = 0; i < cnChairman; i++) {
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

    [110, 111, 112, 113, 114, 115].forEach((code) => {
      user.assignments.push({
        assignmentId: window.crypto.randomUUID(),
        code,
        startDate: format(new Date(), 'MM/dd/yyyy'),
        endDate: null,
        comments: '',
      });
    });

    formattedData.splice(random, 1, user);
  }

  const cnBro = 6;
  for (let i = 0; i < cnBro; i++) {
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

    [111, 112, 113, 114].forEach((code) => {
      user.assignments.push({
        assignmentId: window.crypto.randomUUID(),
        code,
        startDate: format(new Date(), 'MM/dd/yyyy'),
        endDate: null,
        comments: '',
      });
    });

    formattedData.splice(random, 1, user);
  }

  const cnReader = 6;
  for (let i = 0; i < cnReader; i++) {
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

    [104, 111, 116].forEach((code) => {
      user.assignments.push({
        assignmentId: window.crypto.randomUUID(),
        code,
        startDate: format(new Date(), 'MM/dd/yyyy'),
        endDate: null,
        comments: '',
      });
    });

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

    [100, 104].forEach((code) => {
      user.assignments.push({
        assignmentId: window.crypto.randomUUID(),
        code,
        startDate: format(new Date(), 'MM/dd/yyyy'),
        endDate: null,
        comments: '',
      });
    });

    formattedData.splice(random, 1, user);
  }

  for await (const user of formattedData) {
    await dbSavePersonExp(user);
  }

  await promiseSetRecoil(rootModalOpenState, false);
};
