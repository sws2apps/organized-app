import { Navigate, Outlet } from 'react-router-dom';

function PrivateMeetingEditorRoute({ isMeetingEditor }) {
  return isMeetingEditor ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateMeetingEditorRoute;
