// to minimize the size of the worker file, we recreate all its needed functions in this file

import appDb from '@db/appDb';
import { BackupDataType, CongUserType } from './backupType';
import {
  decryptData,
  decryptObject,
  encryptData,
  encryptObject,
  generateKey,
} from '@services/encryption';
import { PersonType, PrivilegeType } from '@definition/person';
import {
  OutgoingTalkExportScheduleType,
  OutgoingTalkScheduleType,
  SchedWeekType,
} from '@definition/schedules';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { SettingsType } from '@definition/settings';
import { SourceWeekType } from '@definition/sources';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { BranchFieldServiceReportType } from '@definition/branch_field_service_reports';
import { BranchCongAnalysisType } from '@definition/branch_cong_analysis';
import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { MetadataRecordType } from '@definition/metadata';
import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';
import { UpcomingEventType } from '@definition/upcoming_events';
import { formatDate } from '@utils/date';
import { APP_READ_ONLY_ROLES } from '@constants/index';

const personIsElder = (person: PersonType) => {
  const hasActive = person?.person_data.privileges?.find(
    (record) =>
      record.privilege === 'elder' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

const personIsMS = (person: PersonType) => {
  const hasActive = person?.person_data.privileges?.find(
    (record) =>
      record.privilege === 'ms' &&
      record.end_date === null &&
      record._deleted === false
  );

  return hasActive ? true : false;
};

const personIsBaptizedPublisher = (person: PersonType, month?: string) => {
  // default month to current month if undefined
  if (!month) {
    month = formatDate(new Date(), 'yyyy/MM');
  }

  const isValid = person.person_data.publisher_baptized.history.some(
    (record) => {
      if (record._deleted) return false;
      if (!record.start_date) return false;

      const startDate = new Date(record.start_date);
      const endDate = record.end_date
        ? new Date(record.end_date)
        : new Date(`${month}/01`);

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    }
  );

  return isValid;
};

const personIsUnbaptizedPublisher = (person: PersonType, month?: string) => {
  // default month to current month if undefined
  if (!month) {
    month = formatDate(new Date(), 'yyyy/MM');
  }

  const isValid = person.person_data.publisher_unbaptized.history.some(
    (record) => {
      if (record._deleted) return false;
      if (!record.start_date) return false;

      const startDate = new Date(record.start_date);
      const endDate = record.end_date
        ? new Date(record.end_date)
        : new Date(`${month}/01`);

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    }
  );

  return isValid;
};

const personIsPrivilegeActive = (
  person: PersonType,
  privilege: PrivilegeType,
  month?: string
) => {
  if (!month) {
    const isActive = person.person_data.privileges.some(
      (record) =>
        record.privilege === privilege &&
        record.end_date === null &&
        record._deleted === false
    );

    return isActive;
  }

  const history = person.person_data.privileges.filter(
    (record) =>
      record._deleted === false &&
      record.privilege === privilege &&
      record.start_date?.length > 0
  );

  const isActive = history.some((record) => {
    const startDate = new Date(record.start_date);
    const endDate = record.end_date
      ? new Date(record.end_date)
      : new Date(`${month}/01`);

    const startMonth = formatDate(startDate, 'yyyy/MM');
    const endMonth = formatDate(endDate, 'yyyy/MM');

    return month >= startMonth && month <= endMonth;
  });

  return isActive;
};

const syncFromRemote = <T extends object>(local: T, remote: T): T => {
  const arrayKeys = Object.keys(remote).filter(
    (key) => remote[key] !== null && Array.isArray(remote[key])
  );

  const lockKeys = ['type', 'id', 'talk_number'];

  for (const key of arrayKeys) {
    if (!local[key]) {
      local[key] = remote[key];
      continue;
    }

    if (!Array.isArray(local[key])) {
      local[key] = remote[key];
      continue;
    }

    for (const remoteValue of remote[key]) {
      if (typeof remoteValue !== 'object') {
        continue;
      }

      for (const lockKey of lockKeys) {
        if (lockKey in remoteValue) {
          const localValue = local[key].find(
            (r) => r[lockKey] === remoteValue[lockKey]
          );

          if (!localValue) {
            local[key].push(remoteValue);
          } else {
            if ('updatedAt' in localValue) {
              if (remoteValue.updatedAt > localValue.updatedAt) {
                Object.assign(localValue, remoteValue);
              }
            }

            if (!('updatedAt' in localValue)) {
              syncFromRemote(localValue, remoteValue);
            }
          }

          break;
        }
      }
    }
  }

  const objectKeys = Object.keys(remote).filter(
    (key) =>
      remote[key] !== null &&
      !Array.isArray(remote[key]) &&
      typeof remote[key] === 'object'
  );

  for (const key of objectKeys) {
    if (local[key]) {
      if ('updatedAt' in remote[key]) {
        if (remote[key].updatedAt > local[key].updatedAt) {
          local[key] = remote[key];
        }
      } else {
        syncFromRemote(local[key], remote[key]);
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

export const isMondayDate = (date: string) => {
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay();

  return dayOfWeek === 1;
};

export const dbGetMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return {};

  const result = {} as Record<string, string>;

  for (const [key, value] of Object.entries(metadata.metadata)) {
    result[key] = value.version;
  }

  const settings = await dbGetSettings();
  const accountType = settings.user_settings.account_type;
  const userRole = settings.user_settings.cong_role;

  const isSecretary = userRole.includes('secretary');
  const isCoordinator = userRole.includes('coordinator');
  const isAdmin = userRole.includes('admin') || isSecretary || isCoordinator;
  const isPublisher = isAdmin || userRole.includes('publisher');
  const isGroupOverseer = isAdmin || userRole.includes('group_overseers');
  const isLanguageGroupOverseer =
    isAdmin || userRole.includes('language_group_overseers');
  const isElder =
    accountType === 'vip' && (isAdmin || userRole.includes('elder'));
  const isScheduleEditor =
    isAdmin ||
    isGroupOverseer ||
    userRole.some(
      (role) =>
        role === 'midweek_schedule' ||
        role === 'weekend_schedule' ||
        role === 'public_talk_schedule'
    );

  const isPersonViewer = isScheduleEditor || isElder;
  const isPersonMinimal = !isPersonViewer;

  const isAttendanceTracker =
    isAdmin || userRole.some((role) => role === 'attendance_tracking');

  if (!isPublisher) {
    delete result.user_bible_studies;
    delete result.user_field_service_reports;
    delete result.delegated_field_service_reports;
    delete result.cong_field_service_reports;
  }

  if (!isElder) {
    delete result.speakers_congregations;
    delete result.visiting_speakers;
  }

  if (isPersonViewer) {
    delete result.public_sources;
    delete result.public_schedules;
  }

  if (isPersonMinimal) {
    delete result.sources;
    delete result.schedules;
  }

  if (!isAttendanceTracker && !isLanguageGroupOverseer) {
    delete result.meeting_attendance;
  }

  if (!isSecretary) {
    delete result.incoming_reports;
  }

  if (!isAdmin) {
    delete result.branch_cong_analysis;
    delete result.branch_field_service_reports;
  }

  return result;
};

const dbGetTableData = async () => {
  const settings = await dbGetSettings();
  const persons = await appDb.persons.toArray();
  const cong_field_service_reports =
    await appDb.cong_field_service_reports.toArray();
  const field_service_groups = await appDb.field_service_groups.toArray();
  const visiting_speakers = await appDb.visiting_speakers.toArray();
  const speakers_congregations = await appDb.speakers_congregations.toArray();
  const user_bible_studies = await appDb.user_bible_studies.toArray();
  const user_field_service_reports =
    await appDb.user_field_service_reports.toArray();
  const delegated_field_service_reports =
    await appDb.delegated_field_service_reports.toArray();
  const branch_cong_analysis = await appDb.branch_cong_analysis.toArray();
  const branch_field_service_reports =
    await appDb.branch_field_service_reports.toArray();
  const sched = await appDb.sched.toArray();
  const sources = await appDb.sources.toArray();
  const meeting_attendance = await appDb.meeting_attendance.toArray();
  const upcoming_events = await appDb.upcoming_events.toArray();
  const metadata = await appDb.metadata.get(1);

  const congId = speakers_congregations.find(
    (record) =>
      record.cong_data.cong_number.value === settings.cong_settings.cong_number
  )?.id;

  const outgoing_speakers = visiting_speakers
    .filter((record) => {
      const person = persons.find((p) => p.person_uid === record.person_uid);

      if (!person || !person.person_data.privileges) return false;

      return (
        record.speaker_data.cong_id === congId &&
        !record.speaker_data.local.value
      );
    })
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
          ms: { value: personIsMS(person), updatedAt: '' },
          person_display_name: person.person_data.person_display_name,
          person_firstname: person.person_data.person_firstname,
          person_lastname: person.person_data.person_lastname,
          person_email: person.person_data.email,
          person_phone: person.person_data.phone,
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
    cong_field_service_reports,
    field_service_groups,
    branch_cong_analysis,
    branch_field_service_reports,
    sched,
    sources,
    meeting_attendance,
    metadata,
    delegated_field_service_reports,
    upcoming_events,
  };
};

const dbInsertOutgoingTalks = async (
  talks: OutgoingTalkExportScheduleType[]
) => {
  if (!Array.isArray(talks)) return;

  try {
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
  } catch (error) {
    throw new Error(`outgoing_talks: ${error}`);
  }
};

const convertObjectToArray = (settings: SettingsType) => {
  if (
    settings?.cong_settings?.display_name_enabled &&
    !Array.isArray(settings.cong_settings.display_name_enabled)
  ) {
    const dateA =
      settings.cong_settings.display_name_enabled['meetings']['updatedAt'];

    const dateB =
      settings.cong_settings.display_name_enabled['others']['updatedAt'];

    const meetings =
      settings.cong_settings.display_name_enabled['meetings']['value'];

    const others =
      settings.cong_settings.display_name_enabled['others']['value'];

    settings.cong_settings.display_name_enabled = [
      {
        type: 'main',
        _deleted: false,
        updatedAt: dateA > dateB ? dateA : dateB,
        meetings,
        others,
      },
    ];
  }

  if (
    settings?.cong_settings?.schedule_exact_date_enabled &&
    !Array.isArray(settings.cong_settings.schedule_exact_date_enabled)
  ) {
    const updatedAt =
      settings.cong_settings.schedule_exact_date_enabled['updatedAt'];

    const value = settings.cong_settings.schedule_exact_date_enabled['value'];

    settings.cong_settings.schedule_exact_date_enabled = [
      {
        type: 'main',
        _deleted: false,
        updatedAt,
        value,
      },
    ];
  }

  if (
    settings?.cong_settings?.attendance_online_record &&
    !Array.isArray(settings.cong_settings.attendance_online_record)
  ) {
    const updatedAt =
      settings.cong_settings.attendance_online_record['updatedAt'];

    const value = settings.cong_settings.attendance_online_record['value'];

    settings.cong_settings.attendance_online_record = [
      {
        type: 'main',
        _deleted: false,
        updatedAt,
        value,
      },
    ];
  }

  if (typeof settings?.user_settings?.data_view === 'string') {
    settings.user_settings.data_view = {
      value: settings.user_settings.data_view,
      updatedAt: new Date().toISOString(),
    };
  }

  return settings;
};

const dbRestoreSettings = async (
  backupData: BackupDataType,
  accessCode: string,
  masterKey?: string
) => {
  try {
    if (!backupData.app_settings) return;

    const remoteSettings = backupData.app_settings as SettingsType;

    delete remoteSettings.cong_settings.cong_master_key;
    delete remoteSettings.cong_settings.cong_access_code;

    decryptObject({
      data: remoteSettings,
      table: 'app_settings',
      accessCode,
      masterKey,
    });

    const settings = await appDb.app_settings.get(1);

    const localSettings = structuredClone(settings);

    convertObjectToArray(remoteSettings);
    convertObjectToArray(localSettings);

    syncFromRemote(localSettings, remoteSettings);

    if (backupData.metadata.user_settings) {
      localSettings.user_settings.cong_role =
        remoteSettings.user_settings.cong_role;
      localSettings.user_settings.user_local_uid =
        remoteSettings.user_settings.user_local_uid;
      localSettings.user_settings.user_members_delegate =
        remoteSettings.user_settings.user_members_delegate;
    }

    if (
      backupData.metadata.cong_settings &&
      localSettings.user_settings.account_type === 'vip'
    ) {
      // force to use local value
      localSettings.cong_settings.cong_new = settings.cong_settings.cong_new;
      localSettings.cong_settings.cong_migrated =
        settings.cong_settings.cong_migrated ?? false;

      if (localSettings?.cong_settings['source_material_auto_import']) {
        delete localSettings.cong_settings['source_material_auto_import'];
      }

      const midweekSettings =
        localSettings?.cong_settings.midweek_meeting || [];

      for (const midweekSetting of midweekSettings) {
        if (midweekSetting['opening_prayer_auto_assigned']) {
          delete midweekSetting['opening_prayer_auto_assigned'];
        }

        if (midweekSetting['closing_prayer_auto_assigned']) {
          delete midweekSetting['closing_prayer_auto_assigned'];
        }
      }
    }

    if (
      backupData.metadata.cong_settings &&
      localSettings.user_settings.account_type === 'pocket'
    ) {
      for (const [key, value] of Object.entries(remoteSettings.cong_settings)) {
        localSettings.cong_settings[key] = value;
      }
    }

    if (!backupData.metadata.user_settings) {
      delete localSettings.user_settings;
    }

    if (!backupData.metadata.cong_settings) {
      delete localSettings.cong_settings;
    }

    await appDb.app_settings.update(1, localSettings);
  } catch (error) {
    throw new Error(`settings: ${error.message}`);
  }
};

const dbRestorePersons = async (
  backupData: BackupDataType,
  accessCode: string,
  masterKey?: string
) => {
  try {
    if (!backupData.persons) return;

    const remotePersons = (backupData.persons as object[]).map(
      (person: PersonType) => {
        decryptObject({
          data: person,
          table: 'persons',
          accessCode,
          masterKey,
        });

        // remove old key
        delete person.person_data.categories;

        // clean up keys
        if (
          person.person_data.family_members &&
          typeof person.person_data.family_members === 'string'
        ) {
          delete person.person_data.family_members;
        }

        return person;
      }
    );

    remotePersons.forEach((person) => {
      const assignments = person.person_data.assignments;

      if (assignments && assignments.length === 0) {
        person.person_data.assignments.push({
          type: 'main',
          updatedAt: '',
          values: [],
        });
      }

      if (
        assignments &&
        assignments.length > 0 &&
        'code' in assignments.at(0)
      ) {
        const codes: number[] = assignments
          .filter((a) => !a['_deleted'])
          .map((a) => a['code']);

        person.person_data.assignments.length = 0;
        person.person_data.assignments = [
          {
            type: 'main',
            updatedAt: new Date().toISOString(),
            values: codes.filter((code) => code !== undefined),
          },
        ];
      }

      if (assignments) {
        person.person_data.assignments = person.person_data.assignments.filter(
          (record) => 'code' in record === false
        );
      }
    });

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
  } catch (error) {
    throw new Error(`persons: ${error.message}`);
  }
};

const dbRestoreUpcomingEvents = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.upcoming_events) return;

    const remoteEvents = (
      backupData.upcoming_events as UpcomingEventType[]
    ).map((event: UpcomingEventType) => {
      decryptObject({
        data: event,
        table: 'upcoming_events',
        accessCode,
      });

      // clean up keys
      if (event.updatedAt) {
        event.event_data._deleted = event._deleted;
        event.event_data.updatedAt = event.updatedAt;

        delete event._deleted;
        delete event.updatedAt;
      }

      return event;
    });

    const events = await appDb.upcoming_events.toArray();

    const eventToUpdate: UpcomingEventType[] = [];

    for (const remoteEvent of remoteEvents) {
      const localEvent = events.find(
        (record) => record.event_uid === remoteEvent.event_uid
      );

      if (!localEvent) {
        eventToUpdate.push(remoteEvent);
      }

      if (localEvent) {
        const newEvent = structuredClone(localEvent);
        syncFromRemote(newEvent, remoteEvent);

        eventToUpdate.push(newEvent);
      }
    }

    if (eventToUpdate.length > 0) {
      await appDb.upcoming_events.bulkPut(eventToUpdate);
    }
  } catch (error) {
    throw new Error(`upcoming_events: ${error.message}`);
  }
};

const dbRestoreSpeakersCongregations = async (
  backupData: BackupDataType,
  accessCode: string,
  masterKey?: string
) => {
  try {
    if (!backupData.speakers_congregations) return;

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
  } catch (error) {
    throw new Error(`speakers_congregations: ${error.message}`);
  }
};

const dbRestoreVisitingSpeakers = async (
  backupData: BackupDataType,
  accessCode: string,
  masterKey?: string
) => {
  try {
    if (!backupData.visiting_speakers) return;

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
  } catch (error) {
    throw new Error(`visiting_speakers: ${error.message}`);
  }
};

const dbRestoreFieldGroups = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.field_service_groups) return;

    const remoteGroups = (backupData.field_service_groups as object[]).map(
      (group: FieldServiceGroupType) => {
        decryptObject({
          data: group,
          table: 'field_service_groups',
          accessCode,
        });

        return group;
      }
    );

    const groups = await appDb.field_service_groups.toArray();

    const groupsToUpdate: FieldServiceGroupType[] = [];

    for (const remoteGroup of remoteGroups) {
      const localGroup = groups.find(
        (record) => record.group_id === remoteGroup.group_id
      );

      if (!localGroup) {
        groupsToUpdate.push(remoteGroup);
      }

      if (localGroup) {
        const newGroup = structuredClone(localGroup);
        syncFromRemote(newGroup, remoteGroup);

        groupsToUpdate.push(newGroup);
      }
    }

    if (groupsToUpdate.length > 0) {
      await appDb.field_service_groups.bulkPut(groupsToUpdate);
    }
  } catch (error) {
    throw new Error(`field_service_groups: ${error.message}`);
  }
};

