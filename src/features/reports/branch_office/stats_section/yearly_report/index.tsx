import { Box, Stack } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { YearlyReportProps } from './index.types';
import useYearlyReport from './useYearlyReport';
import Card from '@components/card';
import Divider from '@components/divider';
import StatsRow from '@features/reports/stats_row';
import Typography from '@components/typography';

const YearlyReport = (props: YearlyReportProps) => {
  const { t } = useAppTranslation();

  const { generated, analysis_reports, congregation } = useYearlyReport(props);

  return (
    <Card>
      {!generated && (
        <Typography color="var(--grey-350)">
          <Box
            component="span"
            sx={{
              verticalAlign: '-6px',
              display: 'inline-flex',
              marginRight: '4px',
            }}
          >
            <IconInfo color="var(--grey-350)" />
          </Box>
          {t('tr_S10ReportNotGenerated')}
        </Typography>
      )}

      {generated && (
        <>
          <Stack spacing="8px">
            <Typography className="h2">
              {t('tr_S10ReportWithYear', { year: props.year })}
            </Typography>
            <Typography className="h4" color="var(--grey-400)">
              {congregation}
            </Typography>
          </Stack>

          {analysis_reports.map((section) => (
            <Stack
              key={section.section}
              spacing="4px"
              borderRadius="var(--radius-l)"
            >
              <Typography
                className="h4"
                color="var(--accent-dark)"
                sx={{
                  borderRadius: 'var(--radius-s)',
                  padding: '4px 8px',
                  backgroundColor: 'var(--accent-150)',
                }}
              >
                {section.section}
              </Typography>

              <Stack divider={<Divider color="var(--accent-200)" />}>
                {section.reports.map((report) => (
                  <StatsRow
                    key={report.label}
                    title={report.label}
                    value={report.value}
                    color="var(--grey-400)"
                    sx={{ padding: '8px' }}
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </>
      )}
    </Card>
  );
};

export default YearlyReport;
