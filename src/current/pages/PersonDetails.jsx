import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
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
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { rootModalOpenState } from '../states/main';
import { PersonAssignments, PersonBasic, PersonHistory, PersonTimeAway } from '../features/persons';
import { Persons } from '../classes/Persons';
import PersonSpiritualStatus from '../features/persons/PersonSpiritualStatus';
import { ServiceYear } from '../classes/ServiceYear';
import { Setting } from '../classes/Setting';

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
  const { t } = useTranslation('ui');

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

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
  const [person, setPerson] = useState({});
  const [birthDate, setBirthDate] = useState(null);
  const [immersedDate, setImmersedDate] = useState(null);
  const [isBaptized, setIsBaptized] = useState(false);
  const [isAnointed, setIsAnointed] = useState(false);
  const [isOtherSheep, setIsOtherSheep] = useState(true);
  const [personEmail, setPersonEmail] = useState('');
  const [personAddress, setPersonAddress] = useState('');
  const [personPhone, setPersonPhone] = useState('');
  const [spiritualStatus, setSpiritualStatus] = useState([]);
  const [otherService, setOtherService] = useState([]);
  const [firstMonthReport, setFirstMonthReport] = useState(ServiceYear.currentReportMonth());

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const isPersonEditor = lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole;

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handlePersonMove = async () => {
    setRootModalOpen(true);
    const data = { ...person, isMoved: true };
    const result = await Persons.preSave(data);
    if (result) {
      navigate('/persons');
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handlePersonEnabled = async () => {
    setRootModalOpen(true);
    const data = { ...person, isDisqualified: false };
    const result = await Persons.preSave(data);
    if (result) {
      navigate('/persons');
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handlePersonDisqualified = async () => {
    setRootModalOpen(true);
    const data = { ...person, isDisqualified: true };
    const result = await Persons.preSave(data);
    if (result) {
      navigate('/persons');
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handleSavePerson = async () => {
    setRootModalOpen(true);
    const result = await Persons.preSave(person);
    if (result) {
      navigate('/persons');
      setRootModalOpen(false);
    } else {
      setRootModalOpen(false);
      setAppMessage(t('missingInfo'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
    }
  };

  const handleNavigateStudents = () => {
    navigate('/persons');
  };

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, person_name: name };
    });
  }, [name]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, person_displayName: displayName };
    });
  }, [displayName]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, isMale };
    });
  }, [isMale]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, isFemale };
    });
  }, [isFemale]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, assignments };
    });
  }, [assignments]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, timeAway };
    });
  }, [timeAway]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, birthDate };
    });
  }, [birthDate]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, isBaptized };
    });
  }, [isBaptized]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, immersedDate };
    });
  }, [immersedDate]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, isOtherSheep };
    });
  }, [isOtherSheep]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, isAnointed };
    });
  }, [isAnointed]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, firstMonthReport };
    });
  }, [firstMonthReport]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, email: personEmail };
    });
  }, [personEmail]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, address: personAddress };
    });
  }, [personAddress]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, phone: personPhone };
    });
  }, [personPhone]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, spiritualStatus };
    });
  }, [spiritualStatus]);

  useEffect(() => {
    setPerson((prev) => {
      return { ...prev, otherService };
    });
  }, [otherService]);

  useEffect(() => {
    const init = async () => {
      if (id) {
        const recentPersons = localStorage.getItem('recentPersons')
          ? JSON.parse(localStorage.getItem('recentPersons'))
          : [];
        const isExistRecent = recentPersons.find((person) => person === id) ? true : false;

        if (!isExistRecent) {
          recentPersons.push(id);
          localStorage.setItem('recentPersons', JSON.stringify(recentPersons));
        }

        const data = Persons.get(id);
        setPerson(data);
        setName(data.person_name);
        setDisplayName(data.person_displayName);
        setIsMale(data.isMale);
        setIsFemale(data.isFemale);
        setBirthDate(data.birthDate);
        setIsBaptized(data.isBaptized);
        setImmersedDate(data.immersedDate);
        setIsOtherSheep(data.isOtherSheep);
        setIsAnointed(data.isAnointed);
        setFirstMonthReport(data.firstMonthReport);
        setAssignments(data.assignments);
        setHistoryAssignments(data.historyAssignments());
        setTimeAway(data.timeAway);
        setPersonEmail(data.email);
        setPersonAddress(data.address);
        setPersonPhone(data.phone);
        setSpiritualStatus(data.spiritualStatus);
        setOtherService(data.otherService);
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
          <Box id="person-details-header">
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
                  {isEdit ? t(isPersonEditor ? 'edit' : 'details') : t('addNew')}
                </Typography>
              </Box>

              {isPersonEditor && (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  {isEdit && person.isDisqualified === false && (
                    <Tooltip title={lgUp ? '' : t('markDisqualified')}>
                      <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handlePersonDisqualified}>
                        <RemoveCircleIcon color="error" />
                        {lgUp && <Typography sx={txtButtonStyles}>{t('markDisqualified')}</Typography>}
                      </IconButton>
                    </Tooltip>
                  )}

                  {isEdit && person.isDisqualified === true && (
                    <Tooltip title={lgUp ? '' : t('enablePerson')}>
                      <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handlePersonEnabled}>
                        <HandshakeIcon color="success" />
                        {lgUp && <Typography sx={txtButtonStyles}>{t('enablePerson')}</Typography>}
                      </IconButton>
                    </Tooltip>
                  )}

                  {isEdit && (
                    <Tooltip title={lgUp ? '' : t('markTransfer')}>
                      <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handlePersonMove}>
                        <TransferWithinAStationIcon sx={{ color: '#6C3483' }} />
                        {lgUp && <Typography sx={txtButtonStyles}>{t('markTransfer')}</Typography>}
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title={lgUp ? '' : t('save')}>
                    <IconButton edge="start" color="inherit" sx={iconButtonStyles} onClick={handleSavePerson}>
                      <SaveIcon color="primary" />
                      {lgUp && <Typography sx={txtButtonStyles}>{t('save')}</Typography>}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            id="person-details-content"
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
                {person.isDisqualified && (
                  <Chip label={t('disqualifiedLabel')} size="small" sx={{ backgroundColor: 'red', color: 'white' }} />
                )}
              </Box>
            </Box>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <Typography>{t('basicInfo')}</Typography>
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
                  birthDate={birthDate}
                  setBirthDate={(value) => setBirthDate(value)}
                  personEmail={personEmail}
                  setPersonEmail={(value) => setPersonEmail(value)}
                  personAddress={personAddress}
                  setPersonAddress={(value) => setPersonAddress(value)}
                  personPhone={personPhone}
                  setPersonPhone={(value) => setPersonPhone(value)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panelSpiritualStatus'} onChange={handleChange('panelSpiritualStatus')}>
              <AccordionSummary aria-controls="panelSpiritualStatus-content" id="panelSpiritualStatus-header">
                <Typography>{t('spiritualStatus')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonSpiritualStatus
                  isFemale={isFemale}
                  immersedDate={immersedDate}
                  setImmersedDate={(value) => setImmersedDate(value)}
                  isBaptized={isBaptized}
                  setIsBaptized={(value) => setIsBaptized(value)}
                  isOtherSheep={isOtherSheep}
                  setIsOtherSheep={(value) => setIsOtherSheep(value)}
                  isAnointed={isAnointed}
                  setIsAnointed={(value) => setIsAnointed(value)}
                  firstMonthReport={firstMonthReport}
                  setFirstMonthReport={(value) => setFirstMonthReport(value)}
                  birthDate={birthDate}
                  spiritualStatus={spiritualStatus}
                  setSpiritualStatus={(value) => setSpiritualStatus(value)}
                  otherService={otherService}
                  setOtherService={(value) => setOtherService(value)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography>{t('assignments')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonAssignments
                  person={person}
                  assignments={assignments}
                  setAssignments={(value) => setAssignments(value)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <Typography>{t('assignmentsHistory')}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonHistory history={historyAssignments} />
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
              <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                <Typography>{t('timeAway')}</Typography>
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
