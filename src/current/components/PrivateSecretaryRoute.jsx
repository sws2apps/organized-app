import { Navigate, Outlet } from 'react-router-dom';

function PrivateSecretaryRoute({ isSecretary }) {
  return isSecretary ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateSecretaryRoute;
