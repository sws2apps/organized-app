import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PageTitle from '@components/page_title';
import SubmitApplication from '@features/ministry/ap_application/submit_application';
import UserApplicationForm from '@features/ministry/ap_application/main_form';

const AuxiliaryPioneer = () => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_applicationAuxiliaryPioneer')}
        buttons={<SubmitApplication />}
      />

      <UserApplicationForm />
    </Box>
  );
};

export default AuxiliaryPioneer;
