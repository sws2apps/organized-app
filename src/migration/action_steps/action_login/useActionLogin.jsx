import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isEmailAuthCPEState, isMfaVerifyCPEState } from '../../states/main';

const useActionLogin = () => {
  const [searchParams] = useSearchParams();

  const isEmailAuth = useRecoilValue(isEmailAuthCPEState);
  const isMfaVerify = useRecoilValue(isMfaVerifyCPEState);

  const isEmailLinkAuth = searchParams.get('code') !== null;

  return { isEmailAuth, isEmailLinkAuth, isMfaVerify };
};

export default useActionLogin;
