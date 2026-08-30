import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useStart from './useStart';
import LottieLoader from '@components/lottie_loader';
import Typography from '@components/typography';

const DemoStartup = () => {
  const { t } = useAppTranslation();

  useStart();

  return (
    <Box sx={{ height: '70vh', display: 'flex' }}>
      <Box
        sx={{
          maxWidth: '540px',
          margin: 'auto',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 32px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        <LottieLoader size={96} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography className="h2" color="var(--black)">
            {t('tr_testAppMode')}
          </Typography>

          <Typography className="body-small-regular" color="var(--grey-400)">
            {t('tr_testAppWaitForData')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DemoStartup;
