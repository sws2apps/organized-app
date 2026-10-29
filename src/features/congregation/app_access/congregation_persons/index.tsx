import { Box } from '@mui/material';
import { accountProfileFullname } from '@utils/name_format';
import { useAppTranslation } from '@hooks/index';
import { UsersListType } from '../index.types';
import useCongregationPersons from './useCongregationPersons';
import UserAccountItem from '@components/user_account_item';
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

      {!isLoading && (
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
              name={accountProfileFullname(user.profile, fullnameOption)}
              clickOnUserAccountItem={() => handleOpenUserDetails(user.id)}
            />
          ))}
        </Box>
      )}
    </UsersContainer>
  );
};

export default CongregationPersons;
