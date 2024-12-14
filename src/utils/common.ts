import { PersonType } from '@definition/person';
import { FullnameOption } from '@definition/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export const convertStringToBoolean = (value) => {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return false;
  }
};

export const countUnreadNotifications = ({ announcements, language = 'E' }) => {
  let count = 0;

  for (const announcement of announcements) {
    const findTitleIndex = announcement.title.findIndex(
      (item) => item.language === language
    );
    let isRead = announcement.title[findTitleIndex].isRead;

    if (isRead) {
      const findBodyIndex = announcement.body.findIndex(
        (item) => item.language === language
      );
      isRead = announcement.body[findBodyIndex].isRead;
    }

    if (!isRead) count++;
  }

  return count;
};

export const formatCongregationInfo = (name = '', number = '') => {
  let formatted = '';

  if (name !== '' && number !== '') {
    formatted = `${name} (${number})`;
  }
  return formatted;
};

export const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

export const buildPersonFullname = (
  lastname: string,
  firstname: string,
  option?: FullnameOption
) => {
  const buildOption = option || FullnameOption.FIRST_BEFORE_LAST;

  if (lastname.length === 0) {
    return firstname;
  }

  if (firstname.length === 0) {
    return lastname;
  }

  if (buildOption === FullnameOption.FIRST_BEFORE_LAST) {
    return `${firstname} ${lastname}`;
  }

  return `${lastname} ${firstname}`;
};

export const generateDisplayName = (lastname: string, firstname: string) => {
  if (lastname.length === 0) {
    return firstname;
  }

  if (firstname.length === 0) {
    return lastname;
  }

  const txtArray = String(`${lastname} ${firstname}`).split(' ');
  let varDisplay = '';
  for (let i = 0; i < txtArray.length; i++) {
    if (i === txtArray.length - 1) {
      varDisplay += txtArray[i];
    } else {
      varDisplay += txtArray[i].substring(0, 1) + '. ';
    }
  }
  return varDisplay;
};

export const localStorageGetItem = (key: string) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  return localStorage.getItem(key);
};

export const delay = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const updateObject = <T extends object>(oldObj: T, newObj: T): T => {
  const objectKeys = Object.keys(newObj).filter(
    (key) => newObj[key] !== null && typeof newObj[key] === 'object'
  );

  for (const key of objectKeys) {
    if (oldObj[key]) {
      if (!('updatedAt' in newObj[key])) {
        updateObject(oldObj[key], newObj[key]);
      } else {
        if (newObj[key].updatedAt > oldObj[key].updatedAt) {
          oldObj[key] = newObj[key];
        }
      }
    } else {
      oldObj[key] = newObj[key];
    }
  }

  const primitiveKeys = Object.keys(newObj).filter(
    (key) => typeof newObj[key] !== 'object'
  );
  for (const key of primitiveKeys) {
    if (newObj[key] && newObj[key] !== null && newObj[key] !== '') {
      oldObj[key] = newObj[key];
    }
  }

  return oldObj;
};

export const personGetDisplayName = (
  option: PersonType,
  displayNameEnabled: boolean,
  fullnameOption: FullnameOption
) => {
  let result: string;

  if (displayNameEnabled) {
    result = option.person_data.person_display_name.value;
  }

  if (!displayNameEnabled) {
    result = buildPersonFullname(
      option.person_data.person_lastname.value,
      option.person_data.person_firstname.value,
      fullnameOption
    );
  }

  return result;
};

export const speakerGetDisplayName = (
  speaker: VisitingSpeakerType,
  displayNameEnabled: boolean,
  fullnameOption: FullnameOption
) => {
  let result: string;

  if (displayNameEnabled) {
    result = speaker.speaker_data.person_display_name.value;
  }

  if (!displayNameEnabled) {
    result = buildPersonFullname(
      speaker.speaker_data.person_lastname.value,
      speaker.speaker_data.person_firstname.value,
      fullnameOption
    );
  }

  return result;
};

export const createNumbersArray = (length: number) => {
  return Array.from({ length }, (_, i) => i + 1);
};

export const styledRemoveProps = (prop: PropertyKey, userProp: string[]) =>
  !userProp.includes(String(prop));

export const copyToClipboard = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

export const getRandomArrayItem = <T>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const updatedAtOverride = <T extends object>(object: T): T => {
  const objectKeys = Object.keys(object);

  for (const key of objectKeys) {
    if (key === 'updatedAt') {
      object[key] = new Date().toISOString();
    }

    if (object[key] && typeof object[key] === 'object') {
      updatedAtOverride(object[key]);
    }
  }

  return object;
};
