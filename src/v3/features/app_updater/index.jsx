import PropTypes from 'prop-types';
import { InfoMessage } from '@components';
import { IconUpdate } from '@icons';
import useUpdater from './useUpdater';
import useAppTranslation from '@hooks/useAppTranslation';

const AppUpdater = ({ updatePwa }) => {
  const { t } = useAppTranslation();

  const { handleAppUpdated, showReload } = useUpdater({ updatePwa });

  return (
    <InfoMessage
      open={showReload}
      position="top-center"
      variant="message-with-button"
      actionIcon={<IconUpdate />}
      actionText={t('updateApp')}
      actionClick={handleAppUpdated}
      messageHeader={t('updateAvailable')}
      message={t('updateDescription')}
    />
  );
};

AppUpdater.propTypes = {
  updatePwa: PropTypes.func,
};

export default AppUpdater;
