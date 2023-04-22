import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { S21s } from '../../classes/S21s';
import { refreshReportState } from '../../states/report';

const S4Field = ({ field, serviceYear, month, person, initialValue, initialHourLess, errorField }) => {
  const { t } = useTranslation('ui');

  const setRefresh = useSetRecoilState(refreshReportState);

  const [value, setValue] = useState('');
  const [hourLess, setHourLess] = useState(false);

  useEffect(() => {
    setValue(initialValue);
    if (initialHourLess) setHourLess(initialHourLess);
  }, [initialValue, initialHourLess]);

  const fldName =
    field === 'placements'
      ? t('S4Placements')
      : field === 'videos'
      ? t('S4Video')
      : field === 'hours'
      ? t('S4Hours')
      : field === 'returnVisits'
      ? t('S4ReturnVisits')
      : field === 'bibleStudies'
      ? t('S4BibleStudies')
      : field === 'comments'
      ? t('comments')
      : '';

  const updateDuration = async (hourLess, value) => {
    const currentS21 = S21s.get(serviceYear, person);

    if (hourLess) field = 'minutes';

    await currentS21.saveMonthReport(month, { field, value: value === '' ? value : +value });

    let otherField;
    if (field === 'hours') otherField = 'minutes';
    if (field === 'minutes') otherField = 'hours';

    if (otherField) {
      await currentS21.saveMonthReport(month, { field: otherField, value: '' });
    }
  };

  const handleValueChange = async (value) => {
    setValue(value);

    await updateDuration(hourLess, value);
    setRefresh((prev) => !prev);
  };

  const handleMinuteSwitch = async (checked) => {
    setHourLess(checked);
    await updateDuration(checked, value);
  };

  const handleCommentsChange = async (value) => {
    setValue(value);
    const currentS21 = S21s.get(serviceYear, person);
    await currentS21.saveMonthReport(month, { field, value });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {field !== 'comments' && <Typography sx={{ width: '280px' }}>{fldName}</Typography>}
      {field !== 'comments' && (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '340px', gap: '10px', flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            size="small"
            autoComplete="off"
            type="number"
            label={hourLess ? t('minuteShortLabel') : ''}
            sx={{ width: '100px', '.MuiOutlinedInput-input': { textAlign: 'center' } }}
            error={errorField ? errorField : null}
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
          />
          {field === 'hours' && (
            <FormControlLabel
              control={<Checkbox checked={hourLess} onChange={(e) => handleMinuteSwitch(e.target.checked)} />}
              label={t('lessOneHour')}
              sx={{ '.MuiFormControlLabel-label': { lineHeight: 1.2 } }}
            />
          )}
        </Box>
      )}
      {field === 'comments' && (
        <TextField
          label={fldName}
          multiline
          rows={2}
          variant="outlined"
          size="small"
          autoComplete="off"
          sx={{ flexGrow: 1, marginTop: '15px', maxWidth: '390px' }}
          value={value}
          onChange={(e) => handleCommentsChange(e.target.value)}
        />
      )}
    </Box>
  );
};

export default S4Field;
