import { useAtomValue } from 'jotai';
import {
  appMessageActionState,
  appMessageHeaderState,
  appMessageIconState,
  appMessageState,
  appSeverityState,
  appSnackOpenState,
} from '@states/app';
import { setAppSnackOpen } from '@services/states/app';

const useAppFeedback = () => {
  const snackOpen = useAtomValue(appSnackOpenState);
  const appSeverity = useAtomValue(appSeverityState);
  const appMessage = useAtomValue(appMessageState);
  const appMessageHeader = useAtomValue(appMessageHeaderState);
  const appMessageIcon = useAtomValue(appMessageIconState);
  const appMessageAction = useAtomValue(appMessageActionState);

  const handleClose = () => setAppSnackOpen(false);

  return {
    snackOpen,
    appSeverity,
    appMessage,
    appMessageHeader,
    handleClose,
    appMessageIcon,
    appMessageAction,
  };
};

export default useAppFeedback;
