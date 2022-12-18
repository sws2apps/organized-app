import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CongregationPersons } from '../features/congregationPersons';

const Administration = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography sx={{ margin: '0px 0px 20px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {t('administration.heading')}
      </Typography>

      <CongregationPersons />
    </Box>
  );
};

export default Administration;
