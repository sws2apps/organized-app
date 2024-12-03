import useStartup from './useStartup';
import CongregationCreate from '../congregation_create';
import CongregationEncryption from '../congregation_encryption';
import EmailAuth from '../email_auth';
import EmailLinkAuthentication from '../email_link_authentication';
import Signin from '../signin';
import TermsUse from '../terms_use';
import UserAccountCreated from '../user_account_created';
import VerifyMFA from '../verify_mfa';
import WaitingLoader from '@components/waiting_loader';

const VipStartup = () => {
  const {
    isUserSignIn,
    isUserMfaVerify,
    isEmailAuth,
    isEmailLinkAuth,
    isEncryptionCodeOpen,
    isUserAccountCreated,
    isCongCreate,
    isLoading,
  } = useStartup();

  return (
    <>
      <TermsUse />
      {!isCongCreate && !isEncryptionCodeOpen && isLoading && (
        <WaitingLoader type="lottie" variant="standard" />
      )}
      {isUserSignIn && <Signin />}
      {isUserMfaVerify && <VerifyMFA />}
      {isUserAccountCreated && <UserAccountCreated />}
      {isCongCreate && <CongregationCreate />}
      {isEmailAuth && <EmailAuth />}
      {isEmailLinkAuth && <EmailLinkAuthentication />}
      {isEncryptionCodeOpen && <CongregationEncryption />}
    </>
  );
};

export default VipStartup;
