import { Stack } from '@mui/material';
import { MonthlyReportProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useMonthlyReport from './useMonthlyReport';
import Card from '@components/card';
import Divider from '@components/divider';
import InfoNote from '@components/info_note';
import StatsRow from '@features/reports/stats_row';
import Typography from '@components/typography';

const MonthlyReport = (props: MonthlyReportProps) => {
  const { t } = useAppTranslation();

  const { monthname, generated, month_overview, field_reports } =
    useMonthlyReport(props);

  return (
    <>
      <Card>
        <Typography className="h2">{monthname}</Typography>

        {!generated && <InfoNote message={t('tr_branchOfficeReportMonthsDesc')} />}

        {generated && (
          <Stack spacing="4px" divider={<Divider color="var(--accent-200)" />}>
            {month_overview.map((report) => (
              <StatsRow
                key={report.label}
                title={report.label}
                value={report.value}
              />
            ))}
          </Stack>
        )}
      </Card>

      {generated && (
        <Card>
          <Typography className="h2">{t('tr_fieldService')}</Typography>

          {field_reports.map((section) => (
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
                    sx={{ padding: '8px' }}
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </Card>
      )}
    </>
  );
};

export default MonthlyReport;
