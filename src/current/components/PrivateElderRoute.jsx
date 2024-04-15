import { Navigate, Outlet } from 'react-router-dom';

function PrivateElderRoute({ isElder }) {
  return isElder ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateElderRoute;
