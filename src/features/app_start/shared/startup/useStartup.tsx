import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  isAccountChooseState,
  isSetupState,
  isUnauthorizedRoleState,
} from '@states/app';
import { accountTypeState, settingsLoadedState } from '@states/settings';
import { setIsAccountChoose } from '@services/states/app';

const useStartup = () => {
  const isUnauthorizedRole = useAtomValue(isUnauthorizedRoleState);
  const isSetup = useAtomValue(isSetupState);
  const accountType = useAtomValue(accountTypeState);
  const isAccountChoose = useAtomValue(isAccountChooseState);
  const settingsLoaded = useAtomValue(settingsLoadedState);

  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    const checkAccount = async () => {
      if (accountType !== '') {
        setIsAccountChoose(false);
        setIsAuth(false);
        return;
      }

      setIsAccountChoose(true);
      setIsAuth(false);
    };

    // wait for the stored settings rather than a fixed delay, so the account
    // chooser never flashes for a returning user and nobody waits needlessly
    if (!settingsLoaded) return;

    checkAccount();
  }, [accountType, settingsLoaded]);

  return { isUnauthorizedRole, isSetup, isAuth, isAccountChoose, accountType };
};

export default useStartup;
