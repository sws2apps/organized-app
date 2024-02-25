import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import SingleAssignment from './SingleAssignment';
import AccordionSimple from '../../components/AccordionSimple';
import PersonAssignmentHistory from './PersonAssignmentHistory';
import VisitingSpeakerSelector from './VisitingSpeakerSelector';
import { PublicTalkSelector, PublicTalkSelectorAdvanced } from '../publicTalks';
import { Schedules } from '../../classes/Schedules';
import { Sources } from '../../classes/Sources';
import { Setting } from '../../classes/Setting';
import { saveAssignment } from '../../utils/schedule';
import { Persons } from '../../classes/Persons';
import { refreshScreenState } from '../../states/main';

const WeekendMeetingItem = ({ weekOf }) => {
  const { t } = useTranslation('ui');

  const [refreshScreen, setRefreshScreen] = useRecoilState(refreshScreenState);

  const [PublicTalk, setPublicTalk] = useState('');
  const [isTalkSelectorAdvanced, setIsTalkSelectorAdvanced] = useState(false);
  const [assInfo, setAssInfo] = useState({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDlgOpen, setIsDlgOpen] = useState(false);
  const [chairman, setChairman] = useState('');
  const [openingPrayer, setOpeningPrayer] = useState('');
  const [isSymposium, setIsSymposium] = useState(false);
  const [speaker1, setSpeaker1] = useState('');
  const [speaker2, setSpeaker2] = useState('');
  const [speakerSubstitute, setSpeakerSubstitute] = useState('');
  const [wtStudy, setWtStudy] = useState('');
  const [wtStudyArticle, setWtStudyArticle] = useState('');
  const [wtReader, setWtReader] = useState('');
  const [customTalkTitle, setCustomTalkTitle] = useState('');
  const [isVisitingSpeaker, setIsVisitingSpeaker] = useState(false);
  const [WeekType, setWeekType] = useState(1);
  const [isVisitingSpeakerOpen, setIsVisitingSpeakerOpen] = useState(false);
  const [noWMeeting, setNoWMeeting] = useState(false);
  const [isCustomTalk, setIsCustomTalk] = useState(false);

  const { opening_prayer_WM_autoAssign, cong_role, weekend_meeting_useSubstituteSpeaker } = Setting;
  const coordinatorRole = cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = cong_role.includes('public_talk_coordinator');

  const handleUpdateTalk = async (value) => {
    const schedule = Schedules.get(weekOf);
    await schedule.savePublicTalk(value);

    setPublicTalk(value);
    setIsTalkSelectorAdvanced(false);
    setRefreshScreen((prev) => !prev);
  };

  const handleToogleAdvancedTalkSelect = () => {
    setIsVisitingSpeakerOpen(false);
    setIsTalkSelectorAdvanced((prev) => !prev);
  };

  const loadPersonHistory = (obj) => {
    setAssInfo(obj);
    setIsHistoryOpen(true);
    setIsDlgOpen(true);
  };

  const handleDlgClose = () => {
    setIsHistoryOpen(false);
  };

  const handleToggleVisitingSpeaker = async (value) => {
    const schedule = Schedules.get(weekOf);
    await schedule.updateVisitingSpeaker(value);

    if (!value) {
      await schedule.saveAssignment(undefined, 'speaker_1');
    }

    setIsVisitingSpeakerOpen(false);
    setIsVisitingSpeaker(value);

    setRefreshScreen((prev) => !prev);
  };

  const handleToogleCustomTalk = async (value) => {
    const schedule = Schedules.get(weekOf);
    await schedule.toggleCustomTalk(value);

    setIsCustomTalk(value);

    setRefreshScreen((prev) => !prev);
  };

  const handleOpenVisitingSpeakerSelector = () => {
    setIsTalkSelectorAdvanced(false);
    setIsVisitingSpeakerOpen(true);
  };

  const handleCloseVisitingSpeakerSelector = () => {
    setIsVisitingSpeakerOpen(false);
  };

  const setSelectedStudent = async (selectedStudent) => {
    const assID = selectedStudent.assID;
    const personID = selectedStudent.person_uid;
    const personValue = personID || null;

    if (assID === 28) {
      await saveAssignment(weekOf, personID, 'chairman_WM');
      setChairman(personValue);
    }

    if (assID === 29) {
      await saveAssignment(weekOf, personID, 'opening_prayerWM');
      setOpeningPrayer(personValue);
    }

    if (assID === 30) {
      await saveAssignment(weekOf, personID, 'speaker_1');
      setSpeaker1(personValue);
    }

    if (assID === 31) {
      await saveAssignment(weekOf, personID, 'speaker_2');
      setSpeaker2(personValue);
    }

    if (assID === 32) {
      await saveAssignment(weekOf, personID, 'wtstudy_reader');
      setWtReader(personValue);
    }

    if (assID === 33) {
      await saveAssignment(weekOf, personID, 'substitute_speaker');
      setSpeakerSubstitute(personValue);
    }
  };

  const removeSpeaker = async () => {
    const obj = { assID: 30, person_uid: undefined };
    await setSelectedStudent(obj);
  };

  const handleSaveCustomTalk = async (value) => {
    setCustomTalkTitle(value);
    const source = Sources.get(weekOf);
    await source.saveCustomTalk(value);
  };

  useEffect(() => {
    if (speaker1 === null || speaker1 === '') {
      setIsSymposium(false);
      return;
    }

    const tmpPerson = Persons.get(speaker1);
    if (tmpPerson) {
      setIsSymposium(false);
      const isSpeakerHalf = tmpPerson.assignments.find((assignment) => assignment.code === 121);
      setIsSymposium(isSpeakerHalf);
    }
  }, [speaker1, refreshScreen]);

  useEffect(() => {
    const schedule = Schedules.get(weekOf);
    const source = Sources.get(weekOf).local();

    setNoWMeeting(schedule.noWMeeting);
    setWeekType(schedule.week_type);
    setIsVisitingSpeaker(schedule.is_visiting_speaker);
    setChairman(schedule.chairman_WM);
    setOpeningPrayer(schedule.opening_prayerWM);
    setPublicTalk(schedule.public_talk);
    setSpeaker1(schedule.speaker_1);
    setSpeaker2(schedule.speaker_2);
    setSpeakerSubstitute(schedule.substitute_speaker);
    setWtStudy(source.w_study_date_locale);
    setWtStudyArticle(source.w_study_title);
    setWtReader(schedule.wtstudy_reader);
    setIsCustomTalk(schedule.is_custom_talk);
    setCustomTalkTitle(source.w_talk_title_override);
  }, [weekOf, refreshScreen]);

  return (
    <AccordionSimple header={dateFormat(weekOf, Setting.shortDateFormat())}>
      {!noWMeeting && (
        <Box>
          {isHistoryOpen && (
            <Dialog open={isDlgOpen} onClose={handleDlgClose} aria-labelledby="dialog-title">
              <DialogContent>
                <Box sx={{ position: 'absolute', right: 10 }}>
                  <IconButton onClick={() => handleDlgClose()}>
                    <CancelIcon />
                  </IconButton>
                </Box>
                <PersonAssignmentHistory
                  assInfo={assInfo}
                  setIsHistoryOpen={(value) => setIsHistoryOpen(value)}
                  currentWeek={weekOf}
                />
              </DialogContent>
            </Dialog>
          )}

          {WeekType === 2 && (
            <Typography sx={{ color: 'orangered' }}>{t('circuitOverseerWeek', { ns: 'source' })}</Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: '10px 0 25px 0', gap: '5px' }}>
            {/* Chairman*/}
            <SingleAssignment
              key={crypto.randomUUID()}
              edit={coordinatorRole}
              header={t('chairmanWeekendMeeting', { ns: 'source' })}
              person={chairman}
              studentID={28}
              assType={118}
              setSelectedStudent={(value) => setSelectedStudent(value)}
              currentWeek={weekOf}
              loadPersonHistory={() =>
                loadPersonHistory({
                  assID: 28,
                  assType: 118,
                  assTypeName: t('chairmanWeekendMeeting', { ns: 'source' }),
                  currentStudent: chairman,
                })
              }
            />

            {/* Opening Prayer */}
            {!opening_prayer_WM_autoAssign && (
              <SingleAssignment
                key={crypto.randomUUID()}
                edit={coordinatorRole}
                header={t('prayerWeekendMeeting', { ns: 'source' })}
                person={openingPrayer}
                studentID={29}
                assType={119}
                setSelectedStudent={(value) => setSelectedStudent(value)}
                currentWeek={weekOf}
                loadPersonHistory={() =>
                  loadPersonHistory({
                    assID: 29,
                    assType: 119,
                    assTypeName: t('prayerWeekendMeeting', { ns: 'source' }),
                    currentStudent: openingPrayer,
                  })
                }
              />
            )}
          </Box>

          {WeekType === 1 && (
            <Box sx={{ marginBottom: '25px' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column',
                    maxWidth: '500px',
                    minWidth: '320px',
                  }}
                >
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isVisitingSpeaker}
                          onChange={
                            publicTalkCoordinatorRole ? (e) => handleToggleVisitingSpeaker(e.target.checked) : null
                          }
                        />
                      }
                      label={t('talkDeliveredVisitingSpeaker')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isCustomTalk}
                          onChange={publicTalkCoordinatorRole ? (e) => handleToogleCustomTalk(e.target.checked) : null}
                        />
                      }
                      label={t('customTalk')}
                    />
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {!isCustomTalk && (
                      <>
                        <PublicTalkSelector
                          PublicTalk={PublicTalk}
                          setPublicTalk={handleUpdateTalk}
                          isVisitingSpeaker={isVisitingSpeaker}
                          closeVisitingSpeaker={() => setIsVisitingSpeakerOpen(false)}
                          removeSpeaker={removeSpeaker}
                        />
                        {publicTalkCoordinatorRole && (
                          <IconButton onClick={handleToogleAdvancedTalkSelect}>
                            {isTalkSelectorAdvanced && <ExpandLessIcon />}
                            {!isTalkSelectorAdvanced && <ExpandMoreIcon />}
                          </IconButton>
                        )}
                      </>
                    )}

                    {isCustomTalk && (
                      <TextField
                        label={t('publicTalk')}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={customTalkTitle}
                        onChange={(e) => handleSaveCustomTalk(e.target.value)}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px', alignItems: 'flex-end' }}>
                  {/* 1st speaker*/}
                  <SingleAssignment
                    key={crypto.randomUUID()}
                    edit={publicTalkCoordinatorRole && !isVisitingSpeaker}
                    visitingSpeaker={isVisitingSpeaker}
                    header={t('speaker', { ns: 'source' })}
                    person={speaker1}
                    studentID={30}
                    assType={121}
                    setSelectedStudent={(value) => setSelectedStudent(value)}
                    currentWeek={weekOf}
                    loadPersonHistory={() =>
                      loadPersonHistory({
                        assID: 30,
                        assType: 121,
                        assTypeName: t('speaker', { ns: 'source' }),
                        currentStudent: speaker1,
                      })
                    }
                  />

                  {/* 2nd speaker */}
                  {isSymposium && (
                    <SingleAssignment
                      key={crypto.randomUUID()}
                      edit={publicTalkCoordinatorRole}
                      header={t('speaker', { ns: 'source' })}
                      person={speaker2}
                      studentID={31}
                      assType={120}
                      setSelectedStudent={(value) => setSelectedStudent(value)}
                      currentWeek={weekOf}
                      loadPersonHistory={() =>
                        loadPersonHistory({
                          assID: 31,
                          assType: 120,
                          assTypeName: t('speaker', { ns: 'source' }),
                          currentStudent: speaker2,
                        })
                      }
                    />
                  )}

                  {publicTalkCoordinatorRole && isVisitingSpeaker && (
                    <IconButton onClick={handleOpenVisitingSpeakerSelector}>
                      <PersonSearchIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {publicTalkCoordinatorRole && (
                <PublicTalkSelectorAdvanced advancedOpen={isTalkSelectorAdvanced} setPublicTalk={handleUpdateTalk} />
              )}

              {publicTalkCoordinatorRole && (
                <VisitingSpeakerSelector
                  open={isVisitingSpeakerOpen}
                  close={handleCloseVisitingSpeakerSelector}
                  weekOf={weekOf}
                  public_talk={PublicTalk}
                  speaker={speaker1}
                />
              )}

              {/* Substitute Speaker */}
              {isVisitingSpeaker && weekend_meeting_useSubstituteSpeaker && (
                <Box sx={{ marginTop: '20px' }}>
                  <SingleAssignment
                    key={crypto.randomUUID()}
                    edit={publicTalkCoordinatorRole}
                    header={t('substituteSpeaker', { ns: 'source' })}
                    person={speakerSubstitute}
                    studentID={33}
                    assType={120}
                    setSelectedStudent={(value) => setSelectedStudent(value)}
                    currentWeek={weekOf}
                    loadPersonHistory={() =>
                      loadPersonHistory({
                        assID: 33,
                        assType: 120,
                        assTypeName: t('substituteSpeaker', { ns: 'source' }),
                        currentStudent: speakerSubstitute,
                      })
                    }
                  />
                </Box>
              )}
            </Box>
          )}

          <Box
            sx={{
              marginTop: '30px',

              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              alignItems: 'flex-end',
            }}
          >
            <TextField
              label={wtStudy}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ maxWidth: '500px', minWidth: '250px' }}
              value={wtStudyArticle}
              InputProps={{ readOnly: true }}
            />

            {/* Watchtower Study Reader*/}
            {WeekType === 1 && (
              <SingleAssignment
                key={crypto.randomUUID()}
                edit={coordinatorRole}
                header={t('wtStudyReader', { ns: 'source' })}
                person={wtReader}
                studentID={32}
                assType={122}
                setSelectedStudent={(value) => setSelectedStudent(value)}
                currentWeek={weekOf}
                loadPersonHistory={() =>
                  loadPersonHistory({
                    assID: 32,
                    assType: 122,
                    assTypeName: t('wtStudyReader', { ns: 'source' }),
                    currentStudent: wtReader,
                  })
                }
              />
            )}
          </Box>
        </Box>
      )}

      {noWMeeting && (
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100px',
          }}
        >
          <NoMeetingRoomIcon color="error" sx={{ fontSize: '60px' }} />
          <Typography variant="body1" align="center">
            {t('noMMeeting')}
          </Typography>
        </Container>
      )}
    </AccordionSimple>
  );
};

export default WeekendMeetingItem;
