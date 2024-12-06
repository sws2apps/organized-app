import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import { settingsState } from '@states/settings';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useMinistryReport = () => {
  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);

  const { status, shared_ministry } = useMinistryMonthlyRecord(selectedMonth);

  const settings = useRecoilValue(settingsState);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const disabled = useMemo(() => {
    if (!settings.cong_settings.data_sync.value) {
      return true;
    }

    if (status === 'confirmed') return true;

    if (status === 'received') return true;

    return !shared_ministry;
  }, [settings, shared_ministry, status]);

  const handleCloseSubmit = () => setSubmitOpen(false);

  const handleCloseWithdraw = () => setWithdrawOpen(false);

  const handleOpenModal = () => {
    if (status === 'pending') {
      setSubmitOpen(true);
    }

    if (status === 'submitted') {
      setWithdrawOpen(true);
    }
  };

  return {
    submitOpen,
    handleOpenModal,
    handleCloseSubmit,
    status,
    handleCloseWithdraw,
    withdrawOpen,
    disabled,
  };
};

export default useMinistryReport;
