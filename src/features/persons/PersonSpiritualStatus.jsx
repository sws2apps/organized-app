import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Setting } from '../../classes/Setting';
import { shortDatePickerFormatState } from '../../states/main';
import { useEffect } from 'react';
import { computeYearsDiff } from '../../utils/app';

const PersonSpiritualStatus = ({
  isFemale,
  isElder,
  setIsElder,
  isMS,
  setIsMS,
  isPublisher,
  setIsPublisher,
  isBaptized,
  setIsBaptized,
  immersedDate,
  setImmersedDate,
  isOtherSheep,
  setIsOtherSheep,
  isAnointed,
  setIsAnointed,
}) => {
  const { t } = useTranslation('ui');

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const [baptizedYears, setBaptizedYears] = useState('');

  const roleSecretary = Setting.cong_role.includes('secretary');

  const handleElderCheck = (value) => {
    setIsElder(value);
    if (value) {
      setIsPublisher(true);
      setIsBaptized(true);
      setIsMS(false);
    }
  };

  const handlMSCheck = (value) => {
    setIsMS(value);
    if (value) {
      setIsPublisher(true);
      setIsBaptized(true);
      setIsElder(false);
    }
  };

  const handlePublisherCheck = (value) => {
    setIsPublisher(value);
    if (!value) {
      setIsMS(false);
      setIsElder(false);
    }
  };

  const handleBaptizedCheck = (value) => {
    setIsBaptized(value);
    if (value) setIsPublisher(true);
    if (!value) {
      setIsMS(false);
      setIsElder(false);
      setImmersedDate(null);
    }
  };

  const handleOtherSheepCheck = (value) => {
    setIsOtherSheep(value);
    setIsAnointed(!value);
  };

  const handleAnointedCheck = (value) => {
    setIsAnointed(value);
    setIsOtherSheep(!value);
  };

  useEffect(() => {
    if (immersedDate === null) {
      setBaptizedYears('');
      return;
    }

    const years = computeYearsDiff(immersedDate);
    setBaptizedYears(years);
  }, [immersedDate]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControlLabel
            sx={{ width: 'fit-content' }}
            control={
              <Checkbox
                checked={isPublisher}
                onChange={roleSecretary ? (e) => handlePublisherCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('publisher')}
          />
          <FormControlLabel
            sx={{ width: 'fit-content' }}
            control={
              <Checkbox
                checked={isBaptized}
                onChange={roleSecretary ? (e) => handleBaptizedCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('baptized')}
          />
          {isBaptized && (
            <Box
              sx={{
                marginLeft: '30px',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px',
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="baptism-date-picker"
                  label={t('immersedDate')}
                  sx={{ width: '200px' }}
                  format={shortDatePickerFormat}
                  maxDate={new Date()}
                  value={immersedDate}
                  onChange={(value) => setImmersedDate(value)}
                  readOnly={!Setting.cong_role.includes('secretary')}
                />
              </LocalizationProvider>
              <TextField
                label={t('years')}
                variant="outlined"
                size="small"
                autoComplete="off"
                sx={{ width: '80px', '.MuiOutlinedInput-input': { textAlign: 'right' } }}
                value={baptizedYears}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={isFemale}
                checked={isMS}
                onChange={roleSecretary ? (e) => handlMSCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('ministerialServant')}
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={isFemale}
                checked={isElder}
                onChange={roleSecretary ? (e) => handleElderCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('elder')}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isOtherSheep}
                onChange={roleSecretary ? (e) => handleOtherSheepCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('otherSheep')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAnointed}
                onChange={roleSecretary ? (e) => handleAnointedCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('anointed')}
          />
        </Box>
      </Box>
      {!roleSecretary && (
        <Typography sx={{ fontStyle: 'italic', marginTop: '20px' }} color="#FE4119">
          {t('spiritualStatusNotice')}
        </Typography>
      )}
    </Box>
  );
};

export default PersonSpiritualStatus;
