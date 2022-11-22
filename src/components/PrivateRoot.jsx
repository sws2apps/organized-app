import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isAdminCong }) {
  return isAdminCong ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
