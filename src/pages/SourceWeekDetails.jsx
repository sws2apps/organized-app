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
import { LCPartHeading, PartDuration, PartType, SongsList, StudyPoint, WeekType } from '../features/sourceMaterial';
import { isRerenderSourceState } from '../states/sourceMaterial';
import { shortDateFormatState, sourceLangState } from '../states/main';
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
  const [BReadStudy, setBReadStudy] = useState('');
  const [Ass1Type, setAss1Type] = useState('');
  const [Ass1Time, setAss1Time] = useState('');
  const [Ass1Study, setAss1Study] = useState('');
  const [Ass1Src, setAss1Src] = useState('');
  const [Ass2Type, setAss2Type] = useState('');
  const [Ass2Time, setAss2Time] = useState('');
  const [Ass2Study, setAss2Study] = useState('');
  const [Ass2Src, setAss2Src] = useState('');
  const [Ass3Type, setAss3Type] = useState('');
  const [Ass3Time, setAss3Time] = useState('');
  const [Ass3Study, setAss3Study] = useState('');
  const [Ass3Src, setAss3Src] = useState('');
  const [Ass4Type, setAss4Type] = useState('');
  const [Ass4Time, setAss4Time] = useState('');
  const [Ass4Study, setAss4Study] = useState('');
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

  const week = weekToFormat.replaceAll('-', '/');
  const weekFormatted = dateFormat(new Date(week), shortDateFormat);

  const handleNavigateSource = () => {
    navigate(`/source-materials`);
  };

  const handleSaveSource = async () => {
    const obj = {};

    let lcCount = 0;
    if (isOverrideLCPart1 || isOverrideLCPart2) {
      // check timing first
      let timeOverride = 0;
      if (isOverrideLCPart1) timeOverride += +LCPart1TimeOverride;
      if (!isOverrideLCPart1) timeOverride += +LCPart1Time;
      if (isOverrideLCPart2) timeOverride += +LCPart2TimeOverride;
      if (!isOverrideLCPart2) timeOverride += +LCPart2Time;
      timeOverride += +CBSTimeOverride;
      if (timeOverride !== 45) {
        setAppSnackOpen(true);
        setAppSeverity('warning');
        setAppMessage(t('overrideSaveWarning'));
        return;
      }

      if (isOverrideLCPart1) lcCount++;
      if (!isOverrideLCPart1 && LCPart1Src !== '') lcCount++;
      if (isOverrideLCPart2) lcCount++;
      if (!isOverrideLCPart2 && LCPart2Src !== '') lcCount++;

      obj.lcCount_override = lcCount;
      obj.lcPart1_time_override = LCPart1TimeOverride === '' ? undefined : +LCPart1TimeOverride;
      obj.lcPart1_src_override = LCPart1SrcOverride === '' ? undefined : LCPart1SrcOverride;
      obj.lcPart1_content_override = LCPart1ContentOverride === '' ? undefined : LCPart1ContentOverride;
      obj.lcPart2_time_override = LCPart2TimeOverride === '' ? undefined : +LCPart2TimeOverride;
      obj.lcPart2_src_override = LCPart2SrcOverride === '' ? undefined : LCPart2SrcOverride;
      obj.lcPart2_content_override = LCPart2ContentOverride === '' ? undefined : LCPart2ContentOverride;
      obj.cbs_time_override = CBSTimeOverride === '' ? undefined : +CBSTimeOverride;
    }

    lcCount = 0;
    if (LCPart1Time !== '') lcCount++;
    if (LCPart2Time !== '') lcCount++;
    obj.lcCount = lcCount;
    obj.lcPart1_time = LCPart1Time === '' ? undefined : +LCPart1Time;
    obj.lcPart1_src = LCPart1Src;
    obj.lcPart1_content = LCPart1Content;
    obj.lcPart2_time = LCPart2Time === '' ? undefined : +LCPart2Time;
    obj.lcPart2_src = LCPart2Src;
    obj.lcPart2_content = LCPart2Content;

    obj.weekOf = weekOf;
    obj.weekDate_src = WeekDate;
    obj.weeklyBibleReading_src = WeeklyBibleReading;
    obj.songFirst_src = +SongFirst;
    obj.tgwTalk_src = TGWTalk;
    obj.bibleReading_src = BRead;
    obj.bibleReading_study = BReadStudy === '' ? undefined : +BReadStudy;
    obj.ass1_type = Ass1Type === '' ? undefined : +Ass1Type;
    obj.ass1_time = Ass1Time === '' ? undefined : +Ass1Time;
    obj.ass1_study = Ass1Study === '' ? undefined : +Ass1Study;
    obj.ass1_src = Ass1Src;
    obj.ass2_type = Ass2Type === '' ? undefined : +Ass2Type;
    obj.ass2_time = Ass2Time === '' ? undefined : +Ass2Time;
    obj.ass2_study = Ass2Study === '' ? undefined : +Ass2Study;
    obj.ass2_src = Ass2Src;
    obj.ass3_type = Ass3Type === '' ? undefined : +Ass3Type;
    obj.ass3_time = Ass3Time === '' ? undefined : +Ass3Time;
    obj.ass3_study = Ass3Study === '' ? undefined : +Ass3Study;
    obj.ass3_src = Ass3Src;
    obj.ass4_type = Ass4Type === '' ? undefined : +Ass4Type;
    obj.ass4_time = Ass4Time === '' ? undefined : +Ass4Time;
    obj.ass4_study = Ass4Study === '' ? undefined : +Ass4Study;
    obj.ass4_src = Ass4Src;
    obj.songMiddle_src = +SongMiddle;
    obj.cbs_src = CBSSrc;
    obj.songConclude_src = isNaN(SongConclude) ? SongConclude : +SongConclude;
    obj.week_type = weekType;
    obj.noMeeting = !hasMeeting;
    obj.isOverride = true;

    const isSaved = await dbSaveSrcData(obj, false);

    if (isSaved === true) {
      setAppSnackOpen(true);
      setAppSeverity('success');
      setAppMessage(t('weekSaved'));
    } else {
      setAppSnackOpen(true);
      setAppSeverity('error');
      setAppMessage(t('saveError'));
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
        setBReadStudy(data.bibleReading_study);
        setAss1Time(data.ass1_time);
        setAss1Type(data.ass1_type);
        setAss1Study(data.ass1_study);
        setAss1Src(data.ass1_src);
        setAss2Time(data.ass2_time);
        setAss2Type(data.ass2_type);
        setAss2Study(data.ass2_study);
        setAss2Src(data.ass2_src);
        setAss3Time(data.ass3_time);
        setAss3Type(data.ass3_type);
        setAss3Study(data.ass3_study);
        setAss3Src(data.ass3_src);
        setAss4Time(data.ass4_time);
        setAss4Type(data.ass4_type);
        setAss4Study(data.ass4_study);
        setAss4Src(data.ass4_src);
        setSongMiddle(data.songMiddle_src);
        setIsOverrideLCPart1(data.lcPart1_time_override !== '');
        setLCPart1Time(data.lcPart1_time);
        setLCPart1TimeOverride(data.lcPart1_time_override);
        setLCPart1Src(data.lcPart1_src);
        setLCPart1SrcOverride(data.lcPart1_src_override);
        setLCPart1Content(data.lcPart1_content);
        setLCPart1ContentOverride(data.lcPart1_content_override);
        if (data.lcPart2_time_override) {
          setIsOverrideLCPart2(data.lcPart2_time_override !== '');
        } else {
          if (data.lcCount_override < data.lcCount) {
            setIsOverrideLCPart2(true);
          }
        }

        setLCPart2Time(data.lcPart2_time);
        setLCPart2TimeOverride(data.lcPart2_time_override);
        setLCPart2Src(data.lcPart2_src);
        setLCPart2SrcOverride(data.lcPart2_src_override);
        setLCPart2Content(data.lcPart2_content);
        setLCPart2ContentOverride(data.lcPart2_content_override);
        setCBSSrc(data.cbs_src);
        setCBSTimeOverride(data.cbs_time_override);
        setSongConclude(data.songConclude_src);
      }
    };

    if (week !== '' && isSubscribed) {
      loadWeekData();
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
            label={hasMeeting ? t('hasMeeting') : t('noMeeting')}
          />
        </Box>
        <Box sx={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px', width: '280px' }}>
          <TextField
            id="outlined-week-date"
            label={t('date')}
            variant="outlined"
            size="small"
            value={WeekDate}
            onChange={(e) => setWeekDate(e.target.value)}
          />
          <TextField
            id="outlined-weekly-bible-reading"
            label={t('weeklybibleReading')}
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
          <Typography variant="h6">{t('treasuresPart')}</Typography>
        </Box>
        <Box sx={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            id="outlined-tgw-talk-10"
            label={t('tgwTalk')}
            variant="outlined"
            size="small"
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
              value={BRead}
              sx={{ width: '300px' }}
              onChange={(e) => setBRead(e.target.value)}
            />
            <StudyPoint isBRead={true} studyPoint={BReadStudy} setBReadStudy={(value) => setBReadStudy(value)} />
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
                isAyf={true}
                max={10}
                ayf={1}
                assTime={Ass1Time}
                setAss1Time={(value) => setAss1Time(value)}
              />
              <PartType ayf={1} assType={Ass1Type} setAss1Type={(value) => setAss1Type(value)} />
              <StudyPoint ayf={1} studyPoint={Ass1Study} setAss1Study={(value) => setAss1Study(value)} />
              <TextField
                id="outlined-basic"
                label={t('sourceMaterial')}
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
              {t('ayfPart2')}
            </Typography>
            <Box sx={sharedStyles.ayfStuPartInfo}>
              <PartDuration
                isAyf={true}
                max={10}
                ayf={2}
                assTime={Ass2Time}
                setAss2Time={(value) => setAss2Time(value)}
              />
              <PartType ayf={2} assType={Ass2Type} setAss2Type={(value) => setAss2Type(value)} />
              <StudyPoint ayf={2} studyPoint={Ass2Study} setAss2Study={(value) => setAss2Study(value)} />
              <TextField
                id="outlined-basic"
                label={t('sourceMaterial')}
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
              {t('ayfPart3')}
            </Typography>
            <Box sx={sharedStyles.ayfStuPartInfo}>
              <PartDuration
                isAyf={true}
                max={10}
                ayf={3}
                assTime={Ass3Time}
                setAss3Time={(value) => setAss3Time(value)}
              />
              <PartType ayf={3} assType={Ass3Type} setAss3Type={(value) => setAss3Type(value)} />
              <StudyPoint ayf={3} studyPoint={Ass3Study} setAss3Study={(value) => setAss3Study(value)} />
              <TextField
                id="outlined-basic"
                label={t('sourceMaterial')}
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
              {t('ayfPart4')}
            </Typography>
            <Box sx={sharedStyles.ayfStuPartInfo}>
              <PartDuration
                isAyf={true}
                max={10}
                ayf={4}
                assTime={Ass4Time}
                setAss4Time={(value) => setAss4Time(value)}
              />
              <PartType ayf={4} assType={Ass4Type} setAss4Type={(value) => setAss4Type(value)} />
              <StudyPoint ayf={4} studyPoint={Ass4Study} setAss4Study={(value) => setAss4Study(value)} />
              <TextField
                id="outlined-basic"
                label={t('sourceMaterial')}
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
          <Typography variant="h6">{t('livingPart')}</Typography>
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          <SongsList songPart={2} song={SongMiddle} setSongMiddle={(value) => setSongMiddle(value)} />
        </Box>
        <Box sx={{ margin: '20px 0' }}>
          <Box sx={sharedStyles.ayfStuPart}>
            <LCPartHeading
              label={t('ayfPart1')}
              overrideChecked={isOverrideLCPart1}
              setOverrideChecked={(value) => setIsOverrideLCPart1(value)}
            />

            <Box sx={sharedStyles.lcPartInfo}>
              <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <PartDuration
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
              label={t('ayfPart2')}
              overrideChecked={isOverrideLCPart2}
              setOverrideChecked={(value) => setIsOverrideLCPart2(value)}
            />
            <Box sx={sharedStyles.lcPartInfo}>
              <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <PartDuration
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
                sx={sharedStyles.inputLC}
                value={isOverrideLCPart2 ? LCPart2ContentOverride : LCPart2Content}
                onChange={(e) =>
                  isOverrideLCPart2 ? setLCPart2ContentOverride(e.target.value) : setLCPart2Content(e.target.value)
                }
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '25px' }}>
            {(isOverrideLCPart1 || isOverrideLCPart2) && (
              <PartDuration
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
              value={CBSSrc}
              sx={{ flexGrow: 1 }}
              onChange={(e) => setCBSSrc(e.target.value)}
            />
          </Box>

          <Box sx={{ marginTop: '30px' }}>
            {!isNaN(SongConclude) && (
              <SongsList songPart={3} song={SongConclude} setSongConclude={(value) => setSongConclude(value)} />
            )}
            {isNaN(SongConclude) && (
              <TextField
                id="outlined-song-conlude"
                label={t('song')}
                variant="outlined"
                size="small"
                value={SongConclude}
                sx={{ width: '100%' }}
                onChange={(value) => setSongConclude(value)}
              />
            )}
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
