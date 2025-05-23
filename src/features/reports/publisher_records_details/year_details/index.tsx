import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { YearDetailsProps } from './index.types';
import useYearDetails from './useYearDetails';
import Divider from '@components/divider';
import MonthItem from '../month_item';
import Typography from '@components/typography';

const YearDetails = ({ year }: YearDetailsProps) => {
  const { t } = useAppTranslation();

  const { laptopDown } = useBreakpoints();

  const { months, person, show_hours_total, credit_hours, field_hours } =
    useYearDetails(year);

  return (
    <Stack spacing="16px" marginBottom="-24px">
      {months.length > 0 && (
        <Stack spacing="8px" divider={<Divider color="var(--accent-200)" />}>
          {months.map((record) => (
            <MonthItem
              key={record.value}
              person={person}
              month={record.value}
            />
          ))}
        </Stack>
      )}

      {show_hours_total && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: laptopDown ? 'column' : 'row',
            alignItems: laptopDown ? 'flex-start' : 'center',
            gap: laptopDown ? '8px' : '16px',
            justifyContent: 'space-between',
            padding: '8px',
            borderRadius: 'var(--radius-m)',
            backgroundColor: 'var(--accent-100)',
          }}
        >
          <Typography className="h3" color="var(--accent-dark)">
            {t('tr_total')}
          </Typography>

          <Stack spacing="8px" direction="row">
            <Typography
              className="body-small-semibold"
              color="var(--accent-dark)"
              sx={{
                backgroundColor: 'var(--accent-200)',
                borderRadius: 'var(--radius-s)',
                padding: '4px 8px',
              }}
            >
              {t('tr_hoursList', { Hours: field_hours })}
            </Typography>

            {credit_hours > 0 && (
              <Typography
                className="body-small-semibold"
                color="var(--accent-dark)"
                sx={{
                  backgroundColor: 'var(--accent-200)',
                  borderRadius: 'var(--radius-s)',
                  padding: '4px 8px',
                }}
              >
                {`${t('tr_credit')}: ${credit_hours}`}
              </Typography>
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default YearDetails;
