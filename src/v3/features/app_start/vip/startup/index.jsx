// import CongregationCreate from '../congregation_create';
// import EmailAuth from '../email_auth';
import Signin from '../signin';
// import Signup from '../signup';
// import TermsUse from '../terms_use';
// import VerifyMFA from '../verify_mfa';
import useStartup from './useStartup';
// import { WaitingCircular } from '@components/index';

const VipStartup = () => {
  const {
    // isUserSignUp,
    isUserSignIn,
    // isAuthProcessing,
    // showTermsUse,
    // isUserMfaVerify,
    // isCongAccountCreate,
    // isEmailAuth,
  } = useStartup();

  return (
    <>
      {/* {isAuthProcessing && <WaitingCircular />}
      {showTermsUse && <TermsUse />} */}
      {isUserSignIn && <Signin />}
      {/* {isUserSignUp && <Signup />}
      {isUserMfaVerify && <VerifyMFA />}
      {isCongAccountCreate && <CongregationCreate />}
      {isEmailAuth && <EmailAuth />} */}
    </>
  );
};

export default VipStartup;
