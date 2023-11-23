import CongregationCreate from '../congregation_create';
import EmailAuth from '../email_auth';
import EmailLinkAuthentication from '../email_link_authentication';
import Signin from '../signin';
import TermsUse from '../terms_use';
// import VerifyMFA from '../verify_mfa';
import useStartup from './useStartup';

const VipStartup = () => {
  const {
    isUserSignIn,
    // isUserMfaVerify,
    isCongAccountCreate,
    isEmailAuth,
    isEmailLinkAuth,
  } = useStartup();

  return (
    <>
      <TermsUse />
      {isUserSignIn && <Signin />}
      {/* {isUserMfaVerify && <VerifyMFA />} */}
      {isCongAccountCreate && <CongregationCreate />}
      {isEmailAuth && <EmailAuth />}
      {isEmailLinkAuth && <EmailLinkAuthentication />}
    </>
  );
};

export default VipStartup;
