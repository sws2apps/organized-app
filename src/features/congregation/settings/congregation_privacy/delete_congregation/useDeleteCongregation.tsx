import { useState } from 'react';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiCongregationDelete } from '@services/api/congregation';
import { userSignOut } from '@services/firebase/auth';
import { handleDeleteDatabase } from '@services/app';

const useDeleteCongregation = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [masterKey, setMasterKey] = useState('');

  const handleDeleteOpen = () => setModalOpen(true);

  const handleDeleteClose = () => setModalOpen(false);

  const handleDelete = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      await apiCongregationDelete(masterKey);

      await userSignOut();
      await handleDeleteDatabase();
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    modalOpen,
    handleDeleteOpen,
    handleDeleteClose,
    handleDelete,
    isProcessing,
    masterKey,
    setMasterKey,
  };
};

export default useDeleteCongregation;
