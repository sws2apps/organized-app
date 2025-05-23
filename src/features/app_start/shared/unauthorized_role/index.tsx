import { Box } from '@mui/material';
import { IconRefresh } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import useUnauthorizedRole from './useUnauthorizedRole';
import PermissionErrorImg from '@assets/img/permission-error-illustration.svg?component';

const UnauthorizedRole = () => {
  const { t } = useAppTranslation();

  const { reloadApp, anchorRef } = useUnauthorizedRole();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: '702px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexDirection: { mobile: 'column', tablet: 'row' },
        }}
      >
        <Box sx={{ width: '200px', height: 'auto' }}>
          <PermissionErrorImg />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <Typography className="h1">{t('tr_unauthorizedAccount')}</Typography>
          <TextMarkup
            content={t('tr_unauthorizedRole')}
            className="body-regular"
            color="var(--grey-400)"
            anchorClassName="h4"
            anchorColor="var(--accent-dark)"
            anchorRef={anchorRef}
          />
          <Button
            variant="main"
            className="button-caps"
            onClick={reloadApp}
            startIcon={<IconRefresh />}
          >
            {t('tr_refreshPage')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UnauthorizedRole;
