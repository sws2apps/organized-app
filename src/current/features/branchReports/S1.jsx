import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import Grid from '@mui/material/Grid';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OutboundIcon from '@mui/icons-material/Outbound';
import ReplayIcon from '@mui/icons-material/Replay';
import Typography from '@mui/material/Typography';
import S1Summary from './S1Summary';
import S1Total from './S1Total';
import S1Publishers from './S1Publishers';
import S1AuxiliaryPioneers from './S1AuxiliaryPioneers';
import S1RegularPioneers from './S1RegularPioneers';
import { S1s } from '../../classes/S1s';
import UserModal from '../../components/UserModal';

const gridViews = {
  xs: 12,
  sm: 6,
  md: 4,
  lg: 3,
};

const S1 = ({ serviceYear, month }) => {
  const { t } = useTranslation('ui');

  const [isFinalized, setIsFinalized] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGenerateS1 = async () => {
    setIsLoading(true);
    const currentReport = S1s.get(month);
    await currentReport.generate();
    setIsRefresh((prev) => !prev);
    setIsLoading(false);
  };

  const handleMarkSubmitted = async () => {
    const currentReport = S1s.get(month);
    await currentReport.setAsSubmitted();
    setIsConfirm(false);
    setIsRefresh((prev) => !prev);
  };

  const handleUndoSubmission = async () => {
    const currentReport = S1s.get(month);
    await currentReport.undoSubmission();
    setIsRefresh((prev) => !prev);
  };

  useEffect(() => {
    const currentReport = S1s.get(month);
    if (currentReport) {
      setIsFinalized(currentReport.details.isFinalized);
      setIsSubmitted(currentReport.details.isSubmitted);
      setDetails(currentReport.details);
    }
    setIsLoading(false);
  }, [month, isRefresh]);

  useEffect(() => {
    const initializeS1Month = async () => {
      await S1s.create(serviceYear, month);
    };

    if (serviceYear && month) initializeS1Month();
  }, [serviceYear, month]);

  return (
    <Box>
      {isConfirm && (
        <UserModal
          fullScreen={fullScreen}
          title={t('reportSubmittedBranchTitle')}
          open={isConfirm}
          setOpen={(value) => setIsConfirm(value)}
          action={handleMarkSubmitted}
        >
          <Markup content={t('reportSubmitConfirm')} />
          <Typography>{t('continueConfirmMessage')}</Typography>
        </UserModal>
      )}

      {isLoading && (
        <CircularProgress
          color="secondary"
          size={60}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '30px auto',
          }}
        />
      )}
      {!isLoading && (
        <>
          {!isFinalized && (
            <Box>
              <Typography>{t('S1ReportNotFinalized')}</Typography>
              <Button
                variant="outlined"
                startIcon={<FlashOnIcon />}
                sx={{ marginTop: '10px' }}
                onClick={handleGenerateS1}
              >
                {t('generate')}
              </Button>
            </Box>
          )}
          {isFinalized && (
            <Box>
              <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                {!isSubmitted && (
                  <Button variant="outlined" color="secondary" startIcon={<FlashOnIcon />} onClick={handleGenerateS1}>
                    {t('regenerate')}
                  </Button>
                )}

                {!isSubmitted && (
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    target="_blank"
                    rel="noopener"
                    href="https://hub.jw.org/congregation-reports"
                    sx={{ textTransform: 'none' }}
                  >
                    JW Hub
                  </Button>
                )}

                {!isSubmitted && (
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<OutboundIcon />}
                    onClick={() => setIsConfirm(true)}
                  >
                    {t('setBranchSubmitted')}
                  </Button>
                )}

                {isSubmitted && (
                  <Button variant="outlined" color="warning" startIcon={<ReplayIcon />} onClick={handleUndoSubmission}>
                    {t('undoSubmit')}
                  </Button>
                )}
              </Box>
              <Box sx={{ padding: '0 10px' }}>
                <Grid container spacing={2}>
                  <S1Summary
                    activePublishers={details.activePublishers}
                    weekendMeetingAttendanceAvg={details.weekendMeetingAttendanceAvg}
                    gridViews={gridViews}
                  />
                  <Grid container spacing={2} sx={{ paddingLeft: '15px' }}>
                    <S1Total
                      totalReports={details.totalReports}
                      totalPlacements={details.totalPlacements}
                      totalVideos={details.totalVideos}
                      totalHours={details.totalHours}
                      totalReturnVisits={details.totalReturnVisits}
                      totalBibleStudies={details.totalBibleStudies}
                      gridViews={gridViews}
                    />
                    <S1Publishers
                      publishersReports={details.publishersReports}
                      publishersPlacements={details.publishersPlacements}
                      publishersVideos={details.publishersVideos}
                      publishersHours={details.publishersHours}
                      publishersReturnVisits={details.publishersReturnVisits}
                      publishersBibleStudies={details.publishersBibleStudies}
                      gridViews={gridViews}
                    />
                    <S1AuxiliaryPioneers
                      auxPioneersReports={details.auxPioneersReports}
                      auxPioneersPlacements={details.auxPioneersPlacements}
                      auxPioneersVideos={details.auxPioneersVideos}
                      auxPioneersHours={details.auxPioneersHours}
                      auxPioneersReturnVisits={details.auxPioneersReturnVisits}
                      auxPioneersBibleStudies={details.auxPioneersBibleStudies}
                      gridViews={gridViews}
                    />
                    <S1RegularPioneers
                      FRReports={details.FRReports}
                      FRPlacements={details.FRPlacements}
                      FRVideos={details.FRVideos}
                      FRHours={details.FRHours}
                      FRReturnVisits={details.FRReturnVisits}
                      FRBibleStudies={details.FRBibleStudies}
                      gridViews={gridViews}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default S1;
