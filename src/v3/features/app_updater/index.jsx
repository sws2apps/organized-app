import PropTypes from 'prop-types';
import { Snackbar } from '@mui/material';
import { Button } from '@components';
import useUpdater from './useUpdater';
import useAppTranslation from '@hooks/useAppTranslation';

const AppUpdater = ({ enabledInstall, updatePwa }) => {
  const { t } = useAppTranslation();

  const { handleAppCached, handleAppUpdated, isPrecached, showReload } = useUpdater({ updatePwa });

  return (
    <>
      <Snackbar
        open={showReload}
        message={t('newVersion')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={handleAppUpdated}>
            {t('updateApp')}
          </Button>
        }
      />
      <Snackbar
        open={isPrecached && enabledInstall && !showReload}
        message={t('cacheCompleted')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={handleAppCached}>
            OK
          </Button>
        }
      />
    </>
  );
};

AppUpdater.propTypes = {
  enabledInstall: PropTypes.bool,
  updatePwa: PropTypes.func,
};

export default AppUpdater;
