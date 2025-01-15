import { UpdateSpec } from 'dexie';
import { SettingsType } from '@definition/settings';
import { settingSchema } from './schema';
import { AssignmentCode } from '@definition/assignment';
import { getRandomArrayItem } from '@utils/common';
import appDb from '@db/appDb';

export const dbAppSettingsGet = async () => {
  const current = await appDb.app_settings.get(1);
  return current;
};

export const dbAppSettingsUpdate = async (
  changes: UpdateSpec<SettingsType>
) => {
  await appDb.app_settings.update(1, changes);

  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  const keys = Object.keys(changes);

  let updateMetadata = false;

  if (keys.find((key) => key.includes('cong_settings'))) {
    metadata.metadata.cong_settings = {
      ...metadata.metadata.cong_settings,
      send_local: true,
    };

    updateMetadata = true;
  }

  if (keys.find((key) => key.includes('user_settings'))) {
    metadata.metadata.user_settings = {
      ...metadata.metadata.user_settings,
      send_local: true,
    };

    updateMetadata = true;
  }

  if (updateMetadata) {
    await appDb.metadata.put(metadata);
  }
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

export const dbAppSettingsBuildTest = async () => {
  const souceLangDemo = localStorage.getItem('demo_source_language');

  if (souceLangDemo) {
    localStorage.removeItem('demo_source_language');
  }

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
  baseSettings.cong_settings.source_material.language = [
    {
      type: 'main',
      updatedAt: new Date().toISOString(),
      value: souceLangDemo || 'E',
    },
  ];
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
