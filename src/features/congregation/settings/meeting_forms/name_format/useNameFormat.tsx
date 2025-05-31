import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  fullnameOptionState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { FullnameOption } from '@definition/settings';

const useNameFormat = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const optionInitial = useAtomValue(fullnameOptionState);

  const [fullnameOption, setFullnameOption] = useState(
    FullnameOption.FIRST_BEFORE_LAST
  );

  const handleFullnameOptionChange = async (value: FullnameOption) => {
    const fullnameOption = structuredClone(
      settings.cong_settings.fullname_option
    );

    const current = fullnameOption.find((record) => record.type === dataView);

    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    }

    if (!current) {
      fullnameOption.push({
        _deleted: false,
        type: dataView,
        updatedAt: new Date().toISOString(),
        value,
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.fullname_option': fullnameOption,
    });
  };

  useEffect(() => {
    setFullnameOption(optionInitial);
  }, [optionInitial]);

  return {
    fullnameOption,
    handleFullnameOptionChange,
  };
};

export default useNameFormat;
