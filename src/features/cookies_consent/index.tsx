import { Box, Popper } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { CookiesConsentProps } from './index.types';
import useCookiesConsent from './useCookiesConsent';
import Button from '@components/button';
import Markup from '@components/text_markup';

const CookiesConsent = ({ open }: CookiesConsentProps) => {
  const { t } = useAppTranslation();

  const { handleReject, handleConsent } = useCookiesConsent();

  return (
    <Popper
      open={open}
      disablePortal={false}
      anchorEl={() => document.querySelector('body')}
      sx={{
        position: 'fixed !important',
        inset: '0 !important',
        transform: 'none !important',
        margin: 'unset !important',
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          marginLeft: '24px',
          backgroundColor: 'var(--white)',
          boxShadow: 'var(--pop-up-shadow)',
          borderRadius: 'var(--radius-xxl)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '500px',
        }}
      >
        <Markup
          className="body-regular"
          anchorClassName="h4"
          content={t('tr_cookiesNotice')}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <Button variant="main" color="red" onClick={handleReject}>
            {t('tr_reject')}
          </Button>
          <Button variant="main" onClick={handleConsent}>
            {t('tr_accept')}
          </Button>
        </Box>
      </Box>
    </Popper>
  );
};

export default CookiesConsent;
