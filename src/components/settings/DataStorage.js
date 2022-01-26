import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { fileDialog } from 'file-select-dialog';
import BackupIcon from '@mui/icons-material/Backup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import Typography from '@mui/material/Typography';
import DialogDbBackup from './DialogDbBackup';
import DialogDbDeletion from './DialogDbDeletion';
import {
	backupEncryptedState,
	isBackupDbOpenState,
	isBackupOfflineState,
	isBackupOnlineState,
	isDeleteDbOpenState,
	isRestoreOfflineState,
	isRestoreOnlineState,
	isUserLoggedState,
} from '../../appStates/appSettings';

const DataStorage = () => {
	const { t } = useTranslation();

	const [anchorEl, setAnchorEl] = useState(null);

	const [isBackupDb, setIsBackupDb] = useRecoilState(isBackupDbOpenState);

	const setIsDeleteDb = useSetRecoilState(isDeleteDbOpenState);
	const setBackupOffline = useSetRecoilState(isBackupOfflineState);
	const setBackupOnline = useSetRecoilState(isBackupOnlineState);
	const setRestoreOffline = useSetRecoilState(isRestoreOfflineState);
	const setRestoreOnline = useSetRecoilState(isRestoreOnlineState);
	const setBackupFile = useSetRecoilState(backupEncryptedState);

	const isUserLogged = useRecoilValue(isUserLoggedState);

	let isMenuOpen = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const backupDb = async () => {
		handleClose();
		setBackupOnline(false);
		setRestoreOnline(false);
		setRestoreOffline(false);
		setBackupOffline(true);
		setIsBackupDb(true);
	};

	const backupOnlineDb = async () => {
		handleClose();
		setBackupOffline(false);
		setRestoreOnline(false);
		setRestoreOffline(false);
		setBackupOnline(true);
		setIsBackupDb(true);
	};

	const restoreDb = async () => {
		handleClose();
		const file = await fileDialog({
			accept: '.db',
			strict: true,
		});

		setBackupFile(file);
		setBackupOffline(false);
		setBackupOnline(false);
		setRestoreOnline(false);
		setRestoreOffline(true);
		setIsBackupDb(true);
	};

	const restoreOnlineDb = async () => {
		handleClose();
		setBackupOffline(false);
		setBackupOnline(false);
		setRestoreOffline(false);
		setRestoreOnline(true);
		setIsBackupDb(true);
	};

	const handleDelete = () => {
		setIsDeleteDb(true);
	};

	useEffect(() => {
		setIsDeleteDb(false);
	}, [setIsDeleteDb]);

	return (
		<>
			{isBackupDb && <DialogDbBackup />}
			<DialogDbDeletion />
			<Typography variant='h6' color='primary' className={'settingHeader'}>
				{t('settings.dataStorage')}
			</Typography>
			<div className={'settingSubItem'}>
				<Box>
					<Button
						variant='contained'
						color='primary'
						className={'btnSubItem'}
						startIcon={<SettingsBackupRestoreIcon />}
						aria-controls='basic-menu'
						aria-haspopup='true'
						aria-expanded={isMenuOpen ? 'true' : undefined}
						onClick={handleClick}
					>
						{t('settings.backup')}
					</Button>
					<Menu
						id='basic-menu'
						disableScrollLock={true}
						anchorEl={anchorEl}
						open={isMenuOpen}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						<MenuItem onClick={backupDb}>
							<ListItemIcon>
								<SaveIcon fontSize='small' />
							</ListItemIcon>
							<ListItemText>{t('settings.createLocalBackup')}</ListItemText>
						</MenuItem>
						{isUserLogged && (
							<MenuItem onClick={backupOnlineDb}>
								<ListItemIcon>
									<BackupIcon fontSize='small' />
								</ListItemIcon>
								<ListItemText>{t('settings.createOnlineBackup')}</ListItemText>
							</MenuItem>
						)}
						<Divider />
						<MenuItem onClick={restoreDb}>
							<ListItemIcon>
								<DownloadForOfflineIcon fontSize='small' />
							</ListItemIcon>
							<ListItemText>{t('settings.restoreLocalBackup')}</ListItemText>
						</MenuItem>
						{isUserLogged && (
							<MenuItem onClick={restoreOnlineDb}>
								<ListItemIcon>
									<CloudDownloadIcon fontSize='small' />
								</ListItemIcon>
								<ListItemText>{t('settings.restoreOnlineBackup')}</ListItemText>
							</MenuItem>
						)}
					</Menu>
				</Box>
			</div>
			<div className={'settingSubItem'}>
				<Box>
					<Typography variant='body2'>{t('settings.eraseDesc')}</Typography>
				</Box>
				<Button
					variant='contained'
					color='error'
					className={'btnSubItem'}
					startIcon={<DeleteForeverIcon />}
					onClick={() => handleDelete()}
				>
					{t('global.delete')}
				</Button>
			</div>
		</>
	);
};

export default DataStorage;
