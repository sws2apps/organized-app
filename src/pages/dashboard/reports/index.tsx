import { ListItem } from '@mui/material';
import {
  IconPublisherRecordCard,
  IconPublishersReports,
  IconReportToBranch,
  IconVisitors,
} from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const ReportsCard = () => {
  const { t } = useAppTranslation();

  const { isAttendanceEditor, isSecretary, isGroupOverseer, isElder } =
    useCurrentUser();

  return (
    <DashboardCard header={t('tr_reports')}>
      {isAttendanceEditor && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconVisitors color="var(--black)" />}
            primaryText={t('tr_meetingAttendanceRecord')}
            path="/reports/meeting-attendance"
          />
        </ListItem>
      )}

      {(isSecretary || isGroupOverseer) && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconPublishersReports color="var(--black)" />}
            primaryText={t('tr_fieldServiceReports')}
            path="/reports/field-service"
          />
        </ListItem>
      )}

      {isSecretary && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconReportToBranch color="var(--black)" />}
            primaryText={t('tr_branchOfficeReport')}
            path="/reports/branch-office"
          />
        </ListItem>
      )}

      {isElder && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconPublisherRecordCard color="var(--black)" />}
            primaryText={t('tr_publishersRecords')}
            path="/publisher-records"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default ReportsCard;
