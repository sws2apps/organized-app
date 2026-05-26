import { useAtomValue } from 'jotai';
import { appLockViewState } from '@states/app_lock';
import UnlockScreen from './unlock_screen';
import ForgotPin from './forgot_pin';

const AppLock = () => {
  const view = useAtomValue(appLockViewState);

  if (view === 'forgot') return <ForgotPin />;
  return <UnlockScreen />;
};

export default AppLock;