const dbRestoreUserStudies = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.user_bible_studies) return;

    const remoteData = (backupData.user_bible_studies as object[]).map(
      (data: UserBibleStudyType) => {
        decryptObject({
          data,
          table: 'user_bible_studies',
          accessCode,
        });

        return data;
      }
    );

    const localData = await appDb.user_bible_studies.toArray();

    const dataToUpdate: UserBibleStudyType[] = [];

    for (const remoteItem of remoteData) {
      const localItem = localData.find(
        (record) => record.person_uid === remoteItem.person_uid
      );

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);
        syncFromRemote(newItem, remoteItem);

        dataToUpdate.push(newItem);
      }
    }

    if (dataToUpdate.length > 0) {
      await appDb.user_bible_studies.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`user_bible_studies: ${error.message}`);
  }
};

const dbRestoreUserReports = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.user_field_service_reports) return;

    const remoteData = (
      backupData.user_field_service_reports as UserFieldServiceReportType[]
    ).map((data) => {
      decryptObject({
        data,
        table: 'user_field_service_reports',
        accessCode,
      });

      return data;
    });

    const localData = await appDb.user_field_service_reports.toArray();

    const dataToUpdate: UserFieldServiceReportType[] = [];

    for (const remoteItem of remoteData) {
      const localItem = localData.find(
        (record) => record.report_date === remoteItem.report_date
      );

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);
        syncFromRemote(newItem, remoteItem);

        dataToUpdate.push(newItem);
      }
    }

    if (dataToUpdate.length > 0) {
      await appDb.user_field_service_reports.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`user_field_service_reports: ${error.message}`);
  }
};

