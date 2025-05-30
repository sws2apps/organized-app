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

    let current = fullnameOption.find((record) => record.type === dataView);

    if (!current) {
      fullnameOption.push({
        _deleted: false,
        type: dataView,
        updatedAt: '',
        value: undefined,
      });

      current = fullnameOption.find((record) => record.type === dataView);
    }

    current.value = value;
    current.updatedAt = new Date().toISOString();

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
