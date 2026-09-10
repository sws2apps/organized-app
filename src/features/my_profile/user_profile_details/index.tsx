import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ProfileItemContainer } from '../index.styles';
import useCurrentUser from '@hooks/useCurrentUser';
import useUserProfileDetails from './useUserProfileDetails';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import ProfilePictureEntry from './profile_picture_entry';
import ProfilePictureSelector from './profile_picture_selector';

const UserProfileDetails = () => {
  const { t } = useAppTranslation();

  const { accountType } = useCurrentUser();

  const {
    tabletDown,
    firstNameTmp,
    handleChangeFirstName,
    handleChangeLastName,
    lastNameTmp,
    userEmail,
    isConnected,
    isOpenSelector,
    handleOpenSelector,
    handleCloseSelector,
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
            justifyContent: 'flex-start',
            alignItems: tabletDown ? 'flex-start' : 'center',
            flexDirection: 'row',
          }}
        >
          <ProfilePictureEntry
            size={tabletDown ? 44 : 48}
            onOpen={handleOpenSelector}
          />
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              flex: 1,
              flexDirection: tabletDown ? 'column' : 'row',
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

      {isOpenSelector && (
        <ProfilePictureSelector
          open={isOpenSelector}
          onClose={handleCloseSelector}
        />
      )}
    </ProfileItemContainer>
  );
};

export default UserProfileDetails;
