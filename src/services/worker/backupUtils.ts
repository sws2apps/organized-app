// to minimize the size of the worker file, we recreate all its needed functions in this file

import appDb from '@db/appDb';
import { BackupDataType } from './backupType';
import { decryptData, encryptData, generateKey } from '@services/encryption';
import { PersonType } from '@definition/person';
import {
  OutgoingTalkExportScheduleType,
  OutgoingTalkScheduleType,
  SchedWeekType,
} from '@definition/schedules';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { decryptObject, encryptObject } from './backupEncryption';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';

const personIsElder = (person: PersonType) => {
  const hasActive = person?.person_data.privileges.find(
    (record) =>
      record.privilege === 'elder' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

const personIsMS = (person: PersonType) => {
  const hasActive = person?.person_data.privileges.find(
    (record) =>
      record.privilege === 'ms' &&
      record.end_date === null &&
      record._deleted === false
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

export const dbGetSettings = async () => {
  const settings = await appDb.app_settings.get(1);
  return settings;
};

const dbGetTableData = async () => {
  const settings = await dbGetSettings();
  const persons = await appDb.persons.toArray();
  const visiting_speakers = await appDb.visiting_speakers.toArray();
  const speakers_congregations = await appDb.speakers_congregations.toArray();
  const user_bible_studies = await appDb.user_bible_studies.toArray();
  const user_field_service_reports =
    await appDb.user_field_service_reports.toArray();

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
    user_bible_studies,
    user_field_service_reports,
  };
};

const dbInsertOutgoingTalks = async (
  talks: OutgoingTalkExportScheduleType[]
) => {
  // get all records with synced data
  const schedules = await appDb.sched.toArray();
  const syncedSchedules = schedules.filter((record) =>
    record.weekend_meeting.outgoing_talks.some((talk) => talk.synced)
  );

  const schedulesToUpdate: SchedWeekType[] = [];

  // remove deleted schedules
  for (const schedule of syncedSchedules) {
    const isValid = talks.find((record) => record.weekOf === schedule.weekOf);

    if (!isValid) {
      schedule.weekend_meeting.outgoing_talks =
        schedule.weekend_meeting.outgoing_talks.filter(
          (record) => !record.synced
        );
      schedulesToUpdate.push(schedule);
    }
  }

  // add or update schedule
  for await (const talk of talks) {
    const dbSchedule = await appDb.sched.get(talk.weekOf);

    if (dbSchedule) {
      const tmpSched = talk;

      delete tmpSched.recipient;
      delete tmpSched.sender;
      delete tmpSched.weekOf;

      const addSched = tmpSched as OutgoingTalkScheduleType;

      const schedule = structuredClone(dbSchedule);

      const localSched = schedule.weekend_meeting.outgoing_talks.find(
        (record) => record.id === talk.id
      );

      if (!localSched) {
        schedule.weekend_meeting.outgoing_talks.push(addSched);
      }

      if (localSched) {
        schedule.weekend_meeting.outgoing_talks =
          schedule.weekend_meeting.outgoing_talks.filter(
            (record) => record.id !== talk.id
          );

        schedule.weekend_meeting.outgoing_talks.push(addSched);
      }

      schedulesToUpdate.push(schedule);
    }
  }

  // save to db
  if (schedulesToUpdate.length > 0) {
    await appDb.sched.bulkPut(schedulesToUpdate);
  }
};

const dbRestoreFromBackup = async (
  backupData: BackupDataType,
  accessCode: string,
  masterKey?: string
) => {
  if (backupData.app_settings) {
    const remoteSettings = backupData.app_settings as SettingsType;

    delete remoteSettings.cong_settings.cong_master_key;
    delete remoteSettings.cong_settings.cong_access_code;
    delete remoteSettings.cong_settings['last_backup'];

    decryptObject({
      data: remoteSettings,
      table: 'app_settings',
      accessCode,
      masterKey,
    });

    const settings = await appDb.app_settings.get(1);

    const localSettings = structuredClone(settings);

    syncFromRemote(localSettings, remoteSettings);

    await appDb.app_settings.update(1, localSettings);
  }

  if (backupData.persons) {
    const remotePersons = (backupData.persons as object[]).map(
      (person: PersonType) => {
        decryptObject({
          data: person,
          table: 'persons',
          accessCode,
          masterKey,
        });

        return person;
      }
    );

    const persons = await appDb.persons.toArray();

    const personToUpdate: PersonType[] = [];

    for (const remotePerson of remotePersons) {
      const localPerson = persons.find(
        (record) => record.person_uid === remotePerson.person_uid
      );

      if (!localPerson) {
        personToUpdate.push(remotePerson);
      }

      if (localPerson) {
        const newPerson = structuredClone(localPerson);
        syncFromRemote(newPerson, remotePerson);

        personToUpdate.push(newPerson);
      }
    }

    if (personToUpdate.length > 0) {
      await appDb.persons.bulkPut(personToUpdate);
    }
  }

  if (backupData.speakers_congregations) {
    const remoteCongregations = (
      backupData.speakers_congregations as object[]
    ).map((congregation: SpeakersCongregationsType) => {
      decryptObject({
        data: congregation,
        table: 'speakers_congregations',
        accessCode,
        masterKey,
      });

      return congregation;
    });

    const congregations = await appDb.speakers_congregations.toArray();

    const congsToUpdate: SpeakersCongregationsType[] = [];

    for (const remoteCongregation of remoteCongregations) {
      const localCongregation = congregations.find(
        (record) => record.id === remoteCongregation.id
      );

      if (!localCongregation) {
        congsToUpdate.push(remoteCongregation);
      }

      if (localCongregation) {
        const newCongregation = structuredClone(localCongregation);
        syncFromRemote(newCongregation, remoteCongregation);

        congsToUpdate.push(newCongregation);
      }
    }

    if (congsToUpdate.length > 0) {
      await appDb.speakers_congregations.bulkPut(congsToUpdate);
    }
  }

  if (backupData.visiting_speakers) {
    const remoteSpeakers = (backupData.visiting_speakers as object[]).map(
      (speaker: VisitingSpeakerType) => {
        decryptObject({
          data: speaker,
          table: 'visiting_speakers',
          accessCode,
          masterKey,
        });

        return speaker;
      }
    );

    const speakers = await appDb.visiting_speakers.toArray();

    const speakersToUpdate: VisitingSpeakerType[] = [];

    for await (const remoteSpeaker of remoteSpeakers) {
      const localSpeaker = speakers.find(
        (record) => record.person_uid === remoteSpeaker.person_uid
      );

      if (!localSpeaker) {
        speakersToUpdate.push(remoteSpeaker);
      }

      if (localSpeaker) {
        const newSpeaker = structuredClone(localSpeaker);
        syncFromRemote(newSpeaker, remoteSpeaker);

        speakersToUpdate.push(newSpeaker);
      }
    }

    if (speakersToUpdate.length > 0) {
      await appDb.visiting_speakers.bulkPut(speakersToUpdate);
    }
  }

  if (backupData.outgoing_talks) {
    await dbInsertOutgoingTalks(backupData.outgoing_talks);
  }

  if (backupData.public_schedules) {
    await appDb.sched.clear();
    const data = backupData.public_schedules as SchedWeekType[];
    await appDb.sched.bulkPut(data);
  }

  if (backupData.public_sources) {
    await appDb.sources.clear();
    const data = backupData.public_sources as SourceWeekType[];
    await appDb.sources.bulkPut(data);
  }
};

export const dbExportDataBackup = async (backupData: BackupDataType) => {
  const obj: BackupDataType = {};

  const oldData = await dbGetTableData();

  const userRole = oldData.settings.user_settings.cong_role;
  const dataSync = oldData.settings.cong_settings.data_sync.value;
  const accountType = oldData.settings.user_settings.account_type;

  const cong_access_code =
    await oldData.settings.cong_settings.cong_access_code;
  const cong_master_key = await oldData.settings.cong_settings.cong_master_key;

  const accessCode = decryptData(
    backupData.app_settings.cong_settings['cong_access_code'],
    cong_access_code
  );

  let masterKey: string;

  if (backupData.app_settings.cong_settings['cong_master_key']) {
    masterKey = decryptData(
      backupData.app_settings.cong_settings['cong_master_key'],
      cong_master_key
    );
  }

  await dbRestoreFromBackup(backupData, accessCode, masterKey);

  const {
    persons,
    settings,
    outgoing_speakers,
    speakers_congregations,
    visiting_speakers,
    user_bible_studies,
    user_field_service_reports,
  } = await dbGetTableData();

  const adminRole = userRole.includes('admin');

  const settingEditor = adminRole;

  const personEditor =
    adminRole ||
    userRole.some(
      (role) =>
        role === 'midweek_schedule' ||
        role === 'weekend_schedule' ||
        role === 'public_talk_schedule'
    );

  const publicTalkEditor =
    adminRole || userRole.some((role) => role === 'public_talk_schedule');

  const isPublisher = userRole.includes('publisher');

  const { user_settings, cong_settings } = settings;

  const userBaseSettings = {
    firstname: user_settings.firstname,
    lastname: user_settings.lastname,
  };

  const myPerson = persons.find(
    (record) => record.person_uid === user_settings.user_local_uid
  );

  if (dataSync) {
    if (accountType === 'vip') {
      obj.app_settings = {
        user_settings: userBaseSettings,
      };

      if (settingEditor) {
        const localSettings = structuredClone(settings);

        encryptObject({
          data: localSettings,
          table: 'app_settings',
          masterKey,
          accessCode,
        });

        obj.app_settings = {
          user_settings: localSettings.user_settings,
          cong_settings: localSettings.cong_settings,
        };
      }

      // include person data
      if (personEditor) {
        const backupPersons = persons.map((person) => {
          encryptObject({
            data: person,
            table: 'persons',
            masterKey,
            accessCode,
          });

          return person;
        });

        obj.persons = backupPersons;
      }

      // include visiting speakers info
      if (publicTalkEditor) {
        const congregations = speakers_congregations.map((congregation) => {
          encryptObject({
            data: congregation,
            table: 'speakers_congregations',
            masterKey,
            accessCode,
          });

          return congregation;
        });

        obj.speakers_congregations = congregations;

        const speakers = visiting_speakers.map((speaker) => {
          encryptObject({
            data: speaker,
            table: 'visiting_speakers',
            masterKey,
            accessCode,
          });

          return speaker;
        });

        obj.visiting_speakers = speakers;

        const speakersKey =
          backupData.speakers_key?.length > 0
            ? decryptData(backupData.speakers_key, masterKey)
            : generateKey();

        const outgoing = outgoing_speakers.map((speaker) => {
          encryptObject({
            data: speaker,
            table: 'visiting_speakers',
            accessCode: speakersKey,
          });

          return speaker;
        });

        obj.outgoing_speakers = outgoing;

        if (backupData.speakers_key === '') {
          obj.speakers_key = encryptData(speakersKey, masterKey);
        }
      }

      // include self data if not person editor
      if (!personEditor && isPublisher) {
        const person = {
          person_uid: myPerson.person_uid,
          person_data: {
            timeAway:
              myPerson.person_data.timeAway?.filter(
                (record) => !record._deleted
              ) || [],
            emergency_contacts: myPerson.person_data.emergency_contacts.filter(
              (record) => !record._deleted
            ),
          },
        };

        encryptObject({
          data: person,
          table: 'persons',
          masterKey,
          accessCode,
        });

        obj.persons = [person];
      }
    }

    if (accountType === 'pocket') {
      const userSettings = {
        ...userBaseSettings,
        backup_automatic: settings.user_settings.backup_automatic,
        theme_follow_os_enabled: settings.user_settings.theme_follow_os_enabled,
        hour_credits_enabled: settings.user_settings.hour_credits_enabled,
      };

      encryptObject({
        data: userSettings,
        table: 'app_settings',
        accessCode,
      });

      obj.app_settings = { user_settings: userSettings };

      const person = {
        person_uid: myPerson.person_uid,
        person_data: {
          timeAway: myPerson.person_data.timeAway.filter(
            (record) => !record._deleted
          ),
          emergency_contacts: myPerson.person_data.emergency_contacts.filter(
            (record) => !record._deleted
          ),
        },
      };

      encryptObject({
        data: person,
        table: 'persons',
        masterKey,
        accessCode,
      });

      obj.persons = [person];
    }

    if (isPublisher) {
      const backupBibleStudies = user_bible_studies.map((study) => {
        encryptObject({
          data: study,
          table: 'user_bible_studies',
          accessCode,
        });

        return study;
      });

      obj.user_bible_studies = backupBibleStudies;

      const backupReports = user_field_service_reports.map((report) => {
        encryptObject({
          data: report,
          table: 'user_field_service_reports',
          accessCode,
        });

        return report;
      });

      obj.user_field_service_reports = backupReports;
    }
  }

  if (!dataSync) {
    if (accountType === 'vip') {
      obj.app_settings = {
        user_settings: userBaseSettings,
      };

      if (settingEditor) {
        const midweek = cong_settings.midweek_meeting.map((record) => {
          return {
            type: record.type,
            weekday: record.weekday,
            time: record.time,
          };
        });

        const weekend = cong_settings.weekend_meeting.map((record) => {
          return {
            type: record.type,
            weekday: record.weekday,
            time: record.time,
          };
        });

        obj.app_settings.user_settings = {
          ...userBaseSettings,
          cong_role: user_settings.cong_role,
          account_type: user_settings.account_type,
          user_local_uid: user_settings.user_local_uid,
        };

        obj.app_settings.cong_settings = {
          cong_circuit: cong_settings.cong_circuit,
          cong_discoverable: cong_settings.cong_discoverable,
          cong_location: cong_settings.cong_location,
          cong_name: cong_settings.cong_name,
          cong_new: cong_settings.cong_new,
          cong_number: cong_settings.cong_number,
          country_code: cong_settings.country_code,
          data_sync: cong_settings.data_sync,
          midweek_meeting: midweek,
          weekend_meeting: weekend,
        };
      }
    }

    if (accountType === 'pocket') {
      obj.app_settings = { user_settings: userBaseSettings };
    }
  }

  return obj;
};
