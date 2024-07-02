// import { useNavigate, useParams } from 'react-router-dom';

const useManageAccessPersonDetails = () => {
  //   const { id } = useParams();
  //   const navigate = useNavigate();

  const userName = 'Floyd Miles';

  // 'publisher' | 'midweek-student' | 'administrator'
  const userRights = 'administrator';

  // const invitationCode = 'UKR17038-V6VKVYUJAN6W';
  const invitationCode = null;

  return { userName, userRights, invitationCode };
};

export default useManageAccessPersonDetails;
