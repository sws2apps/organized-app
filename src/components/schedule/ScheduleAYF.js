import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { classCountState } from '../../appStates/appCongregation';

const TypoStudentPart = styled(Typography)(() => ({
	fontWeight: 'bold',
	fontSize: '16px',
}));

const BoxStudentAYF = styled(Box)(() => ({
	display: 'flex',
	flexDirection: 'column',
	marginBottom: '8px',
}));

const TypoStudentField = styled(Typography)(() => ({
	height: '25px',
	lineHeight: '25px',
	width: '165px',
	backgroundColor: 'lightblue',
	color: 'purple',
	padding: '2px 2px 2px 5px',
	borderRadius: 5,
	fontWeight: 'bold',
}));

const BoxStudentFldContainer = styled(Box)(() => ({
	display: 'flex',
	marginRight: '5px',
	alignItems: 'flex-end',
}));

const IconButtonContainer = styled(IconButton)(() => ({
	padding: '1px',
}));

const EditIconButton = styled(EditIcon)(() => ({
	fontSize: '24px',
}));

const StudentAYF = (props) => {
	const { t } = useTranslation();

	const {
		assType,
		assTypeName,
		assTime,
		assSrc,
		stuA,
		assA,
		stuB,
		assB,
		stuAID,
		assAID,
		stuBID,
		assBID,
		isStuA,
		isAssA,
		isStuB,
		isAssB,
	} = props.params;
	const { loadStudentPicker } = props;

	const classCount = useRecoilValue(classCountState);

	const studentPartWrapper1Styles = {
		width: {
			xs: '100%',
			sm: 'calc(100% - 200px)',
		},
	};

	const studentPartWrapper2Styles = {
		width: {
			xs: '100%',
			sm: 'calc(100% - 200px)',
			sm800: 'calc(100% - 400px)',
			lg: 'calc(100% - 200px)',
		},
		flexDirection: {
			sm800: 'row',
		},
	};

	const studentContainer1Styles = {
		display: 'flex',
		justifyContent: {
			xs: 'flex-start',
			sm: 'flex-end',
		},
	};

	const studentContainer2Styles = {
		display: 'flex',
		justifyContent: {
			xs: 'flex-start',
			sm: 'flex-end',
		},
		flexDirection: {
			xs: 'column',
			xs420: 'row',
			sm: 'column',
			sm800: 'row',
			lg: 'column',
		},
	};

	const loadStuPicker = (
		assID,
		assType,
		assTypeName,
		currentStudent,
		stuForAssistant,
		assTypeNameForAssistant
	) => {
		var obj = {};
		obj.assID = assID;
		obj.assType = assType;
		obj.assTypeName = assTypeName;
		obj.currentStudent = currentStudent;
		obj.stuForAssistant = stuForAssistant;
		obj.assTypeNameForAssistant = assTypeNameForAssistant;
		loadStudentPicker(obj);
	};

	return (
		<>
			{assSrc && (
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
						marginBottom: '10px',
					}}
				>
					<Grid
						item
						sx={
							classCount === 1
								? studentPartWrapper1Styles
								: studentPartWrapper2Styles
						}
					>
						{assType !== 7 && (
							<TypoStudentPart variant='body1'>
								{assTypeName} ({assTime} min.)
							</TypoStudentPart>
						)}
						<Typography variant='body1'>{assSrc}</Typography>
					</Grid>
					{assType !== 5 && assType !== 6 && assType !== 7 && (
						<Grid
							item
							sx={
								classCount === 1
									? studentContainer1Styles
									: studentContainer2Styles
							}
						>
							<BoxStudentAYF>
								<BoxStudentFldContainer>
									<TypoStudentField variant='body1'>{stuA}</TypoStudentField>
									{isStuA && (
										<CircularProgress
											sx={{ padding: '1px' }}
											color='secondary'
											size={26}
											disableShrink={true}
										/>
									)}
									{!isStuA && (
										<IconButtonContainer
											onClick={() =>
												loadStuPicker(stuAID, assType, assTypeName, stuA)
											}
										>
											<EditIconButton />
										</IconButtonContainer>
									)}
								</BoxStudentFldContainer>
								{assType !== 4 && (
									<BoxStudentFldContainer>
										<TypoStudentField variant='body1'>{assA}</TypoStudentField>
										{isAssA && (
											<CircularProgress
												sx={{ padding: '1px' }}
												color='secondary'
												size={26}
												disableShrink={true}
											/>
										)}
										{!isAssA && (
											<IconButtonContainer
												onClick={() =>
													loadStuPicker(
														assAID,
														assType,
														t('global.assistant'),
														assA,
														stuA,
														assTypeName
													)
												}
											>
												<EditIconButton />
											</IconButtonContainer>
										)}
									</BoxStudentFldContainer>
								)}
							</BoxStudentAYF>
							{classCount === 2 && (
								<BoxStudentAYF>
									<BoxStudentFldContainer>
										<TypoStudentField variant='body1'>{stuB}</TypoStudentField>
										{isStuB && (
											<CircularProgress
												sx={{ padding: '1px' }}
												color='secondary'
												size={26}
												disableShrink={true}
											/>
										)}
										{!isStuB && (
											<IconButtonContainer
												onClick={() =>
													loadStuPicker(stuBID, assType, assTypeName, stuB)
												}
											>
												<EditIconButton />
											</IconButtonContainer>
										)}
									</BoxStudentFldContainer>
									{assType !== 4 && (
										<BoxStudentFldContainer>
											<TypoStudentField variant='body1'>
												{assB}
											</TypoStudentField>
											{isAssB && (
												<CircularProgress
													sx={{ padding: '1px' }}
													color='secondary'
													size={26}
													disableShrink={true}
												/>
											)}
											{!isAssB && (
												<IconButtonContainer
													onClick={() =>
														loadStuPicker(
															assBID,
															assType,
															t('global.assistant'),
															assB,
															stuB,
															assTypeName
														)
													}
												>
													<EditIconButton />
												</IconButtonContainer>
											)}
										</BoxStudentFldContainer>
									)}
								</BoxStudentAYF>
							)}
						</Grid>
					)}
				</Box>
			)}
		</>
	);
};

export default StudentAYF;
