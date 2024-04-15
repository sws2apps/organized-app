import { Navigate, Outlet } from 'react-router-dom';

function PrivatePublisherRoute({ isPublisher }) {
  return isPublisher ? <Outlet /> : <Navigate to="/" />;
}

export default PrivatePublisherRoute;
