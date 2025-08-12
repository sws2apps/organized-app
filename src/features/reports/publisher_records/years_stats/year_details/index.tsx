import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { YearDetailsProps, PeriodOption } from './index.types';
import useYearDetails from './useYearDetails';
import AuxiliaryPioneers from '../auxiliary_pioneers';
import FulltimeServants from '../fulltime_servants';
import Publishers from '../publishers';
import TotalStatistics from '../total_statistics';
import useFieldServiceGroups from '@features/congregation/field_service_groups/useFieldServiceGroups';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import MenuSubHeader from '@components/menu_sub_header';
import Typography from '@components/typography';
import { buildServiceYearsList } from '@utils/date';

const YearDetails = (props: YearDetailsProps) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();
  const { year } = props;
  const { groups_list } = useFieldServiceGroups();

  // Build period options for the selected year
  const serviceYears = buildServiceYearsList();
  const yearObj = serviceYears.find((y) => y.year === year);
  const months = yearObj ? yearObj.months : [];

  // Period options: Service year + months
  const periodOptions: PeriodOption[] = [
    { label: t('tr_serviceYear'), value: 'serviceYear' },
    ...months.map((m) => ({ label: m.label, value: m.value })),
  ];

  const {
    publisherGroup,
    period,
    handlePublisherGroupChange,
    handlePeriodChange,
  } = useYearDetails(year, periodOptions[0]);

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
            <MenuItem value="all">
              <Typography className="body-regular">
                {t('tr_allPublishers')}
              </Typography>
            </MenuItem>
            {!!(groups_list?.length) && (
              <>
                <MenuSubHeader>{t('tr_fieldServiceGroups')}</MenuSubHeader>
                {(groups_list ?? []).map((g, idx) => (
                  <MenuItem key={g.group_id} value={g.group_id}>
                    <Typography className="body-regular">
                      {g.group_data?.name?.length
                        ? g.group_data.name
                        : t('tr_groupNumber', {
                            groupNumber: (g.group_data?.sort_index ?? idx) + 1,
                          })}
                    </Typography>
                  </MenuItem>
                ))}
              </>
            )}
          </Select>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Select
            label={t('tr_period')}
            value={period.value}
            onChange={(e) =>
              handlePeriodChange(
                periodOptions.find((o) => o.value === e.target.value) as PeriodOption
              )
            }
            sx={{ minWidth: 180 }}
            renderValue={(selected) => {
              const found = periodOptions.find((o) => o.value === selected);
              return found ? found.label : '';
            }}
          >
            <MenuItem value="serviceYear">
              <Typography className="body-regular">
                {t('tr_serviceYear')}
              </Typography>
            </MenuItem>
            <MenuSubHeader>{t('tr_months')}</MenuSubHeader>
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                <Typography className="body-regular">{m.label}</Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
      <FulltimeServants
        year={year}
        period={period.value}
        publisherGroup={publisherGroup}
      />
      <AuxiliaryPioneers
        year={year}
        period={period.value}
        publisherGroup={publisherGroup}
      />
      <Publishers
        year={year}
        period={period.value}
        publisherGroup={publisherGroup}
      />
      <TotalStatistics
        year={year}
        period={period}
        publisherGroup={publisherGroup}
      />
    </Stack>
  );
};

export default YearDetails;
