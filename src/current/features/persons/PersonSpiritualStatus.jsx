import { useEffect, useState } from 'react';
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
import { computeYearsDiff } from '../../utils/app';
import PersonAppointment from './PersonAppointment';
import PersonServices from './PersonServices';

const PersonSpiritualStatus = ({
  isFemale,
  isBaptized,
  setIsBaptized,
  immersedDate,
  setImmersedDate,
  isOtherSheep,
  setIsOtherSheep,
  isAnointed,
  setIsAnointed,
  birthDate,
  spiritualStatus,
  setSpiritualStatus,
  otherService,
  setOtherService,
  firstMonthReport,
  setFirstMonthReport,
}) => {
  const { t } = useTranslation('ui');

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const [baptizedYears, setBaptizedYears] = useState('');

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const isEditAllowed = lmmoRole || secretaryRole;

  const handleBaptizedCheck = (value) => {
    setIsBaptized(value);
    if (!value) {
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

  const handleFirstMonthReport = (value) => {
    setFirstMonthReport(value);
    if (value !== null) {
      setTimeout(() => {
        const date = new Date(value);
        value = new Date(date.getFullYear(), date.getMonth(), 1);
        setFirstMonthReport(value);
      }, 1000);
    }
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
      <Box sx={{ marginLeft: '20px' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isOtherSheep}
                onChange={secretaryRole ? (e) => handleOtherSheepCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('otherSheep')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAnointed}
                onChange={secretaryRole ? (e) => handleAnointedCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('anointed')}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
          <FormControlLabel
            sx={{ width: 'fit-content' }}
            control={
              <Checkbox
                checked={isBaptized}
                onChange={secretaryRole ? (e) => handleBaptizedCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('baptized')}
          />
          {isBaptized && (
            <Box
              sx={{
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
                  minDate={birthDate === null ? null : new Date(birthDate)}
                  maxDate={new Date()}
                  value={immersedDate === null ? null : new Date(immersedDate)}
                  onChange={(value) => setImmersedDate(value)}
                  readOnly={!secretaryRole}
                />
              </LocalizationProvider>
              <TextField
                label={t('years')}
                variant="outlined"
                autoComplete="off"
                sx={{ width: '80px', '.MuiOutlinedInput-input': { textAlign: 'right' } }}
                InputProps={{ readOnly: true }}
                value={baptizedYears}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ marginTop: '30px' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              id="first-report-date-picker"
              label={t('firstMonthReport')}
              sx={{ width: '200px' }}
              format={shortDatePickerFormat}
              minDate={birthDate === null ? null : new Date(birthDate)}
              maxDate={new Date()}
              value={firstMonthReport === null ? null : new Date(firstMonthReport)}
              onChange={(value) => handleFirstMonthReport(value)}
              readOnly={!secretaryRole}
            />
          </LocalizationProvider>
          <Typography sx={{ fontSize: '13px', marginTop: '8px' }}>* {t('firstMonthReportDesc')}</Typography>
        </Box>
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Typography sx={{ marginBottom: '15px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {t('spiritualStatus')}
        </Typography>
        <PersonAppointment
          isFemale={isFemale}
          spiritualStatus={spiritualStatus}
          setSpiritualStatus={(value) => setSpiritualStatus(value)}
        />
      </Box>
      {isBaptized && (
        <Box sx={{ marginTop: '30px' }}>
          <Typography sx={{ marginBottom: '15px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {t('otherService')}
          </Typography>
          <PersonServices otherService={otherService} setOtherService={(value) => setOtherService(value)} />
        </Box>
      )}

      {isEditAllowed && !secretaryRole && (
        <Typography sx={{ fontStyle: 'italic', marginTop: '20px' }} color="#FE4119">
          {t('spiritualStatusNotice')}
        </Typography>
      )}
    </Box>
  );
};

export default PersonSpiritualStatus;
