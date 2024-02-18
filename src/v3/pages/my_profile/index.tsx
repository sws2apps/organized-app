import { Box } from '@mui/material';
import { PageTitle } from '@components';
import { useAppTranslation } from '@hooks/index';

const MyProfile = () => {
  const { t } = useAppTranslation();

  return (
    <Box>
      <PageTitle title={t('tr_myProfile')} backTo="/" />
    </Box>
  );
};

export default MyProfile;
