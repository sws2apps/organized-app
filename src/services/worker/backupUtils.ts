// to minimize the size of the worker file, we recreate all its needed functions in this file

import appDb from '@db/appDb';
import { BackupDataType } from './backupType';
import { decryptData, encryptData, generateKey } from '@services/encryption';
import {
  decryptPersonsData,
  decryptSpeakersCongregations,
  decryptVisitingSpeakers,
  encryptPersonsData,
  encryptSpeakersCongregations,
  encryptVisitingSpeakers,
} from './backupEncryption';
import { PersonType } from '@definition/person';

const personIsElder = (person: PersonType) => {
  const hasActive = person?.person_data.privileges.find(
    (record) =>
      record.privilege.value === 'elder' &&
      record.end_date.value === null &&
      record._deleted.value === false
  );

  return hasActive ? true : false;
};

const personIsMS = (person: PersonType) => {
  const hasActive = person?.person_data.privileges.find(
    (record) =>
      record.privilege.value === 'ms' &&
      record.end_date.value === null &&
      record._deleted.value === false
  );

  return hasActive ? true : false;
};

const syncFromRemote = <T extends object>(local: T, remote: T): T => {
  const objectKeys = Object.keys(remote).filter(
    (key) => remote[key] !== null && typeof remote[key] === 'object'
  );

  for (const key of objectKeys) {
    if (local[key]) {
      if (!('updatedAt' in remote[key])) {
        syncFromRemote(local[key], remote[key]);
      } else {
        if (remote[key].updatedAt > local[key].updatedAt) {
          local[key] = remote[key];
        }
      }
    } else {
      local[key] = remote[key];
    }
  }

  const primitiveKeys = Object.keys(remote).filter(
    (key) => typeof remote[key] !== 'object'
  );
  for (const key of primitiveKeys) {
    local[key] = remote[key];
  }

  return local;
};

const dbGetTableData = async () => {
  const settings = await appDb.app_settings.get(1);
  const persons = await appDb.persons.toArray();
  const visiting_speakers = await appDb.visiting_speakers.toArray();
  const speakers_congregations = await appDb.speakers_congregations.toArray();

  const congId = speakers_congregations.find(
    (record) =>
      record.cong_data.cong_number.value === settings.cong_settings.cong_number
  )?.id;

  const outgoing_speakers = visiting_speakers
    .filter((record) => record.speaker_data.cong_id === congId)
    .map((speaker) => {
      const person = persons.find(
        (record) => record.person_uid === speaker.person_uid
      );

      return {
        person_uid: speaker.person_uid,
        _deleted: speaker._deleted,
        speaker_data: {
          ...speaker.speaker_data,
          elder: { value: personIsElder(person), updatedAt: '' },
          ministerial_servant: { value: personIsMS(person), updatedAt: '' },
          person_display_name: person?.person_data.person_display_name,
          person_firstname: person?.person_data.person_firstname,
          person_lastname: person?.person_data.person_lastname,
          person_email: person?.person_data.email,
          person_phone: person?.person_data.phone,
        },
      };
    });

  return {
    settings,
    persons,
    outgoing_speakers,
    speakers_congregations,
    visiting_speakers,
  };
};

