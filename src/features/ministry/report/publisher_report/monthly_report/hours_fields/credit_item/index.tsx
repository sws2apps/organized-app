import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useCreditItem from './useCreditItem';
import Typography from '@components/typography';

const CreditItem = () => {
  const { t } = useAppTranslation();

  const { total_hours } = useCreditItem();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}
    >
      <Typography>{t('tr_creditHours')}</Typography>

      <Typography
        className="h3"
        color={total_hours === '0:00' ? 'var(--accent-350)' : 'var(--black)'}
      >
        {total_hours}
      </Typography>
    </Box>
  );
};

export default CreditItem;
