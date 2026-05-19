import { Box } from '@mui/material';
import { buildPersonFullname } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import { UsersListType } from '../index.types';
import useCongregationPersons from './useCongregationPersons';
import { IconInfo } from '@components/icons';
import UserAccountItem from '@components/user_account_item';
import Typography from '@components/typography';
import UsersContainer from '../users_container';
import WaitingLoader from '@components/waiting_loader';

const CongregationPersons = ({ isLoading }: UsersListType) => {
  const { t } = useAppTranslation();

  const { fullnameOption, handleOpenUserDetails, users } =
    useCongregationPersons();

  return (
    <UsersContainer
      title={t('tr_congregationPersons')}
      description={t('tr_congregationPersonsDesc')}
      gap="24px"
    >
      {isLoading && <WaitingLoader size={56} variant="standard" />}

      {!isLoading && users.length === 0 && (
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
          <Typography color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
            {t('tr_noUsersAdded')}
          </Typography>
        </Box>
      )}

      {!isLoading && users.length > 0 && (
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
              variant="user"
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
    </UsersContainer>
  );
};

export default CongregationPersons;
