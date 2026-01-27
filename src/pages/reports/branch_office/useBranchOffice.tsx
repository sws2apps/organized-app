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
import Button from '@components/button';

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
            <Button
              variant="secondary"
              disabled={!generated}
              startIcon={<IconArrowLink />}
              onClick={handleOpenHuB}
            >
              {t('tr_jWHub')}
            </Button>
            <Button
              variant="main"
              disabled={!generated}
              startIcon={<IconCheckCircle />}
              onClick={handleOpenSubmit}
            >
              {t('tr_btnSubmitted')}
            </Button>
          </>
        )}

        {submitted && (
          <Button
            variant="main"
            color="orange"
            startIcon={<IconUndo />}
            onClick={handleOpenWithdraw}
          >
            {t('tr_undoSubmission')}
          </Button>
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
