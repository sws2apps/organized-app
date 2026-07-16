import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PageTitle from '@components/page_title';

const PublicWitnessing = () => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="16px">
      <PageTitle title={t('tr_PW')} />
    </Stack>
  );
};

export default PublicWitnessing;
