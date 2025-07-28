import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { FirstDayWeekOption, FullnameOption } from '@definition/settings';
import { circuitNumberState, settingsState } from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { CreateState, GroupAddProps } from './index.types';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import {
  fieldGroupsState,
  fieldServiceGroupsState,
} from '@states/field_service_groups';
import { settingSchema } from '@services/dexie/schema';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import { refreshLocalesResources } from '@services/i18n';

const useGroupAdd = ({ onClose }: GroupAddProps) => {
  const { t } = useAppTranslation();

  const congCircuit = useAtomValue(circuitNumberState);
  const groups = useAtomValue(fieldGroupsState);
  const allGroups = useAtomValue(fieldServiceGroupsState);
  const appSettings = useAtomValue(settingsState);

  const [step, setStep] = useState<CreateState>('start');
  const [circuit, setCircuit] = useState(congCircuit);
  const [language, setLanguage] = useState(congCircuit);
  const [group, setGroup] = useState<FieldServiceGroupType>({
    group_id: '',
    group_data: {
      _deleted: false,
      members: [],
      name: '',
      sort_index: groups.length,
      updatedAt: '',
      language_group: true,
      midweek_meeting: false,
      weekend_meeting: false,
    },
  });

  const handleNext = () => {
    if (
      group.group_data.name.length === 0 ||
      circuit.length === 0 ||
      language.length === 0
    ) {
      return;
    }

    setStep('final');
  };

  const handleGroupChange = (value: FieldServiceGroupType) => {
    setGroup(value);
  };

  const handleChangeCircuit = (value: string) => setCircuit(value);

  const handleChangeLanguage = (value: string) => setLanguage(value);

  const handleCreateGroup = async () => {
    try {
      const groups = structuredClone(allGroups);

      const findGroup = groups.find(
        (record) => record.group_data.name === group.group_data.name
      );

      if (findGroup) {
        if (findGroup?.group_data._deleted === false) {
          throw new Error(t('tr_languageGroupExists'));
        }

        group.group_id = findGroup.group_id;
        group.group_data._deleted = false;
        group.group_data.updatedAt = new Date().toISOString();
      }

      if (!findGroup) {
        group.group_id = crypto.randomUUID();
        group.group_data.updatedAt = new Date().toISOString();
      }

      await dbFieldServiceGroupSave(group);

      const sourceLanguages =
        appSettings.cong_settings.source_material.language;

      sourceLanguages.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: language,
      });

      const congCircuit = appSettings.cong_settings.cong_circuit;

      congCircuit.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: circuit,
      });

      const displayName = appSettings.cong_settings.display_name_enabled;

      displayName.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        meetings: false,
        others: false,
      });

      const fullnameOption = appSettings.cong_settings.fullname_option;

      fullnameOption.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: FullnameOption.FIRST_BEFORE_LAST,
      });

      const shortDateFormat = appSettings.cong_settings.short_date_format;

      shortDateFormat.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: 'MM/dd/yyyy',
      });

      const format24h = appSettings.cong_settings.format_24h_enabled;

      format24h.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: true,
      });

      const onlineRecord = appSettings.cong_settings.attendance_online_record;

      onlineRecord.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: false,
      });

      const firstDayWeek =
        appSettings.cong_settings.first_day_week ||
        settingSchema.cong_settings.first_day_week;

      firstDayWeek.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: FirstDayWeekOption.MONDAY,
      });

      const weekendSongs =
        appSettings.cong_settings.schedule_songs_weekend ||
        settingSchema.cong_settings.schedule_songs_weekend;

      weekendSongs.push({
        _deleted: false,
        type: group.group_id,
        updatedAt: new Date().toISOString(),
        value: false,
      });

      const midweekMeeting = appSettings.cong_settings.midweek_meeting;

      midweekMeeting.push({
        ...settingSchema.cong_settings.midweek_meeting.at(0),
        type: group.group_id,
      });

      const weekendMeeting = appSettings.cong_settings.weekend_meeting;

      weekendMeeting.push({
        ...settingSchema.cong_settings.weekend_meeting.at(0),
        type: group.group_id,
      });

      await dbAppSettingsUpdate({
        'cong_settings.source_material.language': sourceLanguages,
        'cong_settings.cong_circuit': congCircuit,
        'cong_settings.display_name_enabled': displayName,
        'cong_settings.fullname_option': fullnameOption,
        'cong_settings.short_date_format': shortDateFormat,
        'cong_settings.format_24h_enabled': format24h,
        'cong_settings.attendance_online_record': onlineRecord,
        'cong_settings.first_day_week': firstDayWeek,
        'cong_settings.schedule_songs_weekend': weekendSongs,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
      });

      await refreshLocalesResources();

      displaySnackNotification({
        severity: 'success',
        header: t('tr_newLangGroupCreatedSuccess'),
        message: t('tr_newLangGroupCreatedSuccessDesc', {
          LanguageGroupName: group.group_data.name,
        }),
      });

      onClose();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: t('error_app_generic-title'),
        message: (error as Error).message,
      });
    }
  };

  return {
    step,
    handleNext,
    group,
    handleGroupChange,
    language,
    handleChangeLanguage,
    handleCreateGroup,
    circuit,
    handleChangeCircuit,
  };
};

export default useGroupAdd;
