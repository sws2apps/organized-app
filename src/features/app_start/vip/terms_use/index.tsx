import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useTermsUse from './useTermsUse';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '../../../../components/dialog';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';

const TermsUse = () => {
  const { t } = useAppTranslation();

  const {
    handleTermsUse,
    readComplete,
    setReadComplete,
    handleRejectTerms,
    cookiesConsent,
  } = useTermsUse();

  return (
    <Dialog open={!cookiesConsent} onClose={null}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <Typography className="h1">
          {t('tr_appFunctionalityDataPrivacy')}
        </Typography>

        <TextMarkup className="body-regular" content={t('tr_appIntro')} />

        <Box
          sx={{
            backgroundColor: 'var(--orange-secondary)',
            borderRadius: 'var(--radius-s)',
            padding: '16px',
          }}
        >
          <TextMarkup
            color="var(--orange-dark)"
            className="body-regular"
            content={t('tr_clearBrowserData')}
          />
        </Box>

        <Typography className="h3">{t('tr_privacySecurityTitle')}</Typography>

        <TextMarkup
          className="body-regular"
          anchorClassName="h4"
          content={t('tr_privacySecurityDesc')}
        />

        <Typography className="h3">{t('tr_dataManagementTitle')}</Typography>

        <TextMarkup
          className="body-regular"
          anchorClassName="h4"
          content={t('tr_dataManagementDesc')}
        />

        <Checkbox
          checked={readComplete}
          onChange={(e) => setReadComplete(e.target.checked)}
          label={
            <TextMarkup
              className="body-regular"
              anchorClassName="h4"
              content={t('tr_readComplete')}
            />
          }
        />

        <Stack spacing="8px" width="100%">
          <Button
            variant="main"
            disabled={!readComplete}
            onClick={handleTermsUse}
            sx={{ flex: 1 }}
          >
            {t('tr_next')}
          </Button>

          <Button
            variant="secondary"
            onClick={handleRejectTerms}
            sx={{ flex: 1 }}
          >
            {t('tr_cancel')}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default TermsUse;
