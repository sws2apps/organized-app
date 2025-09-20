import { UpdateSpec } from 'dexie';
import {
  FirstDayWeekOption,
  PublishersSortOption,
  SettingsType,
} from '@definition/settings';
import { settingSchema } from './schema';
import { AssignmentCode } from '@definition/assignment';
import { getRandomArrayItem } from '@utils/common';
import { LANGUAGE_LIST } from '@constants/index';
import appDb from '@db/appDb';

export const dbAppSettingsGet = async () => {
  const current = await appDb.app_settings.get(1);
  return current;
};

export const dbAppSettingsUpdateWithoutNotice = async (
  changes: UpdateSpec<SettingsType>
) => {
  await appDb.app_settings.update(1, changes);
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
  const appLang = localStorage.getItem('ui_lang') ?? 'eng';

  const souceLangDemo =
    LANGUAGE_LIST.find(
      (record) => record.threeLettersCode === appLang
    )?.code.toUpperCase() ?? 'E';

  const baseSettings = structuredClone(settingSchema);
  const persons = await appDb.persons.toArray();

  const person = persons.find((record) =>
    record.person_data.assignments
      .at(0)
      .values.includes(AssignmentCode.WM_WTStudyConductor)
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
    'secretary',
    'elder',
    'publisher',
    'view_schedules',
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
    {
      type: 'main',
      value: 'WA-5',
      updatedAt: new Date().toISOString(),
      _deleted: false,
    },
  ];

  baseSettings.cong_settings.cong_location = {
    address: '333 19th Ave E Seattle WA  98112-5307',
    lat: 47.621731,
    lng: -122.307599,
    updatedAt: new Date().toISOString(),
  };

  baseSettings.cong_settings.schedule_exact_date_enabled = [
    {
      type: 'main',
      _deleted: false,
      value: true,
      updatedAt: new Date().toISOString(),
    },
  ];

  baseSettings.cong_settings.first_day_week = [
    {
      type: 'main',
      value: FirstDayWeekOption.MONDAY,
      updatedAt: new Date().toISOString(),
      _deleted: false,
    },
  ];

  baseSettings.cong_settings.source_material.language = [
    {
      type: 'main',
      updatedAt: new Date().toISOString(),
      value: souceLangDemo || 'E',
      _deleted: false,
    },
  ];

  baseSettings.cong_settings.midweek_meeting = [
    {
      type: 'main',
      _deleted: { value: false, updatedAt: new Date().toISOString() },
      class_count: { updatedAt: new Date().toISOString(), value: 1 },
      opening_prayer_linked_assignment: {
        value: '',
        updatedAt: new Date().toISOString(),
      },
      closing_prayer_linked_assignment: {
        value: '',
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
      _deleted: { value: false, updatedAt: new Date().toISOString() },
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

  baseSettings.cong_settings.language_groups = {
    enabled: { value: true, updatedAt: new Date().toISOString() },
  };

  await appDb.app_settings.put(baseSettings, 1);
};

export const dbConvertAutoAssignPrayers = async () => {
  const settings = await appDb.app_settings.get(1);

  const midweekSettings = structuredClone(
    settings.cong_settings.midweek_meeting
  );

  let save = false;

  for (const section of midweekSettings) {
    if (
      section['opening_prayer_auto_assigned'] === undefined &&
      section['closing_prayer_auto_assigned'] === undefined
    ) {
      continue;
    }

    if (section['opening_prayer_auto_assigned'].value) {
      section.opening_prayer_linked_assignment = {
        value: 'MM_Chairman_A',
        updatedAt: new Date().toISOString(),
      };
    }

    if (section['closing_prayer_auto_assigned'].value) {
      section.closing_prayer_linked_assignment = {
        value: 'MM_Chairman_A',
        updatedAt: new Date().toISOString(),
      };
    }

    delete section['opening_prayer_auto_assigned'];
    delete section['closing_prayer_auto_assigned'];

    save = true;
  }

  if (!save) return;

  await dbAppSettingsUpdate({
    'cong_settings.midweek_meeting': midweekSettings,
  });
};

export const dbAppSettingsCreatePublishersSort = async () => {
  const settings = await appDb.app_settings.get(1);

  if (settings.cong_settings.group_publishers_sort) return;

  const newSettings = structuredClone(settings);

  newSettings.cong_settings.group_publishers_sort = {
    value: PublishersSortOption.MANUAL,
    updatedAt: '',
  };

  await appDb.app_settings.put(newSettings);
};

export const dbAppSettingsSetupMeetingDuties = async () => {
  const settings = await appDb.app_settings.get(1);

  const meetingDuties = settings.cong_settings.meeting_duties ?? [];

  const findDutiesView = meetingDuties.find(
    (duty) => duty.type === settings.user_settings.data_view.value
  );

  if (meetingDuties.length === 0 || !findDutiesView) {
    meetingDuties.push({
      type: settings.user_settings.data_view.value,
      _deleted: { value: false, updatedAt: new Date().toISOString() },
      conflict_prevent: { value: false, updatedAt: new Date().toISOString() },
      mic_sections: { value: false, updatedAt: new Date().toISOString() },
      av_amount: { value: 0, updatedAt: new Date().toISOString() },
      mic_amount: { value: 0, updatedAt: new Date().toISOString() },
      stage_amount: { value: 0, updatedAt: new Date().toISOString() },
      entrance_attendant_amount: {
        value: 0,
        updatedAt: new Date().toISOString(),
      },
      hospitality_amount: { value: 0, updatedAt: new Date().toISOString() },
      custom: [],
    });

    await dbAppSettingsUpdate({
      'cong_settings.meeting_duties': meetingDuties,
    });
  }
};
