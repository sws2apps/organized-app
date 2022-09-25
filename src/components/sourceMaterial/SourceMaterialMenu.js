import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';

const sharedStyles = {
	topMenu: {
		marginLeft: '5px',
	},
	topSmallMenu: {
		marginLeft: '5px',
		background: '#D5DBDB',
	},
};

const SourceMaterialMenu = (props) => {
	const { t } = useTranslation();
	const {
		currentWeek,
		handleWeekAdd,
		handleImportEPUB,
		handleImportJw,
		handleSaveSource,
	} = props;

	const [isOpen, setIsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const menuOpen = Boolean(anchorEl);

	const handleMenuClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const theme = useTheme();
	const largeMenu = useMediaQuery(theme.breakpoints.up(1300), {
		noSsr: true,
	});
	const miniMenu = useMediaQuery(theme.breakpoints.up(630), {
		noSsr: true,
	});

	const lauchWeekAdd = () => {
		handleWeekAdd();
		setIsOpen(false);
	};

	const launchImportEPUB = () => {
		handleMenuClose();
		handleImportEPUB();
	};

	const launchSaveSource = () => {
		handleMenuClose();
		handleSaveSource();
	};

	const handleAcceptAdd = () => {
		handleMenuClose();
		setIsOpen(true);
	};

	const launchImportFromJW = () => {
		handleMenuClose();
		handleImportJw();
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const sourceMenu = [
		{
			label: t('sourceMaterial.addWeek'),
			icon: <AddCircleIcon />,
			function: handleAcceptAdd,
			disabled: false,
		},
		{
			label: t('sourceMaterial.importEPUB'),
			icon: <DriveFileMoveIcon />,
			function: launchImportEPUB,
			disabled: false,
		},
		{
			label: t('sourceMaterial.importJw'),
			icon: <BrowserUpdatedIcon />,
			function: launchImportFromJW,
			disabled: false,
		},
		{
			label: t('global.save'),
			icon: <SaveIcon />,
			function: launchSaveSource,
			disabled: currentWeek ? false : true,
		},
	];

	return (
		<>
			<Dialog
				open={isOpen}
				aria-labelledby='dialog-title'
				onClose={handleClose}
			>
				<DialogTitle id='dialog-title'>
					<Typography variant='h6' component='p'>
						{t('sourceMaterial.addWeekTitle')}
					</Typography>
				</DialogTitle>
				<DialogContent>
					<Typography>{t('sourceMaterial.addWeekDesc')}</Typography>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={lauchWeekAdd} color='primary'>
						{t('global.yes')}
					</Button>
					<Button onClick={handleClose} color='primary' autoFocus>
						{t('global.no')}
					</Button>
				</DialogActions>
			</Dialog>
			<Box>
				{!miniMenu && (
					<>
						<IconButton
							aria-label='more'
							id='icon-button'
							aria-controls={menuOpen ? 'basic-menu' : undefined}
							aria-expanded={menuOpen ? 'true' : undefined}
							aria-haspopup='true'
							sx={sharedStyles.topSmallMenu}
							onClick={handleMenuClick}
						>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id='basic-menu'
							anchorEl={anchorEl}
							open={menuOpen}
							onClose={handleMenuClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							{sourceMenu.map((menu, index) => (
								<MenuItem key={index} onClick={() => menu.function()}>
									<ListItemIcon>{menu.icon}</ListItemIcon>
									<ListItemText>{menu.label}</ListItemText>
								</MenuItem>
							))}
						</Menu>
					</>
				)}
				{miniMenu && !largeMenu && (
					<>
						{sourceMenu.map((menu, index) => (
							<Tooltip key={index} title={menu.label}>
								<IconButton
									color='primary'
									size='large'
									onClick={() => menu.function()}
									sx={sharedStyles.topSmallMenu}
								>
									{menu.icon}
								</IconButton>
							</Tooltip>
						))}
					</>
				)}
				{largeMenu && (
					<>
						{sourceMenu.map((menu, index) => (
							<Button
								key={index}
								variant='contained'
								color='primary'
								startIcon={menu.icon}
								onClick={() => menu.function()}
								sx={sharedStyles.topMenu}
							>
								{menu.label}
							</Button>
						))}
					</>
				)}
			</Box>
		</>
	);
};

export default SourceMaterialMenu;
