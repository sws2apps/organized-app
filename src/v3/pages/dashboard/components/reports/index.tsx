import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconPublishersReports, IconReportToBranch, IconVisitors } from '@icons/index';
import { useAppTranslation } from '@hooks/index';

const ReportsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('tr_reports')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconVisitors color="var(--black)" />} primaryText={t('tr_meetingAttendanceRecord')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconPublishersReports color="var(--black)" />}
          primaryText={t('tr_fieldServiceReports')}
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconReportToBranch color="var(--black)" />} primaryText={t('tr_branchOfficeReport')} />
      </ListItem>
    </DashboardCard>
  );
};

export default ReportsCard;