const dbRestoreCongReports = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.cong_field_service_reports) return;

    const settings = await appDb.app_settings.get(1);

    const userRole = settings.user_settings.cong_role;

    const secretaryRole = userRole.includes('secretary');
    const coordinatorRole = userRole.includes('coordinator');
    const adminRole =
      userRole.includes('admin') || secretaryRole || coordinatorRole;
    const publisherRole = userRole.includes('publisher');

    const allowRestore = adminRole || publisherRole;

    if (allowRestore) {
      const remoteData = (
        backupData.cong_field_service_reports as CongFieldServiceReportType[]
      ).map((data) => {
        decryptObject({
          data,
          table: 'cong_field_service_reports',
          accessCode,
        });

        return data;
      });

      const localData = await appDb.cong_field_service_reports.toArray();

      const dataToUpdate: CongFieldServiceReportType[] = [];

      for (const remoteItem of remoteData) {
        const localItem = localData.find(
          (record) => record.report_id === remoteItem.report_id
        );

        if (!localItem) {
          dataToUpdate.push(remoteItem);
        }

        if (localItem) {
          const newItem = structuredClone(localItem);
          syncFromRemote(newItem, remoteItem);

          dataToUpdate.push(newItem);
        }
      }

      if (dataToUpdate.length > 0) {
        await appDb.cong_field_service_reports.bulkPut(dataToUpdate);
      }
    }
  } catch (error) {
    throw new Error(`cong_field_service_reports: ${error.message}`);
  }
};

