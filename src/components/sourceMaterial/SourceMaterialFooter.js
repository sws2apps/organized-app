import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';

const sharedStyles = {
	bottomLabel: {
		background: '#ba000d',
		borderRadius: '3px',
		marginLeft: '0px',
		border: 0,
		padding: '5px 10px',
		marginRight: '5px',
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		'&:hover': {
			background: '#17202A',
			boxShadow: '0 3px 5px 2px rgba(23, 32, 42, .3)',
		},
	},
};

const SourceMaterialFooter = (props) => {
	const { t } = useTranslation();

	const currentWeek = props.currentWeek;
	const [isOpen, setIsOpen] = useState(false);

	const theme = useTheme();
	const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });

	const handleWeekAdd = () => {
		props.handleWeekAdd();
		setIsOpen(false);
	};

	const handleImportEPUB = () => {
		props.handleImportEPUB();
	};

	const handleSaveSource = () => {
		props.handleSaveSource();
	};

	const handleAcceptAdd = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

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
					<Button autoFocus onClick={handleWeekAdd} color='primary'>
						{t('global.yes')}
					</Button>
					<Button onClick={handleClose} color='primary' autoFocus>
						{t('global.no')}
					</Button>
				</DialogActions>
			</Dialog>
			<AppBar
				position='fixed'
				color='primary'
				sx={{
					top: 'auto',
					height: '50px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-end',
					justifyContent: 'center',
					bottom: 0,
				}}
			>
				<Toolbar disableGutters>
					<IconButton
						edge='start'
						color='inherit'
						sx={sharedStyles.bottomLabel}
						onClick={() => handleAcceptAdd()}
					>
						<AddCircleIcon />
						{smUp && (
							<Typography variant='body1'>
								{t('sourceMaterial.addWeek')}
							</Typography>
						)}
					</IconButton>
					<IconButton
						edge='start'
						color='inherit'
						sx={sharedStyles.bottomLabel}
						onClick={() => handleImportEPUB()}
					>
						<LibraryAddIcon />
						{smUp && (
							<Typography variant='body1'>
								{t('sourceMaterial.importEPUB')}
							</Typography>
						)}
					</IconButton>
					<IconButton
						edge='start'
						color='inherit'
						sx={sharedStyles.bottomLabel}
						disabled={currentWeek ? false : true}
						onClick={() => handleSaveSource()}
					>
						<SaveIcon />
						{smUp && (
							<Typography variant='body1'>{t('global.save')}</Typography>
						)}
					</IconButton>
				</Toolbar>
			</AppBar>
		</>
	);
};

export default SourceMaterialFooter;
