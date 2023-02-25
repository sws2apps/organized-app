import { lazy, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import WaitingPage from '../../../components/WaitingPage';
import {
  accountTypeState,
  isAppLoadState,
  isOnlineState,
  isSetupState,
  isUnauthorizedRoleState,
  visitorIDState,
} from '../../../states/main';
import { apiPocketValidate } from '../../../api';
import { loadApp } from '../../../utils/app';
import { dbUpdateUserSettings } from '../../../indexedDb/dbAppSettings';
import { congAccountConnectedState } from '../../../states/congregation';
import { runUpdater } from '../../../utils/updater';
import { apiFetchSchedule } from '../../../api';

// lazy loading
const PocketSignUp = lazy(() => import('./PocketSignUp'));

const PocketStartup = () => {
  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setAccountType = useSetRecoilState(accountTypeState);

  const isOnline = useRecoilValue(isOnlineState);
  const visitorID = useRecoilValue(visitorIDState);

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const checkLoginState = async () => {
      if (isOnline && visitorID.length > 0) {
        const { data, status } = await apiPocketValidate();

        if (status !== 200) {
          setIsSignUp(true);
          return;
        }

        const { cong_role } = data;

        if (!cong_role.includes('view_meeting_schedule')) {
          setIsSetup(true);
          setAccountType('');
          setIsUnauthorizedRole(true);
          return;
        }

        setIsSetup(false);
        await loadApp();
        await runUpdater();
        await dbUpdateUserSettings(data);
        await apiFetchSchedule();
        setTimeout(async () => {
          setCongAccountConnected(true);
          setIsSetup(false);
          setIsAppLoad(false);
        }, [1000]);
      }
    };

    checkLoginState();
  }, [isOnline, setCongAccountConnected, setIsSetup, setIsUnauthorizedRole, setIsAppLoad, setAccountType, visitorID]);

  return (
    <Box>
      {isSignUp && <PocketSignUp />}
      {!isSignUp && <WaitingPage />}
    </Box>
  );
};

export default PocketStartup;
