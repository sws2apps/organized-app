import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import About from './About';
import AppMenus from './AppMenus';
import UserAutoLogin from './UserAutoLogin';
import BackupDbDialog from '../settings/BackupDbDialog';
import RestoreDbDialog from '../settings/RestoreDbDialog';
import RootModal from './RootModal';
import WhatsNew from './WhatsNew';
import {
	backupDbOpenState,
	isAboutOpenState,
	isWhatsNewOpenState,
	restoreDbOpenState,
} from '../../appStates/appSettings';

const Layout = (props) => {
	const { enabledInstall, isLoading, installPwa } = props;

	const isOpenAbout = useRecoilValue(isAboutOpenState);
	const isOpenWhatsNew = useRecoilValue(isWhatsNewOpenState);
	const isBackupDb = useRecoilValue(backupDbOpenState);
	const isRestoreDb = useRecoilValue(restoreDbOpenState);

	return (
		<RootModal>
			<Box sx={{ display: 'flex' }}>
				<UserAutoLogin />

				{isOpenAbout && <About />}
				{isBackupDb && <BackupDbDialog />}
				{isRestoreDb && <RestoreDbDialog />}
				{isOpenWhatsNew && <WhatsNew />}

				<AppMenus
					enabledInstall={enabledInstall}
					isLoading={isLoading}
					installPwa={installPwa}
				/>
				<Box
					sx={{
						flexGrow: 1,
						paddingTop: '60px',
						paddingLeft: '5px',
					}}
				>
					{props.children}
				</Box>
			</Box>
		</RootModal>
	);
};

export default Layout;
