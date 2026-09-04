import { AssignmentCongregation, SchedWeekType } from '@definition/schedules';
import { PersonType } from '@definition/person';
import { FullnameOption } from '@definition/settings';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
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
  option?: FullnameOption,
  middlename?: string
) => {
  const buildOption = option || FullnameOption.FIRST_BEFORE_LAST;

  const middle = middlename?.trim() ?? '';

  if (buildOption === FullnameOption.FIRST_MIDDLE_LAST) {
    return [firstname, middle, lastname].filter(Boolean).join(' ');
  }

  if (buildOption === FullnameOption.LAST_FIRST_MIDDLE) {
    return [lastname, firstname, middle].filter(Boolean).join(' ');
  }

  // the comma marks a western sorted-list inversion ("Gonzalez, William");
  // family-name-first languages use LAST_BEFORE_FIRST or LAST_FIRST_MIDDLE,
  // whose natural order takes no comma
  if (
    buildOption === FullnameOption.LAST_COMMA_FIRST ||
    buildOption === FullnameOption.LAST_COMMA_FIRST_MIDDLE
  ) {
    const given =
      buildOption === FullnameOption.LAST_COMMA_FIRST_MIDDLE
        ? [firstname, middle].filter(Boolean).join(' ')
        : firstname;

    if (lastname.length === 0) return given;
    if (given.length === 0) return lastname;

    return `${lastname}, ${given}`;
  }

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

  const lastNameInitials = lastname
    .split(' ')
    .map((name) => (name ? name.substring(0, 1) + '.' : ''))
    .join(' ');

  return `${lastNameInitials} ${firstname}`;
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
  const arrayKeys = Object.keys(newObj).filter(
    (key) => newObj[key] !== null && Array.isArray(newObj[key])
  );

  const lockKeys = ['type', 'id', 'talk_number'];

  for (const key of arrayKeys) {
    if (!oldObj[key]) {
      oldObj[key] = newObj[key];
      continue;
    }

    if (!Array.isArray(oldObj[key])) {
      oldObj[key] = newObj[key];
      continue;
    }

    for (const remoteValue of newObj[key]) {
      if (typeof remoteValue !== 'object') {
        continue;
      }

      for (const lockKey of lockKeys) {
        if (lockKey in remoteValue) {
          const localValue = oldObj[key].find(
            (r) => r[lockKey] === remoteValue[lockKey]
          );

          if (!localValue) {
            oldObj[key].push(remoteValue);
          } else {
            if ('updatedAt' in localValue) {
              if (remoteValue.updatedAt > localValue.updatedAt) {
                Object.assign(localValue, remoteValue);
              }
            }

            if (!('updatedAt' in localValue)) {
              updateObject(localValue, remoteValue);
            }
          }

          break;
        }
      }
    }
  }

  const objectKeys = Object.keys(newObj).filter(
    (key) =>
      newObj[key] !== null &&
      !Array.isArray(newObj[key]) &&
      typeof newObj[key] === 'object'
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

  if (result?.length === 0 || !displayNameEnabled) {
    result = buildPersonFullname(
      option.person_data.person_lastname.value,
      option.person_data.person_firstname.value,
      fullnameOption,
      option.person_data.person_middlename?.value
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
      fullnameOption,
      speaker.speaker_data.person_middlename?.value
    );
  }

  return result;
};

// visiting speakers are not synced to users without access to the speakers
// catalog: they can only rely on the values stored when publishing
export const speakerGetDetails = ({
  assigned,
  speakers,
  congregations,
  displayNameEnabled,
  fullnameOption,
}: {
  assigned: AssignmentCongregation;
  speakers: VisitingSpeakerType[];
  congregations: SpeakersCongregationsType[];
  displayNameEnabled: boolean;
  fullnameOption: FullnameOption;
}) => {
  const result = { name: '', cong_name: '' };

  if (!assigned?.value?.length) return result;

  result.name = assigned.name ?? '';
  result.cong_name = assigned.cong_name ?? '';

  const speaker = speakers.find(
    (record) => record.person_uid === assigned.value
  );

  if (!speaker) return result;

  const name = speakerGetDisplayName(
    speaker,
    displayNameEnabled,
    fullnameOption
  );

  if (name?.length > 0) {
    result.name = name;
  }

  const congregation = congregations.find(
    (record) => record.id === speaker.speaker_data.cong_id
  );

  const congName = congregation?.cong_data.cong_name.value ?? '';

  if (congName.length > 0) {
    result.cong_name = congName;
  }

  return result;
};

export const schedulesStampVisitingSpeakers = ({
  schedules,
  speakers,
  congregations,
  displayNameEnabled,
  fullnameOption,
  published = [],
}: {
  schedules: SchedWeekType[];
  speakers: VisitingSpeakerType[];
  congregations: SpeakersCongregationsType[];
  displayNameEnabled: boolean;
  fullnameOption: FullnameOption;
  published?: SchedWeekType[];
}) => {
  for (const schedule of schedules) {
    if (!schedule.weekend_meeting) continue;

    const lastPublished = published.find(
      (record) => record.weekOf === schedule.weekOf
    );

    for (const assigned of schedule.weekend_meeting.speaker.part_1) {
      const talkType = schedule.weekend_meeting.public_talk_type.find(
        (record) => record.type === assigned.type
      )?.value;

      if (talkType !== 'visitingSpeaker') continue;

      // the merge with the remote schedules resets the stored values: the last
      // publish is the fallback when the speaker cannot be resolved locally
      const previous = lastPublished?.weekend_meeting?.speaker.part_1.find(
        (record) =>
          record.type === assigned.type && record.value === assigned.value
      );

      const { name, cong_name } = speakerGetDetails({
        assigned: {
          ...assigned,
          name: assigned.name || previous?.name || '',
          cong_name: assigned.cong_name || previous?.cong_name || '',
        },
        speakers,
        congregations,
        displayNameEnabled,
        fullnameOption,
      });

      assigned.name = name;
      assigned.cong_name = cong_name;
    }
  }

  return schedules;
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

export const getCSSPropertyValue = (key: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(key)
    .trim();
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
