import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration';

const ServiceWorkerWrapper = (props) => {
  const { updatePwa } = props;
  const [showReload, setShowReload] = useState(false);
  const [isPrecached, setIsPrecached] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const onSWUpdate = (registration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  const onSWInstalled = () => {
    setIsPrecached(true);
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate, onSuccess: onSWInstalled });
  });

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    updatePwa();
    setShowReload(false);
    window.location.reload();
  };

  return (
    <>
      <Snackbar
        open={showReload}
        message="Misy version vaovao ny LMM-OA --->"
        onClick={reloadPage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={reloadPage}
          >
            Hampiditra
          </Button>
        }
      />
      <Snackbar
        open={isPrecached}
        message="Afaka mampiasa ny LMM-OA ianao izao na tsy misy internet aza."
        onClick={() => setIsPrecached(false)}
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
}

export default ServiceWorkerWrapper;