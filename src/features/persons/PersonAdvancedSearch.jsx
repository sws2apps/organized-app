import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Typography from '@mui/material/Typography';
import { themeOptionsState } from '../../states/theme';

const StudentAdvancedSearch = ({
  advancedOpen,
  isFemale,
  isMale,
  assTypes,
  handleSearchStudent,
  setAdvancedOpen,
  setIsFemale,
  setIsMale,
  setAssTypes,
  txtSearch,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);

  const [isChairman, setIsChairman] = useState(false);
  const [isPrayer, setIsPrayer] = useState(false);
  const [isTGWTalk, setIsTGWTalk] = useState(false);
  const [isTGWGems, setIsTGWGems] = useState(false);
  const [isBRead, setIsBRead] = useState(false);
  const [isInitialCall, setIsInitialCall] = useState(false);
  const [isReturnVisit, setIsReturnVisit] = useState(false);
  const [isBibleStudy, setIsBibleStudy] = useState(false);
  const [isTalk, setIsTalk] = useState(false);
  const [isLCPart, setIsLCPart] = useState(false);
  const [isCBSConductor, setIsCBSConductor] = useState(false);
  const [isCBSReader, setIsCBSReader] = useState(false);

  const handleSearchAdvanced = () => {
    handleSearchStudent(txtSearch, isMale, isFemale, assTypes);
  };

  const handleCheckChairman = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 110) === -1) {
        setAssTypes((prev) => {
          return [...prev, 110];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 110);
        return obj;
      });
    }
  };

  const handleCheckPrayer = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 111) === -1) {
        setAssTypes((prev) => {
          return [...prev, 111];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 111);
        return obj;
      });
    }
  };

  const handleCheckTGWTalk = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 112) === -1) {
        setAssTypes((prev) => {
          return [...prev, 112];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 112);
        return obj;
      });
    }
  };

  const handleCheckTGWGems = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 113) === -1) {
        setAssTypes((prev) => {
          return [...prev, 113];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 113);
        return obj;
      });
    }
  };

  const handleCheckBRead = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 100) === -1) {
        setAssTypes((prev) => {
          return [...prev, 100];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 100);
        return obj;
      });
    }
  };

  const handleCheckInitialCall = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 101) === -1) {
        setAssTypes((prev) => {
          return [...prev, 101];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 101);
        return obj;
      });
    }
  };

  const handleCheckReturnVisit = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 102) === -1) {
        setAssTypes((prev) => {
          return [...prev, 102];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 102);
        return obj;
      });
    }
  };

  const handleCheckBibleStudy = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 103) === -1) {
        setAssTypes((prev) => {
          return [...prev, 103];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 103);
        return obj;
      });
    }
  };

  const handleCheckTalk = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 104) === -1) {
        setAssTypes((prev) => {
          return [...prev, 104];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 104);
        return obj;
      });
    }
  };

  const handleCheckLCPart = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 114) === -1) {
        setAssTypes((prev) => {
          return [...prev, 114];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 114);
        return obj;
      });
    }
  };

  const handleCheckCBSConductor = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 115) === -1) {
        setAssTypes((prev) => {
          return [...prev, 115];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 115);
        return obj;
      });
    }
  };

  const handleCheckCBSReader = (value) => {
    if (value) {
      if (assTypes.findIndex((assType) => assType === 116) === -1) {
        setAssTypes((prev) => {
          return [...prev, 116];
        });
      }
    } else {
      setAssTypes((prev) => {
        const obj = prev.filter((assType) => assType !== 116);
        return obj;
      });
    }
  };

  useEffect(() => {
    setIsChairman(false);
    setIsPrayer(false);
    setIsTGWTalk(false);
    setIsTGWGems(false);
    setIsBRead(false);
    setIsInitialCall(false);
    setIsReturnVisit(false);
    setIsBibleStudy(false);
    setIsTalk(false);
    setIsLCPart(false);
    setIsCBSConductor(false);
    setIsCBSReader(false);

    for (let i = 0; i < assTypes.length; i++) {
      const type = assTypes[i];

      if (type === 110) setIsChairman(true);
      if (type === 111) setIsPrayer(true);
      if (type === 112) setIsTGWTalk(true);
      if (type === 113) setIsTGWGems(true);
      if (type === 100) setIsBRead(true);
      if (type === 101) setIsInitialCall(true);
      if (type === 102) setIsReturnVisit(true);
      if (type === 103) setIsBibleStudy(true);
      if (type === 104) setIsTalk(true);
      if (type === 114) setIsLCPart(true);
      if (type === 115) setIsCBSConductor(true);
      if (type === 116) setIsCBSReader(true);
    }
  }, [assTypes]);

  return (
    <Collapse in={advancedOpen} timeout="auto" unmountOnExit>
      <Box
        sx={{
          marginBottom: '20px',
          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.25),
          borderRadius: '8px',
          marginTop: '8px',
          padding: '5px 20px',
          boxShadow: '0 3px 5px 2px rgba(44, 62, 80, .3)',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <FormGroup sx={{ marginRight: '30px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isMale}
                  onChange={(e) => setIsMale(e.target.checked)}
                  color="primary"
                  sx={{ padding: '5px' }}
                />
              }
              label={t('persons.male')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFemale}
                  onChange={(e) => setIsFemale(e.target.checked)}
                  color="primary"
                  sx={{ padding: '5px' }}
                />
              }
              label={t('persons.female')}
            />
          </FormGroup>
          <Box sx={{ marginTop: '3px' }}>
            <Typography sx={{ fontWeight: 'bold' }}>{t('global.assignment')}</Typography>
            <FormGroup
              sx={{
                marginRight: '30px',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChairman}
                    onChange={(e) => handleCheckChairman(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.chairmanMidweekMeeting')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPrayer}
                    onChange={(e) => handleCheckPrayer(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.prayerMidweekMeeting')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTGWTalk}
                    onChange={(e) => handleCheckTGWTalk(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.tgwTalk')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTGWGems}
                    onChange={(e) => handleCheckTGWGems(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.tgwGems')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isBRead}
                    onChange={(e) => handleCheckBRead(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.bibleReading')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isInitialCall}
                    onChange={(e) => handleCheckInitialCall(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.initialCall')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isReturnVisit}
                    onChange={(e) => handleCheckReturnVisit(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.returnVisit')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isBibleStudy}
                    onChange={(e) => handleCheckBibleStudy(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.bibleStudy')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTalk}
                    onChange={(e) => handleCheckTalk(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.talk')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isLCPart}
                    onChange={(e) => handleCheckLCPart(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.lcPart')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCBSConductor}
                    onChange={(e) => handleCheckCBSConductor(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.cbsConductor')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCBSReader}
                    onChange={(e) => handleCheckCBSReader(e.target.checked)}
                    color="primary"
                    sx={{ padding: '5px' }}
                  />
                }
                label={t('global.cbsReader')}
              />
            </FormGroup>
          </Box>
        </Box>
        <Box sx={{ marginTop: '10px' }}>
          <IconButton
            sx={{
              backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
              },
              marginRight: '10px',
            }}
            onClick={() => setAdvancedOpen(false)}
          >
            <ExpandLessIcon sx={{ fontSize: '25px' }} />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.5),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.3),
              },
            }}
            onClick={handleSearchAdvanced}
          >
            <PersonSearchIcon sx={{ fontSize: '25px' }} />
          </IconButton>
        </Box>
      </Box>
    </Collapse>
  );
};

export default StudentAdvancedSearch;
