import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { settingsState } from '@states/settings';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useMinistryReport = () => {
  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);

  const { status, shared_ministry } = useMinistryMonthlyRecord(selectedMonth);

  const settings = useRecoilValue(settingsState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const reportStatus = useMemo(() => {
    const report = monthlyReports.find(
      (record) => record.report_date === selectedMonth
    );

    if (!report) return status;

    const userStatus = report.report_data.status;

    if (userStatus === 'pending') return 'pending';

    return status;
  }, [status, monthlyReports, selectedMonth]);

  const disabled = useMemo(() => {
    if (!settings.cong_settings.data_sync.value) {
      return true;
    }

    if (status === 'confirmed') return true;

    return !shared_ministry;
  }, [settings, shared_ministry, status]);

  const handleCloseSubmit = () => setSubmitOpen(false);

  const handleCloseWithdraw = () => setWithdrawOpen(false);

  const handleOpenModal = () => {
    if (reportStatus === 'pending') {
      setSubmitOpen(true);
    }

    if (reportStatus === 'submitted' || reportStatus === 'received') {
      setWithdrawOpen(true);
    }
  };

  return {
    submitOpen,
    handleOpenModal,
    handleCloseSubmit,
    handleCloseWithdraw,
    withdrawOpen,
    disabled,
    reportStatus,
  };
};

export default useMinistryReport;
