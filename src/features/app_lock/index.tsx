import { useAtomValue } from 'jotai';
import {
  appLockNeedsPinState,
  appLockViewState,
  isAppLockedState,
} from '@states/app_lock';
import CreatePinScreen from './create_pin_screen';
import ForgotPin from './forgot_pin';
import UnlockScreen from './unlock_screen';
import useAppLock from './useAppLock';

const AppLock = () => {
  const isLocked = useAtomValue(isAppLockedState);
  const needsPin = useAtomValue(appLockNeedsPinState);
  const view = useAtomValue(appLockViewState);

  useAppLock();

  return (
    <>
      {view === 'forgot' ? (
        <ForgotPin open={isLocked} />
      ) : (
        <UnlockScreen open={isLocked} />
      )}

      {!isLocked && needsPin && <CreatePinScreen />}
    </>
  );
};

export default AppLock;
