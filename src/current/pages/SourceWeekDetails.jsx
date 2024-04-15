import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import dateFormat from 'dateformat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fab from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccordionSimple from '../components/AccordionSimple';
import { LCPartHeading, PartDuration, PartType, SongsList, WeekType } from '../features/sourceMaterial';
import { PublicTalkSelectorAdvanced, PublicTalkSelector } from '../features/publicTalks';
import { isRerenderSourceState } from '../states/sourceMaterial';
import { shortDateFormatState, sourceLangState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { Sources } from '../classes/Sources';
import { Schedules } from '../classes/Schedules';
import { congRoleState } from '../states/congregation';

const sharedStyles = {
  ayfStuPart: {
    padding: '10px',
    marginBottom: '15px',
    boxShadow: '0 8px rgba(0, 0, 255, 0.2)',
  },
  ayfStuPartInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  },
  lcPartInfo: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '15px',
  },
  inputAYF: {
    width: '100%',
  },
  inputLC: {
    flexGrow: 1,
  },
  partHeader: {
    fontWeight: 'bold',
    marginBottom: '15px',
  },
};

const SourceWeekDetails = () => {
  const { weekToFormat } = useParams();
  const { t } = useTranslation('ui');
  const navigate = useNavigate();

  const sourceLang = useRecoilValue(sourceLangState);
  const isRerender = useRecoilValue(isRerenderSourceState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const congRole = useRecoilValue(congRoleState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [weekOf, setWeekOf] = useState('');
  const [noMMeeting, setNoMMeeting] = useState(false);
  const [weekType, setWeekType] = useState(1);
  const [WeekDate, setWeekDate] = useState('');
  const [WeeklyBibleReading, setWeeklyBibleReading] = useState('');
  const [SongFirst, setSongFirst] = useState('');
  const [TGWTalk, setTGWTalk] = useState('');
  const [BRead, setBRead] = useState('');
  const [Ass1Type, setAss1Type] = useState('');
  const [Ass1Time, setAss1Time] = useState('');
  const [Ass1Src, setAss1Src] = useState('');
  const [Ass2Type, setAss2Type] = useState('');
  const [Ass2Time, setAss2Time] = useState('');
  const [Ass2Src, setAss2Src] = useState('');
  const [Ass3Type, setAss3Type] = useState('');
  const [Ass3Time, setAss3Time] = useState('');
  const [Ass3Src, setAss3Src] = useState('');
  const [Ass4Type, setAss4Type] = useState('');
  const [Ass4Time, setAss4Time] = useState('');
  const [Ass4Src, setAss4Src] = useState('');
  const [SongMiddle, setSongMiddle] = useState('');
  const [LCPart1Time, setLCPart1Time] = useState('');
  const [LCPart1TimeOverride, setLCPart1TimeOverride] = useState('');
  const [LCPart1Src, setLCPart1Src] = useState('');
  const [LCPart1SrcOverride, setLCPart1SrcOverride] = useState('');
  const [LCPart1Content, setLCPart1Content] = useState('');
  const [LCPart1ContentOverride, setLCPart1ContentOverride] = useState('');
  const [LCPart2Time, setLCPart2Time] = useState('');
  const [LCPart2TimeOverride, setLCPart2TimeOverride] = useState('');
  const [LCPart2Src, setLCPart2Src] = useState('');
  const [LCPart2SrcOverride, setLCPart2SrcOverride] = useState('');
  const [LCPart2Content, setLCPart2Content] = useState('');
  const [LCPart2ContentOverride, setLCPart2ContentOverride] = useState('');
  const [CBSSrc, setCBSSrc] = useState('');
  const [SongConclude, setSongConclude] = useState('');
  const [isOverrideLCPart1, setIsOverrideLCPart1] = useState(false);
  const [isOverrideLCPart2, setIsOverrideLCPart2] = useState(false);
  const [CBSTimeOverride, setCBSTimeOverride] = useState('');
  const [SongConcludeOverride, setSongConcludeOverride] = useState('');
  const [COTalkMidweekTitle, setCOTalkMidweekTitle] = useState('');
  const [noWMeeting, setNoWMeeting] = useState(false);
  const [PublicTalk, setPublicTalk] = useState('');
  const [WTStudyArticle, setWTStudyArticle] = useState('');
  const [WTStudyOpeningSong, setWTStudyOpeningSong] = useState('');
  const [WTStudyConcludingSong, setWTStudyConcludingSong] = useState('');
  const [isTalkSelectorAdvanced, setIsTalkSelectorAdvanced] = useState(false);
  const [EventName, setEventName] = useState('');
  const [COTalkWeekendTitle, setCOTalkWeekendTitle] = useState('');

  const lmmoRole = congRole.includes('lmmo') || congRole.includes('lmmo-backup');
  const coordinatorRole = congRole.includes('coordinator');
  const publicTalkCoordinatorRole = congRole.includes('public_talk_coordinator');

  const week = weekToFormat.replaceAll('-', '/');
  const weekFormatted = dateFormat(new Date(week), shortDateFormat);
  const schedYear = week.split('/')[0];

  const handleNavigateSource = () => {
    navigate(`/source-materials`);
  };

  const handleSaveSource = async () => {
    let obj = {};

    let mwb_lc_count = 0;
    if (isOverrideLCPart1 || isOverrideLCPart2) {
      // check timing first
      let timeOverride = 0;
      if (isOverrideLCPart1) timeOverride += +LCPart1TimeOverride;
      if (!isOverrideLCPart1) timeOverride += +LCPart1Time;
      if (isOverrideLCPart2) timeOverride += +LCPart2TimeOverride;
      if (!isOverrideLCPart2) timeOverride += +LCPart2Time;
      timeOverride += +CBSTimeOverride;
      if (weekType !== 2 && timeOverride !== 45) {
        setAppSnackOpen(true);
        setAppSeverity('warning');
        setAppMessage(t('overrideSaveWarning'));
        return;
      }

      if (isOverrideLCPart1) mwb_lc_count++;
      if (!isOverrideLCPart1 && LCPart1Src !== '') mwb_lc_count++;
      if (isOverrideLCPart2 && LCPart2SrcOverride !== '') mwb_lc_count++;
      if (!isOverrideLCPart2 && LCPart2Src !== '') mwb_lc_count++;

      obj.mwb_lc_count_override = mwb_lc_count;
      obj.mwb_lc_part1_time_override = LCPart1TimeOverride === '' ? undefined : +LCPart1TimeOverride;
      obj.mwb_lc_part1_override = LCPart1SrcOverride === '' ? undefined : LCPart1SrcOverride;
      obj.mwb_lc_part1_content_override = LCPart1ContentOverride === '' ? undefined : LCPart1ContentOverride;
      obj.mwb_lc_part2_time_override = LCPart2TimeOverride === '' ? undefined : +LCPart2TimeOverride;
      obj.mwb_lc_part2_override = LCPart2SrcOverride === '' ? undefined : LCPart2SrcOverride;
      obj.mwb_lc_part2_content_override = LCPart2ContentOverride === '' ? undefined : LCPart2ContentOverride;
      obj.mwb_lc_cbs_time_override = CBSTimeOverride === '' ? undefined : +CBSTimeOverride;
    }

    mwb_lc_count = 0;
    if (LCPart1Time !== '') mwb_lc_count++;
    if (LCPart2Time !== '') mwb_lc_count++;
    obj.mwb_lc_count = mwb_lc_count;
    obj.mwb_lc_part1_time = LCPart1Time === '' ? undefined : +LCPart1Time;
    obj.mwb_lc_part1 = LCPart1Src;
    obj.mwb_lc_part1_content = LCPart1Content;
    obj.mwb_lc_part2_time = LCPart2Time === '' ? undefined : +LCPart2Time;
    obj.mwb_lc_part2 = LCPart2Src;
    obj.mwb_lc_part2_content = LCPart2Content;

    obj.weekOf = weekOf;
    obj.mwb_week_date_locale = WeekDate;
    obj.mwb_weekly_bible_reading = WeeklyBibleReading;
    obj.mwb_song_first = +SongFirst;
    obj.mwb_tgw_talk = TGWTalk;
    obj.mwb_tgw_bread = BRead;
    obj.mwb_ayf_part1_type = Ass1Type === '' ? undefined : +Ass1Type;
    obj.mwb_ayf_part1_time = Ass1Time === '' ? undefined : +Ass1Time;
    obj.mwb_ayf_part1 = Ass1Src;
    obj.mwb_ayf_part2_type = Ass2Type === '' ? undefined : +Ass2Type;
    obj.mwb_ayf_part2_time = Ass2Time === '' ? undefined : +Ass2Time;
    obj.mwb_ayf_part2 = Ass2Src;
    obj.mwb_ayf_part3_type = Ass3Type === '' ? undefined : +Ass3Type;
    obj.mwb_ayf_part3_time = Ass3Time === '' ? undefined : +Ass3Time;
    obj.mwb_ayf_part3 = Ass3Src;
    obj.mwb_ayf_part4_type = Ass4Type === '' ? undefined : +Ass4Type;
    obj.mwb_ayf_part4_time = Ass4Time === '' ? undefined : +Ass4Time;
    obj.mwb_ayf_part4 = Ass4Src;
    obj.mwb_song_middle = +SongMiddle;
    obj.mwb_lc_cbs = CBSSrc;
    obj.mwb_song_conclude = isNaN(SongConclude) ? SongConclude : +SongConclude;
    obj.mwb_song_conclude_override = isNaN(SongConcludeOverride) ? SongConcludeOverride : +SongConcludeOverride;
    obj.mwb_co_talk_title = COTalkMidweekTitle;
    obj.w_co_talk_title = COTalkWeekendTitle;
    obj.w_study_title = WTStudyArticle;
    obj.w_study_opening_song = WTStudyOpeningSong === '' ? '' : +WTStudyOpeningSong;
    obj.w_study_concluding_song = WTStudyConcludingSong === '' ? '' : +WTStudyConcludingSong;
    obj.isOverride = true;
    const source = Sources.get(week);
    obj.w_study_date_locale = source.w_study_date_locale[sourceLang.toUpperCase()];
    await source.save(obj, false);

    obj = {};
    obj.week_type = weekType;
    obj.noMMeeting = noMMeeting;
    obj.noWMeeting = noWMeeting;

    const schedule = Schedules.get(week);
    await schedule.saveInfo(obj, true);
    if (publicTalkCoordinatorRole) {
      await schedule.savePublicTalk(PublicTalk);
    }
    if (coordinatorRole) {
      await schedule.saveEventName(EventName);
    }

    setAppSnackOpen(true);
    setAppSeverity('success');
    setAppMessage(t('weekSaved'));
  };

  const handleToogleAdvancedTalkSelect = () => {
    setIsTalkSelectorAdvanced((prev) => !prev);
  };

  const handleSetPublicTalkAdvanced = (value) => {
    setPublicTalk(value);
    setIsTalkSelectorAdvanced(false);
  };

  useEffect(() => {
    let isSubscribed = true;

    if (week !== '' && isSubscribed) {
      const data = Sources.get(week).local();
      const schedule = Schedules.get(week);

      if (isSubscribed) {
        setWeekOf(data.weekOf);
        setNoMMeeting(schedule.noMMeeting);
        setWeekType(schedule.week_type);
        setWeekDate(data.mwb_week_date_locale);
        setWeeklyBibleReading(data.mwb_weekly_bible_reading);
        setSongFirst(data.mwb_song_first);
        setTGWTalk(data.mwb_tgw_talk);
        setBRead(data.mwb_tgw_bread);
        setAss1Time(data.mwb_ayf_part1_time);
        setAss1Type(data.mwb_ayf_part1_type);
        setAss1Src(data.mwb_ayf_part1);
        setAss2Time(data.mwb_ayf_part2_time);
        setAss2Type(data.mwb_ayf_part2_type);
        setAss2Src(data.mwb_ayf_part2);
        setAss3Time(data.mwb_ayf_part3_time);
        setAss3Type(data.mwb_ayf_part3_type);
        setAss3Src(data.mwb_ayf_part3);
        setAss4Time(data.mwb_ayf_part4_time);
        setAss4Type(data.mwb_ayf_part4_type);
        setAss4Src(data.mwb_ayf_part4);
        setSongMiddle(data.mwb_song_middle);
        setIsOverrideLCPart1(data.mwb_lc_part1_time_override !== '');
        setLCPart1Time(data.mwb_lc_part1_time);
        setLCPart1TimeOverride(data.mwb_lc_part1_time_override);
        setLCPart1Src(data.mwb_lc_part1);
        setLCPart1SrcOverride(data.mwb_lc_part1_override);
        setLCPart1Content(data.mwb_lc_part1_content);
        setLCPart1ContentOverride(data.mwb_lc_part1_content_override);
        setIsOverrideLCPart2(data.mwb_lc_count_override === 2);

        setLCPart2Time(data.mwb_lc_part2_time);
        setLCPart2TimeOverride(data.mwb_lc_part2_time_override);
        setLCPart2Src(data.mwb_lc_part2);
        setLCPart2SrcOverride(data.mwb_lc_part2_override);
        setLCPart2Content(data.mwb_lc_part2_content);
        setLCPart2ContentOverride(data.mwb_lc_part2_content_override);
        setCBSSrc(data.mwb_lc_cbs);
        setCBSTimeOverride(data.mwb_lc_cbs_time_override);
        setSongConclude(data.mwb_song_conclude);
        setSongConcludeOverride(data.mwb_song_conclude_override);
        setCOTalkMidweekTitle(data.mwb_co_talk_title);

        setNoWMeeting(schedule.noWMeeting);
        setEventName(schedule.event_name);
        setCOTalkWeekendTitle(data.w_co_talk_title);
        setPublicTalk(schedule.public_talk);
        setWTStudyArticle(data.w_study_title);
        setWTStudyOpeningSong(data.w_study_opening_song);
        setWTStudyConcludingSong(data.w_study_concluding_song);
      }
    }

    return () => {
      isSubscribed = false;
    };
  }, [sourceLang, isRerender, week]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={handleNavigateSource}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {`${t('sourceMaterial')} > ${weekFormatted}`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <WeekType
            weekType={weekType}
            setWeekType={setWeekType}
            setPublicTalk={setPublicTalk}
            setNoMMeeting={setNoMMeeting}
            setNoWMeeting={setNoWMeeting}
          />
        </Box>
        <AccordionSimple header={t('midweekMeeting')}>
          <FormControlLabel
            control={
              <Checkbox checked={noMMeeting} onChange={lmmoRole ? (e) => setNoMMeeting(e.target.checked) : null} />
            }
            label={t('noMMeeting')}
            disabled={weekType === 3 || weekType === 4}
          />
          <Box sx={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px', width: '280px' }}>
            <TextField
              id="outlined-week-date"
              label={t('date')}
              variant="outlined"
              size="small"
              InputProps={{ readOnly: !lmmoRole }}
              value={WeekDate}
              onChange={(e) => setWeekDate(e.target.value)}
            />
            <TextField
              id="outlined-weekly-bible-reading"
              label={t('weeklybibleReading')}
              variant="outlined"
              size="small"
              InputProps={{ readOnly: !lmmoRole }}
              value={WeeklyBibleReading}
              onChange={(e) => setWeeklyBibleReading(e.target.value)}
            />
          </Box>
          <Box sx={{ marginBottom: '20px' }}>
            <SongsList song={SongFirst} setSong={setSongFirst} readOnly={!lmmoRole} />
          </Box>
          <Box className={`${schedYear < 2024 ? 'tgwPart' : 'tgwPart-2024'} meetingPart`}>
            <Typography variant="h6">{t('treasuresPart')}</Typography>
          </Box>
          <Box sx={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
              id="outlined-tgw-talk-10"
              label={t('tgwTalk', { ns: 'source' })}
              variant="outlined"
              size="small"
              InputProps={{ readOnly: !lmmoRole }}
              sx={{ maxWidth: '800px' }}
              value={TGWTalk}
              onChange={(e) => setTGWTalk(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <TextField
                id="outlined-basic"
                label={t('bibleReadingText')}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: !lmmoRole }}
                value={BRead}
                sx={{ width: '300px' }}
                onChange={(e) => setBRead(e.target.value)}
              />
            </Box>
          </Box>
          <Box className={`ayfPart meetingPart`}>
            <Typography variant="h6">{t('applyFieldMinistryPart')}</Typography>
          </Box>
          <Box sx={{ margin: '10px 0' }}>
            <Box sx={sharedStyles.ayfStuPart}>
              <Typography variant="body1" sx={sharedStyles.partHeader}>
                {t('ayfPart1')}
              </Typography>
              <Box sx={sharedStyles.ayfStuPartInfo}>
                <PartDuration
                  readOnly={!lmmoRole}
                  isAyf={true}
                  max={10}
                  ayf={1}
                  assTime={Ass1Time}
                  setAss1Time={(value) => setAss1Time(value)}
                />
                <PartType ayf={1} assType={Ass1Type} setAss1Type={(value) => setAss1Type(value)} readOnly={!lmmoRole} />
                <TextField
                  id="outlined-basic"
                  label={t('sourceMaterial')}
                  variant="outlined"
                  multiline
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  sx={sharedStyles.inputAYF}
                  value={Ass1Src}
                  onChange={(e) => setAss1Src(e.target.value)}
                />
              </Box>
            </Box>
            <Box sx={sharedStyles.ayfStuPart}>
              <Typography variant="body1" sx={sharedStyles.partHeader}>
                {t('ayfPart2')}
              </Typography>
              <Box sx={sharedStyles.ayfStuPartInfo}>
                <PartDuration
                  readOnly={!lmmoRole}
                  isAyf={true}
                  max={10}
                  ayf={2}
                  assTime={Ass2Time}
                  setAss2Time={(value) => setAss2Time(value)}
                />
                <PartType ayf={2} assType={Ass2Type} setAss2Type={(value) => setAss2Type(value)} readOnly={!lmmoRole} />
                <TextField
                  id="outlined-basic"
                  label={t('sourceMaterial')}
                  variant="outlined"
                  multiline
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  sx={sharedStyles.inputAYF}
                  value={Ass2Src}
                  onChange={(e) => setAss2Src(e.target.value)}
                />
              </Box>
            </Box>
            <Box sx={sharedStyles.ayfStuPart}>
              <Typography variant="body1" sx={sharedStyles.partHeader}>
                {t('ayfPart3')}
              </Typography>
              <Box sx={sharedStyles.ayfStuPartInfo}>
                <PartDuration
                  readOnly={!lmmoRole}
                  isAyf={true}
                  max={10}
                  ayf={3}
                  assTime={Ass3Time}
                  setAss3Time={(value) => setAss3Time(value)}
                />
                <PartType ayf={3} assType={Ass3Type} setAss3Type={(value) => setAss3Type(value)} readOnly={!lmmoRole} />
                <TextField
                  id="outlined-basic"
                  label={t('sourceMaterial')}
                  variant="outlined"
                  multiline
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  sx={sharedStyles.inputAYF}
                  value={Ass3Src}
                  onChange={(e) => setAss3Src(e.target.value)}
                />
              </Box>
            </Box>
            <Box sx={sharedStyles.ayfStuPart}>
              <Typography variant="body1" sx={sharedStyles.partHeader}>
                {t('ayfPart4')}
              </Typography>
              <Box sx={sharedStyles.ayfStuPartInfo}>
                <PartDuration
                  readOnly={!lmmoRole}
                  isAyf={true}
                  max={10}
                  ayf={4}
                  assTime={Ass4Time}
                  setAss4Time={(value) => setAss4Time(value)}
                />
                <PartType ayf={4} assType={Ass4Type} setAss4Type={(value) => setAss4Type(value)} readOnly={!lmmoRole} />
                <TextField
                  id="outlined-basic"
                  label={t('sourceMaterial')}
                  variant="outlined"
                  multiline
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  sx={sharedStyles.inputAYF}
                  value={Ass4Src}
                  onChange={(e) => setAss4Src(e.target.value)}
                />
              </Box>
            </Box>
          </Box>

          <Box className={`lcPart meetingPart`} sx={{ marginTop: '20px' }}>
            <Typography variant="h6">{t('livingPart')}</Typography>
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <SongsList song={SongMiddle} setSong={setSongMiddle} readOnly={!lmmoRole} />
          </Box>
          <Box sx={{ margin: '20px 0' }}>
            <Box sx={sharedStyles.ayfStuPart}>
              <LCPartHeading
                readOnly={!lmmoRole}
                label={t('ayfPart1')}
                overrideChecked={isOverrideLCPart1}
                setOverrideChecked={(value) => setIsOverrideLCPart1(value)}
              />

              <Box sx={sharedStyles.lcPartInfo}>
                <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <PartDuration
                    readOnly={!lmmoRole}
                    isLc={true}
                    max={isOverrideLCPart1 ? 30 : 15}
                    lc={1}
                    assTime={isOverrideLCPart1 ? LCPart1TimeOverride : LCPart1Time}
                    setLCPart1Time={(value) =>
                      isOverrideLCPart1 ? setLCPart1TimeOverride(value) : setLCPart1Time(value)
                    }
                  />
                  <TextField
                    id="outlined-basic"
                    label={t('sourceMaterial')}
                    variant="outlined"
                    multiline
                    size="small"
                    InputProps={{ readOnly: !lmmoRole }}
                    sx={sharedStyles.inputLC}
                    value={isOverrideLCPart1 ? LCPart1SrcOverride : LCPart1Src}
                    onChange={(e) =>
                      isOverrideLCPart1 ? setLCPart1SrcOverride(e.target.value) : setLCPart1Src(e.target.value)
                    }
                  />
                </Box>
                <TextField
                  id="outlined-basic"
                  label={t('lcPartDesc')}
                  variant="outlined"
                  multiline
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  sx={sharedStyles.inputLC}
                  value={isOverrideLCPart1 ? LCPart1ContentOverride : LCPart1Content}
                  onChange={(e) =>
                    isOverrideLCPart1 ? setLCPart1ContentOverride(e.target.value) : setLCPart1Content(e.target.value)
                  }
                />
              </Box>
            </Box>
            <Box sx={sharedStyles.ayfStuPart}>
              <LCPartHeading
                readOnly={!lmmoRole}
                label={t('ayfPart2')}
                overrideChecked={isOverrideLCPart2}
                setOverrideChecked={(value) => setIsOverrideLCPart2(value)}
              />
              <Box sx={sharedStyles.lcPartInfo}>
                <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <PartDuration
                    readOnly={!lmmoRole}
                    isLc={true}
                    max={isOverrideLCPart2 ? 30 : 15}
                    lc={2}
                    assTime={isOverrideLCPart2 ? LCPart2TimeOverride : LCPart2Time}
                    setLCPart2Time={(value) =>
                      isOverrideLCPart2 ? setLCPart2TimeOverride(value) : setLCPart2Time(value)
                    }
                  />
                  <TextField
                    id="outlined-lc-part-2"
                    label={t('sourceMaterial')}
                    variant="outlined"
                    multiline
                    size="small"
                    InputProps={{ readOnly: !lmmoRole }}
                    sx={sharedStyles.inputLC}
                    value={isOverrideLCPart2 ? LCPart2SrcOverride : LCPart2Src}
                    onChange={(e) =>
                      isOverrideLCPart2 ? setLCPart2SrcOverride(e.target.value) : setLCPart2Src(e.target.value)
                    }
                  />
                </Box>
                <TextField
                  id="outlined-basic"
                  label={t('lcPartDesc')}
                  variant="outlined"
                  multiline
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  sx={sharedStyles.inputLC}
                  value={isOverrideLCPart2 ? LCPart2ContentOverride : LCPart2Content}
                  onChange={(e) =>
                    isOverrideLCPart2 ? setLCPart2ContentOverride(e.target.value) : setLCPart2Content(e.target.value)
                  }
                />
              </Box>
            </Box>

            {weekType !== 2 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '25px' }}>
                {(isOverrideLCPart1 || isOverrideLCPart2) && (
                  <PartDuration
                    readOnly={!lmmoRole}
                    max={30}
                    cbs={true}
                    assTime={CBSTimeOverride}
                    setCBSTime={(value) => setCBSTimeOverride(value)}
                  />
                )}

                <TextField
                  id="outlined-cbs"
                  label={t('cbs')}
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  value={CBSSrc}
                  sx={{ flexGrow: 1 }}
                  onChange={(e) => setCBSSrc(e.target.value)}
                />
              </Box>
            )}

            {weekType === 2 && (
              <TextField
                id="outlined-cbs"
                label={t('coTalk')}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: !lmmoRole }}
                value={COTalkMidweekTitle}
                sx={{ width: '100%', marginTop: '25px' }}
                onChange={(e) => setCOTalkMidweekTitle(e.target.value)}
              />
            )}

            <Box sx={{ marginTop: '30px' }}>
              {weekType === 2 && (
                <SongsList song={SongConcludeOverride} setSong={setSongConcludeOverride} readOnly={!lmmoRole} />
              )}
              {weekType !== 2 && !isNaN(SongConclude) && (
                <SongsList song={SongConclude} setSong={setSongConclude} readOnly={!lmmoRole} />
              )}
              {weekType !== 2 && isNaN(SongConclude) && (
                <TextField
                  id="outlined-song-conlude"
                  label={t('song')}
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: !lmmoRole }}
                  value={SongConclude}
                  sx={{ width: '100%' }}
                  onChange={(value) => setSongConclude(value)}
                />
              )}
            </Box>
          </Box>
        </AccordionSimple>

        <AccordionSimple header={t('weekendMeeting')}>
          <FormControlLabel
            control={
              <Checkbox
                checked={noWMeeting}
                onChange={publicTalkCoordinatorRole || coordinatorRole ? (e) => setNoWMeeting(e.target.checked) : null}
              />
            }
            label={t('noMMeeting')}
            disabled={weekType === 3 || weekType === 4}
          />

          {noWMeeting && (
            <TextField
              id="outlined-weekend-event"
              label={t('noMeetingNotes')}
              variant="outlined"
              size="small"
              InputProps={{ readOnly: !coordinatorRole }}
              value={EventName}
              sx={{ width: '100%', margin: '10px 0' }}
              onChange={(e) => setEventName(e.target.value)}
            />
          )}

          {weekType !== 2 && (
            <Box sx={{ marginTop: '15px', maxWidth: '800px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <PublicTalkSelector
                PublicTalk={PublicTalk}
                setPublicTalk={setPublicTalk}
                noWMeeting={noWMeeting}
                readOnly={!publicTalkCoordinatorRole}
              />
              {publicTalkCoordinatorRole && !noWMeeting && weekType !== 2 && (
                <IconButton onClick={handleToogleAdvancedTalkSelect}>
                  {isTalkSelectorAdvanced && <ExpandLessIcon />}
                  {!isTalkSelectorAdvanced && <ExpandMoreIcon />}
                </IconButton>
              )}
            </Box>
          )}

          {publicTalkCoordinatorRole && (
            <PublicTalkSelectorAdvanced
              advancedOpen={isTalkSelectorAdvanced}
              setPublicTalk={handleSetPublicTalkAdvanced}
            />
          )}

          {weekType === 2 && (
            <Box sx={{ maxWidth: '800px' }}>
              <TextField
                id="outlined-co-talk-title"
                label={t('coTalk')}
                variant="outlined"
                size="small"
                InputProps={{ readOnly: !coordinatorRole }}
                value={COTalkWeekendTitle}
                sx={{ width: '100%', margin: '10px 0' }}
                onChange={(e) => setCOTalkWeekendTitle(e.target.value)}
              />
            </Box>
          )}

          <Box sx={{ marginTop: '30px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <SongsList song={WTStudyOpeningSong} setSong={setWTStudyOpeningSong} readOnly={!coordinatorRole} />
            <TextField
              id="outlined-wt-study-title"
              fullWidth
              label={t('wtStudyArticle')}
              variant="outlined"
              size="small"
              InputProps={{ readOnly: !coordinatorRole }}
              value={WTStudyArticle}
              onChange={(e) => setWTStudyArticle(e.target.value)}
            />
            <SongsList song={WTStudyConcludingSong} setSong={setWTStudyConcludingSong} readOnly={!coordinatorRole} />
          </Box>
        </AccordionSimple>
      </Box>
      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        <Fab aria-label="save" color="primary" onClick={handleSaveSource}>
          <SaveIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default SourceWeekDetails;
