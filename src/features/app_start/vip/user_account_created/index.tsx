import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useUserAccountCreated from './useUserAccountCreated';
import Button from '@components/button';
import FeatureFlag from '@components/feature_flag';
import PageHeader from '@features/app_start/shared/page_header';
import RequestAccess from '../request_access';
import Typography from '@components/typography';

const UserAccountCreated = () => {
  const { t } = useAppTranslation();

  const { handleCreateCongregation, FEATURE_FLAGS } = useUserAccountCreated();

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
      <Stack spacing="32px">
        <PageHeader
          title={t('tr_registrationSuccess')}
          description={
            FEATURE_FLAGS['REQUEST_ACCESS_USER']
              ? t('tr_accountCreatedJoin')
              : t('tr_accountCreated')
          }
        />

        <FeatureFlag flag="REQUEST_ACCESS_USER">
          <RequestAccess />
        </FeatureFlag>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
        }}
      >
        <Typography className="body-regular">
          {t('tr_congregationCreateLabel')}
        </Typography>
        <Button variant="secondary" onClick={handleCreateCongregation}>
          {t('tr_createCongregation')}
        </Button>
      </Box>
    </Box>
  );
};

export default UserAccountCreated;
