import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { apiHostCPEState, appSnackOpenCPEState } from './states/main';
import appDb from './db';
import Dexie from 'dexie';

const useMigration = () => {
  const setApiHost = useSetRecoilState(apiHostCPEState);
  const appSnackOpen = useRecoilValue(appSnackOpenCPEState);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let apiHost;

    if (import.meta.env.VITE_BACKEND_API) {
      apiHost = import.meta.env.VITE_BACKEND_API;
    } else {
      if (
        import.meta.env.DEV ||
        window.location.host.indexOf('localhost') !== -1
      ) {
        apiHost = 'http://localhost:8000/';
      } else {
        apiHost = 'https://api.organized-app.com/';
      }
    }

    setApiHost(apiHost);
    console.info('app: the client API is set to:', apiHost);
  }, [setApiHost]);

  useEffect(() => {
    const reloadApp = async () => {
      await appDb.close();
      await Dexie.delete('cpe_sws');
      window.location.href = '/';
    };

    const handleCheckRole = async () => {
      await appDb.open();

      const settings = await appDb.app_settings.get(1);

      if (!settings || !settings.cong_role) {
        await reloadApp();
        return;
      }

      const isAdmin = settings.cong_role.some(
        (role) =>
          role === 'admin' ||
          role === 'lmmo' ||
          role === 'secretary' ||
          role === 'coordinator'
      );

      if (!isAdmin) {
        await reloadApp();
        return;
      }

      setIsAdmin(isAdmin);
    };

    handleCheckRole();
  }, []);

  return { isAdmin, appSnackOpen };
};

export default useMigration;
