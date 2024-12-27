import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ReportDetailsProps } from './index.types';
import useReportDetails from './useReportDetails';
import BibleStudies from './bible_studies';
import Comments from './comments';
import CreditField from './credit_field';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import Button from '@components/button';
import HoursField from './hours_field';
import LateReport from './late_report';
import MinistryShared from './ministry_shared';
import Typography from '@components/typography';

const ReportDetails = (props: ReportDetailsProps) => {
  const { t } = useAppTranslation();

  const { reportMonth, hoursEnabled, creditEnabled, handleSaveReport } =
    useReportDetails(props);

  return (
    <Dialog open={props.open} onClose={props.onClose} sx={{ padding: '24px' }}>
      <Typography className="h2">
        {t('tr_fieldReportEdit')} ({reportMonth})
      </Typography>

      <Stack spacing="8px" width="100%">
        <LateReport />

        <Stack spacing="24px" divider={<Divider color="var(--accent-200)" />}>
          {hoursEnabled && (
            <Stack
              spacing="24px"
              divider={<Divider dashed color="var(--accent-200)" />}
            >
              <HoursField />

              {creditEnabled && <CreditField />}
            </Stack>
          )}

          {!hoursEnabled && <MinistryShared />}

          <BibleStudies />
        </Stack>
      </Stack>

      <Comments />

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={handleSaveReport}>
          {t('tr_save')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default ReportDetails;
