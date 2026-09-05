import { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAtomValue } from 'jotai';
import { featureFlagsState } from '@states/app';

const RouteProtected = ({
  allowed,
  flag,
}: {
  allowed?: boolean;
  flag?: string;
}) => {
  const FEATURE_FLAGS = useAtomValue(featureFlagsState);

  const render = useMemo(() => {
    const flagValue = flag ? FEATURE_FLAGS[flag] : allowed;
    return allowed === undefined ? flagValue : allowed && flagValue;
  }, [allowed, flag, FEATURE_FLAGS]);

  return render ? <Outlet /> : <Navigate to="/" />;
};

export default RouteProtected;
