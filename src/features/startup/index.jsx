import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import EmailNotVerified from './components/EmailNotVerified';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import SetupMFA from './components/SetupMFA';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import TermsUse from './components/TermsUse';
import { dbGetAppSettings } from '../../indexedDb/dbAppSettings';
import { loadApp } from '../../utils/app';
import { runUpdater } from '../../utils/updater';
import {
  isAppLoadState,
  isCongAccountCreateState,
  isEmailBlockedState,
  isEmailNotVerifiedState,
  isSetupState,
  isShowTermsUseState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  isUserSignUpState,
  offlineOverrideState,
  startupProgressState,
} from '../../states/main';
import UnauthorizedRole from './components/UnauthorizedRole';
import VerifyMFA from './components/VerifyMFA';
import EmailBlocked from './components/EmailBlocked';
import CongregationCreate from './components/CongregationCreate';

const Startup = () => {
  const [isSetup, setIsSetup] = useRecoilState(isSetupState);
  const [startupProgress, setStartupProgress] = useRecoilState(startupProgressState);
  const [showTermsUse, setShowTermsUse] = useRecoilState(isShowTermsUseState);
  const [isUserSignUp, setIsUserSignUp] = useRecoilState(isUserSignUpState);
  const [isUserSignIn, setIsUserSignIn] = useRecoilState(isUserSignInState);

  const setIsAppLoad = useSetRecoilState(isAppLoadState);

  const offlineOverride = useRecoilValue(offlineOverrideState);
  const isEmailNotVerified = useRecoilValue(isEmailNotVerifiedState);
  const isUserMfaSetup = useRecoilValue(isUserMfaSetupState);
  const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);
  const isUserMfaVerify = useRecoilValue(isUserMfaVerifyState);
  const isEmailBlocked = useRecoilValue(isEmailBlockedState);
  const isCongAccountCreate = useRecoilValue(isCongAccountCreateState);

  useEffect(() => {
    const checkLoginState = async () => {
      if (offlineOverride) {
        setIsSetup(true);
      } else {
        let { isLoggedOut, userPass, username } = await dbGetAppSettings();

        if (isLoggedOut === false && userPass?.length > 0 && username?.length > 0) {
          await loadApp();
          await runUpdater();
          setTimeout(() => {
            setIsAppLoad(false);
            setStartupProgress(0);
          }, [1000]);
        } else if (isLoggedOut === true) {
          setShowTermsUse(false);
          setIsUserSignUp(false);
          setIsUserSignIn(true);
          setIsSetup(true);
        } else {
          setIsSetup(true);
        }
      }
    };

    checkLoginState();
  }, [
    offlineOverride,
    setIsAppLoad,
    setIsSetup,
    setStartupProgress,
    setShowTermsUse,
    setIsUserSignUp,
    setIsUserSignIn,
  ]);

  if (isSetup) {
    return (
      <>
        {showTermsUse && <TermsUse />}
        {!showTermsUse && (
          <>
            {isUserSignIn && <SignIn />}
            {isUserSignUp && <SignUp />}
            {isEmailNotVerified && <EmailNotVerified />}
            {isUserMfaSetup && <SetupMFA />}
            {isUnauthorizedRole && <UnauthorizedRole />}
            {isUserMfaVerify && <VerifyMFA />}
            {isEmailBlocked && <EmailBlocked />}
            {isCongAccountCreate && <CongregationCreate />}
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
