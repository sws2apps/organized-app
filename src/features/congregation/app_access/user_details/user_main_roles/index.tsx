import { useAppTranslation } from '@hooks/index';
import useUserDetails from '../useUserDetails';
import useUserMainRoles from './useUserMainRoles';
import Checkbox from '@components/checkbox';
import Divider from '@components/divider';
import Typography from '@components/typography';

const UserMainRoles = () => {
  const { t } = useAppTranslation();

  const { isProcessing } = useUserDetails();

  const {
    isAdmin,
    handleToggleAdmin,
    handleToggleCoordinator,
    isCoordinator,
    handleToggleSecretary,
    isSecretary,
    handleToggleServiceOverseer,
    isServiceOverseer,
  } = useUserMainRoles();

  return (
    <>
      <Typography className="h4" color="var(--grey-400)">
        {t('tr_roles')}
      </Typography>

      <Checkbox
        label={t('tr_coordinator')}
        labelDescription={t('tr_coordinatorRoleDesc')}
        sx={{ paddingLeft: '7px' }}
        readOnly={isProcessing}
        checked={isCoordinator}
        onChange={(e) => handleToggleCoordinator(e.target.checked)}
      />

      <Checkbox
        label={t('tr_secretary')}
        labelDescription={t('tr_secretaryRoleDesc')}
        sx={{ paddingLeft: '7px' }}
        readOnly={isProcessing}
        checked={isSecretary}
        onChange={(e) => handleToggleSecretary(e.target.checked)}
      />

      <Checkbox
        label={t('tr_appAdministrator')}
        labelDescription={t('tr_appAdminRoleDesc')}
        sx={{ paddingLeft: '7px' }}
        readOnly={isProcessing}
        checked={isAdmin}
        onChange={(e) => handleToggleAdmin(e.target.checked)}
      />

      <Checkbox
        label={t('tr_serviceOverseer')}
        labelDescription={t('tr_serviceOverseerRoleDesc')}
        sx={{ paddingLeft: '7px' }}
        readOnly={isProcessing}
        checked={isServiceOverseer}
        onChange={(e) => handleToggleServiceOverseer(e.target.checked)}
      />

      <Divider color="var(--accent-200)" />
    </>
  );
};

export default UserMainRoles;
