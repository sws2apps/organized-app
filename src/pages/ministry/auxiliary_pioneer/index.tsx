import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import PageTitle from '@components/page_title';
import SubmitApplication from '@features/ministry/ap_application/submit_application';
import UserApplicationForm from '@features/ministry/ap_application/main_form';

const AuxiliaryPioneer = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={t('tr_applicationAuxiliaryPioneer')}
        buttons={<SubmitApplication />}
      />

      <UserApplicationForm />
    </Box>
  );
};

export default AuxiliaryPioneer;
