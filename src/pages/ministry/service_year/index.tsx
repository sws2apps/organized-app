import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PageTitle from '@components/page_title';
import ServiceYearContainer from '@features/ministry/service_year';

const ServiceYear = () => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="16px">
      <PageTitle title={t('tr_serviceYear')} />

      <ServiceYearContainer />
    </Stack>
  );
};

export default ServiceYear;
