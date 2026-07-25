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

  const handleOptionChange = async (value: FullnameOption) => {
    const records = structuredClone(settings.cong_settings[field] ?? []);

    const current = records.find((record) => record.type === dataView);

    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
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

  useEffect(() => {
    setOption(optionInitial);
  }, [optionInitial]);

  return { option, handleOptionChange };
};

export default useNameFormatOption;
