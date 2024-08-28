import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocalizationProvider,
  TimeField as MUITimeField,
} from '@mui/x-date-pickers';

const TimeField = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MUITimeField
        label="Format with meridiem"
        format="H:mm"
        shouldRespectLeadingZeros
      />
    </LocalizationProvider>
  );
};

export default TimeField;
