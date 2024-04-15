import { lazy, Suspense, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import UnauthorizedRole from './UnauthorizedRole';
import { accountTypeState, isAccountChooseState, isSetupState, isUnauthorizedRoleState } from '../../states/main';
import WaitingPage from '../../components/WaitingPage';
import AccountChooser from './AccountChooser';
import { Setting } from '../../classes/Setting';

// lazy loading
const PocketStartup = lazy(() => import('./pocket'));
const VipStartup = lazy(() => import('./vip'));

const Startup = () => {
  const [accountType, setAccountType] = useRecoilState(accountTypeState);
  const [isAccountChoose, setIsAccountChoose] = useRecoilState(isAccountChooseState);

  const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);
  const isSetup = useRecoilValue(isSetupState);

  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    const checkAccount = () => {
      if (Setting.account_type && Setting.account_type !== '') {
        setAccountType(Setting.account_type);
        setIsAccountChoose(false);
        setIsAuth(false);
        return;
      }

      setIsAccountChoose(true);
      setIsAuth(false);
    };

    checkAccount();
  }, [setIsAccountChoose, setAccountType]);

  if (isSetup) {
    return (
      <Suspense fallback={<WaitingPage />}>
        <>
          {isAuth && <WaitingPage />}
          {!isAuth && (
            <>
              {isAccountChoose && <AccountChooser />}
              {!isAccountChoose && (
                <>
                  {accountType === 'vip' && <VipStartup />}
                  {accountType === 'pocket' && <PocketStartup />}
                  {isUnauthorizedRole && <UnauthorizedRole />}
                </>
              )}
            </>
          )}
        </>
      </Suspense>
    );
  }

  return (
    <Box className="app-splash-screen">
      <Box className="app-logo-container">
        <img src="/img/appLogo.png" alt="App logo" className="appLogo" />
      </Box>
      <Box sx={{ width: '280px', marginTop: '10px' }}>
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default Startup;
