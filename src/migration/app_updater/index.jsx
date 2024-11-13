/* eslint-disable react/prop-types */

import { useRecoilState, useRecoilValue } from 'recoil';
import { Button, Snackbar } from '@mui/material';
import { isPrecachedCPEState, showReloadCPEState } from '../states/main';

const AppUpdater = ({ enabledInstall, updatePwa }) => {
  const [isPrecached, setIsPrecached] = useRecoilState(isPrecachedCPEState);

  const showReload = useRecoilValue(showReloadCPEState);

  const reloadPage = () => {
    updatePwa();
    window.location.reload();
  };

  return (
    <>
      <Snackbar
        open={showReload}
        message="A new version of CPE is available"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button color="inherit" size="small" onClick={reloadPage}>
            Update
          </Button>
        }
      />
      <Snackbar
        open={isPrecached && enabledInstall && !showReload}
        message="CPE can be used offline now"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => setIsPrecached(false)}
          >
            OK
          </Button>
        }
      />
    </>
  );
};

export default AppUpdater;
