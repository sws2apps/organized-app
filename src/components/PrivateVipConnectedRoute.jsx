import { Navigate, Outlet } from 'react-router-dom';

function PrivateVipConnectedRoute({ isCongAccountConnected }) {
  return isCongAccountConnected ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateVipConnectedRoute;
