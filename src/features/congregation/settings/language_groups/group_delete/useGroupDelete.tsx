import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { languageGroupsState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { personsState } from '@states/persons';
import { GroupDeleteProps } from './index.types';
import { dbPersonsBulkSave } from '@services/dexie/persons';

const useGroupDelete = ({ group }: GroupDeleteProps) => {
  const { t } = useAppTranslation();

  const languageGroups = useRecoilValue(languageGroupsState);
  const persons = useRecoilValue(personsState);

  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const group_name = useMemo(() => {
    if (!group) return '';

    return `${group.name}, ${group.circuit}`;
  }, [group]);

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

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': groups,
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
