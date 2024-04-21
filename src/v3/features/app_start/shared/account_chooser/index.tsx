import { Box, Link } from '@mui/material';
import { IconBrother, IconPublishers, IconTest } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import AccountType from './components/AccountType';
import Button from '@components/button';
import Typography from '@components/typography';
import useAccountChooser from './useAccountChooser';

const AccountChooser = () => {
  const { t } = useAppTranslation();

  const { handleChoosePocket, handleChooseVIP } = useAccountChooser();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Typography className="h1" color="var(--black)" sx={{ marginBottom: '16px' }}>
          {t('tr_welcomeApp')}
        </Typography>
        <Typography className="body-regular" color="var(--grey-400)" sx={{ marginBottom: '32px' }}>
          {t('tr_selectAccount')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AccountType
            startIcon={<IconPublishers width={32} height={32} color="var(--accent-400)" />}
            text={t('tr_accountPublisherStudent')}
            onClick={handleChoosePocket}
          />
          <AccountType
            startIcon={<IconBrother width={32} height={32} color="var(--accent-400)" />}
            text={t('tr_accountBaptizedBrother')}
            onClick={handleChooseVIP}
          />
        </Box>
      </Box>

      <Button variant="secondary" startIcon={<IconTest />}>
        <Link
          href="https://test.organized-app.com"
          target="_blank"
          rel="noopener"
          sx={{ color: 'unset' }}
          underline="none"
        >
          {t('tr_tryOrganized')}
        </Link>
      </Button>
    </Box>
  );
};

export default AccountChooser;
