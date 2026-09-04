import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ProfileItemContainer } from '../index.styles';
import useCurrentUser from '@hooks/useCurrentUser';
import useUserProfileDetails from './useUserProfileDetails';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const UserProfileDetails = () => {
  const { t } = useAppTranslation();

  const { accountType } = useCurrentUser();

  const {
    firstNameTmp,
    handleChangeFirstName,
    middleNameTmp,
    handleChangeMiddleName,
    handleChangeLastName,
    lastNameTmp,
    userEmail,
    isConnected,
  } = useUserProfileDetails();

  return (
    <ProfileItemContainer>
      <Typography className="h2">{t('tr_name')}</Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <TextField
            label={t('tr_firstname')}
            height={48}
            value={firstNameTmp}
            onChange={(e) => handleChangeFirstName(e.target.value)}
            sx={{ flex: '1 0 200px' }}
          />
          <TextField
            label={t('tr_middlename')}
            height={48}
            value={middleNameTmp}
            onChange={(e) => handleChangeMiddleName(e.target.value)}
            sx={{ flex: '1 0 200px' }}
          />
          <TextField
            label={t('tr_lastname')}
            height={48}
            value={lastNameTmp}
            onChange={(e) => handleChangeLastName(e.target.value)}
            sx={{ flex: '1 0 200px' }}
          />
        </Box>
        {isConnected && accountType === 'vip' && (
          <TextField
            label={t('tr_emailAddress')}
            value={userEmail}
            slotProps={{ input: { readOnly: true } }}
            helperText={
              <Typography
                className="label-small-regular"
                color="var(--grey-350)"
              >
                {t('tr_emailAddressDesc')}
              </Typography>
            }
          />
        )}
      </Box>
    </ProfileItemContainer>
  );
};

export default UserProfileDetails;
