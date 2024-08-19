import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import { UserMemberDetailsType } from './index.types';
import InvitationCode from './invitation_code';
import ProfileSettings from './profile_settings';
import UserRights from './user_rights';
import UserSessions from './user_sessions';

const UserMemberDetails = ({ user }: UserMemberDetailsType) => {
  const { desktopUp } = useBreakpoints();

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
      <UserRights user={user} />

      <Box
        sx={{
          flex: 0.8,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          justifyContent: 'flex-start',
        }}
      >
        <ProfileSettings user={user} />

        {user.global_role === 'pocket' && <InvitationCode user={user} />}

        <UserSessions user={user} />
      </Box>
    </Box>
  );
};

export default UserMemberDetails;
