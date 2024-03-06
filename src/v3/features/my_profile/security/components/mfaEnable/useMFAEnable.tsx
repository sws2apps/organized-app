import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification, setIsMFAEnabled } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { apiGetUser2FA, apiHandleVerifyOTP } from '@services/api/user';

const useMFAEnable = (closeDialog: VoidFunction) => {
  const { t } = useAppTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [token, setToken] = useState('');
  const [userOTP, setUserOTP] = useState('');
  const [codeError, setCodeError] = useState(false);

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
        header: t('tr_errorTitle'),
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
    const handleFetch2FA = async () => {
      try {
        setIsLoading(true);

        const result = await apiGetUser2FA();

        if (result.status === 200) {
          const { qrCode, secret } = result.data;

          setQrCode(qrCode);
          setToken(secret);

          const qrImg = await QRCode.toDataURL(qrCode);
          setImgSrc(qrImg);

          setIsLoading(false);
          return;
        }

        closeDialog();
        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(result.data.message),
          severity: 'error',
        });
      } catch (error) {
        closeDialog();

        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      }
    };

    if (isLoading) handleFetch2FA();
  }, [isLoading, closeDialog, t]);

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
  };
};

export default useMFAEnable;
