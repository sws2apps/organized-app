import { buildPersonFullname } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import { UsersListType } from '../index.types';
import useCongregationPersons from './useCongregationPersons';
import { IconInfo } from '@components/icons';
import UserAccountItem from '@components/user_account_item';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';
import { CardSection, CardSectionHeader, CardSectionContent } from '../../settings/shared_styles';
import { EmptyStateRow, UserListContainer } from '../index.styles';

const CongregationPersons = ({ isLoading }: UsersListType) => {
  const { t } = useAppTranslation();

  const { fullnameOption, handleOpenUserDetails, users } =
    useCongregationPersons();

  return (
    <CardSection>
      <CardSectionHeader
        title={t('tr_congregationPersons')}
        description={t('tr_congregationPersonsDesc')}
      />
      <CardSectionContent sx={{ gap: '24px' }}>
      {isLoading && <WaitingLoader size={56} variant="standard" />}

      {!isLoading && users.length === 0 && (
        <EmptyStateRow>
          <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
          <Typography className="body-small-regular" color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
            {t('tr_noUsersAdded')}
          </Typography>
        </EmptyStateRow>
      )}

      {!isLoading && users.length > 0 && (
        <UserListContainer>
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
        </UserListContainer>
      )}
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationPersons;

