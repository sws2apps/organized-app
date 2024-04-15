import { useSetRecoilState } from 'recoil';
import dateFormat from 'dateformat';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { UserS4Records } from '../../classes/UserS4Records';
import { refreshReportState } from '../../states/report';

const S4GenericField = ({ fldType, month, currentDate, value = 0, setValue }) => {
  const { t } = useTranslation('ui');

  const setRefreshScreen = useSetRecoilState(refreshReportState);

  const fldName = t(fldType);

  const getClassField = () => {
    if (fldType === 'S4Placements') return 'placements';
    if (fldType === 'S4Video') return 'videos';
    if (fldType === 'S4ReturnVisits') return 'returnVisits';
  };

  const handleRecordUpdate = async (value) => {
    const classField = getClassField();
    const tmpDate = dateFormat(new Date(currentDate), 'yyyy/mm/dd');

    const currentReport = await UserS4Records.get(tmpDate);
    currentReport[classField] = value;
    currentReport.changes = currentReport.changes.filter((record) => record.field !== classField);
    currentReport.changes.push({ date: new Date(), field: classField, value });

    await currentReport.save();

    setValue(value);
    setRefreshScreen((prev) => !prev);
  };

  const handleIncreaseCount = async () => {
    const tmp = value + 1;
    await handleRecordUpdate(tmp);
  };

  const handleDecreaseCount = async () => {
    let tmp = 0;

    if (value > 0) tmp = value - 1;

    await handleRecordUpdate(tmp);
  };

  return (
    <Box sx={{ margin: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '280px' }}>
      <Typography sx={{ lineHeight: 1.2, textAlign: 'center', fontSize: '13px', width: '200px', marginBottom: '5px' }}>
        {fldName}
      </Typography>

      <Box sx={{ display: 'flex', falignItems: 'center' }}>
        <IconButton aria-label="remove" color="warning" onClick={handleDecreaseCount}>
          <RemoveCircleIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth={true}
            sx={{ '.MuiOutlinedInput-input': { textAlign: 'center', fontSize: '18px' } }}
            type="number"
            value={value}
          />
        </Box>
        <IconButton aria-label="add" color="secondary" onClick={handleIncreaseCount}>
          <AddCircleIcon sx={{ fontSize: '30px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default S4GenericField;
