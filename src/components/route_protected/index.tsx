import { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { FEATURE_FLAGS } from '@constants/flags';

const RouteProtected = ({
  allowed,
  flag,
}: {
  allowed?: boolean;
  flag?: string;
}) => {
  const render = useMemo(() => {
    if (!flag) return allowed;

    const flagValue = FEATURE_FLAGS[flag];

    if (allowed === undefined) return flagValue;

    return allowed ? flagValue : false;
  }, [allowed, flag]);

  return render ? <Outlet /> : <Navigate to="/" />;
};

export default RouteProtected;
