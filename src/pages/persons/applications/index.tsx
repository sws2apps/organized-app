import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PageTitle from '@components/page_title';
import PersonApplications from '@features/persons/applications';

const Applications = () => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="16px">
      <PageTitle title={t('tr_APApps')} />

      <PersonApplications />
    </Stack>
  );
};

export default Applications;
