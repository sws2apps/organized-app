import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { apiHostState, appLangState } from '../../appStates/appSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	isImportJWOrgState,
	isRerenderSourceState,
} from '../../appStates/appSourceMaterial';
import { isOnlineState } from '../../appStates/appSettings';
import { addJwDataToDb } from '../../epub/epubParser';

const sharedStyles = {
	jwLoad: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '20px',
	},
	textCircular: {
		marginTop: '20px',
	},
};

const ImportJWOrg = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const { t } = useTranslation();

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const [isRerender, setIsRerender] = useRecoilState(isRerenderSourceState);
	const [open, setOpen] = useRecoilState(isImportJWOrgState);

	const appLang = useRecoilValue(appLangState);
	const apiHost = useRecoilValue(apiHostState);
	const isOnline = useRecoilValue(isOnlineState);

	const [isLoading, setIsLoading] = useState(true);

	const handleDlgClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}
		setIsRerender(!isRerender);
		setOpen(false);
	};

	const fetchSourcesJw = useCallback(async () => {
		try {
			if (apiHost !== '') {
				const res = await fetch(
					`${apiHost}api/public/source-material/${appLang}`,
					{
						signal: abortCont.signal,
						method: 'GET',
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					await addJwDataToDb(data);
					setIsLoading(false);
					return;
				}

				setAppMessage(data.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
				setOpen(false);
			}
		} catch (err) {
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
			setOpen(false);
		}
	}, [
		abortCont,
		apiHost,
		appLang,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setOpen,
	]);

	useEffect(() => {
		fetchSourcesJw();
	}, [fetchSourcesJw]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			{open && isOnline && (
				<Dialog open={open} onClose={handleDlgClose}>
					<DialogTitle>
						<Typography sx={{ lineHeight: 1.2, fontSize: '13px' }}>
							{t('sourceMaterial.importJwTitle')}
						</Typography>
					</DialogTitle>
					<DialogContent>
						<Container sx={sharedStyles.jwLoad}>
							{isLoading && (
								<>
									<CircularProgress
										color='secondary'
										size={'70px'}
										disableShrink
									/>
									<Typography
										variant='body1'
										align='center'
										sx={sharedStyles.textCircular}
									>
										{t('importJw.inProgress')}
									</Typography>
								</>
							)}
							{!isLoading && (
								<>
									<CheckCircleIcon color='success' sx={{ fontSize: '100px' }} />
									<Typography
										variant='body1'
										align='center'
										sx={sharedStyles.textCircular}
									>
										{t('sourceMaterial.importCompleted')}
									</Typography>
								</>
							)}
						</Container>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleDlgClose}
							color='primary'
							autoFocus
							disabled={!isLoading}
						>
							{t('global.cancel')}
						</Button>
						<Button
							onClick={handleDlgClose}
							color='primary'
							autoFocus
							disabled={isLoading}
						>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Box>
	);
};

export default ImportJWOrg;
