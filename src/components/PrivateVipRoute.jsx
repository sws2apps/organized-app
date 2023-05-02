import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isLMMO, isSecretary }) {
  return isLMMO || isSecretary ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
