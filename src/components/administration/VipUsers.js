import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import VipUser from './VipUser';
import {
	apiHostState,
	userEmailState,
	visitorIDState,
} from '../../appStates/appSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import { congIDState } from '../../appStates/appCongregation';

const VipUsers = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const { t } = useTranslation();
	const navigate = useNavigate();

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const userEmail = useRecoilValue(userEmailState);
	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const congID = useRecoilValue(congIDState);

	const [isProcessing, setIsProcessing] = useState(true);
	const [members, setMembers] = useState([]);

	const handleAddMember = () => {
		navigate('/administration/members/new');
	};

	const getCongregationMembers = useCallback(async () => {
		try {
			if (apiHost !== '') {
				setIsProcessing(true);
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/members`,
					{
						signal: abortCont.signal,
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					setMembers(data);
					setIsProcessing(false);
					return;
				}

				setIsProcessing(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			if (!abortCont.signal.aborted) {
				setIsProcessing(false);
				setAppMessage(err.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
			}
		}
	}, [
		abortCont,
		apiHost,
		congID,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		userEmail,
		visitorID,
	]);

	useEffect(() => {
		getCongregationMembers();
	}, [getCongregationMembers]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			<Typography sx={{ fontWeight: 'bold' }}>
				{t('administration.vipUsersHeading')}
			</Typography>
			<Box sx={{ marginTop: '10px' }}>
				<Button
					variant='outlined'
					startIcon={<AddCircleIcon />}
					onClick={handleAddMember}
				>
					{t('global.add')}
				</Button>
			</Box>
			<Box
				sx={{
					border: '1px outset',
					borderRadius: '8px',
					margin: '10px 0',
					padding: '10px',
				}}
			>
				{isProcessing && (
					<CircularProgress
						color='secondary'
						size={40}
						disableShrink={true}
						sx={{
							display: 'flex',
							margin: '10px auto',
						}}
					/>
				)}
				{!isProcessing &&
					members.length > 0 &&
					members.map((member) => (
						<VipUser
							key={member.id}
							member={member}
							setMembers={(value) => setMembers(value)}
						/>
					))}
			</Box>
		</Box>
	);
};

export default VipUsers;
