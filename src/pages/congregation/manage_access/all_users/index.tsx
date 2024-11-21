import { Box } from '@mui/material';
import { IconAddPerson } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useAllUsers from './useAllUsers';
import Button from '@components/button';
import CongregationPersons from '@features/congregation/app_access/congregation_persons';
import CongregationVIP from '@features/congregation/app_access/congregation_vip';
import EnableSync from '@features/congregation/app_access/enable_sync';
import PageTitle from '@components/page_title';
import UserAdd from '@features/congregation/app_access/user_add';

const UsersAll = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const {
    userAddOpen,
    handleCloseUserAdd,
    congregationsPersons,
    appAdmin,
    baptizedPersons,
    enableSyncOpen,
    handleAction,
    handleContinue,
    handleCloseEnableSync,
    isLoading,
  } = useAllUsers();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_manageAccessFullTitle')}
        buttons={
          <Button
            variant="main"
            startIcon={<IconAddPerson />}
            onClick={handleAction}
          >
            {t('tr_addUser')}
          </Button>
        }
      />

      {userAddOpen && (
        <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
      )}

      {enableSyncOpen && (
        <EnableSync
          open={enableSyncOpen}
          onClose={handleCloseEnableSync}
          onContinue={handleContinue}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        <CongregationPersons
          isLoading={isLoading}
          users={congregationsPersons}
        />
        <CongregationVIP
          isLoading={isLoading}
          admins={appAdmin}
          brothers={baptizedPersons}
        />
      </Box>
    </Box>
  );
};

export default UsersAll;
