import { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { settingsState, userDataViewState } from '@states/settings';
import { dutiesSaveSettings } from '@services/app/duties';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { DutyItemProps } from './index.types';

const useDutyItem = ({ id }: DutyItemProps) => {
  const { laptopDown } = useBreakpoints();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleOpenForm = () => setFormOpen(true);

  const handleCloseForm = () => setFormOpen(false);

  const handleAskDelete = () => {
    setFormOpen(false);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => setDeleteOpen(false);

  const handleDelete = async () => {
    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);

      if (!duties) return;

      const duty = duties.custom.find((duty) => duty.id === id)!;

      duty._deleted = true;
      duty.updatedAt = new Date().toISOString();

      await dutiesSaveSettings(meetingDuties);

      setDeleteOpen(false);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : String(error)
        ),
        severity: 'error',
      });
    }
  };

  const handleHover = () => {
    if (laptopDown) return;

    setShowEdit(true);
  };

  const handleUnhover = () => {
    if (laptopDown) return;

    setShowEdit(false);
  };

  const handleAmountChange = async (e: SelectChangeEvent<unknown>) => {
    const value = Number(e.target.value);

    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);

      if (!duties) return;

      const duty = duties.custom.find((duty) => duty.id === id)!;

      duty.amount = value;
      duty.updatedAt = new Date().toISOString();

      await dutiesSaveSettings(meetingDuties);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : String(error)
        ),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (laptopDown) {
      setShowEdit(true);
    } else {
      setShowEdit(false);
    }
  }, [laptopDown]);

  return {
    formOpen,
    handleOpenForm,
    handleCloseForm,
    deleteOpen,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
    showEdit,
    handleHover,
    handleUnhover,
    handleAmountChange,
  };
};

export default useDutyItem;
