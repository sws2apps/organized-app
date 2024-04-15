import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PersonAppointmentItem from './PersonAppointmentItem';
import { Setting } from '../../classes/Setting';

const PersonAppointment = ({ isFemale, spiritualStatus, setSpiritualStatus }) => {
  const { t } = useTranslation('ui');

  const secretaryRole = Setting.cong_role.includes('secretary');

  const sortedStatus = spiritualStatus.sort((a, b) => {
    return a.startDate < b.startDate ? 1 : -1;
  });

  const handleAppointmentAdd = () => {
    const obj = {
      statusId: window.crypto.randomUUID(),
      status: 'publisher',
      startDate: new Date(),
      endDate: null,
    };
    setSpiritualStatus([obj, ...spiritualStatus]);
  };

  return (
    <Box id="spiritualStatus-container">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '20px',
        }}
      >
        {secretaryRole && (
          <Button variant="outlined" color="success" startIcon={<AddCircleIcon />} onClick={handleAppointmentAdd}>
            {t('newSpiritualStatus')}
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {spiritualStatus?.length > 0 &&
          sortedStatus.map((item) => (
            <PersonAppointmentItem
              key={item.statusId}
              isFemale={isFemale}
              currentStatus={item}
              spiritualStatus={sortedStatus}
              setSpiritualStatus={(value) => setSpiritualStatus(value)}
            />
          ))}
      </Box>
    </Box>
  );
};

export default PersonAppointment;
