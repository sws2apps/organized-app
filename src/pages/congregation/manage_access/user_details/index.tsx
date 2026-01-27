import { Box } from '@mui/material';
import { IconDelete } from '@components/icons';
import { buildPersonFullname } from '@utils/common';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useUserDetails from './useUserDetails';
import DeleteUser from '@features/congregation/app_access/user_details/delete_user';
import PageTitle from '@components/page_title';
import UserMemberDetails from '@features/congregation/app_access/user_details';
import NavBarButton from '@components/nav_bar_button';

const UserDetails = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  const {
    user,
    fullnameOption,
    deleteDisabled,
    handleCloseDelete,
    handleOpenDelete,
    isDelete,
  } = useUserDetails();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      {isDelete && (
        <DeleteUser user={user} open={isDelete} onClose={handleCloseDelete} />
      )}

      {user && (
        <PageTitle
          title={buildPersonFullname(
            user.profile.lastname.value,
            user.profile.firstname.value,
            fullnameOption
          )}
          buttons={
            <NavBarButton
              text={t('tr_delete')}
              main
              color="red"
              icon={<IconDelete />}
              disabled={deleteDisabled}
              onClick={handleOpenDelete}
            ></NavBarButton>
          }
        />
      )}

      {user && <UserMemberDetails />}
    </Box>
  );
};

export default UserDetails;
