import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isLMMO, isSecretary, isCoordinator, isPublicTalkCoordinator }) {
  return isLMMO || isSecretary || isCoordinator || isPublicTalkCoordinator ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
