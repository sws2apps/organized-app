import { Box } from '@mui/material';
import { UsersListType } from '../index.types';
import { useAppTranslation } from '@hooks/index';
import useCongregationAdmin from './useCongregationAdmin';
import Typography from '@components/typography';
import UserAccountItem from '@components/user_account_item';

const CongregationAdmin = ({ users }: UsersListType) => {
  const { t } = useAppTranslation();

  const { handleOpenUserDetails, usersList } = useCongregationAdmin(users);

  return (
    <>
      <Typography className="body-small-semibold">
        {t('tr_appAdministrators')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {usersList.map((user) => (
          <UserAccountItem
            key={user.person_id}
            variant="admin"
            name={user.person_name}
            secondary={user.person_role}
            clickOnUserAccountItem={() => handleOpenUserDetails(user.person_id)}
          />
        ))}
      </Box>
    </>
  );
};

export default CongregationAdmin;
