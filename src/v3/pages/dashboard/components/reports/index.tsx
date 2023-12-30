import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconPublishersReports, IconReportToBranch, IconVisitors } from '@icons';
import { useAppTranslation } from '@hooks/index';

const ReportsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('trans_reports')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconVisitors color="var(--black)" />} primaryText={t('trans_meetingAttendanceRecord')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconPublishersReports color="var(--black)" />}
          primaryText={t('trans_fieldServiceReports')}
        />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconReportToBranch color="var(--black)" />} primaryText={t('trans_branchOfficeReport')} />
      </ListItem>
    </DashboardCard>
  );
};

export default ReportsCard;