const dbRestoreBranchReports = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.branch_field_service_reports) return;

    const remoteData = (
      backupData.branch_field_service_reports as BranchFieldServiceReportType[]
    ).map((data) => {
      decryptObject({
        data,
        table: 'branch_field_service_reports',
        accessCode,
      });

      return data;
    });

    const localData = await appDb.branch_field_service_reports.toArray();

    const dataToUpdate: BranchFieldServiceReportType[] = [];

    for (const remoteItem of remoteData) {
      const localItem = localData.find(
        (record) => record.report_date === remoteItem.report_date
      );

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);
        syncFromRemote(newItem, remoteItem);

        dataToUpdate.push(newItem);
      }
    }

    if (dataToUpdate.length > 0) {
      await appDb.branch_field_service_reports.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`branch_field_service_reports: ${error.message}`);
  }
};

const dbRestoreBranchCongAnalysis = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.branch_cong_analysis) return;

    const remoteData = (
      backupData.branch_cong_analysis as BranchCongAnalysisType[]
    ).map((data) => {
      decryptObject({
        data,
        table: 'branch_cong_analysis',
        accessCode,
      });

      return data;
    });

    const localData = await appDb.branch_cong_analysis.toArray();

    const dataToUpdate: BranchCongAnalysisType[] = [];

    for (const remoteItem of remoteData) {
      const localItem = localData.find(
        (record) => record.report_date === remoteItem.report_date
      );

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);
        syncFromRemote(newItem, remoteItem);

        dataToUpdate.push(newItem);
      }
    }

    if (dataToUpdate.length > 0) {
      await appDb.branch_cong_analysis.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`branch_cong_analysis: ${error.message}`);
  }
};

