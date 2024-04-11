import { Box, MenuItem, useTheme } from '@mui/material';
import { Button, PageTitle, InfoTip } from '@components/index';
import { IconArrowLink, IconCheckCircle, IconInfo, IconUndo } from '@components/icons';
import Typography from '@components/typography';
import Select from '@components/select';
import { useAppTranslation } from '@hooks/index';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import SubmitReport from './components/submit_report';
import { BranchOfficePageStateType, BranchReportsList, type BranchOfficeReportType } from './index.types';
import { BranchS10ReportResult, BranchS1ReportResult } from './components/report_results';
import { s10reportMockData, s1reportMockData } from './index.mock';
import BranchReportToolbar from './components/report_toolbar';
import { BranchOfficeReportToolbarData } from './components/report_toolbar/index.types';
import { congNameState } from '@states/settings';
import { useRecoilValue } from 'recoil';
import { displaySnackNotification } from '@services/recoil/app';

const BranshOfficeReportsPage = () => {
  const theme = useTheme();
  const congName = useRecoilValue(congNameState);
  const desktopView = useMediaQuery(theme.breakpoints.up('desktop'), {
    noSsr: true,
  });

  const { t } = useAppTranslation();

  const [pageState, setPageState] = useState<BranchOfficePageStateType>('initial');

  const [reportType, setReportType] = useState<BranchOfficeReportType>('s1');

  const [isReportSubmit, setIsReportSubmit] = useState<boolean>(false);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const onSubmitReport = async () => {
    setIsReportSubmit(false);
    setReportSubmitted(true);
    await displaySnackNotification({
      header: t('tr_done'),
      message: t('tr_doneDesc'),
      severity: 'success',
    });
  };

  const onGenerateReport = (data: BranchOfficeReportToolbarData) => {
    setPageState('generating');
    const timer = setTimeout(() => {
      setPageState('generated');
    }, 5000);

    return () => clearTimeout(timer);
  };

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_branchOfficeReport')}
        backTo="/"
        buttons={
          reportSubmitted ? (
            <Button variant="main" color="orange" startIcon={<IconUndo />} onClick={() => setReportSubmitted(false)}>
              {t('tr_undoSubmission')}
            </Button>
          ) : (
            <>
              <Button variant="secondary" disabled={pageState !== 'generated'} startIcon={<IconArrowLink />}>
                Submit on JW
              </Button>
              <Button
                variant="main"
                disabled={pageState !== 'generated'}
                onClick={() => setIsReportSubmit(true)}
                startIcon={<IconCheckCircle />}
              >
                {t('tr_markAsSubmitted')}
              </Button>
            </>
          )
        }
      />

      {isReportSubmit && (
        <SubmitReport
          open={isReportSubmit}
          onSubmit={onSubmitReport}
          onClose={() => setIsReportSubmit(false)}
          header={t('tr_markToBranchOffice')}
          body={t('tr_markToBranchOfficeDesc')}
        />
      )}

      <Box sx={{ display: 'flex', flexDirection: desktopView ? 'row' : 'column', gap: '16px' }}>
        <Box
          sx={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--accent-300)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px',
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            height: 'min-content',
            flex: desktopView && 19,
          }}
        >
          <Select
            label={'Choose report'}
            value={reportType}
            onChange={(e) => setReportType(e.target.value as BranchOfficeReportType)}
          >
            {BranchReportsList.map((reportName, index) => (
              <MenuItem key={`report-${index.toString()}`} value={reportName}>
                <Typography className="body-regular" color="var(--black)">
                  {t('tr_' + reportName + 'Report')}
                </Typography>
              </MenuItem>
            ))}
          </Select>
          <Divider />
          <BranchReportToolbar pageState={pageState} reportType={reportType} onGenerateReport={onGenerateReport} />
        </Box>
        <Box sx={{ flex: desktopView && 15 }}>
          {pageState !== 'generated' ? (
            <InfoTip isBig={false} icon={<IconInfo />} color="white" text={t('tr_branchOfficeReportMonthsDesc')} />
          ) : reportType === 's1' ? (
            BranchS1ReportResult(s1reportMockData, t)
          ) : (
            BranchS10ReportResult(s10reportMockData, t, congName)
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BranshOfficeReportsPage;
