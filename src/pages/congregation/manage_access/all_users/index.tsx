import { Box } from '@mui/material';
import { IconAddPerson } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useAllUsers from './useAllUsers';
import CongregationPersons from '@features/congregation/app_access/congregation_persons';
import CongregationVIP from '@features/congregation/app_access/congregation_vip';
import PageTitle from '@components/page_title';
import UserAdd from '@features/congregation/app_access/user_add';
import NavBarButton from '@components/nav_bar_button';

const UsersAll = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { userAddOpen, handleCloseUserAdd, isLoading, handleOpenUserAdd } =
    useAllUsers();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={t('tr_manageAccessFullTitle')}
        buttons={
          <NavBarButton
            text={t('tr_btnAdd')}
            main
            icon={<IconAddPerson />}
            onClick={handleOpenUserAdd}
          ></NavBarButton>
        }
      />

      {userAddOpen && (
        <UserAdd open={userAddOpen} onClose={handleCloseUserAdd} />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        <CongregationPersons isLoading={isLoading} />
        <CongregationVIP isLoading={isLoading} />
      </Box>
    </Box>
  );
};

export default UsersAll;
