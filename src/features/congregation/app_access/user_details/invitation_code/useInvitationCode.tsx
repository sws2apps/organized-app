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
import { getMessageByCode } from '@services/i18n/translation';
import useUserDetails from '../useUserDetails';

const useInvitationCode = () => {
  const { handleSaveDetails, currentUser } = useUserDetails();

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

      const newUser = structuredClone(currentUser);

      await handleSaveDetails(newUser, code);

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message)!,
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

        const pocketCode = currentUser.profile.pocket_invitation_code;

        if (!pocketCode || pocketCode?.length === 0) return;

        const invitationCode = decryptData(pocketCode, remoteCode);
        setCode(invitationCode);
      }
    };

    handleGetCode();
  }, [congLocalAccessCode, currentUser]);

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
    currentUser,
  };
};

export default useInvitationCode;