const dbRestoreMeetingAttendance = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.meeting_attendance) return;

    const remoteData = (
      backupData.meeting_attendance as MeetingAttendanceType[]
    ).map((data) => {
      decryptObject({
        data,
        table: 'meeting_attendance',
        accessCode,
      });

      return data;
    });

    const localData = await appDb.meeting_attendance.toArray();

    const dataToUpdate: MeetingAttendanceType[] = [];

    for (const remoteItem of remoteData) {
      const localItem = localData.find(
        (record) => record.month_date === remoteItem.month_date
      );

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);
        syncFromRemote(newItem, remoteItem);

        dataToUpdate.push(newItem);
      }
    }

    if (dataToUpdate.length > 0) {
      await appDb.meeting_attendance.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`meeting_attendance: ${error.message}`);
  }
};

const dbRestoreSources = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.sources) return;

    const remoteData = (backupData.sources as SourceWeekType[]).map((data) => {
      decryptObject({
        data,
        table: 'sources',
        accessCode,
      });

      return data;
    });

    const localData = await appDb.sources.toArray();

    const validRemoteData = remoteData.filter((record) =>
      isMondayDate(record.weekOf)
    );

    validRemoteData.forEach((source) => {
      const midweekEvent = source.midweek_meeting.event_name;

      if (typeof midweekEvent === 'object' && !Array.isArray(midweekEvent)) {
        source.midweek_meeting.event_name = [
          {
            type: 'main',
            value: midweekEvent['value'],
            updatedAt: midweekEvent['updatedAt'],
          },
        ];
      }

      const weekendEvent = source.weekend_meeting.event_name;

      if (typeof weekendEvent === 'object' && !Array.isArray(weekendEvent)) {
        source.weekend_meeting.event_name = [
          {
            type: 'main',
            value: weekendEvent['value'],
            updatedAt: weekendEvent['updatedAt'],
          },
        ];
      }
    });

    const dataToUpdate: SourceWeekType[] = [];

    for (const remoteItem of validRemoteData) {
      const localItem = localData.find(
        (record) => record.weekOf === remoteItem.weekOf
      );

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);

        if (!Array.isArray(newItem.midweek_meeting.event_name)) {
          delete newItem.midweek_meeting.event_name;
        }

        if (!Array.isArray(newItem.weekend_meeting.event_name)) {
          delete newItem.weekend_meeting.event_name;
        }

        syncFromRemote(newItem, remoteItem);
        dataToUpdate.push(newItem);
      }
    }

    const invalidLocalData = localData.filter(
      (record) => !isMondayDate(record.weekOf)
    );

    if (invalidLocalData.length > 0) {
      const weeks = invalidLocalData.map((record) => record.weekOf);
      await appDb.sources.bulkDelete(weeks);
    }

    if (dataToUpdate.length > 0) {
      await appDb.sources.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`sources: ${error.message}`);
  }
};

const dbRestoreSchedules = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.sched) return;

    const remoteData = (backupData.sched as SchedWeekType[]).map((data) => {
      decryptObject({
        data,
        table: 'sched',
        accessCode,
      });

      return data;
    });

    const localData = await appDb.sched.toArray();

    const validRemoteData = remoteData.filter((record) =>
      isMondayDate(record.weekOf)
    );

    const dataToUpdate: SchedWeekType[] = [];

    for (const remoteItem of validRemoteData) {
      const localItem = localData.find(
        (record) => record.weekOf === remoteItem.weekOf
      );

      if (typeof remoteItem.midweek_meeting.aux_fsg === 'string') {
        delete remoteItem.midweek_meeting.aux_fsg;
      }

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);
        syncFromRemote(newItem, remoteItem);

        const midweek = newItem.midweek_meeting;

        if (Array.isArray(midweek.chairman.aux_class_1)) {
          midweek.chairman.aux_class_1 =
            localItem.midweek_meeting.chairman.aux_class_1;
        }

        if (Array.isArray(midweek.tgw_bible_reading.aux_class_1)) {
          midweek.tgw_bible_reading.aux_class_1 =
            localItem.midweek_meeting.tgw_bible_reading.aux_class_1;
        }

        if (Array.isArray(midweek.tgw_bible_reading.aux_class_2)) {
          midweek.tgw_bible_reading.aux_class_2 =
            localItem.midweek_meeting.tgw_bible_reading.aux_class_2;
        }

        if (Array.isArray(midweek.ayf_part1.aux_class_1)) {
          midweek.ayf_part1.aux_class_1 =
            localItem.midweek_meeting.ayf_part1.aux_class_1;
        }

        if (Array.isArray(midweek.ayf_part1.aux_class_2)) {
          midweek.ayf_part1.aux_class_2 =
            localItem.midweek_meeting.ayf_part1.aux_class_2;
        }

        if (Array.isArray(midweek.ayf_part2.aux_class_1)) {
          midweek.ayf_part2.aux_class_1 =
            localItem.midweek_meeting.ayf_part2.aux_class_1;
        }

        if (Array.isArray(midweek.ayf_part2.aux_class_2)) {
          midweek.ayf_part2.aux_class_2 =
            localItem.midweek_meeting.ayf_part2.aux_class_2;
        }

        if (Array.isArray(midweek.ayf_part3.aux_class_1)) {
          midweek.ayf_part3.aux_class_1 =
            localItem.midweek_meeting.ayf_part3.aux_class_1;
        }

        if (Array.isArray(midweek.ayf_part3.aux_class_2)) {
          midweek.ayf_part3.aux_class_2 =
            localItem.midweek_meeting.ayf_part3.aux_class_2;
        }

        if (Array.isArray(midweek.ayf_part4.aux_class_1)) {
          midweek.ayf_part4.aux_class_1 =
            localItem.midweek_meeting.ayf_part4.aux_class_1;
        }

        if (Array.isArray(midweek.ayf_part4.aux_class_2)) {
          midweek.ayf_part4.aux_class_2 =
            localItem.midweek_meeting.ayf_part4.aux_class_2;
        }

        dataToUpdate.push(newItem);
      }
    }

    const invalidLocalData = localData.filter(
      (record) => !isMondayDate(record.weekOf)
    );

    if (invalidLocalData.length > 0) {
      const weeks = invalidLocalData.map((record) => record.weekOf);
      await appDb.sched.bulkDelete(weeks);
    }

    if (dataToUpdate.length > 0) {
      await appDb.sched.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`schedules: ${error.message}`);
  }
};

