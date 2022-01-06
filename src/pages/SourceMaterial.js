import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { fileDialog } from 'file-select-dialog';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import WeekList from '../components/sourceMaterial/WeekList';
import WeekDetails from '../components/sourceMaterial/WeekDetails';
import {
	dbAddManualSource,
	dbSaveSrcData,
} from '../indexedDb/dbSourceMaterial';
import {
	currentWeekState,
	epubFileState,
} from '../appStates/appSourceMaterial';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../appStates/appNotification';
import { appLangState } from '../appStates/appSettings';

const SourceMaterial = () => {
	const { t } = useTranslation();

	const [isImport, setIsImport] = useState(false);

	const setEpubFile = useSetRecoilState(epubFileState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const currentWeek = useRecoilValue(currentWeekState);
	const appLang = useRecoilValue(appLangState);

	const handleWeekAdd = async () => {
		await dbAddManualSource();
		setAppSnackOpen(true);
		setAppSeverity('success');
		setAppMessage(t('sourceMaterial.weekAdded'));
	};

	const handleImportEPUB = async () => {
		const file = await fileDialog({
			accept: '.epub',
			strict: true,
		});
		const epubLang = file.name.split('_')[1];
		if (epubLang && epubLang === appLang.toUpperCase()) {
			setEpubFile(file);
			setIsImport(true);
		} else {
			setAppSnackOpen(true);
			setAppSeverity('warning');
			setAppMessage(t('sourceMaterial.invalidFilename'));
		}
	};

	const handleSaveSource = async (data) => {
		const isSaved = await dbSaveSrcData(data);
		if (isSaved === true) {
			setAppSnackOpen(true);
			setAppSeverity('success');
			setAppMessage(t('sourceMaterial.weekSaved'));
		} else {
			setAppSnackOpen(true);
			setAppSeverity('error');
			setAppMessage(t('sourceMaterial.saveError'));
		}
	};

	if (isImport === true) {
		return (
			<Redirect
				to={{
					pathname: '/ImportEPUB',
				}}
			/>
		);
	}

	return (
		<Box
			sx={{
				marginRight: '5px',
				marginTop: '10px',
			}}
		>
			<WeekList />
			{currentWeek !== '' && (
				<WeekDetails
					currentWeek={currentWeek}
					handleWeekAdd={handleWeekAdd}
					handleImportEPUB={handleImportEPUB}
					handleSaveSource={handleSaveSource}
				/>
			)}
		</Box>
	);
};

export default SourceMaterial;
