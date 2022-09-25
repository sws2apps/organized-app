import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { s89DataState } from '../appStates/appSchedule';
import { appLangState } from '../appStates/appSettings';

const sharedStyles = {
	tblData: {
		padding: 0,
		borderBottom: 'none',
	},
};

const S89Template = () => {
	let navigate = useNavigate();
	const { t } = useTranslation();

	const appLang = useRecoilValue(appLangState);
	const s89Data = useRecoilValue(s89DataState);

	const [dlgOpen, setDlgOpen] = useState(false);

	const savePDF = async () => {
		setDlgOpen(true);
		const element = document.getElementById('S89-wrapper');
		var opt = {
			filename: 'S-89.pdf',
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'in', format: [3.35, 4.45], orientation: 'portrait' },
		};
		await html2pdf().set(opt).from(element).save();
		setDlgOpen(false);
	};

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}
	};

	useEffect(() => {
		if (s89Data.length === 0) {
			navigate('/Schedule');
		}
	}, [navigate, s89Data]);

	return (
		<Box>
			<Dialog
				open={dlgOpen}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					{t('global.pleaseWait')}
				</DialogTitle>
				<DialogContent>
					<Container
						sx={{
							display: 'flex',
							justifyContent: 'center',
							padding: '15px',
						}}
					>
						<CircularProgress disableShrink color='secondary' size={'60px'} />
					</Container>
				</DialogContent>
			</Dialog>
			{s89Data.length > 0 && (
				<>
					<Button
						variant='contained'
						color='primary'
						startIcon={<SaveAltIcon />}
						sx={{ margin: '0 2px 2px 0' }}
						onClick={savePDF}
					>
						PDF
					</Button>
					<Box id='S89-wrapper'>
						{s89Data.map((data) => (
							<Box key={data.id}>
								<Box
									sx={{
										width: '321.6px',
										height: '426.8px',
									}}
								>
									<TableContainer sx={{ paddingTop: '10px' }}>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell align='center' sx={sharedStyles.tblData}>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontWeight: 'bold',
																fontSize: '15px',
																lineHeight: 1.3,
															}}
														>
															<Markup content={t('s89.title')} />
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<TableContainer
										sx={{
											paddingTop: '5px',
											paddingLeft: '10px',
											paddingRight: '10px',
										}}
									>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '10px',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontWeight: 'bold',
																fontSize: '15px',
															}}
														>
															{t('global.name')}:
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															borderBottom: '1px dotted black',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '13px',
															}}
														>
															{data.studentName}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<TableContainer
										sx={{
											paddingTop: '5px',
											paddingLeft: '10px',
											paddingRight: '10px',
										}}
									>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '10px',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontWeight: 'bold',
																fontSize: '15px',
															}}
														>
															{t('global.assistant')}:
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															borderBottom: '1px dotted black',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '13px',
															}}
														>
															{data.assistantName}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<TableContainer
										sx={{
											paddingTop: '5px',
											paddingLeft: '10px',
											paddingRight: '10px',
										}}
									>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '10px',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontWeight: 'bold',
																fontSize: '15px',
															}}
														>
															{t('global.date')}:
														</Typography>
													</TableCell>
													<TableCell
														align='center'
														sx={{
															...sharedStyles.tblData,
															borderBottom: '1px dotted black',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '13px',
															}}
														>
															{data.assignmentDate}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<Typography
										sx={{
											fontFamily: 'Segoe UI',
											fontSize: '13px',
											fontWeight: 'bold',
											marginTop: '15px',
											marginLeft: '10px',
										}}
									>
										{t('global.assignment')}:
									</Typography>
									<TableContainer
										sx={{
											paddingTop: '5px',
											paddingLeft: '15px',
											paddingRight: '10px',
										}}
									>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
															checked={data.isBRead}
															onChange={() => {}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1,
															width: '127px',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														>
															{t('global.bibleReading')}
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															paddingLeft: '5px',
															lineHeight: 1,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
															checked={data.isBibleStudy}
															onChange={() => {}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1,
															width: '125px',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														>
															{t('global.bibleStudy')}
														</Typography>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
															checked={data.isInitialCall}
															onChange={() => {}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														>
															{t('global.initialCall')}
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															paddingLeft: '5px',
															lineHeight: 1,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
															checked={data.isTalk}
															onChange={() => {}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														>
															{t('global.talk')}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<TableContainer
										sx={{
											paddingLeft: '30px',
											paddingRight: '10px',
										}}
									>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1,
														}}
													></TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '127px',
															lineHeight: 1,
															borderBottom: '1px dotted black',
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														>
															{data.isInitialCallSpec}
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															paddingLeft: '5px',
															lineHeight: 1,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '2px',
															lineHeight: 1,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														>
															{t('global.otherPart')}:
														</Typography>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															borderBottom: '1px dotted black',
															lineHeight: 1,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														></Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<TableContainer
										sx={{
											paddingTop: '3px',
											paddingLeft: '15px',
											paddingRight: '10px',
											width: '175px',
										}}
									>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
															checked={data.isReturnVisit}
															onChange={() => {}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1.3,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1.3,
															}}
														>
															{t('global.returnVisit')}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<TableContainer
										sx={{
											paddingLeft: '30px',
											paddingRight: '10px',
											width: '173px',
										}}
									>
										<Table size='small' sx={{ height: '18px' }}>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1,
														}}
													></TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															borderBottom: '1px dotted black',
															lineHeight: 1,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1,
															}}
														>
															{data.returnVisitSpec}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<Typography
										sx={{
											fontFamily: 'Segoe UI',
											fontSize: '13px',
											fontWeight: 'bold',
											marginTop: '8px',
											marginLeft: '10px',
										}}
									>
										{t('s89.toBeGiven')}
									</Typography>
									<TableContainer
										sx={{
											paddingLeft: '15px',
											paddingRight: '10px',
										}}
									>
										<Table size='small'>
											<TableBody>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1.2,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
															checked={data.isMainHall}
															onChange={() => {}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1.2,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1.2,
															}}
														>
															{t('global.mainHall')}
														</Typography>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1.2,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
															checked={data.isAuxClass}
															onChange={() => {}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1.2,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1.2,
															}}
														>
															{t('global.auxClass1')}
														</Typography>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															width: 0,
															paddingRight: '5px',
															lineHeight: 1.2,
														}}
													>
														<Checkbox
															color='default'
															size='small'
															sx={{
																padding: 0,
																'& .MuiSvgIcon-root': { fontSize: 15 },
															}}
														/>
													</TableCell>
													<TableCell
														sx={{
															...sharedStyles.tblData,
															lineHeight: 1.2,
														}}
													>
														<Typography
															sx={{
																fontFamily: 'Segoe UI',
																fontSize: '12px',
																lineHeight: 1.2,
															}}
														>
															{t('global.auxClass2')}
														</Typography>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
									<Box>
										<Typography
											sx={{
												fontFamily: 'Segoe UI',
												fontSize: '9px',
												marginTop: '5px',
												marginLeft: '10px',
												marginRight: '10px',
												lineHeight: 1.2,
												textAlign: 'justify',
											}}
										>
											<Markup content={t('s89.descFooter')} />
										</Typography>
									</Box>
									<Box sx={{ display: 'flex' }}>
										<Typography
											sx={{
												fontFamily: 'Segoe UI',
												fontSize: '11px',
												marginTop: '10px',
												marginLeft: '10px',
											}}
										>
											S-89-{appLang.toUpperCase()}
										</Typography>
										<Typography
											sx={{
												fontFamily: 'Segoe UI',
												fontSize: '11px',
												marginTop: '10px',
												marginLeft: '10px',
											}}
										>
											11/20
										</Typography>
									</Box>
								</Box>
								<div className='html2pdf__page-break'></div>
							</Box>
						))}
					</Box>
				</>
			)}
		</Box>
	);
};

export default S89Template;
