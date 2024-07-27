import SnackBar from '@components/snackbar';
import { IconUpdate } from '@icons/index';
import useUpdater from './useUpdater';
import useAppTranslation from '@hooks/useAppTranslation';

const AppUpdater = ({ updatePwa }: { updatePwa: VoidFunction }) => {
  const { t } = useAppTranslation();

  const { handleAppUpdated, showReload } = useUpdater({ updatePwa });

  return (
    <SnackBar
      open={showReload}
      position="top-center"
      variant="message-with-button"
      actionIcon={<IconUpdate />}
      actionText={t('tr_update')}
      actionClick={handleAppUpdated}
      messageHeader={t('tr_updateAvailable')}
      message={t('tr_updateDescription')}
    />
  );
};

export default AppUpdater;
