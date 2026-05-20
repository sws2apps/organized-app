import { buildPersonFullname } from '@utils/common';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useCongregationBaptized from './useCongregationBaptized';
import Typography from '@components/typography';
import UserAccountItem from '@components/user_account_item';
import { EmptyStateRow, UserListContainer } from '../index.styles';

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
        <EmptyStateRow>
          <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
          <Typography color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
            {t('tr_noUsersAdded')}
          </Typography>
        </EmptyStateRow>
      )}

      {users.length > 0 && (
        <UserListContainer>
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
        </UserListContainer>
      )}
    </>
  );
};

export default CongregationBaptized;

