import { useRecoilValue } from 'recoil';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { MyAccount } from '../features/settings';
import { congAccountConnectedState } from '../states/congregation';
import { isOnlineState } from '../states/main';

const sharedStyles = {
  settingItem: {
    margin: '10px 2px',
    padding: '5px',
  },
};

const UserSettings = () => {
  const congAccountConnected = useRecoilValue(congAccountConnectedState);
  const isOnline = useRecoilValue(isOnlineState);

  if (!isOnline || !congAccountConnected) {
    return <Navigate to="/" />;
  }

  return (
    <Box>
      {isOnline && congAccountConnected && (
        <Box sx={sharedStyles.settingItem}>
          <MyAccount />
        </Box>
      )}
    </Box>
  );
};

export default UserSettings;
