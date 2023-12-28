import { Box } from '@mui/material';
import { Typography } from '@components';
import { IconBrother, IconPublishers } from '@icons';
import AccountType from './components/AccountType';
import { useAppTranslation } from '@hooks';
import useAccountChooser from './useAccountChooser';

const AccountChooser = () => {
  const { t } = useAppTranslation();

  const { handleChoosePocket, handleChooseVIP } = useAccountChooser();

  return (
    <Box>
      <Typography variant="h1" color="var(--black)" sx={{ marginBottom: '16px' }}>
        {t('welcomeCPE')}
      </Typography>
      <Typography variant="body-regular" color="var(--grey-400)" sx={{ marginBottom: '32px' }}>
        {t('selectAccount')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AccountType
          startIcon={<IconPublishers width={32} height={32} color="var(--accent-400)" />}
          text={t('accountPublisherStudent')}
          onClick={handleChoosePocket}
        />
        <AccountType
          startIcon={<IconBrother width={32} height={32} color="var(--accent-400)" />}
          text={t('accountBaptizedBrother')}
          onClick={handleChooseVIP}
        />
      </Box>
    </Box>
  );
};

export default AccountChooser;
