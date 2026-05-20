import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useCongregationAdmin from './useCongregationAdmin';
import Typography from '@components/typography';
import UserAccountItem from '@components/user_account_item';
import { EmptyStateRow, UserListContainer } from '../index.styles';

const CongregationAdmin = () => {
  const { t } = useAppTranslation();

  const { handleOpenUserDetails, usersList } = useCongregationAdmin();

  return (
    <>
      <Typography className="body-small-semibold">
        {t('tr_appAdministrators')}
      </Typography>

      {usersList.length === 0 && (
        <EmptyStateRow>
          <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
          <Typography color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
            {t('tr_noUsersAdded')}
          </Typography>
        </EmptyStateRow>
      )}

      {usersList.length > 0 && (
        <UserListContainer>
          {usersList.map((user) => (
            <UserAccountItem
              key={user.person_id}
              variant="admin"
              name={user.person_name}
              secondary={user.person_role}
              clickOnUserAccountItem={() => handleOpenUserDetails(user.person_id)}
            />
          ))}
        </UserListContainer>
      )}
    </>
  );
};

export default CongregationAdmin;

