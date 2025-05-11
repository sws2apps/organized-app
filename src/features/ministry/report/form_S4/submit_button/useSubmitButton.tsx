import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { FormS4Props } from '../index.types';
import { settingsState } from '@states/settings';
import { congAccountConnectedState } from '@states/app';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useSubmitButton = ({ month, person_uid, publisher }: FormS4Props) => {
  const settings = useAtomValue(settingsState);
  const isConnected = useAtomValue(congAccountConnectedState);

  const { status, shared_ministry } = useMinistryMonthlyRecord({
    month,
    person_uid,
    publisher,
  });

  const disabled = useMemo(() => {
    if (!isConnected) return true;

    if (!settings.cong_settings.data_sync.value) {
      return true;
    }

    if (status === 'confirmed') return true;

    return !shared_ministry;
  }, [isConnected, settings, shared_ministry, status]);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const handleCloseSubmit = () => setSubmitOpen(false);

  const handleCloseWithdraw = () => setWithdrawOpen(false);

  const handleOpenModal = () => {
    if (status === 'pending') {
      setSubmitOpen(true);
    }

    if (status === 'submitted' || status === 'received') {
      setWithdrawOpen(true);
    }
  };

  return {
    status,
    disabled,
    submitOpen,
    withdrawOpen,
    handleCloseSubmit,
    handleCloseWithdraw,
    handleOpenModal,
  };
};

export default useSubmitButton;
