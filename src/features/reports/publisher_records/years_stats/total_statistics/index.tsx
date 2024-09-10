import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { TotalStatisticsProps } from './index.types';
import useTotalStatistics from './useTotalStatistics';
import Accordion from '@components/accordion';
import Divider from '@components/divider';
import SectionTitle from '../section_title';
import StatsRow from '@features/reports/stats_row';
import Typography from '@components/typography';
import { IconExpand } from '@components/icons';

const AccordionLabel = ({ label, value }: { label: string; value: number }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Typography color="var(--grey-400)">{label}</Typography>
        <IconExpand
          width={20}
          height={20}
          color="var(--black)"
          sx={{
            '.Mui-expanded &': {
              transform: 'rotate(180deg)',
            },
            transition: 'transform 0.3s',
          }}
        />
      </Box>
      <Typography className="h4" color="var(--grey-400)">
        {value}
      </Typography>
    </Box>
  );
};

const TotalStatistics = (props: TotalStatisticsProps) => {
  const { t } = useAppTranslation();

  const { statistics, expanded, handleExpandedChange } =
    useTotalStatistics(props);

  return (
    <Stack spacing="8px">
      <SectionTitle>{t('tr_totalStats')}</SectionTitle>

      <Stack padding="4px 8px" divider={<Divider color="var(--accent-200)" />}>
        {statistics.map((stats) => (
          <Accordion
            key={stats.id}
            id={stats.id}
            label={<AccordionLabel label={stats.label} value={stats.value} />}
            expanded={expanded === stats.id}
            summaryProps={{
              expandIcon: null,
              sx: {
                '.MuiAccordionSummary-content': {
                  margin: '8px 0px !important',
                },
              },
            }}
            detailsProps={{ sx: { padding: 'unset' } }}
            onChange={handleExpandedChange}
          >
            <Divider color="var(--accent-200)" />
            <Stack divider={<Divider color="var(--accent-200)" />}>
              {stats.reports.map((report) => (
                <StatsRow
                  key={report.label}
                  title={report.label}
                  value={report.value}
                  color="var(--grey-400)"
                  colorValue
                  sx={{ padding: '8px 0px 8px 16px' }}
                />
              ))}
            </Stack>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
};

export default TotalStatistics;
