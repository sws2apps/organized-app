import CongregationCreate from '../congregation_create';
// import EmailAuth from '../email_auth';
import Signin from '../signin';
import TermsUse from '../terms_use';
// import Signup from '../signup';
// import VerifyMFA from '../verify_mfa';
import useStartup from './useStartup';

const VipStartup = () => {
  const {
    // isUserSignUp,
    isUserSignIn,
    // isAuthProcessing,
    // showTermsUse,
    // isUserMfaVerify,
    isCongAccountCreate,
    // isEmailAuth,
  } = useStartup();

  return (
    <>
      {/* {isAuthProcessing && <WaitingCircular variant="standard" />} */}
      {/* <WaitingCircular variant="standard" /> */}
      <TermsUse />
      {isUserSignIn && <Signin />}
      {/* {isUserSignUp && <Signup />} */}
      {/* {isUserMfaVerify && <VerifyMFA />} */}
      {isCongAccountCreate && <CongregationCreate />}
      {/* {isEmailAuth && <EmailAuth />} */}
    </>
  );
};

export default VipStartup;
