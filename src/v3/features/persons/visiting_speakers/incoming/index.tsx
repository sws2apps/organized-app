import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconCloudDownload } from '@components/icons';
import useIncoming from './useIncoming';
import Button from '@components/button';
import Typography from '@components/typography';
import NoCongregations from './no_congregations';

const IncomingSpeakers = () => {
  const { t } = useAppTranslation();

  const { incomingCongs } = useIncoming();

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Typography className="h2">{t('tr_otherCongregations')}</Typography>
        <Button variant="secondary" startIcon={<IconCloudDownload color="var(--accent-main)" />}>
          {t('tr_getSpeakers')}
        </Button>
      </Box>

      {incomingCongs.length === 0 && <NoCongregations />}
    </Box>
  );
};

export default IncomingSpeakers;
