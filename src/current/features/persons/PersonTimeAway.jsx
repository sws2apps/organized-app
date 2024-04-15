import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { PersonTimeAwayItem } from './';
import { Setting } from '../../classes/Setting';

const PersonTimeAway = ({ timeAway, setTimeAway }) => {
  const { t } = useTranslation('ui');

  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const isEditAllowed = lmmoRole || secretaryRole;

  const handleTimeAwayAdd = () => {
    const obj = {
      timeAwayId: window.crypto.randomUUID(),
      startDate: new Date(),
      endDate: null,
      comments: '',
    };
    setTimeAway([obj, ...timeAway]);
  };

  return (
    <Box id="time-away-container">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '10px',
        }}
      >
        {isEditAllowed && (
          <Button variant="outlined" color="success" startIcon={<AddCircleIcon />} onClick={handleTimeAwayAdd}>
            {t('addTimeAway')}
          </Button>
        )}
      </Box>
      {timeAway?.length > 0 &&
        timeAway.map((item) => (
          <PersonTimeAwayItem
            key={item.timeAwayId}
            timeAway={item}
            timeAways={timeAway}
            setTimeAway={(value) => setTimeAway(value)}
          />
        ))}
    </Box>
  );
};

export default PersonTimeAway;
