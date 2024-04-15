import { lazy, useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import WaitingPage from '../../../components/WaitingPage';
import {
  accountTypeState,
  isAppLoadState,
  isOnlineState,
  isSetupState,
  isUnauthorizedRoleState,
  rootModalOpenState,
  visitorIDState,
} from '../../../states/main';
import { apiFetchSchedule, apiPocketValidate } from '../../../api';
import { loadApp, updateUserSettings } from '../../../utils/app';
import { congAccountConnectedState } from '../../../states/congregation';
import { runUpdater } from '../../../utils/updater';
import { deleteAppDb, initAppDb } from '../../../indexedDb/dbUtility';
import { classesInitialize } from '../../../utils/classes';

// lazy loading
const PocketSignUp = lazy(() => import('./PocketSignUp'));

const PocketStartup = () => {
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setAccountType = useSetRecoilState(accountTypeState);
  const setModalOpen = useSetRecoilState(rootModalOpenState);

  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);

  const [isSignUp, setIsSignUp] = useState(false);

  const handleDisapproved = useCallback(async () => {
    setModalOpen(true);
    await deleteAppDb();
    setTimeout(async () => {
      await initAppDb();
      await classesInitialize();
      await loadApp();
      setModalOpen(false);
    }, 3000);
  }, [setModalOpen]);

  useEffect(() => {
    const checkLoginState = async () => {
      if (!isOnline) {
        setIsSetup(false);
        await loadApp();
        await runUpdater();
        setTimeout(async () => {
          setIsAppLoad(false);
        }, [1000]);
        return;
      }

      if (isOnline && visitorID.toString().length > 0) {
        const { data, status } = await apiPocketValidate();

        if (status !== 200) {
          await handleDisapproved();
          setIsSignUp(true);
          return;
        }

        const { cong_role } = data;

        const approvedRole =
          cong_role.includes('view_meeting_schedule') ||
          cong_role.includes('elder') ||
          cong_role.includes('publisher') ||
          cong_role.includes('ms');

        if (!approvedRole) {
          setIsSetup(true);
          setAccountType('');
          setIsUnauthorizedRole(true);
          return;
        }

        setIsSetup(false);
        await loadApp();
        await runUpdater();
        await updateUserSettings(data);
        await apiFetchSchedule();
        setTimeout(async () => {
          setCongAccountConnected(true);
          setIsSetup(false);
          setIsAppLoad(false);
        }, [1000]);
      }
    };

    checkLoginState();
  }, [
    isOnline,
    setCongAccountConnected,
    setIsSetup,
    setIsUnauthorizedRole,
    setIsAppLoad,
    setAccountType,
    visitorID,
    handleDisapproved,
  ]);

  return (
    <Box>
      {isSignUp && <PocketSignUp />}
      {!isSignUp && <WaitingPage />}
    </Box>
  );
};

export default PocketStartup;
