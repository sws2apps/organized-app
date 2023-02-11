import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import EmailNotVerified from './EmailNotVerified';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import SetupMFA from './SetupMFA';
import SignIn from './SignIn';
import SignUp from './SignUp';
import UnauthorizedRole from './UnauthorizedRole';
import VerifyMFA from './VerifyMFA';
import EmailAuth from './EmailAuth';
import EmailBlocked from './EmailBlocked';
import CongregationCreate from './CongregationCreate';
import TermsUse from './TermsUse';
import { loadApp } from '../../utils/app';
import { runUpdater } from '../../utils/updater';
import {
  isAppLoadState,
  isAuthProcessingState,
  isCongAccountCreateState,
  isEmailAuthState,
  isEmailBlockedState,
  isEmailNotVerifiedState,
  isOnlineState,
  isSetupState,
  isShowTermsUseState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  isUserSignUpState,
  offlineOverrideState,
  startupProgressState,
  visitorIDState,
} from '../../states/main';
import { apiSendAuthorization } from '../../api/auth';
import WaitingPage from '../../components/WaitingPage';
import { dbGetAppSettings } from '../../indexedDb/dbAppSettings';
import UserAccountUpgrade from './UserAccountUpgrade';

const Startup = () => {
  const { isAuthenticated } = useFirebaseAuth();

  const [isSetup, setIsSetup] = useRecoilState(isSetupState);
  const [startupProgress, setStartupProgress] = useRecoilState(startupProgressState);
  const [isUserSignUp, setIsUserSignUp] = useRecoilState(isUserSignUpState);
  const [isUserSignIn, setIsUserSignIn] = useRecoilState(isUserSignInState);
  const [isUserMfaVerify, setUserMfaVerify] = useRecoilState(isUserMfaVerifyState);
  const [isUserMfaSetup, setUserMfaSetup] = useRecoilState(isUserMfaSetupState);
  const [isCongAccountCreate, setIsCongAccountCreate] = useRecoilState(isCongAccountCreateState);

  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setIsAuthProcessing = useSetRecoilState(isAuthProcessingState);

  const showTermsUse = useRecoilValue(isShowTermsUseState);
  const isEmailNotVerified = useRecoilValue(isEmailNotVerifiedState);
  const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);
  const isEmailBlocked = useRecoilValue(isEmailBlockedState);
  const isEmailAuth = useRecoilValue(isEmailAuthState);
  const visitorID = useRecoilValue(visitorIDState);
  const isOnline = useRecoilValue(isOnlineState);
  const isOfflineOverride = useRecoilValue(offlineOverrideState);

  const [isAuth, setIsAuth] = useState(true);
  const [isUserAccountUpgradeV2, setIsUserAccountUpgradeV2] = useState(false);

  useEffect(() => {
    const handleNextAuth = async () => {
      setIsAuth(true);

      const settings = await dbGetAppSettings();
      const cong_name = settings.cong_name;
      const accountVersion = settings.account_version || 'v1';

      if (accountVersion === 'v1') {
        setIsUserAccountUpgradeV2(true);
        setIsAuth(false);
        return;
      } else {
        setIsUserAccountUpgradeV2(false);
      }

      if (isOfflineOverride && !isAuthenticated) {
        setIsUserSignIn(true);
        setIsUserSignUp(false);
        setIsCongAccountCreate(false);
        setUserMfaVerify(false);
        setUserMfaSetup(false);
        setIsAuth(false);
        return;
      }

      if (!isOfflineOverride) {
        if (cong_name.length > 0) {
          await loadApp();
          await runUpdater();
          setTimeout(() => {
            setIsSetup(false);
            setIsAppLoad(false);
            setStartupProgress(0);
          }, [1000]);
          return;
        }

        if ((!isOnline && cong_name.length === 0) || (isOnline && cong_name.length === 0 && !isAuthenticated)) {
          setIsUserSignUp(true);
          setIsUserSignIn(false);
          setIsCongAccountCreate(false);
          setIsAuth(false);
          return;
        }
      }

      if (isOnline && isAuthenticated) {
        if (isOfflineOverride || cong_name.length === 0) {
          setIsAuthProcessing(true);
          const result = await apiSendAuthorization();
          if (result.isSetupMFA || result.isVerifyMFA) {
            setIsUserSignUp(false);
            setIsUserSignIn(false);

            if (result.isVerifyMFA) {
              setUserMfaVerify(true);
            }
            if (result.isSetupMFA) {
              setUserMfaSetup(true);
            }
          }

          setIsAuthProcessing(false);
          setIsAuth(false);
        }
      }
    };

    handleNextAuth();
  }, [
    isAuthenticated,
    isOnline,
    isOfflineOverride,
    setIsAppLoad,
    setIsAuthProcessing,
    setIsCongAccountCreate,
    setIsSetup,
    setIsUserSignIn,
    setIsUserSignUp,
    setStartupProgress,
    setUserMfaSetup,
    setUserMfaVerify,
    visitorID,
  ]);

  if (isSetup) {
    return (
      <>
        {showTermsUse && <TermsUse />}
        {!showTermsUse && (
          <>
            {isAuth && <WaitingPage />}
            {!isAuth && (
              <>
                {isUserAccountUpgradeV2 && <UserAccountUpgrade />}
                {!isUserAccountUpgradeV2 && (
                  <>
                    {isUserSignIn && <SignIn />}
                    {isUserSignUp && <SignUp />}
                    {isEmailNotVerified && <EmailNotVerified />}
                    {isUserMfaSetup && <SetupMFA />}
                    {isUnauthorizedRole && <UnauthorizedRole />}
                    {isUserMfaVerify && <VerifyMFA />}
                    {isEmailBlocked && <EmailBlocked />}
                    {isCongAccountCreate && <CongregationCreate />}
                    {isEmailAuth && <EmailAuth />}
                  </>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <Box className="app-splash-screen">
      <Box className="app-logo-container">
        <img src="/img/appLogo.png" alt="App logo" className="appLogo" />
      </Box>
      <Box sx={{ width: '280px', marginTop: '10px' }}>
        <LinearProgressWithLabel value={startupProgress} />
      </Box>
    </Box>
  );
};

export default Startup;
