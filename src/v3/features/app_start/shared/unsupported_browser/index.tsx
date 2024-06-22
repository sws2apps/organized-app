import { Box } from '@mui/material';
import { IconRefresh } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import useUnsupportedBrowser from './useUnsupportedBrowser';
import UnsupportedBrowserImg from '@assets/img/unsupported-browser-illustration.svg?component';

const UnsupportedBrowser = () => {
  const { t } = useAppTranslation();

  const { reloadApp, anchorRef } = useUnsupportedBrowser();

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
          maxWidth: '800px',
          display: 'flex',
          gap: '48px',
          alignItems: 'center',
          flexDirection: { mobile: 'column' },
        }}
      >
        <UnsupportedBrowserImg />
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <Typography className="h1">{t('tr_unsupportedBrowserError')}</Typography>
          <TextMarkup
            content={t('tr_unsupportedBrowserErrorDesc')}
            className="body-regular"
            color="var(--grey-400)"
            anchorClassName="h4"
            anchorColor="var(--accent-dark)"
            anchorRef={anchorRef}
          />
          <Button variant="main" className="button-caps" onClick={reloadApp} startIcon={<IconRefresh />}>
            {t('tr_refreshPage')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UnsupportedBrowser;
