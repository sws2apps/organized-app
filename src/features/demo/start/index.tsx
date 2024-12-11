import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useStart from './useStart';
import AppLoading from '@components/loading';
import Typography from '@components/typography';

const DemoStartup = () => {
  const { t } = useAppTranslation();

  useStart();

  return (
    <Box sx={{ height: '70vh', display: 'flex' }}>
      <Box
        sx={{
          maxWidth: '560px',
          margin: 'auto',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          display: 'flex',
          gap: '24px',
          flexDirection: 'column',
        }}
      >
        <Typography className="h2">{t('tr_testAppMode')}</Typography>

        <AppLoading
          type="lottie"
          text={t('tr_testAppWaitForData')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 0,
            '.MuiTypography-root': { textAlign: 'left' },
          }}
        />
      </Box>
    </Box>
  );
};

export default DemoStartup;
