import { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useMediaQuery, useTheme } from '@mui/material';
import Dexie from 'dexie';

import { apiHandleVerifyOTP } from '../../../api';
import { congIDCPEState, migrationStepState } from '../../../states/main';
import useInsertSettings from '../useInsertSettings';
import useSnackBar from '../../../hooks/useSnackBar';
import appDb from '../../../db';

const useMfaVerify = () => {
  const theme = useTheme();

  const tabletUp = useMediaQuery(theme.breakpoints.up('tablet'), {
    noSsr: true,
  });

  const inputRef = useRef();

  const { showMessage } = useSnackBar();

  const { handleInsertSettings } = useInsertSettings();

  const setCurrentStep = useSetRecoilState(migrationStepState);
  const setCongID = useSetRecoilState(congIDCPEState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenDev, setTokenDev] = useState(undefined);

  const handleVerifyMfa = async () => {
    setTokenDev(undefined);

    if (isProcessing) return;

    const token = inputRef.current.value;

    if (token.length === 0) return;

    try {
      setIsProcessing(true);

      const data = await apiHandleVerifyOTP(token);

      setIsProcessing(false);

      if (!data.app_settings.cong_settings) {
        setCurrentStep(3);
        return;
      }

      const isAdmin =
        data.app_settings.user_settings.cong_role.includes('admin');

      if (!isAdmin) {
        await appDb.close();
        await Dexie.delete('cpe_sws');

        window.location.href = '/';
        return;
      }

      await handleInsertSettings(data.app_settings);

      setCongID(data.app_settings.cong_settings.id);
      setCurrentStep(1);
    } catch (error) {
      setIsProcessing(false);
      showMessage(error.message, 'error');
    }
  };

  return {
    tabletUp,
    inputRef,
    isProcessing,
    handleVerifyMfa,
    tokenDev,
  };
};

export default useMfaVerify;
