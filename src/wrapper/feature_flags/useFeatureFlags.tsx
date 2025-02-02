import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getApp } from 'firebase/app';
import { getId, getInstallations } from 'firebase/installations';
import { useQuery } from '@tanstack/react-query';
import { apiFeatureFlagsGet } from '@services/api/app';
import { apiHostState, featureFlagsState, isOnlineState } from '@states/app';
import worker from '@services/worker/backupWorker';
import logger from '@services/logger';

const useFeatureFlags = () => {
  const [apiHost, setApiHost] = useRecoilState(apiHostState);

  const setFeatureFlags = useSetRecoilState(featureFlagsState);

  const isOnline = useRecoilValue(isOnlineState);

  const [isLoading, setIsLoading] = useState(true);
  const [installationId, setInstallationId] = useState('');

  const { data: flags, error } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: () => apiFeatureFlagsGet(installationId),
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
      result[name] = import.meta.env[flag];
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

        const installations = getInstallations(app);
        const id = await getId(installations);
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
    }
  }, [isOnline, apiHost, setFeatureFlags, featureFlagsEnv]);

  useEffect(() => {
    if (isOnline) {
      if (!flags) return;

      const mergedFlags = { ...flags, ...featureFlagsEnv };
      setFeatureFlags(mergedFlags);
      setIsLoading(false);
    }
  }, [isOnline, flags, featureFlagsEnv, setFeatureFlags]);

  useEffect(() => {
    if (error) {
      setFeatureFlags(featureFlagsEnv);
      setIsLoading(false);
    }
  }, [error, featureFlagsEnv, setFeatureFlags]);

  return { isLoading, installationId };
};

export default useFeatureFlags;
