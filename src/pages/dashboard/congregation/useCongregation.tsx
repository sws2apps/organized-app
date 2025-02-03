import { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  congAccountConnectedState,
  featureFlagsState,
  isAppDataSyncingState,
  lastAppDataSyncState,
} from '@states/app';
import {
  useAppTranslation,
  useCurrentUser,
  useFirebaseAuth,
} from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { adminRoleState } from '@states/settings';
import worker from '@services/worker/backupWorker';
import { joinRequestsCountState } from '@states/congregation';

const useCongregation = () => {
  const { t } = useAppTranslation();

  const { user } = useFirebaseAuth();

  const { accountType } = useCurrentUser();

  const isSyncing = useRecoilValue(isAppDataSyncingState);
  const lastSync = useRecoilValue(lastAppDataSyncState);
  const isConnected = useRecoilValue(congAccountConnectedState);
  const isUserAdmin = useRecoilValue(adminRoleState);
  const FEATURE_FLAGS = useRecoilValue(featureFlagsState);
  const joinRequestsCount = useRecoilValue(joinRequestsCountState);

  const requests_count = useMemo(() => {
    if (!FEATURE_FLAGS['REQUEST_ACCESS_CONGREGATION']) return;

    if (joinRequestsCount === 0) return;

    return joinRequestsCount.toString();
  }, [FEATURE_FLAGS, joinRequestsCount]);

  const getSecondaryText = () => {
    let label = t('tr_syncAppDataInProgress');

    if (!isSyncing) {
      if (lastSync === 'now') {
        label = t('tr_lastSyncAppDataNow');
      }

      if (lastSync === 'recently') {
        label = t('tr_lastSyncAppDataRecently');
      }

      if (lastSync === 'error') {
        label = getMessageByCode('error_app_generic-title');
      }

      if (lastSync >= 1) {
        label = t('tr_lastSyncAppData', { duration: lastSync });
      }
    }

    return label;
  };

  const handleManualSync = async () => {
    if (accountType === 'vip') {
      worker.postMessage({
        field: 'idToken',
        value: await user.getIdToken(true),
      });
    }

    worker.postMessage('startWorker');
  };

  useEffect(() => {
    if (isConnected) {
      const svgIcon = document.querySelector('.organized-sync-icon');
      const g = svgIcon.querySelector('g');
      const checkMark = g.querySelector('path');
      checkMark.style.animation = 'fade-out 0s ease-in-out forwards';
    }
  }, [isConnected]);

  useEffect(() => {
    if (isSyncing) {
      const svgIcon = document.querySelector<SVGElement>(
        '.organized-sync-icon'
      );
      if (svgIcon) {
        const g = svgIcon.querySelector('g');
        const checkMark = g.querySelector('path');

        checkMark.style.animation = 'fade-out 0s ease-in-out forwards';
        svgIcon.style.animation = 'rotate 2s linear infinite';
      }
    }
  }, [isSyncing]);

  useEffect(() => {
    if (!isSyncing && isConnected) {
      const svgIcon = document.querySelector<SVGElement>(
        '.organized-sync-icon'
      );
      if (svgIcon) {
        const g = svgIcon.querySelector('g');
        const checkMark = g.querySelector('path');

        svgIcon.style.animation = '';
        checkMark.style.animation = 'fade-in 0.25s ease-in-out forwards';
      }
    }
  }, [isSyncing, isConnected]);

  return {
    secondaryText: getSecondaryText(),
    handleManualSync,
    isConnected,
    isUserAdmin,
    requests_count,
  };
};

export default useCongregation;
