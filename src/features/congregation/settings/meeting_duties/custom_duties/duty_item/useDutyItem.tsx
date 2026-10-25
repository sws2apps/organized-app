import { useRef, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useAtomValue } from 'jotai';
import { settingsState, userDataViewState } from '@states/settings';
import { dutiesSaveSettings } from '@services/app/duties';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { DutyItemProps } from './index.types';

const useDutyItem = ({ id }: DutyItemProps) => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const busy = useRef(false);

  const handleOpenForm = () => setFormOpen(true);

  const handleCloseForm = () => setFormOpen(false);

  const handleAskDelete = () => {
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    if (!busy.current) setDeleteOpen(false);
  };

  const handleDelete = async () => {
    if (busy.current) return;
    busy.current = true;
    setIsBusy(true);
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
    } finally {
      busy.current = false;
      setIsBusy(false);
    }
  };

  const handleAmountChange = async (e: SelectChangeEvent<unknown>) => {
    if (busy.current) return;
    busy.current = true;
    setIsBusy(true);
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
    } finally {
      busy.current = false;
      setIsBusy(false);
    }
  };

  return {
    formOpen,
    handleOpenForm,
    handleCloseForm,
    deleteOpen,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
    isBusy,
    handleAmountChange,
  };
};

export default useDutyItem;
