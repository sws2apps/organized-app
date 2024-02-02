import { Box } from '@mui/material';
import { Button, Typography } from '@components';
import { PageHeader } from '@features/app_start';
import { useAppTranslation } from '@hooks/index';

const UserAccountCreated = ({ setIsCreate }: { setIsCreate: (value: boolean) => void }) => {
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
      <PageHeader title={t('tr_registrationSuccess')} description={t('tr_accountCreated')} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <Typography className="body-regular">{t('tr_congregationCreateLabel')}</Typography>
        <Button variant="secondary" onClick={() => setIsCreate(true)}>
          {t('tr_createCongregation')}
        </Button>
      </Box>
    </Box>
  );
};

export default UserAccountCreated;
