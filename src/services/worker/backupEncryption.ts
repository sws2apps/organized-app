import { PersonType } from '@definition/person';
import {
  PersonBackupType,
  SpeakersCongregationBackupType,
  VisitingSpeakerBackupType,
} from './backupType';
import { decryptData, encryptData } from '@services/encryption';
import { TABLE_ENCRYPTION_MAP } from '@constants/table_encryption_map';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export const encryptPersonsData = (
  persons: PersonType[],
  accessCode,
  masterKey
) => {
  const result = persons.map((person) => {
    const obj = {} as PersonBackupType;

    obj.person_uid = person.person_uid;
    obj._deleted = encryptData(JSON.stringify(person._deleted), accessCode);
    obj.person_data = {} as PersonBackupType['person_data'];

    for (const [key, value] of Object.entries(person.person_data)) {
      const type: string = TABLE_ENCRYPTION_MAP.persons[key];
      const passphrase = type === 'shared' ? accessCode : masterKey;

      obj.person_data[key] = encryptData(JSON.stringify(value), passphrase);
    }

    return obj;
  });

  return result;
};

export const decryptPersonsData = (
  persons: PersonBackupType[],
  accessCode,
  masterKey
) => {
  const result = persons.map((person) => {
    const obj = {} as PersonType;

    obj.person_uid = person.person_uid;
    obj._deleted = JSON.parse(decryptData(person._deleted, accessCode));
    obj.person_data = {} as PersonType['person_data'];

    for (const [key, value] of Object.entries(person.person_data)) {
      const type: string = TABLE_ENCRYPTION_MAP.persons[key];
      const passphrase = type === 'shared' ? accessCode : masterKey;

      obj.person_data[key] = JSON.parse(decryptData(value, passphrase));
    }

    return obj;
  });

  return result;
};

export const encryptSpeakersCongregations = (
  speakers_congregations: SpeakersCongregationsType[],
  masterKey
) => {
  const result = speakers_congregations.map((congregation) => {
    const obj = {} as SpeakersCongregationBackupType;

    obj.id = encryptData(congregation.id, masterKey);
    obj._deleted = encryptData(
      JSON.stringify(congregation._deleted),
      masterKey
    );

    obj.cong_data = {} as SpeakersCongregationBackupType['cong_data'];

    for (const [key, value] of Object.entries(congregation.cong_data)) {
      obj.cong_data[key] = encryptData(JSON.stringify(value), masterKey);
    }

    return obj;
  });

  return result;
};

export const decryptSpeakersCongregations = (
  speakers_congregations: SpeakersCongregationBackupType[],
  masterKey
) => {
  const result = speakers_congregations.map((congregation) => {
    const obj = {} as SpeakersCongregationsType;

    obj.id = decryptData(congregation.id, masterKey);
    obj._deleted = JSON.parse(decryptData(congregation._deleted, masterKey));
    obj.cong_data = {} as SpeakersCongregationsType['cong_data'];

    for (const [key, value] of Object.entries(congregation.cong_data)) {
      obj.cong_data[key] = JSON.parse(decryptData(value, masterKey));
    }

    return obj;
  });

  return result;
};

export const encryptVisitingSpeakers = (
  visiting_speakers: VisitingSpeakerType[],
  masterKey
) => {
  const result = visiting_speakers.map((speaker) => {
    const obj = {} as VisitingSpeakerBackupType;

    obj.person_uid = encryptData(speaker.person_uid, masterKey);
    obj._deleted = encryptData(JSON.stringify(speaker._deleted), masterKey);

    obj.speaker_data = {} as VisitingSpeakerBackupType['speaker_data'];

    for (const [key, value] of Object.entries(speaker.speaker_data)) {
      obj.speaker_data[key] = encryptData(JSON.stringify(value), masterKey);
    }

    return obj;
  });

  return result;
};

export const decryptVisitingSpeakers = (
  visiting_speakers: VisitingSpeakerBackupType[],
  masterKey
) => {
  const result = visiting_speakers.map((speaker) => {
    const obj = {} as VisitingSpeakerType;

    obj.person_uid = decryptData(speaker.person_uid, masterKey);
    obj._deleted = JSON.parse(decryptData(speaker._deleted, masterKey));

    obj.speaker_data = {} as VisitingSpeakerType['speaker_data'];

    for (const [key, value] of Object.entries(speaker.speaker_data)) {
      obj.speaker_data[key] = JSON.parse(decryptData(value, masterKey));
    }

    return obj;
  });

  return result;
};
