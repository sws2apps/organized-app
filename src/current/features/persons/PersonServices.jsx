import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PersonServiceItem from './PersonServiceItem';
import { Setting } from '../../classes/Setting';

const PersonServices = ({ otherService, setOtherService }) => {
  const { t } = useTranslation('ui');

  const secretaryRole = Setting.cong_role.includes('secretary');

  const sortedService = otherService.sort((a, b) => {
    return a.startDate < b.startDate ? 1 : -1;
  });

  const handleAppointmentAdd = () => {
    const obj = {
      serviceId: window.crypto.randomUUID(),
      service: 'auxiliaryPioneer',
      startDate: new Date(),
      endDate: null,
    };
    setOtherService([obj, ...otherService]);
  };

  return (
    <Box id="other-service-container">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '20px',
        }}
      >
        {secretaryRole && (
          <Button variant="outlined" color="success" startIcon={<AddCircleIcon />} onClick={handleAppointmentAdd}>
            {t('add')}
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {otherService?.length > 0 &&
          sortedService.map((item) => (
            <PersonServiceItem
              key={item.serviceId}
              currentService={item}
              otherService={sortedService}
              setOtherService={(value) => setOtherService(value)}
            />
          ))}
      </Box>
    </Box>
  );
};

export default PersonServices;
