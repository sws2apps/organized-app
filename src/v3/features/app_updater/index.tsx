import { SnackBar } from '@components';
import { IconUpdate } from '@icons';
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
      actionText={t('trans_updateApp')}
      actionClick={handleAppUpdated}
      messageHeader={t('trans_updateAvailable')}
      message={t('trans_updateDescription')}
    />
  );
};

export default AppUpdater;
