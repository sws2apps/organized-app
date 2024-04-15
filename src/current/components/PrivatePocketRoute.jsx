import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ accountType }) {
  return accountType === 'vip' ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
