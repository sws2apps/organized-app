import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

const LCPartHeading = ({ overrideChecked, setOverrideChecked, label }) => {
  const { t } = useTranslation('ui');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>
        {label}
      </Typography>
      <FormControlLabel
        control={<Checkbox checked={overrideChecked} onChange={(e) => setOverrideChecked(e.target.checked)} />}
        label={t('overridePart')}
      />
    </Box>
  );
};

export default LCPartHeading;
