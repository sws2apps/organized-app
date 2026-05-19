import { Box } from '@mui/material';
import { buildPersonFullname } from '@utils/common';
import { IconInfo } from '@components/icons';
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

      {users.length === 0 && (
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-start', mt: '8px' }}>
          <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
          <Typography color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
            {t('tr_noUsersAdded')}
          </Typography>
        </Box>
      )}

      {users.length > 0 && (
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
      )}
    </>
  );
};

export default CongregationBaptized;
