import { Box, Link } from '@mui/material';
import { IconTest, IconCongregationAccess, IconEmailLogin } from '@icons/index';
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
              <IconEmailLogin
                width={32}
                height={32}
                color="var(--accent-400)"
              />
            }
            text={t('tr_loginWithEmail')}
            subtitle={t('tr_loginWithEmailDesc')}
            onClick={handleChooseVIP}
          />
          <AccountType
            startIcon={
              <IconCongregationAccess
                width={32}
                height={32}
                color="var(--accent-400)"
              />
            }
            text={t('tr_loginWithCode')}
            subtitle={t('tr_loginWithCodeDesc')}
            onClick={handleChoosePocket}
          />
        </Box>

        <Box sx={{ marginTop: { mobile: '16px', laptop: '32px' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              href="https://test.organized-app.com"
              target="_blank"
              rel="noopener"
              underline="none"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              <Button
                variant="secondary"
                startIcon={<IconTest />}
                sx={{
                  justifyContent: 'center',
                }}
              >
                {t('tr_tryOrganized')}
              </Button>
            </Link>
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
