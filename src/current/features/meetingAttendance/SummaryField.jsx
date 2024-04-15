import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const SummaryField = ({ field, value = '' }) => {
  const { t } = useTranslation('ui');

  const fldName = () => {
    let value = '';

    if (field === 'totalMeetings') value = t('numberOfMeetings');
    if (field === 'totalAttendance') value = t('totalAttendance');
    if (field === 'average') value = t('averageAttendanceWeek');

    return value;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <Typography sx={{ width: '180px' }}>{fldName()}</Typography>
      <TextField
        variant="outlined"
        size="small"
        autoComplete="off"
        type="number"
        sx={{ width: '100px', '.MuiOutlinedInput-input': { textAlign: 'center' } }}
        value={value}
      />
    </Box>
  );
};

export default SummaryField;
