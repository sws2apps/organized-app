import { Box } from '@mui/material';
import { buildPersonFullname } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import { UsersListType } from '../index.types';
import useCongregationPersons from './useCongregationPersons';
import { IconInfo } from '@components/icons';
import UserAccountItem from '@components/user_account_item';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';
import { CardSection, CardSectionHeader, CardSectionContent } from '../../settings/shared_styles';

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
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
          <Typography className="body-small-regular" color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
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
      </CardSectionContent>
    </CardSection>
  );
};

export default CongregationPersons;
