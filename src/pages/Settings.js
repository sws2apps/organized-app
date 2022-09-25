import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import BasicSettings from '../components/settings/BasicSettings';
import DataStorage from '../components/settings/DataStorage';
import MyAccount from '../components/settings/MyAccount';
import { congAccountConnectedState } from '../appStates/appCongregation';
import { isOnlineState } from '../appStates/appSettings';

const sharedStyles = {
	settingItem: {
		margin: '10px 2px',
		padding: '5px',
	},
};

const Settings = () => {
	const congAccountConnected = useRecoilValue(congAccountConnectedState);
	const isOnline = useRecoilValue(isOnlineState);

	return (
		<Box
			sx={{
				marginRight: '5px',
			}}
		>
			{isOnline && congAccountConnected && (
				<Box sx={sharedStyles.settingItem}>
					<MyAccount />
				</Box>
			)}

			<Box sx={sharedStyles.settingItem}>
				<BasicSettings />
			</Box>
			<Box sx={sharedStyles.settingItem}>
				<DataStorage />
			</Box>
		</Box>
	);
};

export default Settings;
