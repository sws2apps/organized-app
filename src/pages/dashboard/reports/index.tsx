import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import {
  IconPublisherRecordCard,
  IconPublishersReports,
  IconReportToBranch,
  IconVisitors,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';

const ReportsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('tr_reports')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconVisitors color="var(--black)" />}
          primaryText={t('tr_meetingAttendanceRecord')}
          path="/reports/meeting-attendance"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconPublishersReports color="var(--black)" />}
          primaryText={t('tr_fieldServiceReports')}
          path="/reports/field-service"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconReportToBranch color="var(--black)" />}
          primaryText={t('tr_branchOfficeReport')}
          path="/reports/branch-office"
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconPublisherRecordCard color="var(--black)" />}
          primaryText={t('tr_publishersRecords')}
          path="/publisher-records"
        />
      </ListItem>
    </DashboardCard>
  );
};

export default ReportsCard;
