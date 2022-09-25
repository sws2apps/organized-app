import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import HelpIcon from '@mui/icons-material/Help';
import HttpsIcon from '@mui/icons-material/Https';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import ReportIcon from '@mui/icons-material/Report';
import SecurityIcon from '@mui/icons-material/Security';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Typography from '@mui/material/Typography';
import { appLangState, isShowTermsUseState } from '../../appStates/appSettings';

// import components
import AppLanguage from '../root/AppLanguage';

const itemQuestion = {
	marginBottom: '10px',
	display: 'flex',
	alignItems: 'center',
};

const itemTextQuestion = {
	fontWeight: 'bold',
	lineHeight: '1.2',
	marginLeft: '10px',
};

const itemAnswer = {
	marginBottom: '20px',
};

const itemParsAnswer = {
	lineHeight: '1.2',
	marginBottom: '10px',
};

const TermsUse = () => {
	const { t } = useTranslation();

	const setAppLangLocal = useSetRecoilState(appLangState);
	const setShowTermsUse = useSetRecoilState(isShowTermsUseState);

	const [open, setOpen] = useState(true);
	const [isBtnDisabled, setIsBtnDisabled] = useState(true);
	const [readComplete, setReadComplete] = useState(false);

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}
		setOpen(false);
	};

	const handleContinueSetup = () => {
		localStorage.setItem('termsUseAccepted', 'true');
		setShowTermsUse(false);
		handleClose();
	};

	useEffect(() => {
		const termsUse = localStorage.getItem('termsUseAccepted');
		if (termsUse === 'true') {
			setShowTermsUse(false);
			handleClose();
		}
	}, [setShowTermsUse]);

	useEffect(() => {
		setIsBtnDisabled(!readComplete);
	}, [readComplete]);

	useEffect(() => {
		const app_lang = localStorage.getItem('app_lang');
		if (app_lang) {
			setAppLangLocal(app_lang);
		}
	}, [setAppLangLocal]);

	return (
		<Box>
			<Dialog
				open={open}
				onClose={handleClose}
				scroll='paper'
				aria-labelledby='dlg-terms-use'
				aria-describedby='scroll-dialog-description'
			>
				<DialogTitle id='dlg-terms-use'>
					<Box
						sx={{
							display: 'flex',
							alignItems: {
								xs: 'center',
								sm: 'flex-start',
							},
							flexDirection: {
								xs: 'column',
								sm: 'row',
							},
						}}
					>
						<img
							src='/img/appLogo.png'
							alt='App logo'
							className='appLogoMini'
						/>
						<Box>
							<Typography
								sx={{
									fontWeight: 'bold',
									lineHeight: '1.2',
									textAlign: {
										xs: 'center',
										sm: 'left',
									},
									marginTop: {
										xs: '10px',
										sm: '0px',
									},
									marginLeft: {
										xs: '0px',
										sm: '10px',
									},
								}}
							>
								Life and Ministry Meeting Overseer Assistant
							</Typography>
							<Typography
								sx={{
									lineHeight: '1.2',
									fontSize: '14px',
									marginTop: '8px',
									marginLeft: {
										xs: '0px',
										sm: '10px',
									},
								}}
							>
								{t('startup.lmmoaDesc')}
							</Typography>
						</Box>
					</Box>
				</DialogTitle>
				<DialogContent dividers={true}>
					<Box id='scroll-dialog-description' tabIndex={-1}>
						<Box sx={itemQuestion}>
							<HelpIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
							<Typography sx={itemTextQuestion}>
								{t('startup.whoUse')}
							</Typography>
						</Box>

						<Box sx={itemAnswer}>
							<Typography sx={itemParsAnswer}>
								{t('startup.whoUseApp')}
							</Typography>
							<Typography sx={itemParsAnswer}>
								{t('startup.disclaimerApp')}
							</Typography>
						</Box>

						<Box sx={itemQuestion}>
							<InstallDesktopIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
							<Typography sx={itemTextQuestion}>
								{t('startup.appPWA')}
							</Typography>
						</Box>

						<Box sx={itemAnswer}>
							<Typography sx={itemParsAnswer}>
								<Markup content={t('startup.descPWA')} />
							</Typography>
						</Box>

						<Box sx={itemQuestion}>
							<SecurityIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
							<Typography sx={itemTextQuestion}>
								{t('startup.appSecure')}
							</Typography>
						</Box>

						<Box sx={itemAnswer}>
							<Typography sx={itemParsAnswer}>
								{t('startup.webChange')}
							</Typography>
							<Typography sx={itemParsAnswer}>
								{t('startup.appStorage')}
							</Typography>
							<Typography sx={itemParsAnswer}>
								<Markup content={t('startup.onlineShare')} />
							</Typography>
							<Box
								sx={{
									display: 'flex',
									backgroundColor: '#F9E79F',
									padding: '10px',
									borderRadius: '10px',
									marginBottom: '10px',
								}}
							>
								<TipsAndUpdatesIcon
									sx={{ fontSize: '30px', color: '#1E8449' }}
								/>
								<Typography sx={{ marginLeft: '10px', lineHeight: 1.2 }}>
									<Markup content={t('startup.indexedDB')} />
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									backgroundColor: '#F5B7B1',
									padding: '10px',
									borderRadius: '10px',
								}}
							>
								<ReportIcon sx={{ fontSize: '30px', color: '#CB4335' }} />
								<Typography sx={{ marginLeft: '10px', lineHeight: 1.2 }}>
									{t('startup.clearBrowserData')}
								</Typography>
							</Box>
						</Box>

						<Box sx={itemQuestion}>
							<HttpsIcon sx={{ color: '#3498DB', fontSize: '40px' }} />
							<Typography sx={itemTextQuestion}>
								{t('startup.appPrivacy')}
							</Typography>
						</Box>

						<Box sx={itemAnswer}>
							<Typography sx={itemParsAnswer}>
								<Markup content={t('startup.dataCollection')} />
							</Typography>
							<Typography sx={itemParsAnswer}>
								{t('startup.adBlock')}
							</Typography>
						</Box>
						<FormControlLabel
							control={
								<Checkbox
									id='checkContinue'
									checked={readComplete}
									onChange={(e) => setReadComplete(e.target.checked)}
								/>
							}
							label={t('startup.readComplete')}
							sx={{
								border: '2px solid #BFC9CA',
								width: '100%',
								borderRadius: '10px',
							}}
						/>
					</Box>
				</DialogContent>
				<DialogActions
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Box sx={{ marginLeft: '15px' }} id='appLanguage'>
						<AppLanguage isStartup />
					</Box>
					<Box>
						<Button onClick={handleContinueSetup} disabled={isBtnDisabled}>
							{t('startup.nextStep')}
						</Button>
					</Box>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default TermsUse;
