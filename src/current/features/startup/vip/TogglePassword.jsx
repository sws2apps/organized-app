import { useTranslation } from 'react-i18next';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

const TogglePassword = ({ showPwd, togglePwd }) => {
  const { t } = useTranslation('ui');

  return (
    <FormControlLabel
      control={<Checkbox id="checkShowPwd" checked={showPwd} onChange={togglePwd} />}
      label={<Typography sx={{ lineHeight: 1.2 }}>{t('showPassword')}</Typography>}
      sx={{
        width: '100%',
        marginTop: '15px',
      }}
    />
  );
};

export default TogglePassword;
