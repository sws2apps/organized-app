import { ChangeEvent, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { settingsState, userDataViewState } from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { DutyItemProps } from './index.types';

const useDutyItem = ({ id }: DutyItemProps) => {
  const { laptopDown } = useBreakpoints();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const [formOpen, setFormOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleOpenForm = () => setFormOpen(true);

  const handleCloseForm = () => setFormOpen(false);

  const handleHover = () => {
    if (laptopDown) return;

    setShowEdit(true);
  };

  const handleUnhover = () => {
    if (laptopDown) return;

    setShowEdit(false);
  };

  const handleAmountChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as unknown as number;

    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);

      const duty = duties.custom.find((duty) => duty.id === id)!;

      duty.amount = value;
      duty.updatedAt = new Date().toISOString();

      await dbAppSettingsUpdate({
        'cong_settings.meeting_duties': meetingDuties,
      });
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
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
    showEdit,
    handleHover,
    handleUnhover,
    handleAmountChange,
  };
};

export default useDutyItem;