const dbRestoreFromBackup = async (
  backupData: BackupDataType,
  accessCode: string,
  masterKey?: string
) => {
  if (backupData.cong_settings) {
    const settings = await appDb.app_settings.get(1);

    if (backupData.cong_settings.cong_discoverable) {
      if (
        backupData.cong_settings.cong_discoverable.updatedAt >
        settings.cong_settings.cong_discoverable.updatedAt
      ) {
        await appDb.app_settings.update(1, {
          'cong_settings.cong_discoverable':
            backupData.cong_settings.cong_discoverable,
        });
      }
    }
  }

  if (backupData.cong_persons) {
    const persons = await appDb.persons.toArray();

    const remotePersons = decryptPersonsData(
      backupData.cong_persons,
      accessCode,
      masterKey
    );

    for await (const remotePerson of remotePersons) {
      const localPerson = persons.find(
        (record) => record.person_uid === remotePerson.person_uid
      );
      if (!localPerson) {
        await appDb.persons.put(remotePerson);
      }

      if (localPerson) {
        const newPerson = structuredClone(localPerson);
        syncFromRemote(newPerson, remotePerson);

        await appDb.persons.put(newPerson);
      }
    }
  }

  if (backupData.speakers_congregations) {
    const congregations = await appDb.speakers_congregations.toArray();
    const remoteCongregations = decryptSpeakersCongregations(
      backupData.speakers_congregations,
      masterKey
    );

    for await (const remoteCongregation of remoteCongregations) {
      const localCongregation = congregations.find(
        (record) => record.id === remoteCongregation.id
      );
      if (!localCongregation) {
        await appDb.speakers_congregations.put(remoteCongregation);
      }

      if (localCongregation) {
        const newCongregation = structuredClone(localCongregation);
        syncFromRemote(newCongregation, remoteCongregation);

        await appDb.speakers_congregations.put(newCongregation);
      }
    }
  }

  if (backupData.visiting_speakers) {
    const speakers = await appDb.visiting_speakers.toArray();
    const remoteSpeakers = decryptVisitingSpeakers(
      backupData.visiting_speakers,
      masterKey
    );

    for await (const remoteSpeaker of remoteSpeakers) {
      const localSpeaker = speakers.find(
        (record) => record.person_uid === remoteSpeaker.person_uid
      );
      if (!localSpeaker) {
        await appDb.visiting_speakers.put(remoteSpeaker);
      }

      if (localSpeaker) {
        const newSpeaker = structuredClone(localSpeaker);
        syncFromRemote(newSpeaker, remoteSpeaker);

        await appDb.visiting_speakers.put(newSpeaker);
      }
    }
  }
};

export const dbExportDataBackup = async (
  userRole: string[],
  backupData: BackupDataType
) => {
  const obj: BackupDataType = {};

  const oldData = await dbGetTableData();
  const cong_access_code =
    await oldData.settings.cong_settings.cong_access_code;
  const cong_master_key = await oldData.settings.cong_settings.cong_master_key;

  const accessCode = decryptData(backupData.cong_access_code, cong_access_code);
  const masterKey = backupData.cong_master_key
    ? decryptData(backupData.cong_master_key, cong_master_key)
    : undefined;

  await dbRestoreFromBackup(backupData, accessCode, masterKey);

  const {
    persons,
    settings,
    outgoing_speakers,
    speakers_congregations,
    visiting_speakers,
  } = await dbGetTableData();

  const adminRole = userRole.includes('admin');

  const settingEditor = adminRole;
  const personEditor = adminRole;
  const publicTalkEditor = adminRole;

  // include cong_discoverable setting
  if (settingEditor) {
    obj.cong_settings = {
      cong_discoverable: settings.cong_settings.cong_discoverable,
    };
  }

  // include person data
  if (personEditor) {
    obj.cong_persons = encryptPersonsData(persons, accessCode, masterKey);
  }

  // include visiting speakers info
  if (publicTalkEditor) {
    obj.speakers_congregations = encryptSpeakersCongregations(
      speakers_congregations,
      masterKey
    );
    obj.visiting_speakers = encryptVisitingSpeakers(
      visiting_speakers,
      masterKey
    );

    const speakersKey =
      backupData.speakers_key === ''
        ? generateKey()
        : decryptData(backupData.speakers_key, masterKey);

    obj.outgoing_speakers = encryptVisitingSpeakers(
      outgoing_speakers,
      speakersKey
    );

    if (backupData.speakers_key === '') {
      obj.speakers_key = encryptData(speakersKey, masterKey);
    }
  }

  return obj;
};