const dbRestoreDelegatedReports = async (
  backupData: BackupDataType,
  accessCode: string
) => {
  try {
    if (!backupData.delegated_field_service_reports) return;

    const remoteData = (
      backupData.delegated_field_service_reports as DelegatedFieldServiceReportType[]
    ).map((data) => {
      decryptObject({
        data,
        table: 'delegated_field_service_reports',
        accessCode,
      });

      return data;
    });

    const localData = await appDb.delegated_field_service_reports.toArray();

    const dataToUpdate: DelegatedFieldServiceReportType[] = [];

    for (const remoteItem of remoteData) {
      const localItem = localData.find(
        (record) =>
          record.report_data.report_date ===
            remoteItem.report_data.report_date &&
          record.report_data.person_uid === remoteItem.report_data.person_uid
      );

      if (!localItem) {
        dataToUpdate.push(remoteItem);
      }

      if (localItem) {
        const newItem = structuredClone(localItem);
        syncFromRemote(newItem, remoteItem);

        dataToUpdate.push(newItem);
      }
    }

    if (dataToUpdate.length > 0) {
      await appDb.delegated_field_service_reports.bulkPut(dataToUpdate);
    }
  } catch (error) {
    throw new Error(`delegated_field_service_reports: ${error.message}`);
  }
};

const dbInsertMetadata = async (metadata: Record<string, string>) => {
  const oldMetadata = await appDb.metadata.get(1);

  const result = oldMetadata?.metadata || {};

  for (const [key, value] of Object.entries(metadata)) {
    result[key] = {
      version: value,
      send_local: result[key]?.send_local || false,
    };
  }

  const toSave = { id: oldMetadata?.id || 1, metadata: result };

  await appDb.metadata.put(toSave);
};

const dbRestoreFromBackup = async (
  backupData: BackupDataType,
  accessCode: string,
  masterKey?: string
) => {
  try {
    await dbRestoreSettings(backupData, accessCode, masterKey);

    await dbRestorePersons(backupData, accessCode, masterKey);

    await dbRestoreSpeakersCongregations(backupData, accessCode, masterKey);

    await dbRestoreVisitingSpeakers(backupData, accessCode, masterKey);

    await dbRestoreFieldGroups(backupData, accessCode);

    await dbRestoreCongReports(backupData, accessCode);

    await dbRestoreBranchReports(backupData, accessCode);

    await dbRestoreBranchCongAnalysis(backupData, accessCode);

    await dbRestoreMeetingAttendance(backupData, accessCode);

    await dbRestoreSources(backupData, accessCode);

    await dbRestoreSchedules(backupData, accessCode);

    await dbRestoreUserStudies(backupData, accessCode);

    await dbRestoreUpcomingEvents(backupData, accessCode);

    await dbRestoreUserReports(backupData, accessCode);

    await dbRestoreDelegatedReports(backupData, accessCode);

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

    await dbInsertMetadata(backupData.metadata);
  } catch (error) {
    throw new Error(`Restore failed: ${error.message}`);
  }
};

