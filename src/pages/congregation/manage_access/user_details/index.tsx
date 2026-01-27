import { Box } from '@mui/material';
import { IconDelete } from '@components/icons';
import { buildPersonFullname } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import useUserDetails from './useUserDetails';
import DeleteUser from '@features/congregation/app_access/user_details/delete_user';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import UserMemberDetails from '@features/congregation/app_access/user_details';

const UserDetails = () => {
  const { t } = useAppTranslation();

  const {
    user,
    fullnameOption,
    deleteDisabled,
    handleCloseDelete,
    handleOpenDelete,
    isDelete,
  } = useUserDetails();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
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
            <Button
              variant="main"
              color="red"
              startIcon={<IconDelete />}
              disabled={deleteDisabled}
              onClick={handleOpenDelete}
            >
              {t('tr_delete')}
            </Button>
          }
        />
      )}

      {user && <UserMemberDetails />}
    </Box>
  );
};

export default UserDetails;
