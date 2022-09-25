import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import VipFindUser from '../components/administration/VipFindUser';
import {
	apiHostState,
	rootModalOpenState,
	userEmailState,
	visitorIDState,
} from '../appStates/appSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../appStates/appNotification';
import { congIDState } from '../appStates/appCongregation';

const VipUserDetail = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const { id } = useParams();
	const navigate = useNavigate();

	const { t } = useTranslation();

	const setModalOpen = useSetRecoilState(rootModalOpenState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const userEmail = useRecoilValue(userEmailState);
	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const congID = useRecoilValue(congIDState);

	const [member, setMember] = useState({});
	const [isProcessing, setIsProcessing] = useState(false);

	const handleCheckAdmin = (value) => {
		let role = [];
		if (value) {
			role = ['admin', ...member.cong_role];
		} else {
			role = member.cong_role.filter((role) => role !== 'admin');
		}

		setMember((prev) => {
			return { ...prev, cong_role: role };
		});
	};

	const handleCheckLMMO = (value) => {
		let role = [];
		if (value) {
			role = [...member.cong_role, 'lmmo'];
		} else {
			role = member.cong_role.filter((role) => role !== 'lmmo');
		}

		setMember((prev) => {
			return { ...prev, cong_role: role };
		});
	};

	const handleCheckLMMOAssistant = (value) => {
		let role = [];
		if (value) {
			role = [...member.cong_role, 'lmmo-backup'];
		} else {
			role = member.cong_role.filter((role) => role !== 'lmmo-backup');
		}

		setMember((prev) => {
			return { ...prev, cong_role: role };
		});
	};

	const handleFetchUserById = useCallback(async () => {
		try {
			if (apiHost !== '') {
				setMember({});
				setIsProcessing(true);

				const res = await fetch(
					`${apiHost}api/congregations/${congID}/members/${id}`,
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
					setMember(data);
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
		id,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		userEmail,
		visitorID,
	]);

	const handleUpdateRole = async () => {
		try {
			if (apiHost !== '') {
				setModalOpen(true);

				const api = id
					? `${apiHost}api/congregations/${congID}/members/${member.id}/role`
					: `${apiHost}api/congregations/${congID}/members/${member.id}`;

				const res = await fetch(api, {
					signal: abortCont.signal,
					method: `${id ? 'PATCH' : 'PUT'}`,
					headers: {
						'Content-Type': 'application/json',
						visitor_id: visitorID,
						email: userEmail,
					},
					body: JSON.stringify({ user_role: member.cong_role }),
				});

				const data = await res.json();

				if (res.status === 200) {
					setModalOpen(false);
					navigate('/administration');
					return;
				}

				setModalOpen(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			if (!abortCont.signal.aborted) {
				setModalOpen(false);
				setAppMessage(err.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
			}
		}
	};

	useEffect(() => {
		if (id) handleFetchUserById();
	}, [id, handleFetchUserById]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Container>
			<Box>
				<Typography sx={{ fontWeight: 'bold' }}>
					{id
						? t('administration.editBrotherRole')
						: t('administration.addNewBrother')}
				</Typography>
				{!id && <VipFindUser setMember={(value) => setMember(value)} />}
				{id && isProcessing && (
					<CircularProgress
						color='secondary'
						size={40}
						disableShrink={true}
						sx={{
							display: 'flex',
							margin: '80px auto',
						}}
					/>
				)}
				{!isProcessing && member.id && (
					<Box sx={{ marginTop: '20px' }}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '15px',
							}}
						>
							<AccountCircleIcon
								color='primary'
								sx={{ fontSize: '40px', marginRight: '10px' }}
							/>
							<Box>
								<Typography sx={{ minWidth: '300px', fontWeight: 'bold' }}>
									{member.username}
								</Typography>
								<Typography sx={{ fontSize: '13px' }}>
									{member.user_uid}
								</Typography>
							</Box>
						</Box>
						<Box sx={{ marginLeft: '50px' }}>
							<Typography sx={{ fontWeight: 'bold' }}>
								{t('administration.congregationRoles')}
							</Typography>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											checked={member?.cong_role?.includes('admin') || false}
											onChange={(e) => handleCheckAdmin(e.target.checked)}
										/>
									}
									label={t('administration.roleAdmin')}
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={member?.cong_role?.includes('lmmo') || false}
											onChange={(e) => handleCheckLMMO(e.target.checked)}
										/>
									}
									label={t('administration.roleLMMO')}
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={
												member?.cong_role?.includes('lmmo-backup') || false
											}
											onChange={(e) =>
												handleCheckLMMOAssistant(e.target.checked)
											}
										/>
									}
									label={t('administration.roleLMMOAssistant')}
								/>
							</FormGroup>
							<Box sx={{ marginTop: '15px' }}>
								<Button variant='outlined' onClick={handleUpdateRole}>
									{t('global.save')}
								</Button>
							</Box>
						</Box>
					</Box>
				)}
			</Box>
		</Container>
	);
};

export default VipUserDetail;
