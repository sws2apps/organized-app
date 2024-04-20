import { Box } from '@mui/material';
import AppLoading from '@components/loading';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useStart from './useStart';

const DemoStatup = () => {
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
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography align="center" className="h2">
          {t('tr_testAppWelcome')}
        </Typography>

        <AppLoading text={t('tr_testAppWaitForData')} />
      </Box>
    </Box>
  );
};

export default DemoStatup;
