import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  YearDetailsProps,
  PeriodOption,
  PublisherGroupOption,
} from './index.types';
import useYearDetails from './useYearDetails';
import AuxiliaryPioneers from '../auxiliary_pioneers';
import FulltimeServants from '../fulltime_servants';
import Publishers from '../publishers';
import TotalStatistics from '../total_statistics';
import useFieldServiceGroups from '@features/congregation/field_service_groups/useFieldServiceGroups';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';
import { buildServiceYearsList } from '@utils/date';

const YearDetails = (props: YearDetailsProps) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();
  const {
    year,
    publisherGroup,
    period,
    handlePublisherGroupChange,
    handlePeriodChange,
  } = useYearDetails(props);
  const { groups_list } = useFieldServiceGroups();

  // Publisher group options
  const publisherGroupOptions: PublisherGroupOption[] = [
    { label: t('tr_allPublishers'), value: 'all' },
    ...groups_list.map((g) => ({
      label:
        g.group.group_data.name && g.group.group_data.name.length > 0
          ? g.group.group_data.name
          : t('tr_groupNumber', {
              groupNumber: g.group.group_data.sort_index + 1,
            }),
      value: g.group.group_id,
    })),
  ];

  // Build period options for the selected year
  const serviceYears = buildServiceYearsList();
  const yearObj = serviceYears.find((y) => y.year === year);
  const months = yearObj ? yearObj.months : [];

  // Period options: Service year + months
  const periodOptions: PeriodOption[] = [
    { label: t('tr_serviceYear'), value: 'serviceYear' },
    ...months.map((m) => ({ label: m.label, value: m.value })),
  ];

  return (
    <Stack spacing="16px" marginBottom="-24px">
      <Stack
        direction={laptopUp ? 'row' : 'column'}
        spacing="24px"
        alignItems={laptopUp ? 'center' : 'stretch'}
        justifyContent="space-between"
      >
        <Box sx={{ flex: 1 }}>
          <Select
            label={t('tr_publishers')}
            value={publisherGroup}
            onChange={(e) =>
              handlePublisherGroupChange(e.target.value as string)
            }
            sx={{ minWidth: 180, marginRight: 2 }}
          >
            {publisherGroupOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Select
            label={t('tr_period')}
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as string)}
            sx={{ minWidth: 180 }}
            renderValue={(selected) => {
              const found = periodOptions.find((o) => o.value === selected);
              return found ? found.label : '';
            }}
          >
            {/* Section: Whole year */}
            <Typography
              sx={{
                px: 2,
                py: 1,
                color: 'var(--accent-main)',
                fontWeight: 600,
              }}
            >
              {t('tr_wholeYear')}
            </Typography>
            <MenuItem value="serviceYear">{t('tr_serviceYear')}</MenuItem>
            {/* Section: Months */}
            <Typography
              sx={{
                px: 2,
                py: 1,
                color: 'var(--accent-main)',
                fontWeight: 600,
              }}
            >
              {t('tr_months')}
            </Typography>
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
      <FulltimeServants
        year={year}
        month={''}
        wholeYear={period === 'serviceYear'}
        publisherGroup={publisherGroup}
        period={period}
      />
      <AuxiliaryPioneers
        year={year}
        month={''}
        wholeYear={period === 'serviceYear'}
        publisherGroup={publisherGroup}
        period={period}
      />
      <Publishers
        year={year}
        month={''}
        wholeYear={period === 'serviceYear'}
        publisherGroup={publisherGroup}
        period={period}
      />
      <TotalStatistics
        year={year}
        publisherGroup={publisherGroup}
        period={period}
      />
    </Stack>
  );
};

export default YearDetails;
