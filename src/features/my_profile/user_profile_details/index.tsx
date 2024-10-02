import { Box } from '@mui/material';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import useUserProfileDetails from './useUserProfileDetails';
import { ProfileItemContainer } from '../index.styles';

const UserProfileDetails = () => {
  const { t } = useAppTranslation();

  const {
    tabletDown,
    firstNameTmp,
    handleChangeFirstName,
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
            flexWrap: tabletDown ? 'wrap' : 'nowrap',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <TextField
            label={t('tr_firstname')}
            height={48}
            value={firstNameTmp}
            onChange={(e) => handleChangeFirstName(e.target.value)}
          />
          <TextField
            label={t('tr_lastname')}
            height={48}
            value={lastNameTmp}
            onChange={(e) => handleChangeLastName(e.target.value)}
          />
        </Box>
        {isConnected && (
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
