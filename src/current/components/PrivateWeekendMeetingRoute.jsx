import { Navigate, Outlet } from 'react-router-dom';

function PrivateWeekendMeetingRoute({ isWeekendMeetingRole }) {
  return isWeekendMeetingRole ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateWeekendMeetingRoute;
