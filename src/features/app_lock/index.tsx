import { useAtomValue } from 'jotai';
import { appLockViewState } from '@states/app_lock';
import UnlockScreen from './unlock_screen';
import ForgotPin from './forgot_pin';

type AppLockProps = { isExiting?: boolean };

const AppLock = ({ isExiting = false }: AppLockProps) => {
  const view = useAtomValue(appLockViewState);

  if (view === 'forgot') return <ForgotPin isExiting={isExiting} />;
  return <UnlockScreen isExiting={isExiting} />;
};

export default AppLock;
