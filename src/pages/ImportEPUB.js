import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import { addEpubDataToDb } from '../epub/epubParser';
import {
	assTypeLocalState,
	epubFileState,
} from '../appStates/appSourceMaterial';
import { appLangState, monthNamesState } from '../appStates/appSettings';

const sharedStyles = {
	epubLoad: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '70vh',
	},
	textCircular: {
		marginTop: '10px',
	},
};

const ImportEPUB = () => {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(true);
	const [isComplete, setIsComplete] = useState(false);
	const [isValid, setIsValid] = useState(true);
	let history = useHistory();

	const fileEPUB = useRecoilValue(epubFileState);
	const monthNames = useRecoilValue(monthNamesState);
	const assTypeList = useRecoilValue(assTypeLocalState);
	const appLang = useRecoilValue(appLangState);

	useEffect(() => {
		const loadEPUB = async () => {
			setIsLoading(false);
			const result = await addEpubDataToDb(fileEPUB);
			if (result === 'error') {
				setIsValid(false);
			} else {
				setIsComplete(true);
				setTimeout(() => {
					history.push('/SourceMaterial');
				}, 2000);
			}
		};

		if (fileEPUB !== '') {
			loadEPUB();
		} else {
			history.push('/SourceMaterial');
		}

		return () => {
			//clean
		};
	}, [fileEPUB, history, assTypeList, monthNames, appLang]);

	return (
		<Box>
			{fileEPUB !== '' && (
				<>
					{!isLoading && !isValid && (
						<Container sx={sharedStyles.epubLoad}>
							<ErrorIcon color='error' sx={{ fontSize: '150px' }} />
							<Typography variant='body1' align='center'>
								{t('importEPUB.invalid')}
							</Typography>
						</Container>
					)}
					{!isLoading && isValid && (
						<Container sx={sharedStyles.epubLoad}>
							{!isComplete && (
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
										{t('importEPUB.inProgress')}
									</Typography>
								</>
							)}
							{isComplete && (
								<>
									<CheckCircleIcon color='success' sx={{ fontSize: '100px' }} />
									<Typography
										variant='body1'
										align='center'
										sx={sharedStyles.textCircular}
									>
										{t('importEPUB.completed')}
									</Typography>
								</>
							)}
						</Container>
					)}
				</>
			)}
		</Box>
	);
};

export default ImportEPUB;
