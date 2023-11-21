import PropTypes from 'prop-types';
import { useAppTranslation } from '@hooks';
import { MenuItem, TextField } from '@mui/material';

const CongregationRole = ({ role, setRole }) => {
  const { t } = useAppTranslation();

  return (
    <TextField
      id="outlined-select-type"
      select
      label={t('mainRoleLabel')}
      size="medium"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      sx={{ minWidth: '250px' }}
    >
      <MenuItem value="coordinator">{t('roleCoordinator')}</MenuItem>
      <MenuItem value="secretary">{t('roleSecretary')}</MenuItem>
      <MenuItem value="lmmo">{t('roleLMMO')}</MenuItem>
      <MenuItem value="public_talk_coordinator">{t('rolePublicTalkCoordinator')}</MenuItem>
    </TextField>
  );
};

CongregationRole.propTypes = {
  role: PropTypes.string,
  setRole: PropTypes.func.isRequired,
};

export default CongregationRole;
