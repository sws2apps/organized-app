import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import useBranchOfficeContainer from './useBranchOffice';
import ReportSection from './report_section';
import StatsSection from './stats_section';

const BranchOfficeContainer = () => {
  const { desktopUp } = useBreakpoints();

  const {
    handleReportChange,
    report,
    handleMonthChange,
    handleYearChange,
    month,
    year,
  } = useBranchOfficeContainer();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: desktopUp ? 'row' : 'column',
        alignItems: desktopUp ? 'flex-start' : 'stretch',
      }}
    >
      <ReportSection
        report={report}
        onReportChange={handleReportChange}
        year={year}
        onYearChange={handleYearChange}
        month={month}
        onMonthChange={handleMonthChange}
      />

      <StatsSection report={report} year={year} month={month} />
    </Box>
  );
};

export default BranchOfficeContainer;
