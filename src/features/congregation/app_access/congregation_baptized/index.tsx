import { Box } from '@mui/material';
import { buildPersonFullname } from '@utils/common';
import { UsersListType } from '../index.types';
import { useAppTranslation } from '@hooks/index';
import useCongregationBaptized from './useCongregationBaptized';
import Typography from '@components/typography';
import UserAccountItem from '@components/user_account_item';

const CongregationBaptized = ({ users }: UsersListType) => {
  const { t } = useAppTranslation();

  const { fullnameOption, handleOpenUserDetails } = useCongregationBaptized();

  return (
    <>
      <Typography className="body-small-semibold">
        {t('tr_baptizedBrothers')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {users.map((user) => (
          <UserAccountItem
            key={user.id}
            variant="baptized"
            name={buildPersonFullname(
              user.profile.lastname.value,
              user.profile.firstname.value,
              fullnameOption
            )}
            clickOnUserAccountItem={() => handleOpenUserDetails(user.id)}
          />
        ))}
      </Box>
    </>
  );
};

export default CongregationBaptized;
