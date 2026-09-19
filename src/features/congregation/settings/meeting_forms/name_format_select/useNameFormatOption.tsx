import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { FullnameOption } from '@definition/settings';

const useNameFormatOption = (
  field: 'fullname_option' | 'print_fullname_option',
  optionInitial: FullnameOption
) => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const [option, setOption] = useState(FullnameOption.FIRST_BEFORE_LAST);

  const hasRecord = (settings.cong_settings[field] ?? []).some(
    (record) => record.type === dataView && !record._deleted
  );

  const handleOptionChange = async (value: FullnameOption) => {
    const records = structuredClone(settings.cong_settings[field] ?? []);

    const current = records.find((record) => record.type === dataView);

    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
      current._deleted = false;
    }

    if (!current) {
      records.push({
        _deleted: false,
        type: dataView,
        updatedAt: new Date().toISOString(),
        value,
      });
    }

    const update =
      field === 'fullname_option'
        ? { 'cong_settings.fullname_option': records }
        : { 'cong_settings.print_fullname_option': records };

    await dbAppSettingsUpdate(update);
  };

  const handleOptionClear = async () => {
    const records = structuredClone(settings.cong_settings[field] ?? []);

    const current = records.find(
      (record) => record.type === dataView && !record._deleted
    );

    if (!current) return;

    current._deleted = true;
    current.updatedAt = new Date().toISOString();

    const update =
      field === 'fullname_option'
        ? { 'cong_settings.fullname_option': records }
        : { 'cong_settings.print_fullname_option': records };

    await dbAppSettingsUpdate(update);
  };

  useEffect(() => {
    setOption(optionInitial);
  }, [optionInitial]);

  return { option, hasRecord, handleOptionChange, handleOptionClear };
};

export default useNameFormatOption;
