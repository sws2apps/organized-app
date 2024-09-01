import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useMinistryReport = () => {
  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);

  const { status, shared_ministry } = useMinistryMonthlyRecord(selectedMonth);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

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
    shared_ministry,
  };
};

export default useMinistryReport;
