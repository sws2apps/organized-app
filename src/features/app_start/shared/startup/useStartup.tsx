import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  isAccountChooseState,
  isSetupState,
  isUnauthorizedRoleState,
} from '@states/app';
import { accountTypeState } from '@states/settings';
import { setIsAccountChoose } from '@services/states/app';

const useStartup = () => {
  const isUnauthorizedRole = useAtomValue(isUnauthorizedRoleState);
  const isSetup = useAtomValue(isSetupState);
  const accountType = useAtomValue(accountTypeState);
  const isAccountChoose = useAtomValue(isAccountChooseState);

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

    const timeout = setTimeout(() => {
      checkAccount();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [accountType]);

  return { isUnauthorizedRole, isSetup, isAuth, isAccountChoose, accountType };
};

export default useStartup;
