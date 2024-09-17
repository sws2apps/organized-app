import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import APApplicationForm from '@features/ministry/ap_application/form';
import PageTitle from '@components/page_title';

const AuxiliaryPioneer = () => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_applicationAuxiliaryPioneer')} />

      <APApplicationForm />
    </Box>
  );
};

export default AuxiliaryPioneer;
