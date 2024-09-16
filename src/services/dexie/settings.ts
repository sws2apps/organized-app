import { UpdateSpec } from 'dexie';
import { TimeAwayType } from '@definition/person';
import { SettingsType } from '@definition/settings';
import {
  setCongAccountConnected,
  setCongID,
  setEncryptedMasterKey,
  setIsMFAEnabled,
  setUserID,
} from '@services/recoil/app';
import { settingSchema } from './schema';
import { ValidateMeResponseType } from '@definition/api';
import { AssignmentCode } from '@definition/assignment';
import { getRandomArrayItem } from '@utils/common';
import appDb from '@db/appDb';
import worker from '@services/worker/backupWorker';

export const dbAppSettingsSave = async (setting: SettingsType) => {
  const current = await appDb.app_settings.get(1);

  const newSettings = { ...current, ...setting };
  await appDb.app_settings.put(newSettings);
};

export const dbAppSettingsUpdate = async (
  changes: UpdateSpec<SettingsType>
) => {
  await appDb.app_settings.update(1, changes);
};

export const dbAppSettingsTimeAwayAdd = async () => {
  const setting = await appDb.app_settings.get(1);

  setting.user_settings.user_time_away.push({
    id: crypto.randomUUID(),
    _deleted: false,
    updatedAt: new Date().toISOString(),
    start_date: new Date().toISOString(),
    end_date: null,
    comments: '',
  });

  await appDb.app_settings.put(setting);
};

export const dbAppSettingsTimeAwayDelete = async (id) => {
  const setting = await appDb.app_settings.get(1);

  const currentTimeAway = setting.user_settings.user_time_away.find(
    (record) => record.id === id
  );
  currentTimeAway._deleted = true;
  currentTimeAway.updatedAt = new Date().toISOString();

  await appDb.app_settings.put(setting);
};

export const dbAppSettingsTimeAwayUpdate = async (timeAway: TimeAwayType) => {
  const setting = await appDb.app_settings.get(1);

  const currentIndex = setting.user_settings.user_time_away.findIndex(
    (record) => record.id === timeAway.id
  );
  setting.user_settings.user_time_away[currentIndex] = { ...timeAway };

  await appDb.app_settings.put(setting);
};

export const dbAppSettingsSaveProfilePic = async (
  url: string,
  provider: string
) => {
  if (url && url !== '' && url !== null) {
    if (provider !== 'microsoft.com' && provider !== 'yahoo.com') {
      const downloadedImg = new Image();
      downloadedImg.crossOrigin = 'Anonymous';

      const imageReceived = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = downloadedImg.width;
        canvas.height = downloadedImg.height;
        canvas.innerText = downloadedImg.alt;

        context.drawImage(downloadedImg, 0, 0);

        canvas.toBlob((done) => savePic(done));

        // Remove the event listener to avoid memory leak
        downloadedImg.removeEventListener('load', imageReceived, false);
      };

      downloadedImg.src = url;
      downloadedImg.addEventListener('load', imageReceived, false);

      const savePic = (profileBlob) => {
        profileBlob.arrayBuffer().then((profileBuffer) => {
          dbAppSettingsUpdate({ 'user_settings.user_avatar': profileBuffer });
        });
      };

      return;
    }
  }

  await dbAppSettingsUpdate({ 'user_settings.user_avatar': undefined });
};

export const dbAppSettingsUpdateUserInfoAfterLogin = async (
  data: ValidateMeResponseType
) => {
  const settings = await appDb.app_settings.get(1);

  await dbAppSettingsUpdate({
    'cong_settings.country_code': data.result.country_code,
    'cong_settings.cong_name': data.result.cong_name,
    'cong_settings.cong_number': data.result.cong_number,
    'user_settings.cong_role': data.result.cong_role,
    'user_settings.account_type': 'vip',
    'user_settings.user_local_uid': data.result.user_local_uid || '',
    'user_settings.user_members_delegate': data.result.user_delegates || [],
  });

  if (
    settings.user_settings.firstname.updatedAt < data.result.firstname.updatedAt
  ) {
    await dbAppSettingsUpdate({
      'user_settings.firstname': data.result.firstname,
    });
  }

  if (
    settings.user_settings.lastname.updatedAt < data.result.lastname.updatedAt
  ) {
    await dbAppSettingsUpdate({
      'user_settings.lastname': data.result.lastname,
    });
  }

  if (
    settings.cong_settings.cong_location.updatedAt <
    data.result.cong_location.updatedAt
  ) {
    await dbAppSettingsUpdate({
      'cong_settings.cong_location': data.result.cong_location,
    });
  }

  const congCircuit = structuredClone(settings.cong_settings.cong_circuit);

  for (const item of congCircuit) {
    const remoteItem = data.result.cong_circuit.find(
      (record) => record.type === item.type
    );

    if (item?.updatedAt < remoteItem?.updatedAt) {
      item.updatedAt = remoteItem.updatedAt;
      item.value = remoteItem.value;
    }
  }

  const midweekMeeting = structuredClone(
    settings.cong_settings.midweek_meeting
  );

  for (const item of midweekMeeting) {
    const remoteItem = data.result.midweek_meeting.find(
      (record) => record.type === item.type
    );

    if (item.time.updatedAt < remoteItem?.time.updatedAt) {
      item.time = remoteItem.time;
    }

    if (item?.weekday.updatedAt < remoteItem?.weekday.updatedAt) {
      item.weekday = remoteItem.weekday;
    }
  }

  const weekendMeeting = structuredClone(
    settings.cong_settings.weekend_meeting
  );

  for (const item of weekendMeeting) {
    const remoteItem = data.result.weekend_meeting.find(
      (record) => record.type === item.type
    );

    if (item.time.updatedAt < remoteItem.time.updatedAt) {
      item.time = remoteItem.time;
    }

    if (item.weekday.updatedAt < remoteItem.weekday.updatedAt) {
      item.weekday = remoteItem.weekday;
    }
  }

  await dbAppSettingsUpdate({
    'cong_settings.cong_circuit': congCircuit,
    'cong_settings.midweek_meeting': midweekMeeting,
    'cong_settings.weekend_meeting': weekendMeeting,
  });

  await setIsMFAEnabled(data.result.mfaEnabled);
  await setCongID(data.result.cong_id);
  await setCongAccountConnected(true);
  await setUserID(data.result.id);
  await setEncryptedMasterKey(data.result.cong_master_key);

  worker.postMessage({ field: 'userRole', value: data.result.cong_role });
  worker.postMessage({ field: 'userID', value: data.result.id });
  worker.postMessage({ field: 'congID', value: data.result.cong_id });
  worker.postMessage({ field: 'accountType', value: 'vip' });
};

