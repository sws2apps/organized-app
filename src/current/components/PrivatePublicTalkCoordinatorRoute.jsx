import { Navigate, Outlet } from 'react-router-dom';

function PrivatePublicTalkCoordinatorRoute({ isPublicTalkCoordinator }) {
  return isPublicTalkCoordinator ? <Outlet /> : <Navigate to="/" />;
}

export default PrivatePublicTalkCoordinatorRoute;
