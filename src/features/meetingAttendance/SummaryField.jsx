import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const SummaryField = ({ field, value = '' }) => {
  const { t } = useTranslation('ui');

  const fldName =
    field === 'totalMeetings'
      ? t('numberOfMeetings')
      : field === 'totalAttendance'
      ? t('totalAttendance')
      : field === 'average'
      ? t('averageAttendanceWeek')
      : '';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <Typography sx={{ width: '180px' }}>{fldName}</Typography>
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
