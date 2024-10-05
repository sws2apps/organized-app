import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import randomString from '@smakss/random-string';
import {
  congAccessCodeState,
  congNumberState,
  countryCodeState,
} from '@states/settings';
import { decryptData, encryptData } from '@services/encryption';
import { apiGetCongregationAccessCode } from '@services/api/congregation';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import useUserDetails from '../useUserDetails';

const useInvitationCode = () => {
  const { t } = useAppTranslation();

  const { handleSaveDetails, user } = useUserDetails();

  const congLocalAccessCode = useRecoilValue(congAccessCodeState);
  const countryCode = useRecoilValue(countryCodeState);
  const congNumber = useRecoilValue(congNumberState);

  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [remoteAccessCode, setRemoteAccessCode] = useState('');
  const [isDelete, setIsDelete] = useState(false);

  const handleRegenerateCode = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      let codeNew: string;

      codeNew = `${countryCode}${congNumber}-`;
      codeNew += randomString({
        length: 6,
        allowedCharacters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      });
      codeNew += `-${congLocalAccessCode}`;

      const code = encryptData(codeNew, remoteAccessCode);

      const newUser = structuredClone(user);

      await handleSaveDetails(newUser, code);

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleOpenDelete = () => setIsDelete(true);

  const handleCloseDelete = () => setIsDelete(false);

  useEffect(() => {
    const handleGetCode = async () => {
      const { status, message } = await apiGetCongregationAccessCode();

      if (status === 200) {
        const remoteCode = decryptData(message, congLocalAccessCode);
        setRemoteAccessCode(remoteCode);

        if (user.profile.pocket_invitation_code?.length > 0) {
          const invitationCode = decryptData(
            user.profile.pocket_invitation_code,
            remoteCode
          );

          setCode(invitationCode);
        }
      }
    };

    handleGetCode();
  }, [congLocalAccessCode, user]);

  useEffect(() => {
    const svgIcon = document.querySelector<SVGElement>(
      '.organized-generate-icon'
    );

    if (svgIcon) {
      if (isProcessing) {
        svgIcon.style.animation = 'rotate 2s linear infinite';
      }

      if (!isProcessing) {
        svgIcon.style.animation = '';
      }
    }
  }, [isProcessing]);

  return {
    code,
    handleRegenerateCode,
    isDelete,
    handleOpenDelete,
    handleCloseDelete,
    isProcessing,
    user,
  };
};

export default useInvitationCode;
