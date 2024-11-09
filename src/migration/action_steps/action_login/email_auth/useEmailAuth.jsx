import { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useMediaQuery, useTheme } from '@mui/material';
import isEmail from 'validator/lib/isEmail';

import { isEmailAuthCPEState } from '../../../states/main';
import useSnackBar from '../../../hooks/useSnackBar';
import { apiRequestPasswordlesssLink } from '../../../api';
import { useSearchParams } from 'react-router-dom';

const useEmailAuth = () => {
  const theme = useTheme();

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet'), {
    noSsr: true,
  });

  const inputRef = useRef();

  const [, setSearchParams] = useSearchParams();

  const { showMessage } = useSnackBar();

  const setEmailAuth = useSetRecoilState(isEmailAuthCPEState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [linkDev, setLinkDev] = useState(undefined);

  const handleBack = () => {
    setSearchParams('');
    setEmailAuth(false);
  };

  const isEmailValid = (email) => {
    return isEmail(email, { host_blacklist: ['jwpub.org', 'jw.org'] });
  };

  const handleSendLink = async () => {
    setLinkDev(undefined);

    if (isProcessing) return;

    const email = inputRef.current.value;

    if (email.length === 0) return;

    try {
      if (!isEmailValid(email)) {
        throw new Error('Invalid email');
      }

      setIsProcessing(true);

      const data = await apiRequestPasswordlesssLink(email);
      setLinkDev(data.link);

      setIsProcessing(false);

      localStorage.setItem('emailForSignIn', email);

      showMessage(
        'Link has been sent. Please check your email inbox. If link is not there, look in your spam folder or request the link again.',
        'success'
      );
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  return {
    tabletUp,
    inputRef,
    handleBack,
    handleSendLink,
    isProcessing,
    linkDev,
  };
};

export default useEmailAuth;
