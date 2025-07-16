import { Box, Link } from '@mui/material';
import { IconTalk, IconBigGroup, IconTest } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useAccountChooser from './useAccountChooser';
import AccountType from './account_type';
import Button from '@components/button';
import Markup from '@components/text_markup';
import Typography from '@components/typography';

const AccountChooser = () => {
  const { t } = useAppTranslation();

  const { handleChoosePocket, handleChooseVIP } = useAccountChooser();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '24px',
      }}
    >
      <Box>
        <Typography
          className="h1"
          color="var(--black)"
          sx={{ marginBottom: '16px' }}
        >
          {t('tr_welcomeApp')}
        </Typography>
        <Typography
          className="body-regular"
          color="var(--grey-400)"
          sx={{ marginBottom: '32px' }}
        >
          {t('tr_selectAccount')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AccountType
            startIcon={
              <IconTalk width={32} height={32} color="var(--accent-400)" />
            }
            text={t('tr_accountBaptizedBrother')}
            subtitle={t('tr_baptizedBrotherDesc')}
            onClick={handleChooseVIP}
          />
          <AccountType
            startIcon={
              <IconBigGroup width={32} height={32} color="var(--accent-400)" />
            }
            text={t('tr_accountPublisherStudent')}
            subtitle={t('tr_otherInCongDesc')}
            onClick={handleChoosePocket}
          />
        </Box>

        <Box sx={{ marginTop: { mobile: '16px', laptop: '32px' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="secondary"
              startIcon={<IconTest />}
              sx={{
                justifyContent: 'center',
              }}
            >
              <Link
                href="https://test.organized-app.com"
                target="_blank"
                tabIndex={-1}
                rel="noopener"
                sx={{
                  color: 'unset',
                  '&:focus-visible': {
                    outline: 'none',
                  },
                }}
                underline="none"
              >
                {t('tr_tryOrganized')}
              </Link>
            </Button>
          </Box>
        </Box>
      </Box>

      <Markup
        content={t('tr_oauthAccept')}
        className="body-small-regular"
        color="var(--grey-400)"
      />
    </Box>
  );
};

export default AccountChooser;
