import { Navigate, Outlet } from 'react-router-dom';
import { FEATURE_FLAGS } from '@constants/flags';

const RouteProtected = ({
  allowed,
  flag,
}: {
  allowed?: boolean;
  flag?: string;
}) => {
  if (flag) {
    return FEATURE_FLAGS[flag] ? <Outlet /> : <Navigate to="/" />;
  }

  return allowed ? <Outlet /> : <Navigate to="/" />;
};

export default RouteProtected;