export const dbAppSettingsBuildTest = async () => {
  const baseSettings = structuredClone(settingSchema);
  const persons = await appDb.persons.toArray();

  const person = persons.find((record) =>
    record.person_data.assignments.find(
      (item) => item.code === AssignmentCode.WM_WTStudyConductor
    )
  );

  const filteredPersons = persons.filter(
    (record) => record.person_uid !== person.person_uid
  );

  const delegates: string[] = [];

  do {
    const delegate = getRandomArrayItem(filteredPersons).person_uid;

    if (!delegates.includes(delegate)) {
      delegates.push(delegate);
    }
  } while (delegates.length < 3);

  baseSettings.user_settings.user_local_uid = person.person_uid;
  baseSettings.user_settings.user_members_delegate = delegates;

  baseSettings.user_settings.firstname = {
    value: person.person_data.person_firstname.value,
    updatedAt: new Date().toISOString(),
  };
  baseSettings.user_settings.lastname = {
    value: person.person_data.person_lastname.value,
    updatedAt: new Date().toISOString(),
  };
  baseSettings.user_settings.cong_role = [
    'admin',
    'elder',
    'publisher',
    'secretary',
  ];
  baseSettings.user_settings.account_type = 'vip';
  baseSettings.user_settings.hour_credits_enabled = {
    value: true,
    updatedAt: new Date().toISOString(),
  };
  baseSettings.cong_settings.country_code = 'USA';
  baseSettings.cong_settings.cong_name = 'Central English - Seattle WA';
  baseSettings.cong_settings.cong_number = '11163';
  baseSettings.cong_settings.cong_circuit = [
    { type: 'main', value: 'WA- 5', updatedAt: new Date().toISOString() },
  ];
  baseSettings.cong_settings.cong_location = {
    address: '333 19th Ave E Seattle WA  98112-5307',
    lat: 47.621731,
    lng: -122.307599,
    updatedAt: new Date().toISOString(),
  };
  baseSettings.cong_settings.schedule_exact_date_enabled = {
    value: true,
    updatedAt: new Date().toISOString(),
  };
  baseSettings.cong_settings.midweek_meeting = [
    {
      type: 'main',
      class_count: { updatedAt: new Date().toISOString(), value: 1 },
      opening_prayer_auto_assigned: {
        value: false,
        updatedAt: new Date().toISOString(),
      },
      closing_prayer_auto_assigned: {
        value: false,
        updatedAt: new Date().toISOString(),
      },
      time: { value: '19:30', updatedAt: new Date().toISOString() },
      weekday: { value: 4, updatedAt: new Date().toISOString() },
      aux_class_counselor_default: {
        enabled: { value: false, updatedAt: '' },
        person: { value: '', updatedAt: '' },
      },
    },
  ];
  baseSettings.cong_settings.weekend_meeting = [
    {
      type: 'main',
      opening_prayer_auto_assigned: {
        value: false,
        updatedAt: new Date().toISOString(),
      },
      substitute_speaker_enabled: {
        value: false,
        updatedAt: new Date().toISOString(),
      },
      w_study_conductor_default: { value: '', updatedAt: '' },
      time: { value: '13:00', updatedAt: new Date().toISOString() },
      weekday: { value: 7, updatedAt: new Date().toISOString() },
      consecutive_monthly_parts_notice_shown: {
        value: true,
        updatedAt: new Date().toISOString(),
      },
      substitute_w_study_conductor_displayed: {
        value: true,
        updatedAt: new Date().toISOString(),
      },
      outgoing_talks_schedule_public: {
        value: false,
        updatedAt: new Date().toISOString(),
      },
    },
  ];
  baseSettings.cong_settings.circuit_overseer = {
    firstname: { value: 'Alexander', updatedAt: new Date().toISOString() },
    lastname: { value: 'Olivier', updatedAt: new Date().toISOString() },
    display_name: { value: 'A. Olivier', updatedAt: new Date().toISOString() },
    visits: [],
  };

  await appDb.app_settings.put(baseSettings, 1);
};
