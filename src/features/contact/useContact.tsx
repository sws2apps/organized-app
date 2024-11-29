import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { IconCheckCircle, IconError } from '@components/icons';
import { isContactOpenState } from '@states/app';
import { displaySnackNotification } from '@services/recoil/app';
import { apiUserPostFeedback } from '@services/api/user';
import { getMessageByCode } from '@services/i18n/translation';

const useContact = () => {
  const [isOpen, setIsOpen] = useRecoilState(isContactOpenState);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleSendMessage = async () => {
    if (isProcessing || subject.length === 0 || message.length === 0) return;
    try {
      setIsProcessing(true);

      await apiUserPostFeedback(subject, message);

      displaySnackNotification({
        header: 'Feedback submitted',
        message: 'Thank you for submitting your ideas!',
        icon: <IconCheckCircle color="var(--white)" />,
        severity: 'success',
      });

      setIsOpen(false);
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return {
    isOpen,
    handleClose,
    subject,
    setSubject,
    message,
    setMessage,
    handleSendMessage,
    isProcessing,
  };
};

export default useContact;
