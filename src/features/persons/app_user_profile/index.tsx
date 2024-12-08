import { Box } from '@mui/material';
import usePersonAppPersonProfile from './useAppUserProfile';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import { IconAddPerson, IconArrowLink } from '@components/icons';

const PersonAppUserProfile = () => {
  const { t } = useAppTranslation();
  const {
    userIsRegistered,
    getTextForAppPersonProfileDesc,
    navigateToManageAccess,
  } = usePersonAppPersonProfile();

  getTextForAppPersonProfileDesc();

  return (
    <Box
      sx={{
        padding: '16px',
        gap: '16px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: userIsRegistered
          ? 'var(--white)'
          : 'var(--accent-150)',
        border: `1px ${userIsRegistered ? 'solid' : 'dashed'} var(--accent-300)`,
      }}
    >
      <Box
        sx={{
          gap: '12px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography className="h2" color="var(--black)">
          {t('tr_appUserProfile')}
        </Typography>
        <Typography
          className="body-regular"
          color="var(--black)"
          dangerouslySetInnerHTML={{ __html: getTextForAppPersonProfileDesc() }}
        ></Typography>
      </Box>
      <Button
        startIcon={userIsRegistered ? <IconArrowLink /> : <IconAddPerson />}
        variant="small"
        sx={{ width: 'fit-content' }}
        onClick={() => navigateToManageAccess()}
      >
        {userIsRegistered
          ? t('tr_manageUserProfileSettings')
          : t('tr_createUserProfile')}
      </Button>
    </Box>
  );
};

export default PersonAppUserProfile;
