import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import useUserDetails from './useUserDetails';
import InvitationCode from './invitation_code';
import ProfileSettings from './profile_settings';
import UserRights from './user_rights';
import UserSessions from './user_sessions';

const UserMemberDetails = () => {
  const { desktopUp } = useBreakpoints();

  const { currentUser } = useUserDetails();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        gap: '16px',
        flexDirection: desktopUp ? 'row' : 'column',
        alignItems: 'flex-start',
      }}
    >
      <UserRights />

      <Box
        sx={{
          flex: 0.8,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          justifyContent: 'flex-start',
        }}
      >
        <ProfileSettings />

        {currentUser.profile.global_role === 'pocket' && <InvitationCode />}

        <UserSessions />
      </Box>
    </Box>
  );
};

export default UserMemberDetails;
