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
  isCongRequestSentState,
  isCongWaitRequestState,
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
import CongregationSignUp from './components/CongregationSignUp';
import CongregationRequestSent from './components/CongregationRequestSent';
import CongregationWait from './components/CongregationWait';

const Startup = () => {
  const [isSetup, setIsSetup] = useRecoilState(isSetupState);
  const [startupProgress, setStartupProgress] = useRecoilState(startupProgressState);

  const setIsAppLoad = useSetRecoilState(isAppLoadState);

  const showTermsUse = useRecoilValue(isShowTermsUseState);
  const offlineOverride = useRecoilValue(offlineOverrideState);
  const isUserSignIn = useRecoilValue(isUserSignInState);
  const isUserSignUp = useRecoilValue(isUserSignUpState);
  const isEmailNotVerified = useRecoilValue(isEmailNotVerifiedState);
  const isUserMfaSetup = useRecoilValue(isUserMfaSetupState);
  const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);
  const isUserMfaVerify = useRecoilValue(isUserMfaVerifyState);
  const isEmailBlocked = useRecoilValue(isEmailBlockedState);
  const isCongAccountCreate = useRecoilValue(isCongAccountCreateState);
  const isCongRequestSent = useRecoilValue(isCongRequestSentState);
  const isCongWaitRequest = useRecoilValue(isCongWaitRequestState);

  useEffect(() => {
    const checkLoginState = async () => {
      if (offlineOverride) {
        setIsSetup(true);
      } else {
        let { isLoggedOut, userPass, username } = await dbGetAppSettings();

        isLoggedOut = isLoggedOut === undefined ? true : isLoggedOut;

        if (!isLoggedOut && userPass?.length > 0 && username?.length > 0) {
          await loadApp();
          await runUpdater();
          setTimeout(() => {
            setIsAppLoad(false);
            setStartupProgress(0);
          }, [1000]);
        } else {
          setIsSetup(true);
        }
      }
    };

    checkLoginState();
  }, [offlineOverride, setIsAppLoad, setIsSetup, setStartupProgress]);

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
            {isCongAccountCreate && <CongregationSignUp />}
            {isCongRequestSent && <CongregationRequestSent />}
            {isCongWaitRequest && <CongregationWait />}
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
