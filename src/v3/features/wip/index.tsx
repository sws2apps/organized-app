import { IconInfo } from '@components/icons';
import SnackBar from '@components/snackbar';
import useWip from './useWip';
import { useAppTranslation } from '@hooks/index';

const WorkInProgress = () => {
  const { t } = useAppTranslation();

  const { handleClose, isOpen } = useWip();

  return (
    <SnackBar
      open={isOpen}
      variant="message-with-button"
      messageHeader={t('tr_featureComingSoon')}
      message={t('tr_featureComingSoonDesc')}
      onClose={handleClose}
      messageIcon={<IconInfo />}
    />
  );
};

export default WorkInProgress;
