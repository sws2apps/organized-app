import useStartup from './useStartup';
import CongregationCreate from '../congregation_create';
import CongregationEncryption from '../congregation_encryption';
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

      {!isLoading && (
        <>
          {isUserSignIn && <Signin />}

          {!isUserSignIn && (
            <>
              {isUserMfaVerify && <VerifyMFA />}
              {isUserAccountCreated && <UserAccountCreated />}
              {isCongCreate && <CongregationCreate />}
              {isEmailLinkAuth && !isUserAccountCreated && (
                <EmailLinkAuthentication />
              )}
              {!isCongCreate && isEncryptionCodeOpen && (
                <CongregationEncryption />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default VipStartup;
