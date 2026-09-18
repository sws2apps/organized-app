import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useStart from './useStart';
import DashboardSkeletonLoader from '@features/dashboard/skeleton_loader';
import LottieLoader from '@components/lottie_loader';
import StepTicker from './step_ticker';
import Typography from '@components/typography';

const fadeIn = {
  '@keyframes demo-startup-fade-in': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  animation: 'demo-startup-fade-in 400ms ease-out both',
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
};

const DemoStartup = () => {
  const { t } = useAppTranslation();

  useStart();

  const steps = useMemo(
    () => [
      t('tr_testAppStepPersons'),
      t('tr_testAppStepCongregation'),
      t('tr_testAppStepGroups'),
      t('tr_testAppStepReports'),
      t('tr_testAppStepAttendance'),
      t('tr_testAppStepMaterials'),
      t('tr_testAppStepSchedules'),
    ],
    [t]
  );

  return (
    <>
      <Box aria-hidden sx={fadeIn}>
        <DashboardSkeletonLoader />
      </Box>

      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: (theme) => theme.zIndex.modal,
          backgroundColor: 'var(--accent-dark-overlay)',
          ...fadeIn,
        }}
      />

      <Box
        role="status"
        aria-busy="true"
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: (theme) => theme.zIndex.modal + 1,
          width: 'calc(100% - 32px)',
          maxWidth: '420px',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--small-card-shadow)',
          padding: '16px 24px 16px 16px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          ...fadeIn,
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <LottieLoader size={56} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography className="h3" color="var(--black)">
            {t('tr_testAppMode')}
          </Typography>

          <StepTicker steps={steps} />
        </Box>
      </Box>
    </>
  );
};

export default DemoStartup;
