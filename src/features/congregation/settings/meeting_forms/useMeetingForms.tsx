import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { FullnameOption, SourceFrequency } from '@definition/settings';
import { schedulesBuildHistoryList } from '@services/app/schedules';
import { assignmentsHistoryState } from '@states/schedules';

const useMeetingForms = () => {
  const setAssignmentsHistory = useSetRecoilState(assignmentsHistoryState);

  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [sourceAutoUpdate, setSourceAutoUpdate] = useState(false);
  const [sourceUpdateFrequency, setSourceUpdateFrequency] = useState(
    SourceFrequency.WEEKLY
  );
  const [fullnameOption, setFullnameOption] = useState(
    FullnameOption.FIRST_BEFORE_LAST
  );
  const [shortDateFormat, setShortDateFormat] = useState('MM/dd/yyyy');

  const shortDateFormatOptions = [
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'MM.dd.yyyy',
    'dd.MM.yyyy',
    'yyyy-MM-dd',
    'yyyy-dd-MM',
  ];

  const handleSourceAutoUpdateToggle = async () => {
    const sourceAutoUpdateEnable = structuredClone(
      settings.cong_settings.source_material_auto_import.enabled
    );

    sourceAutoUpdateEnable.value = !sourceAutoUpdate;
    sourceAutoUpdateEnable.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.source_material_auto_import.enabled':
        sourceAutoUpdateEnable,
    });
  };

  const handleSourceUpdateFrequencyChange = async (value: SourceFrequency) => {
    const updateFrequency = structuredClone(
      settings.cong_settings.source_material_auto_import.frequency
    );

    updateFrequency.value = value;
    updateFrequency.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.source_material_auto_import.frequency': updateFrequency,
    });
  };

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

  const handleShortDateFormatChange = async (value: string) => {
    const shortDateFormat = structuredClone(
      settings.cong_settings.short_date_format
    );

    const current = shortDateFormat.find((record) => record.type === dataView);

    current.value = value;
    current.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.short_date_format': shortDateFormat,
    });

    // reload assignments history because of date format change
    const history = await schedulesBuildHistoryList();
    setAssignmentsHistory(history);
  };

  useEffect(() => {
    setSourceAutoUpdate(
      settings.cong_settings.source_material_auto_import.enabled.value
    );

    setSourceUpdateFrequency(
      settings.cong_settings.source_material_auto_import.frequency.value
    );

    const fullname = settings.cong_settings.fullname_option.find(
      (record) => record.type === dataView
    );

    setFullnameOption(fullname.value);

    const dateFormat = settings.cong_settings.short_date_format.find(
      (record) => record.type === dataView
    );

    setShortDateFormat(dateFormat.value);
  }, [settings, dataView]);

  return {
    sourceAutoUpdate,
    handleSourceAutoUpdateToggle,
    sourceUpdateFrequency,
    handleSourceUpdateFrequencyChange,
    fullnameOption,
    handleFullnameOptionChange,
    shortDateFormat,
    handleShortDateFormatChange,
    shortDateFormatOptions,
  };
};

export default useMeetingForms;
