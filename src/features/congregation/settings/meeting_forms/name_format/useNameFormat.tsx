import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  fullnameOptionState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { FullnameOption } from '@definition/settings';

const useNameFormat = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const optionInitial = useRecoilValue(fullnameOptionState);

  const [fullnameOption, setFullnameOption] = useState(
    FullnameOption.FIRST_BEFORE_LAST
  );

  const handleFullnameOptionChange = async (value: FullnameOption) => {
    const fullnameOption = structuredClone(
      settings.cong_settings.fullname_option
    );

    const current = fullnameOption.find((record) => record.type === dataView);

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
