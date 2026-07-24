import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { settingsState, userLocalUIDState } from '@states/settings';

/**
 * Editing rights for the Public Witnessing feature.
 *
 * - Everyone can view locations and shifts.
 * - App admins and the service overseer manage locations and can arrange
 *   shifts for others. (A dedicated public witnessing role may be added
 *   later — extend this hook when it lands.)
 */
const usePublicWitnessingPermissions = () => {
  const { isAdmin } = useCurrentUser();
  const userUID = useAtomValue(userLocalUIDState);
  const settings = useAtomValue(settingsState);

  const serviceOverseerUid =
    settings.cong_settings.responsabilities?.service ?? '';
  const isServiceOverseer = Boolean(userUID) && userUID === serviceOverseerUid;

  const canManageLocations = isAdmin || isServiceOverseer;

  return { canManageLocations };
};

export default usePublicWitnessingPermissions;
