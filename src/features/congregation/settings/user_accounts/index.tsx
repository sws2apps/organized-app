import { Stack } from '@mui/material';
import CongregationPersons from '@features/congregation/app_access/congregation_persons';
import CongregationVIP from '@features/congregation/app_access/congregation_vip';
import useCongregationUsers from './useCongregationUsers';

/**
 * The accounts of the congregation. Mounting this is what asks for them, so
 * the settings page can be opened without any account being fetched.
 */
const UserAccounts = () => {
  const { isLoading } = useCongregationUsers();

  return (
    <Stack spacing="16px">
      <CongregationPersons isLoading={isLoading} />
      <CongregationVIP isLoading={isLoading} />
    </Stack>
  );
};

export default UserAccounts;
