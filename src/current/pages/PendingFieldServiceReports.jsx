import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { pendingFieldServiceReportsState } from '../states/report';
import { UserPendingS4Report } from '../features/pendingFieldServiceReports';

const PendingFieldServiceReports = () => {
  const { t } = useTranslation('ui');

  const pendingFieldServiceReports = useRecoilValue(pendingFieldServiceReportsState);

  return (
    <Box>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
        {t('pendingFieldServiceReports')}
      </Typography>

      <Box sx={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {pendingFieldServiceReports?.map((report) => (
          <UserPendingS4Report key={report.report_uid} report={report} />
        ))}
      </Box>
    </Box>
  );
};

export default PendingFieldServiceReports;
