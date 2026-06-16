import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ProfileItemContainer } from '../index.styles';
import useCurrentUser from '@hooks/useCurrentUser';
import useUserProfileDetails from './useUserProfileDetails';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import ProfilePicture from '@components/profile_picture';
import { IconImage } from '@icons/index';
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
          <Box
            onClick={handleOpenSelector}
            role="button"
            tabIndex={0}
            aria-label={t('tr_profilePicture')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenSelector();
              }
            }}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              '&:hover .change-photo-hover': {
                opacity: 1,
              },
            }}
          >
            <ProfilePicture size={tabletDown ? 44 : 48} />
            {/* Base gradient — always visible */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 75%)',
                pointerEvents: 'none',
              }}
            />
            {/* Hover gradient — fades in on top */}
            <Box
              className="change-photo-hover"
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 100%)',
                opacity: 0,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
              }}
            />
            {/* Icon — always on top of both gradients */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <IconImage
                color="var(--always-white)"
                width={16}
                height={16}
                sx={{ marginBottom: '6px' }}
              />
            </Box>
          </Box>

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
