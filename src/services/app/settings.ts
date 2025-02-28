import { SettingsType } from '@definition/settings';

export const convertSettingsObjectToArray = (settings: SettingsType) => {
  if (!Array.isArray(settings.cong_settings.display_name_enabled)) {
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

  if (!Array.isArray(settings.cong_settings.schedule_exact_date_enabled)) {
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

  if (!Array.isArray(settings.cong_settings.attendance_online_record)) {
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

  return settings;
};
