import { useRecoilValue } from 'recoil';
import { appMessageHeaderState, appMessageState, appSeverityState, appSnackOpenState } from '@states/app';
import { setAppSnackOpen } from '@services/recoil/app';

const useAppFeedback = () => {
  const snackOpen = useRecoilValue(appSnackOpenState);
  const appSeverity = useRecoilValue(appSeverityState);
  const appMessage = useRecoilValue(appMessageState);
  const appMessageHeader = useRecoilValue(appMessageHeaderState);

  const handleClose = async () => {
    await setAppSnackOpen(false);
  };

  return { snackOpen, appSeverity, appMessage, appMessageHeader, handleClose };
};

export default useAppFeedback;
