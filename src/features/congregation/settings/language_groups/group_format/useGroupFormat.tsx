import { useAtomValue } from 'jotai';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { FullnameOption, FirstDayWeekOption } from '@definition/settings';

const useGroupFormat = (groupId: string) => {
  const settings = useAtomValue(settingsState);
  const type = `language-group-${groupId}`;

  const nameFormatRecord = settings.cong_settings.fullname_option.find(r => r.type === type);
  const nameFormat = nameFormatRecord ? nameFormatRecord.value : FullnameOption.FIRST_BEFORE_LAST;

  const dateFormatRecord = settings.cong_settings.short_date_format.find(r => r.type === type);
  const dateFormat = dateFormatRecord ? dateFormatRecord.value : 'MM/DD/YYYY';

  const weekStartRecord = settings.cong_settings.first_day_week.find(r => r.type === type);
  const weekStart = weekStartRecord ? weekStartRecord.value : FirstDayWeekOption.SUNDAY;

  const hour24Record = settings.cong_settings.format_24h_enabled.find(r => r.type === type);
  const hour24 = hour24Record ? hour24Record.value : false;

  const handleNameFormatChange = async (value: FullnameOption) => {
    const list = structuredClone(settings.cong_settings.fullname_option);
    const current = list.find((record) => record.type === type);
    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    } else {
      list.push({ _deleted: false, type, updatedAt: new Date().toISOString(), value });
    }
    await dbAppSettingsUpdate({ 'cong_settings.fullname_option': list });
  };

  const handleDateFormatChange = async (value: string) => {
    const list = structuredClone(settings.cong_settings.short_date_format);
    const current = list.find((record) => record.type === type);
    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    } else {
      list.push({ _deleted: false, type, updatedAt: new Date().toISOString(), value });
    }
    await dbAppSettingsUpdate({ 'cong_settings.short_date_format': list });
  };

  const handleWeekStartChange = async (value: FirstDayWeekOption) => {
    const list = structuredClone(settings.cong_settings.first_day_week);
    const current = list.find((record) => record.type === type);
    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    } else {
      list.push({ _deleted: false, type, updatedAt: new Date().toISOString(), value });
    }
    await dbAppSettingsUpdate({ 'cong_settings.first_day_week': list });
  };

  const handleHour24Toggle = async (value: boolean) => {
    const list = structuredClone(settings.cong_settings.format_24h_enabled);
    const current = list.find((record) => record.type === type);
    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    } else {
      list.push({ _deleted: false, type, updatedAt: new Date().toISOString(), value });
    }
    await dbAppSettingsUpdate({ 'cong_settings.format_24h_enabled': list });
  };

  return {
    nameFormat,
    dateFormat,
    weekStart,
    hour24,
    handleNameFormatChange,
    handleDateFormatChange,
    handleWeekStartChange,
    handleHour24Toggle
  };
};

export default useGroupFormat;
