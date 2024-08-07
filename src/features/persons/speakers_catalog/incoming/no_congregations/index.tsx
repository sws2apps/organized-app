import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';

const NoCongregations = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '16px',
        backgroundColor: 'var(--accent-150)',
        border: '1px dashed var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <IconInfo color="var(--accent-400)" />
      <Typography color="var(--accent-400)">
        {t('tr_noCongregationsYetInfo')}
      </Typography>
    </Box>
  );
};

export default NoCongregations;
