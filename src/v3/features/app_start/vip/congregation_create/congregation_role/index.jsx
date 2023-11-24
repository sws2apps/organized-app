import PropTypes from 'prop-types';
import { MenuItem } from '@mui/material';
import { Select, Typography } from '@components';
import { IconRole } from '@icons';
import { useAppTranslation } from '@hooks';

const CongregationRole = ({ role, setRole }) => {
  const { t } = useAppTranslation();

  const roles = [
    { value: 'admin', label: t('roleAdmin') },
    { value: 'coordinator', label: t('roleCoordinator') },
    { value: 'secretary', label: t('roleSecretary') },
    { value: 'lmmo', label: t('roleLMMO') },
    { value: 'public_talk_coordinator', label: t('rolePublicTalkCoordinator') },
  ];

  return (
    <Select
      label={t('mainRoleLabel')}
      value={role}
      onChange={(e) => setRole(e.target.value)}
      height={48}
      startIcon={<IconRole color="var(--black)" />}
    >
      {roles.map((role) => (
        <MenuItem
          key={role.value}
          sx={{
            padding: '8px 12px 8px 16px !important',
            minHeight: '36px !important',
            backgroundColor: 'transparent',
            borderBottom: '1px solid var(--accent-200)',
            '&:hover': {
              backgroundColor: 'var(--accent-100)',
              '& p': {
                color: 'var(--accent-dark)',
              },
            },
            '&:last-child': {
              borderBottom: 'none',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--accent-100)',
              '& p': {
                color: 'var(--accent-dark)',
              },
            },
            '&.Mui-selected:focus': {
              backgroundColor: 'var(--accent-100)',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'var(--accent-100)',
            },
          }}
          value={role.value}
        >
          <Typography>{role.label}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

CongregationRole.propTypes = {
  role: PropTypes.string,
  setRole: PropTypes.func.isRequired,
};

export default CongregationRole;
