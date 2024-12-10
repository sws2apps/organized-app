import { Box } from '@mui/material';
import { IconAddPerson, IconArrowLink } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useAppUserProfile from './useAppUserProfile';
import Button from '@components/button';
import Typography from '@components/typography';
import Markup from '@components/text_markup';

const PersonAppUserProfile = () => {
  const { t } = useAppTranslation();

  const { navigateToManageAccess, userDescription, user } = useAppUserProfile();

  return (
    <Box
      sx={{
        padding: '16px',
        gap: '16px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: user ? 'var(--white)' : 'var(--accent-150)',
        border: `1px ${user ? 'solid' : 'dashed'} var(--accent-300)`,
      }}
    >
      <Box
        sx={{
          gap: '12px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography className="h2">{t('tr_appUserProfile')}</Typography>

        <Markup className="body-regular" content={userDescription} />
      </Box>
      <Button
        startIcon={user ? <IconArrowLink /> : <IconAddPerson />}
        variant="small"
        sx={{ width: 'fit-content', height: '32px', minHeight: '32px' }}
        onClick={() => navigateToManageAccess()}
      >
        {user ? t('tr_manageUserProfileSettings') : t('tr_createUserProfile')}
      </Button>
    </Box>
  );
};

export default PersonAppUserProfile;
