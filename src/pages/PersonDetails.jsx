import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import maleIcon from '../img/student_male.svg';
import femaleIcon from '../img/student_female.svg';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import HandshakeIcon from '@mui/icons-material/Handshake';
import IconButton from '@mui/material/IconButton';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import Typography from '@mui/material/Typography';
import { dbGetStudentDetails, dbSavePersonExp } from '../indexedDb/dbPersons';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { rootModalOpenState } from '../states/main';
import { studentsQueryState } from '../states/persons';
import { PersonAssignments, PersonBasic, PersonHistory, PersonTimeAway } from '../features/persons';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const iconButtonStyles = {
  borderRadius: '8px',
  '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
    borderRadius: 0,
    backgroundColor: 'rgba(23, 32, 42, .3)',
  },
  border: '1px outset',
  marginLeft: '10px',
};

const txtButtonStyles = {
  textTransform: 'uppercase',
  fontSize: '14px',
  marginLeft: '8px',
  fontWeight: 'bold',
};

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const studentsQuery = useRecoilValue(studentsQueryState);

  const [isProcessing, setIsProcessing] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [isMale, setIsMale] = useState(true);
  const [isFemale, setIsFemale] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [historyAssignments, setHistoryAssignments] = useState([]);
  const [timeAway, setTimeAway] = useState([]);
  const [expanded, setExpanded] = useState('panel1');
  const [student, setStudent] = useState({});

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handlePersonMove = async () => {
    const obj = assignments.map((assignment) =>
      assignment.endDate === null
        ? {
            ...assignment,
            endDate: format(new Date(), 'MM/dd/yyy'),
            comments: t('global.endMoved'),
          }
        : assignment
    );

    setRootModalOpen(true);
    const data = { ...student, isMoved: true, assignments: obj };
    const result = await dbSavePersonExp(data);
    if (result) {
      navigate({
        pathname: '/students',
        search: `${createSearchParams(studentsQuery)}`,
      });
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('persons.missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handlePersonEnabled = async () => {
    setRootModalOpen(true);
    const data = { ...student, isDisqualified: false };
    const result = await dbSavePersonExp(data);
    if (result) {
      navigate({
        pathname: '/students',
        search: `${createSearchParams(studentsQuery)}`,
      });
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('persons.missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handlePersonDisqualified = async () => {
    const obj = assignments.map((assignment) =>
      assignment.endDate === null
        ? {
            ...assignment,
            endDate: format(new Date(), 'MM/dd/yyy'),
            comments: t('global.disqualified'),
          }
        : assignment
    );

    setRootModalOpen(true);
    const data = { ...student, isDisqualified: true, assignments: obj };
    const result = await dbSavePersonExp(data);
    if (result) {
      navigate({
        pathname: '/students',
        search: `${createSearchParams(studentsQuery)}`,
      });
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('persons.missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handleSavePerson = async () => {
    setRootModalOpen(true);
    const result = await dbSavePersonExp(student);
    if (result) {
      navigate({
        pathname: '/persons',
        search: `${createSearchParams(studentsQuery)}`,
      });
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('persons.missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handleNavigateStudents = () => {
    navigate({
      pathname: '/persons',
      search: `${createSearchParams(studentsQuery)}`,
    });
  };

  useEffect(() => {
    setStudent((prev) => {
      return { ...prev, person_name: name };
    });
  }, [name]);

  useEffect(() => {
    setStudent((prev) => {
      return { ...prev, person_displayName: displayName };
    });
  }, [displayName]);

  useEffect(() => {
    setStudent((prev) => {
      return { ...prev, isMale: isMale };
    });
  }, [isMale]);

  useEffect(() => {
    setStudent((prev) => {
      return { ...prev, isFemale: isFemale };
    });
  }, [isFemale]);

  useEffect(() => {
    setStudent((prev) => {
      return { ...prev, assignments: assignments };
    });
  }, [assignments]);

  useEffect(() => {
    setStudent((prev) => {
      return { ...prev, timeAway: timeAway };
    });
  }, [timeAway]);

  useEffect(() => {
    const init = async () => {
      if (id) {
        const recentStudents = localStorage.getItem('recentStudents')
          ? JSON.parse(localStorage.getItem('recentStudents'))
          : [];
        const isExistRecent = recentStudents.find((student) => student === id) ? true : false;

        if (!isExistRecent) {
          recentStudents.push(id);
          localStorage.setItem('recentStudents', JSON.stringify(recentStudents));
        }

        const data = await dbGetStudentDetails(id);
        setStudent(data);
        setName(data.person_name);
        setDisplayName(data.person_displayName);
        setIsMale(data.isMale);
        setIsFemale(data.isFemale);
        setAssignments(data.assignments);
        setHistoryAssignments(data.historyAssignments);
        setTimeAway(data.timeAway);
        setIsEdit(true);
      } else {
        setIsEdit(false);
      }
      setIsProcessing(false);
    };

    init();
  }, [id, t]);

  return (
    <Box sx={{ padding: '10px' }}>
      {isProcessing && (
        <CircularProgress
          color="secondary"
          size={80}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '20vh auto',
          }}
        />
      )}
      {!isProcessing && (
        <>
          <Box id="student-details-header">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <IconButton onClick={handleNavigateStudents}>
                  <ArrowBackIcon sx={{ fontSize: '30px' }} />
                </IconButton>
                <Typography
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    flexGrow: 1,
                  }}
                >
                  {isEdit ? t('persons.edit') : t('persons.addNew')}
                </Typography>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {isEdit && student.isDisqualified === false && (
                  <Tooltip title={lgUp ? '' : t('persons.markDisqualified')}>
                    <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handlePersonDisqualified}>
                      <RemoveCircleIcon color="error" />
                      {lgUp && <Typography sx={txtButtonStyles}>{t('persons.markDisqualified')}</Typography>}
                    </IconButton>
                  </Tooltip>
                )}

                {isEdit && student.isDisqualified === true && (
                  <Tooltip title={lgUp ? '' : t('persons.enable')}>
                    <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handlePersonEnabled}>
                      <HandshakeIcon color="success" />
                      {lgUp && <Typography sx={txtButtonStyles}>{t('persons.enable')}</Typography>}
                    </IconButton>
                  </Tooltip>
                )}

                {isEdit && (
                  <Tooltip title={lgUp ? '' : t('persons.markTransfer')}>
                    <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handlePersonMove}>
                      <TransferWithinAStationIcon sx={{ color: '#6C3483' }} />
                      {lgUp && <Typography sx={txtButtonStyles}>{t('persons.markTransfer')}</Typography>}
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title={lgUp ? '' : t('global.save')}>
                  <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handleSavePerson}>
                    <SaveIcon color="primary" />
                    {lgUp && <Typography sx={txtButtonStyles}>{t('global.save')}</Typography>}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          <Box
            id="student-details-content"
            sx={{
              marginTop: '10px',
              border: '1px outset',
              borderRadius: '8px',
              padding: '10px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Avatar
                sx={{
                  height: '50px',
                  width: '50px',
                  marginRight: '5px',
                }}
                alt="Student icon"
                src={isMale ? maleIcon : femaleIcon}
              />
              <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', lineHeight: 1.2 }}>{name}</Typography>
                {student.isDisqualified && (
                  <Chip
                    label={t('persons.disqualifiedLabel')}
                    size="small"
                    sx={{ backgroundColor: 'red', color: 'white' }}
                  />
                )}
              </Box>
            </Box>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography>{t('persons.basicInfo')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonBasic
                  isMale={isMale}
                  setIsMale={(value) => setIsMale(value)}
                  isFemale={isFemale}
                  setIsFemale={(value) => setIsFemale(value)}
                  name={name}
                  setName={(value) => setName(value)}
                  displayName={displayName}
                  setDisplayName={(value) => setDisplayName(value)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography>{t('persons.assignments')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonAssignments
                  student={student}
                  assignments={assignments}
                  setAssignments={(value) => setAssignments(value)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <Typography>{t('persons.assignmentsHistory')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonHistory history={historyAssignments} />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                <Typography>{t('persons.timeAway')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonTimeAway timeAway={timeAway} setTimeAway={(value) => setTimeAway(value)} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PersonDetails;
