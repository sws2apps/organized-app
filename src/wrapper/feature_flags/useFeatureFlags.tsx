import { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { getApp } from 'firebase/app';
import { getId, getInstallations } from 'firebase/installations';
import { useQuery } from '@tanstack/react-query';
import { apiFeatureFlagsGet } from '@services/api/app';
import { apiHostState, featureFlagsState, isOnlineState } from '@states/app';
import { settingsState } from '@states/settings';
import worker from '@services/worker/backupWorker';
import logger from '@services/logger';

const useFeatureFlags = () => {
  const [apiHost, setApiHost] = useAtom(apiHostState);

  const setFeatureFlags = useSetAtom(featureFlagsState);

  const isOnline = useAtomValue(isOnlineState);
  const settings = useAtomValue(settingsState);

  const [isLoading, setIsLoading] = useState(true);
  const [installationId, setInstallationId] = useState('');

  const { data: flags, error } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: () =>
      apiFeatureFlagsGet(installationId, settings.user_settings.id),
    enabled: installationId.length > 0,
    retry: 2,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: 'always',
  });

  const featureFlagsEnv = useMemo(() => {
    const flags = Object.keys(import.meta.env).filter((record) =>
      record.startsWith('VITE_FLAGS')
    );

    const result: Record<string, boolean> = {};

    for (const flag of flags) {
      const name = flag.replace('VITE_FLAGS_', '');
      result[name] = import.meta.env[flag] === 'true';
    }

    return result;
  }, []);

  useEffect(() => {
    const loadApi = async () => {
      let tmpHost;

      if (import.meta.env.VITE_BACKEND_API) {
        tmpHost = import.meta.env.VITE_BACKEND_API;
      } else {
        if (
          import.meta.env.DEV ||
          window.location.host.indexOf('localhost') !== -1
        ) {
          tmpHost = 'http://localhost:8000/';
        } else {
          tmpHost = 'https://api.organized-app.com/';
        }
      }

      setApiHost(tmpHost);
      worker.postMessage({ field: 'apiHost', value: tmpHost });

      logger.info('app', `the client API is set to: ${tmpHost}`);
    };

    loadApi();
  }, [setApiHost]);

  useEffect(() => {
    const handleLoading = async () => {
      try {
        const app = getApp();

        let id: string;

        if (import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST) {
          id = 'ad00115e-46da-476c-a7bf-d160b4eaa1e6';
        } else {
          const installations = getInstallations(app);

          id = await getId(installations);
        }

        setInstallationId(id);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    if (isOnline && apiHost.length > 0) {
      handleLoading();
    }

    if (!isOnline) {
      setFeatureFlags(featureFlagsEnv);
      setIsLoading(false);
      worker.postMessage({ field: 'FEATURE_FLAGS', value: featureFlagsEnv });
    }
  }, [isOnline, apiHost, setFeatureFlags, featureFlagsEnv]);

  useEffect(() => {
    if (isOnline) {
      if (!flags) return;

      const mergedFlags = { ...flags, ...featureFlagsEnv };
      setFeatureFlags(mergedFlags);
      setIsLoading(false);
      worker.postMessage({ field: 'FEATURE_FLAGS', value: mergedFlags });
    }
  }, [isOnline, flags, featureFlagsEnv, setFeatureFlags]);

  useEffect(() => {
    if (error) {
      setFeatureFlags(featureFlagsEnv);
      setIsLoading(false);
      worker.postMessage({ field: 'FEATURE_FLAGS', value: featureFlagsEnv });
    }
  }, [error, featureFlagsEnv, setFeatureFlags]);

  return { isLoading, installationId };
};

export default useFeatureFlags;
