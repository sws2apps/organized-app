import { Box } from '@mui/material';
import { IconRefresh } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import useUnsupportedBrowser from './useUnsupportedBrowser';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import UnsupportedBrowserImg from '@assets/img/unsupported-browser-illustration.svg?component';

const UnsupportedBrowser = () => {
  const { t } = useAppTranslation();

  const { reloadApp } = useUnsupportedBrowser();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 48,
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '1440px',
        paddingLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
        paddingRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
      }}
    >
      <Box
        sx={{
          maxWidth: '800px',
          display: 'flex',
          gap: '48px',
          alignItems: 'center',
          flexDirection: { mobile: 'column', tablet: 'row' },
        }}
      >
        <Box sx={{ width: '200px', height: 'auto' }}>
          <UnsupportedBrowserImg />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <Typography className="h1">
            {getMessageByCode('error_app_unsupported-browser-title')}
          </Typography>
          <TextMarkup
            content={getMessageByCode('error_app_unsupported-browser-desc')}
            className="body-regular"
            color="var(--grey-400)"
            anchorClassName="h4"
            anchorColor="var(--accent-dark)"
          />
          <Button
            variant="main"
            className="button-caps"
            onClick={reloadApp}
            startIcon={<IconRefresh />}
            sx={{ width: { mobile: '100%', tablet: 'fit-content' } }}
          >
            {t('tr_refreshPage')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UnsupportedBrowser;
