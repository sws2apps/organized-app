import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';

const UserEmailField = ({ userEmail, setUserEmail, hasErrorEmail }) => {
  const { t } = useTranslation('ui');

  return (
    <TextField
      sx={{ marginTop: '20px', width: '100%' }}
      id="outlined-email"
      label={t('email')}
      variant="outlined"
      autoComplete="off"
      required
      value={userEmail}
      onChange={(e) => setUserEmail(e.target.value)}
      error={hasErrorEmail ? true : false}
    />
  );
};

export default UserEmailField;
