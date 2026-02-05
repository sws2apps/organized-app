import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { IconArrowLink, IconCheckCircle, IconUndo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import {
  branchSelectedMonthState,
  branchSelectedReportState,
  branchSelectedYearState,
} from '@states/branch_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';
import NavBarButton from '@components/nav_bar_button';

const useBranchOffice = () => {
  const { t } = useAppTranslation();

  const report = useAtomValue(branchSelectedReportState);
  const year = useAtomValue(branchSelectedYearState);
  const month = useAtomValue(branchSelectedMonthState);
  const fieldReports = useAtomValue(branchFieldReportsState);
  const congAnalysis = useAtomValue(branchCongAnalysisState);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const fieldReport = useMemo(() => {
    if (report !== 'S-1') return;

    return fieldReports.find((record) => record.report_date === month);
  }, [report, fieldReports, month]);

  const analysisReport = useMemo(() => {
    if (report !== 'S-10') return;

    return congAnalysis.find((record) => record.report_date === year);
  }, [report, congAnalysis, year]);

  const generated = useMemo(() => {
    if (report === 'S-1') {
      return fieldReport ? true : false;
    }

    if (report === 'S-10') {
      return analysisReport ? true : false;
    }

    return false;
  }, [report, fieldReport, analysisReport]);

  const submitted = useMemo(() => {
    if (!generated) return false;

    if (report === 'S-1') {
      return fieldReport.report_data.submitted;
    }

    if (report === 'S-10') {
      return analysisReport.report_data.submitted;
    }

    return false;
  }, [report, generated, fieldReport, analysisReport]);

  const handleOpenHuB = () => {
    window.open('https://hub.jw.org', '_blank', 'noopener');
  };

  const handleOpenSubmit = () => setSubmitOpen(true);

  const handleCloseSubmit = () => setSubmitOpen(false);

  const handleOpenWithdraw = () => setWithdrawOpen(true);

  const handleCloseWithdraw = () => setWithdrawOpen(false);

  const buttons = useMemo(() => {
    return (
      <>
        {!submitted && (
          <>
            <NavBarButton
              text={t('tr_jWHub')}
              disabled={!generated}
              icon={<IconArrowLink />}
              onClick={handleOpenHuB}
            ></NavBarButton>
            <NavBarButton
              text={t('tr_btnSubmitted')}
              main
              disabled={!generated}
              icon={<IconCheckCircle />}
              onClick={handleOpenSubmit}
            ></NavBarButton>
          </>
        )}

        {submitted && (
          <NavBarButton
            text={t('tr_undoSubmission')}
            main
            color="orange"
            icon={<IconUndo />}
            onClick={handleOpenWithdraw}
          ></NavBarButton>
        )}
      </>
    );
  }, [t, submitted, generated]);

  return {
    buttons,
    submitOpen,
    handleCloseSubmit,
    handleCloseWithdraw,
    withdrawOpen,
  };
};

export default useBranchOffice;
