import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useReceivedReports from './useReceivedReports';
import ProgressBar from '@components/progress_bar';
import Typography from '@components/typography';

const ReceivedReports = () => {
  const { t } = useAppTranslation();

  const { publishers_active, received_reports } = useReceivedReports();

  return (
    <Stack spacing="8px">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Typography className="h3">{t('tr_receivedReports')}</Typography>
        <Typography className="body-small-regular" color="var(--accent-400)">
          {t('tr_publishersCountReport', {
            publishersCount: publishers_active,
          })}
        </Typography>
      </Box>

      <ProgressBar value={received_reports} maxValue={publishers_active} />
    </Stack>
  );
};

export default ReceivedReports;
