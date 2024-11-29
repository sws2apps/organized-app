import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';
import { useAppTranslation } from '@hooks/index';
import {
  displaySnackNotification,
  setIsMFAEnabled,
} from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiGetUser2FA, apiHandleVerifyOTP } from '@services/api/user';

const useMFAEnable = (closeDialog: VoidFunction) => {
  const { t } = useAppTranslation();

  const { isPending, data, error } = useQuery({
    queryKey: ['2fa_details'],
    queryFn: apiGetUser2FA,
    refetchOnMount: 'always',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [token, setToken] = useState('');
  const [userOTP, setUserOTP] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [tokenDev, setTokenDev] = useState<string>(undefined);

  const handleCopyTokenClipboard = async () => {
    await navigator.clipboard.writeText(token);

    await displaySnackNotification({
      header: t('tr_codeCopied'),
      message: t('tr_codeCopiedDesc'),
      severity: 'success',
    });
  };

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  const handleVerifyOTP = async () => {
    if (isProcessing) return;

    try {
      setCodeError(false);
      setIsProcessing(true);

      const result = await apiHandleVerifyOTP(userOTP);

      if (result.status === 200) {
        await setIsMFAEnabled(true);
        setIsProcessing(false);
        closeDialog();

        await displaySnackNotification({
          header: t('tr_2FAEnabled'),
          message: t('tr_2FAEnabledDesc'),
          severity: 'success',
        });

        return;
      }

      setIsProcessing(false);
      setCodeError(true);
    } catch (error) {
      setIsProcessing(false);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData.getData('text');
      setUserOTP(text);
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  useEffect(() => {
    const handleQueryResponse = async () => {
      if (!isPending && (error || (data && data.status !== 200))) {
        closeDialog();
        const message = error ? error.message : data.result.message;

        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(message),
          severity: 'error',
        });
      }

      if (!isPending && data && data.status === 200) {
        const { qrCode, secret, MFA_CODE } = data.result;

        setQrCode(qrCode);
        setToken(secret);
        setTokenDev(MFA_CODE);

        const qrImg = await QRCode.toDataURL(qrCode);
        setImgSrc(qrImg);
        setIsLoading(false);
      }
    };

    handleQueryResponse();
  }, [isPending, error, data, closeDialog, t]);

  return {
    isLoading,
    qrCode,
    token,
    handleCopyTokenClipboard,
    userOTP,
    handleOtpChange,
    handleVerifyOTP,
    isProcessing,
    imgSrc,
    codeError,
    tokenDev,
  };
};

export default useMFAEnable;