export const dbExportDataBackup = async (backupData: BackupDataType) => {
  try {
    const obj: BackupDataType = {};

    const oldData = await dbGetTableData();

    const cong_access_code =
      await oldData.settings.cong_settings.cong_access_code;
    const cong_master_key =
      await oldData.settings.cong_settings.cong_master_key;

    const accessCode = decryptData(
      backupData.app_settings.cong_settings['cong_access_code'],
      cong_access_code,
      'access_code'
    );

    let masterKey: string;

    if (backupData.app_settings.cong_settings['cong_master_key']) {
      masterKey = decryptData(
        backupData.app_settings.cong_settings['cong_master_key'],
        cong_master_key,
        'master_key'
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
      cong_field_service_reports,
      field_service_groups,
      branch_cong_analysis,
      branch_field_service_reports,
      sched,
      sources,
      meeting_attendance,
      metadata,
      delegated_field_service_reports,
      upcoming_events,
    } = await dbGetTableData();

    const dataSync = settings.cong_settings.data_sync.value;
    const accountType = settings.user_settings.account_type;
    const userRole = settings.user_settings.cong_role;

    const { user_settings, cong_settings } = settings;

    const secretaryRole = userRole.includes('secretary');
    const coordinatorRole = userRole.includes('coordinator');
    const elderRole = userRole.includes('elder');
    const groupOverseerRole = userRole.includes('group_overseers');
    const languageGroupOverseerRole = userRole.includes(
      'language_group_overseers'
    );

    const adminRole =
      userRole.includes('admin') || secretaryRole || coordinatorRole;

    const serviceCommitteeRole =
      adminRole || userRole.some((role) => role === 'service_overseer');

    const publicTalkEditor =
      adminRole || userRole.some((role) => role === 'public_talk_schedule');

    const scheduleEditor =
      adminRole ||
      publicTalkEditor ||
      userRole.some(
        (role) => role === 'midweek_schedule' || role === 'weekend_schedule'
      );

    const personEditor = serviceCommitteeRole || scheduleEditor;

    const settingEditor =
      adminRole || languageGroupOverseerRole || scheduleEditor;

    const isPublisher = userRole.includes('publisher');

    const attendanceTracker =
      adminRole ||
      languageGroupOverseerRole ||
      userRole.includes('attendance_tracking');

    const userBaseSettings = {
      firstname: user_settings.firstname,
      lastname: user_settings.lastname,
    };

    const myPerson = persons.find(
      (record) => record.person_uid === user_settings.user_local_uid
    );

    if (dataSync) {
      if (accountType === 'vip') {
        if (metadata.metadata.user_settings.send_local) {
          obj.app_settings = { user_settings: userBaseSettings };
        }

        // include settings data
        if (settingEditor) {
          const localSettings = structuredClone(settings);

          encryptObject({
            data: localSettings,
            table: 'app_settings',
            masterKey,
            accessCode,
          });

          if (metadata.metadata.user_settings.send_local) {
            obj.app_settings.user_settings = localSettings.user_settings;
          }

          if (metadata.metadata.cong_settings.send_local) {
            if (!obj.app_settings) {
              obj.app_settings = { cong_settings: {} };
            }

            obj.app_settings.cong_settings = localSettings.cong_settings;
          }
        }

        // include person data
        if (personEditor && metadata.metadata.persons.send_local) {
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
          if (metadata.metadata.speakers_congregations.send_local) {
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
          }

          if (metadata.metadata.visiting_speakers.send_local) {
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
          }

          const speakersKey =
            backupData.speakers_key?.length > 0
              ? decryptData(backupData.speakers_key, masterKey, 'speakers_key')
              : generateKey();

          if (
            metadata.metadata.persons.send_local ||
            metadata.metadata.visiting_speakers.send_local ||
            !backupData.speakers_key ||
            backupData?.speakers_key.length === 0
          ) {
            const outgoing = outgoing_speakers.map((speaker) => {
              encryptObject({
                data: speaker,
                table: 'visiting_speakers',
                masterKey: speakersKey,
              });

              return speaker;
            });

            obj.outgoing_speakers = outgoing;
          }

          if (
            !backupData.speakers_key ||
            backupData?.speakers_key.length === 0
          ) {
            obj.speakers_key = encryptData(speakersKey, masterKey);
          }
        }

        // include self data if not person editor
        if (
          !personEditor &&
          isPublisher &&
          metadata.metadata.persons.send_local
        ) {
          const person = {
            person_uid: myPerson.person_uid,
            person_data: {
              timeAway:
                myPerson.person_data.timeAway?.filter(
                  (record) => !record._deleted
                ) || [],
              emergency_contacts:
                myPerson.person_data.emergency_contacts.filter(
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

        // include field service groups
        if (
          serviceCommitteeRole &&
          metadata.metadata.field_service_groups.send_local
        ) {
          const backupGroups = field_service_groups.map((group) => {
            encryptObject({
              data: group,
              table: 'field_service_groups',
              accessCode,
            });

            return group;
          });

          obj.field_service_groups = backupGroups;
        }

        // include field service reports
        if (
          (adminRole ||
            elderRole ||
            groupOverseerRole ||
            languageGroupOverseerRole) &&
          metadata.metadata.cong_field_service_reports.send_local
        ) {
          const backupReports = cong_field_service_reports.map((report) => {
            encryptObject({
              data: report,
              table: 'cong_field_service_reports',
              accessCode,
            });

            return report;
          });

          obj.cong_field_service_reports = backupReports;
        }

        // include schedules data
        if (scheduleEditor) {
          if (metadata.metadata.schedules.send_local) {
            const backupSched = sched.map((record) => {
              const schedule = structuredClone(record);

              encryptObject({
                data: schedule,
                table: 'sched',
                accessCode,
              });

              return schedule;
            });

            obj.sched = backupSched;
          }

          if (metadata.metadata.sources.send_local) {
            const backupSources = sources.map((source) => {
              encryptObject({
                data: source,
                table: 'sources',
                accessCode,
              });

              return source;
            });

            obj.sources = backupSources;
          }
        }

        // include meeting attendance
        if (
          attendanceTracker &&
          metadata.metadata.meeting_attendance.send_local
        ) {
          const backupAttendance = meeting_attendance.map((attendance) => {
            encryptObject({
              data: attendance,
              table: 'meeting_attendance',
              accessCode,
            });

            return attendance;
          });

          obj.meeting_attendance = backupAttendance;
        }

        // for admin role
        if (adminRole) {
          // include branch reports
          if (metadata.metadata.branch_field_service_reports.send_local) {
            const backupBranchReports = branch_field_service_reports.map(
              (report) => {
                encryptObject({
                  data: report,
                  table: 'branch_field_service_reports',
                  accessCode,
                });

                return report;
              }
            );

            obj.branch_field_service_reports = backupBranchReports;
          }

          // include branch cong analysis
          if (metadata.metadata.branch_cong_analysis.send_local) {
            const backupAnalysis = branch_cong_analysis.map((analysis) => {
              encryptObject({
                data: analysis,
                table: 'branch_cong_analysis',
                accessCode,
              });

              return analysis;
            });

            obj.branch_cong_analysis = backupAnalysis;
          }

          // include upcoming events
          if (metadata.metadata.upcoming_events?.send_local) {
            const backupUpcomingEvents = upcoming_events.map((study) => {
              encryptObject({
                data: study,
                table: 'upcoming_events',
                accessCode,
              });

              return study;
            });

            obj.upcoming_events = backupUpcomingEvents;
          }
        }

        // include user role changes
        if (adminRole && backupData.cong_users) {
          const congUsers: CongUserType[] = [];
          const { persons: dbPersons, field_service_groups } =
            await dbGetTableData();

          for (const user of backupData.cong_users) {
            const person = dbPersons.find(
              (record) => record.person_uid === user.local_uid
            );

            if (!person) continue;

            let userRole =
              user.role?.filter(
                (role) => !APP_READ_ONLY_ROLES.includes(role)
              ) ?? [];

            const isMidweekStudent =
              person.person_data.midweek_meeting_student.active.value;

            const isPublisher =
              personIsBaptizedPublisher(person) ||
              personIsUnbaptizedPublisher(person);

            const isElder = personIsPrivilegeActive(person, 'elder');
            const isMS = personIsPrivilegeActive(person, 'ms');

            if (isMidweekStudent || isPublisher) {
              userRole.push('view_schedules');
            }

            if (isPublisher) {
              userRole.push('publisher');
            }

            if (isElder) {
              userRole.push('elder');
            }

            if (isMS) {
              userRole.push('ms');
            }

            const group = field_service_groups.find((record) =>
              record.group_data.members.some(
                (member) => member.person_uid === person.person_uid
              )
            );

            const publisher = group?.group_data.members.find(
              (member) => member.person_uid === person.person_uid
            );

            if (publisher) {
              const isLanguageGroup = group.group_data.language_group;
              const isOverseer =
                publisher?.isOverseer || publisher?.isAssistant || false;

              if (isOverseer) {
                userRole.push(
                  isLanguageGroup
                    ? 'language_group_overseers'
                    : 'group_overseers'
                );
              }
            }

            userRole = Array.from(new Set(userRole));

            let roleChanged = false;

            const hasNewRole = userRole.some(
              (role) => !user.role.includes(role)
            );

            roleChanged = hasNewRole || userRole.length !== user.role.length;

            if (roleChanged) {
              const newUser = structuredClone(user);
              newUser.role = userRole;

              congUsers.push(newUser);

              // update local value
              const dbSettings = await dbGetSettings();
              const localUid = dbSettings.user_settings.user_local_uid;

              if (user.local_uid === localUid) {
                await appDb.app_settings.update(1, {
                  'user_settings.cong_role': newUser.role,
                });
              }
            }
          }

          if (congUsers.length > 0) {
            obj.cong_users = congUsers;
          }
        }
      }

      // include user settings, time away, emergency contacts
      if (accountType === 'pocket') {
        if (metadata.metadata.user_settings.send_local) {
          const userSettings = {
            ...userBaseSettings,
            backup_automatic: settings.user_settings.backup_automatic,
            theme_follow_os_enabled:
              settings.user_settings.theme_follow_os_enabled,
            hour_credits_enabled: settings.user_settings.hour_credits_enabled,
          };

          encryptObject({
            data: userSettings,
            table: 'app_settings',
            accessCode,
          });

          obj.app_settings = { user_settings: userSettings };
        }

        if (myPerson && metadata.metadata.persons.send_local) {
          const person = {
            person_uid: myPerson.person_uid,
            person_data: {
              timeAway: myPerson.person_data.timeAway.filter(
                (record) => !record._deleted
              ),
              emergency_contacts:
                myPerson.person_data.emergency_contacts.filter(
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

      // include publisher bible studies and field reports
      if (isPublisher) {
        if (metadata.metadata.user_bible_studies.send_local) {
          const backupBibleStudies = user_bible_studies.map((study) => {
            encryptObject({
              data: study,
              table: 'user_bible_studies',
              accessCode,
            });

            return study;
          });

          obj.user_bible_studies = backupBibleStudies;
        }

        if (metadata.metadata.user_field_service_reports.send_local) {
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

        if (metadata.metadata.delegated_field_service_reports.send_local) {
          const backupReports = delegated_field_service_reports.map(
            (report) => {
              encryptObject({
                data: report,
                table: 'delegated_field_service_reports',
                accessCode,
              });

              return report;
            }
          );

          obj.delegated_field_service_reports = backupReports;
        }
      }
    }

    if (!dataSync) {
      if (accountType === 'vip') {
        if (metadata.metadata.user_settings.send_local) {
          obj.app_settings = { user_settings: userBaseSettings };
        }

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

          if (metadata.metadata.user_settings.send_local) {
            obj.app_settings.user_settings = {
              ...obj.app_settings.user_settings,
              cong_role: user_settings.cong_role,
              account_type: user_settings.account_type,
              user_local_uid: user_settings.user_local_uid,
            };
          }

          if (metadata.metadata.cong_settings.send_local) {
            if (!obj.app_settings) {
              obj.app_settings = {};
            }

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
              group_publishers_sort: cong_settings.group_publishers_sort,
              first_day_week: cong_settings.first_day_week,
            };
          }
        }
      }

      if (accountType === 'pocket') {
        if (metadata.metadata.user_settings.send_local) {
          obj.app_settings = { user_settings: userBaseSettings };
        }
      }
    }

    return obj;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const dbClearExportState = async () => {
  const metadata = await appDb.metadata.get(1);

  const oldMetadata = metadata.metadata;
  const newMetadata = {} as MetadataRecordType['metadata'];

  for (const [key, values] of Object.entries(oldMetadata)) {
    newMetadata[key] = { version: values.version, send_local: false };
  }

  await appDb.metadata.update(metadata.id, {
    metadata: newMetadata,
  });
};
