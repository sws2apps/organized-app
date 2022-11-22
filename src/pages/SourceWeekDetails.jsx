import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import dateFormat from 'dateformat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LCPartDuration, PartDuration, PartType, SongsList, WeekType } from '../features/sourceMaterial';
import { isRerenderSourceState } from '../states/sourceMaterial';
import { appLangState, shortDateFormatState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { dbGetSourceMaterial, dbSaveSrcData } from '../indexedDb/dbSourceMaterial';

const sharedStyles = {
  ayfStuPart: {
    padding: '10px',
    marginBottom: '15px',
    boxShadow: '0 8px rgba(0, 0, 255, 0.2)',
  },
  ayfStuPartInfo: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  lcPartInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    gap: '10px',
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const appLang = useRecoilValue(appLangState);
  const isRerender = useRecoilValue(isRerenderSourceState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [weekOf, setWeekOf] = useState('');
  const [hasMeeting, setHasMeeting] = useState(true);
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
  const [LCPart1Src, setLCPart1Src] = useState('');
  const [LCPart2Time, setLCPart2Time] = useState('');
  const [LCPart2Src, setLCPart2Src] = useState('');
  const [CBSSrc, setCBSSrc] = useState('');
  const [SongConclude, setSongConclude] = useState('');

  const week = weekToFormat.replaceAll('-', '/');
  const weekFormatted = dateFormat(new Date(week), shortDateFormat);

  const handleNavigateSource = () => {
    navigate(`/source-materials`);
  };

  const handleSaveSource = async () => {
    const obj = {};
    obj.weekOf = weekOf;
    obj.weekDate_src = WeekDate;
    obj.weeklyBibleReading_src = WeeklyBibleReading;
    obj.songFirst_src = SongFirst;
    obj.tgwTalk_src = TGWTalk;
    obj.bibleReading_src = BRead;
    obj.ass1_type = Ass1Type;
    obj.ass1_time = Ass1Time;
    obj.ass1_src = Ass1Src;
    obj.ass2_type = Ass2Type;
    obj.ass2_time = Ass2Time;
    obj.ass2_src = Ass2Src;
    obj.ass3_type = Ass3Type;
    obj.ass3_time = Ass3Time;
    obj.ass3_src = Ass3Src;
    obj.ass4_type = Ass4Type;
    obj.ass4_time = Ass4Time;
    obj.ass4_src = Ass4Src;
    obj.songMiddle_src = SongMiddle;
    obj.lcPart1_time = LCPart1Time;
    obj.lcPart1_src = LCPart1Src;
    obj.lcPart2_time = LCPart2Time;
    obj.lcPart2_src = LCPart2Src;
    obj.cbs_src = CBSSrc;
    obj.songConclude_src = SongConclude;
    obj.week_type = weekType;
    obj.noMeeting = !hasMeeting;
    obj.isOverride = true;

    const isSaved = await dbSaveSrcData(obj);

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

  useEffect(() => {
    let isSubscribed = true;
    const loadWeekData = async () => {
      const data = await dbGetSourceMaterial(week);
      if (isSubscribed) {
        setWeekOf(data.weekOf);
        setHasMeeting(!data.noMeeting);
        setWeekType(data.week_type);
        setWeekDate(data.weekDate_src);
        setWeeklyBibleReading(data.weeklyBibleReading_src);
        setSongFirst(data.songFirst_src);
        setTGWTalk(data.tgwTalk_src);
        setBRead(data.bibleReading_src);
        setAss1Time(data.ass1_time);
        setAss1Type(data.ass1_type);
        setAss1Src(data.ass1_src);
        setAss2Time(data.ass2_time);
        setAss2Type(data.ass2_type);
        setAss2Src(data.ass2_src);
        setAss3Time(data.ass3_time);
        setAss3Type(data.ass3_type);
        setAss3Src(data.ass3_src);
        setAss4Time(data.ass4_time);
        setAss4Type(data.ass4_type);
        setAss4Src(data.ass4_src);
        setSongMiddle(data.songMiddle_src);
        setLCPart1Time(data.lcPart1_time);
        setLCPart1Src(data.lcPart1_src);
        setLCPart2Time(data.lcPart2_time);
        setLCPart2Src(data.lcPart2_src);
        setCBSSrc(data.cbs_src);
        setSongConclude(data.songConclude_src);
      }
    };

    if (week !== '' && isSubscribed) {
      loadWeekData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [appLang, isRerender, week]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={handleNavigateSource}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {`${t('global.sourceMaterial')} > ${weekFormatted}`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '50px',
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
            setWeekType={(value) => setWeekType(value)}
            setHasMeeting={(value) => setHasMeeting(value)}
          />
          <FormControlLabel
            control={<Switch checked={hasMeeting} onChange={(e) => setHasMeeting(e.target.checked)} />}
            label={hasMeeting ? t('sourceMaterial.hasMeeting') : t('sourceMaterial.noMeeting')}
          />
        </Box>
        <Box sx={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px', width: '280px' }}>
          <TextField
            id="outlined-week-date"
            label={t('global.date')}
            variant="outlined"
            size="small"
            value={WeekDate}
            onChange={(e) => setWeekDate(e.target.value)}
          />
          <TextField
            id="outlined-weekly-bible-reading"
            label={t('global.weeklybibleReading')}
            variant="outlined"
            size="small"
            value={WeeklyBibleReading}
            onChange={(e) => setWeeklyBibleReading(e.target.value)}
          />
        </Box>
        <Box sx={{ marginBottom: '20px' }}>
          <SongsList songPart={1} song={SongFirst} setSongFirst={(value) => setSongFirst(value)} />
        </Box>
        <Box className={`tgwPart meetingPart`}>
          <Typography variant="h6">{t('global.treasuresPart')}</Typography>
        </Box>
        <Box sx={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            id="outlined-tgw-talk-10"
            label={t('global.tgwTalk')}
            variant="outlined"
            size="small"
            sx={{ maxWidth: '800px' }}
            value={TGWTalk}
            onChange={(e) => setTGWTalk(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label={t('global.bibleReadingText')}
            variant="outlined"
            size="small"
            value={BRead}
            sx={{ width: '300px' }}
            onChange={(e) => setBRead(e.target.value)}
          />
        </Box>
        <Box className={`ayfPart meetingPart`}>
          <Typography variant="h6">{t('global.applyFieldMinistryPart')}</Typography>
        </Box>
        <Box sx={{ margin: '10px 0' }}>
          <Box sx={sharedStyles.ayfStuPart}>
            <Typography variant="body1" sx={sharedStyles.partHeader}>
              {t('global.ayfPart1')}
            </Typography>
            <Box sx={sharedStyles.ayfStuPartInfo}>
              <PartDuration ayf={1} assTime={Ass1Time} setAss1Time={(value) => setAss1Time(value)} />
              <PartType ayf={1} assType={Ass1Type} setAss1Type={(value) => setAss1Type(value)} />
              <TextField
                id="outlined-basic"
                label={t('global.sourceMaterial')}
                variant="outlined"
                multiline
                size="small"
                sx={sharedStyles.inputAYF}
                value={Ass1Src}
                onChange={(e) => setAss1Src(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={sharedStyles.ayfStuPart}>
            <Typography variant="body1" sx={sharedStyles.partHeader}>
              {t('global.ayfPart2')}
            </Typography>
            <Box sx={sharedStyles.ayfStuPartInfo}>
              <PartDuration ayf={2} assTime={Ass2Time} setAss2Time={(value) => setAss2Time(value)} />
              <PartType ayf={2} assType={Ass2Type} setAss2Type={(value) => setAss2Type(value)} />
              <TextField
                id="outlined-basic"
                label={t('global.sourceMaterial')}
                variant="outlined"
                multiline
                size="small"
                sx={sharedStyles.inputAYF}
                value={Ass2Src}
                onChange={(e) => setAss2Src(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={sharedStyles.ayfStuPart}>
            <Typography variant="body1" sx={sharedStyles.partHeader}>
              {t('global.ayfPart3')}
            </Typography>
            <Box sx={sharedStyles.ayfStuPartInfo}>
              <PartDuration ayf={3} assTime={Ass3Time} setAss3Time={(value) => setAss3Time(value)} />
              <PartType ayf={3} assType={Ass3Type} setAss3Type={(value) => setAss3Type(value)} />
              <TextField
                id="outlined-basic"
                label={t('global.sourceMaterial')}
                variant="outlined"
                multiline
                size="small"
                sx={sharedStyles.inputAYF}
                value={Ass3Src}
                onChange={(e) => setAss3Src(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={sharedStyles.ayfStuPart}>
            <Typography variant="body1" sx={sharedStyles.partHeader}>
              {t('global.ayfPart4')}
            </Typography>
            <Box sx={sharedStyles.ayfStuPartInfo}>
              <PartDuration ayf={4} assTime={Ass4Time} setAss4Time={(value) => setAss4Time(value)} />
              <PartType ayf={4} assType={Ass4Type} setAss4Type={(value) => setAss4Type(value)} />
              <TextField
                id="outlined-basic"
                label={t('global.sourceMaterial')}
                variant="outlined"
                multiline
                size="small"
                sx={sharedStyles.inputAYF}
                value={Ass4Src}
                onChange={(e) => setAss4Src(e.target.value)}
              />
            </Box>
          </Box>
        </Box>

        <Box className={`lcPart meetingPart`}>
          <Typography variant="h6">{t('global.livingPart')}</Typography>
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          <SongsList songPart={2} song={SongMiddle} setSongMiddle={(value) => setSongMiddle(value)} />
        </Box>
        <Box sx={{ margin: '20px 0' }}>
          <Box sx={sharedStyles.ayfStuPart}>
            <Typography variant="body1" sx={sharedStyles.partHeader}>
              {t('global.ayfPart1')}
            </Typography>
            <Box sx={sharedStyles.lcPartInfo}>
              <LCPartDuration lc={1} lcTime={LCPart1Time} setLCPart1Time={(value) => setLCPart1Time(value)} />
              <TextField
                id="outlined-basic"
                label={t('global.sourceMaterial')}
                variant="outlined"
                multiline
                size="small"
                sx={sharedStyles.inputLC}
                value={LCPart1Src}
                onChange={(e) => setLCPart1Src(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={sharedStyles.ayfStuPart}>
            <Typography variant="body1" sx={sharedStyles.partHeader}>
              {t('global.ayfPart2')}
            </Typography>
            <Box sx={sharedStyles.lcPartInfo}>
              <LCPartDuration lc={2} lcTime={LCPart2Time} setLCPart2Time={(value) => setLCPart2Time(value)} />
              <TextField
                id="outlined-lc-part-2"
                label={t('global.sourceMaterial')}
                variant="outlined"
                multiline
                size="small"
                sx={sharedStyles.inputLC}
                value={LCPart2Src}
                onChange={(e) => setLCPart2Src(e.target.value)}
              />
            </Box>
          </Box>
          <TextField
            id="outlined-cbs"
            label={t('global.cbs')}
            variant="outlined"
            size="small"
            value={CBSSrc}
            sx={{ marginTop: '20px', width: '100%' }}
            onChange={(e) => setCBSSrc(e.target.value)}
          />
          <Box sx={{ marginTop: '30px' }}>
            <SongsList songPart={3} song={SongConclude} setSongConclude={(value) => setSongConclude(value)} />
          </Box>
        </Box>
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
