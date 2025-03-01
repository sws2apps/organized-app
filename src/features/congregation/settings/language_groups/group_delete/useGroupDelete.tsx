import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { languageGroupsState, settingsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { personsState } from '@states/persons';
import { GroupDeleteProps } from './index.types';
import { dbPersonsBulkSave } from '@services/dexie/persons';

const useGroupDelete = ({ group }: GroupDeleteProps) => {
  const { t } = useAppTranslation();

  const languageGroups = useRecoilValue(languageGroupsState);
  const persons = useRecoilValue(personsState);
  const settings = useRecoilValue(settingsState);

  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const circuit = useMemo(() => {
    return (
      settings.cong_settings.cong_circuit.find(
        (record) => record.type === group.id
      )?.value || ''
    );
  }, [settings, group.id]);

  const group_name = useMemo(() => {
    if (!group) return '';

    return `${group.name}, ${circuit}`;
  }, [group, circuit]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const groups = structuredClone(languageGroups);
      const findGroup = groups.find((record) => record.id === group.id);

      findGroup._deleted = true;
      findGroup.updatedAt = new Date().toISOString();

      const sourceLanguages = structuredClone(
        settings.cong_settings.source_material.language
      );

      const findSource = sourceLanguages.find(
        (record) => record.type === group.id
      );

      if (findSource) {
        findSource._deleted = true;
        findSource.updatedAt = new Date().toISOString();
      }

      const circuits = structuredClone(settings.cong_settings.cong_circuit);
      const findCircuit = circuits.find((record) => record.type === group.id);

      if (findCircuit) {
        findCircuit._deleted = true;
        findCircuit.updatedAt = new Date().toISOString();
      }

      const displayName = structuredClone(
        settings.cong_settings.display_name_enabled
      );

      const findDisplayName = displayName.find(
        (record) => record.type === group.id
      );

      if (findDisplayName) {
        findDisplayName._deleted = true;
        findDisplayName.updatedAt = new Date().toISOString();
      }

      const fullnameOption = structuredClone(
        settings.cong_settings.fullname_option
      );

      const findOption = fullnameOption.find(
        (record) => record.type === group.id
      );

      if (findOption) {
        findOption._deleted = true;
        findOption.updatedAt = new Date().toISOString();
      }

      const shortDateFormat = structuredClone(
        settings.cong_settings.short_date_format
      );

      const findFormat = shortDateFormat.find(
        (record) => record.type === group.id
      );

      if (findFormat) {
        findFormat._deleted = true;
        findFormat.updatedAt = new Date().toISOString();
      }

      const format24h = structuredClone(
        settings.cong_settings.format_24h_enabled
      );

      const find24h = format24h.find((record) => record.type === group.id);

      if (find24h) {
        find24h._deleted = true;
        find24h.updatedAt = new Date().toISOString();
      }

      const onlineRecord = structuredClone(
        settings.cong_settings.attendance_online_record
      );

      const findOnline = onlineRecord.find(
        (record) => record.type === group.id
      );

      if (findOnline) {
        findOnline._deleted = true;
        findOnline.updatedAt = new Date().toISOString();
      }

      const midweekMeeting = structuredClone(
        settings.cong_settings.midweek_meeting
      );

      const findMidweek = midweekMeeting.find(
        (record) => record.type === group.id
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
        (record) => record.type === group.id
      );

      if (findWeekend) {
        findWeekend._deleted = {
          value: true,
          updatedAt: new Date().toISOString(),
        };
      }

      const weekStart = structuredClone(
        settings.cong_settings.week_start_sunday
      );

      const findStart = weekStart.find((record) => record.type === group.id);

      if (findStart) {
        findStart._deleted = true;
        findStart.updatedAt = new Date().toISOString();
      }

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': groups,
        'cong_settings.source_material.language': sourceLanguages,
        'cong_settings.cong_circuit': circuits,
        'cong_settings.display_name_enabled': displayName,
        'cong_settings.fullname_option': fullnameOption,
        'cong_settings.short_date_format': shortDateFormat,
        'cong_settings.format_24h_enabled': format24h,
        'cong_settings.attendance_online_record': onlineRecord,
        'cong_settings.week_start_sunday': weekStart,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
      });

      const personsToUpdate = persons
        .filter((record) =>
          record.person_data.categories.value?.includes(group.id)
        )
        .map((record) => {
          const person = structuredClone(record);

          person.person_data.categories.value =
            person.person_data.categories.value.filter((c) => c !== group.id);
          person.person_data.categories.updatedAt = new Date().toISOString();

          return person;
        });

      await dbPersonsBulkSave(personsToUpdate);

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
