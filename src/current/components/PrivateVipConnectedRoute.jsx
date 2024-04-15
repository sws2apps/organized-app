import { Navigate, Outlet } from 'react-router-dom';

function PrivateVipConnectedRoute({ isCongAccountConnected, isAdmin }) {
  return isCongAccountConnected && isAdmin ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateVipConnectedRoute;
