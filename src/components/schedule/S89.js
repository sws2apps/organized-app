import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import {
	dbGetS89ItemData,
	dbGetS89WeekList,
} from '../../indexedDb/dbAssignment';
import TreeViewCheckbox from '../reusable/TreeViewCheckbox';
import {
	currentScheduleState,
	s89DataState,
} from '../../appStates/appSchedule';
import { rootModalOpenState } from '../../appStates/appSettings';

const S89 = () => {
	const { t } = useTranslation();
	let navigate = useNavigate();

	const [data, setData] = useState({});
	const [selected, setSelected] = useState([]);
	const [loading, setLoading] = useState(true);
	const [disablePDF, setDisablePDF] = useState(false);

	const setS89Data = useSetRecoilState(s89DataState);
	const setRootModalOpen = useSetRecoilState(rootModalOpenState);

	const currentSchedule = useRecoilValue(currentScheduleState);

	useEffect(() => {
		const getDataS89 = async () => {
			const data = await dbGetS89WeekList(currentSchedule);
			setData(data);
			setLoading(false);
		};
		if (currentSchedule !== '') {
			getDataS89();
		}
	}, [currentSchedule]);

	const handlePreviewS89 = async () => {
		setRootModalOpen(true);
		const realData = selected.filter((item) => item.length > 10);
		realData.sort((a, b) => {
			return a > b ? 1 : -1;
		});

		let s89Data = [];

		for (let i = 0; i < realData.length; i++) {
			const week = realData[i].split('-')[0];
			const assType = realData[i].split('@')[1].split('-')[0];
			const classLabel = realData[i].split('-')[2];

			const data = await dbGetS89ItemData(week, assType, classLabel);

			let obj = {};
			obj.id = realData[i];

			s89Data.push({ ...obj, ...data });
		}

		setS89Data(s89Data);

		navigate('/s89-template');
		setRootModalOpen(false);
	};

	useEffect(() => {
		const realData = selected.filter((item) => item.length > 10);
		if (realData.length === 0) {
			setDisablePDF(true);
		} else {
			setDisablePDF(false);
		}
	}, [selected]);

	return (
		<Box sx={{ minWidth: 320 }}>
			{loading && (
				<CircularProgress
					color='secondary'
					size={60}
					disableShrink={true}
					sx={{
						display: 'flex',
						margin: '10px auto',
					}}
				/>
			)}
			{!loading && (
				<>
					{Object.keys(data).length > 2 && (
						<>
							{data.children.length > 0 && (
								<>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<Button
											variant='contained'
											color='secondary'
											startIcon={<PlayArrowIcon />}
											disabled={disablePDF}
											onClick={() => handlePreviewS89()}
											sx={{ marginRight: '10px' }}
										>
											{t('global.preview')}
										</Button>
									</Box>
									<TreeViewCheckbox
										data={data}
										selected={selected}
										setSelected={(value) => setSelected(value)}
										defaultExpanded={['S89']}
									/>
								</>
							)}
							{data.children.length === 0 && (
								<Container
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										height: '20vh',
									}}
								>
									<WarningIcon color='error' sx={{ fontSize: '60px' }} />
									<Typography variant='body1' align='center'>
										{t('schedule.s89NoData')}
									</Typography>
								</Container>
							)}
						</>
					)}
				</>
			)}
		</Box>
	);
};

export default S89;
