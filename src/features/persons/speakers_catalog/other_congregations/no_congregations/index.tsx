import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import InfoNote from '@components/info_note';

const NoCongregations = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        padding: '16px',
        backgroundColor: 'var(--accent-150)',
        border: '1px dashed var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <InfoNote message={t('tr_noCongregationsYetInfo')} color="accent" />
    </Box>
  );
};

export default NoCongregations;
