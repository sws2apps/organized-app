import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  printFullnameOptionState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { FullnameOption } from '@definition/settings';

const usePrintNameFormat = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const optionInitial = useAtomValue(printFullnameOptionState);

  const [printFullnameOption, setPrintFullnameOption] = useState(
    FullnameOption.FIRST_BEFORE_LAST
  );

  const handlePrintFullnameOptionChange = async (value: FullnameOption) => {
    const printFullnameOption = structuredClone(
      settings.cong_settings.print_fullname_option ?? []
    );

    const current = printFullnameOption.find(
      (record) => record.type === dataView
    );

    if (current) {
      current.value = value;
      current.updatedAt = new Date().toISOString();
    }

    if (!current) {
      printFullnameOption.push({
        _deleted: false,
        type: dataView,
        updatedAt: new Date().toISOString(),
        value,
      });
    }

    await dbAppSettingsUpdate({
      'cong_settings.print_fullname_option': printFullnameOption,
    });
  };

  useEffect(() => {
    setPrintFullnameOption(optionInitial);
  }, [optionInitial]);

  return {
    printFullnameOption,
    handlePrintFullnameOptionChange,
  };
};

export default usePrintNameFormat;
