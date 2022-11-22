import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { isPrecachedState, showReloadState } from '../../states/main';

const AppUpdater = ({ enabledInstall, updatePwa }) => {
  const { t } = useTranslation();

  const [isPrecached, setIsPrecached] = useRecoilState(isPrecachedState);

  const showReload = useRecoilValue(showReloadState);

  const reloadPage = () => {
    updatePwa();
    window.location.reload();
  };

  return (
    <>
      <Snackbar
        open={showReload}
        message={t('appNewVersionAvailable')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={reloadPage}>
            {t('appUpdateBtn')}
          </Button>
        }
      />
      <Snackbar
        open={isPrecached && enabledInstall && !showReload}
        message={t('appContentCached')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={() => setIsPrecached(false)}>
            OK
          </Button>
        }
      />
    </>
  );
};

export default AppUpdater;
