import { useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesSectionsState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMicSections = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const sections = useAtomValue(dutiesSectionsState);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editId, setEditId] = useState<string | undefined>();

  const handleOpenAdd = () => {
    setEditId(undefined);
    setFormOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditId(id);
    setFormOpen(true);
  };

  const handleCloseForm = () => setFormOpen(false);

  const handleAskDelete = (id: string) => setDeleteId(id);

  const handleCloseDelete = () => setDeleteId('');

  const handleDelete = async () => {
    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);
      const section = duties.sections?.find(
        (section) => section.id === deleteId
      );

      if (section) {
        section._deleted = true;
        section.updatedAt = new Date().toISOString();

        await dbAppSettingsUpdate({
          'cong_settings.meeting_duties': meetingDuties,
        });
      }

      setDeleteId('');
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    sections,
    formOpen,
    editId,
    deleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleCloseForm,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
  };
};

export default useMicSections;
