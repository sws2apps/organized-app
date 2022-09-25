import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GetApp from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import KeyIcon from '@mui/icons-material/Key';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Toolbar from '@mui/material/Toolbar';
import TopicIcon from '@mui/icons-material/Topic';
import Typography from '@mui/material/Typography';
import AppDrawer from './AppDrawer';
import AppLanguage from './AppLanguage';
import NotificationContent from './NotificationContent';
import { fetchNotifications } from '../../utils/app';
import {
	congAccountConnectedState,
	congInfoFormattedState,
	usernameState,
	offlineOverrideState,
} from '../../appStates/appCongregation';
import {
	backupDbOpenState,
	countNotificationsState,
	isAboutOpenState,
	isAppClosingState,
	isAppLoadState,
	isOnlineState,
	restoreDbOpenState,
} from '../../appStates/appSettings';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
const drawerWidth = 240;

const sharedStyles = {
	menuIcon: {
		marginRight: '8px',
		borderRadius: '8px',
		'.MuiTouchRipple-ripple .MuiTouchRipple-child': {
			borderRadius: 0,
			backgroundColor: 'rgba(23, 32, 42, .3)',
		},
	},
};

const AppMenus = ({ enabledInstall, isLoading, installPwa }) => {
	const location = useLocation();
	const { t } = useTranslation();

	const theme = useTheme();

	const setIsAboutOpen = useSetRecoilState(isAboutOpenState);
	const setIsAppClosing = useSetRecoilState(isAppClosingState);
	const setIsBackupDb = useSetRecoilState(backupDbOpenState);
	const setIsRestoreDb = useSetRecoilState(restoreDbOpenState);
	const setOfflineOverride = useSetRecoilState(offlineOverrideState);
	const setIsAppLoad = useSetRecoilState(isAppLoadState);

	const congInfo = useRecoilValue(congInfoFormattedState);
	const username = useRecoilValue(usernameState);
	const cnNews = useRecoilValue(countNotificationsState);
	const isOnline = useRecoilValue(isOnlineState);
	const congAccountConnected = useRecoilValue(congAccountConnectedState);

	const [mobileOpen, setMobileOpen] = useState(false);
	const [appBarTitle, setAppBarTitle] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorPopoverEl, setAnchorPopoverEl] = useState(null);
	const [backupOpen, setBackupOpen] = useState(false);

	const open = Boolean(anchorEl);
	const openPopover = Boolean(anchorPopoverEl);
	const id = openPopover ? 'notification-popover' : undefined;

	const handleNotificationClick = (event) => {
		setAnchorPopoverEl(event.currentTarget);
	};

	const handleNotificationClose = () => {
		setAnchorPopoverEl(null);
	};

	const largeView = useMediaQuery(theme.breakpoints.up('md'), {
		noSsr: true,
	});

	const handleBackupClick = () => {
		setBackupOpen(!backupOpen);
	};

	const handleMenu = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleInstallPwa = () => {
		installPwa();
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleCreateBackup = () => {
		handleClose();
		setIsBackupDb(true);
	};

	const handleRestoreBackup = () => {
		handleClose();
		setIsRestoreDb(true);
	};

	const handleAbout = () => {
		handleClose();
		setIsAboutOpen(true);
	};

	const handleLogout = async () => {
		handleClose();
		setIsAppClosing(true);
	};

	const handleUseOnlineAccount = () => {
		handleClose();
		setOfflineOverride(true);
		setIsAppLoad(true);
	};

	const checkPwaUpdate = () => {
		if ('serviceWorker' in navigator) {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
			navigator.serviceWorker.register(swUrl).then((reg) => {
				reg.update();
			});
		}
	};

	useEffect(() => {
		const currentPath = location.pathname.toLowerCase();

		if (currentPath === '/') {
			setAppBarTitle(t('global.home'));
		} else if (currentPath.startsWith('/students')) {
			setAppBarTitle(t('global.students'));
		} else if (currentPath === '/schedule') {
			setAppBarTitle(t('global.schedule'));
		} else if (currentPath === '/source-material') {
			setAppBarTitle(t('global.sourceMaterial'));
		} else if (currentPath === '/settings') {
			setAppBarTitle(t('global.settings'));
		} else if (currentPath.startsWith('/administration')) {
			setAppBarTitle(t('global.administration'));
		}
		fetchNotifications();
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		} else {
			checkPwaUpdate();
		}
	}, [t, location.pathname]);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position='fixed'
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					height: '50px !important',
					minHeight: '50px !important',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Toolbar
					sx={{
						height: '50px !important',
						minHeight: '50px !important',
						'@media screen and (min-width: 960px)': {
							paddingLeft: '0px !important',
						},
					}}
				>
					<IconButton
						color='inherit'
						aria-label='Open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{
							'@media screen and (max-width: 959px)': {
								fontSize: 0,
								marginRight: '2px',
								display: 'block',
							},
							'@media screen and (min-width: 960px)': {
								display: 'none',
							},
						}}
					>
						<MenuIcon />
					</IconButton>
					<Box
						sx={{
							alignItems: 'center',
							'@media screen and (max-width: 959px)': {
								display: 'none',
							},
							'@media screen and (min-width: 960px)': {
								marginRight: '3px',
								display: 'flex',
							},
						}}
					>
						<img
							src='./img/appLogo.png'
							alt='App Logo'
							style={{
								width: 'auto',
								height: '50px',
								borderRadius: '4px',
							}}
						/>
						<Typography noWrap sx={{ marginLeft: '10px', fontSize: '18px' }}>
							LMM-OA |{' '}
						</Typography>
					</Box>
					<Typography noWrap sx={{ fontSize: '18px' }}>
						{appBarTitle}
					</Typography>
				</Toolbar>
				<Box
					sx={{
						minWidth: '30px',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					{!isLoading && enabledInstall && (
						<IconButton
							color='inherit'
							edge='start'
							sx={{
								...sharedStyles.menuIcon,
								marginRight: '10px',
							}}
							onClick={() => handleInstallPwa()}
						>
							<GetApp />
							{largeView && (
								<Typography sx={{ marginLeft: '5px', fontSize: '14px' }}>
									{t('global.install')}
								</Typography>
							)}
						</IconButton>
					)}

					<Box sx={{ marginRight: '10px' }}>
						<AppLanguage />
					</Box>

					<IconButton
						color='inherit'
						edge='start'
						sx={{
							...sharedStyles.menuIcon,
							marginRight: '15px',
						}}
						aria-describedby={id}
						onClick={handleNotificationClick}
					>
						<Badge badgeContent={cnNews} color='error'>
							<NotificationsIcon />
						</Badge>
					</IconButton>
					<NotificationContent
						id={id}
						open={openPopover}
						anchorEl={anchorPopoverEl}
						handleClose={handleNotificationClose}
					/>

					<IconButton
						color='inherit'
						edge='start'
						sx={{
							...sharedStyles.menuIcon,
							marginRight: '10px',
						}}
						onClick={handleMenu}
						id='button-account'
						aria-controls={open ? 'menu-account' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
					>
						{largeView && (
							<Box sx={{ marginRight: '5px' }}>
								<Typography
									sx={{
										marginLeft: '5px',
										textAlign: 'right',
										fontSize: '12px',
									}}
								>
									{username}
								</Typography>
								<Typography
									sx={{
										marginLeft: '5px',
										textAlign: 'right',
										fontSize: '12px',
									}}
								>
									{congInfo}
								</Typography>
							</Box>
						)}
						<AccountCircle sx={{ fontSize: '40px' }} />
					</IconButton>
					<Menu
						sx={{ marginTop: '40px' }}
						id='menu-account'
						MenuListProps={{
							'aria-labelledby': 'button-account',
						}}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						{isOnline && !congAccountConnected && (
							<MenuItem onClick={handleUseOnlineAccount}>
								<ListItemIcon>
									<KeyIcon fontSize='medium' sx={{ color: '#DC7633' }} />
								</ListItemIcon>
								<ListItemText>{t('global.useOnlineAccount')}</ListItemText>
							</MenuItem>
						)}

						{isOnline && congAccountConnected && (
							<MenuItem onClick={handleBackupClick} sx={{ width: '320px' }}>
								<ListItemIcon>
									<TopicIcon />
								</ListItemIcon>
								<ListItemText
									primary={t('global.backup')}
									sx={{ marginRight: '10px' }}
								/>
								{backupOpen ? <ExpandLess /> : <ExpandMore />}
							</MenuItem>
						)}

						<Collapse in={backupOpen} timeout='auto' unmountOnExit>
							<List component='div' disablePadding sx={{ paddingLeft: '20px' }}>
								<MenuItem onClick={handleCreateBackup}>
									<ListItemIcon>
										<CloudUploadIcon
											fontSize='medium'
											sx={{ color: '#2ECC71' }}
										/>
									</ListItemIcon>
									<ListItemText>{t('global.sendBackup')}</ListItemText>
								</MenuItem>
								<MenuItem onClick={handleRestoreBackup}>
									<ListItemIcon>
										<CloudDownloadIcon
											fontSize='medium'
											sx={{ color: '#5D6D7E' }}
										/>
									</ListItemIcon>
									<ListItemText>{t('global.restoreBackup')}</ListItemText>
								</MenuItem>
							</List>
						</Collapse>

						<MenuItem onClick={handleAbout}>
							<ListItemIcon>
								<InfoIcon fontSize='medium' sx={{ color: '#3498DB' }} />
							</ListItemIcon>
							<ListItemText>{t('global.about')}</ListItemText>
						</MenuItem>
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								<PowerSettingsNewIcon
									fontSize='medium'
									sx={{ color: '#E74C3C' }}
								/>
							</ListItemIcon>
							<ListItemText>{t('global.quit')}</ListItemText>
						</MenuItem>
						{!largeView && (
							<MenuItem disabled={true} sx={{ opacity: '1 !important' }}>
								<Box
									sx={{
										borderTop: '1px outset',
										paddingTop: '5px',
										width: '280px',
									}}
								>
									<Typography
										sx={{
											marginLeft: '5px',
											textAlign: 'right',
											fontSize: '12px',
										}}
									>
										{username}
									</Typography>
									<Typography
										sx={{
											marginLeft: '5px',
											textAlign: 'right',
											fontSize: '12px',
										}}
									>
										{congInfo}
									</Typography>
								</Box>
							</MenuItem>
						)}
					</Menu>
				</Box>
			</AppBar>

			<Box
				component='nav'
				sx={{
					'@media screen and (min-width: 960px)': {
						width: drawerWidth,
						flexShrink: 0,
					},
				}}
			>
				<Drawer
					variant='temporary'
					anchor='left'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					onClick={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						zIndex: (theme) => theme.zIndex.drawer + 2,
						'@media screen and (max-width: 959px)': {
							'& .MuiDrawer-paper': {
								boxSizing: 'border-box',
								width: drawerWidth,
							},
							display: 'block',
						},
						'@media screen and (min-width: 960px)': {
							display: 'none',
						},
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							backgroundColor: '#3f51b5',
							height: 50,
						}}
					>
						<img
							src='./img/appLogo.png'
							alt='App Logo'
							style={{
								width: 'auto',
								height: '40px',
								borderRadius: '4px',
							}}
						/>
						<Typography sx={{ marginLeft: '10px', fontSize: '18px' }}>
							LMM-OA
						</Typography>
					</Box>
					<AppDrawer />
				</Drawer>
				<Drawer
					variant='permanent'
					sx={{
						'@media screen and (min-width: 960px)': {
							'& .MuiDrawer-paper': {
								boxSizing: 'border-box',
								width: drawerWidth,
							},
							display: 'block',
						},
						'@media screen and (max-width: 959px)': {
							display: 'none',
						},
					}}
				>
					<Offset />
					<AppDrawer />
				</Drawer>
			</Box>
		</Box>
	);
};

export default AppMenus;
