import { Navigate, Outlet } from 'react-router-dom';

const RouteProtected = ({ allowed }: { allowed: boolean }) => {
  return allowed ? <Outlet /> : <Navigate to="/" />;
};

export default RouteProtected;
