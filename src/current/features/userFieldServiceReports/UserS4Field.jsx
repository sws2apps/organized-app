import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { UserS4MonthlyReport } from '../../classes/UserS4MonthlyReport';

const UserS4Field = ({ month, field, errorField, value, setValue, isSubmitted, isLocked }) => {
  const { t } = useTranslation('ui');

  const [hourLess, setHourLess] = useState(false);
  const [showHourLess, setShowHourLess] = useState(false);
  const [hoursValue, setHoursValue] = useState('');
  const [minutesValue, setMinutesValue] = useState('');

  const fldName = () => {
    let value = '';

    if (field === 'placements') value = t('S4Placements');
    if (field === 'videos') value = t('S4Video');
    if (field === 'hours') value = t('S4Hours');
    if (field === 'returnVisits') value = t('S4ReturnVisits');
    if (field === 'bibleStudies') value = t('S4BibleStudies');
    if (field === 'comments') value = t('comments');

    return value;
  };

  const handleMinuteSwitch = async (checked) => {
    setHourLess(checked);
  };

  const handleCommentsChange = async (value) => {
    setValue(value);
    const currentS4 = await UserS4MonthlyReport.get(month);
    await currentS4.saveComments(value);
  };

  useEffect(() => {
    if (field === 'hours') {
      const hours = +value.split(':')[0];
      if (hours === 0) setShowHourLess(true);

      setHoursValue(hours || '');

      const minutes = +value.split(':')[1];
      if (minutes > 0) setMinutesValue(minutes || '');
    }
  }, [field, value]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {field !== 'comments' && <Typography sx={{ width: '280px' }}>{fldName()}</Typography>}
      {field !== 'comments' && (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '340px', gap: '10px', flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            size="small"
            autoComplete="off"
            type={isLocked ? 'text' : 'number'}
            label={hourLess ? t('minuteShortLabel') : ''}
            sx={{ width: '100px', '.MuiOutlinedInput-input': { textAlign: 'center' } }}
            error={errorField ? errorField : null}
            value={hourLess ? minutesValue : field === 'hours' && !isLocked ? hoursValue : value}
            InputProps={{ readOnly: true }}
          />
          {field === 'hours' && showHourLess && (
            <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '5px' }}>
              <FormControlLabel
                control={<Checkbox checked={hourLess} onChange={(e) => handleMinuteSwitch(e.target.checked)} />}
                label={t('lessOneHour')}
                sx={{ '.MuiButtonBase-root': { padding: '4px' }, '.MuiFormControlLabel-label': { lineHeight: 1.2 } }}
              />
            </Box>
          )}
        </Box>
      )}
      {field === 'comments' && (
        <TextField
          label={fldName()}
          multiline
          rows={2}
          variant="outlined"
          size="small"
          autoComplete="off"
          sx={{ flexGrow: 1, marginTop: '15px', maxWidth: '390px' }}
          InputProps={{ readOnly: isSubmitted || isLocked }}
          value={value}
          onChange={(e) => handleCommentsChange(e.target.value)}
        />
      )}
    </Box>
  );
};

export default UserS4Field;
