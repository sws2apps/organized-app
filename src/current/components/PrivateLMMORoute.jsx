import { Navigate, Outlet } from 'react-router-dom';

function PrivateLMMORoute({ isLMMO }) {
  return isLMMO ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateLMMORoute;
