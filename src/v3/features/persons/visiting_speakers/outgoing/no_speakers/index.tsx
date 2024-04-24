import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';

const NoSpeakers = () => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <IconInfo color="var(--grey-350)" />
      <Typography color="var(--grey-350)">{t('tr_noSpeakersYet')}</Typography>
    </Box>
  );
};

export default NoSpeakers;
