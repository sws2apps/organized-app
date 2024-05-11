import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';

const OutgoingSpeakersListActive = () => {
  const { t } = useAppTranslation();

  return (
    <Box>
      <Typography color="var(--grey-400)">{t('tr_outgoingSpeakersAccessActiveDesc')}</Typography>
    </Box>
  );
};

export default OutgoingSpeakersListActive;
