import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { GroupDeleteProps } from './index.types';
import { languageGroupsState } from '@states/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import { settingSchema } from '@services/dexie/schema';

const useGroupDelete = ({ group }: GroupDeleteProps) => {
  const { t } = useAppTranslation();

  const languageGroups = useAtomValue(languageGroupsState);
  const settings = useAtomValue(settingsState);

  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const circuit = useMemo(() => {
    return (
      settings.cong_settings.cong_circuit.find(
        (record) => record.type === group.group_id
      )?.value ?? ''
    );
  }, [settings, group.group_id]);

  const group_name = useMemo(() => {
    if (!group) return '';

    return `${group.group_data.name}, ${circuit}`;
  }, [group, circuit]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const groups = structuredClone(languageGroups);

      const findGroup = groups.find(
        (record) => record.group_id === group.group_id
      );

      findGroup.group_data._deleted = true;
      findGroup.group_data.updatedAt = new Date().toISOString();

      const sourceLanguages = structuredClone(
        settings.cong_settings.source_material.language
      );

      const findSource = sourceLanguages.find(
        (record) => record.type === group.group_id
      );

      if (findSource) {
        findSource._deleted = true;
        findSource.updatedAt = new Date().toISOString();
      }

      const circuits = structuredClone(settings.cong_settings.cong_circuit);
      const findCircuit = circuits.find(
        (record) => record.type === group.group_id
      );

      if (findCircuit) {
        findCircuit._deleted = true;
        findCircuit.updatedAt = new Date().toISOString();
      }

      const displayName = structuredClone(
        settings.cong_settings.display_name_enabled
      );

      const findDisplayName = displayName.find(
        (record) => record.type === group.group_id
      );

      if (findDisplayName) {
        findDisplayName._deleted = true;
        findDisplayName.updatedAt = new Date().toISOString();
      }

      const fullnameOption = structuredClone(
        settings.cong_settings.fullname_option
      );

      const findOption = fullnameOption.find(
        (record) => record.type === group.group_id
      );

      if (findOption) {
        findOption._deleted = true;
        findOption.updatedAt = new Date().toISOString();
      }

      const shortDateFormat = structuredClone(
        settings.cong_settings.short_date_format
      );

      const findFormat = shortDateFormat.find(
        (record) => record.type === group.group_id
      );

      if (findFormat) {
        findFormat._deleted = true;
        findFormat.updatedAt = new Date().toISOString();
      }

      const format24h = structuredClone(
        settings.cong_settings.format_24h_enabled
      );

      const find24h = format24h.find(
        (record) => record.type === group.group_id
      );

      if (find24h) {
        find24h._deleted = true;
        find24h.updatedAt = new Date().toISOString();
      }

      const onlineRecord = structuredClone(
        settings.cong_settings.attendance_online_record
      );

      const findOnline = onlineRecord.find(
        (record) => record.type === group.group_id
      );

      if (findOnline) {
        findOnline._deleted = true;
        findOnline.updatedAt = new Date().toISOString();
      }

      const midweekMeeting = structuredClone(
        settings.cong_settings.midweek_meeting
      );

      const findMidweek = midweekMeeting.find(
        (record) => record.type === group.group_id
      );

      if (findMidweek) {
        findMidweek._deleted = {
          value: true,
          updatedAt: new Date().toISOString(),
        };
      }

      const weekendMeeting = structuredClone(
        settings.cong_settings.weekend_meeting
      );

      const findWeekend = weekendMeeting.find(
        (record) => record.type === group.group_id
      );

      if (findWeekend) {
        findWeekend._deleted = {
          value: true,
          updatedAt: new Date().toISOString(),
        };
      }

      const firstDayWeek = structuredClone(
        settings.cong_settings.first_day_week ||
          settingSchema.cong_settings.first_day_week
      );

      const findFirstDay = firstDayWeek.find(
        (record) => record.type === group.group_id
      );

      if (findFirstDay) {
        findFirstDay._deleted = true;
        findFirstDay.updatedAt = new Date().toISOString();
      }

      const weekendSongs = structuredClone(
        settings.cong_settings.schedule_songs_weekend ||
          settingSchema.cong_settings.schedule_songs_weekend
      );

      const findSongs = weekendSongs.find(
        (record) => record.type === group.group_id
      );

      if (findSongs) {
        findSongs._deleted = true;
        findSongs.updatedAt = new Date().toISOString();
      }

      await dbAppSettingsUpdate({
        'cong_settings.source_material.language': sourceLanguages,
        'cong_settings.cong_circuit': circuits,
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

      await dbFieldServiceGroupSave(findGroup);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: t('error_app_generic-title'),
        message: (error as Error).message,
      });
    }
  };

  return {
    group_name,
    open,
    handleOpen,
    handleClose,
    isProcessing,
    handleDelete,
  };
};

export default useGroupDelete;
