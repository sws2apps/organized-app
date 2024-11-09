import { Stack } from '@mui/material';
import useActionLogin from './useActionLogin';
import EmailAuth from './email_auth';
import EmailLinkAuthentication from './email_link_authentication';
import MfaVerify from './mfa_verify';
import OAuthLogin from './oauth_login';

const ActionLogin = () => {
  const { isEmailAuth, isEmailLinkAuth, isMfaVerify } = useActionLogin();

  return (
    <Stack>
      {isMfaVerify && <MfaVerify />}

      {!isMfaVerify && (
        <>
          {!isEmailLinkAuth && !isEmailAuth && <OAuthLogin />}
          {isEmailLinkAuth && <EmailLinkAuthentication />}
          {isEmailAuth && !isEmailLinkAuth && <EmailAuth />}
        </>
      )}
    </Stack>
  );
};

export default ActionLogin;
