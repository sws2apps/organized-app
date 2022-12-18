import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isCongAccountConnected }) {
  return isCongAccountConnected ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
