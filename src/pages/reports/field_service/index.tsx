import { Box } from '@mui/material';
import { IconPrepareReport } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import PersonsList from '@features/reports/field_service/persons_list';
import ReportDetails from '@features/reports/field_service/report_details';
import SelectorStats from '@features/reports/field_service/selector_stats';

const FieldService = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle
        title={t('tr_fieldServiceReports')}
        buttons={
          <Button startIcon={<IconPrepareReport />}>{t('tr_createS1')}</Button>
        }
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
          alignItems: desktopUp ? 'flex-start' : 'stretch',
          '& > .MuiBox-root': {
            width: desktopUp ? '50%' : '100%',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SelectorStats />
          <PersonsList />
        </Box>

        <ReportDetails />
      </Box>
    </Box>
  );
};

export default FieldService;
