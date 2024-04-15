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
import { generateDisplayName } from '../../utils/person';
import { shortDatePickerFormatState } from '../../states/main';
import { Setting } from '../../classes/Setting';
import { computeYearsDiff } from '../../utils/app';

const PersonBasic = ({
  isMale,
  isFemale,
  name,
  displayName,
  setIsMale,
  setIsFemale,
  setName,
  setDisplayName,
  birthDate,
  setBirthDate,
  personEmail,
  setPersonEmail,
  personAddress,
  setPersonAddress,
  personPhone,
  setPersonPhone,
}) => {
  const { t } = useTranslation('ui');

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorDisplayName, setIsErrorDisplayName] = useState(false);
  const [age, setAge] = useState('');

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const coordinatorRole = Setting.cong_role.includes('coordinator');
  const publicTalkCoordinatorRole = Setting.cong_role.includes('public_talk_coordinator');

  const isPersonEditor = lmmoRole || secretaryRole || coordinatorRole || publicTalkCoordinatorRole;

  const handleNameChange = (name) => {
    setIsErrorName(false);
    setIsErrorDisplayName(false);
    if (name === '') {
      setIsErrorName(true);
      setIsErrorDisplayName(true);
    }
    setName(name);
    setDisplayName(generateDisplayName(name));
  };

  const handleDisplayNameChange = (name) => {
    setIsErrorDisplayName(false);
    if (name === '') {
      setIsErrorDisplayName(true);
    }
    setDisplayName(name);
  };

  const handleMaleCheck = (value) => {
    setIsMale(value);
    setIsFemale(!value);
  };

  const handleFemaleCheck = (value) => {
    setIsMale(!value);
    setIsFemale(value);
  };

  useEffect(() => {
    if (birthDate === null || birthDate.toString() === 'Invalid Date') {
      setAge('');
      return;
    }

    const age = computeYearsDiff(birthDate);
    setAge(age);
  }, [birthDate]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <TextField
            label={t('name')}
            variant="outlined"
            size="small"
            autoComplete="off"
            required
            error={isErrorName ? true : false}
            sx={{ width: '320px', flexGrow: 1 }}
            value={name}
            InputProps={{ readOnly: !isPersonEditor }}
            onChange={isPersonEditor ? (e) => handleNameChange(e.target.value) : null}
          />
          <TextField
            label={t('displayName')}
            variant="outlined"
            size="small"
            autoComplete="off"
            required
            error={isErrorDisplayName ? true : false}
            helperText={isErrorDisplayName ? 'Mila fenoina' : null}
            sx={{ width: '210px' }}
            value={displayName}
            InputProps={{ readOnly: !isPersonEditor }}
            onChange={isPersonEditor ? (e) => handleDisplayNameChange(e.target.value) : null}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isMale}
                onChange={isPersonEditor ? (e) => handleMaleCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('male')}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isFemale}
                onChange={isPersonEditor ? (e) => handleFemaleCheck(e.target.checked) : null}
                color="primary"
              />
            }
            label={t('female')}
          />
        </Box>
      </Box>
      <Box sx={{ marginTop: '25px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            id="birth-date-picker"
            label={t('birthDate')}
            sx={{ width: '200px' }}
            format={shortDatePickerFormat}
            maxDate={new Date()}
            value={birthDate === null ? null : new Date(birthDate)}
            onChange={(value) => setBirthDate(value)}
            readOnly={!secretaryRole || !isPersonEditor}
          />
        </LocalizationProvider>
        <TextField
          label={t('age')}
          variant="outlined"
          autoComplete="off"
          sx={{ width: '80px', '.MuiOutlinedInput-input': { textAlign: 'right' } }}
          InputProps={{ readOnly: true }}
          value={age}
        />
      </Box>
      <Box sx={{ marginTop: '25px', display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <TextField
          label={t('emailAddress')}
          variant="outlined"
          size="small"
          autoComplete="off"
          sx={{ maxWidth: '300px' }}
          InputProps={{ readOnly: !secretaryRole || !isPersonEditor }}
          value={personEmail}
          onChange={secretaryRole ? (e) => setPersonEmail(e.target.value) : null}
        />
        <TextField
          label={t('address')}
          variant="outlined"
          size="small"
          autoComplete="off"
          sx={{ width: '100%' }}
          InputProps={{ readOnly: !secretaryRole || !isPersonEditor }}
          value={personAddress}
          onChange={secretaryRole ? (e) => setPersonAddress(e.target.value) : null}
        />
        <TextField
          label={t('phoneNumber')}
          variant="outlined"
          size="small"
          autoComplete="off"
          sx={{ width: '100%' }}
          InputProps={{ readOnly: !secretaryRole || !isPersonEditor }}
          value={personPhone}
          onChange={secretaryRole ? (e) => setPersonPhone(e.target.value) : null}
        />
      </Box>
      {isPersonEditor && !secretaryRole && (
        <Typography sx={{ fontStyle: 'italic', marginTop: '20px' }} color="#FE4119">
          {t('basicInfoSelectedNotice')}
        </Typography>
      )}
    </Box>
  );
};

export default PersonBasic;
