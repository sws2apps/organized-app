import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Button, Typography } from '@components';
import { PageHeader } from '@features/app_start';
import { useAppTranslation } from '@hooks/index';

const UserAccountCreated = ({ setIsCreate }) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        gap: '24px',
      }}
    >
      <PageHeader title={t('registrationSuccess')} description={t('accountCreated')} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <Typography variant="body-regular">{t('congregationCreateLabel')}</Typography>
        <Button variant="secondary" onClick={() => setIsCreate(true)}>
          {t('createCongregation')}
        </Button>
      </Box>
    </Box>
  );
};

UserAccountCreated.propTypes = {
  setIsCreate: PropTypes.func,
};

export default UserAccountCreated;
