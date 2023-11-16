import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { DataStorage, MyAccount } from '../features/settings';
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

  return (
    <Box>
      {isOnline && congAccountConnected && (
        <Box sx={sharedStyles.settingItem}>
          <MyAccount />
        </Box>
      )}

      <Box sx={sharedStyles.settingItem}>
        <DataStorage />
      </Box>
    </Box>
  );
};

export default UserSettings;
