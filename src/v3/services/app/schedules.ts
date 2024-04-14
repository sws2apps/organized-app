import { dbSchedSave } from '@services/dexie/schedules';
import { dbAppSettingsSave } from '@services/dexie/settings';
import { dbSourcesSave } from '@services/dexie/sources';

export const schedUpdateFromRemote = async (data) => {
  const { cong_schedule, cong_sourceMaterial, cong_settings } = data;

  for await (const week of cong_sourceMaterial) {
    await dbSourcesSave({ srcData: week, keepOverride: false, forPocket: true });
  }

  for await (const week of cong_schedule) {
    await dbSchedSave(week);
  }

  const { class_count, source_lang, co_name, co_displayName, opening_prayer_MM_autoAssign } = cong_settings;
  await dbAppSettingsSave({
    class_count,
    source_lang,
    co_name,
    co_displayName,
    opening_prayer_MM_autoAssign,
  });
};
