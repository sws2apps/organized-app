import { Box } from '@mui/material';
import { accountProfileFullname } from '@utils/name_format';
import { useAppTranslation } from '@hooks/index';
import useCongregationBaptized from './useCongregationBaptized';
import Typography from '@components/typography';
import UserAccountItem from '@components/user_account_item';

const CongregationBaptized = () => {
  const { t } = useAppTranslation();

  const { fullnameOption, handleOpenUserDetails, users } =
    useCongregationBaptized();

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
            name={accountProfileFullname(user.profile, fullnameOption)}
            clickOnUserAccountItem={() => handleOpenUserDetails(user.id)}
          />
        ))}
      </Box>
    </>
  );
};

export default CongregationBaptized;
