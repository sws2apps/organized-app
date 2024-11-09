import { useSetRecoilState } from 'recoil';
import {
  appMessageCPEState,
  appSeverityCPEState,
  appSnackOpenCPEState,
} from '../states/main';

const useSnackBar = () => {
  const setSeverity = useSetRecoilState(appSeverityCPEState);
  const setMessage = useSetRecoilState(appMessageCPEState);
  const setOpen = useSetRecoilState(appSnackOpenCPEState);

  const showMessage = (message, severity) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  };

  return { showMessage };
};

export default useSnackBar;
