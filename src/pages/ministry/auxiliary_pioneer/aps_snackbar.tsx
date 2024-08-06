import React, { useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { SnackBar } from '@components/index';
import { IconTimeChange } from '@components/icons';

const APSSnackbar: React.FC = () => {
  const { t } = useAppTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = async () => {
    setIsOpen(false);
  };

  return (
    <SnackBar
      open={isOpen}
      onClose={handleClose}
      messageHeader={t('tr_hourGoal')}
      message={t('tr_hourGoalDesc')}
      messageIcon={<IconTimeChange color="var(--white)" />}
      variant={'message-with-button'}
    />
  );
};

export default APSSnackbar;
